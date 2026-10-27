"use client"

import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuSeparator, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/*
 * Data table 03 · Grouped events
 * Rows grouped under sticky status headers, with participation bars, an inline live switch
 * and a row menu. Drafts can't go live from here.
 */

type Group = "Running" | "Scheduled" | "Draft"

const GROUPS: { id: Group; label: string; dot: string }[] = [
  { id: "Running", label: "Running", dot: "bg-primary" },
  { id: "Scheduled", label: "Scheduled", dot: "bg-tertiary" },
  { id: "Draft", label: "Drafts", dot: "bg-outline" },
]

const EVENTS = (
  [
    ["Running", "Season 7 · Frostfire", "Season", "Oct 3 – Nov 14", "All players · 1.24M", 64, true],
    ["Running", "Ranked Split 2", "Competitive", "Oct 10 – Nov 1", "Level 30+ · 412K", 38, true],
    ["Running", "Frostfire Pass sale", "Store", "Oct 24 – Oct 27", "Lapsed payers · 86K", 12, true],
    ["Scheduled", "Double XP Weekend", "Boost", "Oct 30 · 18:00 UTC", "All players", 0, true],
    ["Scheduled", "Hollow Night", "Seasonal", "Oct 31 – Nov 3", "All regions", 0, true],
    ["Scheduled", "Coral Cup", "Tournament", "Nov 8 · 16:00 UTC", "Invite only · 256 teams", 0, false],
    ["Draft", "Starter bundle v3", "Store · A/B test", "Not scheduled", "New players, day 0–3", 0, false],
  ] as const
).map(([group, name, type, when, audience, pct, on]) => ({ group: group as Group, name, type, when, audience, pct, on }))

const COLS = "grid-cols-[minmax(220px,1.6fr)_150px_minmax(160px,1fr)_150px_72px_48px]"

export function DataTableBlock3({ className }: { className?: string }) {
  const [live, setLive] = React.useState<Record<string, boolean>>(() => Object.fromEntries(EVENTS.map((e) => [e.name, e.on])))

  return (
    <div className={cn("relative max-h-[480px] overflow-auto bg-surface", className)}>
      <div role="table" aria-label="Live events" className="min-w-[820px]">
        <div role="rowgroup" className="sticky top-0 z-10">
          <div
            role="row"
            className={cn("grid h-10 items-center gap-3 border-b border-outline-variant bg-surface px-4 text-label-md text-on-surface-variant", COLS)}
          >
            <span role="columnheader">Event</span>
            <span role="columnheader">Window</span>
            <span role="columnheader">Audience</span>
            <span role="columnheader">Participation</span>
            <span role="columnheader" className="text-center">
              Live
            </span>
            <span role="columnheader">
              <span className="sr-only">Actions</span>
            </span>
          </div>
        </div>
        {GROUPS.map((g) => {
          const rows = EVENTS.filter((e) => e.group === g.id)
          return (
            <div role="rowgroup" key={g.id}>
              <div role="row" className="sticky top-10 z-[5] flex h-10 items-center gap-2 bg-surface-container px-4 text-title-sm">
                <span role="rowheader" className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", g.dot)} />
                  {g.label}
                  <span className="text-label-md text-on-surface-variant">{rows.length}</span>
                </span>
              </div>
              {rows.map((e) => (
                <div role="row" key={e.name} className={cn("grid items-center gap-3 border-b border-outline-variant/60 px-4 py-2 text-body-md", COLS)}>
                  <span role="cell" className="min-w-0">
                    <span className="block truncate font-medium">{e.name}</span>
                    <span className="block text-body-sm text-on-surface-variant">{e.type}</span>
                  </span>
                  <span role="cell" className="text-on-surface-variant">
                    {e.when}
                  </span>
                  <span role="cell" className="truncate text-on-surface-variant">
                    {e.audience}
                  </span>
                  <span role="cell" className="flex items-center gap-2">
                    {e.pct > 0 && (
                      <span className="flex h-1.5 flex-1 items-center gap-1">
                        <span className="h-full rounded-full bg-primary" style={{ width: `${e.pct}%` }} />
                        <span className="h-full flex-1 rounded-full bg-secondary-container" />
                      </span>
                    )}
                    <span className="ml-auto w-9 text-right text-body-sm text-on-surface-variant tabular-nums">{e.pct ? `${e.pct}%` : "—"}</span>
                  </span>
                  <span role="cell" className="flex justify-center">
                    <Switch
                      aria-label={`${e.name} live`}
                      isSelected={live[e.name]}
                      isDisabled={e.group === "Draft"}
                      onChange={(v) => {
                        setLive((s) => ({ ...s, [e.name]: v }))
                        snackbar(`${e.group === "Running" ? (v ? "Resumed" : "Paused") : v ? "Armed" : "Disarmed"} ${e.name}`)
                      }}
                    />
                  </span>
                  <span role="cell">
                    <MenuTrigger>
                      <IconButton aria-label={`${e.name} actions`}>
                        <Icon>more_vert</Icon>
                      </IconButton>
                      <MenuPopover placement="bottom end">
                        <Menu
                          aria-label="Event actions"
                          className="w-52"
                          onAction={(k) => {
                            if (k === "end") snackbar(`${e.name} ended`, { action: { label: "Undo", onAction: () => {} } })
                            else snackbar(k === "edit" ? `Editing ${e.name}` : k === "dup" ? `Duplicated ${e.name}` : `Opening analytics for ${e.name}`)
                          }}
                        >
                          <MenuItem id="edit" icon="edit">
                            Edit
                          </MenuItem>
                          <MenuItem id="dup" icon="content_copy">
                            Duplicate
                          </MenuItem>
                          <MenuItem id="analytics" icon="monitoring">
                            Analytics
                          </MenuItem>
                          <MenuSeparator />
                          <MenuItem id="end" icon="stop_circle" className="text-error">
                            End now
                          </MenuItem>
                        </Menu>
                      </MenuPopover>
                    </MenuTrigger>
                  </span>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
