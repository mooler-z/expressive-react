"use client"

import * as React from "react"
import { CartesianGrid } from "recharts"

import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartTooltipContentProps,
  chartColor,
} from "@/components/ui/chart"

/*
 * Recharts presets matching the kit's Chart.js theme (m3/charts.js):
 * tension .4 → monotone curves · 2.5px lines · no points until hover · 6px bar corners ·
 * outline-variant grid, no tick marks, no axis lines · bottom dot legends.
 */

/** M3 role → CSS color at an optional alpha. */
export const c = chartColor

export const MARGIN = { top: 8, right: 8, bottom: 0, left: 0 }

/** Category x-axis on the `label` key. */
export const xAxis = { dataKey: "label", tickLine: false, axisLine: false, tickMargin: 8, minTickGap: 20 } as const

/** Value axis. */
export function yAxis(format?: (v: number) => string, extra?: Record<string, unknown>) {
  return { tickLine: false, axisLine: false, tickMargin: 8, width: "auto", tickFormatter: format, ...extra } as const
}

export const grid = <CartesianGrid vertical={false} />

export function tip(props: Partial<ChartTooltipContentProps> = {}, extra: Record<string, unknown> = {}) {
  return <ChartTooltip content={<ChartTooltipContent {...props} />} {...extra} />
}

export const legend = <ChartLegend content={<ChartLegendContent />} />

/** Line defaults. */
export const line = { type: "monotone", strokeWidth: 2.5, dot: false, activeDot: { r: 5 } } as const

/** Dashed comparison line. */
export const dashed = { ...line, strokeWidth: 1.5, strokeDasharray: "6 6" } as const

/** Bar corner radius (kit: 6px). */
export const R6: [number, number, number, number] = [6, 6, 6, 6]
export const RTOP: [number, number, number, number] = [6, 6, 0, 0]

/** Numeric x-axis (scatter, bubble). */
export function xNum(format?: (v: number) => string, extra?: Record<string, unknown>) {
  return { type: "number", tickLine: false, axisLine: false, tickMargin: 8, tickFormatter: format, ...extra } as const
}

/** Build `{label, ...series}` rows from parallel arrays. */
export function rows(labels: readonly string[], series: Record<string, readonly (number | null | readonly number[])[]>) {
  return labels.map((label, i) => {
    const row: Record<string, unknown> = { label }
    for (const [k, v] of Object.entries(series)) row[k] = v[i]
    return row
  })
}

/** Small "label · value" readout used by SVG viz widgets. */
export function Readout({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className ?? "mt-2 min-h-5 text-body-sm text-on-surface-variant tabular-nums"}>{children}</div>
}

/** Legend for charts whose series don't map 1:1 to config keys. */
export function DotLegend({ items }: { items: [label: string, role: string][] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3 text-label-md text-on-surface-variant">
      {items.map(([label, role]) => (
        <div key={label} className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 rounded-full" style={{ background: c(role) }} />
          {label}
        </div>
      ))}
    </div>
  )
}
