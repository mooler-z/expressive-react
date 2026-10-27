"use client"

import * as React from "react"

import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { PageHeader } from "./admin-ui"

type Kind = "deploy" | "access" | "billing" | "policy" | "infra"
type Day = "Today" | "Yesterday" | "Oct 23"

type AuditEvent = {
  id: string
  day: Day
  time: string
  actor: string
  verb: string
  target: string
  kind: Kind
  icon: string
  tone: "primary" | "tertiary" | "neutral"
  diff: string
  ip: string
  client: string
}

const EVENTS: AuditEvent[] = [
  { id: "e1", day: "Today", time: "09:41", actor: "Maya Lindqvist", verb: "promoted", target: "checkout-api v4.2.0", kind: "deploy", icon: "rocket_launch", tone: "primary", diff: `{ "from": "40%", "to": "100%" }`, ip: "10.4.1.18", client: "Web · Chrome" },
  { id: "e2", day: "Today", time: "08:02", actor: "Sam Okafor", verb: "rotated", target: "API key ksk_live_9f2a", kind: "access", icon: "key", tone: "tertiary", diff: `{ "expires": "2027-01-24" }`, ip: "10.4.2.25", client: "Web · Chrome" },
  { id: "e3", day: "Today", time: "03:14", actor: "system", verb: "auto-healed", target: "edge-fra-04", kind: "infra", icon: "smart_toy", tone: "neutral", diff: `{ "reason": "health check failed 3×" }`, ip: "10.4.3.32", client: "Kestrel controller" },
  { id: "e4", day: "Yesterday", time: "17:20", actor: "Jonah Park", verb: "invited", target: "3 engineers to Payments", kind: "access", icon: "person_add", tone: "primary", diff: `{ "role": "Member", "count": 3 }`, ip: "10.4.1.18", client: "Web · Chrome" },
  { id: "e5", day: "Yesterday", time: "11:05", actor: "Ava Reyes", verb: "enabled policy", target: "no-public-buckets", kind: "policy", icon: "policy", tone: "tertiary", diff: `{ "mode": "enforce", "preview_blocked": 0 }`, ip: "10.4.2.25", client: "Web · Chrome" },
  { id: "e6", day: "Oct 23", time: "15:48", actor: "Priya Nair", verb: "changed plan", target: "Halide Bank → 1,240 seats", kind: "billing", icon: "upgrade", tone: "primary", diff: `{ "seats": [980, 1240] }`, ip: "10.4.1.18", client: "Web · Chrome" },
  { id: "e7", day: "Oct 23", time: "10:12", actor: "Tomás Weber", verb: "deleted", target: "staging-old cluster", kind: "infra", icon: "delete", tone: "tertiary", diff: `{ "nodes": 6, "backup": true }`, ip: "10.4.2.25", client: "Web · Chrome" },
]

const ACTORS = ["Anyone", "Maya Lindqvist", "Jonah Park", "Sam Okafor", "system"]
const ACTIONS: { id: "all" | Kind; label: string }[] = [
  { id: "all", label: "All actions" },
  { id: "deploy", label: "Deploys" },
  { id: "access", label: "Access" },
  { id: "billing", label: "Billing" },
  { id: "policy", label: "Policy" },
]
const RANGES = { "24h": ["Today"], "7d": ["Today", "Yesterday", "Oct 23"], "30d": ["Today", "Yesterday", "Oct 23"] } as const
type Range = keyof typeof RANGES

const TONE = {
  primary: "bg-primary-container text-on-primary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  neutral: "bg-surface-container-highest text-on-surface-variant",
} as const

export function AdminAudit() {
  const [actor, setActor] = React.useState("Anyone")
  const [action, setAction] = React.useState<"all" | Kind>("all")
  const [range, setRange] = React.useState<Range>("7d")

  const visible = EVENTS.filter(
    (e) =>
      (actor === "Anyone" || e.actor === actor) &&
      (action === "all" || e.kind === action) &&
      (RANGES[range] as readonly string[]).includes(e.day),
  )
  const days = [...new Set(visible.map((e) => e.day))]

  return (
    <div>
      <PageHeader
        title="Audit log"
        description="Every change, who made it, and from where"
        actions={
          <>
            <Button variant="outlined" className="pr-5" onPress={() => snackbar("Exporting audit log (JSON)")}>
              <Icon>download</Icon>
              Export
            </Button>
            <Button variant="tonal" className="pr-5" onPress={() => snackbar("SIEM streaming settings")}>
              <Icon>cell_tower</Icon>
              Stream to SIEM
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select label="Actor" className="w-52" selectedKey={actor} onSelectionChange={(k) => k != null && setActor(String(k))}>
          {ACTORS.map((a) => (
            <SelectItem key={a} id={a}>
              {a}
            </SelectItem>
          ))}
        </Select>
        <Select label="Action" className="w-52" selectedKey={action} onSelectionChange={(k) => k != null && setAction(k as "all" | Kind)}>
          {ACTIONS.map((a) => (
            <SelectItem key={a.id} id={a.id}>
              {a.label}
            </SelectItem>
          ))}
        </Select>
        <ConnectedButtonGroup
          aria-label="Time range"
          variant="filled"
          size="sm"
          selectedKeys={[range]}
          onSelectionChange={(keys) => {
            const k = [...keys][0] as Range | undefined
            if (k) setRange(k)
          }}
        >
          {(Object.keys(RANGES) as Range[]).map((r) => (
            <ConnectedButton key={r} id={r}>
              {r}
            </ConnectedButton>
          ))}
        </ConnectedButtonGroup>
      </div>

      {days.length === 0 ? (
        <EmptyState
          icon="manage_search"
          title="No matching events"
          description="Try another actor, action or time range."
          className="rounded-xl bg-surface-container-low"
        />
      ) : (
        <div className="space-y-6">
          {days.map((day) => (
            <section key={day} aria-label={day}>
              <h2 className="pb-2 text-title-sm text-on-surface-variant">{day}</h2>
              <Accordion
                variant="flush"
                allowsMultipleExpanded
                headingLevel={3}
                className="overflow-hidden rounded-xl bg-surface-container-low px-0"
              >
                {visible
                  .filter((e) => e.day === day)
                  .map((e) => (
                    <AccordionItem
                      key={e.id}
                      id={e.id}
                      leading={
                        <span className={cn("grid size-9 shrink-0 place-items-center rounded-full [--icon-size:18px]", TONE[e.tone])}>
                          <Icon>{e.icon}</Icon>
                        </span>
                      }
                      title={
                        <span className="text-body-md">
                          <span className="font-medium">{e.actor}</span> <span className="text-on-surface-variant">{e.verb}</span>{" "}
                          <span className="font-mono text-body-sm">{e.target}</span>
                        </span>
                      }
                      trailing={<span className="tabular-nums">{e.time}</span>}
                      triggerClassName="state-layer min-h-15 gap-3 px-4 py-3 font-normal data-hovered:text-on-surface"
                      panelClassName="grid gap-3 bg-surface-container px-4 py-3 text-on-surface sm:grid-cols-[1fr_auto]"
                    >
                      <pre className="relative overflow-x-auto rounded-md bg-surface p-3 font-mono text-body-sm">{e.diff}</pre>
                      <dl className="space-y-1 text-body-sm">
                        <div className="flex gap-2">
                          <dt className="text-on-surface-variant">IP</dt>
                          <dd className="font-mono">{e.ip}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="text-on-surface-variant">Client</dt>
                          <dd>{e.client}</dd>
                        </div>
                      </dl>
                    </AccordionItem>
                  ))}
              </Accordion>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
