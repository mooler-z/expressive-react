import Bar from "@/docs/docs-site/examples/chart/bar"
import barSrc from "@/docs/docs-site/examples/chart/bar?raw"
import Colors from "@/docs/docs-site/examples/chart/colors"
import colorsSrc from "@/docs/docs-site/examples/chart/colors?raw"
import Demo from "@/docs/docs-site/examples/chart/demo"
import demoSrc from "@/docs/docs-site/examples/chart/demo?raw"
import Donut from "@/docs/docs-site/examples/chart/donut"
import donutSrc from "@/docs/docs-site/examples/chart/donut?raw"
import Line from "@/docs/docs-site/examples/chart/line"
import lineSrc from "@/docs/docs-site/examples/chart/line?raw"
import SparklineGauge from "@/docs/docs-site/examples/chart/sparkline-gauge"
import sparklineGaugeSrc from "@/docs/docs-site/examples/chart/sparkline-gauge?raw"
import RadialBar from "@/docs/docs-site/examples/chart/radial-bar"
import radialBarSrc from "@/docs/docs-site/examples/chart/radial-bar?raw"
import Treemap from "@/docs/docs-site/examples/chart/treemap"
import treemapSrc from "@/docs/docs-site/examples/chart/treemap?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Charts",
  description: (
    <>
      Recharts, themed with M3 roles. <InlineCode>ChartContainer</InlineCode> maps a config of series to CSS variables, so every chart follows dark mode and
      seed colors live, without re-rendering. Tooltip and legend content, axis defaults, a sparkline and a gauge are included.
    </>
  ),
  links: { m3: "https://m3.material.io/styles/color/roles" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Area, AreaChart, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, chartAxisProps, type ChartConfig } from "@/components/ui/chart"

const config = { requests: { label: "Requests", color: "primary" } } satisfies ChartConfig

<ChartContainer config={config} className="h-64">
  <AreaChart data={data}>
    <XAxis dataKey="day" {...chartAxisProps} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Area dataKey="requests" stroke="var(--color-requests)" fill="var(--color-requests)" fillOpacity={0.12} />
  </AreaChart>
