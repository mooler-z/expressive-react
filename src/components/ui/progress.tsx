"use client"

import * as React from "react"
import { ProgressBar as AriaProgressBar, type ProgressBarProps as AriaProgressBarProps } from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { cn, tv } from "@/lib/utils"

/*
 * Progress indicators · M3 Expressive
 * androidx LinearProgressIndicatorTokens / CircularProgressIndicatorTokens:
 *   linear    track 4dp · active 4dp · track–active gap 4dp · stop indicator 4dp
 *             wavy: amplitude 3dp · wavelength 40dp (20dp indeterminate) · height 10dp
 *   circular  40dp · 4dp stroke · gap 4dp · wavy: 48dp, amplitude 1.6dp, wavelength 15dp
 * Values glide on ProgressAnimationSpec (critically damped spring, stiffness 50).
 * Indeterminate circular has no track (spec). Wave travel stops under prefers-reduced-motion.
 */

const GAP = 4
const LINEAR_AMPLITUDE = 3
const CIRCULAR_AMPLITUDE = 1.6
const CIRCULAR_WAVELENGTH = 15

const progressVariants = tv({
  slots: { active: "", track: "", stop: "" },
  variants: {
    tone: {
      primary: { active: "bg-primary text-primary", track: "bg-secondary-container text-secondary-container", stop: "bg-primary" },
      secondary: { active: "bg-secondary text-secondary", track: "bg-secondary-container text-secondary-container", stop: "bg-secondary" },
      tertiary: { active: "bg-tertiary text-tertiary", track: "bg-tertiary-container text-tertiary-container", stop: "bg-tertiary" },
      error: { active: "bg-error text-error", track: "bg-error-container text-error-container", stop: "bg-error" },
      /** On inverse surfaces (snackbars). */
      inverse: { active: "bg-inverse-primary text-inverse-primary", track: "bg-inverse-on-surface/20 text-inverse-on-surface/20", stop: "bg-inverse-primary" },
    },
  },
  defaultVariants: { tone: "primary" },
})

type ProgressStyleProps = VariantProps<typeof progressVariants>

interface BaseProgressProps extends Omit<AriaProgressBarProps, "children" | "className" | "style">, ProgressStyleProps {
  className?: string
  style?: React.CSSProperties
  /** Expressive wavy active indicator. */
  wavy?: boolean
  /** Stroke thickness in px (spec 4; Expressive allows thicker, e.g. 8). */
  thickness?: number
}

const valueTransition = (props: string[]) =>
  props.map((p) => `${p} var(--md-spring-progress-duration) var(--md-spring-progress)`).join(", ")

/** Accessible name fallback so a bare <LinearProgress value={40} /> still announces. */
function useLabel(props: AriaProgressBarProps) {
  return props["aria-label"] ?? (props["aria-labelledby"] || props.children ? undefined : "Progress")
}

/** Sine wave as a repeating mask tile: one wavelength wide, stroke = thickness. */
function waveMask(wavelength: number, thickness: number, amplitude: number): React.CSSProperties {
  const h = thickness + amplitude * 2
  const mid = h / 2
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${wavelength}' height='${h}' viewBox='0 0 ${wavelength} ${h}'><path d='M0 ${mid}Q${wavelength / 4} ${mid - amplitude * 2} ${wavelength / 2} ${mid}T${wavelength} ${mid}' fill='none' stroke='black' stroke-width='${thickness}' stroke-linecap='round'/></svg>`
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  return {
    height: h,
    maskImage: url,
    WebkitMaskImage: url,
    maskRepeat: "repeat-x",
    WebkitMaskRepeat: "repeat-x",
    maskSize: `${wavelength}px ${h}px`,
    WebkitMaskSize: `${wavelength}px ${h}px`,
    ["--md-wavelength" as string]: `${wavelength}px`,
  }
}

export interface LinearProgressProps extends BaseProgressProps {
  /** Dot at the end of the track (determinate only). */
  showStop?: boolean
}

function LinearProgress({ className, style, tone, wavy = false, thickness = 4, showStop = true, ...props }: LinearProgressProps) {
  const { active, track, stop } = progressVariants({ tone })
  const height = wavy ? thickness + LINEAR_AMPLITUDE * 2 : thickness
  return (
    <AriaProgressBar
      data-slot="linear-progress"
      aria-label={useLabel(props)}
      {...props}
      className={cn("w-full", className)}
      style={style}
    >
      {({ percentage = 0, isIndeterminate }) =>
        isIndeterminate ? (
          <div className="relative w-full overflow-hidden" style={{ height }}>
            <div className={cn("absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full", track())} style={{ height: thickness }} />
            {[
              "animate-[md-linear-indeterminate-1_2.1s_cubic-bezier(0.65,0.815,0.735,0.395)_infinite]",
              "animate-[md-linear-indeterminate-2_2.1s_cubic-bezier(0.165,0.84,0.44,1)_1.15s_infinite]",
            ].map((anim) => (
              <div
                key={anim}
                className={cn("absolute top-1/2 -translate-y-1/2", anim, active(), !wavy && "rounded-full")}
                style={wavy ? waveMask(20, thickness, LINEAR_AMPLITUDE) : { height: thickness }}
              />
            ))}
          </div>
        ) : (
          <LinearDeterminate
            pct={percentage}
            wavy={wavy}
            thickness={thickness}
            height={height}
            showStop={showStop}
            classes={{ active: active(), track: track(), stop: stop() }}
          />
        )
      }
    </AriaProgressBar>
  )
}

