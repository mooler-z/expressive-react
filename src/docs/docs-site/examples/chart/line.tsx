import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, chartAxisProps, chartGridProps, type ChartConfig } from "@/components/ui/chart"

const DATA = [
  { hour: "00", p50: 82, p95: 140 },
  { hour: "04", p50: 76, p95: 128 },
  { hour: "08", p50: 95, p95: 190 },
  { hour: "12", p50: 110, p95: 236 },
  { hour: "16", p50: 104, p95: 214 },
  { hour: "20", p50: 88, p95: 161 },
]

const config = {
  p50: { label: "p50", color: "secondary" },
  p95: { label: "p95", color: "primary" },
} satisfies ChartConfig

export default function LatencyLineChart() {
  return (
    <ChartContainer config={config} className="h-64 w-full max-w-xl">
      <LineChart data={DATA} margin={{ left: 0, right: 8 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="hour" {...chartAxisProps} tickFormatter={(h) => `${h}:00`} />
        <YAxis {...chartAxisProps} width={40} unit=" ms" />
        <ChartTooltip content={<ChartTooltipContent indicator="line" valueFormatter={(v) => `${v} ms`} />} />
        <Line type="monotone" dataKey="p50" stroke="var(--color-p50)" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="p95" stroke="var(--color-p95)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-p95)", strokeWidth: 0 }} />
      </LineChart>
    </ChartContainer>
  )
}
