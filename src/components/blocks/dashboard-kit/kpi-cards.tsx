"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, YAxis } from "recharts"

import { ChartContainer } from "@/components/ui/chart"
import { Icon } from "@/components/ui/icon"
import { Shape } from "@/components/ui/shape"
import { useTilt } from "@/hooks/use-tilt"

import { c } from "./kit-chart-parts"
import { type DashboardKit, useDashboardKit, useKitLive, wave } from "./kit-data"

/*
 * KPI & stat cards · 24 cards: sparkline KPIs, goal and budget meters, a live counter,
 * shape-badge stats, a countdown, segmented storage and a 15-metric strip.
 */

type SparkDef = { type: "line" | "bar" | "area" | "stepped"; role: string; data: (k: DashboardKit) => number[] }

/** [id, label, value, delta, good, type, role, base, amp, trend, footer] — straight from the kit. */
const SPARK_ROWS = [
  ["kp-mrr", "MRR", "$106.4k", "+4.2%", 1, "line", "primary", 60, 10, 1, "vs last month"],
  ["kp-signups", "Signups", "2,481", "+18%", 1, "bar", "tertiary", 40, 15, 0, "this week"],
  ["kp-churn", "Churn", "1.9%", "−0.5 pt", 1, "line", "tertiary", 30, 6, -0.5, "trailing 30 days"],
  ["kp-tickets", "Open tickets", "41", "+6", 0, "bar", "error", 30, 10, 0.3, "4 marked urgent"],
  ["kp-cost", "Cloud spend", "$212k", "+7.1%", 0, "area", "secondary", 50, 10, 0.6, "forecast $224k"],
  ["kp-uptime", "Uptime", "99.98%", "+0.01", 1, "stepped", "primary", 90, 4, 0, "SLO 99.95%"],
  ["kp-ttfb", "TTFB", "142 ms", "−9%", 1, "line", "primary", 60, 12, -0.6, "p75, global"],
  ["kp-nps", "NPS", "62", "+3", 1, "bar", "tertiary", 50, 8, 0.4, "412 responses"],
] as const

const KPI_SPARKS = SPARK_ROWS.map(([id, label, value, delta, good, , , , , , foot]) => ({
  id,
  label,
  value,
  delta,
  foot,
  dIcon: delta.startsWith("+") ? "trending_up" : "trending_down",
  dCls: good ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container",
}))

const SPARKS: Record<string, SparkDef> = {
  "spark-rev": { type: "line", role: "primary", data: (k) => wave(k.rng("sr"), k.labels.length, 60, 12, 0.8) },
  "spark-dep": { type: "bar", role: "primary", data: (k) => wave(k.rng("sd"), Math.min(14, k.labels.length * 2), 40, 14) },
  "spark-err": { type: "line", role: "tertiary", data: (k) => wave(k.rng("se"), k.labels.length, 180, 20) },
  ...Object.fromEntries(
    SPARK_ROWS.map(([id, , , , , type, role, base, amp, trend]) => [
      id,
      { type, role, data: (k: DashboardKit) => wave(k.rng(id), type === "bar" ? 14 : k.labels.length, base, amp, trend) },
    ]),
  ),
}

const STRIP = [
  ["MRR", "$106.4k", "+4.2%", "text-tertiary"],
  ["Churn", "1.9%", "−0.5 pt", "text-tertiary"],
  ["NPS", "62", "+3", "text-tertiary"],
  ["Open tickets", "41", "+6", "text-error"],
  ["Avg. MTTR", "18 min", "−4 min", "text-tertiary"],
  ["ARR", "$4.8M", "+11%", "text-tertiary"],
  ["CAC", "$1,240", "−6%", "text-tertiary"],
  ["LTV", "$38k", "+9%", "text-tertiary"],
  ["Gross margin", "64%", "+2 pt", "text-tertiary"],
  ["Burn", "$410k", "+3%", "text-error"],
  ["Deploys / day", "42", "+8", "text-tertiary"],
  ["Change failure", "2.4%", "−0.6 pt", "text-tertiary"],
  ["Lead time", "3.1 h", "−40 min", "text-tertiary"],
  ["Alerts", "128", "+14", "text-error"],
  ["Seats", "6,412", "+212", "text-tertiary"],
].map(([label, value, delta, cls]) => ({ label, value, delta, cls, span: "" }))

