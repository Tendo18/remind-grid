import Link from "next/link"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  showWordmark = true,
  href = "/dashboard",
}: {
  className?: string
  showWordmark?: boolean
  href?: string | null
}) {
  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <GridMark />
      </span>
      {showWordmark && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Remind<span className="text-primary">Grid</span>
        </span>
      )}
    </div>
  )

  if (href === null) return content

  return (
    <Link href={href} className="transition-opacity hover:opacity-80">
      {content}
    </Link>
  )
}

function GridMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="6.5" height="6.5" rx="2" fill="currentColor" />
      <rect x="10.5" y="1" width="6.5" height="6.5" rx="2" fill="currentColor" opacity="0.6" />
      <rect x="1" y="10.5" width="6.5" height="6.5" rx="2" fill="currentColor" opacity="0.6" />
      <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="2" fill="currentColor" />
    </svg>
  )
}