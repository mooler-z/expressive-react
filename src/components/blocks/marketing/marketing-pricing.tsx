"use client"

import * as React from "react"

import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { ButtonLink } from "./marketing-shared"

const TIERS = [
  {
    name: "Starter",
    price: () => "$0",
    note: () => "up to 10 workloads",
    cta: "Start free",
    ctaVariant: "outlined" as const,
    card: "border border-outline-variant bg-surface",
    check: "text-primary",
    features: ["1 cloud account", "Community policies", "7-day history"],
  },
  {
    name: "Business",
    price: (annual: boolean) => (annual ? "$23" : "$29"),
    unit: "/workload",
    note: (annual: boolean) => (annual ? "billed annually · was $29" : "billed monthly"),
    cta: "Start 14-day trial",
    ctaVariant: "filled" as const,
    card: "relative bg-primary-container text-on-primary-container shadow-2",
    badge: "Popular",
    check: "",
    features: ["Unlimited accounts", "Policy previews + exceptions", "Automated rollbacks", "90-day history"],
  },
  {
    name: "Enterprise",
    price: () => "Custom",
    note: () => "reserved capacity · SSO · air-gapped",
    cta: "Talk to sales",
    ctaVariant: "tonal" as const,
    card: "bg-surface-container-highest",
    check: "text-primary",
    features: ["Dedicated success engineer", "Audit exports + SIEM", "99.99% SLA"],
  },
]

/** Monthly / Annual connected toggle. */
export function BillingToggle({ annual, onChange, className }: { annual: boolean; onChange: (annual: boolean) => void; className?: string }) {
  return (
    <ConnectedButtonGroup
      aria-label="Billing period"
      className={className}
      selectedKeys={[annual ? "annual" : "monthly"]}
      onSelectionChange={(keys) => onChange(keys.has("annual"))}
    >
      <ConnectedButton id="monthly" className="px-5">
        Monthly
      </ConnectedButton>
      <ConnectedButton id="annual" className="px-5">
        Annual
        <span className="rounded-xs bg-tertiary-container px-1.5 text-label-sm text-on-tertiary-container">−20%</span>
      </ConnectedButton>
    </ConnectedButtonGroup>
  )
}

