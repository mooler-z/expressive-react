"use client"

import * as React from "react"
import { Bar, BarChart, Cell, ComposedChart, Legend, Line, Pie, PieChart, XAxis, YAxis } from "recharts"

import { type KitChartSpec, KitChartGrid, KitSectionHeading } from "./chart-card"
import { DotLegend, MARGIN, c, grid, legend, rows, tip, xAxis, yAxis } from "./kit-chart-parts"
import { type DashboardKit, kfmt, wave } from "./kit-data"

/* Composition · shares, capacity and conversion. */

const pct = (v: number) => `${v}%`
const RING = { stroke: c("surface-container-low"), strokeWidth: 3 }
const cat = { type: "category", dataKey: "label", tickLine: false, axisLine: false, tickMargin: 8, width: "auto" } as const

function slices(labels: string[], values: number[], roles: (string | [string, number])[]) {
  return labels.map((label, i) => {
    const role = roles[i]
    return { label, value: values[i], fill: Array.isArray(role) ? c(role[0], role[1]) : c(role) }
  })
}

const pieLegend = (items: { label: string; fill: string }[]) => (
  <Legend
    content={() => (
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3 text-label-md text-on-surface-variant">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full" style={{ background: it.fill }} />
            {it.label}
          </div>
        ))}
      </div>
    )}
  />
)

/* ---------- SVG polar charts (polar area, rose, exploded pie) ---------- */

function arc(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const large = a1 - a0 > Math.PI ? 1 : 0
  const [x0, y0] = p(r1, a0),
    [x1, y1] = p(r1, a1),
    [x2, y2] = p(r0, a1),
    [x3, y3] = p(r0, a0)
  return r0 > 0
    ? `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`
    : `M${cx},${cy} L${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} Z`
}

type Slice = { label: string; value: number; fill: string }

/**
 * Polar area (equal angles, radius ∝ value) or pie (angle ∝ value) drawn in SVG, with hover readout.
 * Accepts and ignores the width/height that ResponsiveContainer passes down.
 */
function PolarSvg({
  data,
  mode,
  explode = [],
  legendItems,
  grid: showGrid = true,
  format = (s: Slice) => `${s.label}: ${s.value}`,
}: {
  data: Slice[]
  mode: "polar" | "pie"
  explode?: number[]
  legendItems?: Slice[]
  grid?: boolean
  format?: (s: Slice) => string
  width?: number
  height?: number
}) {
  const [hover, setHover] = React.useState<number | null>(null)
  const max = Math.max(...data.map((d) => d.value)),
    total = data.reduce((a, d) => a + d.value, 0)
  let acc = -Math.PI / 2
  return (
    <div className="flex size-full flex-col">
      <div className="relative min-h-0 flex-1">
        <svg viewBox="-110 -110 220 220" className="size-full" role="presentation">
          {mode === "polar" &&
            showGrid &&
            [0.25, 0.5, 0.75, 1].map((f) => <circle key={f} r={100 * f} fill="none" stroke={c("outline-variant", 0.5)} />)}
          {data.map((d, i) => {
            const a0 = acc,
              a1 = mode === "polar" ? acc + (2 * Math.PI) / data.length : acc + (2 * Math.PI * d.value) / total
            acc = a1
            const r = mode === "polar" ? (100 * d.value) / max : 100
            const off = explode[i] ?? 0,
              mid = (a0 + a1) / 2
            return (
              <path
                key={d.label}
                d={arc(off * Math.cos(mid), off * Math.sin(mid), 0, hover === i ? r + 4 : r, a0, a1)}
                fill={d.fill}
                stroke={c("surface-container-low")}
                strokeWidth={mode === "pie" ? 2 : 1}
                className="transition-[d] duration-200"
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
              >
                <title>{format(d)}</title>
              </path>
            )
          })}
        </svg>
        {hover != null && (
          <div className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 rounded-sm bg-inverse-surface px-2.5 py-1.5 text-body-sm whitespace-nowrap text-inverse-on-surface shadow-2">
            {format(data[hover])}
          </div>
        )}
      </div>
      {legendItems && <DotLegendRaw items={legendItems} />}
    </div>
  )
}

function DotLegendRaw({ items }: { items: { label: string; fill: string }[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-3 text-label-md text-on-surface-variant">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 rounded-full" style={{ background: it.fill }} />
          {it.label}
        </div>
      ))}
    </div>
  )
}

/* ---------- Shared data (centers read the same numbers as the charts) ---------- */

