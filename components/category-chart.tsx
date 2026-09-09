"use client"

import { useMemo } from "react"
import { Cell, Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatCurrency, spendByCategory, type Subscription } from "@/lib/subscriptions"

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function CategoryChart({ subscriptions }: { subscriptions: Subscription[] }) {
  const data = useMemo(
    () =>
      spendByCategory(subscriptions).map((d, i) => ({
        ...d,
        amount: Math.round(d.amount * 100) / 100,
        fill: PALETTE[i % PALETTE.length],
      })),
    [subscriptions],
  )

  const total = useMemo(() => data.reduce((s, d) => s + d.amount, 0), [data])

  const config = useMemo(() => {
    const c: ChartConfig = { amount: { label: "Monthly" } }
    data.forEach((d, i) => {
      c[d.category] = { label: d.category, color: PALETTE[i % PALETTE.length] }
    })
    return c
  }, [data])

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Spend by category</CardTitle>
        <CardDescription>Normalized to monthly cost</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-center">
        <ChartContainer config={config} className="mx-auto aspect-square h-[220px] w-full max-w-[220px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-medium tabular-nums text-foreground">
                        {formatCurrency(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={62}
              outerRadius={92}
              strokeWidth={3}
              paddingAngle={2}
            >
              {data.map((d) => (
                <Cell key={d.category} fill={d.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) - 6}
                        className="fill-foreground text-xl font-semibold tabular-nums"
                      >
                        {formatCurrency(total)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 14}
                        className="fill-muted-foreground text-xs"
                      >
                        per month
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <ul className="flex flex-1 flex-col gap-2.5">
          {data.map((d) => (
            <li key={d.category} className="flex items-center gap-3 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.fill }}
                aria-hidden="true"
              />
              <span className="flex-1 text-foreground">{d.category}</span>
              <span className="font-medium tabular-nums text-muted-foreground">
                {formatCurrency(d.amount)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
