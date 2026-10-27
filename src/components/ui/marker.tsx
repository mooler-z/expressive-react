"use client"

import * as React from "react"
import { Button as AriaButton, composeRenderProps, type ButtonProps as AriaButtonProps } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { cn, tv } from "@/lib/utils"

/*
 * Markers · map pins with label pills, density clusters, status pins, live-location dots,
 * numbered annotation markers for diagrams / onboarding tours, legends and coach marks.
 * Position any marker over a `relative` surface with <Marker x y>.
 */

type Pos = number | string
const pct = (v: Pos) => (typeof v === "number" ? `${v}%` : v)

export interface MarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal position (number = percent). */
  x: Pos
  /** Vertical position (number = percent). */
  y: Pos
  /** Which point of the marker sits on (x, y): its center or its bottom tip (pins). */
  anchor?: "center" | "bottom"
}

function Marker({ x, y, anchor = "center", className, style, ...props }: MarkerProps) {
  return (
    <div
      data-slot="marker"
      className={cn("absolute -translate-x-1/2", anchor === "center" ? "-translate-y-1/2" : "-translate-y-full", className)}
      style={{ left: pct(x), top: pct(y), ...style }}
      {...props}
    />
  )
}

const pressable = "cursor-pointer outline-none transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial data-pressed:scale-90"

const toneText = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  error: "text-error",
} as const

export interface MapPinProps extends Omit<AriaButtonProps, "children"> {
  /** Pill text above the pin ("Frankfurt · 12 nodes"). Also the accessible name. */
  label?: string
  tone?: keyof typeof toneText
  icon?: string
}

/** Classic location pin with an optional inverse label pill. Anchor with `<Marker anchor="bottom">`. */
function MapPin({ label, tone = "primary", icon = "location_on", className, ...props }: MapPinProps) {
  return (
    <AriaButton
      data-slot="map-pin"
      aria-label={props["aria-label"] ?? label ?? "Location"}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("group flex flex-col items-center", pressable, "data-focus-visible:[&>span:first-child]:outline-3 data-focus-visible:[&>span:first-child]:outline-secondary", className),
      )}
    >
      {label && <span className="rounded-full bg-inverse-surface px-3 py-1 text-label-md whitespace-nowrap text-inverse-on-surface shadow-2">{label}</span>}
      <Icon size={40} filled className={cn("-mt-1 drop-shadow", toneText[tone])}>
        {icon}
      </Icon>
    </AriaButton>
  )
}

export interface MarkerDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof toneText
  /** Expanding ping ring (live location, speaking). */
  pulse?: boolean
  /** Accuracy halo diameter in px. */
  halo?: number
}

const toneBg = { primary: "bg-primary", secondary: "bg-secondary", tertiary: "bg-tertiary", error: "bg-error" } as const

/** Small location dot with a 4dp ring, optional pulse and accuracy halo. */
function MarkerDot({ tone = "primary", pulse, halo, className, ...props }: MarkerDotProps) {
  return (
    <span data-slot="marker-dot" className={cn("relative grid size-4 place-items-center", className)} {...props}>
      {halo && (
        <span
          aria-hidden
          className={cn("absolute rounded-full border border-current/40 bg-current/15", toneText[tone])}
          style={{ width: halo, height: halo }}
        />
      )}
      {pulse && <span aria-hidden className={cn("absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none", toneBg[tone])} />}
      <span className={cn("relative size-4 rounded-full ring-4 ring-surface", toneBg[tone])} />
    </span>
  )
}

const clusterVariants = tv({
  base: ["state-layer grid shrink-0 place-items-center rounded-full", pressable, "data-focus-visible:outline-3 data-focus-visible:outline-offset-2 data-focus-visible:outline-secondary"],
  variants: {
    density: {
      high: "size-14 bg-primary text-title-sm text-on-primary ring-8 ring-primary/25",
      medium: "size-10 bg-primary text-label-lg text-on-primary ring-4 ring-primary/25",
      low: "size-8 bg-secondary-container text-label-md text-on-secondary-container ring-4 ring-secondary-container/50",
    },
  },
  defaultVariants: { density: "medium" },
})

export interface ClusterMarkerProps extends Omit<AriaButtonProps, "children"> {
  count: number
  /** Visual weight; defaults from `count` (≥100 high, ≥10 medium). */
  density?: "high" | "medium" | "low"
}

