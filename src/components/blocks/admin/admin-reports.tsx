"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Select, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { ActionMenu, AsyncButton, Panel, TONE_FILL, notify, type Tone } from "./admin-actions"
import { useAdmin } from "./admin-context"
import { ReportsRegionChart, ReportsTrendChart } from "./admin-charts"
import { RANGES, type RangeKey } from "./admin-data"
import { PageHeader } from "./admin-ui"

type Report = { id: string; title: string; schedule: string; lastRun: string; icon: string; tone: Tone | "solid" }

const REPORTS: Report[] = [
  { id: "revenue", title: "Monthly revenue", schedule: "Every 1st · 08:00", lastRun: "Oct 1", icon: "summarize", tone: "solid" },
  { id: "seats", title: "Seat utilization", schedule: "Weekly · Mon", lastRun: "Oct 20", icon: "group", tone: "tertiary" },
  { id: "incidents", title: "Incident review", schedule: "After each SEV-1", lastRun: "Oct 14", icon: "warning", tone: "error" },
  { id: "spend", title: "Cloud spend by team", schedule: "Weekly · Fri", lastRun: "Oct 24", icon: "savings", tone: "secondary" },
  { id: "slo", title: "SLO attainment", schedule: "Monthly", lastRun: "Oct 1", icon: "speed", tone: "tertiary" },
  { id: "policy", title: "Policy violations", schedule: "Daily", lastRun: "Today", icon: "policy", tone: "neutral" },
]

const METRICS = ["Revenue", "Active seats", "Deploys", "p95 latency", "Cloud spend"]
const GROUPINGS = ["Plan", "Region", "Team", "Customer"]
const VIZ = ["Line", "Bar", "Table"]

export function AdminReports() {
  const { range: pageRange } = useAdmin()
  const [deleted, setDeleted] = React.useState<Set<string>>(new Set())
  const [lastRun, setLastRun] = React.useState<Record<string, string>>({})
  const [metric, setMetric] = React.useState(METRICS[0])
  const [groupBy, setGroupBy] = React.useState(GROUPINGS[0])
  const [viz, setViz] = React.useState(VIZ[0])
  const [range, setRange] = React.useState<RangeKey>(pageRange)
  const [compare, setCompare] = React.useState(true)

  const remove = (r: Report) => {
    setDeleted((d) => new Set(d).add(r.id))
    notify(`${r.title} deleted`, "Undo", () =>
      setDeleted((d) => {
        const next = new Set(d)
        next.delete(r.id)
        return next
      }),
    )
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Saved reports and an ad-hoc builder"
        actions={
          <>
            <Button variant="outlined" onPress={() => notify("Schedule editor opened")}>
              <Icon>schedule</Icon>
              Schedule
            </Button>
            <Button onPress={() => notify("Blank report created")}>
              <Icon>add</Icon>
              New report
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.filter((r) => !deleted.has(r.id)).map((r) => (
          <article key={r.id} className="flex flex-col rounded-xl bg-surface-container-low p-5">
            <div className="flex items-start gap-3">
              <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg", TONE_FILL[r.tone])}>
                <Icon>{r.icon}</Icon>
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-title-md">{r.title}</h3>
                <div className="text-body-sm text-on-surface-variant">{r.schedule}</div>
              </div>
              <ActionMenu
                label={`Actions for ${r.title}`}
                items={[
                  { id: "edit", label: "Edit", icon: "edit" },
                  { id: "duplicate", label: "Duplicate", icon: "content_copy" },
                  { id: "share", label: "Share link", icon: "share", onAction: () => notify("Link copied") },
                  "separator",
                  { id: "delete", label: "Delete", icon: "delete", danger: true, onAction: () => remove(r) },
                ]}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="text-body-sm text-on-surface-variant">Last run {lastRun[r.id] ?? r.lastRun}</span>
              <AsyncButton
                variant="tonal"
                icon="play_arrow"
                busy="Running…"
                done="Done"
                onDone={() => setLastRun((l) => ({ ...l, [r.id]: "Just now" }))}
              >
                Run
              </AsyncButton>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Report builder" description="Pick a metric and grouping">
          <div className="grid gap-4">
            <Select label="Metric" selectedKey={metric} onSelectionChange={(k) => k != null && setMetric(String(k))}>
              {METRICS.map((m) => (
                <SelectItem key={m} id={m}>
                  {m}
                </SelectItem>
              ))}
            </Select>
            <Select label="Group by" selectedKey={groupBy} onSelectionChange={(k) => k != null && setGroupBy(String(k))}>
              {GROUPINGS.map((g) => (
                <SelectItem key={g} id={g}>
                  {g}
                </SelectItem>
              ))}
            </Select>
            <Select label="Visualization" selectedKey={viz} onSelectionChange={(k) => k != null && setViz(String(k))}>
              {VIZ.map((v) => (
                <SelectItem key={v} id={v}>
                  {v}
                </SelectItem>
              ))}
            </Select>
            <ConnectedButtonGroup
              aria-label="Period"
              variant="filled"
              size="sm"
              selectedKeys={[range]}
              onSelectionChange={(keys) => {
                const k = [...keys][0] as RangeKey | undefined
                if (k) setRange(k)
              }}
            >
              {(Object.keys(RANGES) as RangeKey[]).map((k) => (
                <ConnectedButton key={k} id={k}>
                  {k}
                </ConnectedButton>
              ))}
            </ConnectedButtonGroup>
            <Switch isSelected={compare} onChange={setCompare} className="flex w-full justify-between text-body-md [&>[data-slot=switch-track]]:order-last">
              Compare to previous period
            </Switch>
            <AsyncButton
              size="md"
              icon="auto_awesome"
              busy="Generating…"
              done="Ready"
              className="h-12 w-full text-label-lg"
              onDone={() => notify(`${metric} by ${groupBy.toLowerCase()} · ${viz.toLowerCase()} · ${range}${compare ? " vs previous" : ""}`)}
            >
              Generate
            </AsyncButton>
          </div>
        </Panel>

        <div className="grid min-w-0 gap-4 xl:col-span-2">
          <Panel title={`${metric} by ${groupBy.toLowerCase()}`} description="Preview · this period">
            <div className="relative h-56">
              <ReportsTrendChart range={range} />
            </div>
          </Panel>
          <Panel title={`${metric} by region`} description={compare ? "This vs previous" : "This period"}>
            <div className="relative h-56">
              <ReportsRegionChart />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
