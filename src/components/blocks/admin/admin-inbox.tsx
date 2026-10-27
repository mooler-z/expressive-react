"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { InteractiveList, InteractiveListItem } from "@/components/ui/list"
import { Message, MessageGroup } from "@/components/ui/message"
import { ChatComposer } from "@/components/ui/message-scroller"
import { SearchBar } from "@/components/ui/search"
import { cn } from "@/lib/utils"

import { notify } from "./admin-actions"
import { PageHeader } from "./admin-ui"

type Tag = "customers" | "billing"
type Color = "primary" | "secondary" | "tertiary" | "primary-solid"
type Reply = { id: number; text: string }
type Conversation = {
  id: string
  name: string
  company: string
  color: Color
  subject: string
  body: string
  time: string
  unread: boolean
  tags: Tag[]
  attachment?: { name: string; size: string }
  replies: Reply[]
}

const INITIAL: Conversation[] = [
  {
    id: "c0",
    name: "Priya Nair",
    company: "Halide Bank",
    color: "primary",
    subject: "Expansion to 1,500 seats",
    body: "Thanks for the call — attaching the revised order form for the expansion.",
    time: "9:41",
    unread: true,
    tags: ["customers"],
    attachment: { name: "order-form-expansion.pdf", size: "214 KB" },
    replies: [{ id: 1, text: "Got it, Priya. I'll follow up with details today." }],
  },
  {
    id: "c1",
    name: "Lena Ortiz",
    company: "Meridian Health",
    color: "tertiary",
    subject: "SSO login loop",
    body: "Users on Safari keep bouncing back to the login page after the IdP redirect.",
    time: "8:12",
    unread: true,
    tags: ["customers"],
    replies: [{ id: 1, text: "Got it, Lena. I'll follow up with details today." }],
  },
  {
    id: "c2",
    name: "Kenji Mori",
    company: "Tessera Logistics",
    color: "secondary",
    subject: "Invoice question",
    body: "Could you split the October invoice by cost center?",
    time: "Yesterday",
    unread: false,
    tags: ["billing"],
    replies: [{ id: 1, text: "Got it, Kenji. I'll follow up with details today." }],
  },
  {
    id: "c3",
    name: "Chris Hale",
    company: "Northwind",
    color: "primary-solid",
    subject: "Renewal terms",
    body: "Before we renew, can we review the reserved-capacity discount?",
    time: "Mon",
    unread: false,
    tags: ["customers", "billing"],
    replies: [{ id: 1, text: "Got it, Chris. I'll follow up with details today." }],
  },
  {
    id: "c4",
    name: "Noor Haddad",
    company: "Lattice Labs",
    color: "primary",
    subject: "Thank you!",
    body: "The policy previews saved us a weekend. Huge thanks to the team.",
    time: "Sun",
    unread: false,
    tags: ["customers"],
    replies: [{ id: 1, text: "Got it, Noor. I'll follow up with details today." }],
  },
]

type Filter = "all" | "unread" | Tag
const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ["unread", "Unread"],
  ["customers", "Customers"],
  ["billing", "Billing"],
]

let replyId = 100

