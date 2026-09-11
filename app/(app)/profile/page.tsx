"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface Profile {
  email: string
  display_name: string | null
  is_verified: boolean
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api
      .get<Profile>("/api/profile/")
      .then((data) => {
        setProfile(data)
        setName(data.display_name ?? "")
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await api.put<Profile>("/api/profile/", {
        display_name: name.trim() || null,
      })
      setProfile(updated)
      toast.success("Profile updated")
    } catch {
      toast.error("Could not update profile. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10 sm:py-16">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage how your name appears across RemindGrid.
      </p>

      <Card className="mt-6 border-border/70 shadow-lg shadow-foreground/5">
        <CardContent className="pt-6">
          <form onSubmit={handleSave}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" value={profile?.email ?? ""} disabled />
              </Field>

              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </Field>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}