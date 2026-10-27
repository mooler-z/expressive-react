"use client"

import * as React from "react"
import { Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogIcon, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { ChatComposer } from "@/components/ui/message-scroller"
import { Select, SelectItem } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

import { AsyncButton, Panel, TonePill, notify } from "./admin-actions"
import { useAdmin } from "./admin-context"
import { PageHeader } from "./admin-ui"

const STEPS: { label: string; meta: string; done: boolean }[] = [
  { label: "Placed", meta: "Oct 18 · 09:12", done: true },
  { label: "Paid", meta: "Oct 18 · 09:14", done: true },
  { label: "Provisioned", meta: "Oct 19 · 11:40", done: true },
  { label: "Active", meta: "Pending go-live", done: false },
]

const LINES: { item: string; detail: string; unit: string; amount: string }[] = [
  { item: "Kestrel Grid · Business", detail: "1,240 workloads × 12 mo", unit: "$23.00", amount: "$342,240" },
  { item: "Policy engine seats", detail: "40 seats", unit: "$12.00", amount: "$5,760" },
  { item: "Premium support", detail: "Annual", unit: "—", amount: "$18,000" },
  { item: "Onboarding package", detail: "One-time", unit: "—", amount: "$6,500" },
]

const TOTALS: [string, string][] = [
  ["Subtotal", "$372,500"],
  ["Discount (annual)", "−$37,250"],
  ["Tax", "$0.00"],
]

type Activity = { icon: string; text: string; meta: string }

const INITIAL_ACTIVITY: Activity[] = [
  { icon: "cloud_done", text: "Provisioning finished in 3 regions", meta: "Oct 19 · 11:40" },
  { icon: "credit_card", text: "Payment captured · Visa •••• 4242", meta: "Oct 18 · 09:14" },
  { icon: "shopping_cart", text: "Order placed by Priya Nair", meta: "Oct 18 · 09:12" },
]

const REASONS = ["Requested by customer", "Duplicate", "Service issue", "Other"]

export function AdminOrder() {
  const { href, id } = useAdmin()
  const orderId = id ?? "KS-10471"
  const [activity, setActivity] = React.useState(INITIAL_ACTIVITY)

  return (
    <div>
      <Link
        href={href("orders")}
        className="state-layer focus-ring mb-3 -ml-2 inline-flex h-10 items-center gap-1 rounded-full pr-4 pl-2 text-label-lg text-primary outline-none"
      >
        <Icon size={20}>arrow_back</Icon>
        Orders
      </Link>

      <PageHeader
        title={`Order ${orderId}`}
        description="Placed Oct 18, 2026 · Halide Bank · annual contract"
        actions={
          <>
            <Button variant="outlined" onPress={() => notify("Receipt sent to billing@halide.example")}>
              <Icon>forward_to_inbox</Icon>
              Resend receipt
            </Button>
            <AsyncButton variant="outlined" icon="download" busy="Preparing…" done="Downloaded">
              Invoice PDF
            </AsyncButton>
            <RefundDialog orderId={orderId} />
          </>
        }
      />

      <div className="rounded-xl bg-surface-container-low p-5">
        <ol className="grid gap-4 sm:grid-cols-4" aria-label="Order progress">
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex items-center gap-3 sm:flex-col sm:items-start" aria-current={!s.done && STEPS[i - 1]?.done ? "step" : undefined}>
              <span className="flex w-full items-center gap-2">
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full",
                    s.done ? "bg-primary text-on-primary" : "border-2 border-outline-variant text-on-surface-variant",
                  )}
                >
                  {s.done ? <Icon size={18} weight={700}>check</Icon> : <span className="text-label-md">{i + 1}</span>}
                </span>
                {s.done && <span className="hidden h-0.5 flex-1 rounded-full bg-primary sm:block" />}
              </span>
              <span>
                <span className="block text-title-sm">{s.label}</span>
                <span className="block text-body-sm text-on-surface-variant">{s.meta}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 space-y-4 xl:col-span-2">
          <Panel title="Line items" description={`${LINES.length} items`}>
            <Table aria-label="Line items" className="min-w-[480px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead align="end">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LINES.map((l) => (
                  <TableRow key={l.item}>
                    <TableCell>
                      <div className="font-medium">{l.item}</div>
                      <div className="text-body-sm text-on-surface-variant">{l.detail}</div>
                    </TableCell>
                    <TableCell muted className="tabular-nums">
                      {l.unit}
                    </TableCell>
                    <TableCell numeric>{l.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <dl className="mt-4 ml-auto max-w-xs space-y-1.5 text-body-md">
              {TOTALS.map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-on-surface-variant">{k}</dt>
                  <dd className="tabular-nums">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between border-t border-outline-variant pt-2 text-title-md">
                <dt>Total</dt>
                <dd className="tabular-nums">$335,250</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Order activity">
            <ol className="space-y-3">
              {activity.map((a, i) => (
                <li key={`${a.text}-${i}`} className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary-container text-on-secondary-container">
                    <Icon size={20}>{a.icon}</Icon>
                  </span>
                  <div>
                    <div className="text-body-md">{a.text}</div>
                    <div className="text-body-sm text-on-surface-variant">{a.meta}</div>
                  </div>
                </li>
              ))}
            </ol>
            <ChatComposer
              className="mt-4"
              aria-label="Internal note"
              placeholder="Add an internal note"
              onSend={(text) => {
                setActivity((list) => [{ icon: "sticky_note_2", text, meta: "Just now · you" }, ...list])
                notify("Note added")
              }}
            />
          </Panel>
        </div>

        <div className="min-w-0 space-y-4">
          <Panel title="Customer">
            <Link href={href("customer", "0")} className="state-layer focus-ring -m-2 flex items-center gap-3 rounded-lg p-2 text-on-surface outline-none">
              <span className="grid size-11 place-items-center rounded-md bg-primary text-label-lg text-on-primary">HB</span>
              <div className="min-w-0 flex-1">
                <div className="text-title-sm">Halide Bank</div>
                <div className="text-body-sm text-on-surface-variant">Enterprise · EU</div>
              </div>
              <Icon className="text-on-surface-variant">chevron_right</Icon>
            </Link>
            <dl className="mt-3 space-y-2 text-body-sm">
              <div className="flex gap-2">
                <dt className="w-20 text-on-surface-variant">Contact</dt>
                <dd>Priya Nair</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-20 text-on-surface-variant">Email</dt>
                <dd className="truncate">priya@halide.example</dd>
              </div>
            </dl>
          </Panel>

          <Panel title="Payment">
            <div className="flex items-center justify-between gap-2">
              <TonePill tone="tertiary">Captured</TonePill>
              <span className="text-title-md tabular-nums">$335,250</span>
            </div>
            <dl className="mt-3 space-y-2 text-body-sm">
              {[
                ["Method", "Visa •••• 4242", ""],
                ["Terms", "Annual, prepaid", ""],
                ["Reference", "pi_3PZ…91c4", "font-mono"],
              ].map(([k, v, cls]) => (
                <div key={k} className="flex gap-2">
                  <dt className="w-20 text-on-surface-variant">{k}</dt>
                  <dd className={cls}>{v}</dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title="Provisioning">
            <ul className="space-y-2 text-body-md">
              {["eu-central-1", "eu-north-1", "us-east-1"].map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <Icon size={20} filled className="text-tertiary">
                    check_circle
                  </Icon>
                  <span className="font-mono text-body-sm">{r}</span>
                  <span className="ml-auto text-body-sm text-on-surface-variant">ready</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}

function RefundDialog({ orderId }: { orderId: string }) {
  const [amount, setAmount] = React.useState("335,250")
  const [reason, setReason] = React.useState<string>(REASONS[0])
  return (
    <DialogTrigger>
      <Button variant="tonal">
        <Icon>undo</Icon>
        Refund
      </Button>
      <Dialog modalClassName="max-w-md">
        <DialogIcon>undo</DialogIcon>
        <DialogHeadline>Refund order?</DialogHeadline>
        <DialogBody>
          <p>Refund part or all of {orderId}. Provisioned capacity is released at the end of the billing period.</p>
          <div className="mt-4 grid gap-4">
            <TextField label="Amount (USD)" value={amount} onChange={setAmount} inputMode="decimal" />
            <Select label="Reason" selectedKey={reason} onSelectionChange={(k) => k != null && setReason(String(k))}>
              {REASONS.map((r) => (
                <SelectItem key={r} id={r}>
                  {r}
                </SelectItem>
              ))}
            </Select>
          </div>
        </DialogBody>
        <DialogActions>
          <Button variant="text" slot="close">
            Cancel
          </Button>
          <Button
            slot="close"
            className="bg-error text-on-error"
            onPress={() => notify(`Refund issued · $${amount} · ${reason}`, "Undo", () => notify("Refund cancelled"))}
          >
            Refund
          </Button>
        </DialogActions>
      </Dialog>
    </DialogTrigger>
  )
}
