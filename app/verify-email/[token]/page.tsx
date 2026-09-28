import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, CircleAlert } from "lucide-react"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Verify email — RemindGrid",
}

export const dynamic = "force-dynamic"

function firstQueryValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]
  return value
}

export default async function VerifyEmailPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ email?: string | string[] }>
}) {
  const { token } = await params
  const email = firstQueryValue((await searchParams).email)?.trim()

  let verified = false
  if (email) {
    try {
      await auth.verifyEmail(email, token)
      verified = true
    } catch {
      verified = false
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent to-transparent"
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Logo />
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <Card className="border-border/70 shadow-lg shadow-foreground/5">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {verified ? (
                  <>
                    <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                      <CheckCircle2 className="size-6" />
                    </span>
                    <h1 className="mt-4 text-pretty text-xl font-semibold tracking-tight text-foreground">
                      Email verified — you can now log in
                    </h1>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                      Your account is ready. Sign in to start tracking
                      subscriptions.
                    </p>
                  </>
                ) : (
                  <>
                    <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <CircleAlert className="size-6" />
                    </span>
                    <h1 className="mt-4 text-pretty text-xl font-semibold tracking-tight text-foreground">
                      This link has expired or is invalid
                    </h1>
                    <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                      Request a new verification email from the sign-in page and
                      try again.
                    </p>
                  </>
                )}

                <Link
                  href="/login"
                  className={cn(buttonVariants(), "mt-6 w-full")}
                >
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
