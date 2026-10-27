"use client"

import * as React from "react"
import { Button as AriaButton } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import { Dialog, DialogActions, DialogBody, DialogHeadline } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

/*
 * User profile 01 · Player header + tabs
 * Identity, status and actions in the header; overview, purchases with refunds, matches and
 * reports in tabs. Ban asks for a duration and reason.
 */

const PURCHASES = [
  { item: "Frostfire Pass", cat: "Battle pass", price: "$9.99", date: "Oct 3" },
  { item: "5,000 Ember Shards", cat: "Currency", price: "$39.99", date: "Sep 28" },
  { item: "Glacier Warden", cat: "Cosmetic", price: "$14.99", date: "Sep 12" },
  { item: "1,200 Ember Shards", cat: "Currency", price: "$9.99", date: "Aug 30" },
]

const MATCHES = [
  { mode: "Ranked · Harbor", res: "Win", kd: "24 / 6", len: "18 min", day: "Today" },
  { mode: "Ranked · Spire", res: "Win", kd: "31 / 4", len: "22 min", day: "Today" },
  { mode: "Quick play · Foundry", res: "Loss", kd: "12 / 15", len: "9 min", day: "Yesterday" },
  { mode: "Ranked · Harbor", res: "Win", kd: "28 / 3", len: "21 min", day: "Yesterday" },
]

const REPORTS = [
  { sev: "High", cls: "bg-error-container text-on-error-container", title: "Aimbot suspected", meta: "14 reports · open · R-2291", open: true },
  { sev: "Medium", cls: "bg-tertiary-container text-on-tertiary-container", title: "Map exploit · Harbor wall clip", meta: "3 reports · warned Aug 21 by Kenji Watanabe" },
  { sev: "Low", cls: "bg-surface-container-highest text-on-surface-variant", title: "Toxic chat", meta: "1 report · dismissed Jul 2026" },
]

const GRANTS = [
  { id: "500 Ember Shards", icon: "diamond" },
  { id: "Frostfire banner", icon: "flag" },
  { id: "a 24h Double XP token", label: "Double XP token · 24h", icon: "bolt" },
]

const DURATIONS = ["24 hours", "7 days", "Permanent"]
const REASONS = ["Cheating", "Exploiting", "Harassment", "Real-money trading"]

function Stat({ label, value, sub, alert = false }: { label: string; value: string; sub: string; alert?: boolean }) {
  return (
    <div className={cn("rounded-lg p-4", alert ? "bg-error-container text-on-error-container" : "bg-surface-container-low")}>
      <div className={cn("text-body-md", !alert && "text-on-surface-variant")}>{label}</div>
      <div className="mt-1 text-headline-sm font-medium tabular-nums">{value}</div>
      <div className={cn("text-body-sm", !alert && "text-on-surface-variant")}>{sub}</div>
    </div>
  )
}

