"use client"

import { Area, AreaChart, Bar, ComposedChart, Line, LineChart, Scatter, ScatterChart, XAxis, YAxis } from "recharts"

import { type KitChartSpec, KitChartGrid, KitSectionHeading } from "./chart-card"
import { MARGIN, R6, c, dashed, grid, legend, line, rows, tip, xAxis, xNum, yAxis } from "./kit-chart-parts"
import { kfmt, wave } from "./kit-data"

/* Trends over time · line and area charts on the filter bar's time axis. */

const ms = (v: number) => `${v} ms`
const pct = (v: number) => `${v}%`

export const TREND_CHARTS: KitChartSpec[] = [
  {
    id: "area",
    title: "Compute by region",
    sub: "vCPU in use, stacked",
    kind: "area · stacked",
    span: "xl:col-span-2",
    render: (k) => {
      const n = k.labels.length,
        r = k.rng("area"),
        w = (b: number, a: number) => wave(r, n, b, a, 0.5)
      const data = rows(k.labels, { eu: w(220, 30), us: w(160, 24), apac: w(90, 16) })
      return {
        config: {
          eu: { label: "EU", color: "primary" },
          us: { label: "US", color: "tertiary" },
          apac: { label: "APAC", color: "secondary" },
        },
        chart: (
          <AreaChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} />
            {tip()}
            {legend}
            <Area {...line} dataKey="eu" stackId="a" stroke={c("primary")} fill={c("primary", 0.35)} fillOpacity={1} />
            <Area {...line} dataKey="us" stackId="a" stroke={c("tertiary")} fill={c("tertiary", 0.3)} fillOpacity={1} />
            <Area {...line} dataKey="apac" stackId="a" stroke={c("secondary")} fill={c("secondary", 0.3)} fillOpacity={1} />
          </AreaChart>
        ),
      }
    },
  },
  {
    id: "stepped",
    title: "Active nodes",
    sub: "Actual vs desired",
    kind: "line · stepped",
    render: (k) => {
      const r = k.rng("stepped")
      let cur = 24
      const act = k.labels.map(() => (cur = Math.max(14, Math.min(40, cur + Math.round((r() - 0.45) * 6)))))
      const data = rows(k.labels, { actual: act, desired: act.map((v) => Math.ceil(v / 4) * 4 + 2) })
      return {
        config: { actual: { label: "Actual" }, desired: { label: "Desired" } },
        chart: (
          <AreaChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} />
            {tip()}
            {legend}
            <Area {...line} type="stepAfter" dataKey="actual" stroke={c("primary")} fill={c("primary", 0.1)} fillOpacity={1} />
            <Area {...dashed} type="stepAfter" dataKey="desired" stroke={c("outline")} fill="none" strokeDasharray="5 5" />
          </AreaChart>
        ),
      }
    },
  },
  {
    id: "threshold",
    title: "Error rate vs SLO",
    sub: "Shaded red where the budget burns",
    kind: "line · threshold",
    render: (k, _ui, ex) => {
      const n = k.labels.length,
        r = k.rng("thr"),
        ph = r() * 3
      const d = k.labels.map((_, i) => +(0.55 + 0.35 * Math.sin(i / 2.2 + ph) + r() * 0.4 + (i > n * 0.6 ? 0.25 : 0)).toFixed(2))
      const top = Math.max(1, ...d),
        bottom = Math.min(1, ...d)
      const off = (top - 1) / (top - bottom || 1)
      const gid = `kit-thr${ex ? "-x" : ""}`
      return {
        config: { rate: { label: "Error rate", color: "primary" }, slo: { label: "SLO limit", color: "error" } },
        chart: (
          <ComposedChart data={rows(k.labels, { rate: d, slo: d.map(() => 1) })} margin={MARGIN}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor={c("error", 0.25)} />
                <stop offset={off} stopColor={c("primary", 0.08)} />
              </linearGradient>
            </defs>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(pct)} />
            {tip({ valueFormatter: (v) => `${v}%` })}
            {legend}
            <Area {...line} dataKey="rate" baseValue={1} stroke={c("primary")} fill={`url(#${gid})`} fillOpacity={1} />
            <Line {...dashed} type="linear" dataKey="slo" stroke={c("error")} />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "latency",
    title: "Latency percentiles",
    sub: "p50 · p95 · p99, ms",
    kind: "line · multi",
    span: "xl:col-span-2",
    render: (k) => {
      const n = k.labels.length,
        r = k.rng("lat")
      const data = rows(k.labels, { p50: wave(r, n, 74, 8), p95: wave(r, n, 182, 24), p99: wave(r, n, 318, 50) })
      return {
        config: {
          p50: { label: "p50", color: "primary" },
          p95: { label: "p95", color: "tertiary" },
          p99: { label: "p99", color: "error" },
        },
        chart: (
          <LineChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(ms)} />
            {tip({ valueFormatter: (v) => `${v} ms` })}
            {legend}
            <Line {...line} dataKey="p50" stroke={c("primary")} />
            <Line {...line} dataKey="p95" stroke={c("tertiary")} />
            <Line {...line} dataKey="p99" stroke={c("error")} />
          </LineChart>
        ),
      }
    },
  },
  {
    id: "forecast",
    title: "Capacity forecast",
    sub: "Actual, forecast and 80% band",
    kind: "line · forecast",
    span: "xl:col-span-2",
    render: (k) => {
      const n = k.labels.length,
        d = wave(k.rng("forecast"), n, 300, 40, 2),
        cut = Math.floor(n * 0.65)
      const act = d.map((v, i) => (i <= cut ? v : null))
      const fc = d.map((v, i) => (i >= cut ? v + (i - cut) * 3 : null))
      const band = fc.map((v, i) => (v == null ? null : [v - 12 - (i - cut) * 6, v + 12 + (i - cut) * 6]))
      return {
        config: {
          actual: { label: "Actual", color: "primary" },
          forecast: { label: "Forecast", color: "primary" },
          band: { label: "80% band" },
        },
        chart: (
          <ComposedChart data={rows(k.labels, { actual: act, forecast: fc, band: band as (number[] | null)[] })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} domain={["auto", "auto"]} />
            {tip()}
            {legend}
            <Area
              type="monotone"
              dataKey="band"
              stroke="none"
              fill={c("primary", 0.14)}
              fillOpacity={1}
              legendType="none"
              connectNulls={false}
            />
            <Line {...line} dataKey="actual" stroke={c("primary")} />
            <Line {...line} dataKey="forecast" stroke={c("primary")} strokeDasharray="6 5" />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "band",
    title: "Latency band",
    sub: "Min–max range with mean",
    kind: "line · range band",
    render: (k) => {
      const r = k.rng("band"),
        m = wave(r, k.labels.length, 120, 15)
      const hi = m.map((v) => Math.round(v + 20 + r() * 25)),
        lo = m.map((v) => Math.max(0, Math.round(v - 18 - r() * 20)))
      return {
        config: { range: { label: "Min–max", color: "tertiary" }, mean: { label: "Mean", color: "tertiary" } },
        chart: (
          <ComposedChart data={rows(k.labels, { range: lo.map((v, i) => [v, hi[i]]), mean: m })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(ms)} />
            {tip({ valueFormatter: (v) => (Array.isArray(v) ? `${v[0]}–${v[1]} ms` : `${v} ms`) })}
            {legend}
            <Area type="monotone" dataKey="range" stroke={c("tertiary", 0.35)} strokeWidth={1} fill={c("tertiary", 0.16)} fillOpacity={1} />
            <Line {...line} dataKey="mean" stroke={c("tertiary")} />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "cumulative",
    title: "Signups to date",
    sub: "Running total",
    kind: "area · cumulative",
    render: (k) => {
      let t = 0
      const d = wave(k.rng("cum"), k.labels.length, 40, 15).map((v) => (t += v))
      return {
        config: { signups: { label: "Signups", color: "primary" } },
        chart: (
          <AreaChart data={rows(k.labels, { signups: d })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(kfmt)} />
            {tip()}
            <Area {...line} dataKey="signups" stroke={c("primary")} fill={c("primary", 0.15)} fillOpacity={1} />
          </AreaChart>
        ),
      }
    },
  },
  {
    id: "movingavg",
    title: "Deploys & moving average",
    sub: "Daily bars, 7-point trend",
    kind: "bar + avg",
    span: "xl:col-span-2",
    render: (k) => {
      const d = wave(k.rng("ma"), k.labels.length, 40, 18)
      const ma = d.map((_, i) => {
        const w = d.slice(Math.max(0, i - 6), i + 1)
        return Math.round(w.reduce((a, b) => a + b, 0) / w.length)
      })
      return {
        config: { daily: { label: "Daily", color: "primary" }, avg: { label: "7-point average", color: "tertiary" } },
        chart: (
          <ComposedChart data={rows(k.labels, { daily: d, avg: ma })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} />
            {tip()}
            {legend}
            <Bar dataKey="daily" fill={c("primary", 0.3)} radius={R6} maxBarSize={14} />
            <Line {...line} dataKey="avg" stroke={c("tertiary")} />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "yoy",
    title: "Revenue, year over year",
    sub: "2026 vs 2025",
    kind: "line · YoY",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("yoy")
      const mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const a = wave(r, 12, 90, 15, 4)
      const data = rows(mo, { y26: a.map((v, i) => (i < 10 ? v : null)), y25: a.map((v) => Math.round(v * (0.75 + r() * 0.1))) })
      return {
        config: { y26: { label: "2026", color: "primary" }, y25: { label: "2025", color: "outline" } },
        chart: (
          <LineChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis((v) => `$${v}k`)} />
            {tip({ valueFormatter: (v) => `$${v}k` })}
            {legend}
            <Line {...line} dataKey="y26" stroke={c("primary")} dot={{ r: 3, fill: c("primary"), strokeWidth: 0 }} />
            <Line {...dashed} dataKey="y25" stroke={c("outline")} strokeDasharray="5 5" strokeWidth={2.5} />
          </LineChart>
        ),
      }
    },
  },
  {
    id: "dualaxis",
    title: "Users vs sessions",
    sub: "Two y-axes",
    kind: "line · dual axis",
    render: (k) => {
      const r = k.rng("dual")
      const users = wave(r, k.labels.length, 18, 3, 0.05).map((v) => v * 1000)
      const spu = k.labels.map((_, i) => +(3.2 + 0.5 * Math.sin(i / 3) + r() * 0.3).toFixed(2))
      return {
        config: { users: { label: "Users", color: "primary" }, spu: { label: "Sessions / user", color: "tertiary" } },
        chart: (
          <LineChart data={rows(k.labels, { users, spu })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis yAxisId="l" {...yAxis(kfmt)} domain={["auto", "auto"]} />
            <YAxis yAxisId="r" orientation="right" {...yAxis()} domain={["auto", "auto"]} />
            {tip()}
            {legend}
            <Line {...line} yAxisId="l" dataKey="users" stroke={c("primary")} />
            <Line {...line} yAxisId="r" dataKey="spu" stroke={c("tertiary")} />
          </LineChart>
        ),
      }
    },
  },
  {
    id: "peak",
    title: "Queue depth",
    sub: "Peak highlighted",
    kind: "line · markers",
    span: "xl:col-span-2",
    render: (k) => {
      const d = wave(k.rng("peak"), k.labels.length, 60, 20),
        mi = d.indexOf(Math.max(...d))
      return {
        config: { depth: { label: "Queue depth", color: "primary" } },
        chart: (
          <LineChart data={rows(k.labels, { depth: d })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} />
            {tip()}
            <Line
              {...line}
              dataKey="depth"
              stroke={c("primary")}
              dot={(p: { cx?: number; cy?: number; index?: number }) => (
                <circle
                  key={p.index}
                  cx={p.cx}
                  cy={p.cy}
                  r={p.index === mi ? 7 : 2.5}
                  fill={p.index === mi ? c("error") : c("primary")}
                  stroke={c("surface-container-low")}
                  strokeWidth={2}
                />
              )}
            />
          </LineChart>
        ),
      }
    },
  },
  {
    id: "gradient",
    title: "Throughput",
    sub: "Gradient fill",
    kind: "area · gradient",
    render: (k, _ui, ex) => {
      const gid = `kit-grad${ex ? "-x" : ""}`
      return {
        config: { gbs: { label: "GB/s", color: "primary" } },
        chart: (
          <AreaChart data={rows(k.labels, { gbs: wave(k.rng("grad"), k.labels.length, 14, 4, 0.05) })} margin={MARGIN}>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={c("primary", 0.5)} />
                <stop offset="1" stopColor={c("primary", 0)} />
              </linearGradient>
            </defs>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis((v) => `${v} GB/s`)} />
            {tip({ valueFormatter: (v) => `${v} GB/s` })}
            <Area {...line} dataKey="gbs" stroke={c("primary")} fill={`url(#${gid})`} fillOpacity={1} />
          </AreaChart>
        ),
      }
    },
  },
  {
    id: "slope",
    title: "Region latency change",
    sub: "Q3 → Q4",
    kind: "slope",
    render: (k) => {
      const r = k.rng("slope")
      const regions = ["Frankfurt", "Virginia", "Oregon", "Tokyo", "Sydney"]
      const roles = ["primary", "tertiary", "secondary", "error", "outline"]
      const vals = regions.map(() => {
        const a = 40 + Math.round(r() * 120)
        return [a, Math.round(a * (0.7 + r() * 0.5))]
      })
      const data = ["Q3", "Q4"].map((label, q) => Object.fromEntries([["label", label], ...regions.map((g, i) => [g, vals[i][q]])]))
      return {
        config: Object.fromEntries(regions.map((g, i) => [g, { label: g, color: roles[i] }])),
        chart: (
          <LineChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} padding={{ left: 32, right: 32 }} />
            <YAxis {...yAxis(ms)} />
            {tip({ valueFormatter: (v) => `${v} ms` })}
            {legend}
            {regions.map((g, i) => (
              <Line key={g} {...line} type="linear" dataKey={g} stroke={c(roles[i])} dot={{ r: 5, fill: c(roles[i]), strokeWidth: 0 }} />
            ))}
          </LineChart>
        ),
      }
    },
  },
  {
    id: "area100",
    title: "Traffic share over time",
    sub: "Normalized to 100%",
    kind: "area · 100%",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("a100"),
        n = k.labels.length
      const raw = [wave(r, n, 50, 10), wave(r, n, 30, 8), wave(r, n, 20, 6)]
      const norm = (i: number) => raw[i].map((v, j) => +((v / (raw[0][j] + raw[1][j] + raw[2][j])) * 100).toFixed(1))
      const series = [
        ["web", "Web", "primary"],
        ["mobile", "Mobile", "tertiary"],
        ["api", "API", "secondary"],
      ] as const
      return {
        config: Object.fromEntries(series.map(([k2, l, col]) => [k2, { label: l, color: col }])),
        chart: (
          <AreaChart data={rows(k.labels, { web: norm(0), mobile: norm(1), api: norm(2) })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(pct)} domain={[0, 100]} allowDataOverflow />
            {tip({ valueFormatter: (v) => `${v}%` })}
            {legend}
            {series.map(([key, , role]) => (
              <Area key={key} {...line} dataKey={key} stackId="s" stroke={c(role)} fill={c(role, 0.35)} fillOpacity={1} />
            ))}
          </AreaChart>
        ),
      }
    },
  },
  {
    id: "cdf",
    title: "Latency CDF",
    sub: "Share of requests under x ms",
    kind: "line · CDF",
    render: (k) => {
      const r = k.rng("cdf"),
        bins = Array.from({ length: 21 }, (_, i) => String(i * 25))
      const w = bins.map((_, i) => Math.exp(-Math.pow(Math.log(i + 1.5) - 1.6, 2) / 0.35) + r() * 0.05)
      const tot = w.reduce((a, b) => a + b, 0)
      let t = 0
      return {
        config: { cdf: { label: "≤ x ms", color: "primary" } },
        chart: (
          <AreaChart data={rows(bins, { cdf: w.map((v) => +(((t += v) / tot) * 100).toFixed(1)) })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(pct)} domain={[0, 100]} />
            {tip({ valueFormatter: (v) => `${v}%` })}
            <Area {...line} type="stepAfter" dataKey="cdf" stroke={c("primary")} fill={c("primary", 0.1)} fillOpacity={1} />
          </AreaChart>
        ),
      }
    },
  },
  {
    id: "events",
    title: "Deploy events",
    sub: "By service, rollbacks marked",
    kind: "scatter · timeline",
    span: "xl:col-span-2",
    render: (k) => {
      const L = k.labels,
        n = L.length,
        r = k.rng("events"),
        sv = ["checkout", "search", "identity", "edge", "billing"]
      const pts = (m: number) => Array.from({ length: Math.round(n * m) }, () => ({ x: Math.floor(r() * n), y: Math.floor(r() * 5) }))
      return {
        config: { ok: { label: "Succeeded", color: "primary" }, rb: { label: "Rolled back", color: "error" } },
        chart: (
          <ScatterChart margin={MARGIN}>
            {grid}
            <XAxis {...xNum((v) => L[Math.round(v)] ?? "")} dataKey="x" domain={[-0.5, n - 0.5]} tickCount={7} allowDecimals={false} />
            <YAxis type="number" dataKey="y" domain={[-0.5, 4.5]} ticks={[0, 1, 2, 3, 4]} {...yAxis((v) => sv[v] ?? "")} />
            {tip({ hideLabel: true, valueFormatter: (v, name) => (name === "x" ? L[Number(v)] : sv[Number(v)]) })}
            {legend}
            <Scatter name="Succeeded" dataKey="ok" data={pts(1.3)} fill={c("primary", 0.75)} />
            <Scatter name="Rolled back" dataKey="rb" data={pts(0.25)} fill={c("error")} shape="triangle" />
          </ScatterChart>
        ),
      }
    },
  },
]

/** "Trends over time" section: all 16 trend charts. */
function TrendCharts({ className }: { className?: string }) {
  return (
    <section id="trends" className={className ?? "mt-16 scroll-mt-36"} data-toc>
      <KitSectionHeading
        title="Trends over time"
        description="Line and area charts for anything on a time axis. They follow the date range in the filter bar."
      />
      <KitChartGrid specs={TREND_CHARTS} />
    </section>
  )
}

export { TrendCharts }
