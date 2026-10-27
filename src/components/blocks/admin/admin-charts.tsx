"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Sparkline,
  chartAxisProps,
  chartColor,
  chartGridProps,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

import { DATA, RANGES, moneyK, rangeLabels, series, wave, type RangeKey } from "./admin-data"

/*
 * Admin charts · the kit's Chart.js charts (m3/charts.js registry) ported to the Recharts kit.
 * Each fills its parent: give the wrapper a height (h-52, h-72 …).
 */

const fill = "h-full aspect-auto"
const legend = <ChartLegend content={<ChartLegendContent />} />

function rows<T extends Record<string, number>>(labels: string[], cols: Record<keyof T, number[]>) {
  return labels.map((label, i) => {
    const row: Record<string, string | number> = { label }
    for (const k in cols) row[k] = cols[k][i]
    return row
  })
}

/* ---------- Overview ---------- */

const SPARK = ["primary", "tertiary", "secondary", "primary"] as const

export function KpiSpark({ index, range, className }: { index: number; range: RangeKey; className?: string }) {
  const data = series("k" + index, 100, 40, 0.012, RANGES[range].n, range)
  return <Sparkline data={data} color={SPARK[index]} className={cn("h-full w-full", className)} aria-label="Trend" />
}

export function RevenueChart({ range, compare }: { range: RangeKey; compare: boolean }) {
  const { mult: m, n } = RANGES[range]
  const labels = rangeLabels(range)
  const mrr = series("rev", 52, 12, 0.01, n, range).map((v) => v * m)
  const prev = series("revp", 46, 12, 0.008, n, range).map((v) => v * m)
  const data = labels.map((label, i) => ({ label, mrr: mrr[i], target: Math.round((50 + (i * 8) / n) * m), prev: prev[i] }))
  const config = {
    mrr: { label: "MRR", color: "primary" },
    target: { label: "Target", color: "outline" },
    prev: { label: "Previous period", color: "tertiary" },
  } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} minTickGap={24} />
        <YAxis {...chartAxisProps} width={52} tickFormatter={moneyK} tickCount={5} domain={["auto", "auto"]} />
        <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => moneyK(Number(v))} />} />
        <Area type="monotone" dataKey="mrr" stroke="var(--color-mrr)" strokeWidth={2} fill="var(--color-mrr)" fillOpacity={0.14} dot={false} />
        <Area type="monotone" dataKey="target" stroke="var(--color-target)" strokeWidth={1.5} strokeDasharray="6 6" fill="none" dot={false} />
        {compare && <Area type="monotone" dataKey="prev" stroke="var(--color-prev)" strokeWidth={2} fill="none" dot={false} />}
      </AreaChart>
    </ChartContainer>
  )
}

export const PLAN_MIX = [
  { name: "Enterprise", value: 58, color: "primary", dot: "bg-primary" },
  { name: "Business", value: 29, color: "tertiary", dot: "bg-tertiary" },
  { name: "Add-ons", value: 9, color: "primary-fixed-dim", dot: "bg-primary-fixed-dim" },
  { name: "Starter", value: 4, color: "secondary-container", dot: "bg-secondary-container" },
]

