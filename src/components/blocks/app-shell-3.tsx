"use client"

import * as React from "react"
import { Button as AriaButton, ToggleButton, ToggleButtonGroup } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * App shell 03 · Top nav + environments
 * Inverse top bar with horizontal destinations and a Production / Staging / Dev switch.
 * Non-production environments get a persistent banner. Shown on an event detail page.
 */

const DESTINATIONS = ["Overview", "Events", "Players", "Economy", "Moderation", "Servers"]

const ENVS = [
  { id: "prod", label: "Production" },
  { id: "staging", label: "Staging" },
  { id: "dev", label: "Dev" },
] as const

const REGIONS = ["NA-East", "EU-West", "APAC-Tokyo", "SA-São Paulo"]

const REWARDS = [
  { icon: "bolt", box: "bg-primary-container text-on-primary-container", title: "2× match XP", sub: "All modes except Ranked" },
  { icon: "diamond", box: "bg-tertiary-container text-on-tertiary-container", title: "+50% Ember Shards", sub: "Daily cap 1,500 per player" },
  { icon: "flag", box: "bg-secondary-container text-on-secondary-container", title: "Frostfire banner", sub: "Log in on 2 days of the event" },
]

const CHECKLIST = [
  { label: "Rewards QA signed off", done: true },
  { label: "Localized in 12 languages", done: true },
  { label: "Server capacity reserved", done: true },
  { label: "Community post drafted", done: false },
  { label: "On-call engineer assigned", done: false },
]

export function AppShell3({ className }: { className?: string }) {
  const [page, setPage] = React.useState("Events")
  const [env, setEnv] = React.useState<(typeof ENVS)[number]["id"]>("prod")
  const [publish, setPublish] = React.useState<"idle" | "busy" | "done">("idle")
  const envLabel = ENVS.find((e) => e.id === env)!.label

  React.useEffect(() => {
    if (publish !== "busy") return
    const t = setTimeout(() => setPublish("done"), 1400)
    return () => clearTimeout(t)
  }, [publish])

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-surface", className)}>
      <header className="flex h-16 shrink-0 items-center gap-1 bg-inverse-surface px-2 text-inverse-on-surface md:px-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-inverse-primary text-inverse-surface">
          <Icon size={20} filled>
            stadia_controller
          </Icon>
        </span>
        <span className="mr-3 ml-2 hidden text-title-md font-semibold sm:inline">Lumen</span>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {DESTINATIONS.map((d) => (
            <AriaButton
              key={d}
              onPress={() => setPage(d)}
              aria-current={page === d ? "page" : undefined}
              className={cn(
                "state-layer focus-ring inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-label-lg",
                page === d && "bg-inverse-primary text-inverse-surface",
              )}
            >
              {d}
            </AriaButton>
          ))}
        </nav>
        <span className="flex-1" />
        <ToggleButtonGroup
          aria-label="Environment"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[env]}
          onSelectionChange={(keys) => setEnv([...keys][0] as typeof env)}
          className="flex items-center gap-0.5 rounded-full border border-inverse-on-surface/30 p-0.5"
        >
          {ENVS.map((v) => (
            <ToggleButton
              key={v.id}
              id={v.id}
              className="focus-ring inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-label-md text-inverse-on-surface shape-morph data-selected:bg-inverse-primary data-selected:text-inverse-surface"
            >
              {v.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <span className="ml-2 hidden size-8 shrink-0 place-items-center rounded-full bg-inverse-primary text-label-lg text-inverse-surface sm:grid">
          MO
        </span>
      </header>

      {env !== "prod" && (
        <div role="status" className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 bg-tertiary-container px-4 py-2 text-body-md text-on-tertiary-container md:px-6">
          <Icon size={20}>science</Icon>
          <span className="flex-1">
            You're on <span className="font-medium">{envLabel}</span>. Changes here never reach live players.
          </span>
          <Button variant="text" size="xs" className="text-current" onPress={() => setEnv("prod")}>
            Switch to Production
          </Button>
        </div>
      )}

      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-outline-variant px-4 py-3 md:px-6">
        <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1 text-label-lg text-on-surface-variant">
          <AriaButton
            onPress={() => setPage("Events")}
            className="state-layer focus-ring inline-flex h-8 cursor-pointer items-center rounded-full px-2"
          >
            Events
          </AriaButton>
          <Icon size={18}>chevron_right</Icon>
          <span aria-current="page" className="truncate px-2 text-title-md text-on-surface">
            Double XP Weekend
          </span>
          <span className="inline-flex h-6 shrink-0 items-center rounded-sm bg-tertiary-container px-2 text-label-md text-on-tertiary-container">
            Scheduled
          </span>
        </nav>
        <Button variant="outlined" onPress={() => snackbar("Preview link copied for QA")}>
          Preview
        </Button>
        <Button
          className="pr-4 pl-3"
          isPending={publish === "busy"}
          onPress={() => setPublish("busy")}
          isDisabled={publish === "done"}
        >
          {publish === "idle" && <Icon>rocket_launch</Icon>}
          {publish === "done" && <Icon>check</Icon>}
          {publish === "idle" ? "Publish" : publish === "busy" ? "Publishing…" : "Published"}
        </Button>
      </div>

      <main className="relative min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <div className="rounded-lg bg-surface-container-low p-5">
              <h5 className="text-title-md">Schedule</h5>
              <dl className="mt-3 grid gap-4 sm:grid-cols-3">
                {[
                  ["Starts", "Fri, Oct 30 · 18:00 UTC"],
                  ["Ends", "Mon, Nov 2 · 06:00 UTC"],
                  ["Duration", "60 hours"],
                ].map(([dt, dd]) => (
                  <div key={dt}>
                    <dt className="text-body-sm text-on-surface-variant">{dt}</dt>
                    <dd className="mt-0.5 text-body-lg">{dd}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <span
                    key={r}
                    className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-secondary-container px-3 text-label-lg text-on-secondary-container"
                  >
                    <Icon size={18}>public</Icon>
                    {r}
                  </span>
                ))}
                <AriaButton
                  onPress={() => snackbar("OCE-Sydney added to the event")}
                  className="state-layer focus-ring inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant"
                >
                  <Icon size={18}>add</Icon>
                  OCE-Sydney
                </AriaButton>
              </div>
            </div>
            <div className="rounded-lg bg-surface-container-low p-5">
              <h5 className="text-title-md">Rewards</h5>
              <ul className="mt-2 divide-y divide-outline-variant/60">
                {REWARDS.map((r) => (
                  <li key={r.title} className="flex items-center gap-4 py-3">
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-md", r.box)}>
                      <Icon size={20}>{r.icon}</Icon>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-title-sm">{r.title}</div>
                      <div className="text-body-sm text-on-surface-variant">{r.sub}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="self-start rounded-lg bg-surface-container-low p-5">
            <h5 className="text-title-md">Launch checklist</h5>
            <p className="mt-0.5 text-body-sm text-on-surface-variant">Required before publishing to Production</p>
            <div className="mt-2 flex flex-col">
              {CHECKLIST.map((c) => (
                <Checkbox key={c.label} defaultSelected={c.done} className="-ml-1 text-body-md">
                  {c.label}
                </Checkbox>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
