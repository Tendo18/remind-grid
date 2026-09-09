import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SubscriptionAvatar } from "@/components/subscription-avatar"
import { RenewalBadge } from "@/components/renewal-badge"
import {
  formatCurrency,
  upcomingRenewals,
  type Subscription,
} from "@/lib/subscriptions"

const CYCLE_SHORT: Record<Subscription["billingCycle"], string> = {
  weekly: "/wk",
  monthly: "/mo",
  yearly: "/yr",
}

export function UpcomingRenewals({
  subscriptions,
  limit = 5,
}: {
  subscriptions: Subscription[]
  limit?: number
}) {
  const items = upcomingRenewals(subscriptions).slice(0, limit)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming renewals</CardTitle>
        <CardDescription>Sorted by soonest first</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No subscriptions yet.
          </p>
        ) : (
          <ul className="flex flex-col">
            {items.map((sub, i) => (
              <li
                key={sub.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 data-[not-first=true]:border-t data-[not-first=true]:border-border"
                data-not-first={i > 0}
              >
                <SubscriptionAvatar name={sub.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {sub.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {sub.category}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {formatCurrency(sub.cost, sub.currency)}
                    <span className="text-xs font-normal text-muted-foreground">
                      {CYCLE_SHORT[sub.billingCycle]}
                    </span>
                  </span>
                  <RenewalBadge dateISO={sub.nextRenewal} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
