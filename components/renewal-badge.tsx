import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { daysUntil, formatDate } from "@/lib/subscriptions"

export function renewalLabel(dateISO: string) {
  const d = daysUntil(dateISO)
  if (d < 0) return `${Math.abs(d)}d overdue`
  if (d === 0) return "Today"
  if (d === 1) return "Tomorrow"
  if (d <= 30) return `In ${d} days`
  return formatDate(dateISO)
}

export function RenewalBadge({ dateISO }: { dateISO: string }) {
  const d = daysUntil(dateISO)
  const urgent = d <= 3
  const soon = d > 3 && d <= 7

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium tabular-nums",
        urgent && "border-primary/30 bg-primary/10 text-primary",
        soon && "border-amber-500/30 bg-amber-500/10 text-amber-600",
        !urgent && !soon && "text-muted-foreground",
      )}
    >
      {renewalLabel(dateISO)}
    </Badge>
  )
}
