// Demo content for the layout primitives in the blocks gallery. The primitives follow the real window
// size class, so resizing the gallery frame (desktop / tablet / phone) re-lays them out live.

import * as React from "react"

import { AdaptiveScaffold } from "@/components/blocks/layouts/adaptive-scaffold"
import { FeedItem, FeedLayout } from "@/components/blocks/layouts/feed-layout"
import { ListDetailBack, ListDetailLayout, useListDetail } from "@/components/blocks/layouts/list-detail-layout"
import { FixedFlexiblePanes } from "@/components/blocks/layouts/pane-layout"
import { SupportingPaneLayout } from "@/components/blocks/layouts/supporting-pane-layout"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { List, ListItem } from "@/components/ui/list"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

const THREADS = [
  { name: "Maya Lindqvist", subject: "Cutover plan for eu-west", body: "Draft is in the doc. Two open questions on the DNS TTL and who owns the rollback call.", time: "09:41", unread: true },
  { name: "Theo Okafor", subject: "Re: billing export", body: "The CSV now includes tax lines. Can you check the totals against last month before we ship?", time: "08:12", unread: true },
  { name: "Priya Raman", subject: "Design review moved", body: "Thursday 14:00 instead. I added the motion specs to the agenda.", time: "Yesterday", unread: false },
  { name: "Jonas Weber", subject: "On-call swap", body: "Happy to take Saturday if you cover my Wednesday night.", time: "Mon", unread: false },
  { name: "Ana Souza", subject: "Quarterly numbers", body: "Retention is up 4 points; the dashboard link is in the thread.", time: "Sun", unread: false },
]

function Fill({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("flex h-dvh min-h-[520px] flex-col bg-surface-container font-sans text-on-surface", className)}>{children}</div>
}

