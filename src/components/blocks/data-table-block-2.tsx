"use client"

import * as React from "react"
import { Button as AriaButton } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Data table 02 · Moderation queue
 * Severity-tagged reports that expand to show evidence and history.
 * Acting on a report clears it from the queue, with undo.
 */

type Severity = "High" | "Medium" | "Low"

const SEVERITY: Record<Severity, string> = {
  High: "bg-error-container text-on-error-container",
  Medium: "bg-tertiary-container text-on-tertiary-container",
  Low: "bg-surface-container-highest text-on-surface-variant",
}

const REPORTS = [
  {
    id: "R-2291",
    sev: "High" as Severity,
    reason: "Aimbot suspected",
    player: "Valkyr.ie",
    reports: 14,
    age: "18 min",
    assignee: "AO",
    match: "Match M-7f3a19c2",
    evidence: "Headshot ratio 71% over the last 20 matches (population p99 is 38%). Snap-to-target under 40 ms in 9 rounds.",
    history: "1 prior warning · Aug 2026",
  },
  {
    id: "R-2290",
    sev: "High" as Severity,
    reason: "Real-money trading",
    player: "goldrush_svc",
    reports: 6,
    age: "42 min",
    assignee: "TI",
    match: "Global chat · EU",
    evidence: "Whispered 38 players offering discounted Ember Shards with an external link, within 25 minutes.",
    history: "Account created 2 days ago",
  },
  {
    id: "R-2288",
    sev: "Medium" as Severity,
    reason: "Toxic chat",
    player: "ThunderMoth",
    reports: 4,
    age: "1 h",
    assignee: "",
    match: "Match M-7f1c0b44 · Ranked",
    evidence: "Three messages caught by the chat filter for harassment during one Ranked match.",
    history: "2 prior mutes · Jun, Sep 2026",
  },
  {
    id: "R-2287",
    sev: "Medium" as Severity,
    reason: "Map exploit · Harbor wall clip",
    player: "pixelgrunt",
    reports: 3,
    age: "2 h",
    assignee: "KW",
    match: "Match M-7ef0d913",
    evidence: "Clips through the east wall at Harbor B-site. QA reproduced it on build 7.2.1.",
    history: "No prior actions",
  },
  {
    id: "R-2284",
    sev: "Low" as Severity,
    reason: "Griefing · team kills",
    player: "MossyBoots",
    reports: 2,
    age: "5 h",
    assignee: "",
    match: "Match M-7e9a2210 · Co-op",
    evidence: "Five friendly-fire kills in one Co-op match; both teammates left before the final round.",
    history: "No prior actions",
  },
]

const FILTERS = ["All", "High", "Unassigned"] as const
type Filter = (typeof FILTERS)[number]

export function DataTableBlock2({ className }: { className?: string }) {
  const [filter, setFilter] = React.useState<Filter>("All")
  const [open, setOpen] = React.useState<string | null>("R-2291")
  const [resolved, setResolved] = React.useState<string[]>([])

  const queue = REPORTS.filter((r) => !resolved.includes(r.id))
  const visible = queue.filter((r) => filter === "All" || (filter === "High" ? r.sev === "High" : !r.assignee))

  const act = (r: (typeof REPORTS)[number], verb: string) => () => {
    setResolved((list) => [...list, r.id])
    setOpen(null)
    snackbar(`${verb} · ${r.player}`, {
      action: { label: "Undo", onAction: () => setResolved((list) => list.filter((x) => x !== r.id)) },
    })
  }

  return (
    <div className={cn("bg-surface", className)}>
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="text-title-md">Reports</div>
          <div className="text-body-sm text-on-surface-variant">
            {queue.length} open · {queue.filter((r) => r.sev === "High").length} high severity
          </div>
        </div>
        <SegmentedButtonGroup aria-label="Filter reports" selectedKeys={[filter]} onSelectionChange={(k) => setFilter([...k][0] as Filter)}>
          {FILTERS.map((f) => (
            <SegmentedButton key={f} id={f} className="flex-none">
              {f}
            </SegmentedButton>
          ))}
        </SegmentedButtonGroup>
      </div>

      <ul className="border-t border-outline-variant">
        {visible.map((r) => {
          const isOpen = open === r.id
          return (
            <li key={r.id} className="border-b border-outline-variant/60 last:border-b-0">
              <AriaButton
                aria-expanded={isOpen}
                aria-controls={`${r.id}-detail`}
                onPress={() => setOpen(isOpen ? null : r.id)}
                className="state-layer focus-ring flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left"
              >
                <span className={cn("inline-flex h-6 w-16 shrink-0 items-center justify-center rounded-sm text-label-md", SEVERITY[r.sev])}>{r.sev}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-title-sm">{r.reason}</span>
                  <span className="block truncate text-body-sm text-on-surface-variant">
                    {r.player} · {r.reports} reports · {r.age} ago
                  </span>
                </span>
                <span className="hidden font-mono text-body-sm text-on-surface-variant md:block">{r.id}</span>
                <span
                  aria-label={r.assignee ? `Assigned to ${r.assignee}` : "Unassigned"}
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full text-label-md",
                    r.assignee ? "bg-secondary-container text-on-secondary-container" : "border border-dashed border-outline text-on-surface-variant",
                  )}
                >
                  {r.assignee || "+"}
                </span>
                <Icon className={cn("text-on-surface-variant transition-transform duration-300", isOpen && "rotate-180")}>expand_more</Icon>
              </AriaButton>
              {isOpen && (
                <div id={`${r.id}-detail`} className="grid gap-4 bg-surface-container-low px-4 py-4 md:grid-cols-[minmax(0,1fr)_200px] md:pl-[92px]">
                  <div className="space-y-3">
                    <div>
                      <div className="text-label-md text-on-surface-variant">Evidence · {r.match}</div>
                      <p className="mt-1 max-w-prose text-body-md">{r.evidence}</p>
                    </div>
                    <div>
                      <div className="text-label-md text-on-surface-variant">History</div>
                      <p className="mt-1 text-body-md">{r.history}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap content-start gap-2 md:flex-col md:items-start">
                    <Button className="bg-error pr-4 pl-3 text-on-error" onPress={act(r, "Banned")}>
                      <Icon>gavel</Icon>
                      Ban
                    </Button>
                    <Button variant="tonal" className="pr-4 pl-3" onPress={act(r, "Muted for 24h")}>
                      <Icon>volume_off</Icon>
                      Mute 24h
                    </Button>
                    <Button variant="outlined" className="pr-4 pl-3" onPress={act(r, "Warned")}>
                      <Icon>campaign</Icon>
                      Warn
                    </Button>
                    <Button variant="text" className="px-4" onPress={act(r, "Dismissed")}>
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>

      {visible.length === 0 && (
        <div className="flex flex-col items-center gap-2 border-t border-outline-variant px-4 py-12 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-primary-container text-on-primary-container">
            <Icon size={28}>task_alt</Icon>
          </span>
          <div className="mt-1 text-title-md">Queue clear</div>
          <p className="text-body-md text-on-surface-variant">No reports match this filter.</p>
          <Button
            variant="outlined"
            className="mt-1"
            onPress={() => {
              setResolved([])
              setFilter("All")
            }}
          >
            Reset demo queue
          </Button>
        </div>
      )}
    </div>
  )
}
