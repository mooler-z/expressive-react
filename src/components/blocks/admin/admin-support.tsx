"use client"

import * as React from "react"
import { Form } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTableCell,
  DataTableColumn,
  DataTableEmpty,
  DataTableHeader,
  DataTableRow,
  DataTableToolbar,
  useDataTable,
} from "@/components/ui/data-table"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { LinearProgress } from "@/components/ui/progress"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

import { PageHeader } from "./admin-ui"

type Priority = "Urgent" | "High" | "Normal" | "Low"
type TicketStatus = "Open" | "In progress" | "Waiting"
type Tone = "primary" | "secondary" | "tertiary"

type Ticket = {
  id: string
  subject: string
  customer: string
  priority: Priority
  assignee?: { name: string; color: Tone }
  /** Share of the SLA window used, 0–100. */
  sla: number
  slaLeft: string
  status: TicketStatus
}

const ME = "Maya Lindqvist"
/** Open tickets outside this view (the table shows the most recent). */
const OPEN_BEFORE = 6

const TICKETS: Ticket[] = [
  { id: "4821", subject: "SSO login loop on Safari", customer: "Meridian Health", priority: "Urgent", assignee: { name: "Lena Ortiz", color: "primary" }, sla: 88, slaLeft: "12 min", status: "Open" },
  { id: "4820", subject: "Webhook retries exhausted", customer: "Halide Bank", priority: "High", assignee: { name: "Sam Okafor", color: "tertiary" }, sla: 60, slaLeft: "48 min", status: "In progress" },
  { id: "4818", subject: "Export stuck at 62%", customer: "Northwind", priority: "High", assignee: { name: "Ava Reyes", color: "secondary" }, sla: 45, slaLeft: "1 h 40 m", status: "In progress" },
  { id: "4815", subject: "Split invoice by cost center", customer: "Tessera Logistics", priority: "Normal", assignee: { name: "Priya Nair", color: "primary" }, sla: 20, slaLeft: "5 h", status: "Waiting" },
  { id: "4811", subject: "Feature: dark mode for reports", customer: "Lattice Labs", priority: "Low", assignee: { name: "Tomás Weber", color: "primary" }, sla: 8, slaLeft: "2 d", status: "Open" },
  { id: "4809", subject: "Policy preview mismatch", customer: "Quorum Energy", priority: "High", assignee: { name: "Jonah Park", color: "tertiary" }, sla: 70, slaLeft: "35 min", status: "Open" },
]

const PRIORITIES: Priority[] = ["Urgent", "High", "Normal", "Low"]
const PRIORITY_BADGE = { Urgent: "error", High: "secondary", Normal: "neutral", Low: "neutral" } as const
const STATUS_TEXT = { Open: "text-primary", "In progress": "text-tertiary", Waiting: "text-on-surface-variant" } as const
const CUSTOMERS = ["Halide Bank", "Meridian Health", "Northwind", "Quorum Energy"]

const KPIS = [
  { label: "Open", value: "12", note: "4 unassigned", icon: "inbox", alert: false },
  { label: "SLA at risk", value: "2", note: "respond within 15 min", icon: "timer", alert: true },
  { label: "CSAT", value: "4.7", note: "+0.2 vs last month", icon: "sentiment_satisfied", alert: false },
  { label: "First response", value: "18 min", note: "median, 7 days", icon: "reply", alert: false },
]

