"use client"

import { Button as AriaButton, Disclosure, DisclosureGroup, DisclosurePanel, Heading, Link } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"

import { BrandLogo, NAV_LINKS, SimpleFooter, StaggerIn } from "./marketing-shared"

const CHAPTERS = [
  ["Inventory that stays true", "Read-only discovery across AWS, GCP, Azure and bare metal. Drift flagged in minutes, ownership inferred from repos and on-call."],
  ["Policy with a preview button", "Write guardrails in Rego or YAML, see exactly what they would block, then enforce at plan, deploy and runtime."],
  ["Rollouts that watch themselves", "Canary, blue-green or all-at-once. Golden signals decide; rollbacks happen before your pager does."],
  ["Spend, attributed", "Cost per team from the same ownership graph that routes incidents. Budgets that actually page someone."],
]

/** Variant 04 · Editorial — magazine typography, hairline rules and a numbered chapter list. */
export function LandingEditorial() {
  return (
    <div className="bg-surface font-sans text-on-surface">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-b border-on-surface px-4 py-5 md:px-8">
        <BrandLogo />
        <nav aria-label="Primary" className="hidden items-center gap-6 text-label-lg md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="focus-ring rounded-xs underline-offset-4 outline-none data-hovered:underline">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="#contact" className="focus-ring rounded-xs text-label-lg text-primary underline underline-offset-4 outline-none">
          Talk to us →
        </Link>
      </header>
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <StaggerIn className="py-14 md:py-20">
          <h1 className="text-[clamp(52px,11vw,176px)] leading-[0.88] font-semibold tracking-[-0.04em]">
            Fewer
            <br />
            tabs.
            <br />
            <span className="text-tertiary">More</span> sleep.
          </h1>
          <div className="mt-10 grid gap-8 border-t border-on-surface pt-8 md:grid-cols-[1fr_2fr]">
            <p className="text-title-lg font-normal">
              Kestrel Grid is the control plane for teams who'd rather not have a favourite dashboard.
            </p>
            <div className="flex flex-wrap items-start gap-3 md:justify-end">
              <Button size="md" className="pr-5" onPress={() => snackbar("Workspace created — check your inbox")}>
                Start free
                <Icon>arrow_forward</Icon>
              </Button>
              <Button size="md" variant="outlined" onPress={() => snackbar("An engineer will reach out within a day")}>
                Read the manifesto
              </Button>
            </div>
          </div>
        </StaggerIn>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <DisclosureGroup allowsMultipleExpanded className="border-t border-on-surface pb-24">
          {CHAPTERS.map(([title, body], i) => (
            <Reveal key={title} className="border-b border-outline-variant">
              <Disclosure className="group">
                <Heading level={2}>
                  <AriaButton
                    slot="trigger"
                    className="state-layer focus-ring grid w-full cursor-pointer grid-cols-[56px_1fr_auto] items-center gap-4 py-6 text-start outline-none md:grid-cols-[120px_1fr_auto] md:py-8"
                  >
                    <span className="font-mono text-title-lg text-tertiary">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-headline-sm font-medium md:text-display-sm">{title}</span>
                    <span className="grid size-12 place-items-center rounded-full border border-outline-variant transition-[rotate,background-color,border-color,color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-data-expanded:rotate-45 group-data-expanded:border-transparent group-data-expanded:bg-tertiary group-data-expanded:text-on-tertiary">
                      <Icon>add</Icon>
                    </span>
                  </AriaButton>
                </Heading>
                <DisclosurePanel className="h-(--disclosure-panel-height) overflow-clip transition-[height] duration-(--md-spring-default-spatial-duration) ease-default-spatial motion-reduce:transition-none">
                  <p className="max-w-2xl pb-8 pl-[72px] text-title-lg font-normal text-on-surface-variant md:pl-[136px]">{body}</p>
                </DisclosurePanel>
              </Disclosure>
            </Reveal>
          ))}
        </DisclosureGroup>
      </section>
      <SimpleFooter />
    </div>
  )
}
