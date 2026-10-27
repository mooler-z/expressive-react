"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Sparkline,
  chartAxisProps,
  chartGridProps,
  type ChartConfig,
} from "@/components/ui/chart"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Dashboard 01 · KPI overview
 * KPI tiles with sparklines, concurrent players against the previous period, and share by region.
 * The range control redraws the chart.
 */

const curve = (n: number, base: number, amp: number, phase: number, k: number) =>
  Array.from({ length: n }, (_, i) => Math.round(base + amp * Math.sin((i / n) * Math.PI * 2 + phase) + (((i * 37) % 11) - 5) * k))

const zip = (labels: string[], now: number[], prev: number[]) => labels.map((label, i) => ({ label, now: now[i], prev: prev[i] }))

const RANGES = {
  "24h": {
    label: "last 24 hours",
    data: zip(
      Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
      curve(24, 140, 52, -3.53, 1.6),
      curve(24, 131, 48, -3.53, 1.2),
    ),
  },
  "7d": {
    label: "last 7 days",
    data: zip(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], [198, 192, 201, 207, 214, 231, 226], [187, 185, 190, 196, 205, 219, 214]),
  },
  "30d": {
    label: "last 30 days",
    data: zip(
      Array.from({ length: 30 }, (_, i) => `Oct ${i + 1}`),
      curve(30, 206, 14, 0.4, 1.8),
      curve(30, 188, 12, 0.4, 1.4),
    ),
  },
}
type Range = keyof typeof RANGES

const KPIS = [
  { label: "Players online", value: "182,406", delta: "+6.2%", up: true, trend: [148, 156, 151, 163, 170, 166, 174, 182] },
  { label: "Daily active", value: "1.24M", delta: "+3.1%", up: true, trend: [1.11, 1.14, 1.12, 1.17, 1.19, 1.2, 1.22, 1.24] },
  { label: "Revenue today", value: "$412.8K", delta: "+8.4%", up: true, trend: [301, 322, 318, 344, 361, 352, 389, 413] },
  { label: "Crash-free sessions", value: "99.62%", delta: "−0.08 pts", up: false, trend: [99.71, 99.7, 99.72, 99.69, 99.7, 99.64, 99.6, 99.62] },
]

const REGIONS = [
  { name: "NA-East", pct: 39 },
  { name: "EU-West", pct: 32 },
  { name: "APAC-Tokyo", pct: 18 },
  { name: "SA-São Paulo", pct: 8 },
  { name: "OCE-Sydney", pct: 3 },
]

const config = {
  now: { label: "This period", color: "primary" },
  prev: { label: "Previous period", color: "outline" },
} satisfies ChartConfig

export function Dashboard1({ className }: { className?: string }) {
  const [range, setRange] = React.useState<Range>("24h")
  const r = RANGES[range]

  return (
    <div className={cn("space-y-3 bg-surface p-4 md:p-6", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3 pb-1">
        <div>
          <div className="text-body-sm text-on-surface-variant">Ember Tactics · all platforms</div>
          <h4 className="text-headline-sm font-medium">Good morning, Maya</h4>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedButtonGroup
            aria-label="Range"
            selectedKeys={[range]}
            onSelectionChange={(keys) => setRange([...keys][0] as Range)}
          >
            {(Object.keys(RANGES) as Range[]).map((id) => (
              <SegmentedButton key={id} id={id}>
                {id}
              </SegmentedButton>
            ))}
          </SegmentedButtonGroup>
          <Button
            variant="outlined"
            className="pr-4 pl-3"
            onPress={() => snackbar("Exporting overview as PDF…", { action: { label: "Cancel", onAction: () => {} } })}
          >
            <Icon>download</Icon>
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="rounded-lg bg-surface-container-low p-4">
            <div className="text-body-md text-on-surface-variant">{k.label}</div>
            <div className="mt-1 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <div className="text-headline-sm font-medium tabular-nums">{k.value}</div>
                <div className={cn("mt-0.5 inline-flex items-center gap-1 text-label-md", k.up ? "text-primary" : "text-error")}>
                  <Icon size={16}>{k.up ? "trending_up" : "trending_down"}</Icon>
                  {k.delta}
                </div>
              </div>
              <Sparkline data={k.trend} color={k.up ? "primary" : "error"} className="h-10 w-24 shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg bg-surface-container-low p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h5 className="text-title-md">Concurrent players</h5>
              <p className="text-body-sm text-on-surface-variant">Thousands, {r.label}</p>
            </div>
            <div className="flex gap-4 text-body-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-4 rounded-full bg-primary" />
                This period
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-4 border-t-2 border-dashed border-outline" />
                Previous
              </span>
            </div>
          </div>
          <ChartContainer config={config} className="mt-3 aspect-auto h-64">
            <AreaChart data={r.data} margin={{ left: 0, right: 4, top: 4 }} accessibilityLayer>
              <CartesianGrid {...chartGridProps} />
              <XAxis dataKey="label" {...chartAxisProps} minTickGap={24} />
              <YAxis {...chartAxisProps} width={44} tickFormatter={(v) => `${v}k`} />
              <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => `${v}k`} />} />
              <Area type="monotone" dataKey="now" stroke="var(--color-now)" strokeWidth={2.5} fill="var(--color-now)" fillOpacity={0.12} />
              <Line type="monotone" dataKey="prev" stroke="var(--color-prev)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ChartContainer>
        </div>
        <div className="rounded-lg bg-surface-container-low p-4">
          <h5 className="text-title-md">Players by region</h5>
          <p className="text-body-sm text-on-surface-variant">Share of concurrent players</p>
          <ul className="mt-4 space-y-3">
            {REGIONS.map((reg) => (
              <li key={reg.name}>
                <div className="flex justify-between text-body-md">
                  <span>{reg.name}</span>
                  <span className="text-on-surface-variant tabular-nums">{reg.pct}%</span>
                </div>
                <div className="mt-1.5 flex h-1.5 items-center gap-1">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${reg.pct}%` }} />
                  <div className="h-full flex-1 rounded-full bg-secondary-container" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
