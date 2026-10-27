"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, Cell, ComposedChart, Line, Pie, PieChart, XAxis, YAxis } from "recharts"

import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

import { KitChart, KitChartMenu, type KitChartSpec, KitExpandDialog, KitSectionHeading } from "./chart-card"
import { MARGIN, c, grid, legend, line, rows, tip, xAxis, yAxis } from "./kit-chart-parts"
import { type KitLiveStream, kfmt, useDashboardKit as useKit, useKitLive, wave } from "./kit-data"

/*
 * Interactive chart cards · chart-type switcher, legend toggles, the compare overlay from the
 * filter bar, a live stream you can pause, a drill-down, a metric switcher and small multiples.
 */

type TrafficType = "line" | "area" | "bar"
const TRAFFIC_SERIES = [
  ["req", "Requests", "primary"],
  ["cached", "Cached", "tertiary"],
  ["err", "Errors", "error"],
] as const

function trafficSpec(type: TrafficType, hidden: Record<string, boolean>): KitChartSpec {
  return {
    id: "traffic",
    title: "Traffic",
    sub: "Requests per minute",
    render: (k, _ui, expanded) => {
      const n = k.labels.length,
        r = k.rng("traffic")
      const req = wave(r, n, 420, 90, 3)
      const cached = req.map((v) => Math.round(v * (0.55 + r() * 0.1)))
      const err = req.map((v) => Math.round(v * (0.03 + r() * 0.03)))
      const prev = req.map((v) => Math.round(v * (0.78 + r() * 0.14)))
      const data = rows(k.labels, { req, cached, err, prev })
      const series = TRAFFIC_SERIES.filter(([, label]) => !hidden[label])
      const bar = type === "bar"
      return {
        config: { req: { label: "Requests" }, cached: { label: "Cached" }, err: { label: "Errors" }, prev: { label: "Previous" } },
        chart: (
          <ComposedChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(kfmt)} />
            {tip()}
            {expanded && legend}
            {series.map(([key, , role]) =>
              bar ? (
                <Bar key={key} dataKey={key} fill={c(role)} radius={[4, 4, 4, 4]} maxBarSize={16} />
              ) : (
                <Area key={key} {...line} dataKey={key} stroke={c(role)} fill={type === "area" ? c(role, 0.14) : "none"} fillOpacity={1} />
              ),
            )}
            {k.compare && !hidden.Previous && <Line {...line} dataKey="prev" stroke={c("outline")} strokeWidth={2} strokeDasharray="6 6" />}
          </ComposedChart>
        ),
      }
    },
  }
}

const realtimeSpec = (live: KitLiveStream): KitChartSpec => ({
  id: "realtime",
  title: "Live throughput",
  sub: "Requests per second",
  render: () => {
    const data = live.values.map((v, i) => ({ label: new Date(live.times[i]).toTimeString().slice(0, 8), rps: v }))
    return {
      config: { rps: { label: "req/s", color: "primary" } },
      chart: (
        <AreaChart data={data} margin={MARGIN}>
          {grid}
          <XAxis {...xAxis} minTickGap={40} />
          <YAxis {...yAxis(kfmt)} domain={[900, 1600]} allowDataOverflow />
          {tip()}
          <Area {...line} dataKey="rps" stroke={c("primary")} fill={c("primary", 0.12)} fillOpacity={1} isAnimationActive={false} />
        </AreaChart>
      ),
    }
  },
})

const REGIONS = ["Europe", "North America", "Asia Pacific", "LATAM"]
const SERVICES = ["checkout", "search", "identity", "edge", "billing"]

function drillSpec(drill: number | null, onDrill: (i: number) => void): KitChartSpec {
  return {
    id: "drill",
    title: drill == null ? "Spend by region" : REGIONS[drill],
    sub: "Click a bar to drill in",
    render: (k) => {
      const top = drill == null,
        r = k.rng(top ? "drill" : `drill-${drill}`),
        L = top ? REGIONS : SERVICES
      const v = L.map(() => Math.round((top ? 80 : 10) + r() * (top ? 220 : 80)))
      return {
        config: { spend: { label: top ? "Spend" : REGIONS[drill!] } },
        chart: (
          <BarChart data={rows(L, { spend: v })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} minTickGap={0} />
            <YAxis {...yAxis((x) => `$${x}k`)} />
            {tip({ valueFormatter: (x) => `$${x}k` })}
            <Bar
              dataKey="spend"
              fill={c(top ? "primary" : "tertiary")}
              radius={[10, 10, 10, 10]}
              maxBarSize={64}
              cursor={top ? "pointer" : undefined}
              onClick={top ? (_d, i) => onDrill(i) : undefined}
            />
          </BarChart>
        ),
      }
    },
  }
}

