import { DataTable, DataTableBody, DataTableCell, DataTableColumn, DataTableHeader, DataTableRow, useDataTable } from "@/components/ui/data-table"

const ROWS = [
  { id: "eu-west", region: "eu-west", requests: 48210, errorRate: 0.12 },
  { id: "us-east", region: "us-east", requests: 91544, errorRate: 0.31 },
  { id: "ap-south", region: "ap-south", requests: 22907, errorRate: 0.08 },
  { id: "us-west", region: "us-west", requests: 37420, errorRate: 0.19 },
]

export default function SortingDataTable() {
  const dt = useDataTable(ROWS, { initialSort: { column: "requests", direction: "descending" } })

  return (
    <DataTable aria-label="Traffic by region" className="max-w-xl" {...dt.tableProps}>
      <DataTableHeader>
        <DataTableColumn id="region" isRowHeader allowsSorting>Region</DataTableColumn>
        <DataTableColumn id="requests" allowsSorting align="end">Requests</DataTableColumn>
        <DataTableColumn id="errorRate" allowsSorting align="end">Error %</DataTableColumn>
      </DataTableHeader>
      <DataTableBody items={dt.items}>
        {(row) => (
          <DataTableRow id={row.id}>
            <DataTableCell>{row.region}</DataTableCell>
            <DataTableCell numeric>{row.requests.toLocaleString()}</DataTableCell>
            <DataTableCell numeric>{row.errorRate.toFixed(2)}</DataTableCell>
          </DataTableRow>
        )}
      </DataTableBody>
    </DataTable>
  )
}
