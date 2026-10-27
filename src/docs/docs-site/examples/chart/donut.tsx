import { Cell, Pie, PieChart } from "recharts"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const DATA = [
  { region: "emea", value: 46 },
  { region: "americas", value: 34 },
  { region: "apac", value: 20 },
]

const config = {
  emea: { label: "EMEA", color: "primary" },
  americas: { label: "Americas", color: "primary-fixed-dim" },
  apac: { label: "APAC", color: "tertiary" },
} satisfies ChartConfig

export default function DonutChart() {
  return (
    <ChartContainer config={config} className="h-72 w-full max-w-sm">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="region" valueFormatter={(v) => `${v}%`} />} />
        <Pie data={DATA} dataKey="value" nameKey="region" innerRadius="62%" outerRadius="88%" paddingAngle={2} cornerRadius={6} strokeWidth={0}>
          {DATA.map((d) => (
            <Cell key={d.region} fill={`var(--color-${d.region})`} />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartContainer>
  )
}
