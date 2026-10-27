"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * User profile 02 · Player support timeline
 * Key facts and open tickets on the left, a filterable activity timeline on the right.
 * Internal notes post straight into the timeline.
 */

type Kind = "Purchases" | "Moderation" | "Sessions" | "Notes"
type Entry = { kind: Kind; icon: string; title: string; meta: string; time: string; tone: string }

const TIMELINE: Entry[] = [
  { kind: "Moderation", icon: "gavel", title: "Report opened · Aimbot suspected", meta: "R-2291 · 14 reports from 9 players", time: "Today, 14:12", tone: "bg-error-container text-on-error-container" },
  { kind: "Sessions", icon: "login", title: "Signed in on PC · EU-West", meta: "Steam client · 4 h 20 min session", time: "Today, 09:51", tone: "bg-surface-container-highest text-on-surface-variant" },
  { kind: "Purchases", icon: "shopping_bag", title: "Bought Frostfire Pass", meta: "$9.99 · Steam", time: "Oct 3", tone: "bg-primary-container text-on-primary-container" },
  { kind: "Purchases", icon: "shopping_bag", title: "Bought 5,000 Ember Shards", meta: "$39.99 · Steam", time: "Sep 28", tone: "bg-primary-container text-on-primary-container" },
  { kind: "Moderation", icon: "campaign", title: "Warned · Map exploit at Harbor", meta: "By Kenji Watanabe", time: "Aug 21", tone: "bg-tertiary-container text-on-tertiary-container" },
  { kind: "Sessions", icon: "link", title: "Linked a PlayStation account", meta: "PSN · Valkyr_ie", time: "Mar 2023", tone: "bg-surface-container-highest text-on-surface-variant" },
]

const FILTERS = ["All", "Purchases", "Moderation", "Sessions", "Notes"] as const
type Filter = (typeof FILTERS)[number]

const FACTS: [string, React.ReactNode][] = [
  ["Region", "EU-West"],
  ["Platform", "PC · Steam"],
  ["Account age", "3 years, 7 months"],
  ["Lifetime spend", <span className="tabular-nums">$3,310.75</span>],
  ["Support tier", <span className="inline-flex h-6 items-center rounded-sm bg-primary-container px-2 text-label-md text-on-primary-container">VIP</span>],
  [
    "Last seen",
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 rounded-full bg-primary" />
      Online now
    </span>,
  ],
]

export function UserProfile2({ className }: { className?: string }) {
  const [filter, setFilter] = React.useState<Filter>("All")
  const [notes, setNotes] = React.useState<string[]>([])
  const [draft, setDraft] = React.useState("")

  const entries: Entry[] = [
    ...notes.map((n) => ({ kind: "Notes" as const, icon: "sticky_note_2", title: n, meta: "Maya Ortiz · internal note", time: "Just now", tone: "bg-secondary-container text-on-secondary-container" })),
    ...TIMELINE,
  ].filter((e) => filter === "All" || e.kind === filter)

  const addNote = () => {
    const text = draft.trim()
    if (!text) return
    setNotes((n) => [text, ...n])
    setDraft("")
    if (filter !== "All" && filter !== "Notes") setFilter("All")
    snackbar("Note added to the player record")
  }

  return (
    <div className={cn("grid gap-3 bg-surface-container-low p-4 md:p-6 lg:grid-cols-[300px_minmax(0,1fr)]", className)}>
      <aside className="space-y-3">
        <div className="rounded-xl bg-surface p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-tertiary-container text-title-md text-on-tertiary-container">V</span>
            <div className="min-w-0">
              <div className="truncate text-title-md">Valkyr.ie</div>
              <div className="font-mono text-body-sm text-on-surface-variant">P-11934082</div>
            </div>
          </div>
          <dl className="mt-4 space-y-2.5 text-body-md">
            {FACTS.map(([dt, dd]) => (
              <div key={dt} className="flex justify-between gap-3">
                <dt className="text-on-surface-variant">{dt}</dt>
                <dd>{dd}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-xl bg-surface p-5">
          <div className="text-title-sm">Open tickets</div>
          <ul className="mt-2 space-y-2">
            <li className="rounded-lg bg-surface-container-low p-3">
              <div className="text-body-md">Can't claim Frostfire Pass reward</div>
              <div className="text-body-sm text-on-surface-variant">#48213 · waiting on support · 2 h</div>
            </li>
            <li className="rounded-lg bg-surface-container-low p-3">
              <div className="text-body-md">Appeal: report R-2291</div>
              <div className="text-body-sm text-on-surface-variant">#48207 · new · 6 min</div>
            </li>
          </ul>
        </div>
      </aside>

      <div className="min-w-0 rounded-xl bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h4 className="text-title-lg font-medium">Activity</h4>
          <ChipGroup
            aria-label="Filter activity"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[filter]}
            onSelectionChange={(k) => setFilter([...k][0] as Filter)}
          >
            {FILTERS.map((f) => (
              <FilterChip key={f} id={f}>
                {f}
              </FilterChip>
            ))}
          </ChipGroup>
        </div>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            addNote()
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add an internal note…"
            aria-label="Internal note"
            className="h-12 min-w-0 flex-1 rounded-full bg-surface-container-high px-5 text-body-md text-on-surface outline-none placeholder:text-on-surface-variant focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="md" className="h-12 shrink-0 px-5 text-label-lg" isDisabled={!draft.trim()}>
            Add note
          </Button>
        </form>
        <ol className="mt-5">
          {entries.map((e, i) => (
            <li key={`${e.title}-${i}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-full", e.tone)}>
                  <Icon size={20}>{e.icon}</Icon>
                </span>
                {i < entries.length - 1 && <span className="my-1 w-0.5 flex-1 rounded-full bg-outline-variant" />}
              </div>
              <div className="min-w-0 flex-1 pt-1 pb-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-title-sm">{e.title}</span>
                  <span className="text-body-sm text-on-surface-variant">{e.time}</span>
                </div>
                <div className="text-body-md text-on-surface-variant">{e.meta}</div>
              </div>
            </li>
          ))}
        </ol>
        {entries.length === 0 && <p className="py-8 text-center text-body-md text-on-surface-variant">Nothing in this category yet.</p>}
      </div>
    </div>
  )
}
