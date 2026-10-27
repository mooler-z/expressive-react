import * as React from "react"
import type { Selection } from "react-aria-components"

import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AssistChip, FilterChip } from "@/components/ui/chip"
import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTableCell,
  DataTableColumn,
  DataTableHeader,
  DataTablePagination,
  DataTableProgress,
  DataTableRow,
  DataTableRowActions,
  DataTableSearch,
  DataTableToolbar,
  useDataTable,
} from "@/components/ui/data-table"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Menu, MenuItem, MenuPopover, MenuSeparator, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Section, Variant, Variants } from "@/docs/section"

type Status = "Healthy" | "Rolling" | "Failed" | "Paused"
type Deployment = {
  id: string
  service: string
  version: string
  status: Status
  region: string
  p95: number | null
  deployed: string
  ageMin: number
  env: "Production" | "Staging"
}

const SERVICES = ["checkout-api", "identity", "billing-sync", "edge-cache", "scheduler", "ledger", "search", "auth", "ingest", "notifier", "media-proxy", "payments", "inventory", "reports", "gateway", "feature-flags"]
const REGIONS = ["eu-central-1", "us-east-1", "ap-northeast-1", "us-west-2", "eu-west-1"]
const STATUSES: Status[] = ["Healthy", "Rolling", "Failed", "Healthy", "Paused", "Healthy", "Healthy"]
const AGES = [2, 14, 60, 180, 1440, 35, 7, 300, 95, 2880]

const ago = (m: number) => (m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : m < 2880 ? "Yesterday" : `${Math.round(m / 1440)} d ago`)

const ROWS: Deployment[] = Array.from({ length: 48 }, (_, i) => {
  const status = i < 5 ? (["Healthy", "Rolling", "Failed", "Healthy", "Paused"] as Status[])[i] : STATUSES[(i * 3) % STATUSES.length]
  const ageMin = i < 5 ? [2, 14, 60, 180, 1440][i] : AGES[(i * 7) % AGES.length] + i
  return {
    id: `d${i}`,
    service: SERVICES[i % SERVICES.length] + (i >= SERVICES.length ? `-${Math.floor(i / SERVICES.length) + 1}` : ""),
    version: i < 5 ? ["v4.2.0", "v2.11.3", "v1.9.0", "v7.0.2", "v4.1.8"][i] : `v${(i % 7) + 1}.${(i * 3) % 12}.${i % 5}`,
    status,
    region: i < 5 ? ["eu-central-1", "us-east-1", "eu-central-1", "ap-northeast-1", "us-west-2"][i] : REGIONS[(i * 2) % REGIONS.length],
    p95: status === "Paused" ? null : i < 5 ? [182, 96, 1240, 41][i] : 30 + ((i * 47) % 400),
    deployed: ago(ageMin),
    ageMin,
    env: i % 4 === 3 ? "Staging" : "Production",
  }
})

function DeployStatus({ status }: { status: Status }) {
  if (status === "Healthy")
    return (
      <StatusBadge size="md" variant="tertiary" className="h-7 gap-1.5 pr-3 pl-2">
        <span className="size-1.5 rounded-full bg-tertiary" />
        Healthy
      </StatusBadge>
    )
  if (status === "Rolling")
    return (
      <StatusBadge size="md" variant="secondary" className="h-7 gap-1.5 pr-3 pl-1.5">
        <LoadingIndicator aria-hidden size={18} className="text-current" />
        Rolling out · 40%
      </StatusBadge>
    )
  if (status === "Failed")
    return (
      <StatusBadge size="md" variant="error" className="h-7 gap-1.5 pr-3 pl-2">
        <Icon filled>error</Icon>
        Failed
      </StatusBadge>
    )
  return (
    <StatusBadge size="md" variant="outlined" className="h-7 gap-1.5 pr-3 pl-2">
      <span className="size-1.5 rounded-full bg-outline" />
      Paused
    </StatusBadge>
  )
}

const COLUMNS = [
  { id: "service", label: "Service" },
  { id: "version", label: "Version" },
  { id: "status", label: "Status" },
  { id: "region", label: "Region" },
  { id: "p95", label: "p95 latency" },
  { id: "deployed", label: "Deployed" },
] as const

