"use client"

import * as React from "react"
import type { Selection } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTableCell,
  DataTableColumn,
  DataTableEmpty,
  DataTableHeader,
  DataTableRow,
  DataTableRowActions,
  DataTableToolbar,
  useDataTable,
} from "@/components/ui/data-table"
import { Icon } from "@/components/ui/icon"
import { MenuItem, MenuSeparator } from "@/components/ui/menu"

import { StatTile, TonePill, notify, type Tone } from "./admin-actions"
import { PageHeader } from "./admin-ui"

type InvoiceStatus = "Draft" | "Sent" | "Overdue" | "Paid"
type Invoice = { id: string; customer: string; issued: string; due: string; amount: number; status: InvoiceStatus; issuedTs: number }

const STATUS_TONE: Record<InvoiceStatus, Tone> = { Draft: "neutral", Sent: "secondary", Overdue: "error", Paid: "tertiary" }
const FILTERS = ["All", "Draft", "Sent", "Overdue", "Paid"] as const
type Filter = (typeof FILTERS)[number]

const INVOICES: Invoice[] = [
  { id: "INV-0424", customer: "Halide Bank", issued: "Oct 24", due: "Nov 23", amount: 48210, status: "Sent", issuedTs: 24 },
  { id: "INV-0423", customer: "Meridian Health", issued: "Oct 22", due: "Nov 21", amount: 31900, status: "Sent", issuedTs: 22 },
  { id: "INV-0421", customer: "Northwind", issued: "Oct 15", due: "Oct 25", amount: 22480, status: "Overdue", issuedTs: 15 },
  { id: "INV-0420", customer: "Cobalt Insurance", issued: "Oct 12", due: "Oct 22", amount: 9870, status: "Overdue", issuedTs: 12 },
  { id: "INV-0419", customer: "Quorum Energy", issued: "Oct 10", due: "Nov 9", amount: 18050, status: "Paid", issuedTs: 10 },
  { id: "INV-0418", customer: "Tessera Logistics", issued: "Oct 8", due: "Nov 7", amount: 14300, status: "Paid", issuedTs: 8 },
  { id: "INV-0425", customer: "Lattice Labs", issued: "—", due: "—", amount: 6200, status: "Draft", issuedTs: 99 },
  { id: "INV-0426", customer: "Fjord Media", issued: "—", due: "—", amount: 480, status: "Draft", issuedTs: 99 },
]

const money = (n: number) => "$" + n.toLocaleString("en-US")

