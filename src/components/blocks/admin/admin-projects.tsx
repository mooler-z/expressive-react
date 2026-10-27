"use client"

import * as React from "react"
import {
  Button as AriaButton,
  GridList,
  GridListItem,
  isTextDropItem,
  useDragAndDrop,
  type DropItem,
  type DropTarget,
  type Key,
} from "react-aria-components"

import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LinearProgress } from "@/components/ui/progress"
import { snackbar } from "@/components/ui/snackbar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { PageHeader } from "./admin-ui"

type ColumnId = "backlog" | "progress" | "review" | "done"
type Tone = "primary" | "secondary" | "tertiary"
type Person = { initials: string; color: Tone }
type Task = { id: string; title: string; tags: string[]; people: Person[]; due: string; dueDay: number; progress?: number }

const COLUMNS: { id: ColumnId; title: string; dot: string }[] = [
  { id: "backlog", title: "Backlog", dot: "bg-surface-container-highest" },
  { id: "progress", title: "In progress", dot: "bg-primary" },
  { id: "review", title: "Review", dot: "bg-secondary-container" },
  { id: "done", title: "Done", dot: "bg-tertiary-container" },
]

const p = (initials: string, color: Tone): Person => ({ initials, color })

/** `dueDay` = days since Oct 1, for the timeline. */
const INITIAL: Record<ColumnId, Task[]> = {
  backlog: [
    { id: "docs", title: "Docs refresh for 4.2", tags: ["Docs"], people: [p("PN", "primary")], due: "Nov 4", dueDay: 34 },
    { id: "ratelimit", title: "Rate-limit dashboard", tags: ["API", "UX"], people: [p("AR", "tertiary")], due: "Nov 8", dueDay: 38 },
    { id: "soc2", title: "SOC 2 evidence export", tags: ["Security"], people: [p("SO", "secondary")], due: "Nov 12", dueDay: 42 },
  ],
  progress: [
    { id: "regions", title: "Parallel region promotion", tags: ["Rollouts"], people: [p("ML", "primary"), p("JP", "tertiary")], due: "Oct 28", dueDay: 27, progress: 60 },
    { id: "cve", title: "CVE gate exceptions", tags: ["Security"], people: [p("SO", "tertiary")], due: "Oct 30", dueDay: 29, progress: 35 },
  ],
  review: [
    { id: "rail", title: "Expanded rail state per workspace", tags: ["UX"], people: [p("JP", "primary")], due: "Oct 27", dueDay: 26, progress: 90 },
    { id: "cost", title: "Cost attribution v2", tags: ["FinOps"], people: [p("TW", "tertiary"), p("PN", "secondary")], due: "Oct 29", dueDay: 28, progress: 80 },
  ],
  done: [
    { id: "policy", title: "Policy previews", tags: ["Policy"], people: [p("AR", "primary")], due: "Oct 21", dueDay: 20 },
    { id: "scheduler", title: "Scheduler alert thresholds", tags: ["Ops"], people: [p("ML", "tertiary")], due: "Oct 7", dueDay: 6 },
  ],
}

const TEAM: Person[] = [p("ML", "primary"), p("JP", "tertiary"), p("AR", "secondary"), p("SO", "primary")]

type View = "board" | "list" | "timeline"
const DRAG_TYPE = "application/x-kestrel-card"

let newId = 0