</ChartContainer>`,
  examples: [
    {
      id: "bar",
      title: "Stacked bars",
      description: "Round only the outer ends of a stack with radius tuples. valueFormatter formats tooltip values; cursor={false} hides the hover band.",
      component: Bar,
      source: barSrc,
    },
    {
      id: "line",
      title: "Lines",
      description: "indicator=\"line\" switches tooltip swatches to bars. Axis tick formatters and units work as in plain Recharts.",
      component: Line,
      source: lineSrc,
    },
    {
      id: "donut",
      title: "Donut",
      description: (
        <>
          Color slices with <InlineCode>{"<Cell fill={`var(--color-${key})`} />"}</InlineCode>. <InlineCode>nameKey</InlineCode> tells the tooltip which field
          to look up in the config.
        </>
      ),
      component: Donut,
      source: donutSrc,
    },
    {
      id: "radial-bar",
      title: "Radial bars",
      description: (
        <>
          Concentric progress rings with Recharts' <InlineCode>RadialBarChart</InlineCode>. A <InlineCode>PolarAngleAxis</InlineCode> with{" "}
          <InlineCode>domain={"{[0, 100]}"}</InlineCode> makes each ring a percentage; <InlineCode>background</InlineCode> draws the track in
          surface-container-highest. Give each row a <InlineCode>name</InlineCode> that matches a config key for the legend and tooltip.
        </>
      ),
      component: RadialBar,
      source: radialBarSrc,
    },
    {
      id: "treemap",
      title: "Treemap",
      description: (
        <>
          Part-to-whole across many categories. Draw the tiles with a <InlineCode>content</InlineCode> component: container roles for the fill and
          their on-colors for the text keep every tile readable in light and dark. Tiles too small for a label show it in the tooltip only.
        </>
      ),
      component: Treemap,
      source: treemapSrc,
    },
    {
      id: "sparkline-gauge",
      title: "Sparkline and gauge",
      description: "Two ready-made small charts: an axis-less Sparkline for KPI rows and a half-doughnut Gauge whose arc animates on the default spatial spring.",
      component: SparklineGauge,
      source: sparklineGaugeSrc,
    },
    {
      id: "colors",
      title: "Series colors",
      description: (
        <>
          <InlineCode>CHART_SERIES</InlineCode> is the default order (primary → primary-fixed-dim → secondary-container → tertiary → tertiary-fixed-dim).{" "}
          <InlineCode>chartColor(role, alpha?)</InlineCode> resolves any role for use outside a config. Try a seed on the{" "}
          <TextLink to="/themes">Themes</TextLink> page.
        </>
      ),
      component: Colors,
      source: colorsSrc,
    },
  ],
  api: [
    {
      name: "ChartContainer",
      description: <>Responsive frame for one Recharts chart. Also takes div attributes. Size it with {c("h-*")}; the default is 16:9.</>,
      props: [
        { name: "config", type: "ChartConfig", default: "—", description: "Series keys → { label?, color? }. Each color becomes var(--color-<key>)." },
        { name: "children", type: "ReactElement", default: "—", description: "One Recharts chart (AreaChart, BarChart, PieChart…)." },
      ],
    },
    {
      name: "ChartConfig",
      description: "Record<string, { label?: ReactNode; color?: string }>.",
      props: [
        { name: "label", type: "ReactNode", default: "key", description: "Name used by the tooltip and legend." },
        { name: "color", type: "string", default: "—", description: "An M3 role (\"primary\", \"tertiary-fixed-dim\"…) or any CSS color." },
      ],
    },
    {
      name: "ChartTooltipContent",
      description: <>Inverse-surface tooltip body. Use as {c("<ChartTooltip content={<ChartTooltipContent />} />")}.</>,
      props: [
        { name: "hideLabel", type: "boolean", default: "false", description: "Hide the header (x value)." },
        { name: "hideIndicator", type: "boolean", default: "false", description: "Hide the series swatches." },
        { name: "indicator", type: '"dot" | "line"', default: '"dot"', description: "Swatch shape." },
        { name: "labelFormatter", type: "(label, payload) => ReactNode", default: "—", description: "Format the header." },
        { name: "valueFormatter", type: "(value, name, item) => ReactNode", default: "toLocaleString", description: "Format each value." },
        { name: "nameKey", type: "string", default: "dataKey", description: "Payload field used to find the config label (pie slices)." },
      ],
    },
    {
      name: "ChartLegendContent",
      description: <>Dot legend in label-medium, ordered like the config. Use as {c("<ChartLegend content={<ChartLegendContent />} />")}.</>,
      props: [
        { name: "verticalAlign", type: '"top" | "middle" | "bottom"', default: '"bottom"', description: "Adds spacing on the side facing the chart." },
        { name: "hideIcon", type: "boolean", default: "false", description: "Hide the dots." },
      ],
    },
    {
      name: "Sparkline",
      description: "Axis-less trend line.",
      props: [
        { name: "data", type: "readonly number[]", default: "—", description: "Values, oldest first." },
        { name: "color", type: "string", default: '"primary"', description: "M3 role or CSS color." },
        { name: "area", type: "boolean", default: "true", description: "Fill under the line at 14%." },
        { name: "strokeWidth", type: "number", default: "2", description: "Line width." },
        { name: "aria-label", type: "string", default: '"Trend: first to last"', description: "Accessible description (role=\"img\")." },
      ],
    },
    {
      name: "Gauge",
      description: "Half-doughnut meter.",
      props: [
        { name: "value", type: "number", default: "—", description: "Current value." },
        { name: "max", type: "number", default: "100", description: "Maximum." },
        { name: "color · trackColor", type: "string", default: '"primary" · "secondary-container"', description: "Active and remaining arc colors." },
        { name: "thickness", type: "number", default: "18", description: "Arc thickness in viewBox units (radius 90)." },
        { name: "label · sublabel", type: "ReactNode", default: "percentage · —", description: "Big number and caption under the arc." },
      ],
    },
    {
      name: "Helpers",
      description: <>Also exported: {c("chartAxisProps")}, {c("chartGridProps")}, {c("chartColor(color, alpha?)")}, {c("CHART_SERIES")}, {c("useChart()")}.</>,
      props: [
        { name: "chartAxisProps", type: "object", default: "—", description: "{ tickLine: false, axisLine: false, tickMargin: 8 } for XAxis and YAxis." },
        { name: "chartGridProps", type: "object", default: "—", description: "{ vertical: false } for CartesianGrid." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Charts are visual. Put the key number or conclusion in text next to the chart, and offer a table for exact values. {c("Sparkline")} renders{" "}
        {c('role="img"')} with a trend label; {c("Gauge")} renders {c('role="meter"')} with aria-valuenow, -min and -max.
      </>
    ),
    notes: [
      "Don't rely on color alone: label series in the legend and use different line styles or markers when series are close.",
      "Recharts' tooltip is pointer-driven; keyboard and screen reader users need the data in text or a table.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Element", "Token"],
        rows: [
          ["Tick labels", <>{c("body-small")}, {c("on-surface-variant")}</>],
          ["Grid lines", <>{c("outline-variant")} at 50%, horizontal only</>],
          ["Tooltip", <>{c("inverse-surface")}, 8dp corners, level 2, {c("body-small")}</>],
          ["Legend", <>{c("label-medium")}, 8dp dots</>],
          ["Hover cursor", <>{c("outline")} line, or {c("on-surface")} 6% band</>],
          ["Series", c("primary → primary-fixed-dim → secondary-container → tertiary → tertiary-fixed-dim")],
        ],
      },
    ],
    cards: [{ title: "Gauge motion", items: ["Arc length animates on default-spatial (0.8 / 380)"] }],
    source: <>A port of the kit's {c("m3/charts.js")} Chart.js theme to Recharts, using M3 color roles.</>,
  },
} satisfies ComponentDoc
