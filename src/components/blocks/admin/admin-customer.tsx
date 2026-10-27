"use client"

import { Link } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import { ActionMenu, Panel, StatTile, TONE_FILL, TonePill, notify, type Tone } from "./admin-actions"
import { CustomerUsageChart } from "./admin-charts"
import { useAdmin } from "./admin-context"
import { CUSTOMERS, initialsOf } from "./admin-data"

const INVOICES: { id: string; issued: string; amount: string; status: "Paid" | "Refunded" }[] = [
  { id: "INV-0417", issued: "Oct 1", amount: "$48,210", status: "Paid" },
  { id: "INV-0388", issued: "Sep 1", amount: "$47,900", status: "Paid" },
  { id: "INV-0359", issued: "Aug 1", amount: "$46,120", status: "Paid" },
  { id: "INV-0330", issued: "Jul 1", amount: "$45,800", status: "Refunded" },
]

const TIMELINE: { icon: string; tone: Tone | "solid"; text: string; meta: string }[] = [
  { icon: "rocket_launch", tone: "solid", text: "Upgraded to 1,240 seats", meta: "Oct 12 · Maya Lindqvist" },
  { icon: "support_agent", tone: "secondary", text: "Ticket #4821 opened · SSO login loop", meta: "Oct 9 · Lena Ortiz" },
  { icon: "handshake", tone: "tertiary", text: "QBR completed, expansion discussed", meta: "Sep 28 · Jonah Park" },
  { icon: "payments", tone: "neutral", text: "Invoice INV-0388 paid", meta: "Sep 3 · system" },
]