export function AdminProjects() {
  const [columns, setColumns] = React.useState(INITIAL)
  const [view, setView] = React.useState<View>("board")
  const total = Object.values(columns).reduce((n, c) => n + c.length, 0)

  const columnOf = (id: Key) => (Object.keys(columns) as ColumnId[]).find((c) => columns[c].some((t) => t.id === id))

  /** Move cards (from any column) next to `target`, or to the end of `to`. */
  const move = (ids: string[], to: ColumnId, target?: DropTarget) => {
    setColumns((cols) => {
      const moving = ids.map((id) => Object.values(cols).flat().find((t) => t.id === id)).filter((t): t is Task => !!t)
      const next = Object.fromEntries(
        (Object.keys(cols) as ColumnId[]).map((c) => [c, cols[c].filter((t) => !ids.includes(t.id))]),
      ) as Record<ColumnId, Task[]>
      let at = next[to].length
      if (target?.type === "item") {
        const i = next[to].findIndex((t) => t.id === target.key)
        if (i !== -1) at = target.dropPosition === "after" ? i + 1 : i
      }
      next[to] = [...next[to].slice(0, at), ...moving, ...next[to].slice(at)]
      return next
    })
    const title = COLUMNS.find((c) => c.id === to)!.title
    if (ids.some((id) => columnOf(id) !== to)) snackbar(ids.length > 1 ? `${ids.length} cards moved to ${title}` : `Moved to ${title}`)
  }

  const addCard = (to: ColumnId) => {
    const card: Task = { id: `new-${++newId}`, title: "Untitled card", tags: [], people: [], due: "No date", dueDay: -1 }
    setColumns((cols) => ({ ...cols, [to]: [...cols[to], card] }))
    snackbar(`Card added to ${COLUMNS.find((c) => c.id === to)!.title}`, { action: { label: "Open", onAction: () => snackbar("Untitled card") } })
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`Release 4.2 · ${total} cards · due Oct 30`}
        actions={
          <>
            <AvatarGroup size="sm" className="[--avatar-ring:var(--md-surface)]">
              {TEAM.map((m) => (
                <Avatar key={m.initials} size="sm" fallback={m.initials} color={m.color} className="size-9" role="img" aria-label={m.initials} />
              ))}
            </AvatarGroup>
            <ConnectedButtonGroup
              aria-label="View"
              variant="filled"
              size="sm"
              selectedKeys={[view]}
              onSelectionChange={(keys) => {
                const k = [...keys][0] as View | undefined
                if (k) setView(k)
              }}
            >
              <ConnectedButton id="board">Board</ConnectedButton>
              <ConnectedButton id="list">List</ConnectedButton>
              <ConnectedButton id="timeline">Timeline</ConnectedButton>
            </ConnectedButtonGroup>
            <Button className="pr-5" onPress={() => addCard("backlog")}>
              <Icon>add</Icon>
              Add card
            </Button>
          </>
        }
      />

      <div className="mb-4 flex items-center gap-3 rounded-xl bg-surface-container-low p-4">
        <span id="release-progress" className="text-label-lg">
          Release progress
        </span>
        <LinearProgress aria-labelledby="release-progress" value={62} thickness={10} showStop={false} className="min-w-0 flex-1" />
        <span className="text-label-lg tabular-nums">62%</span>
      </div>

      {view === "board" && (
        <div className="relative flex gap-4 overflow-x-auto pb-2">
          {COLUMNS.map((c) => (
            <BoardColumn key={c.id} column={c} tasks={columns[c.id]} onMove={move} onAdd={() => addCard(c.id)} />
          ))}
        </div>
      )}
      {view === "list" && <ListView columns={columns} />}
      {view === "timeline" && <TimelineView columns={columns} />}
    </div>
  )
}

