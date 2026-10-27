"use client"

import * as React from "react"
import { Form, Input, TextField } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

type Tag = "Feature" | "Fix" | "Security"

const TAG_TONE: Record<Tag, { tag: string; dot: string }> = {
  Feature: { tag: "bg-primary-container text-on-primary-container", dot: "bg-primary" },
  Fix: { tag: "bg-secondary-container text-on-secondary-container", dot: "bg-secondary" },
  Security: { tag: "bg-error-container text-on-error-container", dot: "bg-error" },
}

export const RELEASES: { version: string; date: string; tag: Tag; title: string; body: string; items: string[] }[] = [
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

/** Pill email field + Subscribe button. */
export function SubscribeForm({ className }: { className?: string }) {
  const [email, setEmail] = React.useState("")
  return (
    <Form
      className={cn("flex w-full max-w-md items-center gap-2 rounded-full bg-surface-container-high pr-1.5 pl-5", className)}
      onSubmit={(e) => {
        e.preventDefault()
        setEmail("")
        snackbar("Subscribed — see you in two weeks")
      }}
    >
      <Icon className="text-on-surface-variant">mail</Icon>
      <TextField aria-label="Email" type="email" value={email} onChange={setEmail} className="min-w-0 flex-1">
        <Input
          placeholder="you@company.com"
          className="h-14 w-full bg-transparent text-body-lg text-on-surface outline-none placeholder:text-on-surface-variant"
        />
      </TextField>
      <Button type="submit" className="h-11 px-5">
        Subscribe
      </Button>
    </Form>
  )
}

const FILTERS = ["All", "Feature", "Fix", "Security"] as const
type Filter = (typeof FILTERS)[number]

function useFilter() {
  const [filter, setFilter] = React.useState<Filter>("All")
  const chips = (
    <ChipGroup
      aria-label="Filter releases"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[filter]}
      onSelectionChange={(keys) => setFilter(([...keys][0] as Filter) ?? "All")}
      className="flex flex-wrap gap-2"
    >
      {FILTERS.map((f) => (
        <FilterChip key={f} id={f}>
          {f}
        </FilterChip>
      ))}
    </ChipGroup>
  )
  const shown = RELEASES.filter((r) => filter === "All" || r.tag === filter)
  return { chips, shown }
}

function Intro({ compact }: { compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <h1
          className={cn(
            "mt-2 text-display-sm font-semibold tracking-tight text-balance",
            compact ? "lg:text-display-md" : "md:text-display-md",
          )}
        >
          What shipped, every two weeks.
        </h1>
        <p className="mt-4 text-body-lg text-on-surface-variant">No marketing in here, just the diff.</p>
      </div>
      <SubscribeForm />
    </div>
  )
}

function ReleaseMeta({ r, versionClassName }: { r: (typeof RELEASES)[number]; versionClassName?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={cn("rounded-sm px-2 py-0.5 font-mono text-label-lg", versionClassName)}>{r.version}</span>
      <span className="text-body-md opacity-80">{r.date}</span>
      <span className={cn("rounded-sm px-2 py-0.5 text-label-md", TAG_TONE[r.tag].tag)}>{r.tag}</span>
    </div>
  )
}

/** Changelog as a vertical timeline. */
export function ChangelogTimeline() {
  const { chips, shown } = useFilter()
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-8 pb-8 md:px-8 lg:pt-12">
        <Intro />
        <div className="mt-8">{chips}</div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <ol className="relative ml-3 border-l-2 border-outline-variant md:ml-6">
          {shown.map((r) => (
            <li key={r.version} className="relative pb-10 pl-8 md:pl-12">
              <Reveal>
                <span className={cn("absolute top-2 -left-[9px] size-4 rounded-full ring-4 ring-surface", TAG_TONE[r.tag].dot)} />
                <ReleaseMeta r={r} versionClassName="bg-surface-container-high" />
                <h2 className="mt-3 text-headline-sm font-medium">{r.title}</h2>
                <p className="mt-2 max-w-2xl text-body-lg text-on-surface-variant">{r.body}</p>
                <ul className="mt-4 space-y-2 text-body-md">
                  {r.items.map((it) => (
                    <li key={it} className="flex items-start gap-3">
                      <Icon size={20} className="text-primary">
                        arrow_right
                      </Icon>
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

/** Changelog in the M3 feed canonical layout: a card grid, newest release spanning two columns. */
export function ChangelogFeed() {
  const { chips, shown } = useFilter()
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-6 md:px-8 lg:pt-14">
        <Intro compact />
        <div className="mt-6">{chips}</div>
      </section>
      <section className="grid gap-4 px-4 pb-16 md:px-6 lg:grid-cols-2 lg:px-10">
        {shown.map((r, i) => (
          <article
            key={r.version}
            className={cn(
              "rounded-xl p-6 md:p-8",
              i === 0 ? "bg-primary-container text-on-primary-container lg:col-span-2" : "bg-surface-container-low text-on-surface",
            )}
          >
            <ReleaseMeta r={r} versionClassName="bg-surface text-on-surface" />
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
