import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { SuggestionChip } from "@/components/ui/chip"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { Message, MessageGroup, MessageMeta, TypingIndicator } from "@/components/ui/message"
import { ChatComposer, ChatHeader, ChatPanel, DateSeparator, MessageScroller, UnreadDivider } from "@/components/ui/message-scroller"
import { snackbar } from "@/components/ui/snackbar"
import { toast } from "@/components/ui/toast"
import { Section, Variant, Variants } from "@/docs/section"

type Msg = { id: number; from: "me" | "maya" | "jonah" | "ana"; text: string; day?: string }

const PEOPLE = {
  maya: { name: "Maya Lindqvist", color: "primary" as const },
  jonah: { name: "Jonah Park", color: "secondary" as const },
  ana: { name: "Ana Ruiz", color: "tertiary" as const },
}

let id = 100

/** Collapse consecutive messages from one sender into groups; a `day` starts a new group. */
function groupRuns(list: Msg[]) {
  const runs: { day?: string; from: Msg["from"]; items: Msg[] }[] = []
  for (const m of list) {
    const last = runs[runs.length - 1]
    if (last && last.from === m.from && !m.day) last.items.push(m)
    else runs.push({ day: m.day, from: m.from, items: [m] })
  }
  return runs
}

function Thread({ list, animateFrom = Infinity }: { list: Msg[]; animateFrom?: number }) {
  return (
    <>
      {groupRuns(list).map((run) => (
        <React.Fragment key={run.items[0].id}>
          {run.day && <DateSeparator>{run.day}</DateSeparator>}
          {run.from === "me" ? (
            <MessageGroup direction="outgoing">
              {run.items.map((m) => (
                <Message key={m.id} animate={m.id >= animateFrom}>
                  {m.text}
                </Message>
              ))}
            </MessageGroup>
          ) : (
            <MessageGroup avatar={<Avatar name={PEOPLE[run.from].name} color={PEOPLE[run.from].color} size="sm" />}>
              {run.items.map((m) => (
                <Message key={m.id} animate={m.id >= animateFrom}>
                  {m.text}
                </Message>
              ))}
            </MessageGroup>
          )}
        </React.Fragment>
      ))}
    </>
  )
}

const HISTORY: Msg[] = [
  { id: 1, from: "jonah", text: "Scheduler alerts are noisy again after the 4.1.8 bump.", day: "Yesterday" },
  { id: 2, from: "me", text: "Looking. Probably the retry threshold." },
  { id: 3, from: "jonah", text: "Yep — three retries in 10s trips the alert." },
  { id: 4, from: "jonah", text: "Pager went off four times between 02:00 and 03:00." },
  { id: 5, from: "me", text: "I'll check the cron config in the morning." },
  { id: 6, from: "maya", text: "Raised the threshold to 5 and added a 30s cool-down. Alerts went quiet.", day: "Today" },
  { id: 7, from: "me", text: "Perfect. Can you write it up in the runbook?" },
]

const REPLIES = [
  "On it — runbook PR in 10 minutes.",
  "Added a graph of retries vs. alerts too.",
  "Linked it from the on-call handbook.",
]

const INCOMING = [
  { from: "jonah" as const, text: "Heads up: ledger p95 just crossed 300 ms." },
  { from: "ana" as const, text: "Canary for 4.2.1 is green." },
  { from: "maya" as const, text: "Runbook updated, please review." },
]

function LiveChat() {
  const [list, setList] = React.useState(HISTORY)
  const [typing, setTyping] = React.useState(false)
  const replyIndex = React.useRef(0)
  const incomingIndex = React.useRef(0)

  const send = (text: string) => {
    setList((l) => [...l, { id: ++id, from: "me", text }])
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setList((l) => [...l, { id: ++id, from: "maya", text: REPLIES[replyIndex.current++ % REPLIES.length] }])
    }, 1400)
  }

  const receive = () => {
    const m = INCOMING[incomingIndex.current++ % INCOMING.length]
    setList((l) => [...l, { id: ++id, ...m }])
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <ChatPanel elevated className="h-[520px]">
        <ChatHeader
          onBack={() => snackbar("arrow_back · demo action")}
          avatar={
            <span className="grid size-10 place-items-center rounded-full bg-primary-container text-label-lg text-on-primary-container">#</span>
          }
          title="platform-oncall"
          subtitle="8 members · 2 online"
          actions={
            <MenuTrigger>
              <IconButton aria-label="Channel options" className="h-12 w-12">
                <Icon>more_vert</Icon>
              </IconButton>
              <MenuPopover placement="bottom end">
                <Menu onAction={(k) => snackbar(`${k} · demo action`)}>
                  <MenuItem id="Mute" icon="notifications_off">Mute channel</MenuItem>
                  <MenuItem id="Search" icon="search">Search in channel</MenuItem>
                  <MenuItem id="Members" icon="group">Members</MenuItem>
                </Menu>
              </MenuPopover>
            </MenuTrigger>
          }
        />
        <MessageScroller aria-label="platform-oncall messages">
          <Thread list={list} animateFrom={101} />
          {typing && <TypingIndicator avatar={<Avatar name="Maya Lindqvist" size="sm" />} />}
        </MessageScroller>
        <ChatComposer
          placeholder="Message #platform-oncall"
          onSend={send}
          onAttach={() =>
            toast({ title: "Attach", description: "Drop a file or paste an image into the composer.", icon: "attach_file" })
          }
        />
      </ChatPanel>
      <div className="space-y-3 self-start text-body-md text-on-surface-variant">
        <div className="text-title-sm text-on-surface">Anatomy</div>
        <ul className="list-disc space-y-1 ps-5">
          <li>Header: 64dp with back, avatar, title and overflow.</li>
          <li>
            Scroll region owns the scrollbar; date pills are <code className="font-mono text-body-sm">sticky top-0</code>.
          </li>
          <li>Pinned to the newest message; scrolling up unpins it and counts what arrives.</li>
          <li>Typing indicator reuses the incoming bubble with three bouncing dots.</li>
          <li>"Jump to latest" is a small extended FAB on secondary-container.</li>
          <li>Composer: textarea grows, Enter sends, Shift+Enter adds a line.</li>
        </ul>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button variant="tonal" size="xs" onPress={receive}>
            <Icon>call_received</Icon>
            Receive a message
          </Button>
        </div>
        <p className="text-body-sm">Scroll up in the thread, then receive a message to see the unread count.</p>
      </div>
    </div>
  )
}