export function AdminInbox() {
  const [conversations, setConversations] = React.useState(INITIAL)
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<Filter>("all")
  const [selectedId, setSelectedId] = React.useState("c0")

  const update = (id: string, fn: (c: Conversation) => Conversation) => setConversations((list) => list.map((c) => (c.id === id ? fn(c) : c)))

  const q = query.trim().toLowerCase()
  const shown = conversations.filter(
    (c) =>
      (filter === "all" || (filter === "unread" ? c.unread : c.tags.includes(filter))) &&
      (!q || `${c.name} ${c.company} ${c.subject}`.toLowerCase().includes(q)),
  )
  const unread = conversations.filter((c) => c.unread).length
  const current = conversations.find((c) => c.id === selectedId) ?? conversations[0]

  const open = (id: string) => {
    setSelectedId(id)
    update(id, (c) => ({ ...c, unread: false }))
  }

  const removeCurrent = (verb: "Archived" | "Deleted") => {
    if (!current) return
    const snapshot = conversations
    const index = conversations.indexOf(current)
    const next = conversations.filter((c) => c.id !== current.id)
    setConversations(next)
    setSelectedId(next[Math.min(index, next.length - 1)]?.id ?? "")
    notify(`${verb} · ${current.subject}`, "Undo", () => {
      setConversations(snapshot)
      setSelectedId(current.id)
    })
  }

  return (
    <div>
      <PageHeader
        title="Inbox"
        description={`${conversations.length} conversations · ${unread} unread`}
        actions={
          <>
            <Button
              variant="outlined"
              isDisabled={unread === 0}
              onPress={() => {
                setConversations((list) => list.map((c) => ({ ...c, unread: false })))
                notify("All conversations marked read")
              }}
            >
              <Icon>done_all</Icon>
              Mark all read
            </Button>
            <Button onPress={() => notify("New message", "Discard")}>
              <Icon>edit</Icon>
              Compose
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="min-w-0 overflow-hidden rounded-xl bg-surface-container-low">
          <div className="space-y-3 p-3">
            <SearchBar aria-label="Search mail" placeholder="Search mail" value={query} onChange={setQuery} className="h-12 bg-surface-container-high" />
            <ChipGroup
              aria-label="Filter conversations"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[filter]}
              onSelectionChange={(keys) => {
                const k = [...keys][0] as Filter | undefined
                if (k) setFilter(k)
              }}
            >
              {FILTERS.map(([id, label]) => (
                <FilterChip key={id} id={id}>
                  {label}
                </FilterChip>
              ))}
            </ChipGroup>
          </div>
          <InteractiveList
            aria-label="Conversations"
            selectionMode="single"
            selectionBehavior="replace"
            disallowEmptySelection
            selectedKeys={current ? [current.id] : []}
            onSelectionChange={(keys) => {
              const k = keys === "all" ? undefined : [...keys][0]
              if (k) open(String(k))
            }}
            items={shown}
            renderEmptyState={() => <p className="px-4 py-8 text-center text-body-md text-on-surface-variant">No conversations match</p>}
            className="divide-y divide-outline-variant"
          >
            {(c) => (
              <InteractiveListItem
                id={c.id}
                textValue={`${c.name} · ${c.subject}`}
                lines={3}
                className="rounded-none data-selected:rounded-none"
                leading={<Avatar name={c.name} color={c.color} />}
                trailingText={c.time}
                trailing={c.unread ? <span className="size-2.5 rounded-full bg-primary" aria-label="Unread" /> : undefined}
                supportingText={
                  <>
                    <span className={cn("block truncate", c.unread ? "text-label-lg" : "text-body-sm")}>{c.subject}</span>
                    <span className="block truncate opacity-70">{c.body}</span>
                  </>
                }
              >
                <span className={cn("block truncate", c.unread ? "text-title-sm" : "text-body-md")}>
                  {c.name} · {c.company}
                </span>
              </InteractiveListItem>
            )}
          </InteractiveList>
        </div>

        <div className="min-w-0 rounded-xl bg-surface-container-low">
          {current ? (
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-1 border-b border-outline-variant p-4">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-title-lg">{current.subject}</h2>
                  <p className="text-body-sm text-on-surface-variant">
                    {current.name} · {current.company}
                  </p>
                </div>
                <IconButton aria-label="Archive" onPress={() => removeCurrent("Archived")}>
                  <Icon size={20}>archive</Icon>
                </IconButton>
                <IconButton aria-label="Label" onPress={() => notify("Label added")}>
                  <Icon size={20}>label</Icon>
                </IconButton>
                <IconButton aria-label="Delete" onPress={() => removeCurrent("Deleted")}>
                  <Icon size={20}>delete</Icon>
                </IconButton>
              </div>

              <div className="flex-1 space-y-4 p-4">
                <MessageGroup direction="incoming" avatar={<Avatar name={current.name} color={current.color} size="sm" />}>
                  <Message>
                    {current.body}
                    <div className="mt-2 text-label-sm text-on-surface-variant">{current.time}</div>
                  </Message>
                </MessageGroup>
                {current.replies.length > 0 && (
                  <MessageGroup direction="outgoing">
                    {current.replies.map((r) => (
                      <Message key={r.id}>{r.text}</Message>
                    ))}
                  </MessageGroup>
                )}
                {current.attachment && (
                  <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
                    <Icon className="text-primary">description</Icon>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-title-sm">{current.attachment.name}</div>
                      <div className="text-body-sm text-on-surface-variant">{current.attachment.size}</div>
                    </div>
                    <IconButton aria-label={`Download ${current.attachment.name}`} onPress={() => notify("Downloading order form")}>
                      <Icon size={20}>download</Icon>
                    </IconButton>
                  </div>
                )}
              </div>

              <div className="border-t border-outline-variant p-3">
                <ChatComposer
                  key={current.id}
                  aria-label={`Reply to ${current.name}`}
                  placeholder={`Reply to ${current.name.split(" ")[0]}`}
                  onSend={(text) => {
                    const id = ++replyId
                    const convo = current.id
                    update(convo, (c) => ({ ...c, replies: [...c.replies, { id, text }] }))
                    notify("Reply sent", "Undo", () => update(convo, (c) => ({ ...c, replies: c.replies.filter((r) => r.id !== id) })))
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="grid h-full min-h-60 place-items-center p-8 text-body-md text-on-surface-variant">Inbox zero.</div>
          )}
        </div>
      </div>
    </div>
  )
}
