"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { auth } from "@/lib/auth"
import { ApiError } from "@/lib/api"

type Mode = "login" | "signup"

export function AuthCard() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkEmailMessage, setCheckEmailMessage] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const password2 = String(formData.get("password2") ?? "")
    const display_name = String(formData.get("display_name") ?? "").trim() || undefined

    try {
      if (mode === "login") {
        await auth.login(email, password)
        router.push("/dashboard")
      } else {
        await auth.register(email, password, password2, display_name)
        setCheckEmailMessage(true)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body
        let message = mode === "login" ? "Invalid email or password" : "Registration failed"

        if (typeof body === "object" && body !== null) {
          const fieldErrors = body as Record<string, string[] | string>
          const firstKey = Object.keys(fieldErrors)[0]
          if (firstKey) {
            const value = fieldErrors[firstKey]
            message = Array.isArray(value) ? value[0] : String(value)
          }
        }
        setError(message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (checkEmailMessage) {
    return (
      <Card className="border-border/70 shadow-lg shadow-foreground/5">
        <CardContent className="pt-6 text-center">
          <h2 className="text-lg font-semibold text-foreground">Check your email</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We've sent a verification link to your email. Click it to activate your
            account, then come back and log in.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            onClick={() => {
              setCheckEmailMessage(false)
              setMode("login")
            }}
          >
            Back to log in
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/70 shadow-lg shadow-foreground/5">
      <CardContent className="pt-6">
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setError(null)
              }}
              className={cn(
                "rounded-lg py-2 text-sm font-medium transition-colors",
                mode === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>
            {mode === "signup" && (
              <Field>
                <FieldLabel htmlFor="display_name">Display name</FieldLabel>
                <Input
                  id="display_name"
                  name="display_name"
                  placeholder="John Doe"
                  autoComplete="name"
                />
              </Field>
            )}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => router.push("/reset-password")}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>

            {mode === "signup" && (
              <Field>
                <FieldLabel htmlFor="password2">Confirm password</FieldLabel>
                <Input
                  id="password2"
                  name="password2"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </Field>
            )}

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" data-icon="inline-start" />}
              {mode === "login" ? "Log in" : "Create account"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}