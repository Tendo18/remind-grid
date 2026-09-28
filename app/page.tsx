import type { Metadata } from "next"
import Link from "next/link"
import { LayoutDashboard, Bell, PieChart } from "lucide-react"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "RemindGrid — Stay ahead of every renewal",
}

const FEATURES = [
  {
    icon: PieChart,
    title: "See where your money goes",
    description:
      "Every subscription in one dashboard, with monthly and yearly totals broken down by category.",
  },
  {
    icon: Bell,
    title: "Never get surprised again",
    description:
      "Get an email reminder before a renewal charges, so you can cancel or budget for it ahead of time.",
  },
  {
    icon: LayoutDashboard,
    title: "One place, not ten emails",
    description:
      "Stop hunting through your inbox to remember what you're paying for. Add it once, track it forever.",
  },
]

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-accent to-transparent"
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Logo href="/" />
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Log in
        </Link>
      </header>

      <section className="relative z-10 flex flex-col items-center px-4 pb-16 pt-10 text-center sm:pt-16">
        <h1 className="text-pretty text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Stay ahead of every renewal
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          RemindGrid tracks every subscription you're paying for, shows you
          what it's really costing you, and reminds you before you're charged
          again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className={cn(buttonVariants(), "px-8")}>
            Get started
          </Link>
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "outline" }), "px-8")}
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid w-full max-w-5xl gap-5 px-4 pb-20 sm:grid-cols-3 sm:px-10">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="border-border/70">
            <CardContent className="pt-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
                <feature.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <footer className="relative z-10 border-t border-border px-4 py-8 text-center text-xs text-muted-foreground sm:px-10">
        © {new Date().getFullYear()} RemindGrid. Built to help you stop paying
        for things you forgot about.
      </footer>
    </main>
  )
}