function LinearDeterminate({
  pct,
  wavy,
  thickness,
  height,
  showStop,
  classes,
}: {
  pct: number
  wavy: boolean
  thickness: number
  height: number
  showStop: boolean
  classes: { active: string; track: string; stop: string }
}) {
  // Compose flattens the wave near the ends (amplitude 0 below 10% and above 95%)
  const waving = wavy && pct > 10 && pct < 95
  const done = pct >= 100
  return (
    <div className="flex w-full items-center" style={{ height }}>
      <div
        data-slot="progress-indicator"
        className={cn(
          "h-full shrink-0",
          classes.active,
          waving ? "animate-[md-wave-travel_1s_linear_infinite] motion-reduce:animate-none" : "rounded-full",
        )}
        style={{
          flexBasis: `${pct}%`,
          transition: valueTransition(["flex-basis"]),
          ...(waving ? waveMask(40, thickness, LINEAR_AMPLITUDE) : { height: thickness }),
        }}
      />
      {!done && (
        <div
          data-slot="progress-track"
          className={cn("relative min-w-0 flex-1 rounded-full", classes.track)}
          style={{ height: thickness, marginLeft: pct > 0 ? GAP : 0 }}
        >
          {showStop && (
            <span
              className={cn("absolute top-1/2 right-0 -translate-y-1/2 rounded-full", classes.stop)}
              style={{ width: thickness, height: thickness }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export interface CircularProgressProps extends BaseProgressProps {
  /** Outer size in px. Spec: 40 (48 when wavy). */
  size?: number
  /** Centered content, e.g. a percentage label. */
  children?: React.ReactNode
}

/** Closed radial-sine path around (c, c). */
function wavyCirclePath(c: number, radius: number, amplitude: number, waves: number) {
  const steps = 360
  let d = ""
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2
    const r = radius + amplitude * Math.sin(waves * t)
    d += `${i ? "L" : "M"}${(c + r * Math.cos(t)).toFixed(2)} ${(c + r * Math.sin(t)).toFixed(2)}`
  }
  return d + "Z"
}

function CircularProgress({ className, style, tone, wavy = false, thickness = 4, size, children, ...props }: CircularProgressProps) {
  const { active, track } = progressVariants({ tone })
  const outer = size ?? (wavy ? 48 : 40)
  const c = outer / 2
  const amplitude = wavy ? CIRCULAR_AMPLITUDE : 0
  const radius = c - thickness / 2 - amplitude
  const circumference = 2 * Math.PI * radius
  const waves = Math.max(3, Math.round(circumference / CIRCULAR_WAVELENGTH))
  const activePath = wavy ? wavyCirclePath(c, radius, amplitude, waves) : undefined
  // Gap measured between the round caps, as a share of the path (pathLength = 100)
  const gap = ((GAP + thickness) / circumference) * 100

  const stroke = { fill: "none", strokeWidth: thickness, strokeLinecap: "round" as const }
  const active_ = (p: React.SVGProps<SVGPathElement> & React.SVGProps<SVGCircleElement>) =>
    activePath ? <path d={activePath} pathLength={100} {...p} /> : <circle cx={c} cy={c} r={radius} pathLength={100} {...p} />

  return (
    <AriaProgressBar
      data-slot="circular-progress"
      aria-label={useLabel(props)}
      {...props}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: outer, height: outer, ...style }}
    >
      {({ percentage = 0, isIndeterminate }) => (
        <>
          <svg
            viewBox={`0 0 ${outer} ${outer}`}
            aria-hidden
            className={cn(
              "absolute inset-0 size-full -rotate-90",
              isIndeterminate && "animate-[md-circular-rotate_2s_linear_infinite]",
            )}
          >
            {isIndeterminate ? (
              active_({ ...stroke, className: cn("stroke-current animate-[md-circular-arc_1.5s_ease-in-out_infinite]", active()) })
            ) : (
              <>
                {percentage < 100 && (
                  <circle
                    cx={c}
                    cy={c}
                    r={radius}
                    pathLength={100}
                    {...stroke}
                    className={cn("stroke-current", track())}
                    style={{
                      strokeDasharray: `${Math.max(0, 100 - percentage - (percentage > 0 ? gap * 2 : 0))} 100`,
                      strokeDashoffset: percentage > 0 ? -(percentage + gap) : 0,
                      transition: valueTransition(["stroke-dasharray", "stroke-dashoffset"]),
                    }}
                  />
                )}
                {active_({
                  ...stroke,
                  className: cn("stroke-current", active()),
                  style: {
                    strokeDasharray: `${percentage} 100`,
                    opacity: percentage > 0 ? 1 : 0,
                    transition: valueTransition(["stroke-dasharray"]),
                  },
                })}
              </>
            )}
          </svg>
          {children != null && <span className="relative text-label-lg tabular-nums">{children}</span>}
        </>
      )}
    </AriaProgressBar>
  )
}

export { CircularProgress, LinearProgress, progressVariants }
