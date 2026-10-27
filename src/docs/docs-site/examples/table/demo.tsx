import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const LINES = [
  { item: "Compute · 2 vCPU", qty: 720, unit: 0.042 },
  { item: "Storage · SSD (GB)", qty: 250, unit: 0.1 },
  { item: "Egress (GB)", qty: 1200, unit: 0.05 },
]

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })

export default function TableDemo() {
  const total = LINES.reduce((sum, l) => sum + l.qty * l.unit, 0)

  return (
    <Table containerClassName="max-w-xl">
      <TableCaption>Invoice INV-2041 · October</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead align="end">Qty</TableHead>
          <TableHead align="end">Unit</TableHead>
          <TableHead align="end">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {LINES.map((l) => (
          <TableRow key={l.item}>
            <TableCell>{l.item}</TableCell>
            <TableCell numeric>{l.qty.toLocaleString()}</TableCell>
            <TableCell numeric muted>{usd(l.unit)}</TableCell>
            <TableCell numeric>{usd(l.qty * l.unit)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell numeric>{usd(total)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
