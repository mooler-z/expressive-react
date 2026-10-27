"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import { ChartContainer, ChartTooltip, ChartTooltipContent, chartAxisProps, chartGridProps, type ChartConfig } from "@/components/ui/chart"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/*
 * Chart card 02 · Stacked or grouped
 * Store revenue by category over four months, with a summary column. The segmented control toggles stacking.
 */

const CATEGORIES = [
  { key: "pass", label: "Battle pass", color: "primary", dot: "bg-primary", october: "$1.66M", data: [1.42, 1.38, 1.51, 1.66] },
  { key: "cosmetics", label: "Cosmetics", color: "tertiary", dot: "bg-tertiary", october: "$1.37M", data: [1.1, 1.24, 1.18, 1.37] },
  { key: "currency", label: "Currency packs", color: "primary-fixed-dim", dot: "bg-primary-fixed-dim", october: "$1.02M", data: [0.86, 0.91, 0.88, 1.02] },
  { key: "bundles", label: "Bundles", color: "secondary", dot: "bg-secondary", october: "$0.61M", data: [0.41, 0.52, 0.47, 0.61] },
]

const MONTHS = ["Jul", "Aug", "Sep", "Oct"]
const DATA = MONTHS.map((month, i) => ({ month, ...Object.fromEntries(CATEGORIES.map((c) => [c.key, c.data[i]])) }))
const config = Object.fromEntries(CATEGORIES.map((c) => [c.key, { label: c.label, color: c.color }])) satisfies ChartConfig

export function ChartCard2({ className }: { className?: string }) {
  const [stacked, setStacked] = React.useState(true)

  return (
    <div className={cn("grid gap-6 bg-surface p-4 md:p-6 lg:grid-cols-[240px_minmax(0,1fr)]", className)}>
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-body-md text-on-surface-variant">Store revenue · October</div>
          <div className="mt-1 text-display-sm font-semibold tabular-nums">$4.66M</div>
          <div className="mt-1 inline-flex items-center gap-1 text-label-lg text-primary">
            <Icon size={18}>trending_up</Icon>+15.3% vs September
          </div>
        </div>
        <ul className="space-y-2 border-t border-outline-variant pt-4">
          {CATEGORIES.map((c) => (
            <li key={c.key} className="flex items-center gap-2 text-body-md">
              <span className={cn("size-2.5 rounded-xs", c.dot)} />
              <span className="flex-1">{c.label}</span>
              <span className="text-on-surface-variant tabular-nums">{c.october}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0">
        <div className="flex justify-end">
          <SegmentedButtonGroup aria-label="Layout" selectedKeys={[stacked ? "stacked" : "grouped"]} onSelectionChange={(k) => setStacked([...k][0] === "stacked")}>
            <SegmentedButton id="stacked">Stacked</SegmentedButton>
            <SegmentedButton id="grouped">Grouped</SegmentedButton>
          </SegmentedButtonGroup>
        </div>
        <ChartContainer config={config} className="mt-3 aspect-auto h-72">
          <BarChart data={DATA} margin={{ left: 0, right: 4, top: 4 }} barGap={4} accessibilityLayer>
            <CartesianGrid {...chartGridProps} />
            <XAxis dataKey="month" {...chartAxisProps} />
            <YAxis {...chartAxisProps} width={56} tickFormatter={(v) => `$${v}M`} />
            <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => `$${v}M`} />} />
            {CATEGORIES.map((c, i) => (
              <Bar
                key={c.key}
                dataKey={c.key}
                stackId={stacked ? "rev" : undefined}
                fill={`var(--color-${c.key})`}
                maxBarSize={stacked ? 64 : 22}
                radius={stacked ? (i === CATEGORIES.length - 1 ? [6, 6, 0, 0] : 0) : [6, 6, 6, 6]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
