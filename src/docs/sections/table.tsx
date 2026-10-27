import { StatusBadge } from "@/components/ui/badge"
import { snackbar } from "@/components/ui/snackbar"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableGroupRow,
  TableHead,
  TableHeader,
  TableRow,
  useTableSort,
} from "@/components/ui/table"
import { Section, Variant, Variants } from "@/docs/section"

const INVOICE = [
  { item: "Compute · vCPU hours", qty: 184200, unit: "$0.021", amount: 3868.2 },
  { item: "Storage · GB-month", qty: 42000, unit: "$0.023", amount: 966 },
  { item: "Egress · GB", qty: 9310, unit: "$0.05", amount: 465.5 },
  { item: "Policy engine · seats", qty: 40, unit: "$12.00", amount: 480 },
]

const SERVICES = [
  { name: "checkout-api", region: "eu-central-1", p95: "182 ms", status: "Healthy" },
  { name: "identity", region: "us-east-1", p95: "96 ms", status: "Rolling" },
  { name: "billing-sync", region: "eu-central-1", p95: "1.2 s", status: "Failed" },
  { name: "edge-cache", region: "ap-ne-1", p95: "41 ms", status: "Healthy" },
] as const

const TONE = { Healthy: "tertiary", Rolling: "secondary", Failed: "error" } as const
const DOT = { Healthy: "bg-tertiary", Rolling: "bg-secondary", Failed: "bg-error" } as const

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })

function Status({ s }: { s: keyof typeof TONE }) {
  return (
    <StatusBadge size="md" variant={TONE[s]}>
      {s}
    </StatusBadge>
  )
}

function ServiceHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Service</TableHead>
        <TableHead>Region</TableHead>
        <TableHead>p95</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
  )
}

export default function TableSection() {
  const { sorted, headProps } = useTableSort(INVOICE, { qty: (r) => r.qty, amount: (r) => r.amount })
  return (
    <Section
      id="table"
      description="Plain content tables: caption, label-large headers, outline-variant row dividers, tabular numerals and a totals footer. Sort by quantity or amount."
    >
      <Table className="min-w-[560px]">
        <TableCaption>Invoice #KS-2026-0417 · October usage</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead {...headProps("qty")}>Quantity</TableHead>
            <TableHead align="end">Unit</TableHead>
            <TableHead align="end" {...headProps("amount")}>
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow key={r.item}>
              <TableCell>{r.item}</TableCell>
              <TableCell numeric align="start" muted>
                {r.qty.toLocaleString()}
              </TableCell>
              <TableCell numeric muted>
                {r.unit}
              </TableCell>
              <TableCell numeric>{usd(r.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total due Nov 15</TableCell>
            <TableCell numeric>{usd(INVOICE.reduce((s, r) => s + r.amount, 0))}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-title-md">5 variants</div>
          <div className="text-body-sm text-on-surface-variant">Striped · dense · bordered grid · card rows · grouped with totals</div>
        </div>
        <Variants cols="xl:grid-cols-2 2xl:grid-cols-3">
          <Variant n={1} label="Striped" className="min-w-0">
            <Table variant="striped" className="min-w-[420px]">
              <ServiceHead />
              <TableBody>
                {SERVICES.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell muted>{s.region}</TableCell>
                    <TableCell className="tabular-nums">{s.p95}</TableCell>
                    <TableCell>
                      <Status s={s.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Variant>

          <Variant n={2} label="Dense" className="min-w-0">
            <Table density="dense" className="min-w-[420px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead align="end">p95</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SERVICES.map((s) => (
                  <TableRow key={s.name} className="hover:bg-on-surface/4">
                    <TableCell className="font-mono">{s.name}</TableCell>
                    <TableCell muted className="font-mono">
                      {s.region}
                    </TableCell>
                    <TableCell numeric className="font-mono">
                      {s.p95}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 text-label-sm">
                        <span className={`size-1.5 rounded-full ${DOT[s.status]}`} />
                        {s.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Variant>

          <Variant n={3} label="Bordered grid" className="min-w-0">
            <Table variant="grid" className="min-w-[420px]">
              <ServiceHead />
              <TableBody>
                {SERVICES.map((s) => (
                  <TableRow key={s.name}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.region}</TableCell>
                    <TableCell className="tabular-nums">{s.p95}</TableCell>
                    <TableCell>
                      <Status s={s.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Variant>

          <Variant n={4} label="Card rows" className="min-w-0">
            <Table variant="cards" className="min-w-[420px]">
              <ServiceHead />
              <TableBody>
                {SERVICES.map((s) => (
                  <TableRow
                    key={s.name}
                    tabIndex={0}
                    className="cursor-pointer outline-none [&:focus-visible>td]:bg-surface-container-high"
                    onClick={() => snackbar(`Opening ${s.name}`)}
                    onKeyDown={(e) => e.key === "Enter" && snackbar(`Opening ${s.name}`)}
                  >
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell muted>{s.region}</TableCell>
                    <TableCell className="tabular-nums">{s.p95}</TableCell>
                    <TableCell>
                      <Status s={s.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Variant>

          <Variant n={5} label="Grouped + totals" className="min-w-0">
            <Table className="min-w-[420px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead align="end">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableGroupRow colSpan={3}>Compute</TableGroupRow>
                <TableRow>
                  <TableCell>vCPU hours</TableCell>
                  <TableCell muted className="tabular-nums">
                    184k
                  </TableCell>
                  <TableCell numeric>$3,868</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>GPU hours</TableCell>
                  <TableCell muted className="tabular-nums">
                    1.2k
                  </TableCell>
                  <TableCell numeric>$2,140</TableCell>
                </TableRow>
                <TableGroupRow colSpan={3}>Storage</TableGroupRow>
                <TableRow>
                  <TableCell>GB-month</TableCell>
                  <TableCell muted className="tabular-nums">
                    42k
                  </TableCell>
                  <TableCell numeric>$966</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Snapshots</TableCell>
                  <TableCell muted className="tabular-nums">
                    310
                  </TableCell>
                  <TableCell numeric>$62</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell numeric>$7,036</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </Variant>
        </Variants>
      </div>
    </Section>
  )
}
