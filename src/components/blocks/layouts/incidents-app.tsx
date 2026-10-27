"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { SearchBar } from "@/components/ui/search"
import { snackbar } from "@/components/ui/snackbar"
import type { WindowSizeClass } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"

import { AdaptiveScaffold, type ScaffoldDestination } from "./adaptive-scaffold"
import { ListDetailBack, ListDetailLayout, useListDetail } from "./list-detail-layout"

/*
 * Adaptive incidents app · one app at every window size, built from AdaptiveScaffold + ListDetailLayout.
 * Navigation moves from bar to rail to expanded rail; list-detail grows from one pane to three.
 * In the single-pane sizes, tap an incident to open it.
 */

const DESTINATIONS: ScaffoldDestination[] = [
  { value: "overview", icon: "dashboard", label: "Overview" },
  { value: "incidents", icon: "warning", label: "Incidents", badge: 5 },
  { value: "services", icon: "dns", label: "Services" },
  { value: "settings", icon: "settings", label: "Settings" },
]

type Incident = {
  id: string
  title: string
  service: string
  age: string
  sev: "SEV-2" | "SEV-3" | "SEV-4"
  icon: string
  tone: "error" | "secondary" | "tertiary" | "primary"
  summary: string
  stats: [string, string][]
  timeline: [string, string][]
}

const INCIDENTS: Incident[] = [
  {
    id: "INC-2291",
    title: "Checkout error spike",
    service: "checkout-api",
    age: "4m",
    sev: "SEV-2",
    icon: "error",
    tone: "error",
    summary: "5xx responses on checkout-api rose to 4.2% after the 09:30 deploy in eu-central-1. A rollback to v4.1.9 is staged.",
    stats: [["Error rate", "4.2%"], ["p95", "1.2 s"], ["Users", "3.1k"]],
    timeline: [["09:31", "Alert fired: error rate above 2%"], ["09:33", "Maya Lindqvist acknowledged"], ["09:40", "Rollback to v4.1.9 staged"]],
  },
  {
    id: "INC-2290",
    title: "Scheduler alert storm",
    service: "scheduler",
    age: "22m",
    sev: "SEV-3",
    icon: "notifications_active",
    tone: "secondary",
    summary: "The retry threshold trips on every transient failure, so paging volume is six times normal.",
    stats: [["Pages", "48"], ["Retries", "312"], ["Teams", "2"]],
    timeline: [["09:12", "Paging volume above baseline"], ["09:15", "Jonah Park acknowledged"], ["09:28", "Threshold change in review"]],
  },
  {
    id: "INC-2288",
    title: "Edge cache miss rate",
    service: "edge-cache",
    age: "1h",
    sev: "SEV-3",
    icon: "cached",
    tone: "tertiary",
    summary: "Miss rate in ap-northeast-1 climbed to 38% after a full purge. Origin load is high but holding.",
    stats: [["Miss rate", "38%"], ["Origin RPS", "9.4k"], ["Regions", "1"]],
    timeline: [["08:20", "Full purge by the deploy bot"], ["08:24", "Miss-rate alert fired"], ["08:41", "Cache warming started"]],
  },
  {
    id: "INC-2285",
    title: "Billing webhook 502s",
    service: "billing-sync",
    age: "3h",
    sev: "SEV-2",
    icon: "webhook",
    tone: "error",
    summary: "billing.sync returns 502 for one in nine events. Failed events are queued and will replay.",
    stats: [["Failures", "11%"], ["Queued", "2,410"], ["Retries", "3"]],
    timeline: [["06:02", "First 502 from billing.sync"], ["06:10", "Replay queue enabled"], ["06:45", "Vendor ticket opened"]],
  },
  {
    id: "INC-2281",
    title: "Token issuance latency",
    service: "identity",
    age: "1d",
    sev: "SEV-4",
    icon: "key",
    tone: "primary",
    summary: "Token issuance p95 crept to 310 ms during peak traffic. No user-facing errors so far.",
    stats: [["p95", "310 ms"], ["Errors", "0"], ["Peak RPS", "22k"]],
    timeline: [["Mon", "Latency SLO warning"], ["Mon", "Two replicas added"], ["Tue", "Monitoring"]],
  },
]

const TONES = {
  error: "bg-error-container text-on-error-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  primary: "bg-primary-container text-on-primary-container",
}
const SEVS = {
  "SEV-2": "bg-error-container text-on-error-container",
  "SEV-3": "bg-secondary-container text-on-secondary-container",
  "SEV-4": "border border-outline-variant text-on-surface-variant",
}

