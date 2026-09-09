"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import {
  type Subscription,
  apiToSubscription,
  subscriptionToApiPayload,
} from "@/lib/subscriptions"
import { api } from "@/lib/api"

type SubscriptionInput = Omit<Subscription, "id">

interface SubscriptionsContextValue {
  subscriptions: Subscription[]
  loading: boolean
  error: string | null
  addSubscription: (input: SubscriptionInput) => Promise<void>
  updateSubscription: (id: string, input: SubscriptionInput) => Promise<void>
  deleteSubscription: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

const SubscriptionsContext = createContext<SubscriptionsContextValue | null>(null)

export function SubscriptionsProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.get<Parameters<typeof apiToSubscription>[0][]>("/api/subscriptions/")
      setSubscriptions(data.map(apiToSubscription))
    } catch {
      setError("Could not load your subscriptions. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addSubscription = useCallback(async (input: SubscriptionInput) => {
    const created = await api.authPost<Parameters<typeof apiToSubscription>[0]>(
      "/api/subscriptions/",
      subscriptionToApiPayload(input),
    )
    setSubscriptions((prev) => [...prev, apiToSubscription(created)])
  }, [])

  const updateSubscription = useCallback(async (id: string, input: SubscriptionInput) => {
    const updated = await api.patch<Parameters<typeof apiToSubscription>[0]>(
      `/api/subscriptions/${id}/`,
      subscriptionToApiPayload(input),
    )
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? apiToSubscription(updated) : s)))
  }, [])

  const deleteSubscription = useCallback(async (id: string) => {
    await api.delete(`/api/subscriptions/${id}/`)
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const value = useMemo(
    () => ({
      subscriptions,
      loading,
      error,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      refresh,
    }),
    [subscriptions, loading, error, addSubscription, updateSubscription, deleteSubscription, refresh],
  )

  return (
    <SubscriptionsContext.Provider value={value}>{children}</SubscriptionsContext.Provider>
  )
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionsContext)
  if (!ctx) {
    throw new Error("useSubscriptions must be used within a SubscriptionsProvider")
  }
  return ctx
}