function BoardColumn({
  column,
  tasks,
  onMove,
  onAdd,
}: {
  column: (typeof COLUMNS)[number]
  tasks: Task[]
  onMove: (ids: string[], to: ColumnId, target?: DropTarget) => void
  onAdd: () => void
}) {
  const ids = (items: DropItem[]) => Promise.all(items.filter(isTextDropItem).map((i) => i.getText(DRAG_TYPE)))

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ [DRAG_TYPE]: String(key), "text/plain": tasks.find((t) => t.id === key)?.title ?? String(key) })),
    acceptedDragTypes: [DRAG_TYPE],
    getDropOperation: () => "move",
    onReorder: (e) => onMove([...e.keys].map(String), column.id, e.target),
    onInsert: async (e) => onMove(await ids(e.items), column.id, e.target),
    onRootDrop: async (e) => onMove(await ids(e.items), column.id),
  })

  return (
    <section aria-labelledby={`col-${column.id}`} className="flex w-72 shrink-0 flex-col rounded-xl bg-surface-container-low p-3">
      <div className="flex items-center gap-2 px-1 pb-3">
        <span className={cn("size-2.5 rounded-full", column.dot)} />
        <h2 id={`col-${column.id}`} className="text-title-sm">
          {column.title}
        </h2>
        <StatusBadge variant="neutral" shape="pill">
          {tasks.length}
        </StatusBadge>
        <span className="flex-1" />
        <IconButton aria-label={`Add card to ${column.title}`} className="text-on-surface-variant" onPress={onAdd}>
          <Icon size={20}>add</Icon>
        </IconButton>
      </div>
      <GridList
        aria-labelledby={`col-${column.id}`}
        items={tasks}
        dragAndDropHooks={dragAndDropHooks}
        onAction={(key) => snackbar(tasks.find((t) => t.id === key)?.title ?? "", { action: { label: "Open", onAction: () => {} } })}
        renderEmptyState={() => (
          <div className="grid h-20 place-items-center rounded-lg border border-dashed border-outline-variant text-body-sm text-on-surface-variant">
            Drop cards here
          </div>
        )}
        className="min-h-20 flex-1 space-y-2 rounded-lg outline-none data-drop-target:bg-secondary-container/40"
      >
        {(t) => (
          <GridListItem
            id={t.id}
            textValue={t.title}
            className={cn(
              "state-layer group relative cursor-grab rounded-lg bg-surface p-3 shadow-1 outline-none shape-morph data-hovered:shadow-2",
              "data-focus-visible:outline-3 data-focus-visible:outline-offset-2 data-focus-visible:outline-secondary",
              "data-dragging:opacity-50 data-drop-target:outline-2 data-drop-target:outline-primary",
            )}
          >
            <TaskCard task={t} done={column.id === "done"} />
          </GridListItem>
        )}
      </GridList>
      <Button variant="text" className="mt-2 self-start px-3 text-on-surface-variant" onPress={onAdd}>
        <Icon>add</Icon>
        Add a card
      </Button>
    </section>
  )
}

function TaskCard({ task: t, done }: { task: Task; done: boolean }) {
  return (
    <>
      {/* Keyboard drag handle (pointer users can drag the whole card) */}
      <AriaButton
        slot="drag"
        aria-label={`Drag ${t.title}`}
        className="absolute top-2 right-2 grid size-7 place-items-center rounded-full text-on-surface-variant opacity-0 outline-none group-data-focus-visible:opacity-100 group-data-hovered:opacity-100 data-focus-visible:opacity-100 data-focus-visible:outline-2 data-focus-visible:outline-secondary"
      >
        <Icon size={18}>drag_indicator</Icon>
      </AriaButton>
      {t.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pr-6">
          {t.tags.map((tag) => (
            <StatusBadge key={tag} variant="neutral" className="h-6">
              {tag}
            </StatusBadge>
          ))}
        </div>
      )}
      <div className="mt-2 text-body-md">{t.title}</div>
      {t.progress !== undefined && (
        <div className="mt-3 flex items-center gap-2">
          <LinearProgress aria-label={`${t.title} progress`} value={t.progress} showStop={false} className="min-w-0 flex-1" />
          <span className="text-label-sm text-on-surface-variant tabular-nums">{t.progress}%</span>
        </div>
      )}
      <div className="mt-3 flex items-center justify-between">
        <AvatarGroup size="xs" className="*:not-first:-ms-1 [--avatar-ring:var(--md-surface)]">
          {t.people.map((m) => (
            <Avatar key={m.initials} size="xs" fallback={m.initials} color={m.color} role="img" aria-label={m.initials} />
          ))}
        </AvatarGroup>
        <span className={cn("flex items-center gap-1 text-label-sm", done ? "text-tertiary" : "text-on-surface-variant")}>
          <Icon size={16}>{done ? "check_circle" : "event"}</Icon>
          {t.due}
        </span>
      </div>
    </>
  )
}

