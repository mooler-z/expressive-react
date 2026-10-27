"use client"

import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { cn, tv } from "@/lib/utils"

/*
 * Trace · step timelines for agent runs, pipelines and request traces.
 * Status lives on the rail (success · error · running · pending), durations in mono,
 * nested tool calls with collapsible input/output, and the running step uses the loading indicator.
 * Also: span waterfall, horizontal pipeline and compact status rows.
 */

export type TraceStatus = "success" | "error" | "running" | "pending" | "skipped"

const statusIconVariants = tv({
  base: "relative grid shrink-0 place-items-center rounded-full",
  variants: {
    status: {
      success: "bg-tertiary-container text-on-tertiary-container",
      error: "bg-error text-on-error",
      running: "bg-primary-container text-primary",
      pending: "border-2 border-outline-variant bg-surface text-on-surface-variant",
      skipped: "bg-surface-container-highest text-on-surface-variant",
    },
    size: {
      sm: "size-5 [--icon-size:16px]",
      md: "size-6 [--icon-size:16px]",
      lg: "size-8 [--icon-size:18px]",
    },
    /** Solid success (primary) for pipelines and summary rows. */
    solid: { true: "", false: "" },
  },
  compoundVariants: [{ status: "success", solid: true, class: "bg-primary text-on-primary" }],
  defaultVariants: { status: "success", size: "sm", solid: false },
})

const GLYPH: Record<TraceStatus, string | null> = {
  success: "check",
  error: "priority_high",
  running: null,
  pending: "schedule",
  skipped: "remove",
}

const STATUS_LABEL: Record<TraceStatus, string> = {
  success: "Succeeded",
  error: "Failed",
  running: "Running",
  pending: "Pending",
  skipped: "Skipped",
}

const SPINNER: Record<"sm" | "md" | "lg", number> = { sm: 18, md: 22, lg: 28 }

export interface TraceStatusIconProps {
  status: TraceStatus
  size?: "sm" | "md" | "lg"
  solid?: boolean
  className?: string
}

/** Status marker used on the rail, in pipelines and in status rows. */
function TraceStatusIcon({ status, size = "sm", solid = false, className }: TraceStatusIconProps) {
  return (
    <span data-slot="trace-status-icon" role="img" aria-label={STATUS_LABEL[status]} className={statusIconVariants({ status, size, solid, className })}>
      {status === "running" ? (
        <LoadingIndicator aria-hidden size={SPINNER[size]} className="text-current" />
      ) : (
        <Icon weight={600}>{GLYPH[status]!}</Icon>
      )}
    </span>
  )
}

/* ---------- Vertical step timeline ---------- */

const RingContext = React.createContext("var(--md-surface-container-low)")

export interface TraceProps extends React.OlHTMLAttributes<HTMLOListElement> {
  /** Background behind the rail markers (they punch a ring through the rail). An M3 role. */
  surface?: string
}

function Trace({ className, surface = "surface-container-low", ...props }: TraceProps) {
  return (
    <RingContext.Provider value={`var(--md-${surface})`}>
      <ol data-slot="trace" className={cn("relative ml-3 border-l-2 border-outline-variant", className)} {...props} />
    </RingContext.Provider>
  )
}

export interface TraceStepProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
  status: TraceStatus
  title: React.ReactNode
  /** Right-aligned mono duration ("340 ms", "running…"). Turns error-colored on failed steps. */
  duration?: React.ReactNode
  /** Renders a `tool` tag before the title (tool calls). */
  tool?: boolean
  /** Inline secondary text after the title ("retry 2 of 3"). */
  meta?: React.ReactNode
  /** One-line description under the title. */
  description?: React.ReactNode
}

