"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { auth } from "@/lib/auth"
import { ApiError } from "@/lib/api"

type Step = "request" | "confirm" | "done"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("request")
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function extractError(err: unknown, fallback: string): string {
    if (err instanceof ApiError && typeof err.body === "object" && err.body !== null) {
      const fieldErrors = err.body as Record<string, string[] | string>
      const firstKey = Object.keys(fieldErrors)[0]
      if (firstKey) {
        const value = fieldErrors[firstKey]
        return Array.isArray(value) ? value[0] : String(value)
      }
    }
    return fallback
  }

  async function handleRequestOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const emailValue = String(formData.get("email") ?? "")

    try {
      await auth.requestPasswordReset(emailValue)
      setEmail(emailValue)
      setStep("confirm")
    } catch (err) {
      setError(extractError(err, "Could not send reset code. Please try again."))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleConfirmReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const otp = String(formData.get("otp") ?? "")
    const newPassword = String(formData.get("new_password") ?? "")

    try {
      await auth.confirmPasswordReset(email, otp, newPassword)
      setStep("done")
    } catch (err) {
      setError(extractError(err, "Invalid or expired code. Please try again."))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent to-transparent"
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Logo href="/" />
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <Card className="border-border/70 shadow-lg shadow-foreground/5">
            <CardContent className="pt-6">
              {step === "request" && (
                <>
                  <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    Reset your password
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Enter your email and we'll send you a code to reset your password.
                  </p>
                  <form onSubmit={handleRequestOtp} className="mt-6">
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
                      {error && (
                        <p className="text-sm text-destructive" role="alert">
                          {error}
                        </p>
                      )}
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting && (
                          <Loader2 className="animate-spin" data-icon="inline-start" />
                        )}
                        Send reset code
                      </Button>
                    </FieldGroup>
                  </form>
                </>
              )}

              {step === "confirm" && (
                <>
                  <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    Enter your code
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    We sent a code to {email}. Enter it below along with your new password.
                  </p>
                  <form onSubmit={handleConfirmReset} className="mt-6">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="otp">Reset code</FieldLabel>
                        <Input
                          id="otp"
                          name="otp"
                          placeholder="123456"
                          inputMode="numeric"
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="new_password">New password</FieldLabel>
                        <Input
                          id="new_password"
                          name="new_password"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          required
                        />
                      </Field>
                      {error && (
                        <p className="text-sm text-destructive" role="alert">
                          {error}
                        </p>
                      )}
                      <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting && (
                          <Loader2 className="animate-spin" data-icon="inline-start" />
                        )}
                        Reset password
                      </Button>
                    </FieldGroup>
                  </form>
                </>
              )}

              {step === "done" && (
                <div className="text-center">
                  <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    Password reset
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Your password has been changed. You can now log in with your new password.
                  </p>
                  <Button className="mt-6 w-full" onClick={() => router.push("/")}>
                    Back to log in
                  </Button>
                </div>
              )}

              {step !== "done" && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Remembered your password?{" "}
                  <Link href="/" className="font-medium text-primary hover:underline">
                    Log in
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}