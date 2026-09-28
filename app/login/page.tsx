import type { Metadata } from "next"
import { AuthCard } from "@/components/auth-card"
import { Logo } from "@/components/logo"

export const metadata: Metadata = {
  title: "Sign in — RemindGrid",
}

export default function AuthPage() {
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
          <div className="mb-8 text-center">
            <h1 className="text-pretty text-3xl font-semibold tracking-tight text-foreground">
              Stay ahead of every renewal
            </h1>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              Track subscriptions, monitor spend, and get reminded before you
              are charged again.
            </p>
          </div>
          <AuthCard />
          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  )
}