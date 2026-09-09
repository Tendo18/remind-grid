"use client"

import { Plus, CalendarClock, Wallet, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { CategoryChart } from "@/components/category-chart"
import { UpcomingRenewals } from "@/components/upcoming-renewals"
import { SubscriptionForm } from "@/components/subscription-form"
import { useSubscriptions } from "@/components/subscriptions-provider"
import { formatCurrency, totalMonthly, totalYearly } from "@/lib/subscriptions"

export default function DashboardPage() {
  const { subscriptions } = useSubscriptions()

  const monthly = totalMonthly(subscriptions)
  const yearly = totalYearly(subscriptions)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        title="Dashboard"
        description="A clear view of what you spend on subscriptions and what renews next."
        action={
          <SubscriptionForm
            trigger={
              <Button>
                <Plus data-icon="inline-start" />
                Add subscription
              </Button>
            }
          />
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Monthly spend"
          value={formatCurrency(monthly)}
          hint="Across all active subscriptions"
          icon={Wallet}
          emphasis
        />
        <StatCard
          label="Yearly spend"
          value={formatCurrency(yearly)}
          hint="Projected over 12 months"
          icon={CalendarClock}
        />
        <StatCard
          label="Active subscriptions"
          value={String(subscriptions.length)}
          hint="Being tracked right now"
          icon={Layers}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CategoryChart subscriptions={subscriptions} />
        </div>
        <div className="lg:col-span-2">
          <UpcomingRenewals subscriptions={subscriptions} />
        </div>
      </div>
    </div>
  )
}