function ListView({ columns }: { columns: Record<ColumnId, Task[]> }) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-low">
      <Table className="min-w-[720px]" aria-label="Cards">
        <TableHeader className="text-label-md">
          <TableRow>
            <TableHead className="px-4 py-2">Card</TableHead>
            <TableHead className="px-4 py-2">Status</TableHead>
            <TableHead className="px-4 py-2">Tags</TableHead>
            <TableHead className="px-4 py-2">Owners</TableHead>
            <TableHead className="px-4 py-2">Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {COLUMNS.flatMap((c) =>
            columns[c.id].map((t) => (
              <TableRow key={t.id}>
                <TableCell className="px-4 font-medium">{t.title}</TableCell>
                <TableCell className="px-4">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap">
                    <span className={cn("size-2.5 rounded-full", c.dot)} />
                    {c.title}
                    {t.progress !== undefined && <span className="text-on-surface-variant tabular-nums">· {t.progress}%</span>}
                  </span>
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex flex-wrap gap-1">
                    {t.tags.map((tag) => (
                      <StatusBadge key={tag} variant="neutral" className="h-6">
                        {tag}
                      </StatusBadge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-4">
                  <AvatarGroup size="xs" className="*:not-first:-ms-1 [--avatar-ring:var(--md-surface-container-low)]">
                    {t.people.map((m) => (
                      <Avatar key={m.initials} size="xs" fallback={m.initials} color={m.color} role="img" aria-label={m.initials} />
                    ))}
                  </AvatarGroup>
                </TableCell>
                <TableCell muted className="px-4 whitespace-nowrap">
                  {t.due}
                </TableCell>
              </TableRow>
            )),
          )}
        </TableBody>
      </Table>
    </div>
  )
}

/** Oct 1 → Nov 15: one bar per card ending on its due day. */
function TimelineView({ columns }: { columns: Record<ColumnId, Task[]> }) {
  const SPAN = 46
  const ticks = [0, 7, 14, 21, 28, 35, 42]
  const label = (d: number) => (d < 31 ? `Oct ${d + 1}` : `Nov ${d - 30}`)
  const rows = COLUMNS.flatMap((c) => columns[c.id].filter((t) => t.dueDay >= 0).map((t) => ({ t, c })))
  rows.sort((a, b) => a.t.dueDay - b.t.dueDay)
  return (
    <div className="relative overflow-x-auto rounded-xl bg-surface-container-low p-4">
      <div className="min-w-[720px]">
        <div className="relative ml-56 h-6 text-label-sm text-on-surface-variant">
          {ticks.map((d) => (
            <span key={d} className="absolute -translate-x-1/2" style={{ left: `${(d / SPAN) * 100}%` }}>
              {label(d)}
            </span>
          ))}
        </div>
        <ul className="space-y-2">
          {rows.map(({ t, c }) => {
            const start = Math.max(0, t.dueDay - 10)
            return (
              <li key={t.id} className="flex items-center gap-4">
                <span className="w-52 shrink-0 truncate text-body-md">{t.title}</span>
                <div className="relative h-8 flex-1 rounded-full bg-surface-container">
                  <div
                    className={cn(
                      "absolute inset-y-1 flex items-center rounded-full px-3 text-label-sm whitespace-nowrap",
                      c.id === "done" ? "bg-tertiary-container text-on-tertiary-container" : c.id === "backlog" ? "bg-surface-container-highest text-on-surface-variant" : "bg-primary-container text-on-primary-container",
                    )}
                    style={{ left: `${(start / SPAN) * 100}%`, width: `${((t.dueDay - start) / SPAN) * 100}%` }}
                  >
                    {c.title}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