function FilterMenuChip({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string | null
  onChange: (v: string | null) => void
}) {
  return (
    <MenuTrigger>
      <AssistChip trailingIcon="arrow_drop_down" className={value ? "border-transparent bg-secondary-container text-on-secondary-container" : undefined}>
        {value ?? label}
      </AssistChip>
      <MenuPopover>
        <Menu
          aria-label={label}
          selectionMode="single"
          selectedKeys={value ? [value] : []}
          onSelectionChange={(keys) => {
            const k = [...(keys as Set<string>)][0]
            onChange(k === value ? null : (k ?? null))
          }}
        >
          {options.map((o) => (
            <MenuItem key={o} id={o}>
              {o}
            </MenuItem>
          ))}
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}

function DeploymentsTable({ className }: { className?: string }) {
  const [production, setProduction] = React.useState(true)
  const [status, setStatus] = React.useState<string | null>(null)
  const [region, setRegion] = React.useState<string | null>(null)
  const [selected, setSelected] = React.useState<Selection>(new Set(["d0"]))
  const [hidden, setHidden] = React.useState<Set<string>>(new Set())

  const rows = React.useMemo(
    () =>
      ROWS.filter(
        (r) =>
          (!production || r.env === "Production") &&
          (!status || r.status === status) &&
          (!region || r.region === region),
      ),
    [production, status, region],
  )
  const dt = useDataTable(rows, {
    pageSize: 5,
    initialSort: { column: "service", direction: "ascending" },
    sortValue: (r, c) => (c === "deployed" ? r.ageMin : c === "p95" ? (r.p95 ?? Infinity) : (r[c as keyof Deployment] as string)),
    search: (r, q) => r.service.includes(q) || r.region.includes(q) || r.version.includes(q),
  })
  const columns = COLUMNS.filter((c) => !hidden.has(c.id))
  const selectedCount = selected === "all" ? rows.length : selected.size

  return (
    <DataTableCard className={className}>
      <DataTableToolbar>
        <DataTableSearch placeholder="Search deployments" aria-label="Search deployments" {...dt.searchProps} />
        <div className="flex flex-wrap gap-2">
          <FilterChip isSelected={production} onChange={setProduction}>
            Production
          </FilterChip>
          <FilterMenuChip label="Status" options={["Healthy", "Rolling", "Failed", "Paused"]} value={status} onChange={setStatus} />
          <FilterMenuChip label="Region" options={REGIONS} value={region} onChange={setRegion} />
        </div>
        <div className="ml-auto flex gap-1">
          <MenuTrigger>
            <IconButton aria-label="Columns">
              <Icon>view_column</Icon>
            </IconButton>
            <MenuPopover placement="bottom end">
              <Menu
                aria-label="Visible columns"
                selectionMode="multiple"
                selectedKeys={COLUMNS.filter((c) => !hidden.has(c.id)).map((c) => c.id)}
                disabledKeys={["service"]}
                onSelectionChange={(keys) => {
                  const on = keys === "all" ? new Set(COLUMNS.map((c) => c.id)) : (keys as Set<string>)
                  setHidden(new Set(COLUMNS.filter((c) => !on.has(c.id)).map((c) => c.id)))
                }}
              >
                {COLUMNS.map((c) => (
                  <MenuItem key={c.id} id={c.id}>
                    {c.label}
                  </MenuItem>
                ))}
              </Menu>
            </MenuPopover>
          </MenuTrigger>
          <Button
            variant="outlined"
            onPress={() => snackbar(`Exporting ${dt.total} rows as CSV`, { action: { label: "Cancel", onAction: () => snackbar("Export cancelled") } })}
          >
            <Icon>download</Icon>
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </DataTableToolbar>
      <DataTable
        aria-label="Deployments"
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        resizable
        className="min-w-[840px]"
        {...dt.tableProps}
      >
        <DataTableHeader>
          {columns.map((c) => (
            <DataTableColumn
              key={c.id}
              id={c.id}
              isRowHeader={c.id === "service"}
              allowsSorting={c.id !== "version"}
              align={c.id === "p95" ? "end" : "start"}
              minWidth={96}
              defaultWidth={c.id === "status" ? 190 : c.id === "service" ? 170 : undefined}
            >
              {c.label}
            </DataTableColumn>
          ))}
          <DataTableColumn id="actions" width={64} minWidth={64}>
            <span className="sr-only">Actions</span>
          </DataTableColumn>
        </DataTableHeader>
        <DataTableBody items={dt.items} dependencies={[columns]}>
          {(r) => (
            <DataTableRow id={r.id}>
              {columns.map((c) => {
                switch (c.id) {
                  case "service":
                    return <DataTableCell key={c.id} className="font-medium whitespace-nowrap">{r.service}</DataTableCell>
                  case "version":
                    return <DataTableCell key={c.id} className="font-mono text-body-sm">{r.version}</DataTableCell>
                  case "status":
                    return (
                      <DataTableCell key={c.id}>
                        <DeployStatus status={r.status} />
                      </DataTableCell>
                    )
                  case "region":
                    return <DataTableCell key={c.id} muted className="whitespace-nowrap">{r.region}</DataTableCell>
                  case "p95":
                    return (
                      <DataTableCell key={c.id} numeric className={r.p95 != null && r.p95 > 1000 ? "text-error" : undefined}>
                        {r.p95 == null ? "—" : `${r.p95.toLocaleString()} ms`}
                      </DataTableCell>
                    )
                  case "deployed":
                    return <DataTableCell key={c.id} muted className="whitespace-nowrap">{r.deployed}</DataTableCell>
                }
              })}
              <DataTableCell className="px-2 py-1">
                <DataTableRowActions label={`Actions for ${r.service}`} onAction={(key) => snackbar(`${String(key)} · ${r.service}`)}>
                  <MenuItem id="View logs" icon="article">View logs</MenuItem>
                  <MenuItem id="Redeploy" icon="restart_alt">Redeploy</MenuItem>
                  <MenuItem id="Roll back" icon="undo">Roll back</MenuItem>
                  <MenuSeparator />
                  <MenuItem id="Delete" icon="delete">Delete</MenuItem>
                </DataTableRowActions>
              </DataTableCell>
            </DataTableRow>
          )}
        </DataTableBody>
      </DataTable>
      <DataTablePagination {...dt.paginationProps} pageSizeOptions={[5, 10, 25]} start={`${selectedCount} of ${rows.length} selected`} />
    </DataTableCard>
  )
}

const EXPAND_ROWS = [
  { name: "checkout-api", version: "4.2.0", status: "Healthy", p95: 142 },
  { name: "ledger", version: "2.9.1", status: "Degraded", p95: 238 },
  { name: "auth", version: "7.0.3", status: "Healthy", p95: 61 },
  { name: "search", version: "3.4.0", status: "Healthy", p95: 118 },
]

function ExpandableTable() {
  const [open, setOpen] = React.useState<string | null>("ledger")
  return (
    <Table density="dense" className="min-w-[520px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">
            <span className="sr-only">Expand</span>
          </TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Version</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="end">p95 ms</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {EXPAND_ROWS.flatMap((r) => {
          const isOpen = open === r.name
          const row = (
            <TableRow key={r.name} className={isOpen ? "bg-surface-container-low" : undefined}>
              <TableCell className="w-10 px-1">
                <IconButton
                  size="xs"
                  aria-label={`Details for ${r.name}`}
                  aria-expanded={isOpen}
                  aria-controls={`dt-x-${r.name}`}
                  onPress={() => setOpen(isOpen ? null : r.name)}
                >
                  <Icon className={`transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial ${isOpen ? "rotate-180" : ""}`}>
                    expand_more
                  </Icon>
                </IconButton>
              </TableCell>
              <TableCell className="font-mono">{r.name}</TableCell>
              <TableCell className="tabular-nums">{r.version}</TableCell>
              <TableCell>
                <StatusBadge size="md" variant={r.status === "Healthy" ? "secondary" : "tertiary"}>
                  {r.status}
                </StatusBadge>
              </TableCell>
              <TableCell numeric className={r.p95 > 200 ? "text-tertiary" : undefined}>
                {r.p95}
              </TableCell>
            </TableRow>
          )
          if (!isOpen) return [row]
          return [
            row,
            <TableRow key={`${r.name}-detail`} id={`dt-x-${r.name}`} className="bg-surface-container-low">
              <TableCell />
              <TableCell colSpan={4} className="pt-1 pb-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Owner", "Team Ledger"],
                    ["Last deploy", "Today, 08:12 · canary 50%"],
                    ["Alert", "p95 above 200 ms for 12 min"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-label-sm text-on-surface-variant">{k}</div>
                      <div className="text-body-md">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="xs" variant="tonal" className="px-4" onPress={() => snackbar(`Opening traces for ${r.name}`)}>
                    Open traces
                  </Button>
                  <Button size="xs" variant="text" onPress={() => snackbar(`Rolling back ${r.name}`, { action: { label: "Undo", onAction: () => {} } })}>
                    Roll back
                  </Button>
                </div>
              </TableCell>
            </TableRow>,
          ]
        })}
      </TableBody>
    </Table>
  )
}

function RefreshingTable() {
  const [loading, setLoading] = React.useState(true)
  const [retrying, setRetrying] = React.useState(false)
  const [failed, setFailed] = React.useState(true)
  React.useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 2600)
    return () => clearTimeout(t)
  }, [loading])
  const rows = [
    { id: "checkout-api", version: "4.2.0", p95: 142, error: false },
    { id: "ledger", version: "2.9.1", p95: 238, error: failed },
    { id: "auth", version: "7.0.3", p95: 61, error: false },
  ]
  return (
    <div className="overflow-hidden rounded-lg bg-surface">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="text-title-md">Deployments</div>
        <span className="text-body-sm text-on-surface-variant" aria-live="polite">
          {loading ? "Refreshing…" : "Updated just now"}
        </span>
        <IconButton aria-label="Refresh" className="ml-auto" isDisabled={loading} onPress={() => setLoading(true)}>
          <Icon>refresh</Icon>
        </IconButton>
      </div>
      <DataTableProgress isLoading={loading} className="bg-secondary-container" />
      <DataTable aria-label="Deployments (refreshing)" isLoading={loading} className="min-w-[520px]">
        <DataTableHeader>
          <DataTableColumn id="service" isRowHeader>Service</DataTableColumn>
          <DataTableColumn id="version">Version</DataTableColumn>
          <DataTableColumn id="status">Status</DataTableColumn>
          <DataTableColumn id="p95" align="end">p95 ms</DataTableColumn>
        </DataTableHeader>
        <DataTableBody items={rows}>
          {(r) =>
            r.error ? (
              <DataTableRow id={r.id} className="bg-error-container/40 data-hovered:bg-error-container/50">
                <DataTableCell className="font-mono whitespace-nowrap">{r.id}</DataTableCell>
                <DataTableCell colSpan={3} className="py-1.5">
                  <div className="flex items-center gap-2 text-on-error-container">
                    <Icon filled size={20} className="text-error">error</Icon>
                    <span className="flex-1 text-body-md">Health check failed · couldn't load metrics</span>
                    <Button
                      size="xs"
                      variant="text"
                      className="text-error"
                      isPending={retrying}
                      onPress={() => {
                        setRetrying(true)
                        setTimeout(() => {
                          setRetrying(false)
                          setFailed(false)
                          snackbar("Metrics loaded")
                        }, 1400)
                      }}
                    >
                      {retrying ? "Retrying…" : "Retry"}
                    </Button>
                  </div>
                </DataTableCell>
              </DataTableRow>
            ) : (
              <DataTableRow id={r.id}>
                <DataTableCell className="font-mono whitespace-nowrap">{r.id}</DataTableCell>
                <DataTableCell className="tabular-nums">{r.version}</DataTableCell>
                <DataTableCell>
                  <StatusBadge size="md" variant="secondary">Healthy</StatusBadge>
                </DataTableCell>
                <DataTableCell numeric>{r.p95}</DataTableCell>
              </DataTableRow>
            )
          }
        </DataTableBody>
      </DataTable>
    </div>
  )
}

export default function DataTableSection() {
  return (
    <Section
      id="data-table"
      description="Toolbar with search and filter chips, selectable rows, sortable and resizable headers, status chips, row action menus and a pagination footer. Scrolls horizontally below 840px."
    >
      <div className="-mx-6 -mt-6 md:-mx-8 md:-mt-8">
        <DeploymentsTable className="rounded-b-none border-b border-outline-variant" />
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-title-md">2 variants</div>
          <div className="text-body-sm text-on-surface-variant">Dense · expandable row · refreshing · error row</div>
        </div>
        <Variants cols="xl:grid-cols-2">
          <Variant n={1} label="Dense · expandable row" className="min-h-24 overflow-x-auto rounded-lg bg-surface p-2">
            <ExpandableTable />
          </Variant>
          <Variant n={2} label="Refreshing · error row" className="min-w-0">
            <RefreshingTable />
          </Variant>
        </Variants>
      </div>
    </Section>
  )
}
