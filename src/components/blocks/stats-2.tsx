"use client"

import { Sparkline } from "@/components/ui/chart"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/*
 * Stats 02 · Target cards
 * Retention and stability cards with a seven-day trend and progress toward this season's target.
 */

const CARDS = [
  { label: "D1 retention", value: "41.2%", target: "Target 42%", pct: 98, note: "0.8 pts below target", met: false, color: "primary", trend: [39.1, 39.8, 40.2, 40.0, 40.9, 41.5, 41.2] },
  { label: "D7 retention", value: "18.6%", target: "Target 20%", pct: 93, note: "1.4 pts below target", met: false, color: "primary", trend: [17.2, 17.5, 17.9, 18.1, 18.0, 18.4, 18.6] },
  { label: "Avg. session", value: "34m", target: "Target 30m", pct: 100, note: "Target met · +4m", met: true, color: "tertiary", trend: [29, 30, 31, 31, 33, 32, 34] },
  { label: "Crash-free sessions", value: "99.62%", target: "Target 99.70%", pct: 89, note: "0.08 pts below target", met: false, color: "error", trend: [99.71, 99.7, 99.72, 99.69, 99.7, 99.64, 99.62] },
]

export function Stats2({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3 bg-surface-container-low p-4 sm:grid-cols-2 md:p-6 xl:grid-cols-4", className)}>
      {CARDS.map((k) => (
        <div key={k.label} className="flex flex-col gap-3 rounded-xl bg-surface p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-body-md text-on-surface-variant">{k.label}</div>
              <div className="mt-1 text-headline-md font-medium tabular-nums">{k.value}</div>
            </div>
            <span className="shrink-0 text-body-sm text-on-surface-variant">{k.target}</span>
          </div>
          <Sparkline data={k.trend} color={k.color} className="h-12 w-full" aria-label={`${k.label}, last 7 days`} />
          <div>
            <div role="meter" aria-label={`${k.label} toward target`} aria-valuenow={k.pct} className="flex h-1.5 items-center gap-1">
              <div
                className={cn("h-full rounded-full", k.met ? "bg-primary" : k.color === "error" ? "bg-error" : "bg-tertiary")}
                style={{ width: `${k.pct}%` }}
              />
              <div className="h-full flex-1 rounded-full bg-secondary-container" />
            </div>
            <div className={cn("mt-2 inline-flex items-center gap-1 text-label-md", k.met ? "text-primary" : "text-on-surface-variant")}>
              <Icon size={16}>{k.met ? "check_circle" : "flag"}</Icon>
              {k.note}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
