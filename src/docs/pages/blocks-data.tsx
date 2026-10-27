import { Dashboard1 } from "@/components/blocks/dashboard-1"
import { Dashboard2 } from "@/components/blocks/dashboard-2"
import { Dashboard3 } from "@/components/blocks/dashboard-3"
import { DataTableBlock1 } from "@/components/blocks/data-table-block-1"
import { DataTableBlock2 } from "@/components/blocks/data-table-block-2"
import { DataTableBlock3 } from "@/components/blocks/data-table-block-3"
import { Stats1 } from "@/components/blocks/stats-1"
import { Stats2 } from "@/components/blocks/stats-2"
import { Stats3 } from "@/components/blocks/stats-3"
import { ChartCard1 } from "@/components/blocks/chart-card-1"
import { ChartCard2 } from "@/components/blocks/chart-card-2"
import { ChartCard3 } from "@/components/blocks/chart-card-3"
import { BlockDemo, BlockGroup } from "@/docs/block-demo"
import { BlocksLayout } from "@/docs/blocks-layout"

export const meta = { path: "/kit/blocks/data" }

export default function BlocksDataPage() {
  return (
    <BlocksLayout
      title="Dashboards & data"
      description="Overview pages, tables and metric blocks for running a live game: player counts, queues, revenue, moderation. Charts follow the active theme and every control works."
    >
      <BlockGroup id="dashboard" title="Dashboard" description="Full overview pages: the first screen a live-ops lead opens in the morning, during an incident, and at month end." count={3}>
        <BlockDemo id="dashboard-1" n={1} title="KPIs + live chart" name="dashboard-1" frameClassName="h-auto" description="KPI tiles with sparklines, concurrent players against the previous period, and share by region. The range control redraws the chart.">
          <Dashboard1 />
        </BlockDemo>
        <BlockDemo id="dashboard-2" n={2} title="Command center" name="dashboard-2" frameClassName="h-auto" description="Bento layout for incident days: a live player counter, open incidents, queue times per playlist, region status and the build rollout.">
          <Dashboard2 />
        </BlockDemo>
        <BlockDemo id="dashboard-3" n={3} title="Economy report" name="dashboard-3" frameClassName="h-auto" description="Month-to-date revenue with platform filter chips; the stats and weekly chart recalculate for the selected platforms. Top SKUs ranked beside it.">
          <Dashboard3 />
        </BlockDemo>
      </BlockGroup>
      <BlockGroup id="data-table" title="Data table" description="Operational tables: a player directory with bulk actions, a moderation queue with expandable evidence, and events grouped by status with inline controls." count={3}>
        <BlockDemo id="data-table-1" n={1} title="Players · bulk actions" name="data-table-block-1" frameClassName="h-auto" description="Search, status filter chips, sortable columns, row selection with a contextual action bar, and pagination.">
          <DataTableBlock1 />
        </BlockDemo>
        <BlockDemo id="data-table-2" n={2} title="Moderation queue" name="data-table-block-2" frameClassName="h-auto" description="Severity-tagged reports that expand to show evidence and history. Acting on a report clears it from the queue, with undo.">
          <DataTableBlock2 />
        </BlockDemo>
        <BlockDemo id="data-table-3" n={3} title="Events by status" name="data-table-block-3" frameClassName="h-auto" description="Rows grouped under sticky status headers, with participation bars, an inline live switch and a row menu. Drafts can't go live from here.">
          <DataTableBlock3 />
        </BlockDemo>
      </BlockGroup>
      <BlockGroup id="stats" title="Stats" description="Metric blocks for any page: a comparison strip, cards measured against targets, and one hero number with its breakdown." count={3}>
        <BlockDemo id="stats-1" n={1} title="Strip with deltas" name="stats-1" frameClassName="h-auto" description="Four connected stats with change chips. The comparison control changes the baseline for every delta.">
          <Stats1 />
        </BlockDemo>
        <BlockDemo id="stats-2" n={2} title="Sparklines + targets" name="stats-2" frameClassName="h-auto" description="Retention and stability cards with a seven-day trend and progress toward this season's target.">
          <Stats2 />
        </BlockDemo>
        <BlockDemo id="stats-3" n={3} title="Hero metric" name="stats-3" frameClassName="h-auto" description="One number at display size with breakdowns by platform and region. The tabs switch the metric; players online updates live.">
          <Stats3 />
        </BlockDemo>
      </BlockGroup>
      <BlockGroup id="chart-card" title="Chart card" description="Recharts cards themed from the M3 color roles. They follow dark mode and seed-color changes live." count={3}>
        <BlockDemo id="chart-card-1" n={1} title="Line · legend toggles" name="chart-card-1" frameClassName="h-auto" description="Legend chips switch series on and off; queue time brings its own axis when shown. The range control swaps 24 hours for 7 days.">
          <ChartCard1 />
        </BlockDemo>
        <BlockDemo id="chart-card-2" n={2} title="Bars · stacked or grouped" name="chart-card-2" frameClassName="h-auto" description="Store revenue by category over four months, with a summary column. The segmented control toggles stacking.">
          <ChartCard2 />
        </BlockDemo>
        <BlockDemo id="chart-card-3" n={3} title="Donut + legend table" name="chart-card-3" frameClassName="h-auto" description="Sessions by game mode. Each legend row hides or shows its slice, and the center total follows.">
          <ChartCard3 />
        </BlockDemo>
      </BlockGroup>
    </BlocksLayout>
  )
}