export function PlanChart() {
  const config = Object.fromEntries(PLAN_MIX.map((p) => [p.name, { label: p.name, color: p.color }])) satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" valueFormatter={(v) => v + "%"} />} />
        <Pie data={PLAN_MIX} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="100%" paddingAngle={2} cornerRadius={6} stroke="none" startAngle={90} endAngle={-270}>
          {PLAN_MIX.map((p) => (
            <Cell key={p.name} fill={chartColor(p.color)} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

/* ---------- Analytics ---------- */

export function TrafficChart({ range, compare }: { range: RangeKey; compare: boolean }) {
  const { mult: m, n } = RANGES[range]
  const s = (k: string, b: number) => series("tr" + k, b, b * 0.5, 0.01, n, range).map((v) => v * m)
  const prev = series("trp", 900, 260, 0.005, n, range).map((v) => v * m)
  const data = rows(rangeLabels(range), { eu: s("eu", 420), us: s("us", 360), ap: s("ap", 210), prev })
  const config = {
    eu: { label: "EU", color: "primary" },
    us: { label: "US", color: "primary-fixed-dim" },
    ap: { label: "APAC", color: "tertiary" },
    prev: { label: "Previous total", color: "on-surface-variant" },
  } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <ComposedChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} minTickGap={24} />
        <YAxis {...chartAxisProps} width={48} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {legend}
        <Bar dataKey="eu" stackId="now" fill="var(--color-eu)" />
        <Bar dataKey="us" stackId="now" fill="var(--color-us)" />
        <Bar dataKey="ap" stackId="now" fill="var(--color-ap)" radius={[4, 4, 0, 0]} />
        {compare && <Line dataKey="prev" stroke="var(--color-prev)" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />}
      </ComposedChart>
    </ChartContainer>
  )
}

export function AdoptionChart() {
  const labels = ["Inventory", "Policy", "Rollouts", "Observe", "Cost", "API"]
  const data = rows(labels, { now: [92, 74, 81, 58, 44, 67], last: [88, 61, 70, 41, 30, 59] })
  const config = { now: { label: "This quarter", color: "primary" }, last: { label: "Last quarter", color: "tertiary" } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={chartColor("outline-variant", 0.7)} />
        <PolarAngleAxis dataKey="label" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {legend}
        <Radar dataKey="now" stroke="var(--color-now)" fill="var(--color-now)" fillOpacity={0.2} dot={{ r: 3, fill: "var(--color-now)" }} />
        <Radar dataKey="last" stroke="var(--color-last)" fill="var(--color-last)" fillOpacity={0.08} dot={{ r: 3, fill: "var(--color-last)" }} />
      </RadarChart>
    </ChartContainer>
  )
}

export function LatencyChart({ range, compare }: { range: RangeKey; compare: boolean }) {
  const n = RANGES[range].n
  const data = rows(rangeLabels(range), {
    p50: series("latp50", 42, 10, -0.002, n, range),
    p95: series("latp95", 180, 40, -0.002, n, range),
    p99: series("latp99", 420, 120, -0.002, n, range),
    prev: series("latp", 210, 40, 0, n, range),
  })
  const config = {
    p50: { label: "p50", color: "primary" },
    p95: { label: "p95", color: "tertiary" },
    p99: { label: "p99", color: "error" },
    prev: { label: "p95 previous", color: "outline" },
  } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <AreaChart data={data} margin={{ left: 4, right: 8, top: 8 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} minTickGap={24} />
        <YAxis {...chartAxisProps} width={56} tickCount={5} tickFormatter={(v) => v + " ms"} />
        <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => v + " ms"} />} />
        {legend}
        <Area type="monotone" dataKey="p50" stroke="var(--color-p50)" strokeWidth={2} fill="var(--color-p50)" fillOpacity={0.08} dot={false} />
        <Area type="monotone" dataKey="p95" stroke="var(--color-p95)" strokeWidth={2} fill="none" dot={false} />
        <Area type="monotone" dataKey="p99" stroke="var(--color-p99)" strokeWidth={2} fill="none" dot={false} />
        {compare && <Area type="monotone" dataKey="prev" stroke="var(--color-prev)" strokeWidth={1.5} strokeDasharray="5 5" fill="none" dot={false} />}
      </AreaChart>
    </ChartContainer>
  )
}

