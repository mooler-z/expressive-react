"use client"

import * as React from "react"
import { Button as AriaButton, DialogTrigger } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import {
  ModalNavigationDrawer,
  NavigationDrawer,
  NavigationDrawerHeadline,
  NavigationDrawerItem,
} from "@/components/ui/navigation-drawer"
import { snackbar } from "@/components/ui/snackbar"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/*
 * App shell 02 · Drawer + tabs
 * Standard drawer with a title card and grouped destinations. Tabs filter the page.
 * Below 840px the drawer opens as a modal from the menu button.
 */

type Status = "Running" | "Scheduled" | "Draft" | "Ended"

const STATUS: Record<Status, { chip: string; dot: string }> = {
  Running: { chip: "bg-primary-container text-on-primary-container", dot: "bg-primary" },
  Scheduled: { chip: "bg-tertiary-container text-on-tertiary-container", dot: "bg-tertiary" },
  Draft: { chip: "bg-surface-container-highest text-on-surface-variant", dot: "bg-outline" },
  Ended: { chip: "border border-outline-variant text-on-surface-variant", dot: "bg-outline-variant" },
}

const BOX = {
  primary: "bg-primary-container text-on-primary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  neutral: "bg-surface-container-highest text-on-surface-variant",
}

const EVENTS: { name: string; type: string; icon: string; box: keyof typeof BOX; when: string; audience: string; status: Status }[] = [
  { name: "Season 7 · Frostfire", type: "Season", icon: "ac_unit", box: "primary", when: "Oct 3 – Nov 14", audience: "All players", status: "Running" },
  { name: "Ranked Split 2", type: "Competitive", icon: "military_tech", box: "tertiary", when: "Oct 10 – Nov 1", audience: "Level 30+", status: "Running" },
  { name: "Frostfire Pass sale", type: "Store", icon: "sell", box: "secondary", when: "Oct 24 – Oct 27", audience: "Lapsed payers", status: "Running" },
  { name: "Double XP Weekend", type: "Boost", icon: "bolt", box: "primary", when: "Oct 30 · 18:00 UTC", audience: "All players", status: "Scheduled" },
  { name: "Hollow Night", type: "Seasonal", icon: "dark_mode", box: "tertiary", when: "Oct 31 – Nov 3", audience: "All regions", status: "Scheduled" },
  { name: "Coral Cup", type: "Tournament", icon: "emoji_events", box: "secondary", when: "Nov 8 · 16:00 UTC", audience: "Invite only", status: "Scheduled" },
  { name: "Starter bundle v3", type: "Store · A/B test", icon: "redeem", box: "neutral", when: "Not scheduled", audience: "New players, day 0–3", status: "Draft" },
  { name: "Summer Solstice", type: "Seasonal", icon: "wb_sunny", box: "neutral", when: "Jun 20 – Jul 4", audience: "All players", status: "Ended" },
]

const TABS: { id: "all" | Status; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Running", label: "Running" },
  { id: "Scheduled", label: "Scheduled" },
  { id: "Draft", label: "Drafts" },
  { id: "Ended", label: "Ended" },
]

const NAV = [
  {
    title: "Operate",
    items: [
      { value: "overview", icon: "space_dashboard", label: "Overview" },
      { value: "events", icon: "celebration", label: "Live events", count: 8 },
      { value: "store", icon: "storefront", label: "Store & offers" },
      { value: "matchmaking", icon: "hub", label: "Matchmaking" },
    ],
  },
  {
    title: "Players",
    items: [
      { value: "directory", icon: "group", label: "Directory" },
      { value: "moderation", icon: "gavel", label: "Moderation", alert: 12 },
      { value: "support", icon: "support_agent", label: "Support tickets", count: 5 },
    ],
  },
  {
    title: "Insights",
    items: [
      { value: "analytics", icon: "monitoring", label: "Analytics" },
      { value: "experiments", icon: "science", label: "Experiments" },
    ],
  },
]