/** Count bubble that grows with how many points it groups. */
function ClusterMarker({ count, density, className, ...props }: ClusterMarkerProps) {
  const d = density ?? (count >= 100 ? "high" : count >= 10 ? "medium" : "low")
  return (
    <AriaButton
      data-slot="cluster-marker"
      aria-label={props["aria-label"] ?? `${count} items`}
      {...props}
      className={composeRenderProps(className, (className) => clusterVariants({ density: d, className }))}
    >
      {count}
    </AriaButton>
  )
}

const statusTone = {
  ok: { cls: "bg-primary text-on-primary", icon: "check" },
  warning: { cls: "bg-tertiary text-on-tertiary", icon: "warning" },
  error: { cls: "bg-error text-on-error", icon: "close" },
  neutral: { cls: "bg-surface-container-highest text-on-surface-variant", icon: "circle" },
} as const

export interface StatusPinProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: keyof typeof statusTone
  /** Override the status glyph. */
  icon?: string
}

/** Teardrop pin carrying a status glyph. Its tip is the bottom-left corner rotated to point down. */
function StatusPin({ status = "ok", icon, className, ...props }: StatusPinProps) {
  const t = statusTone[status]
  return (
    <span
      role="img"
      aria-label={props["aria-label"] ?? status}
      data-slot="status-pin"
      className={cn("grid size-8 -rotate-45 place-items-center rounded-full rounded-bl-none shadow-2", t.cls, className)}
      {...props}
    >
      <Icon size={18} filled className="rotate-45">
        {icon ?? t.icon}
      </Icon>
    </span>
  )
}

export interface NumberMarkerProps extends Omit<AriaButtonProps, "children"> {
  /** Step number / label. */
  children: React.ReactNode
  /** Entrance delay in ms (stagger a tour's markers). */
  delay?: number
}

/** Numbered annotation dot for diagrams and onboarding tours; pops in on mount. */
function NumberMarker({ children, delay, className, style, ...props }: NumberMarkerProps) {
  return (
    <AriaButton
      data-slot="number-marker"
      {...props}
      style={composeRenderProps(style, (style) => ({ animationDelay: delay ? `${delay}ms` : undefined, ...style }))}
      className={composeRenderProps(className, (className) =>
        cn(
          "state-layer grid size-7 animate-pop place-items-center rounded-full bg-primary text-label-lg text-on-primary ring-4 ring-surface motion-reduce:animate-none",
          pressable,
          "data-focus-visible:outline-3 data-focus-visible:outline-offset-4 data-focus-visible:outline-secondary",
          className,
        ),
      )}
    >
      {children}
    </AriaButton>
  )
}

/** Small surface pill for map captions ("You · ±40 m") and legend rows. */
function MarkerLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="marker-label"
      className={cn("inline-flex h-6 items-center gap-1.5 rounded-full bg-surface px-2.5 text-label-md whitespace-nowrap text-on-surface shadow-1", className)}
      {...props}
    />
  )
}

export interface MarkerLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { label: React.ReactNode; tone?: keyof typeof toneBg; className?: string }[]
}

function MarkerLegend({ items, className, ...props }: MarkerLegendProps) {
  return (
    <div data-slot="marker-legend" className={cn("flex flex-wrap gap-1", className)} {...props}>
      {items.map((it, i) => (
        <MarkerLabel key={i}>
          <span className={cn("size-2 rounded-full", toneBg[it.tone ?? "primary"], it.className)} />
          {it.label}
        </MarkerLabel>
      ))}
    </div>
  )
}

export interface CoachMarkProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Tour progress, e.g. "2 of 4". Shown in the footer beside the actions, not above the title. */
  step?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Back / Next buttons. */
  actions?: React.ReactNode
}

/** Tour callout card. Place it next to the highlighted control (absolutely, or in a Popover). */
function CoachMark({ step, title, description, actions, className, ...props }: CoachMarkProps) {
  return (
    <div role="dialog" aria-label={typeof title === "string" ? title : undefined} data-slot="coach-mark" className={cn("w-64 rounded-md bg-surface-container-high p-4 shadow-2", className)} {...props}>
      <div className="text-title-sm text-on-surface">{title}</div>
      {description && <p className="mt-1 text-body-sm text-on-surface-variant">{description}</p>}
      {(step || actions) && (
        <div className="mt-3 flex items-center gap-1">
          {step && <span className="text-label-md text-on-surface-variant tabular-nums">{step}</span>}
          {actions && <div className="ml-auto flex gap-1">{actions}</div>}
        </div>
      )}
    </div>
  )
}

export { ClusterMarker, CoachMark, MapPin, Marker, MarkerDot, MarkerLabel, MarkerLegend, NumberMarker, StatusPin }
