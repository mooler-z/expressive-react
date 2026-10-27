"use client"

import * as React from "react"
import { ToggleButton, ToggleButtonGroup } from "react-aria-components"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import { ChartContainer, ChartTooltip, ChartTooltipContent, chartAxisProps, chartGridProps, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

/*
 * Chart card 01 · Series toggles
 * Legend chips switch series on and off; queue time brings its own axis when shown.
 * The range control swaps 24 hours for 7 days.
 */

const curve = (n: number, base: number, amp: number, phase: number, k: number) =>
  Array.from({ length: n }, (_, i) => Math.round(base + amp * Math.sin((i / n) * Math.PI * 2 + phase) + (((i * 37) % 11) - 5) * k))

const build = (labels: string[], now: number[], prev: number[], queue: number[]) =>
  labels.map((label, i) => ({ label, now: now[i], prev: prev[i], queue: queue[i] }))

const DATA = {
  "24h": build(
    Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
    curve(24, 140, 52, -3.53, 1.6),
    curve(24, 131, 48, -3.53, 1.2),
    curve(24, 34, 10, -0.39, 0.8),
  ),
  "7d": build(
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    [198, 192, 201, 207, 214, 231, 226],
    [187, 185, 190, 196, 205, 219, 214],
    [41, 39, 38, 36, 33, 29, 31],
  ),
}
type Range = keyof typeof DATA

const SERIES = [
  { id: "now", label: "Players online", swatch: "h-1 w-4 rounded-full bg-primary" },
  { id: "prev", label: "Same time last week", swatch: "w-4 border-t-2 border-dashed border-outline" },
  { id: "queue", label: "Queue p50", swatch: "h-1 w-4 rounded-full bg-tertiary" },
] as const

const config = {
  now: { label: "Players online", color: "primary" },
  prev: { label: "Same time last week", color: "outline" },
  queue: { label: "Queue p50", color: "tertiary" },
} satisfies ChartConfig

export function ChartCard1({ className }: { className?: string }) {
  const [range, setRange] = React.useState<Range>("24h")
  const [series, setSeries] = React.useState<Set<string>>(new Set(["now", "prev"]))
  const showQueue = series.has("queue")

  return (
    <div className={cn("bg-surface p-4 md:p-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-title-lg font-medium">Players and queue time</h4>
          <p className="text-body-sm text-on-surface-variant">Ember Tactics · all regions</p>
        </div>
        <SegmentedButtonGroup aria-label="Range" selectedKeys={[range]} onSelectionChange={(k) => setRange([...k][0] as Range)}>
          <SegmentedButton id="24h">24h</SegmentedButton>
          <SegmentedButton id="7d">7d</SegmentedButton>
        </SegmentedButtonGroup>
      </div>

      <ToggleButtonGroup
        aria-label="Series"
        selectionMode="multiple"
        disallowEmptySelection
        selectedKeys={series}
        onSelectionChange={(keys) => setSeries(new Set([...keys].map(String)))}
        className="mt-3 flex flex-wrap gap-2"
      >
        {SERIES.map((s) => (
          <ToggleButton
            key={s.id}
            id={s.id}
            className="state-layer focus-ring inline-flex h-8 cursor-pointer items-center gap-2 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container"
          >
            <span className={s.swatch} />
            {s.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <ChartContainer config={config} className="mt-4 aspect-auto h-72">
        <ComposedChart data={DATA[range]} margin={{ left: 0, right: showQueue ? 0 : 8, top: 4 }} accessibilityLayer>
          <CartesianGrid {...chartGridProps} />
          <XAxis dataKey="label" {...chartAxisProps} minTickGap={24} />
          <YAxis yAxisId="players" {...chartAxisProps} width={44} tickFormatter={(v) => `${v}k`} />
          <YAxis yAxisId="queue" orientation="right" hide={!showQueue} {...chartAxisProps} width={40} tickFormatter={(v) => `${v}s`} />
          <ChartTooltip
            content={<ChartTooltipContent valueFormatter={(v, name) => (name === "queue" || name === "Queue p50" ? `${v}s` : `${v}k`)} />}
          />
          {series.has("now") && (
            <Area yAxisId="players" type="monotone" dataKey="now" stroke="var(--color-now)" strokeWidth={2.5} fill="var(--color-now)" fillOpacity={0.1} />
          )}
          {series.has("prev") && (
            <Line yAxisId="players" type="monotone" dataKey="prev" stroke="var(--color-prev)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          )}
          {showQueue && <Line yAxisId="queue" type="monotone" dataKey="queue" stroke="var(--color-queue)" strokeWidth={2.5} dot={false} />}
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}
