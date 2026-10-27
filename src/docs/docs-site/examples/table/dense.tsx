import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const EVENTS = [
  ["09:41:02", "deploy", "checkout-api 4.2.0 → prod-eu"],
  ["09:40:47", "scale", "ledger 3 → 5 replicas"],
  ["09:38:15", "alert", "p95 > 200 ms on ledger"],
  ["09:31:09", "deploy", "auth 7.0.3 → prod-us"],
]

export default function DenseTable() {
  return (
    <Table density="dense" containerClassName="max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Event</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {EVENTS.map(([time, type, event]) => (
          <TableRow key={time}>
            <TableCell className="font-mono" muted>{time}</TableCell>
            <TableCell>{type}</TableCell>
            <TableCell>{event}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
