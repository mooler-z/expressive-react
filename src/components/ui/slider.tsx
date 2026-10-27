"use client"

import * as React from "react"
import {
  Label as AriaLabel,
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
  type SliderProps as AriaSliderProps,
  type SliderTrackRenderProps,
  useLocale,
} from "react-aria-components"

import { cn } from "@/lib/utils"

/*
 * Sliders · M3 Expressive (androidx SliderTokens + Slider.kt; size scale from m3.material.io)
 * Track XS 16 · S 24 · M 40 · L 56 · XL 96, handle 44 · 44 · 52 · 68 · 108 tall, outer corners 8 · 8 · 12 · 16 · 28.
 * 4dp handle (2dp while pressed/focused) with a 6dp gap each side; inner corners 2dp.
 * Handle travels between the track's outer corners (Compose layout).
 * Active primary, inactive secondary-container; stops are 4dp dots in the opposite segment's color,
 * plus a stop indicator one corner-radius in from each inactive end. Value indicator: inverse-surface pill above the handle.
 * Disabled: active/handle on-surface 38%, inactive on-surface 12%.
 */
const SIZES = {
  xs: { track: 16, handle: 44, corner: 8, icon: 0 },
  sm: { track: 24, handle: 44, corner: 8, icon: 0 },
  md: { track: 40, handle: 52, corner: 12, icon: 24 },
  lg: { track: 56, handle: 68, corner: 16, icon: 24 },
  xl: { track: 96, handle: 108, corner: 28, icon: 32 },
} as const

export type SliderSize = keyof typeof SIZES

const COLORS = {
  primary: "[--slider-active:var(--md-primary)] [--slider-inactive:var(--md-secondary-container)] [--slider-on-active:var(--md-on-primary)]",
  tertiary: "[--slider-active:var(--md-tertiary)] [--slider-inactive:var(--md-tertiary-container)] [--slider-on-active:var(--md-on-tertiary)]",
  error: "[--slider-active:var(--md-error)] [--slider-inactive:var(--md-error-container)] [--slider-on-active:var(--md-on-error)]",
} as const

const DISABLED = [
  "data-disabled:[--slider-active:color-mix(in_srgb,var(--md-on-surface)_38%,transparent)]",
  "data-disabled:[--slider-inactive:color-mix(in_srgb,var(--md-on-surface)_12%,transparent)]",
  "data-disabled:[--slider-on-active:var(--md-surface)]",
].join(" ")

const GAP = 6
const INSIDE = 2
const STOP = 4 // stop indicator size

export interface SliderProps extends Omit<AriaSliderProps<number | number[]>, "children"> {
  size?: SliderSize
  color?: keyof typeof COLORS
  /** Grow from the middle (single value, symmetric ranges like -50…50). */
  centered?: boolean
  /** Dots at each step. Defaults to on when `step` gives ≤ 30 stops. */
  showStops?: boolean
  /** Value pill above the handle. Default "interaction" (while dragging or keyboard-focused). */
  valueIndicator?: "interaction" | "always" | "never"
  /** Icon inset in the track (M and larger). It sits in the active track when it fits, else after the handle. */
  icon?: React.ReactNode
  label?: React.ReactNode
  /** Show the formatted value next to the label. */
  showOutput?: boolean
  trackClassName?: string
}

function Slider({
  size = "xs",
  color = "primary",
  centered = false,
  showStops,
  valueIndicator = "interaction",
  icon,
  label,
  showOutput = false,
  orientation = "horizontal",
  className,
  trackClassName,
  ...props
}: SliderProps) {
  const dims = SIZES[size]
  const vertical = orientation === "vertical"

  return (
    <AriaSlider
      data-slot="slider"
      orientation={orientation}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("group flex gap-2", vertical ? "h-48 flex-col items-center" : "w-full flex-col", COLORS[color], DISABLED, className),
      )}
    >
      {(label || showOutput) && (
        <div className="flex items-center justify-between gap-4 text-body-md text-on-surface">
          {label && <AriaLabel>{label}</AriaLabel>}
          {showOutput && <AriaSliderOutput className="text-title-sm tabular-nums" />}
        </div>
      )}
      <AriaSliderTrack
        className={cn("relative shrink-0 touch-none data-disabled:cursor-default", vertical ? "flex-1" : "w-full", "cursor-pointer", trackClassName)}
        style={vertical ? { width: dims.handle } : { height: dims.handle }}
      >
        {({ state }) => (
          <SliderTrackContent
            state={state}
            dims={dims}
            vertical={vertical}
            centered={centered}
            showStops={showStops}
            valueIndicator={valueIndicator}
            icon={dims.icon ? icon : undefined}
          />
        )}
      </AriaSliderTrack>
    </AriaSlider>
  )
}

