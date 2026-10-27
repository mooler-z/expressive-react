"use client"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { AdoptionChart, FunnelChart, LatencyChart, TrafficChart } from "./admin-charts"
import { useAdmin } from "./admin-context"
import { AVATAR_TONES, RANGES, rng, series } from "./admin-data"
import { Card, CardHead, PageHeader, RangePicker } from "./admin-ui"

const REQUESTS = { "7d": "284M", "30d": "1.2B", "90d": "3.5B", "12m": "13.9B" }
const WEEKS = ["W0", "W1", "W2", "W3", "W4", "W5", "W6", "W7"]
const COHORTS = ["Aug 31", "Sep 7", "Sep 14", "Sep 21", "Sep 28", "Oct 5", "Oct 12"].map((label, ci) => {
  const r = rng("c" + ci)
  let v = 100
  return {
    label,
    cells: Array.from({ length: 8 }, (_, w) => {
      if (w > 7 - ci) return { text: "", cls: "bg-surface-container" }
      if (w > 0) v = Math.round(v * (0.78 + r() * 0.14))
      const cls =
        v >= 90
          ? "bg-primary text-on-primary"
          : v >= 70
            ? "bg-primary/80 text-on-primary"
            : v >= 55
              ? "bg-primary/60 text-on-primary"
              : v >= 40
                ? "bg-primary/40 text-on-surface"
                : v >= 25
                  ? "bg-primary/25 text-on-surface"
                  : "bg-primary/10 text-on-surface"
      return { text: v + "%", cls }
    }),
  }
})
const TOP = (
  [
    ["Halide Bank", 2.4, "+18%"],
    ["Meridian Health", 1.9, "+9%"],
    ["Tessera Logistics", 1.6, "+24%"],
    ["Quorum Energy", 1.2, "−3%"],
    ["Northwind", 0.96, "+11%"],
    ["Atlas Freight", 0.74, "+6%"],
  ] as const
).map(([name, arr, growth], i) => ({
  name,
  initials: name
    .split(" ")
    .map((x) => x[0])
    .join(""),
  arr: "$" + arr + "M",
  pct: Math.round((arr / 2.4) * 100),
  growth,
  avatarCls: AVATAR_TONES[i % 4],
}))

export function AdminAnalytics() {
  const { range, compare, setCompare } = useAdmin()
  const R = RANGES[range]
  const deploys = series("k2", 100, 40, 0.012, R.n, range).reduce((a, b) => a + b, 0) * 6 * R.mult
  const stats = [
    ["Deployments", deploys.toLocaleString("en-US"), "all regions", "bg-primary text-on-primary"],
    ["API requests", REQUESTS[range], "p95 182 ms", "bg-surface-container-low"],
    ["Error rate", "0.04%", "−0.01 vs. previous", "bg-tertiary-container text-on-tertiary-container"],
    ["Signup → paid", "9.0%", "+1.2 pts vs. previous", "bg-surface-container-low"],
  ]
  return (
    <div data-page>
      <PageHeader
        title="Analytics"
        description={`Platform usage, performance and conversion for the last ${R.label}.`}
        actions={
          <>
            <RangePicker />
            <Switch
              isSelected={compare}
              onChange={setCompare}
              className="h-10 flex-row-reverse gap-3 rounded-full border border-outline-variant pr-2 pl-4 text-label-lg text-on-surface-variant"
            >
              Compare
            </Switch>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, sub, cls]) => (
          <div key={label} className={cn("rounded-xl p-5", cls)}>
            <div className="text-body-md opacity-80">{label}</div>
            <div className="mt-1 text-headline-md font-medium tabular-nums">{value}</div>
            <div className="mt-1 text-body-sm opacity-80">{sub}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="Deployments by region" description="Stacked, per period" />
          <div className="relative mt-4 h-72">
            <TrafficChart range={range} compare={compare} />
          </div>
        </Card>
        <Card>
          <CardHead title="Feature adoption" description="This quarter vs. last" />
          <div className="relative mt-2 h-72">
            <AdoptionChart />
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHead title="API latency" description="p50 · p95 · p99 in ms" />
          <div className="relative mt-4 h-64">
            <LatencyChart range={range} compare={compare} />
          </div>
        </Card>
        <Card>
          <CardHead title="Activation funnel" description="Signup → paid" />
          <div className="relative mt-4 h-64">
            <FunnelChart />
          </div>
        </Card>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card>
          <CardHead title="Weekly retention by signup cohort" description="Share of workspaces still deploying" />
          <div className="relative mt-4 overflow-x-auto">
            <div className="grid min-w-[560px] grid-cols-[96px_repeat(8,minmax(0,1fr))] gap-1 text-center text-label-md">
              <span />
              {WEEKS.map((w) => (
                <span key={w} className="py-1 text-on-surface-variant">
                  {w}
                </span>
              ))}
              {COHORTS.map((c) => [
                <span key={c.label} className="py-2 text-left text-on-surface-variant">
                  {c.label}
                </span>,
                ...c.cells.map((v, i) => (
                  <span key={c.label + i} className={cn("rounded-xs py-2 tabular-nums transition-transform hover:scale-105", v.cls)}>
                    {v.text}
                  </span>
                )),
              ])}
            </div>
          </div>
        </Card>
        <div className="overflow-hidden rounded-xl bg-surface-container-low">
          <div className="p-5 pb-3">
            <CardHead title="Top customers" description="By annual recurring revenue" />
          </div>
          {TOP.map((c) => (
            <div key={c.name} className="flex items-center gap-3 border-t border-outline-variant/60 px-5 py-3">
              <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-label-lg", c.avatarCls)}>{c.initials}</span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2 text-body-md">
                  <span className="truncate font-medium">{c.name}</span>
                  <span className="tabular-nums">{c.arr}</span>
                </div>
                <div className="mt-1.5 flex h-1.5 items-center gap-1">
                  <div className="h-full rounded-full bg-primary" style={{ width: c.pct + "%" }} />
                  <div className="h-full flex-1 rounded-full bg-secondary-container" />
                </div>
              </div>
              <span className={cn("w-14 text-right text-label-md", c.growth.startsWith("−") ? "text-error" : "text-tertiary")}>{c.growth}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