export function FunnelChart() {
  const steps = [
    { label: "Visited", value: 100, color: chartColor("primary") },
    { label: "Signed up", value: 38, color: chartColor("primary", 0.78) },
    { label: "Connected", value: 24, color: chartColor("primary", 0.58) },
    { label: "First deploy", value: 17, color: chartColor("primary", 0.42) },
    { label: "Paid", value: 9, color: chartColor("tertiary") },
  ]
  return (
    <ChartContainer config={{ value: { label: "Visitors" } }} className={fill}>
      <BarChart data={steps} layout="vertical" margin={{ left: 4, right: 12 }} barCategoryGap="22%">
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[0, 100]} {...chartAxisProps} tickFormatter={(v) => v + "%"} tickCount={5} />
        <YAxis type="category" dataKey="label" {...chartAxisProps} width={84} />
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="label" valueFormatter={(v) => v + "% of visitors"} />} />
        <Bar dataKey="value" radius={8}>
          {steps.map((s) => (
            <Cell key={s.label} fill={s.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

/* ---------- Orders · products ---------- */

export function OrdersDailyChart() {
  const d = series("od", 14, 10, 0.01, 30)
  const data = d.map((v, i) => ({ label: "Oct " + (i + 1), orders: v, today: i === 24 }))
  return (
    <ChartContainer config={{ orders: { label: "Orders", color: "primary" } }} className={fill}>
      <BarChart data={data} margin={{ left: 0, right: 4, top: 8 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} minTickGap={16} />
        <YAxis {...chartAxisProps} width={28} tickCount={4} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="orders" radius={6}>
          {data.map((r) => (
            <Cell key={r.label} fill={r.today ? chartColor("primary") : chartColor("primary", 0.3)} className="transition-[fill] hover:fill-primary" />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export function ProductRevenueChart() {
  const data = DATA.products.map((p) => ({ label: p.short, rev: p.revK, color: chartColor(p.role) }))
  return (
    <ChartContainer config={{ rev: { label: "Revenue YTD" } }} className={fill}>
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 12 }} barCategoryGap="20%">
        <CartesianGrid horizontal={false} />
        <XAxis type="number" {...chartAxisProps} tickFormatter={moneyK} tickCount={6} />
        <YAxis type="category" dataKey="label" {...chartAxisProps} width={88} />
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="label" valueFormatter={(v) => moneyK(Number(v))} />} />
        <Bar dataKey="rev" radius={8}>
          {data.map((r) => (
            <Cell key={r.label} fill={r.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

/* ---------- Customers · inventory · reports · developers ---------- */

export function CustomerUsageChart({ range }: { range: RangeKey }) {
  const labels = rangeLabels(range)
  const data = rows(labels, { workloads: wave(labels.length, 120, 14, 1).map((v, i) => v + i), seats: wave(labels.length, 90, 8, 2) })
  const config = { workloads: { label: "Workloads", color: "primary" }, seats: { label: "Seats active", color: "tertiary" } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} minTickGap={24} />
        <YAxis {...chartAxisProps} width={36} domain={["auto", "auto"]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {legend}
        <Area type="monotone" dataKey="workloads" stroke="var(--color-workloads)" strokeWidth={2} fill="var(--color-workloads)" fillOpacity={0.12} dot={false} />
        <Area type="monotone" dataKey="seats" stroke="var(--color-seats)" strokeWidth={2} fill="none" dot={false} />
      </AreaChart>
    </ChartContainer>
  )
}

export function InventoryCapacityChart() {
  const regions = ["eu-central-1", "eu-north-1", "us-east-1", "us-west-2", "ap-northeast-1", "ap-southeast-2"]
  const data = rows(regions, { used: [62, 48, 71, 55, 66, 38], reserved: [18, 22, 14, 20, 16, 24], free: [20, 30, 15, 25, 18, 38] })
  const config = {
    used: { label: "In use", color: "primary" },
    reserved: { label: "Reserved", color: "tertiary" },
    free: { label: "Free", color: "surface-container-highest" },
  } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <BarChart data={data} layout="vertical" margin={{ left: 4, right: 12 }} barSize={18}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" domain={[0, 100]} {...chartAxisProps} tickFormatter={(v) => v + "%"} />
        <YAxis type="category" dataKey="label" {...chartAxisProps} width={104} />
        <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => v + "%"} />} />
        {legend}
        <Bar dataKey="used" stackId="a" fill="var(--color-used)" />
        <Bar dataKey="reserved" stackId="a" fill="var(--color-reserved)" />
        <Bar dataKey="free" stackId="a" fill="var(--color-free)" />
      </BarChart>
    </ChartContainer>
  )
}

export function ReportsTrendChart({ range }: { range: RangeKey }) {
  const labels = rangeLabels(range)
  const n = labels.length
  const data = rows(labels, { ent: wave(n, 60, 9, 0), biz: wave(n, 40, 6, 1), start: wave(n, 12, 1.8, 2) })
  const config = {
    ent: { label: "Enterprise", color: "primary" },
    biz: { label: "Business", color: "tertiary" },
    start: { label: "Starter", color: "secondary" },
  } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} minTickGap={24} />
        <YAxis {...chartAxisProps} width={44} tickFormatter={(v) => "$" + v + "k"} domain={["auto", "auto"]} />
        <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => "$" + v + "k"} />} />
        {legend}
        <Area type="monotone" dataKey="ent" stroke="var(--color-ent)" strokeWidth={2} fill="var(--color-ent)" fillOpacity={0.1} dot={false} />
        <Area type="monotone" dataKey="biz" stroke="var(--color-biz)" strokeWidth={2} fill="none" dot={false} />
        <Area type="monotone" dataKey="start" stroke="var(--color-start)" strokeWidth={2} fill="none" dot={false} />
      </AreaChart>
    </ChartContainer>
  )
}

export function ReportsRegionChart() {
  const data = rows(["EU", "US", "APAC", "LATAM"], { now: [182, 151, 74, 22], prev: [160, 148, 61, 18] })
  const config = { now: { label: "This period", color: "primary" }, prev: { label: "Previous", color: chartColor("primary", 0.35) } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <BarChart data={data} margin={{ left: 0, right: 8, top: 8 }} maxBarSize={28}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} />
        <YAxis {...chartAxisProps} width={44} tickFormatter={(v) => "$" + v + "k"} />
        <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => "$" + v + "k"} />} />
        {legend}
        <Bar dataKey="now" fill="var(--color-now)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="prev" fill="var(--color-prev)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function DevCallsChart({ range }: { range: RangeKey }) {
  const labels = rangeLabels(range)
  const n = labels.length
  const data = rows(labels, { calls: wave(n, 420, 80, 0.5), errors: wave(n, 12, 6, 2).map((v) => +(v / 10).toFixed(1)) })
  const config = { calls: { label: "API calls (k)", color: chartColor("primary", 0.75) }, errors: { label: "Error rate %", color: "error" } } satisfies ChartConfig
  return (
    <ChartContainer config={config} className={fill}>
      <ComposedChart data={data} margin={{ left: 0, right: 0, top: 8 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="label" {...chartAxisProps} minTickGap={24} />
        <YAxis yAxisId="y" {...chartAxisProps} width={40} />
        <YAxis yAxisId="y1" orientation="right" {...chartAxisProps} width={40} tickFormatter={(v) => v + "%"} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {legend}
        <Bar yAxisId="y" dataKey="calls" fill="var(--color-calls)" maxBarSize={14} radius={[3, 3, 0, 0]} />
        <Line yAxisId="y1" dataKey="errors" stroke="var(--color-errors)" strokeWidth={2} dot={false} type="monotone" />
      </ComposedChart>
    </ChartContainer>
  )
}

/** Simple wrapper used when a generic "LineChart" is all a page needs. */
export function MiniLine({ data, color = "primary", className }: { data: number[]; color?: string; className?: string }) {
  return (
    <ChartContainer config={{ v: { color } }} className={cn(fill, className)}>
      <LineChart data={data.map((v, i) => ({ i, v }))}>
        <Line dataKey="v" stroke="var(--color-v)" strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  )
}

