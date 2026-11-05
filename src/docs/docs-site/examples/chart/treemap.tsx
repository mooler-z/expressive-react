import { Treemap } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, chartColor } from "@/components/ui/chart"

const TONES = [
  ["primary-container", "on-primary-container"],
  ["secondary-container", "on-secondary-container"],
  ["tertiary-container", "on-tertiary-container"],
  ["primary-fixed-dim", "on-primary-fixed"],
  ["tertiary-fixed-dim", "on-tertiary-fixed"],
] as const

const DATA = [
  { name: "Grades 1–2", size: 270 },
  { name: "Grades 3–4", size: 248 },
  { name: "Grades 5–6", size: 231 },
  { name: "Grades 7–8", size: 214 },
  { name: "Grades 9–10", size: 188 },
  { name: "KG", size: 186 },
  { name: "Grades 11–12", size: 142 },
].map((d, i) => ({ ...d, fill: chartColor(TONES[i % TONES.length][0]), text: chartColor(TONES[i % TONES.length][1]) }))

interface TileProps {
  x?: number
  y?: number
  width?: number
  height?: number
  depth?: number
  name?: string
  size?: number
  fill?: string
  text?: string
}

function Tile({ x = 0, y = 0, width = 0, height = 0, depth, name = "", size, fill, text }: TileProps) {
  if (depth !== 1) return null
  const count = `${size} students`
  // Labels only where they fit (≈7px per character at label-large, 6px at label-medium); the tooltip covers the rest.
  const showName = height > 36 && width > 24 + 7 * name.length
  const showCount = showName && height > 56 && width > 24 + 6.2 * count.length
  return (
    <g>
      <rect x={x + 2} y={y + 2} width={Math.max(0, width - 4)} height={Math.max(0, height - 4)} rx={12} fill={fill} />
      {showName && (
        <text x={x + 14} y={y + 26} fill={text} className="text-label-lg">
          {name}
        </text>
      )}
      {showCount && (
        <text x={x + 14} y={y + 44} fill={text} opacity={0.8} className="text-label-md tabular-nums">
          {count}
        </text>
      )}
    </g>
  )
}

export default function TreemapChart() {
  return (
    <ChartContainer config={{}} className="h-80 w-full max-w-2xl">
      <Treemap data={DATA} dataKey="size" nameKey="name" content={<Tile />} isAnimationActive={false}>
        <ChartTooltip content={<ChartTooltipContent hideLabel valueFormatter={(v) => `${v} students`} />} />
      </Treemap>
    </ChartContainer>
  )
}
