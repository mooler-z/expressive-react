import { useState } from "react"

import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTableCell,
  DataTableColumn,
  DataTableHeader,
  DataTableProgress,
  DataTableRow,
  DataTableToolbar,
} from "@/components/ui/data-table"
import { Switch } from "@/components/ui/switch"

const JOBS = [
  { id: "1", job: "nightly-backup", last: "02:00", duration: "4m 12s" },
  { id: "2", job: "reindex-search", last: "03:30", duration: "11m 48s" },
  { id: "3", job: "rotate-keys", last: "Sun 04:00", duration: "38s" },
]

export default function LoadingDataTable() {
  const [loading, setLoading] = useState(true)

  return (
    <DataTableCard className="w-full max-w-xl">
      <DataTableToolbar className="py-2">
        <span className="text-title-sm">Scheduled jobs</span>
        <Switch isSelected={loading} onChange={setLoading} className="ml-auto text-body-md">
          Refreshing
        </Switch>
      </DataTableToolbar>
      <DataTableProgress isLoading={loading} />
      <DataTable aria-label="Scheduled jobs" density="dense" isLoading={loading}>
        <DataTableHeader>
          <DataTableColumn id="job" isRowHeader>Job</DataTableColumn>
          <DataTableColumn id="last">Last run</DataTableColumn>
          <DataTableColumn id="duration" align="end">Duration</DataTableColumn>
        </DataTableHeader>
        <DataTableBody items={JOBS}>
          {(j) => (
            <DataTableRow id={j.id}>
              <DataTableCell className="font-mono">{j.job}</DataTableCell>
              <DataTableCell muted>{j.last}</DataTableCell>
              <DataTableCell numeric>{j.duration}</DataTableCell>
            </DataTableRow>
          )}
        </DataTableBody>
      </DataTable>
    </DataTableCard>
  )
}
