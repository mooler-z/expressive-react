"use client"

import * as React from "react"
import { getLocalTimeZone, isSameMonth, today, type CalendarDate } from "@internationalized/date"
import {
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarStateContext,
  RangeCalendar as AriaRangeCalendar,
  RangeCalendarStateContext,
  useLocale,
  type CalendarProps as AriaCalendarProps,
  type DateValue,
  type RangeCalendarProps as AriaRangeCalendarProps,
} from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

/*
 * Calendar · M3 date picker grid (androidx DatePickerModalTokens)
 *   day cell     40dp circle in a 48dp column · body-large · CornerFull
 *   selected     primary / on-primary · today: 1dp primary outline, primary label
 *   range        SecondaryContainer band (40dp tall) between primary endpoints
 *   year grid    72×36 pills · selected primary / on-primary · body-large
 *   header       "August 2026 ▾" opens the year grid; chevrons page months
 *
 * <Calendar aria-label="Due date" value={date} onChange={setDate} />
 * <RangeCalendar aria-label="Trip" value={range} onChange={setRange} />
 * <EventCalendar events={events} />   // month planner with event chips
 */

type CalendarState = NonNullable<React.ContextType<typeof CalendarStateContext>>
type RangeState = NonNullable<React.ContextType<typeof RangeCalendarStateContext>>

/** Whichever calendar state is in scope (single or range). */
function useAnyCalendarState(): CalendarState | RangeState {
  const single = React.useContext(CalendarStateContext)
  const range = React.useContext(RangeCalendarStateContext)
  const state = single ?? range
  if (!state) throw new Error("Calendar parts must be rendered inside <Calendar> or <RangeCalendar>")
  return state
}

function useMonthLabel(options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }) {
  const state = useAnyCalendarState()
  const { locale } = useLocale()
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: state.timeZone }).format(
    state.focusedDate.toDate(state.timeZone),
  )
}

type View = "day" | "year"

/** Header row: month/year menu button (toggles the year grid) + previous/next month. */
function CalendarHeader({ view, onViewChange }: { view: View; onViewChange: (v: View) => void }) {
  const label = useMonthLabel()
  return (
    <div data-slot="calendar-header" className="flex h-12 items-center gap-1 pr-1 pl-3">
      <button
        type="button"
        onClick={() => onViewChange(view === "day" ? "year" : "day")}
        aria-label={view === "day" ? `${label}, choose year` : "Back to days"}
        className="state-layer focus-ring inline-flex h-10 cursor-pointer items-center gap-1 rounded-full pr-2 pl-3 text-label-lg text-on-surface-variant"
      >
        {label}
        <Icon
          size={18}
          className={cn(
            "transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
            view === "year" && "rotate-180",
          )}
        >
          arrow_drop_down
        </Icon>
      </button>
      <div className={cn("ml-auto flex", view === "year" && "invisible")}>
        <IconButton slot="previous" aria-label="Previous month" className="size-12 rounded-full">
          <Icon>chevron_left</Icon>
        </IconButton>
        <IconButton slot="next" aria-label="Next month" className="size-12 rounded-full">
          <Icon>chevron_right</Icon>
        </IconButton>
      </div>
    </div>
  )
}

/** Scrollable year grid (72×36 pills). Picking a year returns to the day view. */
function CalendarYearGrid({ onPick }: { onPick: () => void }) {
  const state = useAnyCalendarState()
  const focused = state.focusedDate
  const current = today(state.timeZone).year
  const min = state.minValue?.year ?? focused.year - 100
  const max = state.maxValue?.year ?? focused.year + 100
  const years = React.useMemo(() => {
    const out: number[] = []
    for (let y = Math.max(min, focused.year - 100); y <= Math.min(max, focused.year + 100); y++) out.push(y)
    return out
  }, [min, max, focused.year])
  const selectedRef = React.useRef<HTMLButtonElement>(null)

  React.useLayoutEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "center" })
    selectedRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div
      data-slot="calendar-years"
      role="listbox"
      aria-label="Year"
      className="relative no-scrollbar grid h-[288px] grid-cols-3 content-start gap-y-2 overflow-y-auto px-3 py-2"
    >
      {years.map((y) => {
        const isSelected = y === focused.year
        return (
          <button
            key={y}
            ref={isSelected ? selectedRef : undefined}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => {
              state.setFocusedDate(focused.set({ year: y }))
              onPick()
            }}
            className={cn(
              "state-layer focus-ring mx-auto grid h-9 w-18 cursor-pointer place-items-center rounded-full text-body-lg",
              isSelected
                ? "bg-primary text-on-primary"
                : y === current
                  ? "border border-primary text-primary"
                  : "text-on-surface-variant",
            )}
          >
            {y}
          </button>
        )
      })}
    </div>
  )
}

