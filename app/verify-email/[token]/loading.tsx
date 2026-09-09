import { Loader2 } from "lucide-react"
import { Logo } from "@/components/logo"
import { Card, CardContent } from "@/components/ui/card"

export default function VerifyEmailLoading() {
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
                <Loader2 className="size-6 animate-spin text-primary" />
                <h1 className="mt-4 text-pretty text-xl font-semibold tracking-tight text-foreground">
                  Verifying your email
                </h1>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  Please wait a moment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
