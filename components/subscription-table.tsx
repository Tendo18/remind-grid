import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SubscriptionAvatar } from "@/components/subscription-avatar"
import { RenewalBadge } from "@/components/renewal-badge"
import { SubscriptionActions } from "@/components/subscription-actions"
import { formatCurrency, type Subscription } from "@/lib/subscriptions"

const CYCLE_LABEL: Record<Subscription["billingCycle"], string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
}

export function SubscriptionTable({ subscriptions }: { subscriptions: Subscription[] }) {
  return (
    <Card className="overflow-hidden py-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="pl-6">Name</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Billing cycle</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Next renewal</TableHead>
            <TableHead className="pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.id}>
              <TableCell className="pl-6">
                <div className="flex items-center gap-3">
                  <SubscriptionAvatar name={sub.name} />
                  <span className="font-medium text-foreground">{sub.name}</span>
                </div>
              </TableCell>
              <TableCell className="tabular-nums text-foreground">
                {formatCurrency(sub.cost, sub.currency)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {CYCLE_LABEL[sub.billingCycle]}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {sub.category}
                </Badge>
              </TableCell>
              <TableCell>
                <RenewalBadge dateISO={sub.nextRenewal} />
              </TableCell>
              <TableCell className="pr-6 text-right">
                <div className="flex justify-end">
                  <SubscriptionActions subscription={sub} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
