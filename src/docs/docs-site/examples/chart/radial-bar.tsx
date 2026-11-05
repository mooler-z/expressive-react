import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

const config = {
  students: { label: "Students", color: "primary" },
  teachers: { label: "Teachers", color: "tertiary" },
  staff: { label: "Staff", color: "secondary" },
} satisfies ChartConfig

const DATA = [
  { name: "staff", value: 84, fill: "var(--color-staff)" },
  { name: "teachers", value: 97, fill: "var(--color-teachers)" },
  { name: "students", value: 92, fill: "var(--color-students)" },
]

export default function RadialBarAttendance() {
  return (
    <ChartContainer config={config} className="h-80 w-full max-w-sm">
      <RadialBarChart data={DATA} innerRadius="36%" outerRadius="96%" startAngle={90} endAngle={-270} barSize={16}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="name" valueFormatter={(v) => `${v}% present`} />} />
        <RadialBar dataKey="value" background cornerRadius={8} />
        <ChartLegend content={<ChartLegendContent />} />
      </RadialBarChart>
    </ChartContainer>
  )
}
