import * as React from "react"
import { getLocalTimeZone, startOfWeek, today, type CalendarDate } from "@internationalized/date"
import { ToggleButton as AriaToggleButton, ToggleButtonGroup, type Key } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { EventCalendar, type CalendarEvent, type CalendarEventTone } from "@/components/ui/calendar"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"
import { cn } from "@/lib/utils"

const TODAY = today(getLocalTimeZone())
const at = (offset: number) => TODAY.add({ days: offset })

const EVENTS: CalendarEvent[] = [
  { id: 1, date: at(-12), title: "Sprint planning", tone: "primary" },
  { id: 2, date: at(-9), title: "Design crit", tone: "tertiary" },
  { id: 3, date: at(-6), title: "Incident drill", tone: "error" },
  { id: 4, date: at(-3), title: "Canary review", tone: "secondary" },
  { id: 5, date: at(-3), title: "1:1 · Jonah", tone: "neutral" },
  { id: 6, date: at(0), title: "Standup", tone: "primary" },
  { id: 7, date: at(0), title: "Design review", tone: "tertiary" },
  { id: 8, date: at(0), title: "Lunch & learn", tone: "neutral" },
  { id: 9, date: at(2), title: "Release 4.2", tone: "secondary" },
  { id: 10, date: at(5), title: "Retro", tone: "primary" },
  { id: 11, date: at(8), title: "Offsite", tone: "tertiary" },
  { id: 12, date: at(13), title: "Quarterly review", tone: "primary" },
]

