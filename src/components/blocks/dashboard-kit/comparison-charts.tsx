"use client"

import { Bar, BarChart, Cell, ComposedChart, Line, PolarAngleAxis, RadialBar, RadialBarChart, XAxis, YAxis } from "recharts"

import { ChartLegend } from "@/components/ui/chart"

import { type KitChartSpec, KitChartGrid, KitSectionHeading } from "./chart-card"
import { DotLegend, MARGIN, R6, c, grid, legend, line, rows, tip, xAxis, xNum, yAxis } from "./kit-chart-parts"
import { kfmt, wave } from "./kit-data"

/* Comparison & ranking · bars for categories, ranking, change over time and bridges. */

const ms = (v: number) => `${v} ms`
const pct = (v: number) => `${v}%`
const FULL: [number, number, number, number] = [999, 999, 999, 999]
const cat = { type: "category", dataKey: "label", tickLine: false, axisLine: false, tickMargin: 8, width: "auto" } as const

/** Box-and-whisker drawn inside one [min, max] range bar. */
function BoxShape(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  payload?: { min: number; q1: number; med: number; q3: number; max: number }
}) {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props
  if (!payload) return null
  const { min, q1, med, q3, max } = payload
  const py = (v: number) => y + (height * (max - v)) / (max - min || 1)
  const cx = x + width / 2,
    bw = Math.min(width * 0.5, 48)
  return (
    <g>
      <line x1={cx} x2={cx} y1={py(max)} y2={py(min)} stroke={c("outline")} strokeWidth={2} />
      <line x1={cx - bw / 4} x2={cx + bw / 4} y1={py(max)} y2={py(max)} stroke={c("outline")} strokeWidth={2} />
      <line x1={cx - bw / 4} x2={cx + bw / 4} y1={py(min)} y2={py(min)} stroke={c("outline")} strokeWidth={2} />
      <rect
        x={cx - bw / 2}
        y={py(q3)}
        width={bw}
        height={py(q1) - py(q3)}
        rx={4}
        fill={c("primary", 0.35)}
        stroke={c("primary")}
        strokeWidth={1.5}
      />
      <line x1={cx - bw / 2} x2={cx + bw / 2} y1={py(med)} y2={py(med)} stroke={c("on-surface")} strokeWidth={3} />
    </g>
  )
}

