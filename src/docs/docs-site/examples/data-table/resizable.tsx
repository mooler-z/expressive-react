import { DataTable, DataTableBody, DataTableCell, DataTableColumn, DataTableHeader, DataTableRow } from "@/components/ui/data-table"

const FILES = [
  { id: "1", name: "Q4 roadmap — final final v3.pdf", owner: "Ana Ruiz", size: "2.4 MB" },
  { id: "2", name: "tokens.json", owner: "Kenji Sato", size: "18 KB" },
  { id: "3", name: "Launch keynote recording.mp4", owner: "Maya Lindqvist", size: "1.2 GB" },
]

export default function ResizableDataTable() {
  return (
    <DataTable aria-label="Files" resizable containerClassName="max-w-2xl">
      <DataTableHeader>
        <DataTableColumn id="name" isRowHeader defaultWidth={260} minWidth={120}>Name</DataTableColumn>
        <DataTableColumn id="owner" defaultWidth={160} minWidth={100}>Owner</DataTableColumn>
        <DataTableColumn id="size" minWidth={80} align="end">Size</DataTableColumn>
      </DataTableHeader>
      <DataTableBody items={FILES}>
        {(f) => (
          <DataTableRow id={f.id}>
            <DataTableCell className="truncate">{f.name}</DataTableCell>
            <DataTableCell className="truncate" muted>{f.owner}</DataTableCell>
            <DataTableCell numeric>{f.size}</DataTableCell>
          </DataTableRow>
        )}
      </DataTableBody>
    </DataTable>
  )
}