const OLDER: Msg[][] = [
  [
    { id: 11, from: "ana", text: "Ledger deploy finished at 08:52." },
    { id: 12, from: "jonah", text: "Seeing slower reads on accounts since then." },
    { id: 13, from: "maya", text: "Could be the new index rebuild." },
  ],
  [
    { id: 8, from: "maya", text: "Morning! Anything from the night shift?" },
    { id: 9, from: "jonah", text: "Quiet until 07:30, then one page." },
    { id: 10, from: "me", text: "Thanks, I'll pick it up." },
  ],
]

function HistoryDemo() {
  const [older, setOlder] = React.useState<Msg[]>([])
  const [batches, setBatches] = React.useState(0)
  const recent: Msg[] = [
    { id: 20, from: "maya", text: "Paging for ledger p95 again." },
    { id: 21, from: "me", text: "Looking." },
  ]
  const unread: Msg[] = [
    { id: 22, from: "jonah", text: "Found it: a slow index on accounts." },
    { id: 23, from: "ana", text: "Fix is deploying to canary now." },
    { id: 24, from: "ana", text: "p95 back under 200 ms." },
  ]
  return (
    <ChatPanel className="h-[460px] w-full">
      <ChatHeader
        bordered
        onBack={() => snackbar("arrow_back · demo action")}
        avatar={
          <span className="grid size-9 place-items-center rounded-full bg-error-container text-label-lg text-on-error-container">#</span>
        }
        title="#incidents"
        subtitle="14 members · 3 online"
      />
      <MessageScroller
        jumpLabel={false}
        contentClassName="px-3 pt-3"
        hasMore={batches < OLDER.length}
        onLoadMore={() =>
          new Promise<void>((resolve) =>
            setTimeout(() => {
              setOlder((o) => [...OLDER[batches], ...o])
              setBatches((b) => b + 1)
              resolve()
            }, 1200),
          )
        }
      >
        {batches >= OLDER.length && <div className="py-1 text-center text-label-md text-on-surface-variant">Start of #incidents</div>}
        <Thread list={[...older, ...recent]} />
        <UnreadDivider>3 new messages</UnreadDivider>
        <Thread list={unread} />
      </MessageScroller>
      <ChatComposer variant="compact" placeholder="Message #incidents" onAttach={() => snackbar("Attach · demo action")} onSend={(t) => snackbar(`Sent: ${t}`)} />
    </ChatPanel>
  )
}

function EmptyDemo() {
  const [list, setList] = React.useState<Msg[]>([])
  const send = (text: string) => setList((l) => [...l, { id: ++id, from: "me", text }])
  return (
    <ChatPanel className="h-[460px] w-full">
      <ChatHeader
        bordered
        onBack={() => snackbar("arrow_back · demo action")}
        avatar={
          <span className="grid size-9 place-items-center rounded-full bg-primary-container text-label-lg text-on-primary-container">#</span>
        }
        title="#release-4-2"
        subtitle="12 members"
      />
      {list.length ? (
        <MessageScroller contentClassName="pt-3">
          <Thread list={list} animateFrom={0} />
          <MessageMeta status="sent" className="justify-end">
            now
          </MessageMeta>
        </MessageScroller>
      ) : (
        <EmptyState
          variant="plain"
          size="sm"
          icon="forum"
          className="min-h-0 flex-1 justify-center px-6"
          title="Start the conversation"
          description="Messages in #release-4-2 are visible to all 12 members."
          actions={
            <div className="flex flex-wrap justify-center gap-2">
              {["Share the release notes", "Ask for reviewers", "Post the rollout plan"].map((s) => (
                <SuggestionChip key={s} onPress={() => send(s)}>
                  {s}
                </SuggestionChip>
              ))}
            </div>
          }
        />
      )}
      <ChatComposer variant="compact" placeholder="Message #release-4-2" onAttach={() => snackbar("Attach · demo action")} onSend={send} />
    </ChatPanel>
  )
}

export default function MessageScrollerSection() {
  return (
    <Section
      id="message-scroller"
      description='The thread container: header, scrollable messages with sticky date pills, typing indicator, a "jump to latest" small FAB, and a composer.'
    >
      <LiveChat />
      <Variants cols="lg:grid-cols-2">
        <Variant n={1} label="Unread divider · loading history" className="rounded-lg bg-surface-container p-3">
          <HistoryDemo />
        </Variant>
        <Variant n={2} label="Empty thread · suggestions" className="rounded-lg bg-surface-container p-3">
          <EmptyDemo />
        </Variant>
      </Variants>
    </Section>
  )
}
