"use client"

import type * as React from "react"
import { Link } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { KpiSpark, PLAN_MIX, PlanChart, RevenueChart } from "./admin-charts"
import { useAdmin } from "./admin-context"
import { DATA, RANGES, money, series } from "./admin-data"
import { Card, CardHead, PageHeader, RangePicker, StatusPill } from "./admin-ui"

const DELTAS = {
  "7d": ["+1.8%", "+0.7%", "+12%", "+0.01"],
  "30d": ["+6.2%", "+3.4%", "+18%", "−0.01"],
  "90d": ["+14.9%", "+9.1%", "+31%", "+0.02"],
  "12m": ["+48%", "+27%", "+112%", "+0.05"],
}

const ACTIVITY = [
  ["rocket_launch", "bg-tertiary-container text-on-tertiary-container", "checkout-api v4.2.0 promoted to 100%", "12 min ago"],
  ["person_add", "bg-primary-container text-on-primary-container", "Hannah Kim joined Meridian Health", "1 h ago"],
  ["error", "bg-error-container text-on-error-container", "Invoice KS-10471 is 3 days overdue", "3 h ago"],
  ["policy", "bg-secondary-container text-on-secondary-container", "Policy “no-public-buckets” enforced", "Yesterday"],
  ["payments", "bg-primary-fixed-dim text-on-primary-fixed", "Halide Bank renewed Enterprise · $240k", "2 days ago"],
]

const REGIONS = [
  ["Frankfurt", "eu-central-1", "41 ms", 72, "12 nodes"],
  ["N. Virginia", "us-east-1", "58 ms", 81, "18 nodes"],
  ["Tokyo", "ap-northeast-1", "63 ms", 64, "8 nodes"],
  ["Oregon", "us-west-2", "49 ms", 93, "10 nodes"],
] as const

const GOALS = [
  ["ARR", "$22M target", 78, "stroke-primary"],
  ["Net retention", "124% target", 91, "stroke-tertiary"],
  ["Churn", "under 1.5%", 64, "stroke-secondary"],
] as const

