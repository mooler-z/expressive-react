"use client"

import * as React from "react"

import { PageIntro } from "@/components/blocks/landing/landing-shared"
import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/* Changelog · feed canonical layout: subscribe, filter chips, release cards (latest one spans the row). */

type Tag = "Feature" | "Fix" | "Security"

const TAG_TONE: Record<Tag, string> = {
  Feature: "bg-primary-container text-on-primary-container",
  Fix: "bg-secondary-container text-on-secondary-container",
  Security: "bg-error-container text-on-error-container",
}

const RELEASES: { version: string; date: string; tag: Tag; title: string; body: string; items: string[] }[] = [
  {
    version: "v4.2.0",
    date: "Oct 21, 2026",
    tag: "Feature",
    title: "Policy previews and the expanded navigation rail",
    body: "See exactly which resources a policy would block before enabling it. The console adopts M3 Expressive: expanded rail on large windows, flexible app bars, and the new loading indicator.",
    items: [
      "Policy preview runs against live inventory in under 2 s",
      "Rollouts 30% faster with parallel region promotion",
      "Expanded rail remembers its state per workspace",
    ],
  },
  {
    version: "v4.1.8",
    date: "Oct 7, 2026",
    tag: "Fix",
    title: "Scheduler alert noise, Tokyo latency",
    body: "Retry storms no longer trip the scheduler alert; a 30 s cool-down and a higher threshold ship as defaults.",
    items: [
      "Scheduler alert threshold raised from 3 to 5 retries",
      "ap-northeast-1 p95 improved 18% after connection pooling fix",
      "CLI: `kestrel diff` respects .kestrelignore",
    ],
  },
  {
    version: "v4.1.5",
    date: "Sep 23, 2026",
    tag: "Security",
    title: "CVE scanning at deploy time",
    body: "Images with critical CVEs are blocked at deploy unless an exception with an expiry date is attached.",
    items: [
      "Trivy and Grype results merged into one verdict",
      "Exceptions require an owner and expire in 30 days by default",
      "SBOM export in SPDX and CycloneDX",
    ],
  },
  {
    version: "v4.1.0",
    date: "Sep 2, 2026",
    tag: "Feature",
    title: "Cost attribution per team",
    body: "Spend is attributed to owning teams using the same ownership graph that routes your incidents.",
    items: [
      "Daily cost per team, service and environment",
      "Budget alerts via Slack and PagerDuty",
      "Reserved-capacity recommendations with projected savings",
    ],
  },
]

const FILTERS = ["All", "Feature", "Fix", "Security"] as const
type Filter = (typeof FILTERS)[number]

function Subscribe() {
  const [email, setEmail] = React.useState("")
  return (
    <form
      className="w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault()
        setEmail("")
        snackbar("Subscribed — see you in two weeks")
      }}
    >
      <InputGroup variant="pill">
        <InputGroupAddon variant="plain">
          <Icon>mail</Icon>
        </InputGroupAddon>
        <InputGroupInput
          type="email"
          aria-label="Email for the changelog digest"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" className="h-11 px-5">
          Subscribe
        </Button>
      </InputGroup>
    </form>
  )
}

export function LandingChangelog() {
  const [filter, setFilter] = React.useState<Filter>("All")
  const shown = RELEASES.filter((r) => filter === "All" || r.tag === filter)

  return (
    <>
      <PageIntro
        title="What shipped, every two weeks."
        aside={<Subscribe />}
        footer={
          <ChipGroup
            aria-label="Filter releases"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[filter]}
            onSelectionChange={(keys) => {
              const [k] = [...keys]
              if (k) setFilter(k as Filter)
            }}
          >
            {FILTERS.map((f) => (
              <FilterChip key={f} id={f}>
                {f}
              </FilterChip>
            ))}
          </ChipGroup>
        }
      >
        No marketing in here, just the diff.
      </PageIntro>

      <section className="grid gap-4 px-4 pb-16 md:px-6 lg:grid-cols-2 lg:px-10">
        {shown.map((r, i) => (
          <article
            key={r.version}
            className={cn(
              "rounded-xl p-6 md:p-8",
              i === 0 ? "bg-primary-container text-on-primary-container lg:col-span-2" : "bg-surface-container-low text-on-surface",
            )}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-sm bg-surface px-2 py-0.5 font-mono text-label-lg text-on-surface">{r.version}</span>
              <span className="text-body-md">{r.date}</span>
              <span className={cn("rounded-sm px-2 py-0.5 text-label-md", TAG_TONE[r.tag])}>{r.tag}</span>
            </div>
            <h2 className="mt-4 text-headline-sm font-medium">{r.title}</h2>
            <p className="mt-2 max-w-2xl text-body-lg">{r.body}</p>
            <ul className="mt-4 space-y-2 text-body-md">
              {r.items.map((it) => (
                <li key={it} className="flex items-start gap-3">
                  <Icon size={20}>arrow_right</Icon>
                  {it}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </>
  )
}
