"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * M3 Expressive shape library.
 * Every shape is a 120-point polygon, so CSS can transition `clip-path` between any two of them.
 */
const N = 120
const TAU = Math.PI * 2

const poly = (m: number, round: number) => (t: number) => {
  const a = TAU / m
  const r = Math.cos(Math.PI / m) / Math.cos((((t % a) + a) % a) - Math.PI / m)
  return (1 - round) * r + round
}

const radii = {
  circle: () => 1,
  oval: (t: number) => 1 / Math.sqrt(Math.cos(t) ** 2 + (Math.sin(t) / 0.72) ** 2),
  squircle: (t: number) => (Math.abs(Math.cos(t)) ** 4 + Math.abs(Math.sin(t)) ** 4) ** -0.25,
  triangle: poly(3, 0.22),
  diamond: (t: number) => poly(4, 0.18)(t + Math.PI / 4),
  pentagon: poly(5, 0.18),
  hexagon: poly(6, 0.16),
  cookie4: (t: number) => 1 + 0.12 * Math.cos(4 * t),
  cookie6: (t: number) => 1 + 0.1 * Math.cos(6 * t),
  cookie7: (t: number) => 1 + 0.09 * Math.cos(7 * t),
  cookie9: (t: number) => 1 + 0.08 * Math.cos(9 * t),
  cookie12: (t: number) => 1 + 0.07 * Math.cos(12 * t),
  clover4: (t: number) => 0.74 + 0.26 * Math.cos(4 * t),
  clover8: (t: number) => 0.84 + 0.16 * Math.cos(8 * t),
  sunny: (t: number) => 0.86 + 0.14 * Math.abs(Math.cos(8 * t)) ** 2.5,
  verySunny: (t: number) => 0.82 + 0.18 * Math.abs(Math.cos(12 * t)) ** 2.5,
  burst: (t: number) => 0.84 + 0.16 * Math.abs(Math.cos(10 * t)),
  softBurst: (t: number) => 0.9 + 0.1 * Math.abs(Math.cos(5 * t)),
  puffy: (t: number) => 0.9 + 0.1 * Math.cos(6 * t) ** 2,
  gem: (t: number) => poly(6, 0.08)(t + Math.PI / 6),
  arch: (t: number) => {
    const y = Math.sin(t)
    return y < 0 ? (1 / Math.max(Math.abs(Math.cos(t)), Math.abs(y))) * 0.92 : 1
  },
} satisfies Record<string, (t: number) => number>

export type ShapeName = keyof typeof radii

export const shapeNames = Object.keys(radii) as ShapeName[]

const cache = new Map<ShapeName, string>()

/** CSS `polygon(...)` for a shape, normalised to fill a square box. */
export function shapePolygon(name: ShapeName): string {
  const hit = cache.get(name)
  if (hit) return hit
  const f = radii[name] ?? radii.circle
  const rs = Array.from({ length: N }, (_, i) => f((i / N) * TAU))
  const max = Math.max(...rs)
  const pts = rs.map((r, i) => {
    const t = (i / N) * TAU
    const k = (r / max) * 50
    return `${(50 + k * Math.cos(t)).toFixed(2)}% ${(50 + k * Math.sin(t)).toFixed(2)}%`
  })
  const out = `polygon(${pts.join(", ")})`
  cache.set(name, out)
  return out
}

export interface ShapeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Resting shape. */
  shape?: ShapeName
  /** Morph through these shapes on a timer (overrides `shape`). */
  cycle?: ShapeName[]
  /** Milliseconds between `cycle` steps. */
  interval?: number
  /** Shape to morph to while hovered. */
  hoverShape?: ShapeName
  /** Morph duration in ms. Defaults to 80% of `interval`, capped at 900. */
  morphDuration?: number
}

/** A solid M3 shape filled with `currentColor`. Size it with `size-*`, color it with `text-*`. */
function Shape({
  shape = "circle",
  cycle,
  interval = 2400,
  hoverShape,
  morphDuration,
  className,
  style,
  onPointerEnter,
  onPointerLeave,
  ...props
}: ShapeProps) {
  const [step, setStep] = React.useState(0)
  const [hovered, setHovered] = React.useState(false)
  const cycleKey = cycle?.join(",")

  React.useEffect(() => {
    if (!cycleKey) return
    const t = setInterval(() => setStep((s) => s + 1), interval)
    return () => clearInterval(t)
  }, [cycleKey, interval])

  const current = hovered && hoverShape ? hoverShape : cycle?.length ? cycle[step % cycle.length] : shape
  const duration = morphDuration ?? Math.min(900, interval * 0.8)

  return (
    <div
      data-slot="shape"
      className={cn("aspect-square bg-current", className)}
      style={{
        clipPath: shapePolygon(current),
        transition: `clip-path ${duration}ms var(--md-easing-spring)`,
        ...style,
      }}
      onPointerEnter={(e) => {
        if (hoverShape) setHovered(true)
        onPointerEnter?.(e)
      }}
      onPointerLeave={(e) => {
        setHovered(false)
        onPointerLeave?.(e)
      }}
      {...props}
    />
  )
}

export { Shape }
