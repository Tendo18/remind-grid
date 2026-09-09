"use client"

import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SubscriptionForm } from "@/components/subscription-form"
import { useSubscriptions } from "@/components/subscriptions-provider"
import type { Subscription } from "@/lib/subscriptions"

export function SubscriptionActions({ subscription }: { subscription: Subscription }) {
  const { deleteSubscription } = useSubscriptions()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleDelete() {
    deleteSubscription(subscription.id)
    toast.success(`${subscription.name} removed`)
    setConfirmOpen(false)
  }

  return (
    <div className="flex items-center gap-1">
      <SubscriptionForm
        subscription={subscription}
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label={`Edit ${subscription.name}`}>
            <Pencil />
          </Button>
        }
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete ${subscription.name}`}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 />
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete subscription</DialogTitle>
            <DialogDescription>
              Remove {subscription.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