export const donutData = (k: DashboardKit) => {
  const r = k.rng("doughnut"),
    raw = [42, 31, 19, 8].map((v) => v + (r() - 0.5) * 6),
    t = raw.reduce((a, b) => a + b, 0)
  return raw.map((v) => Math.round((v / t) * 100))
}
export const gaugeValue = (k: DashboardKit) => 45 + Math.round(k.rng("gauge")() * 40)
const cloudData = (k: DashboardKit) => {
  const r = k.rng("cloud")
  return [96, 58, 38, 20].map((v) => Math.round(v + r() * 10))
}
const onbValue = (k: DashboardKit) => 50 + Math.round(k.rng("onb")() * 40)

export const COMPOSITION_CHARTS: KitChartSpec[] = [
  {
    id: "doughnut",
    title: "Traffic by region",
    sub: "Share of requests",
    kind: "doughnut",
    center: (k) => ({ value: donutData(k)[0] + "%", sub: "from Europe", className: "justify-center pb-12" }),
    render: (k) => {
      const d = slices(["Europe", "North America", "Asia Pacific", "Other"], donutData(k), [
        "primary",
        "tertiary",
        "secondary",
        "outline-variant",
      ])
      return {
        config: { value: { label: "Share" } },
        chart: (
          <PieChart>
            {tip({ hideLabel: true, nameKey: "label", valueFormatter: (v, _n, it) => `${(it.payload as Slice).label}: ${v}%` })}
            {pieLegend(d)}
            <Pie data={d} dataKey="value" nameKey="label" innerRadius="72%" outerRadius="100%" {...RING} />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "pie",
    title: "Incidents by cause",
    sub: "Last 90 days",
    kind: "pie",
    render: (k) => {
      const r = k.rng("pie")
      const d = slices(
        ["Deploy", "Config", "Capacity", "Dependency", "Other"],
        [34, 22, 18, 16, 10].map((v) => Math.round(v + r() * 8)),
        ["primary", "tertiary", "secondary", "error", "outline-variant"],
      )
      return {
        config: { value: { label: "Incidents" } },
        chart: (
          <PieChart>
            {tip({ hideLabel: true, nameKey: "label", valueFormatter: (v, _n, it) => `${(it.payload as Slice).label}: ${v}` })}
            {pieLegend(d)}
            <Pie data={d} dataKey="value" nameKey="label" outerRadius="100%" {...RING} />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "gauge",
    title: "CPU saturation",
    sub: "Cluster average",
    kind: "gauge",
    center: (k) => ({ value: gaugeValue(k) + "%", sub: "of capacity", className: "justify-end pb-6" }),
    render: (k) => {
      const v = gaugeValue(k)
      const d = [
        { label: "Used", value: v, fill: v > 80 ? c("error") : c("primary") },
        { label: "Free", value: 100 - v, fill: c("surface-container-highest") },
      ]
      return {
        config: { value: { label: "CPU" } },
        chart: (
          <PieChart>
            <Pie
              data={d}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              cy="88%"
              innerRadius="94%"
              outerRadius="120%"
              cornerRadius={8}
              stroke="none"
              isAnimationActive
            />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "polar",
    title: "Tickets by channel",
    sub: "Support volume this month",
    kind: "polar area",
    render: (k) => {
      const r = k.rng("polar")
      const d = slices(
        ["Email", "Chat", "Phone", "Slack", "Portal"],
        [40, 64, 18, 52, 30].map((v) => Math.round(v + r() * 20)),
        [
          ["primary", 0.75],
          ["tertiary", 0.75],
          ["secondary", 0.75],
          ["error", 0.6],
          ["outline", 0.5],
        ],
      )
      return { config: {}, raw: true, chart: <PolarSvg data={d} mode="polar" legendItems={d} /> }
    },
  },
  {
    id: "nested",
    title: "Accounts vs revenue",
    sub: "Outer: accounts · inner: revenue",
    kind: "nested doughnut",
    render: (k) => {
      const r = k.rng("nested"),
        j = (a: number[]) => a.map((v) => Math.round(v + (r() - 0.5) * 8))
      const L = ["Starter", "Business", "Enterprise"]
      const acc = slices(L, j([58, 31, 11]), [["primary", 0.35], ["primary", 0.65], "primary"])
      const rev = slices(L, j([12, 41, 47]), [["tertiary", 0.35], ["tertiary", 0.65], "tertiary"])
      return {
        config: { value: { label: "Share" } },
        chart: (
          <PieChart>
            {tip({ hideLabel: true, valueFormatter: (v, _n, it) => `${(it.payload as Slice).label}: ${v}%` })}
            {pieLegend(acc)}
            <Pie
              data={acc}
              dataKey="value"
              nameKey="label"
              innerRadius="70%"
              outerRadius="100%"
              stroke={c("surface-container-low")}
              strokeWidth={2}
            />
            <Pie
              data={rev}
              dataKey="value"
              nameKey="label"
              innerRadius="38%"
              outerRadius="68%"
              stroke={c("surface-container-low")}
              strokeWidth={2}
            />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "funnel",
    title: "Activation funnel",
    sub: "Visitors to paid, last 30 days",
    kind: "funnel",
    render: (k) => {
      const r = k.rng("funnel"),
        st = ["Visited", "Signed up", "Connected", "Deployed", "Paid"]
      let v = 12400
      const vals = st.map((_, i) => (i === 0 ? v : (v = Math.round(v * (0.35 + r() * 0.35)))))
      return {
        config: { users: { label: "Users" } },
        chart: (
          <BarChart data={rows(st, { users: vals.map((x) => [-x / 2, x / 2]) })} layout="vertical" margin={MARGIN} barCategoryGap="12%">
            <XAxis type="number" hide domain={[-vals[0] / 2, vals[0] / 2]} />
            <YAxis {...cat} />
            {tip({
              hideIndicator: true,
              valueFormatter: (_v, _n, it) => {
                const i = st.indexOf(String(it.payload?.label))
                return vals[i].toLocaleString("en-US") + (i ? ` · ${Math.round((vals[i] / vals[i - 1]) * 100)}% of previous` : "")
              },
            })}
            <Bar dataKey="users" radius={[8, 8, 8, 8]}>
              {st.map((_, i) => (
                <Cell key={i} fill={c("primary", 1 - i * 0.16)} />
              ))}
            </Bar>
          </BarChart>
        ),
      }
    },
  },
  {
    id: "gaugeseg",
    title: "Health score",
    sub: "Segmented gauge",
    kind: "gauge · segments",
    center: () => ({ value: "78", sub: "health score", className: "justify-end pb-14" }),
    render: () => {
      const d = slices(["Poor", "Fair", "Good"], [40, 30, 30], [["error", 0.7], ["secondary", 0.6], "tertiary"])
      return {
        config: {},
        chart: (
          <PieChart>
            {pieLegend(d)}
            <Pie
              data={d}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              cy="78%"
              innerRadius="110%"
              outerRadius="140%"
              paddingAngle={2}
              cornerRadius={6}
              stroke="none"
            />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "donutround",
    title: "Storage by type",
    sub: "Rounded, spaced segments",
    kind: "doughnut · rounded",
    render: (k) => {
      const r = k.rng("dr")
      const d = slices(
        ["Objects", "Block", "Snapshots", "Logs", "Backups"],
        [38, 24, 16, 12, 10].map((v) => Math.round(v + r() * 6)),
        [
          ["primary", 0.85],
          ["tertiary", 0.85],
          ["secondary", 0.85],
          ["error", 0.85],
          ["outline", 0.85],
        ],
      )
      return {
        config: { value: { label: "Share" } },
        chart: (
          <PieChart>
            {tip({ hideLabel: true, valueFormatter: (v, _n, it) => `${(it.payload as Slice).label}: ${v}%` })}
            {pieLegend(d)}
            <Pie
              data={d}
              dataKey="value"
              nameKey="label"
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={3}
              cornerRadius={10}
              stroke="none"
            />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "pieexplode",
    title: "Cost by environment",
    sub: "Production pulled out",
    kind: "pie · exploded",
    render: (k) => {
      const r = k.rng("pe")
      const d = slices(
        ["Production", "Staging", "Dev", "Sandbox"],
        [61, 19, 14, 6].map((v) => Math.round(v + r() * 5)),
        ["primary", ["primary", 0.6], ["primary", 0.35], "outline-variant"],
      )
      return {
        config: {},
        raw: true,
        chart: <PolarSvg data={d} mode="pie" explode={[10]} legendItems={d} format={(s) => `${s.label}: ${s.value}%`} />,
      }
    },
  },
  {
    id: "sunburst",
    title: "Org breakdown",
    sub: "Division → team → squad",
    kind: "sunburst",
    render: (k) => {
      const r = k.rng("sun"),
        j = (a: number[]) => a.map((v) => Math.max(1, Math.round(v + (r() - 0.5) * 4)))
      const R = ["primary", "tertiary", "secondary"],
        D = ["Product", "Go-to-market", "Operations"]
      const squads = j([10, 8, 7, 5, 6, 4, 5, 4, 3, 3, 2, 3]).map((value, i) => ({
        label: `Squad ${i + 1}`,
        value,
        fill: c(R[[0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2][i]], 0.3 + (i % 4) * 0.12),
      }))
      const teams = j([18, 12, 10, 9, 6, 5]).map((value, i) => ({
        label: `Team ${i + 1}`,
        value,
        fill: c(R[[0, 0, 1, 1, 2, 2][i]], 0.6 + (i % 2) * 0.15),
      }))
      const divs = j([30, 19, 11]).map((value, i) => ({ label: D[i], value, fill: c(R[i]) }))
      const ring = { stroke: c("surface-container-low"), strokeWidth: 1, dataKey: "value", nameKey: "label" }
      return {
        config: { value: { label: "Headcount" } },
        chart: (
          <PieChart>
            {tip({ hideLabel: true, valueFormatter: (v, _n, it) => `${(it.payload as Slice).label}: ${v}` })}
            {pieLegend(divs)}
            <Pie data={divs} {...ring} innerRadius="20%" outerRadius="46%" />
            <Pie data={teams} {...ring} innerRadius="47%" outerRadius="72%" />
            <Pie data={squads} {...ring} innerRadius="73%" outerRadius="100%" />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "col100",
    title: "Plan mix over time",
    sub: "100% stacked columns",
    kind: "bar · 100% columns",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("c100"),
        n = k.labels.length
      const raw = [wave(r, n, 50, 8), wave(r, n, 35, 8), wave(r, n, 15, 5)]
      const p = (i: number) => raw[i].map((v, j) => +((v / (raw[0][j] + raw[1][j] + raw[2][j])) * 100).toFixed(1))
      return {
        config: {
          s: { label: "Starter", color: "primary" },
          b: { label: "Business", color: "primary" },
          e: { label: "Enterprise", color: "primary" },
        },
        chart: (
          <BarChart data={rows(k.labels, { s: p(0), b: p(1), e: p(2) })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(pct)} domain={[0, 100]} allowDataOverflow />
            {tip({ valueFormatter: (v) => `${v}%` })}
            {legend}
            <Bar dataKey="s" stackId="x" fill={c("primary", 0.3)} maxBarSize={22} />
            <Bar dataKey="b" stackId="x" fill={c("primary", 0.65)} maxBarSize={22} />
            <Bar dataKey="e" stackId="x" fill={c("primary")} maxBarSize={22} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "vfunnel",
    title: "Trial conversion",
    sub: "Columns + step conversion",
    kind: "funnel · columns",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("vf"),
        st = ["Trial", "Activated", "Invited team", "Connected", "Paid"]
      let v = 4200
      const vals = st.map((_, i) => (i ? (v = Math.round(v * (0.45 + r() * 0.35))) : v))
      const conv = vals.map((x, i) => (i ? Math.round((x / vals[i - 1]) * 100) : 100))
      return {
        config: { accounts: { label: "Accounts", color: "tertiary" }, conv: { label: "Step conversion", color: "primary" } },
        chart: (
          <ComposedChart data={rows(st, { accounts: vals, conv })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis yAxisId="l" {...yAxis(kfmt)} />
            <YAxis yAxisId="r" orientation="right" {...yAxis(pct)} domain={[0, 100]} />
            {tip()}
            {legend}
            <Bar yAxisId="l" dataKey="accounts" radius={[8, 8, 8, 8]} maxBarSize={56} fill={c("tertiary")}>
              {st.map((_, i) => (
                <Cell key={i} fill={c("tertiary", 1 - i * 0.15)} />
              ))}
            </Bar>
            <Line
              yAxisId="r"
              dataKey="conv"
              type="linear"
              stroke={c("primary")}
              strokeWidth={2.5}
              dot={{ r: 4, fill: c("primary"), strokeWidth: 0 }}
            />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "semipie",
    title: "Device share",
    sub: "Half pie",
    kind: "pie · semi",
    render: (k) => {
      const r = k.rng("sp")
      const d = slices(
        ["Desktop", "Mobile", "Tablet", "CLI"],
        [48, 31, 9, 12].map((v) => Math.round(v + r() * 5)),
        ["primary", "tertiary", "secondary", "outline-variant"],
      )
      return {
        config: { value: { label: "Share" } },
        chart: (
          <PieChart>
            {tip({ hideLabel: true, valueFormatter: (v, _n, it) => `${(it.payload as Slice).label}: ${v}%` })}
            {pieLegend(d)}
            <Pie
              data={d}
              dataKey="value"
              nameKey="label"
              startAngle={180}
              endAngle={0}
              cy="80%"
              outerRadius="125%"
              stroke={c("surface-container-low")}
              strokeWidth={2}
            />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "donuttotal",
    title: "Spend by cloud",
    sub: "Monthly, with total",
    kind: "doughnut · total",
    center: (k) => ({ value: "$" + cloudData(k).reduce((a, b) => a + b, 0) + "k", sub: "per month", className: "justify-center pb-12" }),
    render: (k) => {
      const d = slices(["AWS", "GCP", "Azure", "On-prem"], cloudData(k), ["primary", "tertiary", "secondary", "outline-variant"])
      return {
        config: { value: { label: "Spend" } },
        chart: (
          <PieChart>
            {tip({ hideLabel: true, valueFormatter: (v, _n, it) => `${(it.payload as Slice).label}: $${v}k` })}
            {pieLegend(d)}
            <Pie data={d} dataKey="value" nameKey="label" innerRadius="74%" outerRadius="100%" {...RING} />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "rose",
    title: "Alerts by hour",
    sub: "Rose / nightingale",
    kind: "polar · rose",
    render: (k) => {
      const r = k.rng("rose"),
        H = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0") + ":00")
      const d = H.map((label, i) => {
        const biz = i >= 8 && i <= 18
        return { label, value: Math.round((biz ? 14 : 4) * (0.4 + r() * 0.8)), fill: c(biz ? "tertiary" : "primary", 0.7) }
      })
      return { config: {}, raw: true, chart: <PolarSvg data={d} mode="polar" format={(s) => `${s.label} · ${s.value} alerts`} /> }
    },
  },
  {
    id: "progressdonut",
    title: "Onboarding",
    sub: "Single-value doughnut",
    kind: "doughnut · progress",
    center: (k) => ({ value: onbValue(k) + "%", sub: "complete", className: "justify-center" }),
    render: (k) => {
      const v = onbValue(k)
      const d = [
        { label: "Done", value: v, fill: c("tertiary") },
        { label: "Remaining", value: 100 - v, fill: c("surface-container-highest") },
      ]
      return {
        config: {},
        chart: (
          <PieChart>
            <Pie
              data={d}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              innerRadius="82%"
              outerRadius="100%"
              cornerRadius={999}
              stroke="none"
            />
          </PieChart>
        ),
      }
    },
  },
  {
    id: "singlestack",
    title: "Budget allocation",
    sub: "One stacked bar, hover segments",
    kind: "bar · single stacked",
    span: "xl:col-span-3",
    h: "h-36",
    render: (k) => {
      const r = k.rng("ss")
      const parts = [
        ["eng", "Engineering", "primary", 1],
        ["sales", "Sales", "tertiary", 1],
        ["mkt", "Marketing", "secondary", 1],
        ["sup", "Support", "primary", 0.4],
        ["ga", "G&A", "outline-variant", 1],
      ] as const
      const row = { label: "Budget", ...Object.fromEntries(parts.map(([key]) => [key, Math.round(8 + r() * 30)])) }
      return {
        config: Object.fromEntries(parts.map(([key, label]) => [key, { label }])),
        chart: (
          <BarChart data={[row]} layout="vertical" margin={MARGIN} barCategoryGap="15%">
            <XAxis type="number" hide domain={[0, "dataMax"]} />
            <YAxis type="category" dataKey="label" hide />
            {tip({ hideLabel: true, valueFormatter: (v) => `$${v}M` }, { shared: false })}
            <Legend content={() => <DotLegend items={parts.map(([, label, role]) => [label, role])} />} />
            {parts.map(([key, , role, a], i) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="s"
                fill={c(role, a)}
                radius={i === 0 ? [12, 0, 0, 12] : i === parts.length - 1 ? [0, 12, 12, 0] : 0}
              />
            ))}
          </BarChart>
        ),
      }
    },
  },
]

/** "Composition" section: all 17 composition charts. */
function CompositionCharts({ className }: { className?: string }) {
  return (
    <section id="composition" className={className ?? "mt-16 scroll-mt-36"} data-toc>
      <KitSectionHeading
        title="Composition"
        description="Shares, capacity and conversion: doughnut, pie, gauge, polar area, nested doughnut and funnel."
      />
      <KitChartGrid specs={COMPOSITION_CHARTS} />
    </section>
  )
}

export { CompositionCharts, PolarSvg }
