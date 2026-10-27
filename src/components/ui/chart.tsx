"use client"

import * as React from "react"
import * as Recharts from "recharts"
import type { LegendPayload, TooltipPayloadEntry } from "recharts"

import { cn } from "@/lib/utils"

/*
 * Charts · Recharts themed with M3 roles (port of the kit's m3/charts.js).
 * Body-small labels in on-surface-variant, outline-variant grid, no tick marks or axis lines,
 * inverse-surface tooltips with 8dp corners, dot legends. Series default to
 * primary → primary-fixed-dim → secondary-container → tertiary.
 *
 * Colors are CSS variables, so charts follow dark mode and seed colors with no re-render:
 *   const config = { requests: { label: "Requests", color: "primary" } } satisfies ChartConfig
 *   <ChartContainer config={config} className="h-52">
 *     <AreaChart data={data}><Area dataKey="requests" stroke="var(--color-requests)" fill="var(--color-requests)" /></AreaChart>
 *   </ChartContainer>
 * `color` takes an M3 role ("primary", "tertiary-fixed-dim", …) or any CSS color.
 */

const ROLES = new Set([
  "primary", "on-primary", "primary-container", "on-primary-container", "primary-fixed", "primary-fixed-dim", "on-primary-fixed", "on-primary-fixed-variant",
  "secondary", "on-secondary", "secondary-container", "on-secondary-container", "secondary-fixed", "secondary-fixed-dim", "on-secondary-fixed", "on-secondary-fixed-variant",
  "tertiary", "on-tertiary", "tertiary-container", "on-tertiary-container", "tertiary-fixed", "tertiary-fixed-dim", "on-tertiary-fixed", "on-tertiary-fixed-variant",
  "error", "on-error", "error-container", "on-error-container",
  "surface", "surface-dim", "surface-bright", "surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest", "surface-variant", "surface-tint",
  "on-surface", "on-surface-variant", "outline", "outline-variant", "inverse-surface", "inverse-on-surface", "inverse-primary", "scrim", "shadow",
])

/** Default series order, as in the kit. */
export const CHART_SERIES = ["primary", "primary-fixed-dim", "secondary-container", "tertiary", "tertiary-fixed-dim"] as const

/** Resolve an M3 role (or any CSS color) to a CSS color, optionally at an alpha. */
export function chartColor(color: string, alpha?: number): string {
  const c = ROLES.has(color) ? `var(--md-${color})` : color
  return alpha == null ? c : `color-mix(in srgb, ${c} ${Math.round(alpha * 100)}%, transparent)`
}

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    /** M3 role or CSS color. Exposed to the chart as `var(--color-<key>)`. */
    color?: string
  }
>

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null)

function useChart() {
  const ctx = React.useContext(ChartContext)
  if (!ctx) throw new Error("useChart must be used inside <ChartContainer>")
  return ctx
}

const cssKey = (key: string) => key.replace(/[^a-zA-Z0-9_-]/g, "-")

export interface ChartContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  config: ChartConfig
  children: React.ReactElement
}

