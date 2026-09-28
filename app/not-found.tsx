import Link from "next/link"
import { Compass } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent to-transparent"
      />

      <header className="relative z-10 flex items-center px-6 py-5 sm:px-10">
        <Logo href="/" />
      </header>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          <Card className="border-border/70 shadow-lg shadow-foreground/5">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
                  <Compass className="size-6" />
                </span>
                <h1 className="mt-4 text-pretty text-xl font-semibold tracking-tight text-foreground">
                  Page not found
                </h1>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  The page you're looking for doesn't exist or may have been moved.
                </p>

                <Button className="mt-6 w-full" render={<Link href="/">Back to home</Link>} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}