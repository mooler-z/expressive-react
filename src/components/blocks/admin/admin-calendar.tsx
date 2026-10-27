"use client"

import * as React from "react"
import { CalendarDate, getLocalTimeZone } from "@internationalized/date"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { EventCalendar, type CalendarEvent, type CalendarEventTone } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

import { Panel, notify } from "./admin-actions"
import { PageHeader } from "./admin-ui"

type CalendarId = "releases" | "maintenance" | "customer" | "incidents" | "personal"

const CALENDARS: { id: Exclude<CalendarId, "personal">; label: string; dot: string }[] = [
  { id: "releases", label: "Releases", dot: "bg-primary" },
  { id: "maintenance", label: "Maintenance", dot: "bg-secondary" },
  { id: "customer", label: "Customer", dot: "bg-tertiary" },
  { id: "incidents", label: "Incidents", dot: "bg-error" },
]

const TONE: Record<CalendarId, CalendarEventTone> = {
  releases: "primary",
  maintenance: "secondary",
  customer: "tertiary",
  incidents: "error",
  personal: "neutral",
}

const BAR: Record<CalendarEventTone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary-container",
  error: "bg-error",
  neutral: "bg-surface-container-highest",
}

type AdminEvent = { day: number; title: string; calendar: CalendarId; time?: string; detail?: string }

/** October 2026. */
const EVENTS: AdminEvent[] = [
  { day: 3, title: "Release 4.1.9", calendar: "releases" },
  { day: 6, title: "Security review", calendar: "maintenance" },
  { day: 9, title: "Board meeting", calendar: "customer" },
  { day: 9, title: "Payroll", calendar: "personal" },
  { day: 14, title: "Maintenance", calendar: "maintenance" },
  { day: 17, title: "QBR · Halide", calendar: "customer" },
  { day: 21, title: "Release 4.2 RC", calendar: "releases" },
  { day: 23, title: "Game day", calendar: "incidents" },
  { day: 26, title: "Go/no-go for 4.2", calendar: "releases", time: "10:00", detail: "30 min · Meet" },
  { day: 26, title: "1:1 with Jonah", calendar: "personal", time: "13:30", detail: "30 min" },
  { day: 26, title: "Hiring panel", calendar: "customer", time: "16:00", detail: "1 h · Room Fjord" },
  { day: 28, title: "Offsite", calendar: "customer" },
  { day: 30, title: "Release 4.2", calendar: "releases" },
]

const DEMO_TODAY = new CalendarDate(2026, 10, 26)
const VIEWS = ["Day", "Week", "Month"] as const

export function AdminCalendar() {
  const [selected, setSelected] = React.useState(DEMO_TODAY)
  const [shown, setShown] = React.useState<Set<CalendarId>>(new Set(["releases", "maintenance", "customer", "personal"]))

  const visible = EVENTS.filter((e) => shown.has(e.calendar))
  const events: CalendarEvent[] = visible.map((e, i) => ({
    id: i,
    date: new CalendarDate(2026, 10, e.day),
    title: e.title.replace(" for 4.2", ""),
    tone: TONE[e.calendar],
  }))
  const dayEvents = visible.filter((e) => selected.year === 2026 && selected.month === 10 && e.day === selected.day)
  const dayLabel = `${selected.toDate(getLocalTimeZone()).toLocaleDateString("en-US", { weekday: "short" })} ${selected.day}`

  const subscribe = async () => {
    try {
      await navigator.clipboard?.writeText("https://grid.kestrel.io/cal.ics")
    } catch {
      // clipboard blocked: still confirm, the link is shown in the snackbar
    }
    notify("Calendar link copied · grid.kestrel.io/cal.ics")
  }

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Releases, maintenance and meetings"
        actions={
          <>
            <Button variant="outlined" onPress={subscribe}>
              <Icon>link</Icon>
              Subscribe
            </Button>
            <Button onPress={() => notify("New event", "Edit")}>
              <Icon>add</Icon>
              New event
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="relative min-w-0 overflow-x-auto rounded-xl bg-surface-container-low p-4">
          <EventCalendar
            aria-label="Team calendar"
            className="min-w-[560px]"
            events={events}
            value={selected}
            onChange={setSelected}
            defaultFocusedValue={DEMO_TODAY}
            firstDayOfWeek="mon"
            toolbar={
              <ConnectedButtonGroup
                aria-label="View"
                variant="filled"
                size="xs"
                selectedKeys={["Month"]}
                onSelectionChange={(keys) => {
                  const k = [...keys][0]
                  if (k && k !== "Month") notify(`${String(k)} view isn't part of this template`)
                }}
              >
                {VIEWS.map((v) => (
                  <ConnectedButton key={v} id={v}>
                    {v}
                  </ConnectedButton>
                ))}
              </ConnectedButtonGroup>
            }
          />
        </div>

        <div className="space-y-4">
          <Panel
            title={selected.compare(DEMO_TODAY) === 0 ? `Today · ${dayLabel}` : dayLabel}
            description={`${dayEvents.length} ${dayEvents.length === 1 ? "event" : "events"}`}
          >
            {dayEvents.length ? (
              <ul className="space-y-2" aria-live="polite">
                {dayEvents.map((e) => (
                  <li key={e.title} className="flex gap-3 rounded-lg bg-surface p-3">
                    <span className={cn("w-1 shrink-0 rounded-full", BAR[TONE[e.calendar]])} />
                    <div className="min-w-0">
                      {e.time && <div className="text-label-md text-on-surface-variant">{e.time}</div>}
                      <div className="truncate text-title-sm">{e.title}</div>
                      {e.detail && <div className="text-body-sm text-on-surface-variant">{e.detail}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg bg-surface p-3 text-body-md text-on-surface-variant">Nothing scheduled.</p>
            )}
          </Panel>

          <Panel title="Calendars">
            <ul className="space-y-1">
              {CALENDARS.map((c) => (
                <li key={c.id}>
                  <Checkbox
                    isSelected={shown.has(c.id)}
                    onChange={(on) =>
                      setShown((s) => {
                        const next = new Set(s)
                        if (on) next.add(c.id)
                        else next.delete(c.id)
                        return next
                      })
                    }
                    className="text-body-md"
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn("size-2.5 rounded-full", c.dot)} />
                      {c.label}
                    </span>
                  </Checkbox>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
