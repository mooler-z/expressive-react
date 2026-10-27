"use client"

import * as React from "react"
import type { Selection } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableColumn,
  DataTableEmpty,
  DataTableHeader,
  DataTablePagination,
  DataTableRow,
  DataTableSearch,
  DataTableToolbar,
  useDataTable,
} from "@/components/ui/data-table"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Data table 01 · Player directory
 * Search, status filter chips, sortable columns, row selection with a contextual action bar,
 * and pagination.
 */

type Status = "Active" | "Flagged" | "Suspended" | "Banned"

type Player = {
  id: string
  handle: string
  region: string
  platform: string
  level: number
  ltv: number
  seen: string
  status: Status
}

const STATUS: Record<Status, { chip: string; dot: string }> = {
  Active: { chip: "bg-primary-container text-on-primary-container", dot: "bg-primary" },
  Flagged: { chip: "bg-tertiary-container text-on-tertiary-container", dot: "bg-tertiary" },
  Suspended: { chip: "bg-surface-container-highest text-on-surface-variant", dot: "bg-outline" },
  Banned: { chip: "bg-error-container text-on-error-container", dot: "bg-error" },
}

const AVATARS = [
  "bg-primary-container text-on-primary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-secondary-container text-on-secondary-container",
]

const PLAYERS: Player[] = (
  [
    ["NightOwl_77", "P-48213907", "NA-East", "PC", 87, 1240.5, "2 min ago", "Active"],
    ["kairos", "P-30918244", "EU-West", "PS5", 64, 412, "1 h ago", "Active"],
    ["MossyBoots", "P-77120458", "EU-North", "Switch", 23, 19.99, "3 d ago", "Active"],
    ["Valkyr.ie", "P-11934082", "EU-West", "PC", 112, 3310.75, "Online", "Flagged"],
    ["pixelgrunt", "P-55309761", "NA-West", "Xbox", 45, 89.97, "5 h ago", "Active"],
    ["Saffron", "P-62018833", "APAC-Tokyo", "iOS", 38, 254.4, "12 min ago", "Active"],
    ["zero_cool_jp", "P-90231147", "APAC-Tokyo", "PC", 99, 0, "9 d ago", "Banned"],
    ["LunaTide", "P-40877120", "SA-São Paulo", "Android", 51, 146.3, "Online", "Active"],
    ["Brickhouse", "P-21650398", "NA-East", "PS5", 72, 698, "2 d ago", "Suspended"],
    ["orchid.exe", "P-83316025", "OCE-Sydney", "PC", 18, 4.99, "Online", "Active"],
    ["ThunderMoth", "P-37462211", "NA-East", "Xbox", 133, 2105.2, "40 min ago", "Flagged"],
    ["quietkestrel", "P-58800364", "EU-West", "Android", 9, 0, "6 h ago", "Active"],
  ] as const
).map(([handle, id, region, platform, level, ltv, seen, status]) => ({ handle, id, region, platform, level, ltv, seen, status }))

const FILTERS = ["All", "Active", "Flagged", "Suspended", "Banned"] as const
type Filter = (typeof FILTERS)[number]