function DrawerContents({ page, onPage, onClose }: { page: string; onPage: (v: string) => void; onClose?: () => void }) {
  return (
    <div className="relative flex h-full flex-col overflow-y-auto p-3 no-scrollbar">
      <div className="flex h-12 items-center gap-2 px-2">
        <span className="grid size-8 place-items-center rounded-md bg-primary text-on-primary">
          <Icon size={20} filled>
            stadia_controller
          </Icon>
        </span>
        <span className="flex-1 text-title-md">
          <span className="font-semibold">Lumen</span> <span className="text-on-surface-variant">Live ops</span>
        </span>
        {onClose && (
          <IconButton aria-label="Close navigation" onPress={onClose}>
            <Icon>close</Icon>
          </IconButton>
        )}
      </div>
      <AriaButton
        onPress={() => snackbar("Switch between Ember Tactics, Tidebreak and Arena")}
        className="state-layer focus-ring mt-3 flex shrink-0 cursor-pointer items-center gap-3 rounded-lg bg-surface-container-high p-3 text-left"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-tertiary-container text-label-lg text-on-tertiary-container">ET</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-title-sm">Ember Tactics</span>
          <span className="block truncate text-body-sm text-on-surface-variant">Season 7 · Production</span>
        </span>
        <Icon className="text-on-surface-variant">unfold_more</Icon>
      </AriaButton>
      <NavigationDrawer variant="plain" dense aria-label="Destinations" value={page} onValueChange={onPage} className="mt-2 gap-0.5">
        {NAV.map((g) => (
          <React.Fragment key={g.title}>
            <NavigationDrawerHeadline className="px-4 pt-3 pb-1">{g.title}</NavigationDrawerHeadline>
            {g.items.map((item) => (
              <NavigationDrawerItem
                key={item.value}
                value={item.value}
                icon={item.icon}
                badge={item.count}
                badgeLabel={item.count ? `${item.count} items` : undefined}
              >
                {item.alert ? (
                  <span className="flex items-center gap-2">
                    <span className="flex-1 truncate">{item.label}</span>
                    <span
                      aria-label={`${item.alert} open reports`}
                      className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-label-sm text-on-error"
                    >
                      {item.alert}
                    </span>
                  </span>
                ) : (
                  item.label
                )}
              </NavigationDrawerItem>
            ))}
          </React.Fragment>
        ))}
      </NavigationDrawer>
      <span className="flex-1" />
      <div className="mt-4 flex shrink-0 items-center gap-3 rounded-lg p-2">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary-container text-label-lg text-on-secondary-container">MO</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-title-sm">Maya Ortiz</span>
          <span className="block truncate text-body-sm text-on-surface-variant">Live ops lead</span>
        </span>
        <IconButton aria-label="Sign out" onPress={() => snackbar("Signed out (demo)")}>
          <Icon>logout</Icon>
        </IconButton>
      </div>
    </div>
  )
}

export function AppShell2({ className }: { className?: string }) {
  const [page, setPage] = React.useState("events")
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [tab, setTab] = React.useState<"all" | Status>("all")
  const count = (id: "all" | Status) => (id === "all" ? EVENTS.length : EVENTS.filter((e) => e.status === id).length)

  return (
    <div className={cn("relative flex h-full min-h-0 bg-surface", className)}>
      <aside className="hidden w-72 shrink-0 border-r border-outline-variant bg-surface-container-low lg:block">
        <DrawerContents page={page} onPage={setPage} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 px-2 md:px-4">
          <DialogTrigger isOpen={drawerOpen} onOpenChange={setDrawerOpen}>
            <IconButton aria-label="Open navigation" size="md" width="narrow" className="lg:hidden">
              <Icon>menu</Icon>
            </IconButton>
            <ModalNavigationDrawer aria-label="Lumen" value={page} onValueChange={setPage} className="p-0">
              <DrawerContents
                page={page}
                onPage={(v) => {
                  setPage(v)
                  setDrawerOpen(false)
                }}
                onClose={() => setDrawerOpen(false)}
              />
            </ModalNavigationDrawer>
          </DialogTrigger>
          <div className="min-w-0 flex-1 pl-2">
            <div className="truncate text-body-sm text-on-surface-variant">Ember Tactics</div>
            <h4 className="truncate text-title-lg font-medium">Live events</h4>
          </div>
          <IconButton aria-label="Search events" onPress={() => snackbar("Search opens here")}>
            <Icon>search</Icon>
          </IconButton>
          <Button
            className="pr-4 pl-3"
            aria-label="New event"
            onPress={() => snackbar("Draft created: Untitled event", { action: { label: "Open", onAction: () => {} } })}
          >
            <Icon>add</Icon>
            <span className="hidden sm:inline">New event</span>
          </Button>
        </header>

        <Tabs selectedKey={tab} onSelectionChange={(k) => setTab(k as "all" | Status)} className="min-h-0 flex-1">
          <TabList aria-label="Filter events" variant="secondary" scrollable className="shrink-0 border-b border-outline-variant px-2 md:px-4">
            {TABS.map((t) => (
              <Tab key={t.id} id={t.id}>
                <span className="inline-flex items-center gap-2">
                  {t.label}
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-surface-container-highest px-1.5 text-label-sm text-on-surface-variant group-data-selected:bg-primary group-data-selected:text-on-primary">
                    {count(t.id)}
                  </span>
                </span>
              </Tab>
            ))}
          </TabList>
          {TABS.map((t) => (
            <TabPanel key={t.id} id={t.id} className="relative min-h-0 overflow-y-auto">
              <ul>
                {EVENTS.filter((e) => t.id === "all" || e.status === t.id).map((e) => (
                  <li key={e.name} className="flex items-center gap-4 border-b border-outline-variant/60 px-4 py-3 md:px-6">
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-md", BOX[e.box])}>
                      <Icon size={20}>{e.icon}</Icon>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-title-sm">{e.name}</div>
                      <div className="truncate text-body-sm text-on-surface-variant">
                        {e.type} · {e.audience}
                      </div>
                    </div>
                    <span className="hidden w-40 shrink-0 text-body-md text-on-surface-variant md:block">{e.when}</span>
                    <span
                      className={cn(
                        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-sm pr-3 pl-2 text-label-md whitespace-nowrap",
                        STATUS[e.status].chip,
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", STATUS[e.status].dot)} />
                      {e.status}
                    </span>
                  </li>
                ))}
              </ul>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