export function AdminOverview() {
  const { href, range, compare, setCompare } = useAdmin()
  const R = RANGES[range]
  const deploys = series("k2", 100, 40, 0.012, R.n, range).reduce((a, b) => a + b, 0) * 6 * R.mult
  const kpis = [
    ["Monthly recurring revenue", "$1.84M", "payments", "bg-primary-container text-on-primary-container"],
    ["Active workspaces", "412", "workspaces", "bg-tertiary-container text-on-tertiary-container"],
    ["Deployments", deploys.toLocaleString("en-US"), "rocket_launch", "bg-secondary-container text-on-secondary-container"],
    ["Platform uptime", "99.98%", "verified", "bg-primary-fixed-dim text-on-primary-fixed"],
  ]

  return (
    <div data-page>
      <PageHeader
        title="Good morning, Maya"
        description={`Here's what moved across Kestrel in the last ${R.label}.`}
        actions={
          <>
            <RangePicker />
            <button
              className="state-layer inline-flex h-10 items-center gap-2 rounded-full border border-outline-variant pr-4 pl-3 text-label-lg text-on-surface-variant"
              onClick={() => snackbar("Exporting overview as PDF…", { action: { label: "Cancel", onAction: () => snackbar("Export cancelled") } })}
            >
              <Icon size={20}>download</Icon>
              Export
            </button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value, icon, boxCls], i) => {
          const delta = DELTAS[range][i]
          const down = delta.startsWith("−")
          return (
            <div
              key={label}
              className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-5 transition-all duration-300 ease-emphasized hover:-translate-y-0.5 hover:bg-surface-container"
            >
              <div className="flex items-center justify-between">
                <span className={cn("grid size-10 place-items-center rounded-md", boxCls)}>
                  <Icon size={20}>{icon}</Icon>
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-sm px-2 py-0.5 text-label-md",
                    down ? "bg-error-container text-on-error-container" : "bg-tertiary-container text-on-tertiary-container",
                  )}
                >
                  <Icon size={16}>{down ? "trending_down" : "trending_up"}</Icon>
                  {delta}
                </span>
              </div>
              <div>
                <div className="text-body-md text-on-surface-variant">{label}</div>
                <div className="text-headline-md font-medium tabular-nums">{value}</div>
              </div>
              <div className="relative h-12">
                <KpiSpark index={i} range={range} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead
            title="Revenue"
            description="MRR vs. target, in USD"
            action={
              <Switch isSelected={compare} onChange={setCompare} className="flex-row-reverse text-label-lg text-on-surface-variant">
                Compare previous
              </Switch>
            }
          />
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-body-sm text-on-surface-variant">
            <span className="inline-flex items-center gap-2">
              <span className="h-1 w-4 rounded-full bg-primary" />
              MRR
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-0 w-4 border-t-2 border-dashed border-outline" />
              Target
            </span>
            {compare && (
              <span className="inline-flex items-center gap-2">
                <span className="h-1 w-4 rounded-full bg-tertiary" />
                Previous period
              </span>
            )}
          </div>
          <div className="relative mt-3 h-72">
            <RevenueChart range={range} compare={compare} />
          </div>
        </Card>
        <Card>
          <CardHead title="Revenue by plan" description="Share of MRR" />
          <div className="relative mt-3 h-52">
            <PlanChart />
          </div>
          <ul className="mt-4 space-y-2 text-body-md">
            {PLAN_MIX.map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className={cn("size-3 rounded-full", p.dot)} />
                <span className="flex-1">{p.name}</span>
                <span className="text-on-surface-variant tabular-nums">{p.value}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-surface-container-low xl:col-span-2">
          <div className="p-5 pb-3">
            <CardHead title="Recent orders" description="Latest 6 across all workspaces" action={<ViewAll href={href("orders")}>View all</ViewAll>} />
          </div>
          <div className="relative overflow-x-auto">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[minmax(180px,1.4fr)_minmax(140px,1fr)_110px_120px] gap-3 border-y border-outline-variant px-5 py-2 text-label-md text-on-surface-variant">
                <span>Customer</span>
                <span>Plan</span>
                <span className="text-right">Amount</span>
                <span>Status</span>
              </div>
              {DATA.orders.slice(0, 6).map((o) => (
                <Link
                  key={o.id}
                  href={href("order", o.id)}
                  className="state-layer grid grid-cols-[minmax(180px,1.4fr)_minmax(140px,1fr)_110px_120px] items-center gap-3 border-b border-outline-variant/60 px-5 py-3 text-body-md text-on-surface outline-none"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className={cn("grid size-9 shrink-0 place-items-center rounded-full text-label-lg", o.avatarCls)}>{o.initials}</span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{o.customer}</span>
                      <span className="block font-mono text-body-sm text-on-surface-variant">{o.id}</span>
                    </span>
                  </span>
                  <span className="truncate text-on-surface-variant">{o.plan}</span>
                  <span className="text-right tabular-nums">{money(o.amount)}</span>
                  <span>
                    <StatusPill status={o.status} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <Card>
          <CardHead title="Activity" description="Across your workspaces" />
          <ol className="relative mt-4 ml-5 border-l-2 border-outline-variant">
            {ACTIVITY.map(([icon, cls, text, time]) => (
              <li key={text} className="relative pb-5 pl-7 last:pb-0">
                <span className={cn("absolute top-0 -left-[17px] grid size-8 place-items-center rounded-full ring-4 ring-surface-container-low", cls)}>
                  <Icon size={18}>{icon}</Icon>
                </span>
                <div className="text-body-md">{text}</div>
                <div className="text-body-sm text-on-surface-variant">{time}</div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <CardHead title="Region health" description="p95 latency · capacity used" action={<ViewAll href={href("analytics")}>Analytics</ViewAll>} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {REGIONS.map(([name, code, latency, pct, nodes]) => (
              <div key={name} className="rounded-lg bg-surface p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-title-sm">
                    <span className={cn("size-2 rounded-full", pct > 90 ? "bg-error" : "bg-tertiary")} />
                    {name}
                  </span>
                  <span className="font-mono text-body-sm text-on-surface-variant">{latency}</span>
                </div>
                <div className="mt-3 flex h-1.5 items-center gap-1">
                  <div className={cn("h-full rounded-full", pct > 90 ? "bg-error" : "bg-primary")} style={{ width: pct + "%" }} />
                  <div className="h-full flex-1 rounded-full bg-secondary-container" />
                </div>
                <div className="mt-2 flex justify-between text-body-sm text-on-surface-variant">
                  <span>
                    {nodes} · {code}
                  </span>
                  <span>{pct}% capacity</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Quarterly goals" description="Q4 2026" />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {GOALS.map(([label, sub, pct, stroke]) => (
              <div key={label}>
                <span className="relative mx-auto grid size-20 place-items-center">
                  <svg className="absolute inset-0 size-20 -rotate-90" viewBox="0 0 48 48" fill="none" aria-hidden>
                    <circle cx="24" cy="24" r="20" className="stroke-secondary-container" strokeWidth="5" />
                    <circle cx="24" cy="24" r="20" className={stroke} strokeWidth="5" pathLength={100} strokeDasharray={`${pct} 100`} strokeLinecap="round" />
                  </svg>
                  <span className="text-title-md tabular-nums">{pct}%</span>
                </span>
                <div className="mt-2 text-label-lg">{label}</div>
                <div className="text-body-sm text-on-surface-variant">{sub}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function ViewAll({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="state-layer inline-flex h-9 items-center gap-1 rounded-full px-3 text-label-lg text-primary outline-none">
      {children}
      <Icon size={18}>arrow_forward</Icon>
    </Link>
  )
}