/** Axis-less KPI sparkline (line, area, stepped or bars), following the filter bar. */
function Spark({ id, "aria-label": ariaLabel }: { id: string; "aria-label"?: string }) {
  const kit = useDashboardKit()
  const def = SPARKS[id]
  const data = def.data(kit).map((v, i) => ({ i, v }))
  return (
    <ChartContainer config={{}} role="img" aria-label={ariaLabel} className="aspect-auto size-full">
      {def.type === "bar" ? (
        <BarChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }} barCategoryGap="12%">
          <YAxis hide domain={[0, "dataMax"]} />
          <Bar dataKey="v" fill={c(def.role, 0.75)} radius={[2, 2, 2, 2]} />
        </BarChart>
      ) : (
        <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Area
            type={def.type === "stepped" ? "stepAfter" : "monotone"}
            dataKey="v"
            stroke={c(def.role)}
            strokeWidth={2}
            fill={c(def.role, def.type === "area" ? 0.3 : 0.12)}
            fillOpacity={1}
            dot={false}
          />
        </AreaChart>
      )}
    </ChartContainer>
  )
}

/** Inverse-surface live counter; ticks with the shared stream. */
function LiveRpsCard() {
  const live = useKitLive()
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-xl bg-inverse-surface p-5 text-inverse-on-surface">
      <div className="flex items-center justify-between gap-2">
        <span className="text-label-lg opacity-80">Requests / sec</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-inverse-on-surface/10 px-2 py-0.5 text-label-md">
          <span className={`size-2 rounded-full bg-inverse-primary ${live.paused ? "" : "animate-pulse"}`} />
          {live.paused ? "Paused" : "Live"}
        </span>
      </div>
      <div className="text-display-sm font-medium tabular-nums">{live.values[live.values.length - 1].toLocaleString("en-US")}</div>
      <div className="mt-auto text-body-sm opacity-80">Peak 1,612 today · 12 regions</div>
    </div>
  )
}

