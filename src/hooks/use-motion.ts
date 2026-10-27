"use client"

import { useMediaQuery } from "@/hooks/use-media-query"

/*
 * Motion helpers shared by the interaction hooks.
 * Springs come from expressive.css (`--md-spring-<name>` linear() curve + `--md-spring-<name>-duration`),
 * compiled from the M3 Expressive motion scheme.
 */

export type SpringName =
  | "fast-spatial"
  | "default-spatial"
  | "slow-spatial"
  | "fast-effects"
  | "default-effects"
  | "slow-effects"

const FALLBACK: Record<SpringName, [easing: string, ms: number]> = {
  "fast-spatial": ["cubic-bezier(0.34, 1.4, 0.64, 1)", 374],
  "default-spatial": ["cubic-bezier(0.3, 1.15, 0.6, 1)", 414],
  "slow-spatial": ["cubic-bezier(0.3, 1.15, 0.6, 1)", 567],
  "fast-effects": ["cubic-bezier(0.2, 0, 0, 1)", 154],
  "default-effects": ["cubic-bezier(0.2, 0, 0, 1)", 223],
  "slow-effects": ["cubic-bezier(0.2, 0, 0, 1)", 301],
}

/** Easing + duration of an M3 Expressive spring, for the Web Animations API. */
export function springTiming(name: SpringName): { easing: string; duration: number } {
  const [easing, duration] = FALLBACK[name]
  if (typeof window === "undefined") return { easing, duration }
  const cs = getComputedStyle(document.documentElement)
  const curve = cs.getPropertyValue(`--md-spring-${name}`).trim()
  const ms = parseFloat(cs.getPropertyValue(`--md-spring-${name}-duration`))
  return { easing: curve || easing, duration: Number.isFinite(ms) ? ms : duration }
}

/** One-off check, for event handlers and effects. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Reactive `prefers-reduced-motion: reduce`. */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}
