"use client"

import * as React from "react"
import { Button as AriaButton } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import {
  NavigationRail,
  NavigationRailFab,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailMenuButton,
} from "@/components/ui/navigation-rail"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * App shell 01 · Rail + top bar
 * Navigation rail with FAB and badges; title switcher, search and alerts in the top bar.
 * Below 600px the rail becomes a bottom navigation bar.
 */

const DESTINATIONS = [
  { value: "overview", icon: "space_dashboard", label: "Overview" },
  { value: "events", icon: "celebration", label: "Events" },
  { value: "players", icon: "group", label: "Players" },
  { value: "economy", icon: "storefront", label: "Economy" },
  { value: "moderation", icon: "gavel", label: "Moderation", badge: 12 },
  { value: "servers", icon: "dns", label: "Servers" },
]

/** Destinations kept in the bottom bar on compact windows. */
const COMPACT = ["overview", "events", "players", "moderation"]

const TITLES = [
  { id: "Ember Tactics", initials: "ET", platforms: "PC · PS5 · Xbox Series", box: "bg-tertiary-container text-on-tertiary-container" },
  { id: "Tidebreak", initials: "TB", platforms: "iOS · Android", box: "bg-primary-container text-on-primary-container" },
  { id: "Arena (beta)", initials: "AR", platforms: "Closed playtest", box: "bg-secondary-container text-on-secondary-container" },
]

const KPIS = [
  { label: "Concurrent players", icon: "groups", value: "182,406", delta: "+6.2% vs last Saturday", up: true },
  { label: "Daily active", icon: "sports_esports", value: "1.24M", delta: "+3.1% week over week", up: true },
  { label: "Revenue today", icon: "payments", value: "$412.8K", delta: "+8.4% vs forecast", up: true },
  { label: "Crash-free sessions", icon: "health_and_safety", value: "99.62%", delta: "−0.08 pts since 7.2.1", up: false },
]

const LIVE_NOW = [
  { name: "Season 7 · Frostfire", icon: "ac_unit", box: "bg-primary-container text-on-primary-container", left: "19 days left", pct: 55 },
  { name: "Ranked Split 2", icon: "military_tech", box: "bg-tertiary-container text-on-tertiary-container", left: "6 days left", pct: 72 },
  { name: "Frostfire Pass sale", icon: "sell", box: "bg-secondary-container text-on-secondary-container", left: "2 days left", pct: 40 },
]

const REGIONS = [
  { name: "NA-East", ok: true, ms: "38 ms", ccu: "71k" },
  { name: "EU-West", ok: true, ms: "24 ms", ccu: "58k" },
  { name: "APAC-Tokyo", ok: true, ms: "41 ms", ccu: "33k" },
  { name: "SA-São Paulo", ok: false, ms: "96 ms", ccu: "14k" },
  { name: "OCE-Sydney", ok: true, ms: "52 ms", ccu: "6k" },
]