/** Weekday row + 6-week grid of 40dp day circles. `range` switches to band rendering. */
function CalendarDays({ range = false, hideOutsideDays = true }: { range?: boolean; hideOutsideDays?: boolean }) {
  return (
    <CalendarGrid weekdayStyle="narrow" className="w-full border-collapse px-3 [&_td]:p-0 [&_td]:py-1">
      <CalendarGridHeader>
        {(day) => (
          <CalendarHeaderCell className="h-10 text-center text-body-lg font-normal text-on-surface">{day}</CalendarHeaderCell>
        )}
      </CalendarGridHeader>
      <CalendarGridBody>
        {(date) => (
          <CalendarCell
            date={date}
            className={({ isSelected, isSelectionStart, isSelectionEnd, isOutsideMonth, isDisabled }) =>
              cn(
                "group/day relative flex h-10 w-full items-center justify-center outline-none",
                isDisabled ? "cursor-default" : "cursor-pointer",
                isOutsideMonth && hideOutsideDays && "invisible",
                range &&
                  isSelected &&
                  !isOutsideMonth &&
                  // Band between endpoints; rounded where it wraps to a new week row.
                  (isSelectionStart && isSelectionEnd
                    ? ""
                    : isSelectionStart
                      ? "bg-[linear-gradient(to_right,transparent_50%,var(--md-secondary-container)_50%)] [td:last-child>&]:bg-none"
                      : isSelectionEnd
                        ? "bg-[linear-gradient(to_left,transparent_50%,var(--md-secondary-container)_50%)] [td:first-child>&]:bg-none"
                        : "bg-secondary-container [td:first-child>&]:rounded-l-full [td:last-child>&]:rounded-r-full"),
              )
            }
          >
            {({ formattedDate, isSelected, isSelectionStart, isSelectionEnd, isToday, isUnavailable, isDisabled, isFocusVisible, isOutsideMonth }) => {
              const filled = range ? isSelected && (isSelectionStart || isSelectionEnd) : isSelected
              const inBand = range && isSelected && !filled
              return (
                <span
                  className={cn(
                    "state-layer grid size-10 place-items-center rounded-full text-body-lg",
                    filled
                      ? "bg-primary text-on-primary"
                      : inBand
                        ? "text-on-secondary-container"
                        : isToday
                          ? "border border-primary text-primary"
                          : "text-on-surface",
                    (isDisabled || isOutsideMonth) && !filled && "text-on-surface/38",
                    isUnavailable && "text-on-surface/38 line-through",
                    isFocusVisible && "outline-2 outline-offset-1 outline-secondary",
                  )}
                >
                  {formattedDate}
                </span>
              )
            }}
          </CalendarCell>
        )}
      </CalendarGridBody>
    </CalendarGrid>
  )
}

export interface CalendarProps<T extends DateValue> extends Omit<AriaCalendarProps<T>, "children" | "className"> {
  className?: string
  /** Show the month/year menu that opens the year grid. Defaults to true. */
  yearPicker?: boolean
  /** Open on the day grid (default) or the year grid. */
  defaultView?: "day" | "year"
}

/** M3 date-picker calendar (single date). */
function Calendar<T extends DateValue>({ className, yearPicker = true, defaultView = "day", ...props }: CalendarProps<T>) {
  const [view, setView] = React.useState<View>(defaultView)
  return (
    <AriaCalendar data-slot="calendar" {...props} className={cn("w-full max-w-[360px] text-on-surface", className)}>
      <CalendarHeader view={view} onViewChange={yearPicker ? setView : () => {}} />
      {view === "year" ? <CalendarYearGrid onPick={() => setView("day")} /> : <CalendarDays />}
    </AriaCalendar>
  )
}

export interface RangeCalendarProps<T extends DateValue> extends Omit<AriaRangeCalendarProps<T>, "children" | "className"> {
  className?: string
  yearPicker?: boolean
  defaultView?: "day" | "year"
}

/** M3 date-range calendar: SecondaryContainer band between primary endpoints. */
function RangeCalendar<T extends DateValue>({ className, yearPicker = true, defaultView = "day", ...props }: RangeCalendarProps<T>) {
  const [view, setView] = React.useState<View>(defaultView)
  return (
    <AriaRangeCalendar data-slot="range-calendar" {...props} className={cn("w-full max-w-[360px] text-on-surface", className)}>
      <CalendarHeader view={view} onViewChange={yearPicker ? setView : () => {}} />
      {view === "year" ? <CalendarYearGrid onPick={() => setView("day")} /> : <CalendarDays range />}
    </AriaRangeCalendar>
  )
}

/* ---------------------------------------------------------------- Event calendar (month planner) */

export type CalendarEventTone = "primary" | "secondary" | "tertiary" | "error" | "neutral"