/** Three pricing cards. */
export function PricingTiers({ annual, className, href = "#contact" }: { annual: boolean; className?: string; href?: string }) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>
      {TIERS.map((t, i) => (
        <div key={t.name} className={cn("flex flex-col rounded-xl p-6", t.card, i === 2 && "sm:max-md:col-span-2 xl:col-span-1")}>
          {t.badge && (
            <span className="absolute top-6 right-6 rounded-sm bg-primary px-2 py-0.5 text-label-md text-on-primary">{t.badge}</span>
          )}
          <div className="text-title-lg">{t.name}</div>
          <div className="mt-4 text-display-sm font-medium tabular-nums">
            {t.price(annual)}
            {t.unit && <span className="text-title-md font-normal">{t.unit}</span>}
          </div>
          <div className="text-body-md opacity-80">{t.note(annual)}</div>
          <ButtonLink
            href={href}
            variant={t.ctaVariant}
            className={cn("mt-6 h-12", t.ctaVariant === "outlined" && "text-on-surface-variant")}
          >
            {t.cta}
          </ButtonLink>
          <ul className="mt-6 space-y-3 text-body-md">
            {t.features.map((f) => (
              <li key={f} className="flex gap-3">
                <Icon size={20} className={t.check}>
                  check
                </Icon>
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

const ROWS: [string, string, string, string][] = [
  ["Workloads", "10", "Unlimited", "Unlimited"],
  ["Policy previews", "—", "✓", "✓"],
  ["Automated rollbacks", "—", "✓", "✓"],
  ["SSO / SCIM", "—", "SSO", "SSO + SCIM"],
  ["Support", "Community", "Business hours", "24/7 + success engineer"],
]

/** Plan comparison table. */
export function PricingCompare() {
  const cell = (v: string) =>
    v === "✓" ? (
      <Icon size={20} className="text-primary" aria-label="Included">
        check
      </Icon>
    ) : v === "—" ? (
      <span className="text-on-surface-variant" aria-label="Not included">
        —
      </span>
    ) : (
      v
    )
  return (
    <Table containerClassName="rounded-xl bg-surface-container-low" className="min-w-[640px]">
      <TableHeader>
        <TableRow>
          {["Compare", "Starter", "Business", "Enterprise"].map((h) => (
            <TableHead key={h} className="px-6 py-4">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {ROWS.map((r) => (
          <TableRow key={r[0]}>
            {r.map((v, i) => (
              <TableCell key={i} className="px-6 py-4">
                {cell(v)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const FAQ = [
  [
    "What counts as a workload?",
    "A deployment, stateful set, job or serverless function that Kestrel manages. Replicas don't count; the thing you'd name in a runbook does.",
  ],
  ["Can we start on Starter and move up mid-month?", "Yes. Upgrades are prorated to the day; nothing is re-deployed."],
  [
    "Is there an on-premise option?",
    "Enterprise includes an air-gapped installer, offline policy bundles and a dedicated success engineer to get you there.",
  ],
]

/** Pricing FAQ (tonal accordion, first item open). */
export function PricingFaq({ itemClassName }: { itemClassName?: string }) {
  return (
    <Accordion defaultExpandedKeys={["0"]}>
      {FAQ.map(([q, a], i) => (
        <AccordionItem key={q} id={String(i)} title={q} className={itemClassName}>
          {a}
        </AccordionItem>
      ))}
    </Accordion>
  )
}

/** Full pricing page: centered header with toggle, tiers, comparison and FAQ. */
export function PricingPage() {
  const [annual, setAnnual] = React.useState(true)
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-10 text-center md:px-8 lg:pt-12">
        <h1 className="mx-auto max-w-3xl text-display-sm font-semibold tracking-tight text-balance md:text-display-md">
          Simple enough to explain to finance.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-body-lg text-on-surface-variant">
          Per workload, per month. Reserved capacity gets you up to 40% off.
        </p>
        <BillingToggle annual={annual} onChange={setAnnual} className="mt-8" />
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <PricingTiers annual={annual} />
      </section>
      <Reveal className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <PricingCompare />
      </Reveal>
      <Reveal className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
        <h2 className="text-headline-md font-medium">Questions, answered</h2>
        <div className="mt-6">
          <PricingFaq itemClassName="bg-surface-container-low" />
        </div>
      </Reveal>
    </>
  )
}

/** Pricing in the M3 supporting-pane canonical layout: plans and comparison, FAQ + sales card alongside. */
export function PricingSupportingPane() {
  const [annual, setAnnual] = React.useState(true)
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-6 md:px-8 lg:pt-14">
        <h1 className="max-w-3xl text-display-sm font-semibold tracking-tight text-balance lg:text-display-md">
          Simple enough to explain to finance.
        </h1>
        <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
          Per workload, per month. Reserved capacity gets you up to 40% off.
        </p>
        <BillingToggle annual={annual} onChange={setAnnual} className="mt-6" />
      </section>
      <section className="mx-auto grid max-w-7xl items-start gap-6 px-4 pb-16 md:px-8 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <PricingTiers annual={annual} className="sm:grid-cols-2 xl:grid-cols-3" />
          <PricingCompare />
        </div>
        <aside className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-1">
          <div className="rounded-xl bg-surface-container-low p-5">
            <h2 className="text-title-lg">Questions, answered</h2>
            <div className="mt-4">
              <PricingFaq />
            </div>
          </div>
          <div className="self-start rounded-xl bg-tertiary-container p-6 text-on-tertiary-container">
            <Icon size={32}>support_agent</Icon>
            <div className="mt-3 text-title-lg">Need reserved capacity?</div>
            <p className="mt-1 text-body-md">Commit for a year and save up to 40%. We'll size it with you.</p>
            <ButtonLink href="#contact" className="mt-4 bg-tertiary text-on-tertiary">
              Talk to sales
            </ButtonLink>
          </div>
        </aside>
      </section>
    </>
  )
}
