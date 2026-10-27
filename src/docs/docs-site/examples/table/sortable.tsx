import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, useTableSort } from "@/components/ui/table"

const REGIONS = [
  { region: "eu-west", requests: 48210, errors: 0.12 },
  { region: "us-east", requests: 91544, errors: 0.31 },
  { region: "ap-south", requests: 22907, errors: 0.08 },
  { region: "us-west", requests: 37420, errors: 0.19 },
]

type Region = (typeof REGIONS)[number]

const SORT_BY = {
  region: (r: Region) => r.region,
  requests: (r: Region) => r.requests,
  errors: (r: Region) => r.errors,
}

const INITIAL_SORT = { column: "requests" as keyof typeof SORT_BY, direction: "descending" as const }

export default function SortableTable() {
  const { sorted, headProps } = useTableSort(REGIONS, SORT_BY, INITIAL_SORT)

  return (
    <Table containerClassName="max-w-lg">
      <TableHeader>
        <TableRow>
          <TableHead {...headProps("region")}>Region</TableHead>
          <TableHead align="end" {...headProps("requests")}>Requests</TableHead>
          <TableHead align="end" {...headProps("errors")}>Error %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((r) => (
          <TableRow key={r.region}>
            <TableCell>{r.region}</TableCell>
            <TableCell numeric>{r.requests.toLocaleString()}</TableCell>
            <TableCell numeric>{r.errors.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