const METRICS = [
  {
    label: "Revenue",
    value: "$1.28M",
    delta: "+12.4% vs previous",
    base: 110,
    amp: 20,
    role: "primary",
    fmt: (v: number) => `$${v}k`,
    name: "Revenue",
  },
  {
    label: "Users",
    value: "18,204",
    delta: "+7.5% vs previous",
    base: 18000,
    amp: 2000,
    role: "tertiary",
    fmt: kfmt,
    name: "Active users",
  },
  {
    label: "Latency",
    value: "182 ms",
    delta: "−9% vs previous",
    base: 180,
    amp: 30,
    role: "error",
    fmt: (v: number) => `${v} ms`,
    name: "p95 latency",
  },
]

function metricSpec(m: number): KitChartSpec {
  const cfg = METRICS[m]
  return {
    id: "metric",
    title: "Metric switcher",
    sub: cfg.name,
    render: (k) => ({
      config: { v: { label: cfg.name, color: cfg.role } },
      chart: (
        <AreaChart
          data={rows(k.labels, { v: wave(k.rng(`metric-${m}`), k.labels.length, cfg.base, cfg.amp, cfg.base / 200) })}
          margin={MARGIN}
        >
          {grid}
          <XAxis {...xAxis} />
          <YAxis {...yAxis(cfg.fmt)} domain={["auto", "auto"]} />
          {tip()}
          <Area {...line} dataKey="v" stroke={c(cfg.role)} fill={c(cfg.role, 0.14)} fillOpacity={1} />
        </AreaChart>
      ),
    }),
  }
}

const SMALLS = ["Frankfurt", "Stockholm", "Virginia", "Oregon", "Tokyo", "Sydney"].map((label, i) => ({
  label,
  delta: ["+4%", "+2%", "+9%", "−1%", "+6%", "−12%"][i],
  cls: i === 5 || i === 3 ? "text-error" : "text-tertiary",
  spec: {
    id: `sm-${i}`,
    title: label,
    sub: "Requests",
    render: (k, _ui, expanded) => {
      const role = i === 5 ? "error" : "primary"
      return {
        config: { req: { label: "Requests", color: role } },
        chart: (
          <AreaChart
            data={rows(k.labels, { req: wave(k.rng(`sm${i}`), k.labels.length, 100 + i * 20, 20 + i * 3) })}
            margin={expanded ? MARGIN : { top: 2, right: 0, bottom: 0, left: 0 }}
          >
            {expanded && grid}
            <XAxis {...xAxis} hide={!expanded} />
            <YAxis {...yAxis()} hide={!expanded} domain={[40, 260]} />
            {expanded && tip()}
            <Area {...line} strokeWidth={2} dataKey="req" stroke={c(role)} fill={c(role, 0.1)} fillOpacity={1} />
          </AreaChart>
        ),
      }
    },
  } satisfies KitChartSpec,
}))

const SLO = [
  ["Europe", 96],
  ["Americas", 88],
  ["APAC", 99],
] as const

function SloRing({ v }: { v: number }) {
  const data = [
    { label: "Met", value: v, fill: c(v < 90 ? "error" : "tertiary") },
    { label: "Missed", value: 100 - v, fill: c("surface-container-highest") },
  ]
  return (
    <KitChart
      spec={{
        id: `slo-${v}`,
        title: "SLO",
        render: () => ({
          config: {},
          chart: (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                innerRadius="78%"
                outerRadius="100%"
                cornerRadius={999}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.label} fill={d.fill} />
                ))}
              </Pie>
            </PieChart>
          ),
        }),
      }}
    />
  )
}

/** "Interactive chart cards" section. */
function InteractiveCharts({ className }: { className?: string }) {
  return (
    <section id="featured" className={className ?? "mt-16 scroll-mt-36"} data-toc>
      <KitSectionHeading
        title="Interactive chart cards"
        description="Chart-type switcher, legend toggles, a comparison overlay from the filter bar, and a live stream you can pause."
      />
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <TrafficCard className="xl:col-span-2" />
        <LiveThroughputCard />
        <DrillDownCard className="xl:col-span-2" />
        <MetricSwitcherCard />
        <SmallMultiplesCard className="xl:col-span-2" />
        <SloAttainmentCard />
      </div>
    </section>
  )
}

const card = "flex min-w-0 flex-col rounded-xl bg-surface-container-low p-5"