/** One step on the rail. Children render below (TraceDetails, TraceError, actions). */
function TraceStep({ status, title, duration, tool, meta, description, className, children, ...props }: TraceStepProps) {
  const ring = React.useContext(RingContext)
  return (
    <li
      data-slot="trace-step"
      className={cn("relative pb-6 pl-8 last:pb-0", className)}
      {...props}
      style={{ "--ring": ring, ...props.style } as React.CSSProperties}
    >
      <TraceStatusIcon status={status} className="absolute top-0 -left-[11px] ring-4 ring-(--ring)" />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className={cn("inline-flex min-w-0 flex-wrap items-center gap-x-2 text-title-sm", status === "running" && "text-primary")}>
          {tool && <span className="rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-md text-on-surface-variant">tool</span>}
          {title}
          {meta && <span className="text-body-sm text-on-surface-variant">· {meta}</span>}
        </span>
        {duration != null && (
          <span className={cn("font-mono text-body-sm", status === "error" ? "text-error" : "text-on-surface-variant")}>{duration}</span>
        )}
      </div>
      {description && <p className="mt-0.5 text-body-sm text-on-surface-variant">{description}</p>}
      {children}
    </li>
  )
}

export interface TraceDetailsProps extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: React.ReactNode
}

/** Collapsible input/output for a tool call. */
function TraceDetails({ summary, className, children, ...props }: TraceDetailsProps) {
  return (
    <details data-slot="trace-details" className={cn("group/details mt-2 rounded-md bg-surface", className)} {...props}>
      <summary className="state-layer focus-ring flex h-10 cursor-pointer list-none items-center gap-2 rounded-md px-3 text-label-lg text-primary [&::-webkit-details-marker]:hidden">
        <Icon
          size={18}
          className="transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-open/details:rotate-90"
        >
          chevron_right
        </Icon>
        {summary}
      </summary>
      <pre className="relative overflow-x-auto px-3 pb-3 font-mono text-body-sm whitespace-pre-wrap text-on-surface-variant">{children}</pre>
    </details>
  )
}

/** Error output (message plus optional stack lines). */
function TraceError({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="trace-error"
      role="alert"
      className={cn("mt-2 rounded-md bg-error-container px-3 py-2 font-mono text-body-sm text-on-error-container [&>*+*]:opacity-80", className)}
      {...props}
    />
  )
}

/* ---------- Span waterfall ---------- */

export interface TraceSpan {
  name: string
  /** Start offset (same unit as `duration`). */
  start: number
  duration: number
  /** Nesting level; indents the name 12px per level. */
  depth?: number
  /** M3 role for the bar. Defaults by depth: primary, secondary, primary-fixed-dim, tertiary. */
  color?: string
}

export interface TraceWaterfallProps extends React.HTMLAttributes<HTMLDivElement> {
  spans: readonly TraceSpan[]
  /** Axis end. Defaults to the latest span end (rounded up to a whole tick). */
  total?: number
  /** Approximate number of axis intervals; the step is rounded to a nice value. */
  ticks?: number
  /** Unit label for the duration column. */
  unit?: string
}

const DEPTH_COLORS = ["primary", "secondary", "primary-fixed-dim", "tertiary"]