export function AdminSupport() {
  const [tickets, setTickets] = React.useState(TICKETS)
  const [priorities, setPriorities] = React.useState<Set<Priority>>(new Set(["Urgent", "High"]))
  const [assignee, setAssignee] = React.useState<"anyone" | "me" | "unassigned">("anyone")

  const filtered = React.useMemo(
    () =>
      tickets.filter(
        (t) =>
          (priorities.size === 0 || priorities.has(t.priority)) &&
          (assignee === "anyone" || (assignee === "me" ? t.assignee?.name === ME : !t.assignee)),
      ),
    [tickets, priorities, assignee],
  )
  const table = useDataTable(filtered, { pageSize: 50 })

  const open = (t: Ticket) => snackbar(`Opening #${t.id}`)

  return (
    <div>
      <PageHeader
        title="Support"
        description={`${OPEN_BEFORE + tickets.length} open tickets · 2 at risk of SLA breach`}
        actions={
          <>
            <Button variant="outlined" className="pr-5" onPress={() => snackbar("Macros panel opened")}>
              <Icon>bolt</Icon>
              Macros
            </Button>
            <NewTicketDialog onCreate={(t) => setTickets((ts) => [t, ...ts])} />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPIS.map((k) => (
          <div
            key={k.label}
            className={cn("flex min-w-0 items-start gap-4 rounded-xl p-5", k.alert ? "bg-error-container text-on-error-container" : "bg-surface-container-low")}
          >
            <div className="min-w-0 flex-1">
              <div className="text-body-md opacity-80">{k.label}</div>
              <div className="mt-1 text-headline-md font-medium tabular-nums">{k.value}</div>
              <div className={cn("text-body-sm", !k.alert && "text-on-surface-variant")}>{k.note}</div>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-container-highest text-on-surface">
              <Icon size={20}>{k.icon}</Icon>
            </span>
          </div>
        ))}
      </div>

      <DataTableCard className="mt-4">
        <DataTableToolbar>
          <ChipGroup
            aria-label="Priority"
            selectedKeys={priorities}
            onSelectionChange={(keys) => setPriorities(new Set(keys as Set<Priority>))}
          >
            {PRIORITIES.map((p) => (
              <FilterChip key={p} id={p}>
                {p}
              </FilterChip>
            ))}
          </ChipGroup>
          <span className="flex-1" />
          <Select
            label="Assignee"
            className="w-44"
            selectedKey={assignee}
            onSelectionChange={(k) => k != null && setAssignee(k as typeof assignee)}
          >
            <SelectItem id="anyone">Anyone</SelectItem>
            <SelectItem id="me">Me</SelectItem>
            <SelectItem id="unassigned">Unassigned</SelectItem>
          </Select>
        </DataTableToolbar>
        <DataTable aria-label="Tickets" className="min-w-[900px]" {...table.tableProps}>
          <DataTableHeader>
            <DataTableColumn id="id" isRowHeader allowsSorting>
              Ticket
            </DataTableColumn>
            <DataTableColumn id="subject" allowsSorting>
              Subject
            </DataTableColumn>
            <DataTableColumn id="priority">Priority</DataTableColumn>
            <DataTableColumn id="assignee">Assignee</DataTableColumn>
            <DataTableColumn id="sla" allowsSorting>
              SLA
            </DataTableColumn>
            <DataTableColumn id="status">Status</DataTableColumn>
          </DataTableHeader>
          <DataTableBody
            items={table.items}
            renderEmptyState={() => <DataTableEmpty icon="support_agent" title="No tickets match these filters" />}
          >
            {(t) => (
              <DataTableRow id={t.id} textValue={`#${t.id} ${t.subject}`} onAction={() => open(t)}>
                <DataTableCell className="font-mono text-body-sm">#{t.id}</DataTableCell>
                <DataTableCell>
                  <div className="font-medium">{t.subject}</div>
                  <div className="text-body-sm text-on-surface-variant">{t.customer}</div>
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge variant={PRIORITY_BADGE[t.priority]} className="h-6">
                    {t.priority}
                  </StatusBadge>
                </DataTableCell>
                <DataTableCell>
                  {t.assignee ? (
                    <span className="flex items-center gap-2">
                      <Avatar size="xs" name={t.assignee.name} color={t.assignee.color} className="size-7" />
                      <span className="whitespace-nowrap text-on-surface-variant">{t.assignee.name}</span>
                    </span>
                  ) : (
                    <span className="text-on-surface-variant">Unassigned</span>
                  )}
                </DataTableCell>
                <DataTableCell>
                  <div className="flex w-36 items-center gap-2">
                    <LinearProgress
                      aria-label={`SLA used for #${t.id}`}
                      value={t.sla}
                      thickness={6}
                      showStop={false}
                      tone={t.sla >= 80 ? "error" : t.sla >= 50 ? "secondary" : "primary"}
                      className="min-w-0 flex-1"
                    />
                    <span className={cn("w-14 text-right text-label-md tabular-nums", t.sla >= 80 ? "text-error" : "text-on-surface-variant")}>
                      {t.slaLeft}
                    </span>
                  </div>
                </DataTableCell>
                <DataTableCell>
                  <span className={cn("flex items-center gap-1.5 text-label-md whitespace-nowrap", STATUS_TEXT[t.status])}>
                    <span className="size-2 rounded-full bg-current" />
                    {t.status}
                  </span>
                </DataTableCell>
              </DataTableRow>
            )}
          </DataTableBody>
        </DataTable>
      </DataTableCard>
    </div>
  )
}

let nextTicket = 4822

function NewTicketDialog({ onCreate }: { onCreate: (t: Ticket) => void }) {
  const [customer, setCustomer] = React.useState("Halide Bank")
  const [priority, setPriority] = React.useState<Priority>("Normal")
  return (
    <DialogTrigger>
      <Button className="pr-5">
        <Icon>add</Icon>
        New ticket
      </Button>
      <Dialog modalClassName="max-w-md">
        {({ close }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              const subject = String(new FormData(e.currentTarget).get("subject") ?? "").trim()
              const id = String(nextTicket++)
              onCreate({ id, subject, customer, priority, sla: 0, slaLeft: "8 h", status: "Open" })
              close()
              snackbar(`Ticket #${id} created`, { action: { label: "Open", onAction: () => snackbar(`Opening #${id}`) } })
            }}
          >
            <DialogHeadline>New ticket</DialogHeadline>
            <DialogBody className="grid gap-4 overflow-visible pt-2">
              <TextField name="subject" label="Subject" isRequired autoFocus />
              <Select label="Customer" selectedKey={customer} onSelectionChange={(k) => k != null && setCustomer(String(k))}>
                {CUSTOMERS.map((c) => (
                  <SelectItem key={c} id={c}>
                    {c}
                  </SelectItem>
                ))}
              </Select>
              <Select label="Priority" selectedKey={priority} onSelectionChange={(k) => k != null && setPriority(k as Priority)}>
                {[...PRIORITIES].reverse().map((p) => (
                  <SelectItem key={p} id={p}>
                    {p}
                  </SelectItem>
                ))}
              </Select>
            </DialogBody>
            <DialogActions>
              <Button variant="text" slot="close">
                Cancel
              </Button>
              <Button type="submit" className="px-5">
                Create
              </Button>
            </DialogActions>
          </Form>
        )}
      </Dialog>
    </DialogTrigger>
  )
}