const money = (n: number) => (n ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—")
const initial = (handle: string) => handle.replace(/[^a-z]/i, "").charAt(0).toUpperCase()

export function DataTableBlock1({ className }: { className?: string }) {
  const [filter, setFilter] = React.useState<Filter>("All")
  const [selected, setSelected] = React.useState<Selection>(new Set())
  const rows = React.useMemo(() => PLAYERS.filter((p) => filter === "All" || p.status === filter), [filter])
  const dt = useDataTable(rows, {
    pageSize: 8,
    initialSort: { column: "ltv", direction: "descending" },
    search: (p, q) => p.handle.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
  })
  const count = selected === "all" ? rows.length : selected.size

  const bulk = (verb: string) => () => {
    snackbar(`${verb} · ${count} ${count === 1 ? "player" : "players"}`, { action: { label: "Undo", onAction: () => {} } })
    setSelected(new Set())
  }

  return (
    <div className={cn("bg-surface", className)}>
      {count === 0 ? (
        <DataTableToolbar className="min-h-16 gap-2 px-4 py-3 md:px-4">
          <DataTableSearch placeholder="Search handle or player ID" aria-label="Search players" className="w-full sm:w-72 sm:flex-none" {...dt.searchProps} />
          <ChipGroup
            aria-label="Status"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[filter]}
            onSelectionChange={(keys) => setFilter([...keys][0] as Filter)}
          >
            {FILTERS.map((f) => (
              <FilterChip key={f} id={f}>
                {f}
                <span className="text-label-md opacity-70">{f === "All" ? PLAYERS.length : PLAYERS.filter((p) => p.status === f).length}</span>
              </FilterChip>
            ))}
          </ChipGroup>
          <span className="flex-1" />
          <Button variant="outlined" className="pr-4 pl-3" onPress={() => snackbar("Exporting players as CSV…")}>
            <Icon>download</Icon>
            Export
          </Button>
        </DataTableToolbar>
      ) : (
        <div
          role="toolbar"
          aria-label="Selected players"
          className="flex min-h-16 flex-wrap items-center gap-2 bg-secondary-container px-2 py-3 text-on-secondary-container md:px-4"
        >
          <IconButton aria-label="Clear selection" className="text-current" onPress={() => setSelected(new Set())}>
            <Icon>close</Icon>
          </IconButton>
          <span className="text-title-sm">{count} selected</span>
          <span className="flex-1" />
          <Button variant="text" className="pr-4 pl-3 text-current" onPress={bulk("Message queued")}>
            <Icon>mail</Icon>
            Message
          </Button>
          <Button variant="text" className="pr-4 pl-3 text-current" onPress={bulk("Granted 500 Ember Shards")}>
            <Icon>redeem</Icon>
            Grant item
          </Button>
          <Button className="bg-error pr-4 pl-3 text-on-error" onPress={bulk("Suspended for 24h")}>
            <Icon>block</Icon>
            Suspend
          </Button>
        </div>
      )}

      <DataTable
        aria-label="Players"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        className="min-w-[900px]"
        containerClassName="border-t border-outline-variant"
        {...dt.tableProps}
      >
        <DataTableHeader>
          <DataTableColumn id="handle" isRowHeader allowsSorting>
            Player
          </DataTableColumn>
          <DataTableColumn id="region">Region</DataTableColumn>
          <DataTableColumn id="platform">Platform</DataTableColumn>
          <DataTableColumn id="level" allowsSorting align="end">
            Level
          </DataTableColumn>
          <DataTableColumn id="ltv" allowsSorting align="end">
            Lifetime spend
          </DataTableColumn>
          <DataTableColumn id="seen">Last seen</DataTableColumn>
          <DataTableColumn id="status">Status</DataTableColumn>
          <DataTableColumn id="open" width={56}>
            <span className="sr-only">Open</span>
          </DataTableColumn>
        </DataTableHeader>
        <DataTableBody
          items={dt.items}
          renderEmptyState={() => (
            <DataTableEmpty icon="person_search" title="No players match">
              Try another handle, or clear the status filter.
              <div className="mt-3">
                <Button
                  variant="outlined"
                  onPress={() => {
                    dt.setQuery("")
                    setFilter("All")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </DataTableEmpty>
          )}
        >
          {(p) => (
            <DataTableRow id={p.id}>
              <DataTableCell>
                <span className="flex min-w-0 items-center gap-3">
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-label-lg", AVATARS[PLAYERS.indexOf(p) % 3])}>
                    {initial(p.handle)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{p.handle}</span>
                    <span className="block font-mono text-body-sm text-on-surface-variant">{p.id}</span>
                  </span>
                </span>
              </DataTableCell>
              <DataTableCell muted className="whitespace-nowrap">
                {p.region}
              </DataTableCell>
              <DataTableCell muted>{p.platform}</DataTableCell>
              <DataTableCell numeric>{p.level}</DataTableCell>
              <DataTableCell numeric>{money(p.ltv)}</DataTableCell>
              <DataTableCell muted>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span className={cn("size-2 shrink-0 rounded-full", p.seen === "Online" ? "bg-primary" : "bg-outline-variant")} />
                  {p.seen}
                </span>
              </DataTableCell>
              <DataTableCell>
                <span className={cn("inline-flex h-7 items-center gap-1.5 rounded-sm pr-3 pl-2 text-label-md whitespace-nowrap", STATUS[p.status].chip)}>
                  <span className={cn("size-1.5 rounded-full", STATUS[p.status].dot)} />
                  {p.status}
                </span>
              </DataTableCell>
              <DataTableCell>
                <IconButton aria-label={`Open ${p.handle}`} onPress={() => snackbar(`Open ${p.handle} in the player profile`)}>
                  <Icon>chevron_right</Icon>
                </IconButton>
              </DataTableCell>
            </DataTableRow>
          )}
        </DataTableBody>
      </DataTable>
      <DataTablePagination {...dt.paginationProps} pageSizeOptions={[8, 16]} />
    </div>
  )
}
