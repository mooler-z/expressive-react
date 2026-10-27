import { Button } from "@/components/ui/button"
import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTableCell,
  DataTableColumn,
  DataTableEmpty,
  DataTableHeader,
  DataTableRow,
  DataTableSearch,
  DataTableToolbar,
  useDataTable,
} from "@/components/ui/data-table"

const INVOICES = [
  { id: "INV-2041", customer: "Kestrel Ops", amount: 1240 },
  { id: "INV-2042", customer: "Northwind", amount: 380 },
  { id: "INV-2043", customer: "Globex", amount: 2975 },
]

export default function EmptyDataTable() {
  const dt = useDataTable(INVOICES, { search: (row, q) => row.customer.toLowerCase().includes(q) || row.id.toLowerCase().includes(q) })

  return (
    <DataTableCard className="w-full max-w-xl">
      <DataTableToolbar>
        <DataTableSearch aria-label="Search invoices" placeholder="Try “acme”" {...dt.searchProps} />
      </DataTableToolbar>
      <DataTable aria-label="Invoices">
        <DataTableHeader>
          <DataTableColumn id="id" isRowHeader>Invoice</DataTableColumn>
          <DataTableColumn id="customer">Customer</DataTableColumn>
          <DataTableColumn id="amount" align="end">Amount</DataTableColumn>
        </DataTableHeader>
        <DataTableBody
          items={dt.items}
          renderEmptyState={() => (
            <DataTableEmpty icon="receipt_long" title={`No invoices match “${dt.query}”`}>
              <Button variant="text" onPress={() => dt.setQuery("")}>
                Clear search
              </Button>
            </DataTableEmpty>
          )}
        >
          {(row) => (
            <DataTableRow id={row.id}>
              <DataTableCell className="font-mono">{row.id}</DataTableCell>
              <DataTableCell>{row.customer}</DataTableCell>
              <DataTableCell numeric>${row.amount.toLocaleString()}</DataTableCell>
            </DataTableRow>
          )}
        </DataTableBody>
      </DataTable>
    </DataTableCard>
  )
}
