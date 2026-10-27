import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ROWS = [
  ["checkout-api", "4.2.0", "142 ms"],
  ["ledger", "2.9.1", "238 ms"],
  ["auth", "7.0.3", "61 ms"],
]

function Example({ variant }: { variant: "striped" | "grid" | "cards" }) {
  return (
    <div className="min-w-0">
      <Table variant={variant}>
        <TableCaption className="text-title-sm capitalize">{variant}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Version</TableHead>
            <TableHead align="end">p95</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map(([service, version, p95]) => (
            <TableRow key={service}>
              <TableCell>{service}</TableCell>
              <TableCell muted>{version}</TableCell>
              <TableCell numeric>{p95}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function TableVariants() {
  return (
    <div className="grid w-full gap-6 lg:grid-cols-3">
      <Example variant="striped" />
      <Example variant="grid" />
      <Example variant="cards" />
    </div>
  )
}