export function UserProfile1({ className }: { className?: string }) {
  const [refunded, setRefunded] = React.useState<string[]>([])
  const [banned, setBanned] = React.useState(false)
  const [banOpen, setBanOpen] = React.useState(false)
  const [duration, setDuration] = React.useState("7 days")
  const [reason, setReason] = React.useState("Cheating")

  return (
    <div className={cn("bg-surface", className)}>
      <div className="bg-surface-container-low px-4 pt-6 md:px-6">
        <div className="flex flex-wrap items-start gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-lg-plus bg-tertiary-container text-headline-sm text-on-tertiary-container">V</span>
          <div className="min-w-[min(100%,220px)] flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-headline-sm font-medium">Valkyr.ie</h4>
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-sm px-2 text-label-md",
                  banned ? "bg-error text-on-error" : "bg-tertiary-container text-on-tertiary-container",
                )}
              >
                {banned ? `Banned · ${duration}` : "Flagged"}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-body-md text-on-surface-variant">
              <AriaButton
                aria-label="Copy player ID P-11934082"
                onPress={async () => {
                  try {
                    await navigator.clipboard.writeText("P-11934082")
                  } catch {
                    // clipboard blocked
                  }
                  snackbar("Copied player ID")
                }}
                className="state-layer focus-ring -ml-1 inline-flex h-7 cursor-pointer items-center gap-1 rounded-full px-1 font-mono text-body-sm"
              >
                P-11934082
                <Icon size={16}>content_copy</Icon>
              </AriaButton>
              <span>PC · EU-West</span>
              <span>Level 112</span>
              <span>Playing since Mar 2023</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <MenuTrigger>
              <Button variant="outlined" className="pr-4 pl-3">
                <Icon>redeem</Icon>
                Grant
              </Button>
              <MenuPopover placement="bottom end">
                <Menu
                  aria-label="Grant"
                  className="w-60"
                  onAction={(k) => snackbar(`Granted ${k} to Valkyr.ie`, { action: { label: "Undo", onAction: () => {} } })}
                >
                  {GRANTS.map((g) => (
                    <MenuItem key={g.id} id={g.id} icon={g.icon}>
                      {g.label ?? g.id}
                    </MenuItem>
                  ))}
                </Menu>
              </MenuPopover>
            </MenuTrigger>
            <Button variant="outlined" className="pr-4 pl-3" onPress={() => snackbar("Message sent to Valkyr.ie's in-game inbox")}>
              <Icon>mail</Icon>
              Message
            </Button>
            {banned ? (
              <Button
                variant="outlined"
                className="pr-4 pl-3"
                onPress={() => {
                  setBanned(false)
                  snackbar("Ban lifted for Valkyr.ie")
                }}
              >
                <Icon>lock_open</Icon>
                Lift ban
              </Button>
            ) : (
              <Button className="bg-error pr-4 pl-3 text-on-error" onPress={() => setBanOpen(true)}>
                <Icon>gavel</Icon>
                Ban
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultSelectedKey="overview" className="bg-surface-container-low">
        <TabList aria-label="Player sections" scrollable className="mt-4 px-4 md:px-6">
          <Tab id="overview">Overview</Tab>
          <Tab id="purchases">Purchases</Tab>
          <Tab id="matches">Matches</Tab>
          <Tab id="reports">Reports</Tab>
        </TabList>

        <TabPanel id="overview" className="space-y-3 border-t border-outline-variant bg-surface p-4 md:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Lifetime spend" value="$3,310.75" sub="14 purchases · VIP tier" />
            <Stat label="Matches played" value="4,812" sub="58% win rate" />
            <Stat label="Playtime" value="1,240 h" sub="96 h in the last 30 days" />
            <Stat label="Open reports" value="14" sub="From 9 players · last 18 min ago" alert />
          </div>
          <div className="rounded-lg bg-surface-container-low p-4">
            <div className="text-title-sm">Linked accounts</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Steam · Valkyr.ie", "PlayStation · Valkyr_ie", "Discord · valkyrie#0412"].map((a) => (
                <span key={a} className="inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant px-3 text-label-lg">
                  {a}
                </span>
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel id="purchases" className="border-t border-outline-variant bg-surface p-4 md:p-6">
          <ul className="divide-y divide-outline-variant/60 rounded-lg border border-outline-variant">
            {PURCHASES.map((p) => {
              const done = refunded.includes(p.item)
              return (
                <li key={p.item} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-container text-on-primary-container">
                    <Icon size={20}>shopping_bag</Icon>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-title-sm">{p.item}</div>
                    <div className="text-body-sm text-on-surface-variant">
                      {p.cat} · {p.date} · Steam
                    </div>
                  </div>
                  <span className="tabular-nums">{p.price}</span>
                  {done ? (
                    <span className="inline-flex h-7 w-24 items-center justify-center rounded-sm bg-surface-container-highest text-label-md text-on-surface-variant">
                      Refunded
                    </span>
                  ) : (
                    <Button
                      variant="text"
                      className="h-9 w-24"
                      onPress={() => {
                        setRefunded((r) => [...r, p.item])
                        snackbar(`Refunded ${p.price} · ${p.item}`, {
                          action: { label: "Undo", onAction: () => setRefunded((r) => r.filter((x) => x !== p.item)) },
                        })
                      }}
                    >
                      Refund
                    </Button>
                  )}
                </li>
              )
            })}
          </ul>
        </TabPanel>

        <TabPanel id="matches" className="border-t border-outline-variant bg-surface p-4 md:p-6">
          <ul className="divide-y divide-outline-variant/60 rounded-lg border border-outline-variant">
            {MATCHES.map((m, i) => (
              <li key={i} className="grid grid-cols-[minmax(0,1fr)_56px_64px_80px] items-center gap-3 px-4 py-3">
                <span className="min-w-0">
                  <span className="block truncate text-title-sm">{m.mode}</span>
                  <span className="block text-body-sm text-on-surface-variant">
                    {m.day} · {m.len}
                  </span>
                </span>
                <span
                  className={cn(
                    "inline-flex h-6 items-center justify-center rounded-sm text-label-md",
                    m.res === "Win" ? "bg-primary-container text-on-primary-container" : "bg-surface-container-highest text-on-surface-variant",
                  )}
                >
                  {m.res}
                </span>
                <span className="text-right font-mono text-body-md" title="Kills / deaths">
                  {m.kd}
                </span>
                <Button variant="text" className="h-9" onPress={() => snackbar(`Opening replay · ${m.mode}`)}>
                  Replay
                </Button>
              </li>
            ))}
          </ul>
        </TabPanel>

        <TabPanel id="reports" className="border-t border-outline-variant bg-surface p-4 md:p-6">
          <ul className="divide-y divide-outline-variant/60 rounded-lg border border-outline-variant">
            {REPORTS.map((r) => (
              <li key={r.title} className="flex flex-wrap items-center gap-3 px-4 py-3">
                <span className={cn("inline-flex h-6 w-16 shrink-0 items-center justify-center rounded-sm text-label-md", r.cls)}>{r.sev}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-title-sm">{r.title}</div>
                  <div className="text-body-sm text-on-surface-variant">{r.meta}</div>
                </div>
                {r.open && (
                  <Button variant="text" className="h-9 px-3" onPress={() => snackbar("Opening R-2291 in the moderation queue")}>
                    Open in queue
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </TabPanel>
      </Tabs>

      <Dialog role="alertdialog" aria-label="Ban player" modalClassName="max-w-md" overlayProps={{ isOpen: banOpen, onOpenChange: setBanOpen }}>
        <Icon className="text-error">gavel</Icon>
        <DialogHeadline className="mt-3">Ban Valkyr.ie?</DialogHeadline>
        <DialogBody className="mt-2 overflow-visible">
          They're removed from any match in progress and can't sign in until the ban ends.
          <div className="mt-5 text-label-lg text-on-surface-variant">Duration</div>
          <SegmentedButtonGroup aria-label="Duration" className="mt-2" selectedKeys={[duration]} onSelectionChange={(k) => setDuration(String([...k][0]))}>
            {DURATIONS.map((d) => (
              <SegmentedButton key={d} id={d} className="flex-none px-3">
                {d}
              </SegmentedButton>
            ))}
          </SegmentedButtonGroup>
          <Select label="Reason" selectedKey={reason} onSelectionChange={(k) => setReason(String(k))} className="mt-5">
            {REASONS.map((r) => (
              <SelectItem key={r} id={r}>
                {r}
              </SelectItem>
            ))}
          </Select>
        </DialogBody>
        <DialogActions>
          <Button variant="text" className="px-4" slot="close">
            Cancel
          </Button>
          <Button
            className="bg-error px-5 text-on-error"
            onPress={() => {
              setBanned(true)
              setBanOpen(false)
              snackbar(`Valkyr.ie banned · ${duration}`, { action: { label: "Undo", onAction: () => setBanned(false) } })
            }}
          >
            Ban player
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