/** Responsive, themed frame for one Recharts chart. Size it with `h-*` (default aspect-video). */
function ChartContainer({ config, className, style, children, ...props }: ChartContainerProps) {
  const vars = Object.fromEntries(
    Object.entries(config)
      .filter(([, v]) => v.color)
      .map(([k, v]) => [`--color-${cssKey(k)}`, chartColor(v.color!)]),
  )
  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        className={cn(
          "relative flex aspect-video w-full min-w-0 justify-center text-body-sm text-on-surface-variant",
          "[&_.recharts-cartesian-axis-tick_text]:fill-on-surface-variant [&_.recharts-polar-angle-axis-tick_text]:fill-on-surface-variant",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-outline-variant/50 [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-outline-variant/60",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-outline-variant",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-outline [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-on-surface/6",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-radial-bar-background-sector]:fill-surface-container-highest",
          "[&_.recharts-label]:fill-on-surface-variant [&_.recharts-text]:font-sans",
          "[&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        style={{ ...vars, ...style }}
        {...props}
      >
        <Recharts.ResponsiveContainer>{children}</Recharts.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

/** Axis defaults matching the kit: no tick marks, no axis line, 8px padding. Spread onto XAxis/YAxis. */
export const chartAxisProps = { tickLine: false, axisLine: false, tickMargin: 8 } as const
/** Grid defaults: horizontal lines only. Spread onto CartesianGrid. */
export const chartGridProps = { vertical: false } as const

const ChartTooltip = Recharts.Tooltip

export interface ChartTooltipContentProps {
  active?: boolean
  payload?: ReadonlyArray<TooltipPayloadEntry>
  label?: React.ReactNode
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "dot" | "line"
  /** Format the header label (x value). */
  labelFormatter?: (label: React.ReactNode, payload: ReadonlyArray<TooltipPayloadEntry>) => React.ReactNode
  /** Format each value. */
  valueFormatter?: (value: number | string, name: string, item: TooltipPayloadEntry) => React.ReactNode
  /** Payload field used to look up the config label (defaults to dataKey/name). */
  nameKey?: string
  className?: string
}

/** Inverse-surface tooltip body. Use as `<ChartTooltip content={<ChartTooltipContent />} />`. */
function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel,
  hideIndicator,
  indicator = "dot",
  labelFormatter,
  valueFormatter,
  nameKey,
  className,
}: ChartTooltipContentProps) {
  const { config } = useChart()
  if (!active || !payload?.length) return null
  const items = payload.filter((p) => p.type !== "none")
  const heading = labelFormatter ? labelFormatter(label, payload) : label
  return (
    <div
      data-slot="chart-tooltip"
      className={cn("grid min-w-32 gap-1.5 rounded-sm bg-inverse-surface px-2.5 py-2 text-body-sm text-inverse-on-surface shadow-2", className)}
    >
      {!hideLabel && heading != null && heading !== "" && <div className="text-label-md">{heading}</div>}
      {items.map((item, i) => {
        const key = String((nameKey && item.payload?.[nameKey]) ?? item.dataKey ?? item.name ?? i)
        const name = config[key]?.label ?? config[String(item.name)]?.label ?? item.name
        const color = item.color || item.payload?.fill || item.fill
        const value = item.value as number | string | undefined
        return (
          <div key={key + i} className="flex items-center gap-2">
            {!hideIndicator && (
              <span
                aria-hidden
                className={cn("shrink-0", indicator === "dot" ? "size-2 rounded-full" : "h-3 w-1 rounded-full")}
                style={{ background: color }}
              />
            )}
            <span className="text-inverse-on-surface/80">{name}</span>
            {value != null && (
              <span className="ml-auto pl-3 font-medium tabular-nums">
                {valueFormatter ? valueFormatter(value, String(item.name), item) : typeof value === "number" ? value.toLocaleString() : value}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

const ChartLegend = Recharts.Legend

export interface ChartLegendContentProps {
  payload?: ReadonlyArray<LegendPayload>
  verticalAlign?: "top" | "middle" | "bottom"
  hideIcon?: boolean
  className?: string
}

/** Dot legend in label-medium. Use as `<ChartLegend content={<ChartLegendContent />} />`. */
function ChartLegendContent({ payload, verticalAlign = "bottom", hideIcon, className }: ChartLegendContentProps) {
  const { config } = useChart()
  if (!payload?.length) return null
  // Recharts sorts legend items alphabetically; keep the series order of the config instead.
  const order = Object.keys(config)
  const rank = (item: LegendPayload) => {
    const i = order.indexOf(String(item.dataKey ?? ""))
    return i !== -1 ? i : order.indexOf(String(item.value))
  }
  const items = [...payload].sort((a, b) => rank(a) - rank(b))
  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-label-md text-on-surface-variant",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className,
      )}
    >
      {items
        .filter((item) => item.type !== "none")
        .map((item, i) => {
          const key = String(item.dataKey ?? item.value)
          return (
            <div key={`${key}-${String(item.value)}-${i}`} className="flex items-center gap-1.5">
              {!hideIcon && <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: item.color }} />}
              {config[key]?.label ?? config[String(item.value)]?.label ?? item.value}
            </div>
          )
        })}
    </div>
  )
}

/* ---------- Ready-made small charts ---------- */

export interface SparklineProps {
  data: readonly number[]
  /** M3 role or CSS color. */
  color?: string
  /** Fill under the line at 14%. */
  area?: boolean
  strokeWidth?: number
  className?: string
  "aria-label"?: string
}

/** Axis-less trend line for KPI rows. Size it with `h-* w-*`. */
function Sparkline({ data, color = "primary", area = true, strokeWidth = 2, className, ...props }: SparklineProps) {
  const points = React.useMemo(() => data.map((value, i) => ({ i, value })), [data])
  const c = chartColor(color)
  return (
    <div
      data-slot="sparkline"
      role="img"
      aria-label={props["aria-label"] ?? `Trend: ${data[0]} to ${data[data.length - 1]}`}
      className={cn("h-12 w-32 min-w-0", className)}
    >
      <Recharts.ResponsiveContainer>
        <Recharts.AreaChart data={points} margin={{ top: strokeWidth, right: strokeWidth, bottom: strokeWidth, left: strokeWidth }}>
          <Recharts.YAxis hide domain={["dataMin", "dataMax"]} />
          <Recharts.Area
            type="monotone"
            dataKey="value"
            stroke={c}
            strokeWidth={strokeWidth}
            fill={c}
            fillOpacity={area ? 0.14 : 0}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </Recharts.AreaChart>
      </Recharts.ResponsiveContainer>
    </div>
  )
}

export interface GaugeProps {
  value: number
  max?: number
  /** Active arc: M3 role or CSS color. */
  color?: string
  /** Remaining arc: M3 role or CSS color. */
  trackColor?: string
  /** Arc thickness in viewBox units (arc radius is 90). */
  thickness?: number
  /** Big number under the arc (defaults to the percentage). */
  label?: React.ReactNode
  /** Small text under the label. */
  sublabel?: React.ReactNode
  className?: string
  "aria-label"?: string
}

/** Half-doughnut gauge (error budgets, quotas). The arc animates on the M3 spring when `value` changes. */
function Gauge({
  value,
  max = 100,
  color = "primary",
  trackColor = "secondary-container",
  thickness = 18,
  label,
  sublabel,
  className,
  ...props
}: GaugeProps) {
  const pct = Math.max(0, Math.min(1, value / max))
  const r = 90
  const arc = `M ${100 - r} 100 A ${r} ${r} 0 0 1 ${100 + r} 100`
  return (
    <div
      data-slot="gauge"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={props["aria-label"] ?? "Gauge"}
      className={cn("relative mx-auto w-full max-w-[260px]", className)}
    >
      <svg viewBox={`0 0 200 ${100 + thickness / 2}`} className="block w-full overflow-visible" aria-hidden>
        <path d={arc} fill="none" stroke={chartColor(trackColor)} strokeWidth={thickness} strokeLinecap="round" />
        <path
          d={arc}
          fill="none"
          stroke={chartColor(color)}
          strokeWidth={thickness}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${pct * 100} 100`}
          className="transition-[stroke-dasharray] duration-(--md-spring-default-spatial-duration) ease-default-spatial"
          opacity={pct === 0 ? 0 : 1}
        />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 text-center">
        <div className="text-headline-md font-medium text-on-surface tabular-nums">{label ?? `${Math.round(pct * 100)}%`}</div>
        {sublabel && <div className="text-body-sm text-on-surface-variant">{sublabel}</div>}
      </div>
    </div>
  )
}

export { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, Gauge, Sparkline, useChart }
