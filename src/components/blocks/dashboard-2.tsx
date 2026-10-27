"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Dashboard 02 · Live-ops bento
 * Bento layout for incident days: a live player counter, open incidents, queue times per playlist,
 * region status and the build rollout.
 */

const BASELINE = 171690

const QUEUES = [
  { name: "Ranked", p50: 38, p95: 92 },
  { name: "Quick play", p50: 12, p95: 31 },
  { name: "Co-op", p50: 21, p95: 55 },
  { name: "Arena (beta)", p50: 64, p95: 140 },
]
const QUEUE_MAX = 140

const REGIONS = [
  { name: "NA-East", ms: "38 ms", degraded: false },
  { name: "EU-West", ms: "24 ms", degraded: false },
  { name: "APAC-Tokyo", ms: "41 ms", degraded: false },
  { name: "SA-São Paulo", ms: "96 ms", degraded: true },
  { name: "OCE-Sydney", ms: "52 ms", degraded: false },
]

const STAGES = [
  { label: "Canary", fill: 100 },
  { label: "10%", fill: 100 },
  { label: "50%", fill: 60, current: true },
  { label: "100%", fill: 0 },
]

/** Live player count that drifts like a real feed. */
function useLiveCount(initial: number) {
  const [count, setCount] = React.useState(initial)
  React.useEffect(() => {
    const t = setInterval(() => setCount((c) => Math.max(150000, c + Math.round(Math.random() * 2400 - 1000))), 2500)
    return () => clearInterval(t)
  }, [])
  return count
}

export function Dashboard2({ className }: { className?: string }) {
  const ccu = useLiveCount(182406)
  const [ack, setAck] = React.useState<"idle" | "busy" | "done">("idle")
  const delta = ((ccu / BASELINE - 1) * 100).toFixed(1)

  React.useEffect(() => {
    if (ack !== "busy") return
    const t = setTimeout(() => setAck("done"), 1400)
    return () => clearTimeout(t)
  }, [ack])

  return (
    <div className={cn("grid gap-3 bg-surface-container p-3 md:p-4 lg:grid-cols-4", className)}>
      <div className="flex flex-col justify-between gap-6 rounded-xl bg-inverse-surface p-5 text-inverse-on-surface lg:col-span-2 lg:row-span-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-label-lg">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-inverse-primary opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-2.5 rounded-full bg-inverse-primary" />
            </span>
            Live · Ember Tactics
          </span>
          <span className="text-body-sm opacity-80">Updates every 2.5s</span>
        </div>
        <div>
          <div className="text-body-lg opacity-80">Players online now</div>
          <div aria-live="polite" className="mt-1 text-display-md font-semibold tabular-nums lg:text-display-lg">
            {ccu.toLocaleString("en-US")}
          </div>
          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-inverse-primary px-3 py-1 text-label-lg text-inverse-surface">
            <Icon size={18}>trending_up</Icon>+{delta}% vs last Saturday
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-3 border-t border-inverse-on-surface/20 pt-4">
          {[
            ["Peak today", "214,880"],
            ["In a match", "71%"],
            ["Server fill", "68%"],
          ].map(([dt, dd]) => (
            <div key={dt}>
              <dt className="text-body-sm opacity-80">{dt}</dt>
              <dd className="text-title-lg tabular-nums">{dd}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-xl bg-surface p-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h5 className="text-title-md">Incidents</h5>
          <span className="inline-flex h-6 items-center rounded-sm bg-error-container px-2 text-label-md text-on-error-container">1 active</span>
        </div>
        <div className="mt-3 rounded-lg border border-error/40 p-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-error text-on-error">
              <Icon size={20} filled>
                warning
              </Icon>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-title-sm">Elevated login errors · SA-São Paulo</div>
              <div className="text-body-sm text-on-surface-variant">SEV-2 · started 14 min ago · 3.8% of auth requests failing</div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 sm:pl-[52px]">
            <Button
              size="xs"
              className="h-9 bg-error px-4 text-on-error"
              isPending={ack === "busy"}
              isDisabled={ack === "done"}
              onPress={() => setAck("busy")}
            >
              {ack === "idle" ? "Acknowledge" : ack === "busy" ? "Paging on-call…" : "Acknowledged"}
            </Button>
            <Button variant="outlined" size="xs" className="h-9 px-4" onPress={() => snackbar("Runbook auth-latency-sa opened")}>
              Runbook
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-body-md text-on-surface-variant">
          <Icon size={20} className="text-primary">
            check_circle
          </Icon>
          <span className="flex-1">Store purchase delays · resolved yesterday, 22:41 UTC</span>
        </div>
      </div>

      <div className="rounded-xl bg-surface p-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h5 className="text-title-md">Matchmaking queues</h5>
          <div className="flex gap-3 text-body-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary" />
              p50
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary-fixed-dim" />
              p95
            </span>
          </div>
        </div>
        <ul className="mt-3 space-y-3">
          {QUEUES.map((q) => (
            <li key={q.name} className="grid grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-3 text-body-md">
              <span className="truncate">{q.name}</span>
              <span className="relative h-2 rounded-full bg-secondary-container">
                <span className="absolute inset-y-0 left-0 rounded-full bg-primary-fixed-dim" style={{ width: `${Math.round((q.p95 / QUEUE_MAX) * 100)}%` }} />
                <span className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${Math.round((q.p50 / QUEUE_MAX) * 100)}%` }} />
              </span>
              <span className="text-right font-mono text-body-sm whitespace-nowrap text-on-surface-variant">
                {q.p50}s / {q.p95}s
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl bg-surface p-5 lg:col-span-2">
        <h5 className="text-title-md">Regions</h5>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {REGIONS.map((r) => (
            <div
              key={r.name}
              className={cn("rounded-lg p-3", r.degraded ? "bg-error-container text-on-error-container" : "bg-surface-container-high text-on-surface")}
            >
              <div className="flex items-center gap-2 text-title-sm">
                <span className={cn("size-2 shrink-0 rounded-full", r.degraded ? "animate-pulse bg-error" : "bg-primary")} />
                <span className="truncate">{r.name}</span>
              </div>
              <div className="mt-1 font-mono text-body-sm opacity-80">
                {r.ms} · {r.degraded ? "Degraded" : "Healthy"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-surface p-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h5 className="text-title-md">Build 7.2.1 rollout</h5>
          <span className="text-label-lg text-primary">50% of players</span>
        </div>
        <ol className="mt-4 grid grid-cols-4 gap-2 text-center text-label-md">
          {STAGES.map((s) => (
            <li key={s.label} aria-current={s.current ? "step" : undefined}>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary-container">
                <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${s.fill}%` }} />
              </div>
              <div className={cn("mt-2", s.current ? "text-on-surface" : "text-on-surface-variant")}>{s.label}</div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="min-w-0 flex-1 text-body-sm text-on-surface-variant">Crash rate 0.38% · guardrail 0.5%</span>
          <Button
            variant="outlined"
            size="xs"
            className="h-9 px-4"
            onPress={() => snackbar("Rollout paused at 50%", { action: { label: "Resume", onAction: () => {} } })}
          >
            Pause
          </Button>
          <Button
            size="xs"
            className="h-9 px-4"
            onPress={() => snackbar("Promoting 7.2.1 to all players", { action: { label: "Undo", onAction: () => {} } })}
          >
            Promote
          </Button>
        </div>
      </div>
    </div>
  )
}