function TrafficCard({ className }: { className?: string }) {
  const [type, setType] = React.useState<TrafficType>("line")
  const [hidden, setHidden] = React.useState<Record<string, boolean>>({})
  const plot = React.useRef<HTMLDivElement>(null)
  const spec = trafficSpec(type, hidden)
  return (
    <ChartCardShell className={className}>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-title-lg">Traffic</h3>
          <RangeSub prefix="Requests per minute" />
        </div>
        <ConnectedButtonGroup
          aria-label="Chart type"
          size="sm"
          selectedKeys={[type]}
          onSelectionChange={(keys) => {
            const next = [...keys][0]
            if (next) setType(next as TrafficType)
          }}
        >
          {(
            [
              ["line", "show_chart", "Line"],
              ["area", "area_chart", "Area"],
              ["bar", "bar_chart", "Bars"],
            ] as const
          ).map(([id, icon, label]) => (
            <ConnectedButton key={id} id={id} iconOnly aria-label={label}>
              <Icon size={20}>{icon}</Icon>
            </ConnectedButton>
          ))}
        </ConnectedButtonGroup>
        <KitChartMenu
          id="traffic"
          title="Traffic"
          sub="Requests per minute"
          plot={plot}
          expandTo={<KitChart spec={spec} expanded />}
          className="-mr-2"
        />
      </div>
      <TrafficLegend hidden={hidden} setHidden={setHidden} />
      <div ref={plot} className="relative mt-4 h-72">
        <KitChart spec={spec} aria-label="Traffic chart" />
      </div>
    </ChartCardShell>
  )
}

function TrafficLegend({
  hidden,
  setHidden,
}: {
  hidden: Record<string, boolean>
  setHidden: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}) {
  return (
    <CompareAwareLegend>
      {(compare) =>
        [...TRAFFIC_SERIES.map(([, label, role]) => [label, role] as const), ...(compare ? ([["Previous", "outline"]] as const) : [])].map(
          ([label, role]) => {
            const on = !hidden[label]
            return (
              <button
                key={label}
                type="button"
                aria-pressed={on}
                onClick={() => setHidden((h) => ({ ...h, [label]: !h[label] }))}
                className={cn(
                  "state-layer focus-ring inline-flex h-8 cursor-pointer items-center gap-2 rounded-sm border px-3 text-label-lg transition-all duration-200",
                  on
                    ? "border-transparent bg-secondary-container text-on-secondary-container"
                    : "border-outline-variant text-on-surface-variant line-through opacity-60",
                )}
              >
                <span className="size-2.5 rounded-full" style={{ background: c(role) }} />
                {label}
              </button>
            )
          },
        )
      }
    </CompareAwareLegend>
  )
}

function CompareAwareLegend({ children }: { children: (compare: boolean) => React.ReactNode }) {
  const k = useKit()
  return <div className="mt-3 flex flex-wrap gap-2">{children(k.compare)}</div>
}

function LiveThroughputCard({ className }: { className?: string }) {
  const live = useKitLive()
  const { paused, setPaused, values } = live
  return (
    <ChartCardShell className={className}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-title-lg">Live throughput</h3>
          <p className="text-body-sm text-on-surface-variant">Requests per second · last 30 s</p>
        </div>
        <IconButton
          variant="tonal"
          aria-label={paused ? "Resume live updates" : "Pause live updates"}
          onPress={() => setPaused(!paused)}
          className="-mr-2"
        >
          <Icon size={20}>{paused ? "play_arrow" : "pause"}</Icon>
        </IconButton>
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="text-display-sm font-medium tabular-nums">{values[values.length - 1].toLocaleString("en-US")}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-error-container px-2 py-0.5 text-label-md text-on-error-container">
          <span className={cn("size-2 rounded-full bg-error", !paused && "animate-pulse")} />
          {paused ? "Paused" : "Live"}
        </span>
      </div>
      <div className="relative mt-4 h-56 flex-1">
        <KitChart spec={realtimeSpec(live)} aria-label="Live throughput" />
      </div>
    </ChartCardShell>
  )
}

