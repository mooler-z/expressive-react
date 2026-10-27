"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts"

import { type KitChartSpec, KitChartGrid, KitSectionHeading } from "./chart-card"
import { MARGIN, c, grid, legend, line, rows, tip, xAxis, xNum, yAxis } from "./kit-chart-parts"
import { kfmt, wave } from "./kit-data"

/* Relationships & distribution · scatter, bubble, radar and OHLC. */

const ms = (v: number) => `${v} ms`
const axisTitle = (value: string, axis: "x" | "y") =>
  ({
    value,
    position: axis === "x" ? "insideBottom" : "insideLeft",
    angle: axis === "y" ? -90 : 0,
    offset: axis === "x" ? -4 : 12,
    className: "fill-on-surface-variant text-label-md",
  }) as const

/** One candle drawn inside a [low, high] range bar. */
function Candle(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: { o: number; h: number; l: number; c: number }
}) {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props
  if (!payload) return null
  const { o, h, l, c: cl } = payload
  const py = (v: number) => y + (height * (h - v)) / (h - l || 1)
  const up = cl >= o,
    col = up ? c("tertiary") : c("error")
  const cx = x + width / 2,
    bw = Math.max(3, width * 0.7)
  const top = py(Math.max(o, cl)),
    bottom = py(Math.min(o, cl))
  return (
    <g>
      <line x1={cx} x2={cx} y1={y} y2={y + height} stroke={col} strokeWidth={Math.max(1.5, width * 0.12)} />
      <rect x={cx - bw / 2} y={top} width={bw} height={Math.max(1.5, bottom - top)} rx={2} fill={col} />
    </g>
  )
}

const radarGrid = <PolarGrid stroke={c("outline-variant", 0.5)} />
const radarAxis = <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />

