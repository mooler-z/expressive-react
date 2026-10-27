"use client"

import * as React from "react"

/*
 * Dashboard kit · shared data layer.
 * Every chart draws from a seeded generator so "Shuffle data" and the date-range filter
 * re-roll consistently. Cards work standalone (defaults below) or under <DashboardKitProvider>.
 */

export type KitRange = "7D" | "30D" | "90D" | "12M"

export const KIT_RANGES: Record<KitRange, { n: number; name: string; short: string; label: (i: number) => string }> = {
  "7D": { n: 7, name: "last 7 days", short: "week", label: (i) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] },
  "30D": {
    n: 30,
    name: "last 30 days",
    short: "30 days",
    label: (i) => new Date(2026, 8, 27 + i).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  },
  "90D": { n: 13, name: "last 90 days", short: "quarter", label: (i) => "W" + (31 + i) },
  "12M": {
    n: 12,
    name: "last 12 months",
    short: "year",
    label: (i) => new Date(2025, 10 + i, 1).toLocaleDateString("en-US", { month: "short" }),
  },
}

function hash(s: string) {
  let h = 0
  for (const ch of s) h = (Math.imul(31, h) + ch.charCodeAt(0)) | 0
  return h
}

/** Deterministic PRNG (mulberry32) seeded by chart id + global seed + per-chart shuffle count. */
export function seededRandom(id: string, seed = 7, shuffles = 0) {
  let a = (hash(id) + seed * 7919 + shuffles * 104729) >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Smooth noisy series: base + trend·i + amp·sin, clamped at 0. */
export function wave(r: () => number, n: number, base: number, amp: number, trend = 0) {
  const ph = r() * 6
  return Array.from({ length: n }, (_, i) =>
    Math.max(0, Math.round(base + trend * i + amp * Math.sin(i / 1.8 + ph) + amp * 0.6 * (r() - 0.5))),
  )
}

/** 1.2k-style axis label. */
export const kfmt = (v: number) => (Math.abs(v) >= 1000 ? (v / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(v))

export interface DashboardKitState {
  range: KitRange
  setRange: (r: KitRange) => void
  compare: boolean
  setCompare: (on: boolean) => void
  seed: number
  /** Re-roll every chart. */
  shuffleAll: () => void
  /** Re-roll one chart. */
  shuffle: (id: string) => void
  shuffles: Record<string, number>
}

/** Live requests/sec stream (30 one-second samples) shared by the realtime cards. */
export interface KitLiveStream {
  values: number[]
  times: number[]
  paused: boolean
  setPaused: (p: boolean) => void
}

const DEFAULTS: DashboardKitState = {
  range: "30D",
  setRange: () => {},
  compare: false,
  setCompare: () => {},
  seed: 7,
  shuffleAll: () => {},
  shuffle: () => {},
  shuffles: {},
}

const KitContext = React.createContext<DashboardKitState>(DEFAULTS)
// Separate context: the stream ticks every second and must not re-render every chart.
const KitLiveContext = React.createContext<KitLiveStream | null>(null)

/** Filter state shared by every kit card: date range, compare overlay, data seed. */
function DashboardKitProvider({ children, defaultRange = "30D" }: { children: React.ReactNode; defaultRange?: KitRange }) {
  const [range, setRange] = React.useState<KitRange>(defaultRange)
  const [compare, setCompare] = React.useState(false)
  const [seed, setSeed] = React.useState(7)
  const [shuffles, setShuffles] = React.useState<Record<string, number>>({})
  const value = React.useMemo<DashboardKitState>(
    () => ({
      range,
      setRange,
      compare,
      setCompare,
      seed,
      shuffles,
      shuffleAll: () => setSeed((s) => s + 1),
      shuffle: (id) => setShuffles((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 })),
    }),
    [range, compare, seed, shuffles],
  )
  return (
    <KitContext.Provider value={value}>
      <LiveProvider>{children}</LiveProvider>
    </KitContext.Provider>
  )
}

function LiveProvider({ children }: { children: React.ReactNode }) {
  const live = useLiveStream()
  return <KitLiveContext.Provider value={live}>{children}</KitLiveContext.Provider>
}

/** One sample per second, mean-reverting around 1,240 req/s. Pauses while the tab is hidden. */
function useLiveStream(disabled = false) {
  const [paused, setPaused] = React.useState(false)
  const [state, setState] = React.useState(() => {
    const now = Date.now()
    return { values: wave(seededRandom("rt"), 30, 1240, 120), times: Array.from({ length: 30 }, (_, i) => now - (29 - i) * 1000) }
  })
  React.useEffect(() => {
    if (paused || disabled) return
    const t = setInterval(() => {
      if (document.hidden) return
      setState(({ values, times }) => {
        const last = values[values.length - 1] ?? 1240
        const v = Math.round(Math.max(800, Math.min(1700, last + (Math.random() - 0.5) * 180 + (1240 - last) * 0.2)))
        return { values: [...values.slice(1), v], times: [...times.slice(1), Date.now()] }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [paused, disabled])
  return React.useMemo(() => ({ ...state, paused, setPaused }), [state, paused])
}

/** The live requests/sec stream. Outside a provider it runs its own stream. */
function useKitLive(): KitLiveStream {
  const shared = React.useContext(KitLiveContext)
  const own = useLiveStream(shared != null)
  return shared ?? own
}

/** Filter state plus data helpers bound to it. */
function useDashboardKit() {
  const state = React.useContext(KitContext)
  const R = KIT_RANGES[state.range]
  const labels = React.useMemo(() => Array.from({ length: R.n }, (_, i) => R.label(i)), [R])
  const rng = React.useCallback((id: string) => seededRandom(id, state.seed, state.shuffles[id] ?? 0), [state.seed, state.shuffles])
  return { ...state, labels, rangeName: R.name, rangeShort: R.short, rng }
}

export type DashboardKit = ReturnType<typeof useDashboardKit>

export { DashboardKitProvider, useDashboardKit, useKitLive }