function TraceWaterfall({ spans, total, ticks = 4, unit = "ms", className, ...props }: TraceWaterfallProps) {
  const end = total ?? Math.max(...spans.map((s) => s.start + s.duration))
  // Round the tick step to a nice 1 / 2 / 2.5 / 5 × 10ⁿ, then extend the axis to a whole number of steps.
  const raw = end / ticks
  const mag = 10 ** Math.floor(Math.log10(raw || 1))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).reduce((best, c) => (Math.abs(c - raw) < Math.abs(best - raw) ? c : best))
  const intervals = Math.max(1, Math.ceil(end / step - 1e-9))
  const axis = step * intervals
  const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString() : n.toFixed(1))
  return (
    <div data-slot="trace-waterfall" role="table" aria-label="Span waterfall" className={cn("w-full text-body-sm", className)} {...props}>
      <div role="row" className="flex items-center gap-3 pb-2 text-label-sm text-on-surface-variant">
        <span role="columnheader" className="w-32 shrink-0">Span</span>
        <div role="columnheader" aria-label="Timeline" className="flex flex-1 justify-between font-mono">
          {Array.from({ length: intervals + 1 }, (_, i) => (
            <span key={i}>{fmt(step * i)}</span>
          ))}
        </div>
        <span role="columnheader" className="w-12 shrink-0 text-right">{unit}</span>
      </div>
      {spans.map((s, i) => {
        const color = s.color ?? DEPTH_COLORS[Math.min(s.depth ?? 0, DEPTH_COLORS.length - 1)]
        return (
          <div key={i} role="row" className="flex items-center gap-3 border-t border-outline-variant py-1.5">
            <span role="cell" className="w-32 shrink-0 truncate font-mono" style={{ paddingLeft: (s.depth ?? 0) * 12 }} title={s.name}>
              {s.name}
            </span>
            <div role="cell" className="relative h-4 flex-1 rounded-xs bg-surface-container-high">
              <span
                className="absolute inset-y-0 min-w-1 rounded-xs"
                style={{
                  left: `${(s.start / axis) * 100}%`,
                  width: `${(s.duration / axis) * 100}%`,
                  background: `var(--md-${color})`,
                }}
              />
            </div>
            <span role="cell" className="w-12 shrink-0 text-right font-mono text-on-surface-variant tabular-nums">
              {fmt(s.duration)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Horizontal pipeline ---------- */

export interface PipelineStage {
  label: React.ReactNode
  status: TraceStatus
  /** Mono caption under the label ("1m 12s", "2 of 3"). */
  meta?: React.ReactNode
}

export interface TracePipelineProps extends React.OlHTMLAttributes<HTMLOListElement> {
  stages: readonly PipelineStage[]
}

/** Stages left to right with a connector that fills as stages complete. */
function TracePipeline({ stages, className, ...props }: TracePipelineProps) {
  return (
    <ol
      data-slot="trace-pipeline"
      className={cn("grid w-full", className)}
      style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
      {...props}
    >
      {stages.map((s, i) => {
        const done = s.status === "success" || s.status === "skipped"
        return (
          <li key={i} className="relative flex flex-col items-center gap-1.5 text-center">
            {i < stages.length - 1 && (
              <span aria-hidden className={cn("absolute top-4 left-1/2 h-0.5 w-full", done ? "bg-primary" : "bg-outline-variant")} />
            )}
            <TraceStatusIcon status={s.status} size="lg" solid className={cn(s.status === "running" && "ring-4 ring-surface")} />
            <span className="text-label-md">{s.label}</span>
            {s.meta != null && <span className="font-mono text-label-sm text-on-surface-variant">{s.meta}</span>}
          </li>
        )
      })}
    </ol>
  )
}

/* ---------- Status row ---------- */

export interface TraceStatusRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  status: TraceStatus
  title: React.ReactNode
  /** Mono facts under the title ("5 steps", "6.4 s", …). */
  meta?: React.ReactNode[]
  /** Trailing action (button). */
  action?: React.ReactNode
}

/** Compact run summary row: status, title, mono facts, one action. */
function TraceStatusRow({ status, title, meta, action, className, ...props }: TraceStatusRowProps) {
  return (
    <div data-slot="trace-status-row" className={cn("flex items-center gap-3 rounded-md bg-surface-container-low px-3 py-2.5", className)} {...props}>
      <TraceStatusIcon status={status} size="lg" solid />
      <div className="min-w-0 flex-1">
        <div className="truncate text-label-lg">{title}</div>
        {meta && meta.length > 0 && (
          <div className="flex flex-wrap gap-x-3 font-mono text-label-sm text-on-surface-variant">
            {meta.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
        )}
      </div>
      {action}
    </div>
  )
}

export {
  Trace,
  TraceDetails,
  TraceError,
  TracePipeline,
  TraceStatusIcon,
  TraceStatusRow,
  TraceStep,
  TraceWaterfall,
  statusIconVariants as traceStatusIconVariants,
}