function ThreadList({ selected, onPick }: { selected: number; onPick: (i: number) => void }) {
  const { open } = useListDetail()
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="px-4 pt-4 pb-2 text-title-lg">Inbox</div>
      <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {THREADS.map((t, i) => (
          <li key={t.name}>
            <button
              type="button"
              onClick={() => {
                onPick(i)
                open()
              }}
              className={cn(
                "state-layer flex w-full cursor-pointer gap-3 rounded-lg px-3 py-3 text-left",
                i === selected && "bg-secondary-container text-on-secondary-container",
              )}
            >
              <Avatar name={t.name} size="md" />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className={cn("min-w-0 flex-1 truncate text-title-sm", t.unread && "font-semibold")}>{t.name}</span>
                  <span className="shrink-0 text-label-sm text-on-surface-variant">{t.time}</span>
                </span>
                <span className="block truncate text-body-md">{t.subject}</span>
                <span className="block truncate text-body-sm text-on-surface-variant">{t.body}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ThreadDetail({ thread }: { thread: (typeof THREADS)[number] }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-1 px-2 pt-2">
        <ListDetailBack />
        <div className="min-w-0 flex-1 truncate px-2 text-title-lg">{thread.subject}</div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Avatar name={thread.name} size="md" />
          <div>
            <div className="text-title-sm">{thread.name}</div>
            <div className="text-body-sm text-on-surface-variant">to me · {thread.time}</div>
          </div>
        </div>
        <p className="mt-6 max-w-prose text-body-lg text-pretty">{thread.body}</p>
        <p className="mt-4 max-w-prose text-body-lg text-pretty text-on-surface-variant">
          On compact and medium windows this pane replaces the list and shows a back arrow. From expanded up, both panes sit side by side.
        </p>
      </div>
    </div>
  )
}

export function ListDetailDemo() {
  const [selected, setSelected] = React.useState(0)
  return (
    <Fill>
      <ListDetailLayout
        list={<ThreadList selected={selected} onPick={setSelected} />}
        detail={<ThreadDetail thread={THREADS[selected]} />}
        supporting={
          <div className="p-4">
            <div className="text-title-md">Details</div>
            <p className="mt-2 text-body-md text-on-surface-variant">Supporting pane, extra-large windows only.</p>
          </div>
        }
      />
    </Fill>
  )
}

export function SupportingPaneDemo() {
  return (
    <Fill>
      <SupportingPaneLayout
        className="flex-1"
        main={
          <div className="h-full overflow-y-auto p-6">
            <h1 className="text-headline-md">Release 4.2: faster cold starts, quieter alerts</h1>
            <div className="mt-6 aspect-video rounded-xl bg-primary-container" />
            <p className="mt-6 max-w-prose text-body-lg text-pretty text-on-surface-variant">
              The main pane is flexible. The supporting pane takes a third of the width on expanded windows and moves below the main pane on
              compact ones.
            </p>
          </div>
        }
        supporting={
          <div className="h-full overflow-y-auto p-4">
            <div className="text-title-md">In this release</div>
            <List>
              {["Cold start −38%", "Alert grouping", "Audit export", "SAML groups"].map((t, i) => (
                <ListItem key={t} leading={<Icon>{["bolt", "notifications_paused", "download", "group"][i]}</Icon>} supportingText="Shipped">
                  {t}
                </ListItem>
              ))}
            </List>
          </div>
        }
      />
    </Fill>
  )
}

const FEED = [
  { title: "Deploy calendar", body: "Twelve deploys this week, two rolled back.", tone: "bg-primary-container text-on-primary-container", icon: "calendar_month", span: 2 as const },
  { title: "Error budget", body: "62% left for the month.", tone: "bg-tertiary-container text-on-tertiary-container", icon: "speed", span: 1 as const },
  { title: "On call", body: "Maya until Friday 09:00.", tone: "bg-secondary-container text-on-secondary-container", icon: "support_agent", span: 1 as const },
  { title: "Latency", body: "p95 down to 182ms after the cache change.", tone: "bg-surface-container-high", icon: "timer", span: 1 as const },
  { title: "Incidents", body: "No open SEV-1 or SEV-2.", tone: "bg-surface-container-high", icon: "verified", span: 1 as const },
  { title: "Costs", body: "Compute spend flat; storage +4%.", tone: "bg-surface-container-high", icon: "savings", span: 2 as const },
  { title: "Reviews", body: "Six pull requests waiting on you.", tone: "bg-surface-container-high", icon: "rate_review", span: 1 as const },
  { title: "Uptime", body: "99.98% over 30 days.", tone: "bg-surface-container-high", icon: "monitoring", span: 1 as const },
]

export function FeedDemo() {
  return (
    <Fill className="overflow-y-auto">
      <FeedLayout>
        {FEED.map((f) => (
          <FeedItem key={f.title} span={f.span}>
            <div className={cn("flex h-full min-h-36 flex-col rounded-xl p-5", f.tone)}>
              <Icon>{f.icon}</Icon>
              <div className="mt-auto pt-6 text-title-md">{f.title}</div>
              <div className="text-body-md opacity-80">{f.body}</div>
            </div>
          </FeedItem>
        ))}
      </FeedLayout>
    </Fill>
  )
}

export function PaneLayoutDemo() {
  return (
    <Fill className="p-3 md:p-6">
      <FixedFlexiblePanes
        className="flex-1"
        defaultFixedSize="40%"
        minFixedSize="25%"
        maxFixedSize="70%"
        fixed={
          <div className="h-full overflow-y-auto rounded-xl bg-surface p-2">
            <div className="px-3 pt-2 pb-1 text-title-md">Fixed pane</div>
            <List>
              {THREADS.slice(0, 4).map((t) => (
                <ListItem key={t.name} leading={<Avatar name={t.name} size="sm" />} supportingText={t.subject}>
                  {t.name}
                </ListItem>
              ))}
            </List>
          </div>
        }
        flexible={
          <div className="h-full overflow-y-auto rounded-xl bg-surface p-6">
            <div className="text-title-md">Flexible pane</div>
            <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
              Drag the handle between the panes. The fixed pane keeps its size; this one takes what's left. On compact windows the panes stack.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[4/3] rounded-lg bg-surface-container-high" />
              ))}
            </div>
          </div>
        }
      />
    </Fill>
  )
}

const DESTINATIONS = [
  { value: "inbox", icon: "inbox", label: "Inbox", badge: 3 },
  { value: "projects", icon: "folder", label: "Projects" },
  { value: "people", icon: "group", label: "People", badge: true },
  { value: "settings", icon: "settings", label: "Settings" },
]

export function AdaptiveScaffoldDemo() {
  const [value, setValue] = React.useState("inbox")
  const current = DESTINATIONS.find((d) => d.value === value)!
  return (
    <Fill>
      <AdaptiveScaffold
        className="flex-1"
        destinations={DESTINATIONS}
        value={value}
        onValueChange={setValue}
        action={{ icon: "edit", label: "Compose", onPress: () => snackbar("Compose · demo action") }}
        brand={<span className="text-title-md">Kestrel</span>}
      >
        <div className="h-full overflow-y-auto p-4 md:p-6">
          <div className="flex items-center gap-3">
            <h1 className="text-headline-sm">{current.label}</h1>
            {typeof current.badge === "number" && <Badge count={current.badge} />}
          </div>
          <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
            Navigation bar and FAB on compact windows, a rail on medium, an expanded rail from expanded up. Resize the frame to see it switch.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-28 rounded-xl bg-surface-container-high" />
            ))}
          </div>
        </div>
      </AdaptiveScaffold>
    </Fill>
  )
}
