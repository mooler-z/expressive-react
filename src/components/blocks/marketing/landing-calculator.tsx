"use client"

import * as React from "react"
import { ToggleButton, ToggleButtonGroup } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { BrandLogo, NavLinks, SimpleFooter, StaggerIn } from "./marketing-shared"

const SIZES = [10, 50, 200, 1000, 5000]
const fmt = (x: number) => "$" + x.toLocaleString("en-US")

/** Savings calculator: workload size × billing → Kestrel vs. typical-stack cost. */
export function SavingsCalculator({ className }: { className?: string }) {
  const [size, setSize] = React.useState(1)
  const [annual, setAnnual] = React.useState(true)
  const w = SIZES[size]
  const price = w <= 10 ? 0 : annual ? 23 : 29
  const kestrel = w * price
  const diy = Math.round(w * 48 + 2400)
  const pct = Math.max(2, Math.min(100, (kestrel / diy) * 100))
  const note =
    w <= 10
      ? "Starter is free up to 10 workloads."
      : `${w.toLocaleString("en-US")} workloads × $${price}${annual ? " (annual)" : " (monthly)"}. Typical stack estimate includes tooling licences and 0.5 FTE of glue work.`

  return (
    <div className={cn("rounded-2xl bg-surface-container-low p-6 md:p-8", className)}>
      <div className="text-label-lg text-on-surface-variant" id="calc-size">
        Workloads you run
      </div>
      <ToggleButtonGroup
        aria-labelledby="calc-size"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[String(size)]}
        onSelectionChange={(k) => setSize(Number([...k][0]))}
        className="mt-3 flex flex-wrap gap-2"
      >
        {SIZES.map((s, i) => (
          <ToggleButton
            key={s}
            id={String(i)}
            className={cn(
              "state-layer focus-ring inline-flex h-12 min-w-16 cursor-pointer items-center justify-center rounded-lg bg-surface-container-high px-5 text-title-md text-on-surface-variant tabular-nums outline-none shape-morph",
              "data-selected:rounded-[24px] data-selected:bg-primary data-selected:text-on-primary",
            )}
          >
            {s.toLocaleString("en-US")}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-label-lg text-on-surface-variant" id="calc-billing">
          Billing
        </span>
        <ToggleButtonGroup
          aria-labelledby="calc-billing"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[annual ? "annual" : "monthly"]}
          onSelectionChange={(k) => setAnnual(k.has("annual"))}
          className="inline-flex rounded-full bg-surface-container-high p-1"
        >
          {[
            ["monthly", "Monthly"],
            ["annual", "Annual · −20%"],
          ].map(([id, label]) => (
            <ToggleButton
              key={id}
              id={id}
              className="state-layer focus-ring cursor-pointer rounded-full px-4 py-2 text-label-lg text-on-surface-variant outline-none shape-morph data-selected:bg-surface data-selected:text-on-surface data-selected:shadow-1"
            >
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </div>
      <div className="mt-8 space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-body-md">Kestrel Grid</span>
            <span className="text-title-lg tabular-nums">{fmt(kestrel)}/mo</span>
          </div>
          <div className="mt-2 h-4 rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-(--md-spring-default-spatial-duration) ease-default-spatial"
              style={{ width: `${pct.toFixed(1)}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-body-md text-on-surface-variant">Typical stack</span>
            <span className="text-title-lg text-on-surface-variant tabular-nums">{fmt(diy)}/mo</span>
          </div>
          <div className="mt-2 h-4 rounded-full bg-surface-container-highest">
            <div className="h-full w-full rounded-full bg-outline" />
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-tertiary-container p-5 text-on-tertiary-container">
        <div>
          <div className="text-label-lg">You'd save every month</div>
          <div className="text-display-sm font-semibold tabular-nums" aria-live="polite">
            {fmt(Math.max(0, diy - kestrel))}
          </div>
        </div>
        <Button className="h-12 bg-tertiary px-5 text-on-tertiary" onPress={() => snackbar("Quote emailed to you")}>
          Email me this quote
          <Icon size={20}>mail</Icon>
        </Button>
      </div>
      <p className="mt-3 text-body-sm text-on-surface-variant">{note}</p>
    </div>
  )
}

const TIERS = [
  ["Starter", "$0", "up to 10 workloads", "border border-outline-variant"],
  ["Business", "$23–29", "per workload / month", "bg-primary-container text-on-primary-container"],
  ["Enterprise", "Custom", "reserved capacity, SSO, air-gapped", "bg-surface-container-highest"],
]

/** Variant 09 · Calculator — lead with an interactive savings estimate. */
export function LandingCalculator() {
  return (
    <div className="bg-surface font-sans text-on-surface">
      <header className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 md:px-8">
        <BrandLogo />
        <NavLinks className="ml-6" />
        <Button className="ml-auto px-5" onPress={() => snackbar("Let's get you set up")}>
          Start free
        </Button>
      </header>
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:py-20">
          <StaggerIn>
            <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-lg">
              See what you'd save before you sign anything.
            </h1>
            <p className="mt-4 max-w-lg text-body-lg text-on-surface-variant">
              Pick your size. We compare Kestrel to the typical stack of four tools, a spreadsheet and a very tired
              SRE.
            </p>
          </StaggerIn>
          <Reveal>
            <SavingsCalculator />
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-4 pb-24 md:grid-cols-3">
          {TIERS.map(([name, price, note, tone]) => (
            <Reveal key={name} className={cn("rounded-xl p-6", tone)}>
              <div className="text-title-lg">{name}</div>
              <div className="mt-3 text-headline-lg font-semibold tabular-nums">{price}</div>
              <div className="text-body-md opacity-80">{note}</div>
            </Reveal>
          ))}
        </div>
      </section>
      <SimpleFooter />
    </div>
  )
}
