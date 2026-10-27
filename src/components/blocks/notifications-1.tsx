"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

/*
 * Notifications 01 · Channel matrix
 * Events down the side, Email, Push and Slack across the top. Each column header turns its
 * whole column on or off.
 */

export interface NotificationEvent {
  id: string
  label: string
}

export interface Notifications1Props {
  channels?: string[]
  groups?: { group: string; events: NotificationEvent[] }[]
  /** event id → one boolean per channel */
  defaultValue?: Record<string, boolean[]>
  onChange?: (value: Record<string, boolean[]>) => void
  className?: string
}

const CHANNELS = ["Email", "Push", "Slack"]
const GROUPS = [
  { group: "Live ops", events: [{ id: "ev", label: "Event starts or ends" }, { id: "evf", label: "Event fails to publish" }] },
  { group: "Players", events: [{ id: "rep", label: "Report crosses threshold" }, { id: "vip", label: "VIP player opens a ticket" }] },
  { group: "Revenue", events: [{ id: "rev", label: "Revenue anomaly detected" }, { id: "sum", label: "Daily revenue summary" }] },
  { group: "Studio", events: [{ id: "join", label: "New member joins" }, { id: "build", label: "Build rollout changes stage" }] },
]
const DEFAULT: Record<string, boolean[]> = {
  ev: [true, true, true],
  evf: [true, true, true],
  rep: [false, true, true],
  vip: [true, false, true],
  rev: [true, true, false],
  sum: [true, false, false],
  join: [true, false, false],
  build: [false, false, true],
}

export function Notifications1({ channels = CHANNELS, groups = GROUPS, defaultValue = DEFAULT, onChange, className }: Notifications1Props) {
  const [value, setValue] = React.useState(defaultValue)
  const cols = `minmax(220px,1fr) repeat(${channels.length},96px)`
  const update = (next: Record<string, boolean[]>) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <div className={cn("bg-surface", className)}>
      <div className="px-4 py-4 md:px-6">
        <h3 className="text-title-lg font-medium">Notify me about</h3>
        <p className="text-body-sm text-on-surface-variant">Slack messages arrive as DMs from the Lumen app.</p>
      </div>
      <div className="relative overflow-x-auto">
        <div role="table" aria-label="Notification channels" className="min-w-[560px]">
          <div role="row" className="grid items-center gap-2 border-y border-outline-variant bg-surface-container-low px-4 py-2 md:px-6" style={{ gridTemplateColumns: cols }}>
            <span role="columnheader" className="text-label-md text-on-surface-variant">
              Event
            </span>
            {channels.map((ch, c) => {
              const allOn = Object.values(value).every((v) => v[c])
              return (
                <span role="columnheader" key={ch} className="flex flex-col items-center">
                  <span className="text-label-lg">{ch}</span>
                  <Button
                    variant="text"
                    size="xs"
                    className="h-6 px-2 text-label-md"
                    aria-label={`${allOn ? "Turn off" : "Turn on"} all ${ch}`}
                    onPress={() => update(Object.fromEntries(Object.entries(value).map(([k, v]) => [k, v.map((x, j) => (j === c ? !allOn : x))])))}
                  >
                    {allOn ? "None" : "All"}
                  </Button>
                </span>
              )
            })}
          </div>
          {groups.map((g) => (
            <div role="rowgroup" key={g.group}>
              <div role="row" className="px-4 pt-4 pb-1 text-title-sm text-primary md:px-6">
                <span role="rowheader">{g.group}</span>
              </div>
              {g.events.map((e) => (
                <div role="row" key={e.id} className="grid items-center gap-2 border-b border-outline-variant/60 px-4 md:px-6" style={{ gridTemplateColumns: cols }}>
                  <span role="rowheader" className="py-2 text-body-md">
                    {e.label}
                  </span>
                  {channels.map((ch, c) => (
                    <span role="cell" key={ch} className="flex justify-center">
                      <Checkbox
                        aria-label={`${e.label} · ${ch}`}
                        isSelected={!!value[e.id]?.[c]}
                        onChange={(on) => update({ ...value, [e.id]: (value[e.id] ?? channels.map(() => false)).map((x, j) => (j === c ? on : x)) })}
                        className="[&_.size-12]:size-10"
                      />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
