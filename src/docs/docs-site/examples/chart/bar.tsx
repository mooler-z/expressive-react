import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, chartAxisProps, chartGridProps, type ChartConfig } from "@/components/ui/chart"

const DATA = [
  { month: "Jul", compute: 42, storage: 18, network: 9 },
  { month: "Aug", compute: 48, storage: 19, network: 11 },
  { month: "Sep", compute: 51, storage: 22, network: 10 },
  { month: "Oct", compute: 57, storage: 24, network: 14 },
]

const config = {
  compute: { label: "Compute", color: "primary" },
  storage: { label: "Storage", color: "primary-fixed-dim" },
  network: { label: "Network", color: "tertiary" },
} satisfies ChartConfig

export default function StackedBarChart() {
  return (
    <ChartContainer config={config} className="h-64 w-full max-w-xl">
      <BarChart data={DATA}>
        <CartesianGrid {...chartGridProps} />
        <XAxis dataKey="month" {...chartAxisProps} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent valueFormatter={(v) => `$${v}k`} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="compute" stackId="cost" fill="var(--color-compute)" radius={[0, 0, 6, 6]} />
        <Bar dataKey="storage" stackId="cost" fill="var(--color-storage)" />
        <Bar dataKey="network" stackId="cost" fill="var(--color-network)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