export const RELATIONSHIP_CHARTS: KitChartSpec[] = [
  {
    id: "scatter",
    title: "Cost vs latency",
    sub: "One dot per service",
    kind: "scatter",
    render: (k) => {
      const r = k.rng("scatter")
      const pts = (n: number, cx: number, cy: number, s: number) =>
        Array.from({ length: n }, () => ({ x: +(cx + (r() - 0.5) * s).toFixed(1), y: Math.round(cy + (r() - 0.5) * s * 18) }))
      return {
        config: { x: { label: "Cost ($k)" }, y: { label: "p95 (ms)" } },
        chart: (
          <ScatterChart margin={{ ...MARGIN, bottom: 16, left: 8 }}>
            {grid}
            <XAxis {...xNum()} dataKey="x" label={axisTitle("Monthly cost ($k)", "x")} />
            <YAxis {...yAxis()} type="number" dataKey="y" label={axisTitle("p95 (ms)", "y")} />
            {tip({ hideLabel: true })}
            {legend}
            <Scatter name="Stateless" data={pts(18, 6, 120, 8)} fill={c("primary", 0.8)} />
            <Scatter name="Stateful" data={pts(12, 14, 240, 10)} fill={c("tertiary", 0.8)} shape="square" />
          </ScatterChart>
        ),
      }
    },
  },
  {
    id: "bubble",
    title: "Account health",
    sub: "Seats × ARR, size = open tickets",
    kind: "bubble",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("bubble")
      const acc = (n: number, sx: number, sy: number) =>
        Array.from({ length: n }, () => ({ x: Math.round(20 + r() * sx), y: Math.round(50 + r() * sy), z: Math.round(4 + r() * 16) }))
      return {
        config: { x: { label: "Seats" }, y: { label: "ARR ($k)" }, z: { label: "Open tickets" } },
        chart: (
          <ScatterChart margin={{ ...MARGIN, bottom: 16, left: 8 }}>
            {grid}
            <XAxis {...xNum()} dataKey="x" label={axisTitle("Seats", "x")} />
            <YAxis {...yAxis()} type="number" dataKey="y" label={axisTitle("ARR ($k)", "y")} />
            <ZAxis dataKey="z" range={[60, 1100]} />
            {tip({ hideLabel: true })}
            {legend}
            <Scatter name="Business" data={acc(14, 180, 400)} fill={c("primary", 0.45)} stroke={c("primary")} />
            <Scatter name="Enterprise" data={acc(9, 600, 1400)} fill={c("tertiary", 0.45)} stroke={c("tertiary")} />
          </ScatterChart>
        ),
      }
    },
  },
  {
    id: "radar",
    title: "Team health",
    sub: "Platform vs Payments",
    kind: "radar",
    render: (k) => {
      const r = k.rng("radar"),
        L = ["Reliability", "Velocity", "Cost", "Security", "On-call", "Docs"]
      const d = () => L.map(() => Math.round(45 + r() * 50))
      return {
        config: { platform: { label: "Platform", color: "primary" }, payments: { label: "Payments", color: "tertiary" } },
        chart: (
          <RadarChart data={rows(L, { platform: d(), payments: d() })} outerRadius="72%">
            {radarGrid}
            {radarAxis}
            {tip()}
            {legend}
            <Radar
              dataKey="platform"
              stroke={c("primary")}
              fill={c("primary", 0.2)}
              fillOpacity={1}
              strokeWidth={2}
              dot={{ r: 3, fill: c("primary") }}
            />
            <Radar
              dataKey="payments"
              stroke={c("tertiary")}
              fill={c("tertiary", 0.2)}
              fillOpacity={1}
              strokeWidth={2}
              dot={{ r: 3, fill: c("tertiary") }}
            />
          </RadarChart>
        ),
      }
    },
  },
  {
    id: "ohlc",
    title: "Spot price · m7i.large",
    sub: "Daily open · high · low · close",
    kind: "OHLC",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("ohlc")
      let p = 0.096
      const days = Array.from({ length: 24 }, (_, i) => {
        const o = p,
          cl = +(o + (r() - 0.48) * 0.008).toFixed(4)
        const h = +(Math.max(o, cl) + r() * 0.004).toFixed(4),
          l = +(Math.min(o, cl) - r() * 0.004).toFixed(4)
        p = cl
        return { label: `Oct ${i + 1}`, o: +o.toFixed(4), h, l, c: cl, range: [l, h] }
      })
      return {
        config: { range: { label: "Price" } },
        chart: (
          <BarChart data={days} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis((v) => "$" + v.toFixed(3))} domain={["auto", "auto"]} />
            {tip({
              hideIndicator: true,
              valueFormatter: (_v, _n, it) => {
                const d = it.payload as (typeof days)[number]
                return `O $${d.o} · H $${d.h} · L $${d.l} · C $${d.c}`
              },
            })}
            <Bar dataKey="range" shape={<Candle />} isAnimationActive={false} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "regression",
    title: "Load vs latency",
    sub: "With least-squares trend",
    kind: "scatter + trend",
    render: (k) => {
      const r = k.rng("reg")
      const pts = Array.from({ length: 40 }, () => {
        const x = +(10 + r() * 80).toFixed(1)
        return { x, y: Math.round(40 + x * 2.2 + (r() - 0.5) * 70) }
      })
      const n = pts.length,
        mx = pts.reduce((a, q) => a + q.x, 0) / n,
        my = pts.reduce((a, q) => a + q.y, 0) / n
      const b = pts.reduce((a, q) => a + (q.x - mx) * (q.y - my), 0) / pts.reduce((a, q) => a + (q.x - mx) ** 2, 0),
        a0 = my - b * mx
      return {
        config: { x: { label: "CPU load (%)" }, y: { label: "p95 (ms)" } },
        chart: (
          <ScatterChart margin={{ ...MARGIN, bottom: 16, left: 8 }}>
            {grid}
            <XAxis {...xNum()} dataKey="x" domain={[0, 100]} label={axisTitle("CPU load (%)", "x")} />
            <YAxis {...yAxis()} type="number" dataKey="y" label={axisTitle("p95 (ms)", "y")} />
            {tip({ hideLabel: true })}
            {legend}
            <Scatter name="Samples" data={pts} fill={c("primary", 0.55)} />
            <Scatter
              name="Trend"
              data={[
                { x: 10, y: Math.round(a0 + b * 10) },
                { x: 90, y: Math.round(a0 + b * 90) },
              ]}
              fill={c("error")}
              line={{ stroke: c("error"), strokeWidth: 2 }}
              shape={() => <g />}
            />
          </ScatterChart>
        ),
      }
    },
  },
  {
    id: "punch",
    title: "Commit punch card",
    sub: "Day × hour, size = commits",
    kind: "bubble · punch card",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("punch"),
        D = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      const pts: { x: number; y: number; z: number }[] = []
      D.forEach((_, d) => {
        for (let h = 0; h < 24; h += 2) {
          const biz = d < 5 && h >= 8 && h <= 18
          pts.push({ x: h, y: d, z: Math.round((biz ? 9 : 2) * (0.3 + r())) * 6 })
        }
      })
      return {
        config: { z: { label: "Commits" } },
        chart: (
          <ScatterChart margin={MARGIN}>
            {grid}
            <XAxis
              {...xNum((v) => String(v).padStart(2, "0"))}
              dataKey="x"
              domain={[-1, 23]}
              ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]}
            />
            <YAxis {...yAxis((v) => D[v] ?? "")} type="number" dataKey="y" domain={[-0.6, 6.6]} ticks={[0, 1, 2, 3, 4, 5, 6]} reversed />
            <ZAxis dataKey="z" range={[10, 520]} />
            {tip({
              hideLabel: true,
              hideIndicator: true,
              valueFormatter: (v, name) =>
                name === "x" ? `${String(v).padStart(2, "0")}:00` : name === "y" ? D[Number(v)] : `${v} commits`,
            })}
            <Scatter data={pts} fill={c("primary", 0.6)} stroke={c("primary")} />
          </ScatterChart>
        ),
      }
    },
  },
  {
    id: "radar3",
    title: "Vendor comparison",
    sub: "3 vendors × 8 criteria",
    kind: "radar · 3 series",
    render: (k) => {
      const r = k.rng("r3"),
        crit = ["Price", "Support", "Uptime", "Security", "Docs", "API", "Ecosystem", "Compliance"]
      const d = () => crit.map(() => Math.round(40 + r() * 55))
      const series = [
        ["kestrel", "Kestrel", "primary"],
        ["b", "Vendor B", "tertiary"],
        ["cc", "Vendor C", "secondary"],
      ] as const
      return {
        config: Object.fromEntries(series.map(([key, label, role]) => [key, { label, color: role }])),
        chart: (
          <RadarChart data={rows(crit, { kestrel: d(), b: d(), cc: d() })} outerRadius="70%">
            {radarGrid}
            {radarAxis}
            {tip()}
            {legend}
            {series.map(([key, , role]) => (
              <Radar
                key={key}
                dataKey={key}
                stroke={c(role)}
                fill={c(role, 0.12)}
                fillOpacity={1}
                strokeWidth={2}
                dot={{ r: 2.5, fill: c(role) }}
              />
            ))}
          </RadarChart>
        ),
      }
    },
  },
  {
    id: "anomalies",
    title: "Anomaly detection",
    sub: "Points beyond 2σ",
    kind: "line · anomalies",
    span: "xl:col-span-2",
    render: (k) => {
      const d = wave(k.rng("anom"), k.labels.length, 200, 20)
      const mean = d.reduce((a, b) => a + b, 0) / d.length,
        sd = Math.sqrt(d.reduce((a, b) => a + (b - mean) ** 2, 0) / d.length)
      for (const f of [0.3, 0.75]) d[Math.floor(d.length * f)] = Math.round(mean + sd * 3.2)
      return {
        config: { req: { label: "Requests", color: "primary" }, anom: { label: "Anomaly", color: "error" } },
        chart: (
          <LineChart data={rows(k.labels, { req: d, anom: d.map((v) => (Math.abs(v - mean) > 2 * sd ? v : null)) })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} domain={["auto", "auto"]} />
            {tip()}
            {legend}
            <Line {...line} dataKey="req" stroke={c("primary")} />
            <Line
              dataKey="anom"
              stroke="none"
              dot={{ r: 7, fill: c("error"), strokeWidth: 0 }}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
            />
          </LineChart>
        ),
      }
    },
  },
  {
    id: "density",
    title: "Session length",
    sub: "Smoothed density",
    kind: "area · density",
    render: (k) => {
      const r = k.rng("dens"),
        xs = Array.from({ length: 61 }, (_, i) => `${i}m`)
      const g = (x: number, m: number, sg: number) => Math.exp(-((x - m) ** 2) / (2 * sg * sg)),
        a = 7 + r() * 4,
        b = 28 + r() * 8
      return {
        config: { density: { label: "Density", color: "tertiary" } },
        chart: (
          <AreaChart data={rows(xs, { density: xs.map((_, x) => +(g(x, a, 4) + g(x, b, 9) * 0.55).toFixed(3)) })} margin={MARGIN}>
            <XAxis {...xAxis} />
            <YAxis hide />
            {tip()}
            <Area {...line} dataKey="density" stroke={c("tertiary")} fill={c("tertiary", 0.2)} fillOpacity={1} />
          </AreaChart>
        ),
      }
    },
  },
  {
    id: "quadrant",
    title: "Effort vs impact",
    sub: "Quadrants at the midpoint",
    kind: "scatter · quadrant",
    render: (k) => {
      const r = k.rng("quad"),
        pts = Array.from({ length: 24 }, () => ({ x: Math.round(r() * 100), y: Math.round(r() * 100) }))
      const col = (p: { x: number; y: number }) =>
        p.x < 50 && p.y >= 50 ? c("tertiary") : p.x >= 50 && p.y >= 50 ? c("primary") : p.x < 50 ? c("outline") : c("error", 0.8)
      return {
        config: { x: { label: "Effort" }, y: { label: "Impact" } },
        chart: (
          <ScatterChart margin={{ ...MARGIN, bottom: 16, left: 8 }}>
            {grid}
            <XAxis {...xNum()} dataKey="x" domain={[0, 100]} label={axisTitle("Effort", "x")} />
            <YAxis {...yAxis()} type="number" dataKey="y" domain={[0, 100]} label={axisTitle("Impact", "y")} />
            <ReferenceLine x={50} stroke={c("outline-variant")} strokeDasharray="4 4" />
            <ReferenceLine y={50} stroke={c("outline-variant")} strokeDasharray="4 4" />
            {tip({ hideLabel: true })}
            <Scatter data={pts}>
              {pts.map((p, i) => (
                <Cell key={i} fill={col(p)} />
              ))}
            </Scatter>
          </ScatterChart>
        ),
      }
    },
  },
  {
    id: "strip",
    title: "Build time by repo",
    sub: "Jittered strip plot",
    kind: "scatter · strip",
    render: (k) => {
      const r = k.rng("strip"),
        repos = ["web", "api", "mobile", "infra", "data"]
      const pts = repos.flatMap((_, i) =>
        Array.from({ length: 18 }, () => ({ x: i + (r() - 0.5) * 0.5, y: Math.round((3 + i * 1.5) * (0.6 + r() * 0.9) * 10) / 10 })),
      )
      return {
        config: { y: { label: "Build (min)" } },
        chart: (
          <ScatterChart margin={MARGIN}>
            {grid}
            <XAxis {...xNum((v) => repos[v] ?? "")} dataKey="x" domain={[-0.6, 4.6]} ticks={[0, 1, 2, 3, 4]} />
            <YAxis {...yAxis((v) => `${v}m`)} type="number" dataKey="y" />
            {tip({ hideLabel: true, valueFormatter: (v, name) => (name === "x" ? repos[Math.round(Number(v))] : `${v} min`) })}
            <Scatter
              data={pts}
              fill={c("primary", 0.5)}
              shape={(p: { cx?: number; cy?: number; fill?: string }) => <circle cx={p.cx} cy={p.cy} r={3.5} fill={p.fill} />}
            />
          </ScatterChart>
        ),
      }
    },
  },
  {
    id: "bubbletime",
    title: "Incidents over time",
    sub: "Size = minutes of impact",
    kind: "bubble · timeline",
    span: "xl:col-span-2",
    render: (k) => {
      const L = k.labels,
        n = L.length,
        r = k.rng("bt"),
        lv = ["SEV-3", "SEV-2", "SEV-1"],
        R = ["secondary", "tertiary", "error"]
      const pts = Array.from({ length: Math.max(6, Math.round(n / 2)) }, () => ({
        x: Math.floor(r() * n),
        y: Math.floor(r() * 3),
        z: Math.round(4 + r() * 14) * 4,
      }))
      return {
        config: { z: { label: "Minutes of impact" } },
        chart: (
          <ScatterChart margin={MARGIN}>
            {grid}
            <XAxis {...xNum((v) => L[Math.round(v)] ?? "")} dataKey="x" domain={[-1, n]} tickCount={7} allowDecimals={false} />
            <YAxis {...yAxis((v) => lv[v] ?? "")} type="number" dataKey="y" domain={[-0.7, 2.7]} ticks={[0, 1, 2]} />
            <ZAxis dataKey="z" range={[80, 1100]} />
            {tip({
              hideLabel: true,
              hideIndicator: true,
              valueFormatter: (v, name) => (name === "x" ? L[Number(v)] : name === "y" ? lv[Number(v)] : `${v} min impact`),
            })}
            <Scatter data={pts}>
              {pts.map((p, i) => (
                <Cell key={i} fill={c(R[p.y], 0.55)} stroke={c(R[p.y])} />
              ))}
            </Scatter>
          </ScatterChart>
        ),
      }
    },
  },
  {
    id: "skills",
    title: "Skills matrix",
    sub: "Team average",
    kind: "radar · circular",
    render: (k) => {
      const r = k.rng("skills"),
        sk = ["Go", "TypeScript", "Kubernetes", "Terraform", "SQL", "Observability"]
      return {
        config: { avg: { label: "Team average", color: "tertiary" } },
        chart: (
          <RadarChart data={rows(sk, { avg: sk.map(() => Math.round(40 + r() * 55)) })} outerRadius="72%">
            <PolarGrid gridType="circle" stroke={c("outline-variant", 0.5)} />
            {radarAxis}
            {tip()}
            <Radar
              dataKey="avg"
              stroke={c("tertiary")}
              fill={c("tertiary", 0.25)}
              fillOpacity={1}
              strokeWidth={2}
              dot={(p: { cx?: number; cy?: number; index?: number }) => (
                <rect
                  key={p.index}
                  x={(p.cx ?? 0) - 4}
                  y={(p.cy ?? 0) - 4}
                  width={8}
                  height={8}
                  transform={`rotate(45 ${p.cx} ${p.cy})`}
                  fill={c("tertiary")}
                />
              )}
            />
          </RadarChart>
        ),
      }
    },
  },
  {
    id: "connected",
    title: "Cost vs latency path",
    sub: "Connected scatter, monthly",
    kind: "scatter · connected",
    render: (k) => {
      const r = k.rng("conn"),
        mo = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
      let x = 40,
        y = 200
      const pts = mo.map((m) => ({
        m,
        x: +(x = Math.max(10, x + (r() - 0.3) * 8)).toFixed(1),
        y: Math.round((y = Math.max(60, y - (r() - 0.25) * 18))),
      }))
      return {
        config: { x: { label: "Cost ($k)" }, y: { label: "p95 (ms)" } },
        chart: (
          <ScatterChart margin={{ ...MARGIN, bottom: 16, left: 8 }}>
            {grid}
            <XAxis {...xNum()} dataKey="x" domain={["auto", "auto"]} label={axisTitle("Monthly cost ($k)", "x")} />
            <YAxis {...yAxis()} type="number" dataKey="y" domain={["auto", "auto"]} label={axisTitle("p95 (ms)", "y")} />
            {tip({ hideLabel: true })}
            <Scatter data={pts} line={{ stroke: c("primary"), strokeWidth: 2 }} lineType="joint">
              {pts.map((_, i) => (
                <Cell key={i} fill={c("primary", 0.3 + (i / pts.length) * 0.7)} />
              ))}
            </Scatter>
          </ScatterChart>
        ),
      }
    },
  },
  {
    id: "histlog",
    title: "Payload sizes",
    sub: "Log-scale histogram",
    kind: "histogram · log",
    render: (k) => {
      const r = k.rng("hlog"),
        b = ["<1KB", "1–4KB", "4–16KB", "16–64KB", "64–256KB", "256KB–1MB", "1–4MB", ">4MB"]
      const v = b.map((_, i) => Math.round(Math.pow(10, 5.5 - i * 0.6) * (0.6 + r() * 0.8)))
      return {
        config: { req: { label: "Requests", color: "secondary" } },
        chart: (
          <BarChart data={rows(b, { req: v })} margin={MARGIN} barCategoryGap="6%">
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(kfmt)} scale="log" domain={[1, "auto"]} allowDataOverflow ticks={[10, 100, 1000, 10000, 100000, 1000000]} />
            {tip()}
            <Bar dataKey="req" fill={c("secondary", 0.8)} radius={[2, 2, 2, 2]} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "samples",
    title: "Latency samples",
    sub: "Raw samples + mean",
    kind: "scatter + line",
    render: (k) => {
      const L = k.labels,
        n = L.length,
        r = k.rng("samp")
      const pts: { x: number; y: number }[] = []
      for (let i = 0; i < n; i++)
        for (let j = 0; j < 6; j++) pts.push({ x: i, y: Math.round(120 + 40 * Math.sin(i / 3) + (r() - 0.5) * 90) })
      const mean = L.map((_, i) => {
        const w = pts.filter((p) => p.x === i)
        return { x: i, mean: Math.round(w.reduce((a, p) => a + p.y, 0) / w.length) }
      })
      return {
        config: { y: { label: "Sample", color: "primary" }, mean: { label: "Mean", color: "error" } },
        chart: (
          <ComposedChart data={mean} margin={MARGIN}>
            {grid}
            <XAxis {...xNum((v) => L[Math.round(v)] ?? "")} dataKey="x" domain={[-0.5, n - 0.5]} tickCount={7} allowDecimals={false} />
            <YAxis {...yAxis(ms)} type="number" />
            {tip({ hideLabel: true })}
            {legend}
            <Scatter
              name="Samples"
              data={pts}
              dataKey="y"
              fill={c("primary", 0.25)}
              shape={(p: { cx?: number; cy?: number; fill?: string }) => <circle cx={p.cx} cy={p.cy} r={2.5} fill={p.fill} />}
            />
            <Line {...line} name="Mean" dataKey="mean" stroke={c("error")} />
          </ComposedChart>
        ),
      }
    },
  },
]

/** "Relationships & distribution" section: all 16 relationship charts. */
function RelationshipCharts({ className }: { className?: string }) {
  return (
    <section id="relationships" className={className ?? "mt-16 scroll-mt-36"} data-toc>
      <KitSectionHeading
        title="Relationships & distribution"
        description="Scatter, bubble, radar and OHLC for correlation, multi-dimensional profiles and price ranges."
      />
      <KitChartGrid specs={RELATIONSHIP_CHARTS} />
    </section>
  )
}

export { RelationshipCharts }