/** "KPI & stat cards" section. */
function KpiCards({ className }: { className?: string }) {
  const kit = useDashboardKit()
  const tilt = React.useRef<HTMLDivElement>(null)
  useTilt(tilt, { max: 5 })
  return (
    <section id="kpi" className={className ?? "scroll-mt-36 pt-8"} data-toc>
      <h2 className="text-headline-lg font-semibold">KPI & stat cards</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex min-w-0 flex-col gap-2 rounded-xl bg-surface-container-low p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-label-lg text-on-surface-variant">Revenue</span>
            <span className="inline-flex items-center gap-0.5 rounded-sm bg-tertiary-container px-1.5 py-0.5 text-label-md text-on-tertiary-container">
              <Icon size={16}>trending_up</Icon>12.4%
            </span>
          </div>
          <div className="text-headline-lg font-medium tabular-nums">$1.28M</div>
          <div className="relative h-12">
            <Spark id="spark-rev" aria-label="Revenue trend" />
          </div>
          <div className="text-body-sm text-on-surface-variant">vs previous {kit.rangeShort}</div>
        </div>{" "}
        <div className="flex min-w-0 flex-col gap-2 rounded-xl bg-surface-container-low p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-label-lg text-on-surface-variant">Deploys</span>
            <span className="inline-flex items-center gap-0.5 rounded-sm bg-tertiary-container px-1.5 py-0.5 text-label-md text-on-tertiary-container">
              <Icon size={16}>trending_up</Icon>38%
            </span>
          </div>
          <div className="text-headline-lg font-medium tabular-nums">1,284</div>
          <div className="relative h-12">
            <Spark id="spark-dep" aria-label="Deploys per day" />
          </div>
          <div className="text-body-sm text-on-surface-variant">97.6% succeeded first try</div>
        </div>{" "}
        <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-surface-container-low p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-label-lg text-on-surface-variant">ARR goal</span>
            <span className="rounded-sm bg-primary px-2 py-0.5 text-label-md text-on-primary">On track</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg font-medium tabular-nums">$4.8M</span>
            <span className="text-body-md text-on-surface-variant">of $6.2M</span>
          </div>
          <div className="flex h-3 items-center gap-1">
            <div className="h-full w-[77%] rounded-l-full rounded-r-xs bg-primary"></div>
            <div className="relative h-full flex-1 rounded-l-xs rounded-r-full bg-secondary-container">
              <span className="absolute right-1 top-1/2 size-1 -translate-y-1/2 rounded-full bg-primary"></span>
            </div>
          </div>
          <div className="flex justify-between text-body-sm text-on-surface-variant">
            <span>77% reached</span>
            <span>64 days left</span>
          </div>
        </div>{" "}
        <div className="flex min-w-0 items-center gap-4 rounded-xl bg-surface-container-low p-5">
          <div className="relative size-24 shrink-0">
            <svg viewBox="0 0 48 48" className="size-24 -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" className="stroke-surface-container-highest" strokeWidth="5"></circle>
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                className="stroke-tertiary"
                strokeWidth="5"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="62 100"
              ></circle>
            </svg>
            <span className="absolute inset-0 grid place-items-center text-title-md tabular-nums">62%</span>
          </div>
          <div className="min-w-0">
            <div className="text-label-lg text-on-surface-variant">Error budget left</div>
            <div className="mt-1 text-headline-sm font-medium tabular-nums">99.95%</div>
            <div className="text-body-sm text-on-surface-variant">SLO · 30-day window</div>
          </div>
        </div>{" "}
        <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-surface-container-low p-5">
          {" "}
          <span className="text-label-lg text-on-surface-variant">Active users</span>{" "}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-headline-sm font-medium tabular-nums">18,204</div>
              <div className="text-body-sm text-on-surface-variant">This period</div>
            </div>
            <div>
              <div className="text-headline-sm tabular-nums text-on-surface-variant">16,930</div>
              <div className="text-body-sm text-on-surface-variant">Previous</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-primary"></div>
            <div className="h-2 w-[93%] rounded-full bg-primary/35"></div>
          </div>
          <div className="flex items-center gap-1 text-label-md text-tertiary">
            <Icon size={16}>arrow_upward</Icon>+7.5% · 1,274 more
          </div>
        </div>{" "}
        <LiveRpsCard />{" "}
        <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-surface-container-low p-5">
          {" "}
          <span className="text-label-lg text-on-surface-variant">API latency</span>{" "}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-label-md text-on-surface-variant">p50</div>
              <div className="text-title-lg tabular-nums">
                74<span className="text-body-sm text-on-surface-variant">ms</span>
              </div>
              <div className="mt-2 h-1.5 w-1/3 rounded-full bg-primary"></div>
            </div>
            <div>
              <div className="text-label-md text-on-surface-variant">p95</div>
              <div className="text-title-lg tabular-nums">
                182<span className="text-body-sm text-on-surface-variant">ms</span>
              </div>
              <div className="mt-2 h-1.5 w-2/3 rounded-full bg-tertiary"></div>
            </div>
            <div>
              <div className="text-label-md text-on-surface-variant">p99</div>
              <div className="text-title-lg tabular-nums">
                318<span className="text-body-sm text-on-surface-variant">ms</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-error"></div>
            </div>
          </div>{" "}
          <div className="relative h-10">
            <Spark id="spark-err" aria-label="p95 trend" />
          </div>
        </div>{" "}
        <div
          className="relative flex min-w-0 flex-col justify-between overflow-hidden rounded-xl bg-tertiary-container p-5 text-on-tertiary-container"
          ref={tilt}
        >
          {" "}
          <div className="pointer-events-none absolute -right-6 -top-6 size-32 animate-[spin_40s_linear_infinite]">
            <Shape className="size-full text-tertiary/20" shape="cookie9" cycle={["cookie9", "sunny", "clover4"]} interval={2800} />
          </div>{" "}
          <span className="relative text-label-lg">Incidents this week</span>{" "}
          <div className="relative mt-3 flex items-end gap-3">
            <span className="text-display-md font-semibold tabular-nums">0</span>
            <span className="pb-2 text-body-md">Quietest week since March</span>
          </div>
        </div>{" "}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_SPARKS.map((k) => (
          <React.Fragment key={k.id}>
            <div className="flex min-w-0 flex-col gap-2 rounded-xl bg-surface-container-low p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-label-lg text-on-surface-variant">{k.label}</span>
                <span className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm px-1.5 py-0.5 text-label-md ${k.dCls}`}>
                  <Icon size={16}>{k.dIcon}</Icon>
                  {k.delta}
                </span>
              </div>
              <div className="text-headline-md font-medium tabular-nums">{k.value}</div>
              <div className="relative h-10">
                <Spark id={k.id} aria-label={`${k.label} trend`} />
              </div>
              <div className="text-body-sm text-on-surface-variant">{k.foot}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex min-w-0 items-center gap-4 rounded-xl bg-surface-container-low p-5">
          <span className="relative grid size-16 shrink-0 place-items-center">
            <Shape
              className="absolute inset-0 size-16 text-primary-container"
              shape="clover4"
              cycle={["clover4", "cookie7", "sunny"]}
              interval={3000}
            />
            <Icon size={28} className="relative text-on-primary-container">
              dns
            </Icon>
          </span>
          <div className="min-w-0">
            <div className="text-label-lg text-on-surface-variant">Clusters</div>
            <div className="text-headline-md font-medium tabular-nums">48</div>
            <div className="text-body-sm text-tertiary">+2 this month</div>
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-2 divide-x divide-outline-variant rounded-xl bg-surface-container-low py-5">
          <div className="px-5">
            <div className="flex items-center gap-1 text-label-lg text-on-surface-variant">
              <Icon size={18} className="text-primary">
                south_west
              </Icon>
              Ingress
            </div>
            <div className="mt-1 text-headline-sm font-medium tabular-nums">8.4 TB</div>
            <div className="text-body-sm text-on-surface-variant">+6% vs prior</div>
          </div>
          <div className="px-5">
            <div className="flex items-center gap-1 text-label-lg text-on-surface-variant">
              <Icon size={18} className="text-tertiary">
                north_east
              </Icon>
              Egress
            </div>
            <div className="mt-1 text-headline-sm font-medium tabular-nums">3.1 TB</div>
            <div className="text-body-sm text-on-surface-variant">−2% vs prior</div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-xl bg-surface-container-low p-5">
          <span className="text-label-lg text-on-surface-variant">Customer satisfaction</span>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-lg font-medium tabular-nums">4.7</span>
            <span className="text-body-md text-on-surface-variant">/ 5</span>
          </div>
          <div className="flex text-primary">
            <Icon size={20} filled>
              star
            </Icon>
            <Icon size={20} filled>
              star
            </Icon>
            <Icon size={20} filled>
              star
            </Icon>
            <Icon size={20} filled>
              star
            </Icon>
            <Icon size={20} filled>
              star_half
            </Icon>
          </div>
          <div className="text-body-sm text-on-surface-variant">from 1,204 reviews</div>
        </div>
        <div className="flex min-w-0 flex-col gap-2 rounded-xl bg-secondary-container p-5 text-on-secondary-container">
          <div className="flex items-center gap-2 text-label-lg">
            <Icon size={20}>schedule</Icon>Next maintenance in
          </div>
          <div className="flex items-baseline gap-1 font-mono text-headline-md tabular-nums">
            <span>02</span>
            <span className="text-body-md">h</span>
            <span>14</span>
            <span className="text-body-md">m</span>
            <span>33</span>
            <span className="text-body-md">s</span>
          </div>
          <div className="flex h-1.5 items-center gap-1">
            <div className="h-full w-[70%] rounded-full bg-on-secondary-container"></div>
            <div className="h-full flex-1 rounded-full bg-on-secondary-container/20"></div>
          </div>
          <div className="text-body-sm">Sun 02:00 UTC · eu-central-1</div>
        </div>
        <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-surface-container-low p-5">
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-on-surface-variant">Monthly deploys</span>
            <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-tertiary-container text-on-tertiary-container">
              86%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-headline-md font-medium tabular-nums">1,284</span>
            <span className="text-body-md text-on-surface-variant">/ 1,500</span>
          </div>
          <div className="relative h-4 rounded-full bg-primary/10">
            <span className="absolute inset-y-0 left-0 w-[70%] rounded-full bg-primary/15"></span>
            <span className="absolute left-0 top-1/2 h-2 w-[86%] -translate-y-1/2 rounded-full bg-primary"></span>
            <span className="absolute inset-y-0 left-[100%] w-1 -translate-x-full rounded-full bg-on-surface"></span>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-3 rounded-xl bg-surface-container-low p-5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-label-lg text-on-surface-variant">Storage</span>
            <span className="text-body-sm text-on-surface-variant">6.2 of 10 TB</span>
          </div>
          <div className="flex h-3 gap-0.5 overflow-hidden rounded-full">
            <span className="w-[28%] bg-primary"></span>
            <span className="w-[18%] bg-tertiary"></span>
            <span className="w-[10%] bg-secondary"></span>
            <span className="w-[6%] bg-error"></span>
            <span className="flex-1 bg-surface-container-highest"></span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-label-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-primary"></span>Objects
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-tertiary"></span>Block
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-secondary"></span>Snapshots
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-error"></span>Logs
            </span>
          </div>
        </div>
        <div className="relative flex min-w-0 items-center gap-4 overflow-hidden rounded-xl bg-surface-container-low p-5">
          <span className="relative grid size-16 shrink-0 place-items-center">
            <div className="absolute inset-0 size-16 animate-[spin_30s_linear_infinite]">
              <Shape className="size-full text-tertiary" shape="sunny" cycle={["sunny", "cookie12"]} interval={2600} />
            </div>
            <span className="relative text-title-lg font-semibold text-on-tertiary">#2</span>
          </span>
          <div className="min-w-0">
            <div className="text-label-lg text-on-surface-variant">Fastest region</div>
            <div className="text-headline-sm font-medium">Frankfurt</div>
            <div className="text-body-sm text-on-surface-variant">41 ms p95 · up from #4</div>
          </div>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-primary p-5 text-on-primary">
          <div className="min-w-0">
            <div className="text-label-lg opacity-80">Latency improved</div>
            <div className="text-display-sm font-semibold tabular-nums">18%</div>
            <div className="text-body-sm opacity-80">after connection pooling</div>
          </div>
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-on-primary/15">
            <Icon size={40}>south_east</Icon>
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-outline-variant sm:grid-cols-3 lg:grid-cols-5">
        {STRIP.map((m) => (
          <React.Fragment key={m.label}>
            <div className={`bg-surface-container-low p-4 ${m.span}`}>
              <div className="text-label-md text-on-surface-variant">{m.label}</div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
                <span className="text-title-lg tabular-nums">{m.value}</span>
                <span className={`text-label-md ${m.cls}`}>{m.delta}</span>
              </div>
            </div>
          </React.Fragment>
        ))}{" "}
      </div>
    </section>
  )
}

export { KpiCards, Spark }
