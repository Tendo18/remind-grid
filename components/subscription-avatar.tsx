import { cn } from "@/lib/utils"

// Deterministic warm-toned tint per name so icons stay on-brand.
const TINTS = [
  "bg-primary/10 text-primary",
  "bg-amber-500/10 text-amber-600",
  "bg-orange-500/10 text-orange-600",
  "bg-rose-500/10 text-rose-600",
  "bg-yellow-500/10 text-yellow-700",
]

function tintFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return TINTS[Math.abs(hash) % TINTS.length]
}

export function SubscriptionAvatar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
        tintFor(name),
        className,
      )}
      aria-hidden="true"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}
