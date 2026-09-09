"use client"

import { useMemo, useState } from "react"
import { Plus, PackageOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PageHeader } from "@/components/page-header"
import { SubscriptionForm } from "@/components/subscription-form"
import { SubscriptionTable } from "@/components/subscription-table"
import { SubscriptionCard } from "@/components/subscription-card"
import { useSubscriptions } from "@/components/subscriptions-provider"
import {
  CATEGORIES,
  formatCurrency,
  totalMonthly,
  upcomingRenewals,
} from "@/lib/subscriptions"

export default function SubscriptionsPage() {
  const { subscriptions } = useSubscriptions()
  const [category, setCategory] = useState<string>("all")

  const filtered = useMemo(() => {
    const list =
      category === "all"
        ? subscriptions
        : subscriptions.filter((s) => s.category === category)
    return upcomingRenewals(list)
  }, [subscriptions, category])

  const monthly = totalMonthly(filtered)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        title="Subscriptions"
        description={`${filtered.length} active · ${formatCurrency(monthly)} per month`}
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

      <div className="mt-6 flex items-center justify-between gap-3">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-9 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="mt-4">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <PackageOpen className="size-6" />
            </span>
            <div className="space-y-1">
              <p className="font-medium text-foreground">No subscriptions here</p>
              <p className="text-sm text-muted-foreground">
                Try a different category or add a new subscription.
              </p>
            </div>
            <SubscriptionForm
              trigger={
                <Button variant="outline">
                  <Plus data-icon="inline-start" />
                  Add subscription
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-4 hidden md:block">
            <SubscriptionTable subscriptions={filtered} />
          </div>
          {/* Mobile cards */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:hidden">
            {filtered.map((sub) => (
              <SubscriptionCard key={sub.id} subscription={sub} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
