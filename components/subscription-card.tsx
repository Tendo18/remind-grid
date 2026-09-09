import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SubscriptionAvatar } from "@/components/subscription-avatar"
import { RenewalBadge } from "@/components/renewal-badge"
import { SubscriptionActions } from "@/components/subscription-actions"
import { formatCurrency, type Subscription } from "@/lib/subscriptions"

const CYCLE_SHORT: Record<Subscription["billingCycle"], string> = {
  weekly: "/wk",
  monthly: "/mo",
  yearly: "/yr",
}

export function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 py-4">
        <div className="flex items-start gap-3">
          <SubscriptionAvatar name={subscription.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">{subscription.name}</p>
            <Badge variant="secondary" className="mt-1 font-normal">
              {subscription.category}
            </Badge>
          </div>
          <div className="text-right">
            <p className="font-semibold tabular-nums text-foreground">
              {formatCurrency(subscription.cost, subscription.currency)}
              <span className="text-xs font-normal text-muted-foreground">
                {CYCLE_SHORT[subscription.billingCycle]}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <RenewalBadge dateISO={subscription.nextRenewal} />
          <SubscriptionActions subscription={subscription} />
        </div>
      </CardContent>
    </Card>
  )
}