export function AdminCustomer() {
  const { href, range, id } = useAdmin()
  const c = CUSTOMERS[Math.min(CUSTOMERS.length - 1, Math.max(0, parseInt(id ?? "0", 10) || 0))]
  const email = c.contact.split(" ")[0].toLowerCase() + "@" + c.name.split(" ")[0].toLowerCase() + ".example"
  const health: { label: string; tone: Tone } =
    c.health < 50 ? { label: "At risk", tone: "error" } : c.health < 75 ? { label: "Needs attention", tone: "secondary" } : { label: "Healthy", tone: "tertiary" }

  const contacts: { name: string; role: string; color: "primary" | "secondary" | "tertiary" | "neutral"; icon?: string }[] = [
    { name: c.contact, role: "Champion · VP Platform", color: "primary", icon: "person" },
    { name: "Marcus Bell", role: "Economic buyer · CFO", color: "tertiary" },
    { name: "Yuki Tan", role: "Admin · IT", color: "secondary" },
    { name: "Rosa Diaz", role: "Billing contact", color: "neutral" },
  ]

  return (
    <div>
      <Link
        href={href("customers")}
        className="state-layer focus-ring mb-3 -ml-2 inline-flex h-10 items-center gap-1 rounded-full pr-4 pl-2 text-label-lg text-primary outline-none"
      >
        <Icon size={20}>arrow_back</Icon>
        Customers
      </Link>

      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-surface-container-low p-5">
        <span className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary text-headline-sm text-on-primary">{initialsOf(c.name)}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-headline-md font-medium">{c.name}</h1>
            <TonePill tone={health.tone}>{health.label}</TonePill>
          </div>
          <p className="text-body-md text-on-surface-variant">
            {c.industry} · {c.plan} plan · {c.region} · customer since {c.since}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outlined" onPress={() => notify("Composing email to " + c.contact)}>
            <Icon>mail</Icon>
            Email
          </Button>
          <Button onPress={() => notify("Activity logged")}>
            <Icon>add</Icon>
            Log activity
          </Button>
          <ActionMenu
            items={[
              { id: "edit", label: "Edit account", icon: "edit" },
              { id: "owner", label: "Change owner", icon: "swap_horiz" },
              { id: "upgrade", label: "Upgrade plan", icon: "upgrade" },
              "separator",
              { id: "archive", label: "Archive customer", icon: "delete", danger: true, onAction: () => notify(`${c.name} archived`, "Undo", () => notify("Customer restored")) },
            ]}
          />
        </div>
      </div>

      <Tabs className="mt-4">
        <TabList aria-label="Customer sections" variant="primary" scrollable>
          <Tab id="overview">Overview</Tab>
          <Tab id="billing">Billing</Tab>
          <Tab id="activity">Activity</Tab>
          <Tab id="contacts">Contacts</Tab>
        </TabList>

        <TabPanel id="overview" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="ARR" value={c.arr} sub="renews Mar 2027" icon="payments" />
            <StatTile label="Seats" value={c.seats.toLocaleString("en-US")} sub="94% active" icon="group" />
            <StatTile label="Health" value={c.health} sub={health.label} icon="favorite" />
            <StatTile label="Open tickets" value="3" sub="1 high priority" icon="support_agent" />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <Panel title="Usage" description="Workloads and active seats" className="xl:col-span-2">
              <div className="relative h-64">
                <CustomerUsageChart range={range} />
              </div>
            </Panel>
            <Panel title="Account">
              <dl className="divide-y divide-outline-variant text-body-md">
                {[
                  ["Owner", c.owner],
                  ["Champion", c.contact],
                  ["Billing email", email],
                  ["Contract", "Annual · auto-renew"],
                  ["Support tier", "24/7 · dedicated"],
                  ["Region", c.region],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 py-2.5">
                    <dt className="w-28 shrink-0 text-on-surface-variant">{k}</dt>
                    <dd className="min-w-0 flex-1 truncate">{v}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>
        </TabPanel>

        <TabPanel id="billing" className="mt-4">
          <div className="grid gap-4 xl:grid-cols-3">
            <Panel title="Invoices" description="Last 4 months" className="xl:col-span-2">
              <Table aria-label="Invoices" className="min-w-[480px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Download</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INVOICES.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-body-sm">{inv.id}</TableCell>
                      <TableCell muted>{inv.issued}</TableCell>
                      <TableCell className="tabular-nums">{inv.amount}</TableCell>
                      <TableCell>
                        <TonePill tone={inv.status === "Paid" ? "tertiary" : "neutral"}>{inv.status}</TonePill>
                      </TableCell>
                      <TableCell align="end" className="py-1">
                        <IconButton aria-label={`Download ${inv.id}`} onPress={() => notify(`Downloading ${inv.id}.pdf`)}>
                          <Icon size={20}>download</Icon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Panel>
            <Panel title="Payment method">
              <div className="flex items-center gap-3 rounded-lg bg-surface p-4">
                <span className="grid h-10 w-14 place-items-center rounded-sm bg-inverse-surface font-mono text-label-md text-inverse-on-surface">VISA</span>
                <div>
                  <div className="text-title-sm">•••• 4242</div>
                  <div className="text-body-sm text-on-surface-variant">Expires 08/28</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outlined" onPress={() => notify("Opening secure card form")}>
                  <Icon>credit_card</Icon>
                  Replace
                </Button>
                <Button variant="text" onPress={() => notify("Opening billing portal")}>
                  Billing portal
                </Button>
              </div>
            </Panel>
          </div>
        </TabPanel>

        <TabPanel id="activity" className="mt-4">
          <Panel title="Timeline">
            <ol className="relative ml-4 border-l-2 border-outline-variant">
              {TIMELINE.map((e) => (
                <li key={e.text} className="relative pb-5 pl-7 last:pb-0">
                  <span className={cn("absolute top-0 -left-[17px] grid size-8 place-items-center rounded-full ring-4 ring-surface-container-low", TONE_FILL[e.tone])}>
                    <Icon size={18}>{e.icon}</Icon>
                  </span>
                  <p className="text-body-md">{e.text}</p>
                  <p className="text-body-sm text-on-surface-variant">{e.meta}</p>
                </li>
              ))}
            </ol>
          </Panel>
        </TabPanel>

        <TabPanel id="contacts" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {contacts.map((p) => (
              <div key={p.name} className="flex flex-col items-center rounded-xl bg-surface-container-low p-5 text-center">
                {p.icon ? (
                  <Avatar icon={p.icon} aria-label={p.name} color={p.color} size="lg" />
                ) : (
                  <Avatar name={p.name} color={p.color} size="lg" />
                )}
                <div className="mt-3 text-title-sm">{p.name}</div>
                <div className="text-body-sm text-on-surface-variant">{p.role}</div>
                <div className="mt-3 flex gap-1">
                  <IconButton aria-label={`Email ${p.name}`} onPress={() => notify("Email copied")}>
                    <Icon size={20}>mail</Icon>
                  </IconButton>
                  <IconButton aria-label={`Call ${p.name}`} onPress={() => notify("Calling…")}>
                    <Icon size={20}>call</Icon>
                  </IconButton>
                  <IconButton aria-label={`Chat with ${p.name}`} onPress={() => notify("Opening chat")}>
                    <Icon size={20}>chat</Icon>
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </TabPanel>
      </Tabs>
    </div>
  )
}
