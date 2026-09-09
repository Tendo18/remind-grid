export type BillingCycle = "weekly" | "monthly" | "yearly"

export type Currency = "NGN" | "USD" | "EUR" | "GBP"

export type Category =
  | "entertainment"
  | "education"
  | "productivity"
  | "health"
  | "finance"
  | "social"
  | "shopping"
  | "news"
  | "travel"
  | "software"
  | "fitness"
  | "utilities"
  | "other"

export interface Subscription {
  id: string
  name: string
  cost: number
  currency: Currency
  billingCycle: BillingCycle
  category: Category
  nextRenewal: string // ISO date (yyyy-mm-dd)
  description?: string
}

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "entertainment", label: "Entertainment" },
  { value: "education", label: "Education" },
  { value: "productivity", label: "Productivity" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "social", label: "Social" },
  { value: "shopping", label: "Shopping" },
  { value: "news", label: "News" },
  { value: "travel", label: "Travel" },
  { value: "software", label: "Software" },
  { value: "fitness", label: "Fitness" },
  { value: "utilities", label: "Utilities" },
  { value: "other", label: "Other" },
]

export const CATEGORIES: Category[] = CATEGORY_OPTIONS.map((c) => c.value)

export const CATEGORY_LABEL: Record<Category, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((c) => [c.value, c.label]),
) as Record<Category, string>

export const BILLING_CYCLES: BillingCycle[] = ["weekly", "monthly", "yearly"]

export const CURRENCIES: Currency[] = ["NGN", "USD", "EUR", "GBP"]

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  EUR: "€",
  GBP: "£",
}

export function formatCurrency(amount: number, currency: Currency = "NGN") {
  const symbol = CURRENCY_SYMBOL[currency]
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`
}

export function monthlyCost(sub: Pick<Subscription, "cost" | "billingCycle">) {
  switch (sub.billingCycle) {
    case "weekly":
      return (sub.cost * 52) / 12
    case "yearly":
      return sub.cost / 12
    default:
      return sub.cost
  }
}

export function yearlyCost(sub: Pick<Subscription, "cost" | "billingCycle">) {
  return monthlyCost(sub) * 12
}

export function totalMonthly(subs: Subscription[]) {
  return subs.reduce((sum, s) => sum + monthlyCost(s), 0)
}

export function totalYearly(subs: Subscription[]) {
  return subs.reduce((sum, s) => sum + yearlyCost(s), 0)
}

export function spendByCategory(subs: Subscription[]) {
  const map = new Map<Category, number>()
  for (const s of subs) {
    map.set(s.category, (map.get(s.category) ?? 0) + monthlyCost(s))
  }
  return Array.from(map.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function daysUntil(dateISO: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateISO + "T00:00:00")
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
}

export function formatDate(dateISO: string) {
  return new Date(dateISO + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function upcomingRenewals(subs: Subscription[]) {
  return [...subs].sort((a, b) => daysUntil(a.nextRenewal) - daysUntil(b.nextRenewal))
}

interface ApiSubscription {
  id: number
  name: string
  cost: string
  currency: Currency
  category: Category
  billing_cycle: BillingCycle
  next_renewal_date: string
  is_active: boolean
  description?: string | null
}

export function apiToSubscription(api: ApiSubscription): Subscription {
  return {
    id: String(api.id),
    name: api.name,
    cost: Number(api.cost),
    currency: api.currency,
    category: api.category,
    billingCycle: api.billing_cycle,
    nextRenewal: api.next_renewal_date,
    description: api.description ?? "",
  }
}

export function subscriptionToApiPayload(input: Omit<Subscription, "id">) {
  return {
    name: input.name,
    cost: input.cost.toFixed(2),
    currency: input.currency,
    category: input.category,
    billing_cycle: input.billingCycle,
    next_renewal_date: input.nextRenewal,
    description: input.description ?? "",
    is_active: true,
  }
}