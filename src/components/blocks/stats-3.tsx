"use client"

import * as React from "react"

import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/*
 * Stats 03 · Hero metric
 * One number at display size with breakdowns by platform and region.
 * The tabs switch the metric; players online updates live.
 */

type Metric = "online" | "dau" | "revenue"

const PLATFORMS = ["PC", "PlayStation", "Xbox", "Switch", "Mobile"]
const PLATFORM_BARS = ["bg-primary", "bg-tertiary", "bg-primary-fixed-dim", "bg-secondary", "bg-outline"]
const REGIONS = ["NA-East", "EU-West", "APAC-Tokyo", "SA-São Paulo", "OCE-Sydney"]

const STATIC: Record<Exclude<Metric, "online">, { value: string; delta: string; plat: number[]; reg: string[] }> = {
  dau: { value: "1.24M", delta: "+3.1% week over week", plat: [38, 19, 11, 6, 26], reg: ["452k", "401k", "236k", "101k", "50k"] },
  revenue: { value: "$412.8K", delta: "+8.4% vs forecast", plat: [44, 22, 12, 3, 19], reg: ["$171k", "$139k", "$68k", "$22k", "$12k"] },
}

function useLiveCount(initial: number) {
  const [count, setCount] = React.useState(initial)
  React.useEffect(() => {
    const t = setInterval(() => setCount((c) => Math.max(150000, c + Math.round(Math.random() * 2400 - 1000))), 2500)
    return () => clearInterval(t)
  }, [])
  return count
}

export function Stats3({ className }: { className?: string }) {
  const [metric, setMetric] = React.useState<Metric>("online")
  const ccu = useLiveCount(182406)
  const m =
    metric === "online"
      ? {
          value: ccu.toLocaleString("en-US"),
          delta: `+${((ccu / 171690 - 1) * 100).toFixed(1)}% vs last Saturday`,
          plat: [46, 21, 13, 4, 16],
          reg: ["71k", "58k", "33k", "14k", "6k"],
        }
      : STATIC[metric]

  return (
    <div className={cn("space-y-4 bg-surface p-4 md:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-title-lg font-medium">Ember Tactics right now</h4>
        <SegmentedButtonGroup aria-label="Metric" selectedKeys={[metric]} onSelectionChange={(k) => setMetric([...k][0] as Metric)}>
          <SegmentedButton id="online" className="px-3 sm:px-4">
            Players online
          </SegmentedButton>
          <SegmentedButton id="dau" className="px-3 sm:px-4">
            Daily active
          </SegmentedButton>
          <SegmentedButton id="revenue" className="px-3 sm:px-4">
            Revenue today
          </SegmentedButton>
        </SegmentedButtonGroup>
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="flex min-h-[240px] flex-col justify-between gap-6 rounded-xl bg-primary-container p-6 text-on-primary-container">
          <Icon size={32}>insights</Icon>
          <div>
            <div aria-live={metric === "online" ? "polite" : undefined} className="text-display-sm font-semibold tabular-nums md:text-display-lg">
              {m.value}
            </div>
            <div className="mt-2 text-title-md">{m.delta}</div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="rounded-xl bg-surface-container-low p-5">
            <h5 className="text-title-sm">By platform</h5>
            <ul className="mt-3 space-y-2.5">
              {PLATFORMS.map((label, i) => (
                <li key={label} className="grid grid-cols-[84px_minmax(0,1fr)_36px] items-center gap-2 text-body-md">
                  <span className="truncate">{label}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-secondary-container">
                    <span
                      className={cn("block h-full rounded-full transition-[width] duration-(--md-spring-default-spatial-duration) ease-default-spatial", PLATFORM_BARS[i])}
                      style={{ width: `${m.plat[i]}%` }}
                    />
                  </span>
                  <span className="text-right text-on-surface-variant tabular-nums">{m.plat[i]}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-surface-container-low p-5">
            <h5 className="text-title-sm">By region</h5>
            <ul className="mt-2 divide-y divide-outline-variant/60">
              {REGIONS.map((label, i) => (
                <li key={label} className="flex items-center justify-between gap-2 py-1.5 text-body-md">
                  <span className="truncate">{label}</span>
                  <span className="text-on-surface-variant tabular-nums">{m.reg[i]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