export const COMPARISON_CHARTS: KitChartSpec[] = [
  {
    id: "grouped",
    title: "Deploys by team",
    sub: "This period vs previous",
    kind: "bar · grouped",
    render: (k) => {
      const r = k.rng("grouped"),
        t = ["Platform", "Payments", "Identity", "Search", "Data", "Edge"]
      const data = rows(t, { now: t.map(() => 40 + Math.round(r() * 120)), prev: t.map(() => 30 + Math.round(r() * 110)) })
      return {
        config: { now: { label: "This period", color: "primary" }, prev: { label: "Previous", color: "primary" } },
        chart: (
          <BarChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} minTickGap={0} interval={0} angle={-30} textAnchor="end" height={48} />
            <YAxis {...yAxis()} />
            {tip()}
            {legend}
            <Bar dataKey="now" fill={c("primary")} radius={R6} maxBarSize={20} />
            <Bar dataKey="prev" fill={c("primary", 0.35)} radius={R6} maxBarSize={20} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "stacked",
    title: "Spend by service",
    sub: "Daily cost, stacked",
    kind: "bar · stacked",
    span: "xl:col-span-2",
    render: (k) => {
      const n = k.labels.length,
        r = k.rng("stacked")
      const data = rows(k.labels, { compute: wave(r, n, 120, 30), storage: wave(r, n, 60, 10), network: wave(r, n, 30, 10) })
      return {
        config: {
          compute: { label: "Compute", color: "primary" },
          storage: { label: "Storage", color: "tertiary" },
          network: { label: "Network", color: "secondary" },
        },
        chart: (
          <BarChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis((v) => "$" + kfmt(v))} />
            {tip({ valueFormatter: (v) => `$${v}` })}
            {legend}
            <Bar dataKey="compute" stackId="s" fill={c("primary")} maxBarSize={22} />
            <Bar dataKey="storage" stackId="s" fill={c("tertiary")} maxBarSize={22} />
            <Bar dataKey="network" stackId="s" fill={c("secondary", 0.7)} radius={[6, 6, 0, 0]} maxBarSize={22} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "hbar",
    title: "Slowest endpoints",
    sub: "p95 latency, ms",
    kind: "bar · horizontal",
    render: (k) => {
      const r = k.rng("hbar"),
        e = ["/checkout", "/search", "/auth/token", "/orders", "/cart", "/inventory", "/users/me", "/health"]
      const v = e.map(() => 60 + Math.round(r() * 380)).sort((a, b) => b - a)
      return {
        config: { p95: { label: "p95", color: "primary" } },
        chart: (
          <BarChart data={rows(e, { p95: v })} layout="vertical" margin={MARGIN}>
            {grid}
            <XAxis {...xNum(ms)} />
            <YAxis {...cat} />
            {tip({ valueFormatter: (x) => `${x} ms` })}
            <Bar dataKey="p95" radius={R6} maxBarSize={18}>
              {v.map((_, i) => (
                <Cell key={i} fill={i === 0 ? c("error") : c("primary", 1 - i * 0.08)} />
              ))}
            </Bar>
          </BarChart>
        ),
      }
    },
  },
  {
    id: "diverging",
    title: "Net seat change",
    sub: "Seats added minus removed",
    kind: "bar · diverging",
    render: (k) => {
      const r = k.rng("div"),
        t = ["Platform", "Payments", "Identity", "Search", "Data", "Edge", "Mobile", "Growth"]
      const v = t.map(() => Math.round(r() * 60 - 20))
      return {
        config: { net: { label: "Net seats" } },
        chart: (
          <BarChart data={rows(t, { net: v })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis((x) => (x > 0 ? "+" : "") + x)} />
            {tip()}
            <Bar dataKey="net" radius={R6} maxBarSize={22}>
              {v.map((x, i) => (
                <Cell key={i} fill={x >= 0 ? c("tertiary") : c("error")} />
              ))}
            </Bar>
          </BarChart>
        ),
      }
    },
  },
  {
    id: "stacked100",
    title: "Plan mix by region",
    sub: "Share of accounts",
    kind: "bar · 100%",
    render: (k) => {
      const r = k.rng("s100"),
        reg = ["EU", "US East", "US West", "APAC", "LATAM"]
      const raw = reg.map(() => [20 + r() * 40, 30 + r() * 40, 10 + r() * 30])
      const p = (i: number) => raw.map((a) => +((a[i] / (a[0] + a[1] + a[2])) * 100).toFixed(1))
      return {
        config: {
          starter: { label: "Starter", color: "primary" },
          business: { label: "Business", color: "primary" },
          enterprise: { label: "Enterprise", color: "primary" },
        },
        chart: (
          <BarChart data={rows(reg, { starter: p(0), business: p(1), enterprise: p(2) })} layout="vertical" margin={MARGIN}>
            {grid}
            <XAxis {...xNum(pct)} domain={[0, 100]} allowDataOverflow />
            <YAxis {...cat} />
            {tip({ valueFormatter: (v) => `${v}%` })}
            {legend}
            <Bar dataKey="starter" stackId="s" fill={c("primary", 0.3)} maxBarSize={22} />
            <Bar dataKey="business" stackId="s" fill={c("primary", 0.65)} maxBarSize={22} />
            <Bar dataKey="enterprise" stackId="s" fill={c("primary")} maxBarSize={22} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "combo",
    title: "Revenue and margin",
    sub: "Revenue (bars) · gross margin (line)",
    kind: "bar + line",
    span: "xl:col-span-2",
    render: (k) => {
      const n = k.labels.length,
        r = k.rng("combo")
      const rev = wave(r, n, 120, 25, 1),
        margin = k.labels.map((_, i) => +(62 + 6 * Math.sin(i / 2) + r() * 3).toFixed(1))
      return {
        config: { revenue: { label: "Revenue", color: "primary" }, margin: { label: "Margin", color: "tertiary" } },
        chart: (
          <ComposedChart data={rows(k.labels, { revenue: rev, margin })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis yAxisId="l" {...yAxis((v) => `$${v}k`)} />
            <YAxis yAxisId="r" orientation="right" {...yAxis(pct)} domain={[40, 80]} />
            {tip()}
            {legend}
            <Bar yAxisId="l" dataKey="revenue" fill={c("primary", 0.8)} radius={R6} maxBarSize={18} />
            <Line {...line} yAxisId="r" dataKey="margin" stroke={c("tertiary")} dot={{ r: 3, fill: c("tertiary"), strokeWidth: 0 }} />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "waterfall",
    title: "ARR bridge",
    sub: "Q3 start to end, $M",
    kind: "waterfall",
    render: (k) => {
      const r = k.rng("wf"),
        s = 4.2
      const nw = +(0.5 + r() * 0.5).toFixed(1),
        ex = +(0.3 + r() * 0.4).toFixed(1),
        co = +(0.2 + r() * 0.2).toFixed(1),
        ch = +(0.2 + r() * 0.3).toFixed(1)
      const a = s,
        b = a + nw,
        d = b + ex,
        e = d - co,
        f = e - ch
      const data = [
        [0, s],
        [a, b],
        [b, d],
        [e, d],
        [f, e],
        [0, +f.toFixed(1)],
      ]
      const kind = ["t", "u", "u", "d", "d", "t"]
      const label = ["Start", "New", "Expansion", "Contraction", "Churn", "End"]
      return {
        config: { arr: { label: "ARR" } },
        chart: (
          <BarChart data={rows(label, { arr: data })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} minTickGap={0} interval={0} angle={-30} textAnchor="end" height={48} />
            <YAxis {...yAxis((v) => `$${v}M`)} />
            {tip({
              valueFormatter: (v, _n, item) => {
                const [lo, hi] = v as unknown as number[],
                  kk = kind[label.indexOf(String(item.payload?.label))]
                return kk === "t" ? `$${hi.toFixed(1)}M` : `${kk === "u" ? "+" : "−"}$${(hi - lo).toFixed(1)}M`
              },
            })}
            <Bar dataKey="arr" radius={R6} maxBarSize={40}>
              {kind.map((x, i) => (
                <Cell key={i} fill={x === "t" ? c("primary") : x === "u" ? c("tertiary") : c("error")} />
              ))}
            </Bar>
          </BarChart>
        ),
      }
    },
  },
  {
    id: "histogram",
    title: "Latency distribution",
    sub: "Requests per 25 ms bucket",
    kind: "histogram",
    render: (k) => {
      const r = k.rng("hist"),
        bins = Array.from({ length: 20 }, (_, i) => `${i * 25}–${i * 25 + 25}`)
      const v = bins.map((_, i) => Math.round(900 * Math.exp(-Math.pow(Math.log(i + 1.5) - 1.6, 2) / 0.35) + r() * 40))
      return {
        config: { req: { label: "Requests", color: "primary" } },
        chart: (
          <BarChart data={rows(bins, { req: v })} margin={MARGIN} barCategoryGap="6%">
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(kfmt)} />
            {tip()}
            <Bar dataKey="req" fill={c("primary", 0.85)} radius={[2, 2, 2, 2]} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "floating",
    title: "Maintenance windows",
    sub: "Scheduled, UTC",
    kind: "floating bar",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("flt"),
        reg = ["eu-central-1", "eu-north-1", "us-east-1", "us-west-2", "ap-northeast-1", "ap-southeast-2"]
      const f = (h: number) => String(Math.floor(h)).padStart(2, "0") + ":" + (h % 1 ? "30" : "00")
      const data = reg.map(() => {
        const s = Math.round(r() * 38) / 2
        return [s, Math.min(24, s + 1 + Math.round(r() * 6) / 2)]
      })
      return {
        config: { window: { label: "Window" } },
        chart: (
          <BarChart data={rows(reg, { window: data })} layout="vertical" margin={MARGIN}>
            <XAxis {...xNum((v) => `${String(v).padStart(2, "0")}:00`)} domain={[0, 24]} ticks={[0, 4, 8, 12, 16, 20, 24]} />
            <YAxis {...cat} />
            {grid}
            {tip({ valueFormatter: (v) => `${f((v as unknown as number[])[0])}–${f((v as unknown as number[])[1])} UTC` })}
            <Bar dataKey="window" fill={c("tertiary")} radius={FULL} maxBarSize={18} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "lollipop",
    title: "Errors by service",
    sub: "Last 24 hours",
    kind: "lollipop",
    render: (k) => {
      const r = k.rng("lol"),
        sv = ["checkout", "search", "identity", "edge", "billing", "ledger", "auth", "notify"]
      const v = sv.map(() => Math.round(5 + r() * 60))
      return {
        config: { stem: { label: "Errors" }, errors: { label: "Errors", color: "primary" } },
        chart: (
          <ComposedChart data={rows(sv, { stem: v, errors: v })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} />
            {tip({}, { filterNull: true })}
            <Bar dataKey="stem" fill={c("primary", 0.45)} barSize={3} tooltipType="none" />
            <Line
              dataKey="errors"
              stroke="none"
              dot={{ r: 7, fill: c("primary"), strokeWidth: 0 }}
              activeDot={{ r: 9 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "dumbbell",
    title: "Before / after tuning",
    sub: "p95 per endpoint",
    kind: "dumbbell",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("dumb"),
        e = ["/checkout", "/search", "/orders", "/cart", "/auth", "/users"]
      const b = e.map(() => Math.round(180 + r() * 220)),
        a = b.map((v) => Math.round(v * (0.45 + r() * 0.3)))
      return {
        config: { before: { label: "Before", color: "outline" }, after: { label: "After", color: "primary" } },
        chart: (
          <ComposedChart data={rows(e, { gap: a.map((v, i) => [v, b[i]]), before: b, after: a })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(ms)} />
            {tip({ valueFormatter: (v) => `${v} ms` })}
            <ChartLegend
              content={() => (
                <DotLegend
                  items={[
                    ["Before", "outline"],
                    ["After", "primary"],
                  ]}
                />
              )}
            />
            <Bar dataKey="gap" fill={c("outline-variant")} barSize={4} tooltipType="none" legendType="none" />
            <Line
              dataKey="before"
              stroke="none"
              dot={{ r: 7, fill: c("outline"), strokeWidth: 0 }}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
            />
            <Line
              dataKey="after"
              stroke="none"
              dot={{ r: 7, fill: c("primary"), strokeWidth: 0 }}
              activeDot={{ r: 8 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "hstacked",
    title: "Tickets by priority",
    sub: "Per team, stacked",
    kind: "bar · h-stacked",
    render: (k) => {
      const r = k.rng("hst"),
        t = ["Platform", "Payments", "Identity", "Search", "Data"],
        d = () => t.map(() => Math.round(4 + r() * 20))
      return {
        config: { p1: { label: "P1", color: "error" }, p2: { label: "P2", color: "tertiary" }, p3: { label: "P3", color: "primary" } },
        chart: (
          <BarChart data={rows(t, { p1: d(), p2: d(), p3: d() })} layout="vertical" margin={MARGIN}>
            {grid}
            <XAxis {...xNum()} />
            <YAxis {...cat} />
            {tip()}
            {legend}
            <Bar dataKey="p1" stackId="s" fill={c("error")} maxBarSize={20} />
            <Bar dataKey="p2" stackId="s" fill={c("tertiary")} maxBarSize={20} />
            <Bar dataKey="p3" stackId="s" fill={c("primary", 0.45)} radius={[0, 6, 6, 0]} maxBarSize={20} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "hgrouped",
    title: "Budget vs actual",
    sub: "Per department, $k",
    kind: "bar · h-grouped",
    render: (k) => {
      const r = k.rng("hgr"),
        t = ["Engineering", "Sales", "Marketing", "Support", "G&A"]
      const data = rows(t, { budget: t.map(() => Math.round(200 + r() * 400)), actual: t.map(() => Math.round(180 + r() * 420)) })
      return {
        config: { budget: { label: "Budget", color: "primary" }, actual: { label: "Actual", color: "primary" } },
        chart: (
          <BarChart data={data} layout="vertical" margin={MARGIN}>
            {grid}
            <XAxis {...xNum((v) => `$${v}k`)} />
            <YAxis {...cat} />
            {tip({ valueFormatter: (v) => `$${v}k` })}
            {legend}
            <Bar dataKey="budget" fill={c("primary", 0.35)} radius={R6} maxBarSize={14} />
            <Bar dataKey="actual" fill={c("primary")} radius={R6} maxBarSize={14} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "target",
    title: "Weekly deploys vs goal",
    sub: "Bars under goal are muted",
    kind: "bar + target",
    render: (k) => {
      const r = k.rng("tgt"),
        w = Array.from({ length: 10 }, (_, i) => "W" + (34 + i)),
        g = 60
      const v = w.map(() => Math.round(35 + r() * 45))
      return {
        config: { deploys: { label: "Deploys", color: "primary" }, goal: { label: "Goal", color: "error" } },
        chart: (
          <ComposedChart data={rows(w, { deploys: v, goal: w.map(() => g) })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} />
            {tip()}
            {legend}
            <Bar dataKey="deploys" radius={R6} maxBarSize={24} fill={c("primary")}>
              {v.map((x, i) => (
                <Cell key={i} fill={x >= g ? c("primary") : c("primary", 0.35)} />
              ))}
            </Bar>
            <Line dataKey="goal" type="linear" stroke={c("error")} strokeDasharray="6 5" strokeWidth={1.5} dot={false} />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "pareto",
    title: "Incident causes",
    sub: "Pareto: sorted + cumulative %",
    kind: "pareto",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("par"),
        cs = ["Deploy", "Config", "Capacity", "Dependency", "Network", "DNS", "Certs", "Other"]
      const v = cs.map(() => Math.round(4 + r() * 40)).sort((a, b) => b - a),
        t = v.reduce((a, b) => a + b, 0)
      let acc = 0
      const cum = v.map((x) => +(((acc += x) / t) * 100).toFixed(1))
      return {
        config: { incidents: { label: "Incidents", color: "primary" }, cum: { label: "Cumulative %", color: "error" } },
        chart: (
          <ComposedChart data={rows(cs, { incidents: v, cum })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis yAxisId="l" {...yAxis()} />
            <YAxis yAxisId="r" orientation="right" {...yAxis(pct)} domain={[0, 100]} />
            {tip()}
            {legend}
            <Bar yAxisId="l" dataKey="incidents" fill={c("primary", 0.8)} radius={R6} maxBarSize={36} />
            <Line
              yAxisId="r"
              dataKey="cum"
              type="linear"
              stroke={c("error")}
              strokeWidth={2.5}
              dot={{ r: 3, fill: c("error"), strokeWidth: 0 }}
            />
          </ComposedChart>
        ),
      }
    },
  },
  {
    id: "pnl",
    title: "Net cash flow",
    sub: "Monthly, $k",
    kind: "bar · ±",
    render: (k) => {
      const r = k.rng("pnl"),
        mo = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"]
      const v = mo.map(() => Math.round((r() - 0.35) * 240))
      const money = (x: number) => (x < 0 ? "−$" : "$") + Math.abs(x) + "k"
      return {
        config: { net: { label: "Net cash" } },
        chart: (
          <BarChart data={rows(mo, { net: v })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(money)} />
            {tip({ valueFormatter: (x) => money(Number(x)) })}
            <Bar dataKey="net" radius={R6} maxBarSize={22}>
              {v.map((x, i) => (
                <Cell key={i} fill={x >= 0 ? c("tertiary") : c("error")} />
              ))}
            </Bar>
          </BarChart>
        ),
      }
    },
  },
  {
    id: "rangecol",
    title: "Daily latency range",
    sub: "Min to max per day",
    kind: "bar · range",
    render: (k) => {
      const r = k.rng("rcol")
      const data = k.labels.map(() => {
        const lo = 40 + Math.round(r() * 60)
        return [lo, lo + 30 + Math.round(r() * 160)]
      })
      return {
        config: { range: { label: "Range" } },
        chart: (
          <BarChart data={rows(k.labels, { range: data })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(ms)} />
            {tip({ valueFormatter: (v) => `${(v as unknown as number[])[0]}–${(v as unknown as number[])[1]} ms` })}
            <Bar dataKey="range" fill={c("tertiary", 0.7)} radius={FULL} maxBarSize={12} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "boxplot",
    title: "Response time spread",
    sub: "Box plot per region",
    kind: "box plot",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("box"),
        g = ["Frankfurt", "Stockholm", "Virginia", "Oregon", "Tokyo", "Sydney"]
      const st = g.map((label) => {
        const m = 60 + r() * 120,
          q = 10 + r() * 30
        const s = {
          min: Math.round(m - q * 2.4),
          q1: Math.round(m - q),
          med: Math.round(m),
          q3: Math.round(m + q),
          max: Math.round(m + q * 3),
        }
        return { label, ...s, range: [s.min, s.max] }
      })
      return {
        config: { range: { label: "Spread" } },
        chart: (
          <BarChart data={st} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis(ms)} />
            {tip({
              hideIndicator: true,
              valueFormatter: (_v, _n, item) => {
                const p = item.payload as (typeof st)[number]
                return `min ${p.min} · q1 ${p.q1} · med ${p.med} · q3 ${p.q3} · max ${p.max}`
              },
            })}
            <Bar dataKey="range" shape={<BoxShape />} isAnimationActive={false} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "progress",
    title: "Quota usage",
    sub: "Used vs limit per team",
    kind: "bar · progress",
    render: (k) => {
      const r = k.rng("prog"),
        t = ["Platform", "Payments", "Identity", "Search", "Data", "Edge"]
      const v = t.map(() => Math.round(20 + r() * 80))
      return {
        config: { used: { label: "Used" } },
        chart: (
          <BarChart data={rows(t, { used: v })} layout="vertical" margin={MARGIN}>
            <XAxis {...xNum(pct)} domain={[0, 100]} />
            <YAxis {...cat} />
            {tip({ valueFormatter: (x) => `${x}% of quota` })}
            <Bar dataKey="used" radius={FULL} maxBarSize={12} background={{ fill: c("surface-container-highest"), radius: 999 }}>
              {v.map((x, i) => (
                <Cell key={i} fill={x > 85 ? c("error") : c("primary")} />
              ))}
            </Bar>
          </BarChart>
        ),
      }
    },
  },
  {
    id: "pyramid",
    title: "Seats by tenure",
    sub: "Business ← → Enterprise",
    kind: "bar · pyramid",
    render: (k) => {
      const r = k.rng("pyr"),
        b = ["<3 mo", "3–6 mo", "6–12 mo", "1–2 yr", "2–3 yr", "3+ yr"]
      const data = rows(b, { business: b.map(() => -Math.round(20 + r() * 80)), enterprise: b.map(() => Math.round(10 + r() * 70)) })
      return {
        config: { business: { label: "Business", color: "primary" }, enterprise: { label: "Enterprise", color: "tertiary" } },
        chart: (
          <BarChart data={data} layout="vertical" stackOffset="sign" margin={MARGIN}>
            {grid}
            <XAxis {...xNum((v) => String(Math.abs(v)))} />
            <YAxis {...cat} />
            {tip({ valueFormatter: (v) => `${Math.abs(Number(v))} seats` })}
            {legend}
            <Bar dataKey="business" stackId="s" fill={c("primary")} radius={[4, 0, 0, 4]} maxBarSize={18} />
            <Bar dataKey="enterprise" stackId="s" fill={c("tertiary")} radius={[0, 4, 4, 0]} maxBarSize={18} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "highlight",
    title: "Signups by channel",
    sub: "Click a bar to highlight it",
    kind: "bar · highlight",
    render: (k, ui) => {
      const r = k.rng("hl"),
        ch = ["Organic", "Paid", "Referral", "Partner", "Events", "Social"]
      const v = ch.map(() => Math.round(40 + r() * 260)),
        mi = v.indexOf(Math.max(...v))
      const sel = typeof ui.value === "number" ? ui.value : mi
      return {
        config: { signups: { label: "Signups", color: "primary" } },
        chart: (
          <BarChart data={rows(ch, { signups: v })} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} />
            {tip()}
            <Bar dataKey="signups" radius={[8, 8, 8, 8]} maxBarSize={40} cursor="pointer" onClick={(_d, i) => ui.set(i)}>
              {v.map((_, i) => (
                <Cell key={i} fill={i === sel ? c("primary") : c("primary", 0.25)} />
              ))}
            </Bar>
          </BarChart>
        ),
      }
    },
  },
  {
    id: "statuscol",
    title: "Builds by status",
    sub: "Passed · flaky · failed",
    kind: "bar · status",
    span: "xl:col-span-2",
    render: (k) => {
      const r = k.rng("stc"),
        n = k.labels.length
      const data = rows(k.labels, { passed: wave(r, n, 60, 12), flaky: wave(r, n, 8, 4), failed: wave(r, n, 4, 3) })
      return {
        config: {
          passed: { label: "Passed", color: "tertiary" },
          flaky: { label: "Flaky", color: "secondary" },
          failed: { label: "Failed", color: "error" },
        },
        chart: (
          <BarChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis()} />
            {tip()}
            {legend}
            <Bar dataKey="passed" stackId="s" fill={c("tertiary")} maxBarSize={18} />
            <Bar dataKey="flaky" stackId="s" fill={c("secondary", 0.7)} maxBarSize={18} />
            <Bar dataKey="failed" stackId="s" fill={c("error")} radius={[6, 6, 0, 0]} maxBarSize={18} />
          </BarChart>
        ),
      }
    },
  },
  {
    id: "radialbars",
    title: "Quota rings",
    sub: "Compute · storage · egress",
    kind: "radial bar",
    render: (k) => {
      const r = k.rng("rb")
      const data = [
        ["Egress", "secondary"],
        ["Storage", "tertiary"],
        ["Compute", "primary"],
      ].map(([label, role]) => ({ label, value: Math.round(30 + r() * 65), fill: c(role) }))
      return {
        config: { value: { label: "Used" } },
        chart: (
          <RadialBarChart data={data} innerRadius="30%" outerRadius="100%" startAngle={90} endAngle={-270} barCategoryGap="18%">
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            {tip({
              hideLabel: true,
              nameKey: "label",
              valueFormatter: (v, _n, item) => `${(item.payload as { label: string }).label}: ${v}%`,
            })}
            <RadialBar dataKey="value" background cornerRadius={8} />
          </RadialBarChart>
        ),
      }
    },
  },
  {
    id: "groupstack",
    title: "Spend: plan vs actual",
    sub: "Stacked groups by quarter",
    kind: "bar · grouped stacked",
    span: "xl:col-span-3",
    render: (k) => {
      const r = k.rng("gs"),
        q = ["Q1", "Q2", "Q3", "Q4"],
        d = () => q.map(() => Math.round(30 + r() * 60))
      const data = rows(q, { pc: d(), ps: d(), ac: d(), as: d() })
      return {
        config: {
          pc: { label: "Plan · compute", color: "primary" },
          ps: { label: "Plan · storage", color: "tertiary" },
          ac: { label: "Actual · compute", color: "primary" },
          as: { label: "Actual · storage", color: "tertiary" },
        },
        chart: (
          <BarChart data={data} margin={MARGIN}>
            {grid}
            <XAxis {...xAxis} />
            <YAxis {...yAxis((v) => `$${v}k`)} />
            {tip({ valueFormatter: (v) => `$${v}k` })}
            {legend}
            <Bar dataKey="pc" stackId="plan" fill={c("primary", 0.35)} maxBarSize={36} />
            <Bar dataKey="ps" stackId="plan" fill={c("tertiary", 0.35)} radius={[6, 6, 0, 0]} maxBarSize={36} />
            <Bar dataKey="ac" stackId="actual" fill={c("primary")} maxBarSize={36} />
            <Bar dataKey="as" stackId="actual" fill={c("tertiary")} radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        ),
      }
    },
  },
]


/** "Comparison & ranking" section: all 24 comparison charts. */
function ComparisonCharts({ className }: { className?: string }) {
  return (
    <section id="comparison" className={className ?? "mt-16 scroll-mt-36"} data-toc>
      <KitSectionHeading
        title="Comparison & ranking"
        description="Bars for comparing categories, ranking, change over time and bridges between two totals."
      />
      <KitChartGrid specs={COMPARISON_CHARTS} />
    </section>
  )
}

export { ComparisonCharts }
