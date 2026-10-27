"use client"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { ChartStates } from "./chart-states"
import { ComparisonCharts } from "./comparison-charts"
import { CompositionCharts } from "./composition-charts"
import { DashboardViz } from "./dashboard-viz"
import { DataDisplay } from "./data-display"
import { InteractiveCharts } from "./interactive-charts"
import { KpiCards } from "./kpi-cards"
import { DashboardKitProvider, KIT_RANGES, type KitRange, useDashboardKit } from "./kit-data"
import { RelationshipCharts } from "./relationship-charts"
import { TrendCharts } from "./trend-charts"

/*
 * Dashboard kit · every chart and card a dashboard needs, on M3 Expressive tokens.
 * 75 charts, 27 SVG/grid visualizations, 24 KPI cards, 26 lists/tables/feeds and chart states.
 * Everything follows the sticky filter bar (date range · compare · shuffle) and re-themes with
 * dark mode and dynamic color.
 */

/** In-page sections, for a table of contents. [id, label, icon] */
export const DASHBOARD_KIT_TOC = [
  ["kpi", "KPI cards", "speed"],
  ["featured", "Interactive charts", "touch_app"],
  ["trends", "Trends", "show_chart"],
  ["comparison", "Comparison", "bar_chart"],
  ["composition", "Composition", "donut_large"],
  ["relationships", "Relationships", "scatter_plot"],
  ["viz", "Heatmaps & gauges", "grid_on"],
  ["data-display", "Lists & tables", "table_rows"],
  ["states", "States & legends", "layers"],
] as const

function DashboardKitHero() {
  return (
    <section className="grid gap-8 pt-8 pb-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:pt-12">
      <div className="max-w-2xl">
        <span className="inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant">
          <Icon size={18} className="text-primary">
            insights
          </Icon>
          Information display · Recharts + Tailwind
        </span>
        <h1 className="mt-5 text-display-sm font-semibold tracking-tight text-balance md:text-display-md">
          Every chart and card a dashboard needs.
        </h1>
        <p className="mt-4 max-w-xl text-body-lg text-pretty text-on-surface-variant">
          75 charts, 27 SVG and grid visualizations, 24 KPI cards, tables, feeds and 15 chart states, all on M3 Expressive tokens. Charts
          re-theme with dark mode and dynamic color, and follow the filter bar below.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-primary-container p-4 text-on-primary-container">
          <div className="text-headline-md font-medium tabular-nums">75</div>
          <div className="text-body-sm">Recharts charts</div>
        </div>
        <div className="rounded-xl bg-tertiary-container p-4 text-on-tertiary-container">
          <div className="text-headline-md font-medium tabular-nums">27</div>
          <div className="text-body-sm">SVG / grid viz</div>
        </div>
        <div className="rounded-xl bg-secondary-container p-4 text-on-secondary-container">
          <div className="text-headline-md font-medium tabular-nums">90+</div>
          <div className="text-body-sm">display components</div>
        </div>
      </div>
    </section>
  )
}

/** Sticky filter bar: date range, compare-to-previous overlay, re-roll data. */
function DashboardKitFilterBar({ className }: { className?: string }) {
  const kit = useDashboardKit()
  return (
    <div
      className={cn(
        "sticky top-16 z-30 -mx-4 mb-4 flex flex-wrap items-center gap-x-4 gap-y-3 bg-surface/90 px-4 py-3 backdrop-blur md:-mx-6 md:px-6 lg:-mx-10 lg:px-10",
        className,
      )}
    >
      <ConnectedButtonGroup
        aria-label="Date range"
        size="sm"
        selectedKeys={[kit.range]}
        onSelectionChange={(keys) => {
          const next = [...keys][0]
          if (next) kit.setRange(next as KitRange)
        }}
      >
        {(Object.keys(KIT_RANGES) as KitRange[]).map((r) => (
          <ConnectedButton key={r} id={r}>
            {r}
          </ConnectedButton>
        ))}
      </ConnectedButtonGroup>
      <Switch isSelected={kit.compare} onChange={kit.setCompare} className="text-label-lg text-on-surface-variant">
        Compare to previous
      </Switch>
      <Button variant="outlined" onPress={kit.shuffleAll}>
        <Icon>shuffle</Icon>
        Shuffle data
      </Button>
      <span className="ml-auto hidden items-center gap-2 text-body-sm text-on-surface-variant md:inline-flex">
        <span className="size-2 rounded-full bg-tertiary" />
        {kit.rangeName} · updated just now
      </span>
    </div>
  )
}

/** The whole kit page body (wrap in your own app chrome). */
function DashboardKit({ className }: { className?: string }) {
  return (
    <DashboardKitProvider>
      <div className={className}>
        <DashboardKitHero />
        <DashboardKitFilterBar />
        <KpiCards />
        <InteractiveCharts />
        <TrendCharts />
        <ComparisonCharts />
        <CompositionCharts />
        <RelationshipCharts />
        <DashboardViz />
        <DataDisplay />
        <ChartStates />
        <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant pt-8 text-body-sm text-on-surface-variant">
          <span>
            Charts are Recharts inside <code className="font-mono">ChartContainer</code>, colored with M3 role tokens.
          </span>
          <a href="#top" className="state-layer inline-flex h-10 items-center gap-2 rounded-full px-4 text-label-lg text-primary">
            <Icon size={20}>arrow_upward</Icon>
            Back to top
          </a>
        </footer>
      </div>
    </DashboardKitProvider>
  )
}

export { DashboardKit, DashboardKitFilterBar, DashboardKitHero }
