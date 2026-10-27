import * as React from "react"
import { ToggleButton, ToggleButtonGroup } from "react-aria-components"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts"

import { StatusBadge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  Gauge,
  Sparkline,
  chartAxisProps,
  chartGridProps,
  type ChartConfig,
} from "@/components/ui/chart"
import { Icon } from "@/components/ui/icon"
import { Section, Variant, Variants } from "@/docs/section"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const WEEK = DAYS.map((day, i) => ({ day, requests: [42, 58, 51, 74, 69, 88, 96][i], errors: [4, 6, 3, 9, 5, 7, 4][i] }))
const MONTH = Array.from({ length: 30 }, (_, i) => ({
  day: `Oct ${i + 1}`,
  requests: Math.round(48 + 30 * Math.sin(i / 3.2) + i * 1.6 + ((i * 37) % 11)),
  errors: Math.round(4 + 3 * Math.abs(Math.sin(i / 2.1)) + ((i * 13) % 4)),
}))

const lineConfig = { requests: { label: "Requests", color: "primary" }, errors: { label: "Errors", color: "tertiary" } } satisfies ChartConfig

const SPEND = DAYS.map((day, i) => ({
  day,
  compute: [12, 19, 14, 22, 18, 9, 7][i],
  storage: [8, 9, 10, 11, 12, 6, 5][i],
  network: [5, 6, 4, 8, 7, 3, 2][i],
}))
const spendConfig = {
  compute: { label: "Compute", color: "primary" },
  storage: { label: "Storage", color: "primary-fixed-dim" },
  network: { label: "Network", color: "secondary-container" },
} satisfies ChartConfig

const REGIONS = [
  { region: "americas", value: 48 },
  { region: "emea", value: 32 },
  { region: "apac", value: 20 },
]
const regionConfig = {
  americas: { label: "Americas", color: "primary" },
  emea: { label: "EMEA", color: "primary-fixed-dim" },
  apac: { label: "APAC", color: "secondary-container" },
} satisfies ChartConfig

const P95 = [
  { service: "checkout-api", p95: 238 },
  { service: "ledger", p95: 201 },
  { service: "search", p95: 142 },
  { service: "auth", p95: 96 },
  { service: "ingest", p95: 74 },
]
const p95Config = { p95: { label: "p95 ms", color: "primary" } } satisfies ChartConfig

const HOURS = ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"]
const AREA = HOURS.map((h, i) => ({
  hour: h,
  emea: [12, 10, 9, 11, 18, 26, 30, 28, 27, 24, 19, 15][i],
  americas: [8, 7, 6, 6, 9, 14, 20, 24, 26, 25, 20, 12][i],
  apac: [14, 16, 15, 12, 9, 7, 6, 6, 7, 9, 12, 14][i],
}))
const areaConfig = {
  emea: { label: "EMEA", color: "primary" },
  americas: { label: "Americas", color: "primary-fixed-dim" },
  apac: { label: "APAC", color: "secondary" },
} satisfies ChartConfig

const COMBO = DAYS.map((day, i) => ({ day, deploys: [18, 24, 21, 30, 26, 8, 5][i], errorRate: [0.4, 0.3, 0.6, 0.9, 0.5, 0.2, 0.2][i] }))
const comboConfig = { deploys: { label: "Deploys", color: "primary-fixed-dim" }, errorRate: { label: "Error rate", color: "tertiary" } } satisfies ChartConfig

const pts = (s: number, k: number) =>
  Array.from({ length: 24 }, (_, i) => {
    const x = 4 + ((i * 37 + s) % 120)
    return { x, y: Math.round(40 + x * k + ((i * 53 + s) % 60)) }
  })
const SCATTER_EU = pts(7, 1.1)
const SCATTER_US = pts(19, 1.6)
const scatterConfig = { eu: { label: "eu-1", color: "primary" }, us: { label: "us-1", color: "tertiary" } } satisfies ChartConfig

function ChartCard({ label, value, children, className, action }: { label: string; value: React.ReactNode; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <div className={`rounded-xl bg-surface p-5 ${className ?? ""}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-label-md text-on-surface-variant">{label}</div>
          <div className="mt-1 text-headline-sm font-medium tabular-nums">{value}</div>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function RangeToggle({ value, onChange }: { value: "7d" | "30d"; onChange: (v: "7d" | "30d") => void }) {
  const item =
    "state-layer focus-ring inline-flex h-8 cursor-pointer items-center bg-surface-container px-3 text-label-md text-on-surface-variant shape-morph data-selected:rounded-full data-selected:bg-primary data-selected:text-on-primary"
  return (
    <ToggleButtonGroup
      aria-label="Range"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(k) => onChange([...k][0] as "7d" | "30d")}
      className="inline-flex gap-0.5"
    >
      <ToggleButton id="7d" className={`${item} rounded-l-full rounded-r-[4px]`}>
        7d
      </ToggleButton>
      <ToggleButton id="30d" className={`${item} rounded-l-[4px] rounded-r-full`}>
        30d
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

function Trend({ up, children, tone }: { up: boolean; children: React.ReactNode; tone: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-label-md ${tone}`}>
      <Icon size={16}>{up ? "trending_up" : "trending_down"}</Icon>
      {children}
    </span>
  )
}

