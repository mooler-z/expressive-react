"use client"

import * as React from "react"

import { PageButtonLink, PageIntro } from "@/components/blocks/landing/landing-shared"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

/* Pricing · supporting-pane canonical layout: plans + comparison, FAQ pane beside them on large windows. */

const COMPARE = [
  ["Workloads", "10", "Unlimited", "Unlimited"],
  ["Policy previews", false, true, true],
  ["Automated rollbacks", false, true, true],
  ["SSO / SCIM", false, "SSO", "SSO + SCIM"],
  ["Support", "Community", "Business hours", "24/7 + success engineer"],
] as const

const FAQ = [
  {
    id: "workload",
    q: "What counts as a workload?",
    a: "A deployment, stateful set, job or serverless function that Kestrel manages. Replicas don't count; the thing you'd name in a runbook does.",
  },
  { id: "upgrade", q: "Can we start on Starter and move up mid-month?", a: "Yes. Upgrades are prorated to the day; nothing is re-deployed." },
  {
    id: "on-prem",
    q: "Is there an on-premise option?",
    a: "Enterprise includes an air-gapped installer, offline policy bundles and a dedicated success engineer to get you there.",
  },
]

function Check({ className }: { className?: string }) {
  return (
    <Icon size={20} className={className}>
      check
    </Icon>
  )
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="text-primary" />
  if (value === false) return <span className="text-on-surface-variant">—</span>
  return <>{value}</>
}

export function LandingPricing() {
  const [billing, setBilling] = React.useState<"monthly" | "annual">("annual")
  const annual = billing === "annual"

  return (
    <>
      <PageIntro
        title="Simple enough to explain to finance."
        footer={
          <ConnectedButtonGroup
            aria-label="Billing period"
            selectedKeys={[billing]}
            onSelectionChange={(keys) => {
              const [k] = [...keys]
              if (k) setBilling(k as "monthly" | "annual")
            }}
          >
            <ConnectedButton id="monthly">Monthly</ConnectedButton>
            <ConnectedButton id="annual">
              Annual
              <span className="rounded-xs bg-tertiary-container px-1.5 text-label-sm text-on-tertiary-container">−20%</span>
            </ConnectedButton>
          </ConnectedButtonGroup>
        }
      >
        Per workload, per month. Reserved capacity gets you up to 40% off.
      </PageIntro>

      <section className="grid items-start gap-6 px-4 pb-16 md:px-6 lg:px-10 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex flex-col rounded-xl border border-outline-variant bg-surface p-6">
              <div className="text-title-lg">Starter</div>
              <div className="mt-4 text-display-sm font-medium tabular-nums">$0</div>
              <div className="text-body-md opacity-80">up to 10 workloads</div>
              <PageButtonLink to="contact" variant="outlined" className="mt-6 h-12">
                Start free
              </PageButtonLink>
              <ul className="mt-6 space-y-3 text-body-md">
                {["1 cloud account", "Community policies", "7-day history"].map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className="text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex flex-col rounded-xl bg-primary-container p-6 text-on-primary-container shadow-2">
              <span className="absolute top-6 right-6 rounded-sm bg-primary px-2 py-0.5 text-label-md text-on-primary">Popular</span>
              <div className="text-title-lg">Business</div>
              <div className="mt-4 text-display-sm font-medium tabular-nums">
                {annual ? "$23" : "$29"}
                <span className="text-title-md font-normal">/workload</span>
              </div>
              <div className="text-body-md opacity-80">{annual ? "per month, billed annually" : "per month, billed monthly"}</div>
              <PageButtonLink to="contact" className="mt-6 h-12">
                Start 14-day trial
              </PageButtonLink>
              <ul className="mt-6 space-y-3 text-body-md">
                {["Unlimited accounts", "Policy previews + exceptions", "Automated rollbacks", "90-day history"].map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col rounded-xl bg-surface-container-highest p-6 sm:col-span-2 xl:col-span-1">
              <div className="text-title-lg">Enterprise</div>
              <div className="mt-4 text-display-sm font-medium tabular-nums">Custom</div>
              <div className="text-body-md opacity-80">reserved capacity · SSO · air-gapped</div>
              <PageButtonLink to="contact" variant="tonal" className="mt-6 h-12">
                Talk to sales
              </PageButtonLink>
              <ul className="mt-6 space-y-3 text-body-md">
                {["Dedicated success engineer", "Audit exports + SIEM", "99.99% SLA"].map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className="text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Table containerClassName="rounded-xl bg-surface-container-low" className="min-w-[640px]">
            <TableHeader>
              <TableRow>
                {["Compare", "Starter", "Business", "Enterprise"].map((h) => (
                  <TableHead key={h} className="px-6 py-4 last:pr-6">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPARE.map(([label, ...plans]) => (
                <TableRow key={label}>
                  <TableCell className="px-6 py-4 last:pr-6">{label}</TableCell>
                  {plans.map((v, i) => (
                    <TableCell key={i} className={cn("px-6 py-4 last:pr-6", v === "SSO" && "text-on-surface-variant")}>
                      <Cell value={v} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <aside className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-1">
          <div className="rounded-xl bg-surface-container-low p-5">
            <h2 className="text-title-lg">Questions, answered</h2>
            <Accordion className="mt-4" defaultExpandedKeys={["workload"]}>
              {FAQ.map((f) => (
                <AccordionItem key={f.id} id={f.id} title={f.q}>
                  {f.a}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="self-start rounded-xl bg-tertiary-container p-6 text-on-tertiary-container">
            <Icon size={32}>support_agent</Icon>
            <div className="mt-3 text-title-lg">Need reserved capacity?</div>
            <p className="mt-1 text-body-md">Commit for a year and save up to 40%. We'll size it with you.</p>
            <PageButtonLink to="contact" className="mt-4 bg-tertiary text-on-tertiary">
              Talk to sales
            </PageButtonLink>
          </div>
        </aside>
      </section>
    </>
  )
}