export interface CalendarEvent {
  id: string | number
  date: CalendarDate
  title: string
  tone?: CalendarEventTone
}

const eventTone: Record<CalendarEventTone, string> = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  error: "bg-error-container text-on-error-container",
  neutral: "bg-surface-container-highest text-on-surface",
}

/** Event chip in container roles, as used in the month planner and agenda views. */
function CalendarEventChip({ tone = "primary", className, ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: CalendarEventTone }) {
  return (
    <span
      data-slot="calendar-event"
      className={cn("block truncate rounded-xs px-1.5 py-0.5 text-label-sm", eventTone[tone], className)}
      {...props}
    />
  )
}

function EventCalendarToolbar({ children }: { children?: React.ReactNode }) {
  const state = useAnyCalendarState()
  const label = useMonthLabel()
  const isCurrentMonth = isSameMonth(state.focusedDate, today(state.timeZone))
  return (
    <div data-slot="event-calendar-toolbar" className="flex flex-wrap items-center gap-2 pb-4">
      <h4 className="text-title-lg" aria-live="polite">
        {label}
      </h4>
      <div className="flex">
        <IconButton slot="previous" aria-label="Previous month">
          <Icon>chevron_left</Icon>
        </IconButton>
        <IconButton slot="next" aria-label="Next month">
          <Icon>chevron_right</Icon>
        </IconButton>
      </div>
      {/* slot={null}: opt out of the Calendar's previous/next button slots */}
      <Button
        slot={null}
        variant="outlined"
        size="xs"
        isDisabled={isCurrentMonth}
        onPress={() => state.setFocusedDate(today(state.timeZone))}
      >
        Today
      </Button>
      {children && <div className="ml-auto">{children}</div>}
    </div>
  )
}

export interface EventCalendarProps<T extends DateValue> extends Omit<AriaCalendarProps<T>, "children" | "className"> {
  events?: CalendarEvent[]
  /** Max chips per day before "+N more". */
  maxEvents?: number
  /** Right side of the toolbar (e.g. a Week / Month / Year segmented control). */
  toolbar?: React.ReactNode
  className?: string
}

/** Month view with event chips on container roles; today on primary. Selecting a day fires `onChange`. */
function EventCalendar<T extends DateValue>({ events = [], maxEvents = 2, toolbar, className, ...props }: EventCalendarProps<T>) {
  const byDay = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const k = e.date.toString()
      map.set(k, [...(map.get(k) ?? []), e])
    }
    return map
  }, [events])

  return (
    <AriaCalendar data-slot="event-calendar" {...props} className={cn("w-full text-on-surface", className)}>
      <EventCalendarToolbar>{toolbar}</EventCalendarToolbar>
      <div className="overflow-hidden rounded-lg">
        <CalendarGrid
          weekdayStyle="short"
          className="w-full table-fixed border-separate border-spacing-px bg-outline-variant [&_td]:bg-surface [&_td]:p-0 [&_td]:align-top"
        >
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="bg-surface-container-low px-2 py-2 text-left text-label-md font-medium text-on-surface-variant">
                {day}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => {
              const dayEvents = byDay.get(date.toString()) ?? []
              return (
                <CalendarCell
                  date={date}
                  className={({ isSelected, isFocusVisible, isOutsideMonth }) =>
                    cn(
                      "state-layer flex min-h-16 cursor-pointer flex-col gap-1 p-1 text-left text-body-sm outline-none md:min-h-24 md:p-1.5",
                      isSelected && "bg-primary/10",
                      isOutsideMonth && "text-on-surface/38",
                      isFocusVisible && "outline-2 -outline-offset-2 outline-secondary",
                    )
                  }
                >
                  {({ formattedDate, isToday, isOutsideMonth }) => (
                    <>
                      <span
                        className={cn(
                          "grid size-7 place-items-center rounded-full text-label-lg",
                          isToday && "bg-primary text-on-primary",
                        )}
                      >
                        {formattedDate}
                      </span>
                      {!isOutsideMonth &&
                        dayEvents.slice(0, maxEvents).map((e) => (
                          <CalendarEventChip key={e.id} tone={e.tone}>
                            {e.title}
                          </CalendarEventChip>
                        ))}
                      {!isOutsideMonth && dayEvents.length > maxEvents && (
                        <span className="px-1.5 text-label-sm text-on-surface-variant">+{dayEvents.length - maxEvents} more</span>
                      )}
                    </>
                  )}
                </CalendarCell>
              )
            }}
          </CalendarGridBody>
        </CalendarGrid>
      </div>
    </AriaCalendar>
  )
}

/** Today in the user's time zone, as a CalendarDate. */
function todayDate() {
  return today(getLocalTimeZone())
}

export { Calendar, CalendarEventChip, EventCalendar, RangeCalendar, todayDate, useAnyCalendarState }
