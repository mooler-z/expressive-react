"use client"

import * as React from "react"
import { ToggleButton, ToggleButtonGroup } from "react-aria-components"
import { Cell, Pie, PieChart } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

/*
 * Chart card 03 · Donut with legend table
 * Sessions by game mode. Each legend row hides or shows its slice, and the center total follows.
 */

const MODES = [
  { key: "quick", label: "Quick play", k: 916, avg: "14m", color: "primary", dot: "bg-primary" },
  { key: "ranked", label: "Ranked", k: 747, avg: "27m", color: "tertiary", dot: "bg-tertiary" },
  { key: "coop", label: "Co-op", k: 458, avg: "32m", color: "primary-fixed-dim", dot: "bg-primary-fixed-dim" },
  { key: "custom", label: "Custom", k: 169, avg: "41m", color: "secondary", dot: "bg-secondary" },
  { key: "training", label: "Training", k: 121, avg: "9m", color: "outline", dot: "bg-outline" },
]

const config = Object.fromEntries(MODES.map((m) => [m.key, { label: m.label, color: m.color }])) satisfies ChartConfig

export function ChartCard3({ className }: { className?: string }) {
  const [shown, setShown] = React.useState<Set<string>>(new Set(MODES.map((m) => m.key)))
  const visible = MODES.filter((m) => shown.has(m.key))
  const total = visible.reduce((a, m) => a + m.k, 0)
  const data = visible.map((m) => ({ mode: m.key, sessions: m.k }))

  return (
    <div className={cn("grid items-center gap-6 bg-surface p-4 md:grid-cols-[240px_minmax(0,1fr)] md:p-6", className)}>
      <div className="relative mx-auto aspect-square w-full max-w-[240px]">
        <ChartContainer config={config} className="aspect-square">
          <PieChart accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="mode" valueFormatter={(v) => `${v}k sessions`} />} />
            <Pie data={data} dataKey="sessions" nameKey="mode" innerRadius="72%" outerRadius="100%" paddingAngle={2} cornerRadius={6} strokeWidth={0}>
              {data.map((d) => (
                <Cell key={d.mode} fill={`var(--color-${d.mode})`} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-headline-md font-medium tabular-nums">{(total / 1000).toFixed(2)}M</div>
            <div className="text-body-sm text-on-surface-variant">sessions today</div>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="text-title-lg font-medium">Sessions by mode</h4>
          <span className="text-body-sm text-on-surface-variant">Select a row to hide it</span>
        </div>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_56px_72px_80px] gap-3 border-b border-outline-variant px-2 pb-2 text-label-md text-on-surface-variant">
          <span>Mode</span>
          <span className="text-right">Share</span>
          <span className="text-right">Sessions</span>
          <span className="text-right">Avg. length</span>
        </div>
        <ToggleButtonGroup
          aria-label="Visible modes"
          selectionMode="multiple"
          disallowEmptySelection
          orientation="vertical"
          selectedKeys={shown}
          onSelectionChange={(keys) => setShown(new Set([...keys].map(String)))}
          className="flex flex-col"
        >
          {MODES.map((m) => {
            const on = shown.has(m.key)
            return (
              <ToggleButton
                key={m.key}
                id={m.key}
                className={cn(
                  "state-layer focus-ring grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_56px_72px_80px] items-center gap-3 rounded-sm border-b border-outline-variant/60 px-2 py-2.5 text-left text-body-md transition-opacity",
                  !on && "opacity-40",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className={cn("size-3 shrink-0 rounded-full", m.dot)} />
                  <span className="truncate">{m.label}</span>
                </span>
                <span className="text-right tabular-nums">{on ? `${Math.round((m.k / (total || 1)) * 100)}%` : "—"}</span>
                <span className="text-right text-on-surface-variant tabular-nums">{m.k}k</span>
                <span className="text-right text-on-surface-variant tabular-nums">{m.avg}</span>
              </ToggleButton>
            )
          })}
        </ToggleButtonGroup>
      </div>
    </div>
  )
}
