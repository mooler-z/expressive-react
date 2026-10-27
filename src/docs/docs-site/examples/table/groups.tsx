import { Table, TableBody, TableCell, TableGroupRow, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const GROUPS = [
  { name: "Compute", rows: [["web", "4 × 2 vCPU", "$121.00"], ["workers", "2 × 4 vCPU", "$96.00"]] },
  { name: "Storage", rows: [["postgres", "250 GB SSD", "$25.00"], ["objects", "1.2 TB", "$27.60"]] },
]

export default function GroupedTable() {
  return (
    <Table variant="grid" containerClassName="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>Resource</TableHead>
          <TableHead>Size</TableHead>
          <TableHead align="end">Monthly</TableHead>
        </TableRow>
      </TableHeader>
      {GROUPS.map((group) => (
        <TableBody key={group.name}>
          <TableGroupRow colSpan={3}>{group.name}</TableGroupRow>
          {group.rows.map(([name, size, cost]) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell muted>{size}</TableCell>
              <TableCell numeric>{cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      ))}
    </Table>
  )
}
