import { AppShell } from "@/components/app-shell"
import { SubscriptionsProvider } from "@/components/subscriptions-provider"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SubscriptionsProvider>
      <AppShell>{children}</AppShell>
    </SubscriptionsProvider>
  )
}
