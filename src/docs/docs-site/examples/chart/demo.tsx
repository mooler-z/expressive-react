import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  chartAxisProps,
  chartGridProps,
  type ChartConfig,
} from "@/components/ui/chart"

const DATA = [
  { day: "Mon", requests: 4200, errors: 120 },
  { day: "Tue", requests: 5100, errors: 98 },
  { day: "Wed", requests: 4800, errors: 210 },
  { day: "Thu", requests: 6100, errors: 140 },
  { day: "Fri", requests: 7300, errors: 90 },
  { day: "Sat", requests: 3900, errors: 60 },
  { day: "Sun", requests: 3400, errors: 45 },
]

const config = {
  requests: { label: "Requests", color: "primary" },
  errors: { label: "Errors", color: "tertiary" },
} satisfies ChartConfig

export default function ChartDemo() {
  return (
    <ChartContainer config={config} className="h-72 w-full max-w-3xl">
      <AreaChart data={DATA} margin={{ left: 0, right: 8 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="day" {...chartAxisProps} />
        <YAxis {...chartAxisProps} width={44} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area type="monotone" dataKey="requests" stroke="var(--color-requests)" strokeWidth={2.5} fill="var(--color-requests)" fillOpacity={0.12} />
        <Area type="monotone" dataKey="errors" stroke="var(--color-errors)" strokeWidth={2.5} fill="var(--color-errors)" fillOpacity={0.1} />
      </AreaChart>
    </ChartContainer>
  )
}
