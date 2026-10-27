import { Bar, BarChart, Cell, XAxis } from "recharts"

import { CHART_SERIES, ChartContainer, ChartTooltip, ChartTooltipContent, chartAxisProps, chartColor, type ChartConfig } from "@/components/ui/chart"

const DATA = CHART_SERIES.map((role, i) => ({ role, value: 40 + i * 12 }))

const config = { value: { label: "Value" } } satisfies ChartConfig

export default function ChartColors() {
  return (
    <ChartContainer config={config} className="h-56 w-full max-w-xl">
      <BarChart data={DATA}>
        <XAxis dataKey="role" {...chartAxisProps} tick={{ fontSize: 11 }} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideIndicator />} />
        <Bar dataKey="value" radius={8}>
          {DATA.map((d) => (
            <Cell key={d.role} fill={chartColor(d.role)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