export function AppShell1({ className }: { className?: string }) {
  const [page, setPage] = React.useState("overview")
  const [title, setTitle] = React.useState(TITLES[0].id)
  const [alerts, setAlerts] = React.useState(3)
  const current = TITLES.find((t) => t.id === title)!

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-surface-container md:flex-row", className)}>
      <NavigationRail value={page} onValueChange={setPage} surface="transparent" narrow className="hidden md:flex">
        <NavigationRailHeader>
          <NavigationRailMenuButton />
          <NavigationRailFab
            icon="add"
            label="New live event"
            onPress={() => snackbar("Draft live event created", { action: { label: "Open", onAction: () => {} } })}
          />
        </NavigationRailHeader>
        {DESTINATIONS.map((d) => (
          <NavigationRailItem key={d.value} {...d} badgeLabel={d.badge ? `${d.badge} open reports` : undefined} />
        ))}
      </NavigationRail>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:py-3 md:pr-3">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface md:rounded-xl">
          <header className="flex h-16 shrink-0 items-center gap-1 px-2 md:gap-2 md:px-4">
            <MenuTrigger>
              <AriaButton
                aria-label="Switch title"
                className="state-layer focus-ring inline-flex h-10 cursor-pointer items-center gap-2 rounded-full pr-2 pl-1 text-title-sm"
              >
                <span className={cn("grid size-8 place-items-center rounded-md text-label-md", current.box)}>{current.initials}</span>
                <span className="max-w-[9rem] truncate">{current.id}</span>
                <Icon size={20} className="text-on-surface-variant">
                  expand_more
                </Icon>
              </AriaButton>
              <MenuPopover placement="bottom start">
                <Menu
                  aria-label="Titles"
                  selectionMode="single"
                  selectedKeys={[title]}
                  onAction={(k) => setTitle(String(k))}
                  className="w-64"
                >
                  {TITLES.map((t) => (
                    <MenuItem
                      key={t.id}
                      id={t.id}
                      leading={<span className={cn("grid size-8 place-items-center rounded-md text-label-md", t.box)}>{t.initials}</span>}
                      description={t.platforms}
                    >
                      {t.id}
                    </MenuItem>
                  ))}
                </Menu>
              </MenuPopover>
            </MenuTrigger>

            <label className="ml-2 hidden h-12 max-w-md flex-1 items-center gap-2 rounded-full bg-surface-container-high pr-2 pl-4 text-on-surface-variant lg:flex">
              <Icon size={20}>search</Icon>
              <input
                type="search"
                placeholder="Search players, events, SKUs"
                className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
              />
              <kbd className="rounded-xs border border-outline-variant px-1.5 font-mono text-label-sm">/</kbd>
            </label>
            <span className="flex-1" />
            <span className="hidden h-8 items-center gap-1.5 rounded-sm border border-outline-variant px-2.5 text-label-md text-on-surface-variant sm:inline-flex">
              <span className="size-2 rounded-full bg-primary" />
              Production
            </span>
            <div className="relative">
              <IconButton
                aria-label={alerts ? `Notifications, ${alerts} unread` : "Notifications"}
                onPress={() => {
                  if (alerts) snackbar(`${alerts} alerts marked as read`)
                  setAlerts(0)
                }}
              >
                <Icon>notifications</Icon>
              </IconButton>
              {alerts > 0 && (
                <span className="pointer-events-none absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-label-sm text-on-error">
                  {alerts}
                </span>
              )}
            </div>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary-container text-label-lg text-on-secondary-container">
              MO
            </span>
          </header>

          <main className="relative min-h-0 flex-1 overflow-y-auto px-4 pb-6 md:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3 pt-1 pb-5">
              <div>
                <div className="text-body-sm text-on-surface-variant">Season 7 · Frostfire · day 23 of 42</div>
                <h4 className="text-headline-sm font-medium">Overview</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outlined"
                  className="pr-4 pl-3"
                  onPress={() => snackbar("Exporting overview as CSV…", { action: { label: "Cancel", onAction: () => {} } })}
                >
                  <Icon>download</Icon>
                  Export
                </Button>
                <Button
                  className="pr-4 pl-3"
                  onPress={() =>
                    snackbar("Double XP Weekend scheduled for Fri 18:00 UTC", { action: { label: "Undo", onAction: () => {} } })
                  }
                >
                  <Icon>event</Icon>
                  Schedule event
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {KPIS.map((k) => (
                <div key={k.label} className="rounded-lg bg-surface-container-low p-4">
                  <div className="flex items-center justify-between gap-2 text-body-md text-on-surface-variant">
                    <span className="truncate">{k.label}</span>
                    <Icon size={20}>{k.icon}</Icon>
                  </div>
                  <div className="mt-2 text-headline-sm font-medium tabular-nums">{k.value}</div>
                  <div className={cn("mt-1 inline-flex items-center gap-1 text-label-md", k.up ? "text-primary" : "text-error")}>
                    <Icon size={16}>{k.up ? "trending_up" : "trending_down"}</Icon>
                    {k.delta}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div className="rounded-lg bg-surface-container-low p-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-title-md">Live events</h5>
                  <Button variant="text" size="xs" onPress={() => setPage("events")}>
                    All events
                    <Icon size={18}>arrow_forward</Icon>
                  </Button>
                </div>
                <ul className="mt-1 divide-y divide-outline-variant/60">
                  {LIVE_NOW.map((e) => (
                    <li key={e.name} className="flex items-center gap-3 py-3">
                      <span className={cn("grid size-10 shrink-0 place-items-center rounded-md", e.box)}>
                        <Icon size={20}>{e.icon}</Icon>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-title-sm">{e.name}</span>
                          <span className="shrink-0 text-body-sm text-on-surface-variant">{e.left}</span>
                        </div>
                        <div
                          role="progressbar"
                          aria-label={`${e.name} progress`}
                          aria-valuenow={e.pct}
                          className="mt-2 flex h-1.5 items-center gap-1"
                        >
                          <div className="h-full rounded-full bg-primary" style={{ width: `${e.pct}%` }} />
                          <div className="h-full flex-1 rounded-full bg-secondary-container" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-surface-container-low p-4">
                <h5 className="text-title-md">Region health</h5>
                <ul className="mt-3 space-y-3">
                  {REGIONS.map((r) => (
                    <li key={r.name} className="flex items-center gap-3 text-body-md">
                      <span className={cn("size-2 shrink-0 rounded-full", r.ok ? "bg-primary" : "bg-error")} />
                      <span className="flex-1 truncate">{r.name}</span>
                      <span className="font-mono text-body-sm text-on-surface-variant">{r.ms}</span>
                      <span className="w-10 text-right text-on-surface-variant tabular-nums">{r.ccu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>

      <NavigationBar value={page} onValueChange={setPage} className="md:hidden">
        {DESTINATIONS.filter((d) => COMPACT.includes(d.value)).map((d) => (
          <NavigationBarItem key={d.value} value={d.value} icon={d.icon} label={d.label} badge={d.badge} />
        ))}
      </NavigationBar>
    </div>
  )
}