function IncidentList({ selected, onPick }: { selected: number; onPick: (i: number) => void }) {
  const { singlePane } = useListDetail()
  const [openOnly, setOpenOnly] = React.useState(true)
  return (
    <>
      <div className="flex h-16 shrink-0 items-center gap-2 pr-3 pl-4">
        <h2 className="flex-1 truncate text-title-lg">Incidents</h2>
        <FilterChip isSelected={openOnly} onChange={setOpenOnly} icon="filter_list">
          Open
        </FilterChip>
      </div>
      <div className="shrink-0 px-3 pb-2">
        <SearchBar aria-label="Search incidents" placeholder="Search incidents" className="w-full" />
      </div>
      <div className="relative no-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3" role="list">
        {INCIDENTS.map((it, i) => (
          <button
            key={it.id}
            type="button"
            role="listitem"
            aria-current={!singlePane && i === selected ? "true" : undefined}
            onClick={() => onPick(i)}
            className={cn(
              "state-layer focus-ring flex w-full cursor-pointer items-start gap-3 rounded-lg p-3 text-left transition-colors duration-200",
              !singlePane && i === selected ? "bg-secondary-container text-on-secondary-container" : "text-on-surface",
            )}
          >
            <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", TONES[it.tone])}>
              <Icon size={20}>{it.icon}</Icon>
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span className="truncate text-title-sm">{it.title}</span>
                <span className="ml-auto shrink-0 text-label-sm opacity-80">{it.age}</span>
              </span>
              <span className="mt-0.5 block truncate text-body-sm opacity-80">
                {it.service} · {it.id}
              </span>
              <span className={cn("mt-2 inline-flex h-6 items-center rounded-sm px-2 text-label-sm", SEVS[it.sev])}>{it.sev}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

function IncidentDetail({ incident: cur }: { incident: Incident }) {
  return (
    <>
      <div className="flex h-16 shrink-0 items-center gap-1 px-2">
        <ListDetailBack />
        <h2 className="min-w-0 flex-1 truncate px-2 text-title-lg">{cur.title}</h2>
        <IconButton aria-label="More options" size="md" width="narrow" className="text-on-surface-variant">
          <Icon>more_vert</Icon>
        </IconButton>
      </div>
      <div className="relative no-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto px-5 pb-6">
        <div className="flex flex-wrap gap-2">
          <span className={cn("inline-flex h-8 items-center rounded-sm px-3 text-label-lg", SEVS[cur.sev])}>{cur.sev}</span>
          <span className="inline-flex h-8 items-center gap-1 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant">
            <Icon size={18}>dns</Icon>
            {cur.service}
          </span>
          <span className="inline-flex h-8 items-center rounded-sm border border-outline-variant px-3 font-mono text-label-lg text-on-surface-variant">
            {cur.id}
          </span>
        </div>
        <p className="text-body-lg text-pretty text-on-surface-variant">{cur.summary}</p>
        <div className="grid grid-cols-3 gap-2">
          {cur.stats.map(([k, v]) => (
            <div key={k} className="rounded-lg bg-surface-container p-3">
              <div className="text-label-md text-on-surface-variant">{k}</div>
              <div className="mt-1 text-title-lg font-medium tabular-nums">{v}</div>
            </div>
          ))}
        </div>
        <div>
          <div className="text-title-sm">Timeline</div>
          <ol className="mt-3 space-y-3 border-l-2 border-outline-variant pl-4 text-body-md">
            {cur.timeline.map(([at, text], i) => (
              <li key={i} className="relative">
                <span className={cn("absolute top-1 -left-[23px] size-3 rounded-full ring-4 ring-surface", ["bg-error", "bg-primary", "bg-outline"][i])} />
                <span className="font-mono text-body-sm text-on-surface-variant">{at}</span> · {text}
              </li>
            ))}
          </ol>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button onPress={() => snackbar("Incident acknowledged", { action: { label: "Undo", onAction: () => {} } })}>
            <Icon>check</Icon>
            Acknowledge
          </Button>
          <Button variant="outlined" onPress={() => snackbar("Escalated to platform-oncall")}>
            Escalate
          </Button>
        </div>
      </div>
    </>
  )
}

function Runbook() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <h2 className="text-title-md">Runbook</h2>
      <ol className="space-y-2 text-body-md">
        {["Check the last deploy and its canary metrics.", "Roll back if errors stay above 2% for five minutes.", "Post an update in #platform-oncall."].map((t, i) => (
          <li key={i} className="flex gap-3 rounded-lg bg-surface-container p-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-label-md text-on-primary">{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>
      <h2 className="pt-2 text-title-md">On call</h2>
      {(
        [
          ["ML", "Maya Lindqvist", "Primary · checkout", "bg-tertiary-container text-on-tertiary-container"],
          ["JP", "Jonah Park", "Secondary · platform", "bg-secondary-container text-on-secondary-container"],
        ] as const
      ).map(([ini, name, role, cls]) => (
        <div key={name} className="flex items-center gap-3">
          <span className={cn("grid size-10 place-items-center rounded-full text-label-lg", cls)}>{ini}</span>
          <div className="min-w-0 flex-1">
            <div className="text-body-lg">{name}</div>
            <div className="text-body-sm text-on-surface-variant">{role}</div>
          </div>
          <IconButton aria-label={`Call ${name}`} className="text-primary">
            <Icon size={20}>call</Icon>
          </IconButton>
        </div>
      ))}
    </div>
  )
}

/** The incidents app. Pass `windowSize` to pin a size class (e.g. inside a demo frame). */
function IncidentsApp({ windowSize, className }: { windowSize?: WindowSizeClass; className?: string }) {
  const [selected, setSelected] = React.useState(0)
  const [detailOpen, setDetailOpen] = React.useState(false)
  return (
    <AdaptiveScaffold
      destinations={DESTINATIONS}
      defaultValue="incidents"
      brand="Kestrel"
      action={{ icon: "add_alert", label: "Declare", onPress: () => snackbar("New incident draft") }}
      showAction={!detailOpen}
      windowSize={windowSize}
      className={className}
    >
      <ListDetailLayout
        detailOpen={detailOpen}
        onDetailOpenChange={setDetailOpen}
        list={
          <IncidentList
            selected={selected}
            onPick={(i) => {
              setSelected(i)
              setDetailOpen(true)
            }}
          />
        }
        detail={<IncidentDetail incident={INCIDENTS[selected]} />}
        supporting={<Runbook />}
      />
    </AdaptiveScaffold>
  )
}

export { IncidentsApp }