function ViewSwitch() {
  const [view, setView] = React.useState<Set<Key>>(new Set(["month"]))
  const items = [
    ["week", "Week", "rounded-l-full rounded-r-sm"],
    ["month", "Month", "rounded-sm"],
    ["year", "Year", "rounded-l-sm rounded-r-full"],
  ] as const
  return (
    <ToggleButtonGroup
      aria-label="Calendar view"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={view}
      onSelectionChange={(k) => {
        setView(k)
        snackbar(`${[...k][0] === "week" ? "Week" : [...k][0] === "year" ? "Year" : "Month"} view`)
      }}
      className="inline-flex gap-0.5"
    >
      {items.map(([id, label, shape]) => (
        <AriaToggleButton
          key={id}
          id={id}
          className={cn(
            "state-layer shape-morph focus-ring inline-flex h-9 cursor-pointer items-center bg-surface-container px-4 text-label-lg text-on-surface-variant",
            "data-selected:rounded-full data-selected:bg-primary data-selected:text-on-primary",
            shape,
          )}
        >
          {label}
        </AriaToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

function MonthPlanner() {
  const [selected, setSelected] = React.useState<CalendarDate>(TODAY)
  const dayEvents = EVENTS.filter((e) => e.date.compare(selected) === 0)
  return (
    <div className="space-y-4">
      <EventCalendar aria-label="Team calendar" events={EVENTS} value={selected} onChange={setSelected} toolbar={<ViewSwitch />} />
      <div className="flex flex-wrap items-center gap-2 text-body-md text-on-surface-variant" aria-live="polite">
        <Icon size={20}>event</Icon>
        {selected.toDate(getLocalTimeZone()).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} ·{" "}
        {dayEvents.length ? dayEvents.map((e) => e.title).join(", ") : "No events"}
      </div>
    </div>
  )
}

/* Week · time grid ------------------------------------------------------------------ */

const HOUR_H = 40
const FIRST_HOUR = 8

type Slot = { day: number; title: string; start: number; end: number; tone: CalendarEventTone }

const WEEK: Slot[] = [
  { day: 0, title: "Standup + planning", start: 9, end: 10, tone: "primary" },
  { day: 0, title: "Design review", start: 13, end: 14.5, tone: "tertiary" },
  { day: 1, title: "Canary review", start: 10, end: 11, tone: "secondary" },
  { day: 1, title: "Lunch & learn", start: 12, end: 13, tone: "neutral" },
  { day: 2, title: "Incident drill", start: 8.5, end: 10, tone: "error" },
  { day: 2, title: "1:1 · Jonah", start: 13.5, end: 14, tone: "secondary" },
  { day: 3, title: "Release 4.2", start: 11, end: 12.5, tone: "primary" },
  { day: 4, title: "Retro", start: 14, end: 15, tone: "tertiary" },
]

const toneClass: Record<CalendarEventTone, string> = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  error: "bg-error-container text-on-error-container",
  neutral: "bg-surface-container-highest text-on-surface",
}

const hhmm = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${h % 1 ? "30" : "00"}`

function WeekGrid() {
  const monday = startOfWeek(TODAY, "en-GB")
  const days = Array.from({ length: 5 }, (_, i) => monday.add({ days: i }))
  const now = new Date()
  const nowH = now.getHours() + now.getMinutes() / 60
  const todayIdx = days.findIndex((d) => d.compare(TODAY) === 0)
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[520px]">
        <div className="grid grid-cols-[44px_repeat(5,minmax(0,1fr))] border-b border-outline-variant pb-2 text-center">
          <span />
          {days.map((d, i) => (
            <div key={i}>
              <div className={cn("text-label-md", i === todayIdx ? "text-primary" : "text-on-surface-variant")}>
                {d.toDate(getLocalTimeZone()).toLocaleDateString(undefined, { weekday: "short" })}
              </div>
              <div
                className={cn(
                  "mx-auto mt-0.5 grid size-8 place-items-center rounded-full text-title-md",
                  i === todayIdx && "bg-primary text-on-primary",
                )}
              >
                {d.day}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[44px_repeat(5,minmax(0,1fr))]" style={{ height: HOUR_H * 8 }}>
          <div className="relative">
            {Array.from({ length: 7 }, (_, i) => (
              <span
                key={i}
                className="absolute right-2 text-label-sm text-on-surface-variant tabular-nums"
                style={{ top: HOUR_H * (i + 1) - 8 }}
              >
                {hhmm(FIRST_HOUR + i + 1)}
              </span>
            ))}
          </div>
          {days.map((_, i) => (
            <div
              key={i}
              className="relative border-l border-outline-variant bg-[linear-gradient(to_bottom,color-mix(in_oklab,var(--md-outline-variant)_60%,transparent)_1px,transparent_1px)] bg-[length:100%_40px]"
            >
              {WEEK.filter((e) => e.day === i).map((e) => (
                <button
                  key={e.title}
                  type="button"
                  onClick={() => snackbar(`${e.title} · ${hhmm(e.start)}`)}
                  className={cn("state-layer absolute inset-x-1 cursor-pointer overflow-hidden rounded-sm px-2 py-1 text-left", toneClass[e.tone])}
                  style={{ top: (e.start - FIRST_HOUR) * HOUR_H + 1, height: (e.end - e.start) * HOUR_H - 2 }}
                >
                  <span className="block truncate text-label-md">{e.title}</span>
                  <span className="block truncate text-label-sm opacity-80">
                    {hhmm(e.start)}–{hhmm(e.end)}
                  </span>
                </button>
              ))}
              {i === todayIdx && nowH > FIRST_HOUR && nowH < FIRST_HOUR + 8 && (
                <div className="pointer-events-none absolute inset-x-0 z-10 h-0.5 bg-error" style={{ top: (nowH - FIRST_HOUR) * HOUR_H }}>
                  <span className="absolute -top-1 -left-1 size-2.5 rounded-full bg-error" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Agenda --------------------------------------------------------------------------- */

const AGENDA = [
  {
    day: 0,
    items: [
      { time: "10:00", title: "Canary review", meta: "Room Fjord · 4 guests", tone: "secondary" as const, live: true },
      { time: "12:00", title: "Lunch & learn", meta: "Kitchen · optional", tone: "neutral" as const },
    ],
  },
  {
    day: 1,
    items: [
      { time: "08:30", title: "Incident drill", meta: "On-call rotation · 90 min", tone: "error" as const },
      { time: "13:30", title: "1:1 · Jonah", meta: "Video call · 30 min", tone: "secondary" as const },
    ],
  },
  { day: 2, items: [{ time: "All day", title: "Release 4.2", meta: "Freeze from 18:00 the day before", tone: "primary" as const }] },
]

function Agenda() {
  return (
    <div className="w-full space-y-4">
      {AGENDA.map(({ day, items }) => {
        const d = at(day).toDate(getLocalTimeZone())
        return (
          <div key={day}>
            <div className={cn("pb-2 text-title-sm", day === 0 ? "text-primary" : "text-on-surface-variant")}>
              {day === 0 && "Today · "}
              {d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
            </div>
            <ul className="space-y-1">
              {items.map((e) => (
                <li key={e.title} className="flex items-center gap-3 rounded-md bg-surface-container-low p-3">
                  <span className="w-14 shrink-0 text-label-md text-on-surface-variant tabular-nums">{e.time}</span>
                  <span className={cn("h-9 w-1 shrink-0 rounded-full", toneClass[e.tone].split(" ")[0])} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-lg">{e.title}</span>
                    <span className="block truncate text-body-sm text-on-surface-variant">{e.meta}</span>
                  </span>
                  {"live" in e && e.live && (
                    <Button size="xs" variant="tonal" onPress={() => snackbar("Joining Canary review…")}>
                      <Icon>videocam</Icon>
                      Join
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default function CalendarSection() {
  return (
    <Section
      id="calendar"
      description="Month view with event chips on container roles; today on primary. Pairs with the date picker for input."
    >
      <MonthPlanner />
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-title-md">2 variants</div>
          <div className="text-body-sm text-on-surface-variant">Week · time grid · agenda · grouped by day</div>
        </div>
        <Variants cols="xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Variant n={1} label="Week · time grid" className="relative min-h-24 rounded-lg bg-surface p-4">
            <WeekGrid />
          </Variant>
          <Variant n={2} label="Agenda · grouped by day" className="min-h-24 rounded-lg bg-surface p-4">
            <Agenda />
          </Variant>
        </Variants>
      </div>
    </Section>
  )
}
