import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  emphasis = false,
}: {
  label: string
  value: string
  hint?: string
  icon: React.ComponentType<{ className?: string }>
  emphasis?: boolean
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden",
        emphasis && "border-primary/30 bg-primary text-primary-foreground",
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 py-6">
        <div className="space-y-2">
          <p
            className={cn(
              "text-sm font-medium",
              emphasis ? "text-primary-foreground/80" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          {hint && (
            <p
              className={cn(
                "text-xs",
                emphasis ? "text-primary-foreground/70" : "text-muted-foreground",
              )}
            >
              {hint}
            </p>
          )}
        </div>
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            emphasis
              ? "bg-primary-foreground/15 text-primary-foreground"
              : "bg-accent text-accent-foreground",
          )}
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}