function DrillDownCard({ className }: { className?: string }) {
  const [drill, setDrill] = React.useState<number | null>(null)
  const spec = drillSpec(drill, setDrill)
  return (
    <ChartCardShell className={className}>
      <div className="flex flex-wrap items-center gap-3">
        {drill != null && (
          <IconButton aria-label="Back to regions" onPress={() => setDrill(null)} className="-ml-2">
            <Icon>arrow_back</Icon>
          </IconButton>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-title-lg">{spec.title}</h3>
          <p className="text-body-sm text-on-surface-variant">
            {drill == null ? "Click a bar to see its services" : "Spend by service · click back to return"}
          </p>
        </div>
        <nav className="flex items-center gap-1 text-label-lg text-on-surface-variant" aria-label="Breadcrumb">
          <button
            type="button"
            className="state-layer focus-ring inline-flex h-8 cursor-pointer items-center rounded-full px-3"
            onClick={() => setDrill(null)}
          >
            All regions
          </button>
          {drill != null && (
            <>
              <Icon size={18}>chevron_right</Icon>
              <span
                aria-current="page"
                className="inline-flex h-8 items-center rounded-full bg-secondary-container px-3 text-on-secondary-container"
              >
                {REGIONS[drill]}
              </span>
            </>
          )}
        </nav>
      </div>
      <div className="relative mt-4 h-64">
        <KitChart spec={spec} aria-label="Spend drill-down" />
      </div>
    </ChartCardShell>
  )
}

function MetricSwitcherCard({ className }: { className?: string }) {
  const [m, setM] = React.useState(0)
  const cfg = METRICS[m]
  return (
    <ChartCardShell className={className}>
      <h3 className="text-title-lg">Metric switcher</h3>
      <RangeSub prefix="One chart, three metrics" />
      <div className="mt-3 flex rounded-full bg-surface-container-high p-1" role="tablist" aria-label="Metric">
        {METRICS.map((o, i) => (
          <button
            key={o.label}
            type="button"
            role="tab"
            aria-selected={i === m}
            onClick={() => setM(i)}
            className={cn(
              "state-layer focus-ring flex-1 cursor-pointer rounded-full px-2 py-2 text-label-lg transition-all duration-300 ease-emphasized",
              i === m ? "bg-surface text-on-surface shadow-1" : "text-on-surface-variant",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
        <span className="text-headline-md font-medium tabular-nums">{cfg.value}</span>
        <span className="text-label-md text-tertiary">{cfg.delta}</span>
      </div>
      <div className="relative mt-2 h-44 flex-1">
        <KitChart spec={metricSpec(m)} aria-label="Metric trend" />
      </div>
    </ChartCardShell>
  )
}

function SmallMultiplesCard({ className }: { className?: string }) {
  const k = useKit()
  const [open, setOpen] = React.useState<number | null>(null)
  return (
    <div className={cn("min-w-0 rounded-xl bg-surface-container-low p-5", className)}>
      <h3 className="text-title-lg">Small multiples</h3>
      <p className="text-body-sm text-on-surface-variant">Requests per region on a shared scale · click one to expand</p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {SMALLS.map((m, i) => (
          <button
            key={m.label}
            type="button"
            onClick={() => setOpen(i)}
            className="state-layer focus-ring flex min-w-0 cursor-pointer flex-col rounded-lg bg-surface p-3 text-left"
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate text-label-lg">{m.label}</span>
              <span className={cn("text-label-md tabular-nums", m.cls)}>{m.delta}</span>
            </span>
            <span className="relative mt-2 block h-16">
              <KitChart spec={m.spec} aria-label={`${m.label} requests`} />
            </span>
          </button>
        ))}
      </div>
      <KitExpandDialog
        isOpen={open != null}
        onOpenChange={(o) => !o && setOpen(null)}
        title={open != null ? SMALLS[open].label : ""}
        sub={`Requests · ${k.rangeName}`}
      >
        {open != null && <KitChart spec={SMALLS[open].spec} expanded />}
      </KitExpandDialog>
    </div>
  )
}

function SloAttainmentCard({ className }: { className?: string }) {
  return (
    <div className={cn("min-w-0 rounded-xl bg-surface-container-low p-5", className)}>
      <h3 className="text-title-lg">SLO attainment</h3>
      <p className="text-body-sm text-on-surface-variant">Per region this quarter · target 90%</p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {SLO.map(([label, v]) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="relative aspect-square w-full max-w-[120px]">
              <SloRing v={v} />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-title-md tabular-nums">{v}%</span>
            </div>
            <span className="text-label-md text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-md bg-error-container/50 px-3 py-2 text-body-sm text-on-error-container">
        Americas missed target on 3 days after the scheduler incident.
      </p>
    </div>
  )
}

function ChartCardShell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div data-slot="kit-chart-card" className={cn(card, className)}>
      {children}
    </div>
  )
}

function RangeSub({ prefix }: { prefix: string }) {
  const k = useKit()
  return (
    <p className="text-body-sm text-on-surface-variant">
      {prefix} · {k.rangeName}
    </p>
  )
}

export { InteractiveCharts }