type Dims = (typeof SIZES)[SliderSize]
type SliderState = SliderTrackRenderProps["state"]

function SliderTrackContent({
  state,
  dims,
  vertical,
  centered,
  showStops,
  valueIndicator,
  icon,
}: {
  state: SliderState
  dims: Dims
  vertical: boolean
  centered: boolean
  showStops?: boolean
  valueIndicator: "interaction" | "always" | "never"
  icon?: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [length, setLength] = React.useState(0)
  // Thumb fractions run along the value axis; in RTL the horizontal axis starts on the right.
  const { direction } = useLocale()
  const rtl = !vertical && direction === "rtl"
  const start = rtl ? "right" : "left"
  const end = rtl ? "left" : "right"
  const shift = rtl ? "50%" : "-50%"
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setLength(vertical ? e.contentRect.height : e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [vertical])

  const { corner, track } = dims
  /** CSS length of a fraction along the track; the handle never passes the outer corners. */
  const at = (f: number) => `calc(${corner}px + ${f} * (100% - ${2 * corner}px))`
  const px = (f: number) => corner + f * (length - 2 * corner)
  const fracs = state.values.map((_, i) => state.getThumbPercent(i))
  const half = (i: number) => (state.isThumbDragging(i) || state.focusedThumb === i ? 1 : 2)
  const gap = (i: number) => half(i) + GAP
  const before = (i: number) => `calc(${at(fracs[i])} - ${gap(i)}px)`
  const after = (i: number) => `calc(${at(fracs[i])} + ${gap(i)}px)`

  // Segments as [start, end, color, startRadius, endRadius]
  type Seg = [string, string, "active" | "inactive", number, number]
  const segs: Seg[] = []
  if (fracs.length === 2) {
    segs.push(["0px", before(0), "inactive", corner, INSIDE])
    segs.push([after(0), before(1), "active", INSIDE, INSIDE])
    segs.push([after(1), "100%", "inactive", INSIDE, corner])
  } else if (centered) {
    segs.push(["0px", before(0), "inactive", corner, INSIDE])
    segs.push([after(0), "100%", "inactive", INSIDE, corner])
    if (fracs[0] >= 0.5) segs.push(["50%", before(0), "active", INSIDE, INSIDE])
    else segs.push([after(0), "50%", "active", INSIDE, INSIDE])
  } else {
    segs.push(["0px", before(0), "active", corner, INSIDE])
    segs.push([after(0), "100%", "inactive", INSIDE, corner])
  }

  // Active intervals in fraction space, for stop coloring
  const activeRange: [number, number] =
    fracs.length === 2 ? [fracs[0], fracs[1]] : centered ? [Math.min(0.5, fracs[0]), Math.max(0.5, fracs[0])] : [0, fracs[0]]

  const range = state.getThumbMaxValue(fracs.length - 1) - state.getThumbMinValue(0)
  const count = state.step ? Math.round(range / state.step) : 0
  const stops = (showStops ?? (count > 0 && count <= 30)) && count > 0 ? Array.from({ length: count + 1 }, (_, i) => i / count) : []
  const nearThumb = (f: number) => fracs.some((t, i) => Math.abs(px(f) - px(t)) < gap(i) + STOP)
  // End stop indicators on inactive ends, centered one corner-radius in from the edge (Compose)
  const endStops: number[] = []
  if (!stops.length) {
    if (fracs.length === 2 || centered) endStops.push(0)
    endStops.push(1)
  }

  const axis = (from: string, to: string): React.CSSProperties =>
    vertical
      ? { bottom: from, top: `calc(100% - max(${from}, ${to}))`, left: "50%", width: track, transform: "translateX(-50%)" }
      : { [start]: from, [end]: `calc(100% - max(${from}, ${to}))`, top: "50%", height: track, transform: "translateY(-50%)" }
  const radius = (s: number, e: number) =>
    vertical ? `${e}px ${e}px ${s}px ${s}px` : rtl ? `${e}px ${s}px ${s}px ${e}px` : `${s}px ${e}px ${e}px ${s}px`
  const dot = (pos: string): React.CSSProperties =>
    vertical
      ? { bottom: pos, left: "50%", transform: "translate(-50%, 50%)" }
      : { [start]: pos, top: "50%", transform: `translate(${shift}, -50%)` }

  // Inset icon: in the active track when it fits, otherwise just past the handle in the inactive track
  const iconInActive = icon != null && px(fracs[0]) - gap(0) >= dims.icon + 2 * 8
  const iconPos = iconInActive ? "8px" : `calc(${after(0)} + 8px)`

  return (
    <div ref={ref} className="absolute inset-0">
      {segs.map(([s, e, kind, rs, re], i) => (
        <div
          key={i}
          aria-hidden
          className={cn(
            "absolute",
            kind === "active" ? "bg-(--slider-active)" : "bg-(--slider-inactive)",
            "transition-[border-radius] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
          )}
          style={{ ...axis(s, e), borderRadius: radius(rs, re) }}
        />
      ))}

      {stops.map((f) =>
        nearThumb(f) ? null : (
          <span
            key={f}
            aria-hidden
            className={cn(
              "absolute size-1 rounded-full",
              f >= activeRange[0] && f <= activeRange[1] ? "bg-(--slider-inactive)" : "bg-(--slider-active)",
            )}
            style={dot(at(f))}
          />
        ),
      )}
      {endStops.map((f) =>
        nearThumb(f) || (f >= activeRange[0] && f <= activeRange[1]) ? null : (
          <span
            key={`end-${f}`}
            aria-hidden
            className="absolute size-1 rounded-full bg-(--slider-active)"
            style={dot(f === 1 ? `calc(100% - ${corner}px)` : `${corner}px`)}
          />
        ),
      )}

      {icon != null && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute grid place-items-center",
            iconInActive ? "text-(--slider-on-active)" : "text-(--slider-active)",
          )}
          style={{ ...dot(`calc(${iconPos} + ${dims.icon / 2}px)`), "--icon-size": `${dims.icon}px` } as React.CSSProperties}
        >
          {icon}
        </span>
      )}

      {fracs.map((f, i) => (
        <AriaSliderThumb
          key={i}
          index={i}
          className={cn(
            "group/thumb absolute rounded-full bg-(--slider-active) outline-none",
            "transition-[width,height] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
            vertical ? "h-1 data-dragging:h-0.5 data-focus-visible:h-0.5" : "w-1 data-dragging:w-0.5 data-focus-visible:w-0.5",
            // wider hit area
            vertical ? "before:absolute before:-inset-y-2.5 before:inset-x-0" : "before:absolute before:-inset-x-2.5 before:inset-y-0",
            "data-focus-visible:outline-3 data-focus-visible:outline-offset-2 data-focus-visible:outline-secondary",
          )}
          style={{
            ...(vertical
              ? { bottom: at(f), left: "50%", width: dims.handle, transform: "translate(-50%, 50%)" }
              : { [start]: at(f), top: "50%", height: dims.handle, transform: `translate(${shift}, -50%)` }),
          }}
        >
          {valueIndicator !== "never" && (
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute inline-flex h-11 min-w-12 items-center justify-center rounded-full bg-inverse-surface px-4 text-label-lg whitespace-nowrap text-inverse-on-surface tabular-nums",
                vertical ? "top-1/2 left-full ml-3 -translate-y-1/2" : "bottom-full left-1/2 mb-1 -translate-x-1/2",
                "origin-bottom transition-[opacity,scale] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
                valueIndicator === "always"
                  ? "opacity-100"
                  : "scale-50 opacity-0 group-data-dragging/thumb:scale-100 group-data-dragging/thumb:opacity-100 group-data-focus-visible/thumb:scale-100 group-data-focus-visible/thumb:opacity-100",
              )}
            >
              {state.getThumbValueLabel(i)}
            </span>
          )}
        </AriaSliderThumb>
      ))}
    </div>
  )
}

export { Slider }