export function AdminInvoices() {
  const [filter, setFilter] = React.useState<Filter>("All")
  const [voided, setVoided] = React.useState<Set<string>>(new Set())
  const [selected, setSelected] = React.useState<Selection>(new Set())

  const visible = React.useMemo(() => INVOICES.filter((i) => !voided.has(i.id)), [voided])
  const rows = React.useMemo(() => visible.filter((i) => filter === "All" || i.status === filter), [visible, filter])
  const dt = useDataTable(rows, {
    pageSize: 10,
    sortValue: (r, c) => (c === "issued" ? r.issuedTs : (r[c as keyof Invoice] as string | number)),
  })
  const selectedCount = selected === "all" ? rows.length : [...selected].filter((k) => rows.some((r) => r.id === k)).length

  const voidInvoice = (inv: Invoice) => {
    setVoided((v) => new Set(v).add(inv.id))
    notify(`${inv.id} voided`, "Undo", () =>
      setVoided((v) => {
        const next = new Set(v)
        next.delete(inv.id)
        return next
      }),
    )
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="October 2026 · 64 invoices"
        actions={
          <>
            <Button variant="outlined" onPress={() => notify("Exporting invoices")}>
              <Icon>download</Icon>
              Export
            </Button>
            <Button onPress={() => notify("Draft INV-0427 created", "Open")}>
              <Icon>add</Icon>
              New invoice
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Outstanding" value="$80.1k" sub="2 sent invoices" icon="schedule" />
        <StatTile label="Overdue" value="$32.4k" sub="2 invoices" icon="error" className="bg-error-container text-on-error-container" subClassName="" />
        <StatTile label="Paid (30 days)" value="$412k" sub="48 invoices" icon="check_circle" />
        <StatTile label="Drafts" value="2" sub="$6.7k total" icon="draft" />
      </div>

      <DataTableCard className="mt-4">
        <DataTableToolbar>
          <ConnectedButtonGroup
            aria-label="Invoice status"
            variant="filled"
            size="sm"
            selectedKeys={[filter]}
            onSelectionChange={(keys) => {
              const k = [...keys][0] as Filter | undefined
              if (k) {
                setFilter(k)
                dt.setPage(1)
              }
            }}
          >
            {FILTERS.map((f) => (
              <ConnectedButton key={f} id={f}>
                {f}
              </ConnectedButton>
            ))}
          </ConnectedButtonGroup>
          <span className="flex-1" />
          <Button variant="tonal" onPress={() => notify("Reminders sent to 2 customers")}>
            <Icon>notifications_active</Icon>
            Send reminders
          </Button>
        </DataTableToolbar>

        <DataTable
          aria-label="Invoices"
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={setSelected}
          className="min-w-[860px]"
          {...dt.tableProps}
        >
          <DataTableHeader>
            <DataTableColumn id="id" isRowHeader allowsSorting>
              Invoice
            </DataTableColumn>
            <DataTableColumn id="customer" allowsSorting>
              Customer
            </DataTableColumn>
            <DataTableColumn id="issued" allowsSorting>
              Issued
            </DataTableColumn>
            <DataTableColumn id="due">Due</DataTableColumn>
            <DataTableColumn id="amount" allowsSorting>
              Amount
            </DataTableColumn>
            <DataTableColumn id="status">Status</DataTableColumn>
            <DataTableColumn id="actions" width={64}>
              <span className="sr-only">Actions</span>
            </DataTableColumn>
          </DataTableHeader>
          <DataTableBody items={dt.items} renderEmptyState={() => <DataTableEmpty title="No invoices match this filter" />}>
            {(inv) => (
              <DataTableRow id={inv.id}>
                <DataTableCell className="font-mono text-body-sm">{inv.id}</DataTableCell>
                <DataTableCell className="whitespace-nowrap">{inv.customer}</DataTableCell>
                <DataTableCell muted>{inv.issued}</DataTableCell>
                <DataTableCell muted={inv.status !== "Overdue"} className={inv.status === "Overdue" ? "text-error" : undefined}>
                  {inv.due}
                </DataTableCell>
                <DataTableCell className="tabular-nums">{money(inv.amount)}</DataTableCell>
                <DataTableCell>
                  <TonePill tone={STATUS_TONE[inv.status]}>{inv.status}</TonePill>
                </DataTableCell>
                <DataTableCell className="px-2 py-1">
                  <DataTableRowActions
                    label={`Actions for ${inv.id}`}
                    onAction={(key) => {
                      if (key === "void") voidInvoice(inv)
                      else notify(`${String(key)} · ${inv.id}`)
                    }}
                  >
                    <MenuItem id="View" icon="visibility">
                      View
                    </MenuItem>
                    <MenuItem id="Send" icon="send">
                      Send
                    </MenuItem>
                    <MenuItem id="Download PDF" icon="download">
                      Download PDF
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem id="void" icon="delete" className="text-error [&_[data-slot=icon]]:text-error">
                      Void invoice
                    </MenuItem>
                  </DataTableRowActions>
                </DataTableCell>
              </DataTableRow>
            )}
          </DataTableBody>
        </DataTable>

        <div className="flex items-center justify-between gap-3 border-t border-outline-variant px-4 py-3 text-body-sm text-on-surface-variant">
          <span aria-live="polite">
            {selectedCount} of {rows.length} selected
          </span>
          <span>
            {rows.length ? `1–${rows.length}` : "0"} of {rows.length === visible.length ? 64 - voided.size : rows.length}
          </span>
        </div>
      </DataTableCard>
    </div>
  )
}
