"use client"

import * as React from "react"
import { Link } from "react-aria-components"

import { SplitButton, SplitButtonAction, SplitButtonMenu } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { MenuItem } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { OrdersDailyChart } from "./admin-charts"
import { useAdmin } from "./admin-context"
import { DATA, money, type Order, type Status } from "./admin-data"
import { Card, CardHead, PageHeader, Pager, StatusPill } from "./admin-ui"
import { SearchInput } from "./admin-users"

type Tab = "All" | "Paid" | "Pending" | "Overdue" | "Refunded"
type SortKey = "id" | "customer" | "plan" | "date" | "amount" | "status" | "method"
const TABS: Tab[] = ["All", "Paid", "Pending", "Overdue", "Refunded"]
const COLUMNS: [SortKey, string][] = [
  ["id", "Order"],
  ["customer", "Customer"],
  ["plan", "Plan"],
  ["date", "Date"],
  ["amount", "Amount"],
  ["status", "Status"],
  ["method", "Method"],
]
const PER = 10
const GRID = "grid-cols-[110px_minmax(180px,1.4fr)_minmax(160px,1.2fr)_110px_120px_120px_minmax(130px,1fr)_40px]"

export function AdminOrders() {
  const { query, setQuery, href } = useAdmin()
  const [tab, setTab] = React.useState<Tab>("All")
  const [sort, setSort] = React.useState<{ k: SortKey; d: "asc" | "desc" }>({ k: "date", d: "desc" })
  const [page, setPage] = React.useState(0)
  const [open, setOpen] = React.useState<number | null>(null)
  const [refunded, setRefunded] = React.useState<Record<number, boolean>>({})

  const orders: Order[] = DATA.orders.map((o) => ({ ...o, status: refunded[o.i] ? ("Refunded" as Status) : o.status }))
  const q = query.trim().toLowerCase()
  const searched = orders.filter((o) => !q || (o.id + " " + o.customer + " " + o.plan).toLowerCase().includes(q))
  const filtered = searched.filter((o) => tab === "All" || o.status === tab)
  const key = ({ date: "ts" } as Record<string, keyof Order>)[sort.k] ?? (sort.k as keyof Order)
  const dir = sort.d === "asc" ? 1 : -1
  filtered.sort((a, b) => {
    const x = a[key]
    const y = b[key]
    return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * dir
  })
  const pages = Math.max(1, Math.ceil(filtered.length / PER))
  const p = Math.min(page, pages - 1)
  const oct = orders.filter((o) => o.month === 9)
  const paidOct = oct.filter((o) => o.status === "Paid")
  const sumPaid = paidOct.reduce((a, o) => a + o.amount, 0)
  const overdue = orders.filter((o) => o.status === "Overdue")

  const stats = [
    ["Revenue · October", "$" + (sumPaid / 1e6).toFixed(2) + "M", "payments", "bg-primary-container text-on-primary-container"],
    ["Orders · October", String(oct.length), "receipt_long", "bg-tertiary-container text-on-tertiary-container"],
    ["Average order", money(sumPaid / Math.max(1, paidOct.length)), "functions", "bg-secondary-container text-on-secondary-container"],
    ["Overdue", money(overdue.reduce((a, o) => a + o.amount, 0)) + " · " + overdue.length, "schedule", "bg-error-container text-on-error-container"],
  ]

  return (
    <div data-page>
      <PageHeader
        title="Orders"
        description="Subscriptions, add-ons and services billed through Kestrel."
        actions={
          <>
            <SplitButton variant="outlined">
              <SplitButtonAction onPress={() => snackbar("Exporting orders.csv")}>
                <Icon size={20}>download</Icon>
                Export
              </SplitButtonAction>
              <SplitButtonMenu aria-label="Export options" onAction={(k) => snackbar(String(k))}>
                <MenuItem id="Exporting orders.csv">CSV</MenuItem>
                <MenuItem id="Exporting orders.xlsx">Excel</MenuItem>
                <MenuItem id="Building PDF report…">PDF report</MenuItem>
              </SplitButtonMenu>
            </SplitButton>
            <button
              className="state-layer inline-flex h-10 items-center gap-2 rounded-full bg-primary pr-5 pl-4 text-label-lg text-on-primary shape-morph active:rounded-md"
              onClick={() => snackbar("Draft order KS-10483 created", { action: { label: "Open", onAction: () => {} } })}
            >
              <Icon size={20}>add</Icon>
              New order
            </button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, icon, box]) => (
          <div key={label} className="flex items-center gap-4 rounded-xl bg-surface-container-low p-5">
            <span className={cn("grid size-12 shrink-0 place-items-center rounded-lg", box)}>
              <Icon>{icon}</Icon>
            </span>
            <div className="min-w-0">
              <div className="text-body-md text-on-surface-variant">{label}</div>
              <div className="text-title-lg font-medium tabular-nums">{value}</div>
            </div>
          </div>
        ))}
      </div>
      <Card className="mt-4">
        <CardHead title="Orders per day" description="Last 30 days · today highlighted" />
        <div className="relative mt-3 h-48">
          <OrdersDailyChart />
        </div>
      </Card>

      <div className="mt-4 overflow-hidden rounded-xl bg-surface-container-low">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <SearchInput placeholder="Search order, customer or plan" value={query} onChange={(v) => (setQuery(v), setPage(0))} />
        </div>
        <div role="tablist" aria-label="Order status" className="relative no-scrollbar flex overflow-x-auto border-b border-outline-variant text-title-sm">
          {TABS.map((t) => {
            const on = tab === t
            return (
              <button
                key={t}
                role="tab"
                aria-selected={on}
                onClick={() => (setTab(t), setPage(0), setOpen(null))}
                className={cn("state-layer relative flex shrink-0 items-center gap-2 px-5 py-3 transition-colors", on ? "text-primary" : "text-on-surface-variant")}
              >
                {t}
                <span className={cn("rounded-full px-1.5 text-label-sm", on ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant")}>
                  {searched.filter((o) => t === "All" || o.status === t).length}
                </span>
                <span className={cn("absolute inset-x-0 bottom-0 h-0.5 rounded-t-full bg-primary transition-opacity", on ? "opacity-100" : "opacity-0")} />
              </button>
            )
          })}
        </div>
        <div className="relative overflow-x-auto">
          <div className="min-w-[960px]">
            <div className={cn("grid items-center gap-3 border-b border-outline-variant px-4 py-1 text-label-md text-on-surface-variant", GRID)}>
              {COLUMNS.map(([k, label]) => {
                const on = sort.k === k
                return (
                  <button
                    key={k}
                    aria-sort={on ? (sort.d === "asc" ? "ascending" : "descending") : undefined}
                    onClick={() => (setSort((s) => ({ k, d: s.k === k && s.d === "desc" ? "asc" : "desc" })), setPage(0))}
                    className={cn("state-layer inline-flex h-9 items-center gap-1 rounded-full px-2", k === "amount" ? "justify-self-end" : "justify-self-start")}
                  >
                    {label}
                    <Icon size={18} className={cn("transition-all", on ? "text-primary opacity-100" : "opacity-0")}>
                      {on && sort.d === "asc" ? "arrow_upward" : "arrow_downward"}
                    </Icon>
                  </button>
                )
              })}
              <span />
            </div>
            {filtered.slice(p * PER, p * PER + PER).map((o) => {
              const isOpen = open === o.i
              const net = Math.round(o.amount / 1.08)
              return (
                <div key={o.i} className="border-b border-outline-variant/60">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : o.i)}
                    onKeyDown={(e) => e.key === "Enter" && setOpen(isOpen ? null : o.i)}
                    className={cn("state-layer focus-ring grid cursor-pointer items-center gap-3 px-4 py-3 text-body-md text-on-surface", GRID)}
                  >
                    <span className="px-2 font-mono text-body-sm">{o.id}</span>
                    <span className="flex min-w-0 items-center gap-3 px-2">
                      <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-label-md", o.avatarCls)}>{o.initials}</span>
                      <span className="truncate font-medium">{o.customer}</span>
                    </span>
                    <span className="truncate px-2 text-on-surface-variant">{o.plan}</span>
                    <span className="px-2 whitespace-nowrap text-on-surface-variant">{o.date}</span>
                    <span className="px-2 text-right tabular-nums">{money(o.amount)}</span>
                    <span className="px-2">
                      <StatusPill status={o.status} />
                    </span>
                    <span className="truncate px-2 text-on-surface-variant">{o.method}</span>
                    <Icon className={cn("text-on-surface-variant transition-transform duration-300 ease-emphasized", isOpen && "rotate-180")}>expand_more</Icon>
                  </div>
                  {isOpen && (
                    <div className="grid animate-fade-up gap-4 bg-surface px-6 py-4 md:grid-cols-[1fr_260px]">
                      <div>
                        <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Line items</div>
                        <ul className="mt-2 divide-y divide-outline-variant text-body-md">
                          {[
                            [o.plan, money(net)],
                            ["Tax (8%)", money(o.amount - net)],
                            ["Total", money(o.amount)],
                          ].map(([label, amount]) => (
                            <li key={label} className="flex justify-between gap-4 py-2">
                              <span>{label}</span>
                              <span className="tabular-nums">{amount}</span>
                            </li>
                          ))}
                        </ul>
                        <Link href={href("order", o.id)} className="mt-3 inline-flex items-center gap-1 text-label-lg text-primary outline-none data-focus-visible:underline">
                          Open order
                          <Icon size={18}>arrow_forward</Icon>
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Actions</div>
                        <button
                          className="state-layer flex h-10 w-full items-center justify-center gap-2 rounded-full bg-secondary-container text-label-lg text-on-secondary-container"
                          onClick={() => snackbar("Invoice PDF downloaded")}
                        >
                          <Icon size={20}>picture_as_pdf</Icon>
                          Download invoice
                        </button>
                        <button
                          className="state-layer flex h-10 w-full items-center justify-center gap-2 rounded-full border border-outline-variant text-label-lg text-on-surface-variant"
                          onClick={() => snackbar("Reminder sent to billing contact")}
                        >
                          <Icon size={20}>send</Icon>
                          Send reminder
                        </button>
                        <button
                          className="state-layer flex h-10 w-full items-center justify-center gap-2 rounded-full text-label-lg text-error"
                          onClick={() => {
                            setRefunded((r) => ({ ...r, [o.i]: true }))
                            snackbar(`${o.id} refunded · ${money(o.amount)}`, { action: { label: "Undo", onAction: () => setRefunded((r) => ({ ...r, [o.i]: false })) } })
                          }}
                        >
                          <Icon size={20}>undo</Icon>
                          Refund
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {filtered.length === 0 && <div className="px-6 py-14 text-center text-body-md text-on-surface-variant">No orders match this filter.</div>}
          </div>
        </div>
        <div className="border-t border-outline-variant">
          <Pager
            start={p * PER + 1}
            end={Math.min(filtered.length, (p + 1) * PER)}
            total={filtered.length}
            onPrev={() => (setPage(Math.max(0, p - 1)), setOpen(null))}
            onNext={() => (setPage(Math.min(pages - 1, p + 1)), setOpen(null))}
          />
        </div>
      </div>
    </div>
  )
}
