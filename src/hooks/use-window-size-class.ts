"use client"

import * as React from "react"

/*
 * M3 window size classes.
 * compact < 600 · medium 600–839 · expanded 840–1199 · large 1200–1599 · extra-large ≥ 1600
 * Same breakpoints as the Tailwind prefixes in expressive.css (md · lg · xl · 2xl).
 */
export type WindowSizeClass = "compact" | "medium" | "expanded" | "large" | "extra-large"

export const WINDOW_SIZE_CLASSES: { name: WindowSizeClass; min: number }[] = [
  { name: "compact", min: 0 },
  { name: "medium", min: 600 },
  { name: "expanded", min: 840 },
  { name: "large", min: 1200 },
  { name: "extra-large", min: 1600 },
]

export function windowSizeClass(width: number): WindowSizeClass {
  let current: WindowSizeClass = "compact"
  for (const c of WINDOW_SIZE_CLASSES) if (width >= c.min) current = c.name
  return current
}

function subscribe(onChange: () => void) {
  const lists = WINDOW_SIZE_CLASSES.slice(1).map((c) => window.matchMedia(`(min-width: ${c.min}px)`))
  lists.forEach((mq) => mq.addEventListener("change", onChange))
  return () => lists.forEach((mq) => mq.removeEventListener("change", onChange))
}

/**
 * Current window size class, updated only when a breakpoint is crossed.
 * `fallback` is used during SSR (defaults to "compact", mobile first).
 */
export function useWindowSizeClass(fallback: WindowSizeClass = "compact"): WindowSizeClass {
  return React.useSyncExternalStore(
    subscribe,
    () => windowSizeClass(window.innerWidth),
    () => fallback,
  )
}

/** True when the window is at least `size` wide, e.g. `useWindowSizeAtLeast("expanded")`. */
export function useWindowSizeAtLeast(size: WindowSizeClass): boolean {
  const current = useWindowSizeClass()
  const idx = (n: WindowSizeClass) => WINDOW_SIZE_CLASSES.findIndex((c) => c.name === n)
  return idx(current) >= idx(size)
}
