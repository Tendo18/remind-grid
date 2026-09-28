"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, CreditCard, LogOut, Bell } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { auth } from "@/lib/auth"


const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
]

interface Profile {
  email: string
  display_name: string | null
  is_verified: boolean
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    api
      .get<Profile>("/api/profile/")
      .then(setProfile)
      .catch(() => {
        // token invalid/expired and refresh failed — bounce to login
        router.push("/login")
      })
  }, [router])

  async function handleLogout() {
    await auth.logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
        <div className="flex h-16 items-center px-6">
          <Logo />
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAV.map((item) => (
            <NavLink key={item.href} {...item} active={pathname === item.href} />
          ))}
        </nav>
        <UserPanel profile={profile} onLogout={handleLogout} />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-sidebar/95 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <div className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex size-9 items-center justify-center rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              aria-label={item.label}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              <item.icon className="size-5" />
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  )
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  )
}

function getInitials(profile: Profile | null): string {
  if (!profile) return "…"
  const source = profile.display_name?.trim() || profile.email
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

function UserPanel({
  profile,
  onLogout,
}: {
  profile: Profile | null
  onLogout: () => void
}) {
  const displayName = profile?.display_name?.trim() || profile?.email || "…"
  const email = profile?.email ?? ""

  return (
    <div className="border-t border-border p-3">
      <div className="mb-2 flex items-center gap-3 rounded-lg px-2 py-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {getInitials(profile)}
        </span>
        <Link href="/profile" className="min-w-0 flex-1 hover:opacity-80">
          <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </Link>
        <Bell className="size-4 text-muted-foreground" />
      </div>
      <Button
        type="button"
        variant="ghost"
        onClick={onLogout}
        className="w-full justify-start text-muted-foreground hover:text-foreground"
      >
        <LogOut data-icon="inline-start" />
        Log out
      </Button>
    </div>
  )
}