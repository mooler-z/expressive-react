"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogHeadline, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

import { useAdmin } from "./admin-context"
import { AVATAR_TONES, CUSTOMERS, initialsOf, type Customer } from "./admin-data"
import { FilterChipButton, PageHeader } from "./admin-ui"

type Plan = "All" | Customer["plan"]
const PLANS: Plan[] = ["All", "Enterprise", "Business", "Starter"]
const PLAN_CLS: Record<Customer["plan"], string> = {
  Enterprise: "bg-primary text-on-primary",
  Business: "bg-primary-container text-on-primary-container",
  Starter: "bg-surface-container-highest text-on-surface-variant",
}
const STATS = [
  ["Accounts", "412", "+12 this month", "apartment", false],
  ["ARR", "$4.8M", "+11% YoY", "payments", false],
  ["Net retention", "118%", "trailing 12 months", "autorenew", false],
  ["At risk", "9", "health under 50", "warning", true],
] as const

export function AdminCustomers() {
  const { query, href, navigate } = useAdmin()
  const [plan, setPlan] = React.useState<Plan>("All")
  const q = query.trim().toLowerCase()
  const rows = CUSTOMERS.map((c, i) => ({ c, i })).filter(
    ({ c }) => (plan === "All" || c.plan === plan) && (!q || Object.values(c).join(" ").toLowerCase().includes(q)),
  )

  return (
    <div data-page>
      <PageHeader
        title="Customers"
        description="412 accounts · $4.8M ARR"
        actions={
          <>
            <button
              className="state-layer inline-flex h-10 items-center gap-2 rounded-full border border-outline-variant pr-5 pl-4 text-label-lg text-on-surface-variant"
              onClick={() => snackbar("Exporting 412 customers as CSV")}
            >
              <Icon size={20}>download</Icon>
              Export
            </button>
            <AddCustomer />
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map(([label, value, sub, icon, risk]) => (
          <div key={label} className={cn("flex min-w-0 items-start gap-4 rounded-xl p-5", risk ? "bg-error-container text-on-error-container" : "bg-surface-container-low")}>
            <div className="min-w-0 flex-1">
              <div className="text-body-md opacity-80">{label}</div>
              <div className="mt-1 text-headline-md font-medium tabular-nums">{value}</div>
              <div className={cn("text-body-sm", !risk && "text-on-surface-variant")}>{sub}</div>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-surface-container-highest text-on-surface">
              <Icon size={20}>{icon}</Icon>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-xl bg-surface-container-low">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <div className="flex flex-wrap gap-2">
            {PLANS.map((p) => (
              <FilterChipButton key={p} selected={plan === p} onPress={() => setPlan(p)}>
                {p}
              </FilterChipButton>
            ))}
          </div>
          <span className="ml-auto text-body-sm text-on-surface-variant">Use the search bar to filter by name, owner or region</span>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-body-md">
            <thead className="text-label-md text-on-surface-variant">
              <tr className="border-b border-outline-variant">
                {["Customer", "Plan", "ARR", "Seats", "Health", "Owner", "Region", ""].map((h) => (
                  <th key={h} className="px-4 py-2 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {rows.map(({ c, i }) => (
                <tr
                  key={c.name}
                  tabIndex={0}
                  onClick={() => navigate(href("customer", String(i)))}
                  onKeyDown={(e) => e.key === "Enter" && navigate(href("customer", String(i)))}
                  className="focus-ring cursor-pointer transition-colors hover:bg-on-surface/[.04]"
                >
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className={cn("grid size-9 shrink-0 place-items-center rounded-md text-label-md", AVATAR_TONES[i % 4])}>{initialsOf(c.name)}</span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{c.name}</span>
                        <span className="block truncate text-body-sm text-on-surface-variant">
                          {c.industry} · since {c.since}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex h-6 items-center rounded-sm px-2 text-label-sm whitespace-nowrap", PLAN_CLS[c.plan])}>{c.plan}</span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{c.arr}</td>
                  <td className="px-4 py-3 tabular-nums">{c.seats.toLocaleString("en-US")}</td>
                  <td className="px-4 py-3">
                    <span className="flex w-32 items-center gap-2">
                      <span className="h-1.5 flex-1 rounded-full bg-surface-container-highest">
                        <span
                          className={cn("block h-full rounded-full", c.health < 50 ? "bg-error" : c.health < 75 ? "bg-secondary" : "bg-tertiary")}
                          style={{ width: c.health + "%" }}
                        />
                      </span>
                      <span className="w-7 text-right text-label-md tabular-nums">{c.health}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-on-surface-variant">{c.owner}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{c.region}</td>
                  <td className="px-2 py-3">
                    <Icon className="text-on-surface-variant">chevron_right</Icon>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="px-6 py-14 text-center text-body-md text-on-surface-variant">No customers match.</div>}
        </div>
      </div>
    </div>
  )
}

function AddCustomer() {
  return (
    <DialogTrigger>
      <Button>
        <Icon>add</Icon>
        Add customer
      </Button>
      <Dialog modalClassName="max-w-md">
        <DialogHeadline>Add customer</DialogHeadline>
        <div className="mt-4 grid gap-4">
          <TextField label="Company name" autoFocus />
          <TextField label="Billing email" type="email" />
          <Select label="Plan" defaultSelectedKey="Business">
            <SelectItem id="Starter">Starter</SelectItem>
            <SelectItem id="Business">Business</SelectItem>
            <SelectItem id="Enterprise">Enterprise</SelectItem>
          </Select>
        </div>
        <DialogActions>
          <Button variant="text" slot="close">
            Cancel
          </Button>
          <Button slot="close" onPress={() => snackbar("Customer added", { action: { label: "Open", onAction: () => {} } })}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </DialogTrigger>
  )
}
