"use client"

import * as React from "react"
import { ToggleButton, ToggleButtonGroup } from "react-aria-components"

import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import { Select, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/*
 * Notifications 02 · Switches + quiet hours
 * Grouped switches with descriptions (incidents are locked on for on-call), quiet hours with a
 * time range and days, and digest frequency.
 */

export interface Notifications2Props {
  className?: string
}

const GROUPS = [
  { group: "On-call", items: [{ id: "incidents", label: "Incidents", detail: "Required while you're on the on-call rota", on: true, locked: true }] },
  {
    group: "Live ops",
    items: [
      { id: "reminders", label: "Event reminders", detail: "15 minutes before an event you own starts", on: true },
      { id: "failures", label: "Publishing failures", detail: "An event or offer you scheduled didn't go live", on: true },
      { id: "prices", label: "Price changes on live SKUs", detail: "Someone edits a price that players can see", on: false },
    ],
  },
  {
    group: "Players",
    items: [
      { id: "backlog", label: "Moderation backlog", detail: "More than 20 open reports for over an hour", on: false },
      { id: "vip", label: "VIP support tickets", detail: "Players with over $1,000 lifetime spend", on: true },
    ],
  },
]
const DAYS = [
  ["mon", "M", "Monday"],
  ["tue", "T", "Tuesday"],
  ["wed", "W", "Wednesday"],
  ["thu", "T", "Thursday"],
  ["fri", "F", "Friday"],
  ["sat", "S", "Saturday"],
  ["sun", "S", "Sunday"],
]
const DIGEST_NOTE = { Off: "No digest emails", Daily: "Every day at 09:00 in your time zone", Weekly: "Mondays at 09:00 in your time zone" } as const

export function Notifications2({ className }: Notifications2Props) {
  const [quiet, setQuiet] = React.useState(true)
  const [digest, setDigest] = React.useState<keyof typeof DIGEST_NOTE>("Weekly")

  return (
    <div className={cn("bg-surface-container-low p-4 md:p-8", className)}>
      <div className="mx-auto max-w-3xl space-y-3">
        <div className="overflow-hidden rounded-xl bg-surface">
          {GROUPS.map((g, gi) => (
            <section key={g.group} aria-label={g.group}>
              <h3 className={cn("px-5 pb-1 text-title-sm text-primary", gi ? "pt-4" : "pt-5")}>{g.group}</h3>
              <ul className="divide-y divide-outline-variant/60">
                {g.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <div id={`ns2-${it.id}`} className="text-body-lg">
                        {it.label}
                      </div>
                      <div className="text-body-md text-on-surface-variant">{it.detail}</div>
                    </div>
                    <Switch aria-labelledby={`ns2-${it.id}`} defaultSelected={it.on} isDisabled={"locked" in it && it.locked} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="rounded-xl bg-surface p-5">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <div id="ns2-quiet" className="text-title-md">
                Quiet hours
              </div>
              <div className="text-body-md text-on-surface-variant">Pause push and Slack. Incidents still come through.</div>
            </div>
            <Switch aria-labelledby="ns2-quiet" isSelected={quiet} onChange={setQuiet} />
          </div>
          <div className={cn("mt-5 flex flex-wrap items-center gap-4 transition-opacity duration-300", !quiet && "opacity-40")}>
            <Select label="From" defaultSelectedKey="22:00" isDisabled={!quiet} density="sm" className="w-32">
              {["20:00", "21:00", "22:00", "23:00"].map((t) => (
                <SelectItem key={t} id={t}>
                  {t}
                </SelectItem>
              ))}
            </Select>
            <Select label="To" defaultSelectedKey="08:00" isDisabled={!quiet} density="sm" className="w-32">
              {["06:00", "07:00", "08:00", "09:00"].map((t) => (
                <SelectItem key={t} id={t}>
                  {t}
                </SelectItem>
              ))}
            </Select>
            <ToggleButtonGroup aria-label="Days" selectionMode="multiple" defaultSelectedKeys={["mon", "tue", "wed", "thu", "fri"]} isDisabled={!quiet} className="flex flex-wrap gap-1.5">
              {DAYS.map(([id, short, long]) => (
                <ToggleButton
                  key={id}
                  id={id}
                  aria-label={long}
                  className={cn(
                    "state-layer focus-ring grid size-10 cursor-pointer place-items-center rounded-full border border-outline-variant text-label-lg text-on-surface-variant",
                    "transition-[border-radius,background-color,color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial data-pressed:rounded-[12px]",
                    "data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container data-disabled:cursor-default",
                  )}
                >
                  {short}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
        </div>
        <div className="rounded-xl bg-surface p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-0 flex-1">
              <div id="ns2-digest" className="text-title-md">
                Email digest
              </div>
              <div className="text-body-md text-on-surface-variant">{DIGEST_NOTE[digest]}</div>
            </div>
            <SegmentedButtonGroup aria-labelledby="ns2-digest" selectedKeys={[digest]} onSelectionChange={(k) => setDigest(([...k][0] as keyof typeof DIGEST_NOTE) ?? digest)}>
              {(Object.keys(DIGEST_NOTE) as (keyof typeof DIGEST_NOTE)[]).map((d) => (
                <SegmentedButton key={d} id={d}>
                  {d}
                </SegmentedButton>
              ))}
            </SegmentedButtonGroup>
          </div>
        </div>
      </div>
    </div>
  )
}
