import { useState } from "react"
import type { Selection } from "react-aria-components"

import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTableCell,
  DataTableColumn,
  DataTableHeader,
  DataTablePagination,
  DataTableRow,
  DataTableRowActions,
  DataTableSearch,
  DataTableToolbar,
  useDataTable,
} from "@/components/ui/data-table"
import { MenuItem, MenuSeparator } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

const ROWS = [
  { id: "1", service: "checkout-api", status: "Healthy", region: "eu-west", p95: 142 },
  { id: "2", service: "ledger", status: "Rolling", region: "us-east", p95: 238 },
  { id: "3", service: "auth", status: "Healthy", region: "us-east", p95: 61 },
  { id: "4", service: "search", status: "Healthy", region: "ap-south", p95: 118 },
  { id: "5", service: "notifications", status: "Failed", region: "eu-west", p95: 1290 },
  { id: "6", service: "media", status: "Healthy", region: "us-west", p95: 204 },
  { id: "7", service: "billing", status: "Healthy", region: "eu-west", p95: 97 },
  { id: "8", service: "gateway", status: "Rolling", region: "us-west", p95: 33 },
]

export default function DataTableDemo() {
  const [selected, setSelected] = useState<Selection>(new Set())
  const dt = useDataTable(ROWS, { pageSize: 5, initialSort: { column: "service", direction: "ascending" } })
  const count = selected === "all" ? ROWS.length : selected.size

  return (
    <DataTableCard className="w-full">
      <DataTableToolbar>
        <DataTableSearch aria-label="Search services" placeholder="Search services" {...dt.searchProps} />
      </DataTableToolbar>
      <DataTable aria-label="Deployments" selectionMode="multiple" selectedKeys={selected} onSelectionChange={setSelected} {...dt.tableProps}>
        <DataTableHeader>
          <DataTableColumn id="service" isRowHeader allowsSorting>Service</DataTableColumn>
          <DataTableColumn id="status" allowsSorting>Status</DataTableColumn>
          <DataTableColumn id="region" allowsSorting>Region</DataTableColumn>
          <DataTableColumn id="p95" allowsSorting align="end">p95</DataTableColumn>
          <DataTableColumn id="actions" width={64}>
            <span className="sr-only">Actions</span>
          </DataTableColumn>
        </DataTableHeader>
        <DataTableBody items={dt.items}>
          {(row) => (
            <DataTableRow id={row.id}>
              <DataTableCell className="font-medium whitespace-nowrap">{row.service}</DataTableCell>
              <DataTableCell className={row.status === "Failed" ? "text-error" : undefined}>{row.status}</DataTableCell>
              <DataTableCell muted>{row.region}</DataTableCell>
              <DataTableCell numeric>{row.p95} ms</DataTableCell>
              <DataTableCell className="px-2 py-1">
                <DataTableRowActions label={`Actions for ${row.service}`} onAction={(key) => snackbar(`${String(key)} · ${row.service}`)}>
                  <MenuItem id="Logs" icon="article">View logs</MenuItem>
                  <MenuItem id="Redeploy" icon="restart_alt">Redeploy</MenuItem>
                  <MenuSeparator />
                  <MenuItem id="Delete" icon="delete">Delete</MenuItem>
                </DataTableRowActions>
              </DataTableCell>
            </DataTableRow>
          )}
        </DataTableBody>
      </DataTable>
      <DataTablePagination {...dt.paginationProps} pageSizeOptions={[5, 10]} start={`${count} of ${ROWS.length} selected`} />
    </DataTableCard>
  )
}
