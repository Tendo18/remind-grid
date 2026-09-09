"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useSubscriptions } from "@/components/subscriptions-provider"
import {
  BILLING_CYCLES,
  CATEGORY_OPTIONS,
  CURRENCIES,
  type BillingCycle,
  type Category,
  type Currency,
  type Subscription,
} from "@/lib/subscriptions"

interface FormState {
  name: string
  cost: string
  currency: Currency
  billingCycle: BillingCycle
  category: Category
  nextRenewal: string
}

function initialState(sub?: Subscription): FormState {
  return {
    name: sub?.name ?? "",
    cost: sub ? String(sub.cost) : "",
    currency: sub?.currency ?? "NGN",
    billingCycle: sub?.billingCycle ?? "monthly",
    category: sub?.category ?? "entertainment",
    nextRenewal: sub?.nextRenewal ?? new Date().toISOString().slice(0, 10),
  }
}

const CYCLE_LABEL: Record<BillingCycle, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
}

export function SubscriptionForm({
  subscription,
  trigger,
}: {
  subscription?: Subscription
  trigger: React.ReactNode
}) {
  const { addSubscription, updateSubscription } = useSubscriptions()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(() => initialState(subscription))
  const isEdit = Boolean(subscription)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleOpenChange(next: boolean) {
    if (next) setForm(initialState(subscription))
    setOpen(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const cost = Number.parseFloat(form.cost)
    if (!form.name.trim() || Number.isNaN(cost) || cost < 0) {
      toast.error("Please enter a valid name and cost.")
      return
    }
    const payload = {
      name: form.name.trim(),
      cost: Math.round(cost * 100) / 100,
      currency: form.currency,
      billingCycle: form.billingCycle,
      category: form.category,
      nextRenewal: form.nextRenewal,
    }
    try {
      if (isEdit && subscription) {
        await updateSubscription(subscription.id, payload)
        toast.success(`${payload.name} updated`)
      } else {
        await addSubscription(payload)
        toast.success(`${payload.name} added`)
      }
      setOpen(false)
    } catch {
      toast.error("Som  ething went wrong. Please try again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit subscription" : "Add subscription"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this subscription."
              : "Track a new recurring payment and its next renewal."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="subscription-form">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g. Netflix"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_auto]">
              <Field>
                <FieldLabel htmlFor="cost">Cost</FieldLabel>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={form.cost}
                  onChange={(e) => set("cost", e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Currency</FieldLabel>
                <Select
                  value={form.currency}
                  onValueChange={(v) => set("currency", v as Currency)}
                >
                  <SelectTrigger className="h-9 w-full sm:w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel>Billing cycle</FieldLabel>
                <Select
                  value={form.billingCycle}
                  onValueChange={(v) => set("billingCycle", v as BillingCycle)}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {BILLING_CYCLES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {CYCLE_LABEL[c]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Category</FieldLabel>
                <Select
                  value={form.category}
                  onValueChange={(v) => set("category", v as Category)}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="nextRenewal">Next renewal date</FieldLabel>
              <Input
                id="nextRenewal"
                type="date"
                value={form.nextRenewal}
                onChange={(e) => set("nextRenewal", e.target.value)}
                required
              />
            </Field>
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button type="submit" form="subscription-form" className="w-full sm:w-auto">
            {isEdit ? "Save changes" : "Add subscription"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}