export default function ChartSection() {
  const [range, setRange] = React.useState<"7d" | "30d">("7d")
  const data = range === "7d" ? WEEK : MONTH
  const total = data.reduce((s, d) => s + d.requests, 0) * 1000

  return (
    <Section
      id="chart"
      description="Recharts themed with M3 roles: Roboto Flex labels, outline-variant grid, inverse-surface tooltips, primary → primary-fixed-dim → secondary-container series. Colors are CSS variables, so charts follow dark mode and seed colors live."
      spec="https://recharts.github.io/en-US/api"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard label="Requests" value={`${Math.round(total / 1000)}k`} action={<RangeToggle value={range} onChange={setRange} />}>
          <ChartContainer config={lineConfig} className="mt-4 aspect-auto h-52">
            <AreaChart data={data} margin={{ left: 0, right: 4, top: 4 }} accessibilityLayer>
              <CartesianGrid {...chartGridProps} />
              <XAxis dataKey="day" {...chartAxisProps} minTickGap={16} />
              <YAxis {...chartAxisProps} width={36} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="requests" stroke="var(--color-requests)" strokeWidth={2.5} fill="var(--color-requests)" fillOpacity={0.12} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="errors" stroke="var(--color-errors)" strokeWidth={2.5} fill="var(--color-errors)" fillOpacity={0.1} activeDot={{ r: 5 }} />
            </AreaChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard label="Spend by category · stacked" value="$5.8k">
          <ChartContainer config={spendConfig} className="mt-4 aspect-auto h-52">
            <BarChart data={SPEND} margin={{ left: 0, right: 4, top: 4 }} accessibilityLayer>
              <CartesianGrid {...chartGridProps} />
              <XAxis dataKey="day" {...chartAxisProps} />
              <YAxis {...chartAxisProps} width={36} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="compute" stackId="a" fill="var(--color-compute)" radius={[0, 0, 6, 6]} />
              <Bar dataKey="storage" stackId="a" fill="var(--color-storage)" />
              <Bar dataKey="network" stackId="a" fill="var(--color-network)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard label="Traffic by region" value="3 regions" className="md:col-span-2 xl:col-span-1">
          <ChartContainer config={regionConfig} className="mt-4 aspect-auto h-52">
            <PieChart accessibilityLayer>
              <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="region" valueFormatter={(v) => `${v}%`} />} />
              <Pie data={REGIONS} dataKey="value" nameKey="region" innerRadius="62%" outerRadius="88%" paddingAngle={2} cornerRadius={6} strokeWidth={0}>
                {REGIONS.map((r) => (
                  <Cell key={r.region} fill={`var(--color-${r.region})`} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </ChartCard>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-title-md">6 variants</div>
          <div className="text-body-sm text-on-surface-variant">
            KPI sparklines · horizontal bars · ranking · stacked area · bar + line combo · gauge · half doughnut · scatter
          </div>
        </div>
        <Variants cols="md:grid-cols-2 xl:grid-cols-3">
          <Variant n={1} label="KPI sparklines" className="min-h-24 rounded-lg bg-surface px-4 py-1">
            <div className="w-full divide-y divide-outline-variant">
              {[
                { label: "Requests / min", value: "8,420", trend: <Trend up tone="text-primary">+6.2%</Trend>, data: [62, 64, 61, 70, 68, 74, 79, 77, 84], color: "primary" },
                { label: "Error rate", value: "0.21%", trend: <Trend up tone="text-error">+0.05</Trend>, data: [12, 14, 13, 15, 14, 18, 17, 20, 21], color: "error" },
                { label: "Active sessions", value: "1,284", trend: <Trend up={false} tone="text-on-surface-variant">−3.1%</Trend>, data: [40, 42, 39, 37, 38, 35, 36, 33, 34], color: "outline" },
              ].map((k) => (
                <div key={k.label} className="flex items-center gap-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-label-md text-on-surface-variant">{k.label}</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-title-lg font-medium tabular-nums">{k.value}</span>
                      {k.trend}
                    </div>
                  </div>
                  <Sparkline data={k.data} color={k.color} className="shrink-0" aria-label={`${k.label} trend`} />
                </div>
              ))}
            </div>
          </Variant>

          <Variant n={2} label="Horizontal bars · ranking" className="min-h-24 rounded-lg bg-surface p-4">
            <div className="w-full">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-label-md text-on-surface-variant">Slowest services · p95</div>
                  <div className="mt-1 text-headline-sm font-medium tabular-nums">238 ms</div>
                </div>
                <StatusBadge size="md" variant="tertiary" className="gap-1.5">
                  <span className="size-2 rounded-full bg-tertiary" />
                  Over SLO
                </StatusBadge>
              </div>
              <ChartContainer config={p95Config} className="mt-3 aspect-auto h-48">
                <BarChart data={P95} layout="vertical" margin={{ left: 0, right: 8 }} accessibilityLayer>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" {...chartAxisProps} />
                  <YAxis type="category" dataKey="service" {...chartAxisProps} width={96} />
                  <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => `${v} ms`} />} />
                  <Bar dataKey="p95" barSize={14} radius={6}>
                    {P95.map((d) => (
                      <Cell key={d.service} fill={d.p95 > 200 ? "var(--md-tertiary)" : "var(--md-primary)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </Variant>

          <Variant n={3} label="Stacked area" className="min-h-24 rounded-lg bg-surface p-4">
            <div className="w-full">
              <div className="text-label-md text-on-surface-variant">Requests by region · stacked</div>
              <div className="mt-1 text-headline-sm font-medium tabular-nums">1.9M</div>
              <ChartContainer config={areaConfig} className="mt-3 aspect-auto h-48">
                <AreaChart data={AREA} margin={{ left: 0, right: 4, top: 4 }} accessibilityLayer>
                  <CartesianGrid {...chartGridProps} />
                  <XAxis dataKey="hour" {...chartAxisProps} />
                  <YAxis {...chartAxisProps} width={36} />
                  <ChartTooltip content={<ChartTooltipContent labelFormatter={(l) => `${l}:00`} />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area type="monotone" stackId="1" dataKey="emea" stroke="var(--color-emea)" strokeWidth={2} fill="var(--color-emea)" fillOpacity={0.35} />
                  <Area type="monotone" stackId="1" dataKey="americas" stroke="var(--color-americas)" strokeWidth={2} fill="var(--color-americas)" fillOpacity={0.55} />
                  <Area type="monotone" stackId="1" dataKey="apac" stroke="var(--color-apac)" strokeWidth={2} fill="var(--md-secondary-container)" fillOpacity={0.9} />
                </AreaChart>
              </ChartContainer>
            </div>
          </Variant>

          <Variant n={4} label="Bar + line combo" className="min-h-24 rounded-lg bg-surface p-4">
            <div className="w-full">
              <div className="text-label-md text-on-surface-variant">Deploys vs error rate</div>
              <div className="mt-1 text-headline-sm font-medium tabular-nums">132 deploys</div>
              <ChartContainer config={comboConfig} className="mt-3 aspect-auto h-48">
                <ComposedChart data={COMBO} margin={{ left: 0, right: 0, top: 4 }} accessibilityLayer>
                  <CartesianGrid {...chartGridProps} />
                  <XAxis dataKey="day" {...chartAxisProps} />
                  <YAxis yAxisId="left" {...chartAxisProps} width={36} />
                  <YAxis yAxisId="right" orientation="right" {...chartAxisProps} width={48} tickFormatter={(v) => `${v}%`} />
                  <ChartTooltip content={<ChartTooltipContent valueFormatter={(v, name) => (name === "errorRate" ? `${v}%` : v)} />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar yAxisId="left" dataKey="deploys" fill="var(--color-deploys)" radius={6} />
                  <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="var(--color-errorRate)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-errorRate)", strokeWidth: 0 }} />
                </ComposedChart>
              </ChartContainer>
            </div>
          </Variant>

          <Variant n={5} label="Gauge · half doughnut" className="min-h-24 rounded-lg bg-surface p-4">
            <div className="w-full">
              <div className="text-label-md text-on-surface-variant">Error budget · October</div>
              <Gauge value={72} sublabel="remaining" className="mt-2" aria-label="Error budget remaining" />
              <div className="mt-3 flex justify-between text-body-sm text-on-surface-variant">
                <span>12 of 43 min spent</span>
                <span>Resets Nov 1</span>
              </div>
            </div>
          </Variant>

          <Variant n={6} label="Scatter" className="min-h-24 rounded-lg bg-surface p-4">
            <div className="w-full">
              <div className="text-label-md text-on-surface-variant">Latency vs payload</div>
              <div className="mt-1 text-headline-sm font-medium tabular-nums">48 samples</div>
              <ChartContainer config={scatterConfig} className="mt-3 aspect-auto h-48">
                <ScatterChart margin={{ left: 8, right: 4, top: 4, bottom: 12 }} accessibilityLayer>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Payload KB" {...chartAxisProps} label={{ value: "Payload KB", position: "insideBottom", offset: -10 }} />
                  <YAxis type="number" dataKey="y" name="Latency ms" {...chartAxisProps} width={40} label={{ value: "Latency ms", angle: -90, position: "insideLeft", offset: -4, style: { textAnchor: "middle" } }} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Scatter name="eu" data={SCATTER_EU} fill="var(--color-eu)" fillOpacity={0.75} />
                  <Scatter name="us" data={SCATTER_US} fill="var(--color-us)" fillOpacity={0.75} shape="diamond" />
                </ScatterChart>
              </ChartContainer>
            </div>
          </Variant>
        </Variants>
      </div>
    </Section>
  )
}
