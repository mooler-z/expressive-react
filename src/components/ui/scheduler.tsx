"use client"

import * as React from "react"
import {
  DateFormatter,
  GregorianCalendar,
  Time,
  createCalendar,
  getDayOfWeek,
  getLocalTimeZone,
  getWeeksInMonth,
  isSameMonth,
  isWeekend,
  now as nowIn,
  startOfMonth,
  startOfWeek,
  endOfMonth,
  toCalendar,
  toCalendarDate,
  toCalendarDateTime,
  toTimeZone,
  type Calendar,
  type CalendarDate,
  type CalendarDateTime,
  type CalendarIdentifier,
  type DayOfWeek,
  type ZonedDateTime,
} from "@internationalized/date"
import {
  Button as AriaButton,
  DialogTrigger,
  ListBox,
  ListBoxItem,
  useLocale,
  type Key,
  type Selection,
} from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverTitle } from "@/components/ui/popover"
import { Ripple } from "@/components/ui/ripple"
import { prefersReducedMotion, springTiming } from "@/hooks/use-motion"
import { cn, tv } from "@/lib/utils"

/*
 * Scheduler · event calendar (month · week · day · agenda) and a weekly timetable.
 * M3 has no scheduler component; this composes M3 parts on the kit's calendar article
 * (Components → calendar: month grid, week time grid, agenda grouped by day).
 *
 *   header      title-large · prev/next standard icon buttons S (40dp) · Today outlined Button XS (32dp)
 *               · view switcher ConnectedButtonGroup XS
 *   month       1dp outline-variant grid · weekday row surface-container-low, label-medium
 *               day number 28dp circle, label-large · today primary / on-primary · outside the month on-surface 38%
 *               event chips 20dp, label-small, CornerExtraSmall 4dp, container roles · "+N more" → Popover
 *   week / day  48dp per hour (hourHeight) · hour labels label-small · all-day lanes 20dp
 *               event blocks CornerSmall 8dp, label-medium title + label-small time, 1dp surface ring
 *               now line 2dp primary with a 12dp dot
 *   agenda      label-large day header (today primary) · rows: time body-small · 4dp accent bar
 *               · title label-large · description body-small on-surface-variant
 *   timetable   day columns surface-container-low, CornerLarge 16dp · session cards CornerMedium 12dp,
 *               container roles · selected: 2dp primary ring + filled check
 *   shapes      androidx ShapeTokens: CornerExtraSmall 4 · CornerSmall 8 · CornerMedium 12 · CornerLarge 16
 *   motion      state layers / colors on DefaultEffects (state-layer utility) · paging slides 24dp on the
 *               FastSpatial spring with a FastEffects fade (androidx ExpressiveMotionTokens); none under
 *               prefers-reduced-motion
 *
 * Dates use @internationalized/date in the locale's calendar system (I18nProvider locale, e.g.
 * "am-ET-u-ca-ethiopic" for 13-month Ethiopian months), so month grids, paging and titles follow it.
 *
 * <Scheduler events={events} onEventAction={open} onSlotAction={create} />
 * <Timetable days={days} sessions={sessions} onAddSession={add} />
 */

/* -------------------------------------------------------------------------------------------------
 * Types
 * -----------------------------------------------------------------------------------------------*/

export type SchedulerView = "month" | "week" | "day" | "agenda"
export type SchedulerEventColor = "primary" | "secondary" | "tertiary" | "error" | "neutral"
export type SchedulerDateValue = CalendarDate | CalendarDateTime | ZonedDateTime

export interface SchedulerEvent {
  id: string | number
  title: string
  /** A CalendarDate is an all-day event; CalendarDateTime is wall-clock time in `timeZone`; ZonedDateTime is converted. */
  start: SchedulerDateValue
  /** Timed events: exclusive end (defaults to start + 1 h). All-day events: the last day, inclusive. */
  end?: SchedulerDateValue
  /** Force all-day even when start has a time. */
  allDay?: boolean
  /** Container role for the fill. Defaults to "primary". */
  color?: SchedulerEventColor
  description?: string
}

/** What onSlotAction receives: dates in the locale's calendar system (`toString()` is always ISO 8601). */
export interface SchedulerSlot {
  start: CalendarDate | CalendarDateTime
  /** All-day slots: the same day (inclusive). Timed slots: start + slotMinutes (exclusive). */
  end: CalendarDate | CalendarDateTime
  allDay: boolean
}

export interface SchedulerLabels {
  today: string
  previous: string
  next: string
  /** Accessible name of the view switcher. */
  view: string
  month: string
  week: string
  day: string
  agenda: string
  allDay: string
  noEvents: string
  more: (count: number) => string
}

const DEFAULT_LABELS: SchedulerLabels = {
  today: "Today",
  previous: "Previous",
  next: "Next",
  view: "View",
  month: "Month",
  week: "Week",
  day: "Day",
  agenda: "Agenda",
  allDay: "All day",
  noEvents: "No events",
  more: (n) => `+${n} more`,
}

const ALL_VIEWS: SchedulerView[] = ["month", "week", "day", "agenda"]
const WEEKDAY_IDS: DayOfWeek[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]

/* -------------------------------------------------------------------------------------------------
 * Variants
 * -----------------------------------------------------------------------------------------------*/

const schedulerEventVariants = tv({
  base: "relative min-w-0 text-start outline-none",
  variants: {
    color: { primary: "", secondary: "", tertiary: "", error: "", neutral: "" },
    variant: {
      chip: "block h-5 truncate rounded-xs px-1.5 text-label-sm leading-5",
      block: "flex size-full flex-col overflow-hidden rounded-sm px-2 py-1 ring-1 ring-surface",
      row: "flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-on-surface",
    },
    interactive: { true: "state-layer focus-ring cursor-pointer data-focus-visible:z-10", false: "" },
  },
  compoundVariants: [
    { variant: ["chip", "block"], color: "primary", class: "bg-primary-container text-on-primary-container" },
    { variant: ["chip", "block"], color: "secondary", class: "bg-secondary-container text-on-secondary-container" },
    { variant: ["chip", "block"], color: "tertiary", class: "bg-tertiary-container text-on-tertiary-container" },
    { variant: ["chip", "block"], color: "error", class: "bg-error-container text-on-error-container" },
    { variant: ["chip", "block"], color: "neutral", class: "bg-surface-container-highest text-on-surface" },
  ],
  defaultVariants: { color: "primary", variant: "chip", interactive: false },
})

/** Solid role for the agenda accent bar. */
const accentColor: Record<SchedulerEventColor, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  error: "bg-error",
  neutral: "bg-outline",
}

/* -------------------------------------------------------------------------------------------------
 * Date helpers (calendar-system agnostic: everything is compared by Julian day)
 * -----------------------------------------------------------------------------------------------*/

type WallDate = CalendarDate | CalendarDateTime

const isZoned = (v: SchedulerDateValue): v is ZonedDateTime => "timeZone" in v
const hasTime = (v: WallDate): v is CalendarDateTime => "hour" in v
const julian = (d: WallDate) => d.calendar.toJulianDay(d)

/** The locale's calendar system (gregory, ethiopic, persian…), as React Aria's Calendar resolves it. */
function useLocaleCalendar(locale: string): Calendar {
  return React.useMemo(() => {
    try {
      return createCalendar(new Intl.DateTimeFormat(locale).resolvedOptions().calendar as CalendarIdentifier)
    } catch {
      return new GregorianCalendar()
    }
  }, [locale])
}

/** Wall-clock value in `timeZone`, converted into `calendar`. */
function toWall(v: SchedulerDateValue, timeZone: string, calendar: Calendar): WallDate {
  const wall = isZoned(v) ? toCalendarDateTime(toTimeZone(v, timeZone)) : v
  return toCalendar(wall, calendar)
}

interface NormalizedEvent {
  event: SchedulerEvent
  color: SchedulerEventColor
  allDay: boolean
  /** Timed and at least 24 h long: drawn as a bar with the all-day events. */
  long: boolean
  /** Julian days, inclusive. */
  startJ: number
  endJ: number
  /** Julian day of the end instant (timed events). */
  endDateJ: number
  /** Wall-clock minutes from midnight. */
  startMin: number
  endMin: number
  startDate: CalendarDate
  endDate: CalendarDate
}

function normalizeEvent(event: SchedulerEvent, timeZone: string, calendar: Calendar): NormalizedEvent {
  const start = toWall(event.start, timeZone, calendar)
  const end = event.end ? toWall(event.end, timeZone, calendar) : undefined
  const color = event.color ?? "primary"

  if (event.allDay || !hasTime(start)) {
    const startJ = julian(start)
    let endJ = end ? julian(end) : startJ
    // A date-time end at midnight is exclusive (iCal style).
    if (end && hasTime(end) && end.hour === 0 && end.minute === 0 && endJ > startJ) endJ--
    endJ = Math.max(startJ, endJ)
    const startDate = toCalendarDate(start)
    return {
      event, color, allDay: true, long: true, startJ, endJ, endDateJ: endJ, startMin: 0, endMin: 1440,
      startDate, endDate: startDate.add({ days: endJ - startJ }),
    }
  }

  let endDT = end ? (hasTime(end) ? end : toCalendarDateTime(end)) : start.add({ hours: 1 })
  if (endDT.compare(start) < 0) endDT = start
  const startJ = julian(start)
  const endDateJ = julian(endDT)
  const startMin = start.hour * 60 + start.minute
  const endMin = endDT.hour * 60 + endDT.minute
  const endJ = endMin === 0 && endDateJ > startJ ? endDateJ - 1 : endDateJ
  return {
    event, color, allDay: false,
    long: (endDateJ - startJ) * 1440 + endMin - startMin >= 1440,
    startJ, endJ, endDateJ, startMin, endMin,
    startDate: toCalendarDate(start), endDate: toCalendarDate(endDT),
  }
}

const byStart = (a: NormalizedEvent, b: NormalizedEvent) =>
  Number(b.allDay || b.long) - Number(a.allDay || a.long) ||
  a.startJ - b.startJ ||
  a.startMin - b.startMin ||
  b.endJ - b.startJ - (a.endJ - a.startJ) ||
  a.event.title.localeCompare(b.event.title)

/* -------------------------------------------------------------------------------------------------
 * Layout: lanes for bars (month rows, all-day row) and side-by-side columns for timed events
 * -----------------------------------------------------------------------------------------------*/

interface LaneItem {
  item: NormalizedEvent
  /** First and last visible column covered. */
  c0: number
  c1: number
  lane: number
  /** Continues before / after the visible columns (corners square off on that side). */
  startsBefore: boolean
  endsAfter: boolean
}

function layoutLanes(dayJs: number[], items: NormalizedEvent[]): { placed: LaneItem[]; lanes: number } {
  const first = dayJs[0]
  const last = dayJs[dayJs.length - 1]
  const sorted = items
    .filter((it) => it.startJ <= last && it.endJ >= first)
    .sort((a, b) => a.startJ - b.startJ || b.endJ - b.startJ - (a.endJ - a.startJ) || byStart(a, b))
  const occupied: boolean[][] = []
  const placed: LaneItem[] = []
  for (const item of sorted) {
    const c0 = dayJs.findIndex((j) => j >= item.startJ)
    let c1 = -1
    for (let c = dayJs.length - 1; c >= 0; c--) if (dayJs[c] <= item.endJ) { c1 = c; break }
    if (c0 < 0 || c1 < c0) continue
    let lane = 0
    while (occupied[lane]?.slice(c0, c1 + 1).some(Boolean)) lane++
    occupied[lane] ??= []
    for (let c = c0; c <= c1; c++) occupied[lane][c] = true
    placed.push({ item, c0, c1, lane, startsBefore: item.startJ < dayJs[c0], endsAfter: item.endJ > dayJs[c1] })
  }
  return { placed, lanes: occupied.length }
}

interface Segment {
  item: NormalizedEvent
  /** Visible minutes from midnight. */
  start: number
  end: number
  col: number
  cols: number
  span: number
}

/** Timed events of one day, clipped to the visible hours, overlaps laid out side by side. */
function layoutDay(items: NormalizedEvent[], dayJ: number, visStart: number, visEnd: number, minMinutes: number): Segment[] {
  const segs: Segment[] = []
  for (const item of items) {
    if (item.allDay || item.long || dayJ < item.startJ || dayJ > item.endJ) continue
    const rawStart = dayJ > item.startJ ? 0 : item.startMin
    const rawEnd = item.endDateJ > dayJ ? 1440 : item.endMin
    if (rawStart >= visEnd || (rawEnd <= visStart && rawEnd > rawStart)) continue
    const start = Math.max(rawStart, visStart)
    const end = Math.min(Math.max(rawEnd, start + minMinutes), visEnd)
    segs.push({ item, start, end, col: 0, cols: 1, span: 1 })
  }
  segs.sort((a, b) => a.start - b.start || b.end - a.end)

  let cluster: Segment[] = []
  let colEnds: number[] = []
  let clusterEnd = -1
  const flush = () => {
    for (const s of cluster) {
      s.cols = colEnds.length
      // Stretch into free columns to the right.
      for (let c = s.col + 1; c < colEnds.length; c++) {
        if (cluster.some((o) => o.col === c && o.start < s.end && o.end > s.start)) break
        s.span++
      }
    }
    cluster = []
    colEnds = []
    clusterEnd = -1
  }
  for (const s of segs) {
    if (cluster.length && s.start >= clusterEnd) flush()
    let col = colEnds.findIndex((end) => end <= s.start)
    if (col < 0) {
      col = colEnds.length
      colEnds.push(s.end)
    } else colEnds[col] = s.end
    s.col = col
    cluster.push(s)
    clusterEnd = Math.max(clusterEnd, s.end)
  }
  flush()
  return segs
}

/* -------------------------------------------------------------------------------------------------
 * Context shared by the view parts
 * -----------------------------------------------------------------------------------------------*/

interface Formatters {
  date: (d: CalendarDate, f: DateFormatter) => string
  monthYear: DateFormatter
  fullDate: DateFormatter
  dayTitle: DateFormatter
  dayNum: DateFormatter
  weekday: DateFormatter
  weekdayNarrow: DateFormatter
  agendaDay: DateFormatter
  /** Wall-clock minutes → "9:00 AM" (formatted in UTC so DST can't shift it). */
  time: (minutes: number) => string
  /** "9:40 – 10:25 AM" (Intl range: the shared day period is written once). */
  timeRange: (from: number, to: number) => string
  hour: (hour: number) => string
}

function useFormatters(locale: string, timeZone: string): Formatters {
  return React.useMemo(() => {
    const clock = new DateFormatter(locale, { hour: "numeric", minute: "2-digit", timeZone: "UTC" })
    const hour = new DateFormatter(locale, { hour: "numeric", timeZone: "UTC" })
    const utc = (m: number) => new Date(Date.UTC(2000, 0, 1, Math.floor(m / 60), m % 60))
    return {
      date: (d, f) => f.format(d.toDate(timeZone)),
      monthYear: new DateFormatter(locale, { month: "long", year: "numeric", timeZone }),
      fullDate: new DateFormatter(locale, { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone }),
      dayTitle: new DateFormatter(locale, { month: "long", day: "numeric", year: "numeric", timeZone }),
      dayNum: new DateFormatter(locale, { day: "numeric", timeZone }),
      weekday: new DateFormatter(locale, { weekday: "short", timeZone }),
      weekdayNarrow: new DateFormatter(locale, { weekday: "narrow", timeZone }),
      agendaDay: new DateFormatter(locale, { weekday: "short", month: "short", day: "numeric", timeZone }),
      time: (m) => clock.format(utc(m)),
      // Past midnight Intl would add dates, so join the two times instead.
      timeRange: (a, b) => (b < 1440 ? clock.formatRange(utc(a), utc(b)) : `${clock.format(utc(a))} – ${clock.format(utc(b))}`),
      hour: (h) => hour.format(utc(h * 60)),
    }
  }, [locale, timeZone])
}

interface SchedulerContextValue {
  fmt: Formatters
  labels: SchedulerLabels
  todayJ: number
  nowMinutes: number
  onEventAction?: (event: SchedulerEvent) => void
  onSlotAction?: (slot: SchedulerSlot) => void
  /** Opens the day view, or null when it's unavailable. */
  openDay: ((day: CalendarDate) => void) | null
  renderEvent?: SchedulerProps["renderEvent"]
  view: SchedulerView
}

const SchedulerContext = React.createContext<SchedulerContextValue | null>(null)

function useSchedulerContext() {
  const ctx = React.useContext(SchedulerContext)
  if (!ctx) throw new Error("Scheduler parts must be rendered inside <Scheduler>")
  return ctx
}

/** Accessible description: "Mid-term exams, Monday, October 12, 2026 – Friday, October 16, 2026". */
function describeEvent(it: NormalizedEvent, { fmt, labels }: SchedulerContextValue) {
  const from = fmt.date(it.startDate, fmt.fullDate)
  if (it.allDay) {
    return it.endJ > it.startJ
      ? `${it.event.title}, ${from} – ${fmt.date(it.endDate, fmt.fullDate)}`
      : `${it.event.title}, ${from}, ${labels.allDay}`
  }
  const until = it.endDateJ > it.startJ ? `${fmt.date(it.endDate, fmt.fullDate)} ${fmt.time(it.endMin)}` : fmt.time(it.endMin)
  return `${it.event.title}, ${from}, ${fmt.time(it.startMin)} – ${until}`
}

/* -------------------------------------------------------------------------------------------------
 * Event surface: a React Aria Button when onEventAction is set, otherwise static.
 * -----------------------------------------------------------------------------------------------*/

interface EventItemProps {
  item: NormalizedEvent
  variant: "chip" | "block" | "row"
  className?: string
  style?: React.CSSProperties
  /** "close" inside the "+N more" popover. */
  slot?: string
  children: React.ReactNode
}

function SchedulerEventItem({ item, variant, className, style, slot, children }: EventItemProps) {
  const ctx = useSchedulerContext()
  const interactive = !!ctx.onEventAction
  const classes = schedulerEventVariants({ color: item.color, variant, interactive, className })
  const content = ctx.renderEvent ? ctx.renderEvent(item.event, { view: ctx.view, variant }) : children
  if (!interactive) {
    return (
      <div data-slot="scheduler-event" data-scheduler-event="" className={classes} style={style} title={variant === "chip" ? item.event.title : undefined}>
        {content}
      </div>
    )
  }
  return (
    <AriaButton
      data-slot="scheduler-event"
      data-scheduler-event=""
      slot={slot}
      aria-label={describeEvent(item, ctx)}
      onPress={() => ctx.onEventAction?.(item.event)}
      className={classes}
      style={style}
    >
      {content}
      <Ripple />
    </AriaButton>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

interface SchedulerHeaderProps {
  title: string
  view: SchedulerView
  views: SchedulerView[]
  labels: SchedulerLabels
  actions?: React.ReactNode
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onViewChange: (view: SchedulerView) => void
}

function SchedulerHeader({ title, view, views, labels, actions, onPrevious, onNext, onToday, onViewChange }: SchedulerHeaderProps) {
  return (
    <div data-slot="scheduler-header" className="flex flex-wrap items-center gap-x-2 gap-y-3 pb-4">
      <h3 data-slot="scheduler-title" aria-live="polite" className="min-w-0 basis-full text-title-lg text-on-surface @min-[600px]:basis-auto">
        {title}
      </h3>
      <div className="flex items-center gap-1">
        <IconButton aria-label={labels.previous} onPress={onPrevious}>
          <Icon className="rtl:-scale-x-100">chevron_left</Icon>
        </IconButton>
        <IconButton aria-label={labels.next} onPress={onNext}>
          <Icon className="rtl:-scale-x-100">chevron_right</Icon>
        </IconButton>
        <Button variant="outlined" size="xs" onPress={onToday} className="ms-1">
          {labels.today}
        </Button>
      </div>
      <div className="ms-auto flex flex-wrap items-center gap-2">
        {actions}
        {views.length > 1 && (
          <ConnectedButtonGroup
            aria-label={labels.view}
            size="xs"
            selectedKeys={[view]}
            onSelectionChange={(keys) => {
              const next = [...keys][0]
              if (next) onViewChange(next as SchedulerView)
            }}
          >
            {views.map((v) => (
              <ConnectedButton key={v} id={v}>
                {labels[v]}
              </ConnectedButton>
            ))}
          </ConnectedButtonGroup>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Day number (month cells and week headers): opens the day view when it's available
 * -----------------------------------------------------------------------------------------------*/

function SchedulerDayNumber({ day, className, dim }: { day: CalendarDate; className: string; dim?: boolean }) {
  const ctx = useSchedulerContext()
  const isToday = julian(day) === ctx.todayJ
  const classes = cn(
    "relative grid shrink-0 place-items-center rounded-full",
    isToday ? "bg-primary text-on-primary" : dim ? "text-on-surface/38" : "text-on-surface",
    className,
  )
  const label = ctx.fmt.date(day, ctx.fmt.dayNum)
  if (!ctx.openDay) return <span className={classes}>{label}</span>
  const full = ctx.fmt.date(day, ctx.fmt.fullDate)
  return (
    <AriaButton
      data-slot="scheduler-day-button"
      aria-label={isToday ? `${ctx.labels.today}, ${full}` : full}
      onPress={() => ctx.openDay?.(day)}
      className={cn("state-layer focus-ring cursor-pointer", classes)}
    >
      {label}
      <Ripple />
    </AriaButton>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Month view
 * -----------------------------------------------------------------------------------------------*/

const MONTH_LANE = 22 // 20dp chip + 2dp gap
const MONTH_HEAD = 36 // 28dp day number + margins

function SchedulerMonthView({ weeks, focused, items, maxEvents }: { weeks: CalendarDate[][]; focused: CalendarDate; items: NormalizedEvent[]; maxEvents: number }) {
  const ctx = useSchedulerContext()
  const cols = `repeat(${weeks[0]?.length ?? 7}, minmax(0, 1fr))`
  return (
    <div data-slot="scheduler-month" className="overflow-hidden rounded-lg border border-outline-variant bg-surface">
      <div aria-hidden className="grid border-b border-outline-variant bg-surface-container-low" style={{ gridTemplateColumns: cols }}>
        {weeks[0]?.map((d) => (
          <div key={d.toString()} className="truncate px-2 py-2 text-label-md text-on-surface-variant">
            <span className="@max-[600px]:hidden">{ctx.fmt.date(d, ctx.fmt.weekday)}</span>
            <span className="@min-[600px]:hidden">{ctx.fmt.date(d, ctx.fmt.weekdayNarrow)}</span>
          </div>
        ))}
      </div>
      {weeks.map((week) => (
        <SchedulerMonthRow key={week[0].toString()} days={week} focused={focused} items={items} maxEvents={maxEvents} cols={cols} />
      ))}
    </div>
  )
}

function SchedulerMonthRow({ days, focused, items, maxEvents, cols }: { days: CalendarDate[]; focused: CalendarDate; items: NormalizedEvent[]; maxEvents: number; cols: string }) {
  const ctx = useSchedulerContext()
  const dayJs = React.useMemo(() => days.map(julian), [days])
  const { placed } = React.useMemo(() => layoutLanes(dayJs, items), [dayJs, items])
  const hidden = dayJs.map((_, c) => placed.filter((p) => p.lane >= maxEvents && p.c0 <= c && p.c1 >= c).length)

  return (
    <div
      data-slot="scheduler-week-row"
      className="grid border-b border-outline-variant last:border-b-0"
      style={{ gridTemplateColumns: cols, gridTemplateRows: `${MONTH_HEAD}px repeat(${maxEvents}, ${MONTH_LANE}px) ${MONTH_LANE}px minmax(4px, 1fr)` }}
    >
      {days.map((d, c) => (
        <div
          key={`bg-${d.toString()}`}
          aria-hidden
          data-slot="scheduler-day"
          data-outside-month={!isSameMonth(d, focused) || undefined}
          onClick={ctx.onSlotAction ? () => ctx.onSlotAction?.({ start: d, end: d, allDay: true }) : undefined}
          className={cn(
            "border-s border-outline-variant first:border-s-0 data-outside-month:bg-surface-container-low",
            ctx.onSlotAction && "state-layer cursor-pointer text-on-surface",
          )}
          style={{ gridColumn: c + 1, gridRow: "1 / -1" }}
        />
      ))}
      {days.map((d, c) => (
        <React.Fragment key={d.toString()}>
          <div className="pointer-events-none p-1" style={{ gridColumn: c + 1, gridRow: 1 }}>
            <SchedulerDayNumber day={d} dim={!isSameMonth(d, focused)} className="pointer-events-auto size-7 text-label-lg" />
          </div>
          {placed
            .filter((p) => p.c0 === c && p.lane < maxEvents)
            .sort((a, b) => a.lane - b.lane)
            .map((p) => (
              <SchedulerEventItem
                key={p.item.event.id}
                item={p.item}
                variant="chip"
                className={cn("mx-0.5 self-start px-1 @min-[600px]:mx-1 @min-[600px]:px-1.5", p.startsBefore && "ms-0 rounded-s-none @min-[600px]:ms-0", p.endsAfter && "me-0 rounded-e-none @min-[600px]:me-0")}
                style={{ gridColumn: `${p.c0 + 1} / ${p.c1 + 2}`, gridRow: p.lane + 2 }}
              >
                {p.item.event.title}
              </SchedulerEventItem>
            ))}
          {hidden[c] > 0 && (
            <SchedulerMorePopover day={d} count={hidden[c]} items={items} style={{ gridColumn: c + 1, gridRow: maxEvents + 2 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function SchedulerMorePopover({ day, count, items, style }: { day: CalendarDate; count: number; items: NormalizedEvent[]; style: React.CSSProperties }) {
  const ctx = useSchedulerContext()
  const j = julian(day)
  const dayItems = items.filter((it) => it.startJ <= j && it.endJ >= j).sort(byStart)
  const full = ctx.fmt.date(day, ctx.fmt.fullDate)
  return (
    <DialogTrigger>
      <AriaButton
        data-slot="scheduler-more"
        aria-label={`${ctx.labels.more(count)}, ${full}`}
        className="state-layer focus-ring relative mx-0.5 block h-5 cursor-pointer self-start truncate rounded-xs px-1 text-start text-label-sm leading-5 text-on-surface-variant @min-[600px]:mx-1 @min-[600px]:px-1.5"
        style={style}
      >
        <span className="@max-[600px]:hidden">{ctx.labels.more(count)}</span>
        <span className="@min-[600px]:hidden">+{count}</span>
        <Ripple />
      </AriaButton>
      <Popover placement="bottom start" className="w-72">
        <PopoverTitle>{full}</PopoverTitle>
        <div className="mt-3 flex max-h-72 flex-col gap-1 overflow-y-auto">
          {dayItems.map((it) => (
            <SchedulerEventItem key={it.event.id} item={it} variant="chip" slot="close" className="h-7 shrink-0 leading-7">
              {!it.allDay && !it.long && j === it.startJ && <span className="me-1.5 tabular-nums">{ctx.fmt.time(it.startMin)}</span>}
              {it.event.title}
            </SchedulerEventItem>
          ))}
        </div>
      </Popover>
    </DialogTrigger>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Week / day view: time grid
 * -----------------------------------------------------------------------------------------------*/

interface TimeGridProps {
  days: CalendarDate[]
  items: NormalizedEvent[]
  dayStartHour: number
  dayEndHour: number
  hourHeight: number
  slotMinutes: number
  scrollToHour: number
}

function SchedulerTimeGrid({ days, items, dayStartHour, dayEndHour, hourHeight, slotMinutes, scrollToHour }: TimeGridProps) {
  const ctx = useSchedulerContext()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [gutter, setGutter] = React.useState(56)
  const visStart = dayStartHour * 60
  const visEnd = dayEndHour * 60
  const height = (dayEndHour - dayStartHour) * hourHeight
  const dayJs = React.useMemo(() => days.map(julian), [days])
  const cols = `${gutter}px repeat(${days.length}, minmax(72px, 1fr))`

  const bars = React.useMemo(() => layoutLanes(dayJs, items.filter((it) => it.allDay || it.long)), [dayJs, items])
  const showAllDay = bars.lanes > 0 || !!ctx.onSlotAction

  // Fit the gutter to the widest hour label ("9 AM", "11 ከሰዓት"…).
  React.useLayoutEffect(() => {
    const labels = scrollRef.current?.querySelectorAll<HTMLElement>("[data-gutter-label]")
    if (!labels?.length) return
    const widest = Math.max(...Array.from(labels, (l) => l.getBoundingClientRect().width))
    setGutter(Math.max(48, Math.ceil(widest) + 16))
  }, [ctx.fmt, ctx.labels.allDay, dayStartHour, dayEndHour, showAllDay])

  // Start the day at `scrollToHour` (once per mount, so paging keeps the scroll position).
  React.useLayoutEffect(() => {
    const el = scrollRef.current
    // 12px of headroom keeps the hour label, which straddles its line, clear of the sticky header.
    if (el) el.scrollTop = Math.max(0, (Math.min(Math.max(scrollToHour, dayStartHour), dayEndHour) - dayStartHour) * hourHeight - 12)
  }, [])

  return (
    <div
      ref={scrollRef}
      data-slot="scheduler-time-grid"
      className="relative max-h-(--scheduler-max-height) overflow-auto rounded-lg border border-outline-variant bg-surface"
    >
      <div style={{ minWidth: `calc(${gutter}px + ${days.length} * 72px)` }}>
        <div className="sticky top-0 z-30 border-b border-outline-variant bg-surface">
          <div className="grid" style={{ gridTemplateColumns: cols }}>
            <div className="sticky start-0 z-10 bg-surface" />
            {days.map((d) => {
              const isToday = julian(d) === ctx.todayJ
              return (
                <div key={d.toString()} className="flex min-w-0 flex-col items-center gap-0.5 py-2">
                  <span className={cn("truncate text-label-md", isToday ? "text-primary" : "text-on-surface-variant")}>
                    {ctx.fmt.date(d, ctx.fmt.weekday)}
                  </span>
                  <SchedulerDayNumber day={d} className="size-10 text-title-md" />
                </div>
              )
            })}
          </div>
          {showAllDay && (
            <div
              data-slot="scheduler-all-day"
              className="grid border-t border-outline-variant"
              style={{ gridTemplateColumns: cols, gridTemplateRows: `repeat(${Math.max(1, bars.lanes)}, ${MONTH_LANE}px) 4px` }}
            >
              <div
                className="sticky start-0 z-10 bg-surface px-2 pt-1 text-end text-label-sm text-on-surface-variant"
                style={{ gridColumn: 1, gridRow: "1 / -1" }}
              >
                <span data-gutter-label="" className="whitespace-nowrap">
                  {ctx.labels.allDay}
                </span>
              </div>
              {days.map((d, c) => (
                <div
                  key={d.toString()}
                  aria-hidden
                  onClick={ctx.onSlotAction ? () => ctx.onSlotAction?.({ start: d, end: d, allDay: true }) : undefined}
                  className={cn("border-s border-outline-variant", ctx.onSlotAction && "state-layer cursor-pointer text-on-surface")}
                  style={{ gridColumn: c + 2, gridRow: "1 / -1" }}
                />
              ))}
              {bars.placed.map((p) => (
                <SchedulerEventItem
                  key={p.item.event.id}
                  item={p.item}
                  variant="chip"
                  className={cn("mx-0.5 mt-0.5", p.startsBefore && "ms-0 rounded-s-none", p.endsAfter && "me-0 rounded-e-none")}
                  style={{ gridColumn: `${p.c0 + 2} / ${p.c1 + 3}`, gridRow: p.lane + 1 }}
                >
                  {p.item.event.title}
                </SchedulerEventItem>
              ))}
            </div>
          )}
        </div>

        <div className="grid" style={{ gridTemplateColumns: cols }}>
          <div aria-hidden className="sticky start-0 z-20 bg-surface" style={{ height }}>
            {Array.from({ length: dayEndHour - dayStartHour }, (_, i) => dayStartHour + i)
              .filter((h) => h > dayStartHour)
              .map((h) => (
                <span
                  key={h}
                  data-gutter-label=""
                  className="absolute end-2 -translate-y-1/2 text-label-sm whitespace-nowrap text-on-surface-variant tabular-nums"
                  style={{ top: (h - dayStartHour) * hourHeight }}
                >
                  {ctx.fmt.hour(h)}
                </span>
              ))}
          </div>
          {days.map((d, c) => (
            <SchedulerDayColumn
              key={d.toString()}
              day={d}
              dayJ={dayJs[c]}
              items={items}
              visStart={visStart}
              visEnd={visEnd}
              hourHeight={hourHeight}
              slotMinutes={slotMinutes}
              height={height}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface DayColumnProps {
  day: CalendarDate
  dayJ: number
  items: NormalizedEvent[]
  visStart: number
  visEnd: number
  hourHeight: number
  slotMinutes: number
  height: number
}

function SchedulerDayColumn({ day, dayJ, items, visStart, visEnd, hourHeight, slotMinutes, height }: DayColumnProps) {
  const ctx = useSchedulerContext()
  const [hover, setHover] = React.useState<number | null>(null)
  const minMinutes = Math.ceil((20 / hourHeight) * 60)
  const segments = React.useMemo(() => layoutDay(items, dayJ, visStart, visEnd, minMinutes), [items, dayJ, visStart, visEnd, minMinutes])
  const y = (minutes: number) => ((minutes - visStart) / 60) * hourHeight
  const isToday = dayJ === ctx.todayJ
  const showNow = isToday && ctx.nowMinutes >= visStart && ctx.nowMinutes < visEnd

  const slotAt = (e: React.PointerEvent | React.MouseEvent) => {
    const top = e.currentTarget.getBoundingClientRect().top
    const minutes = visStart + Math.floor((((e.clientY - top) / hourHeight) * 60) / slotMinutes) * slotMinutes
    return Math.max(visStart, Math.min(minutes, visEnd - slotMinutes))
  }
  const onEvent = (e: React.SyntheticEvent) => (e.target as HTMLElement).closest("[data-scheduler-event]") != null

  return (
    <div
      data-slot="scheduler-day-column"
      data-today={isToday || undefined}
      className={cn("relative border-s border-outline-variant", ctx.onSlotAction && "cursor-pointer")}
      style={{
        height,
        backgroundImage: "linear-gradient(to bottom, var(--md-outline-variant) 1px, transparent 1px)",
        backgroundSize: `100% ${hourHeight}px`,
        backgroundPosition: "0 -1px",
      }}
      onPointerMove={
        ctx.onSlotAction
          ? (e) => {
              if (e.pointerType !== "mouse" || onEvent(e)) return setHover(null)
              setHover(slotAt(e))
            }
          : undefined
      }
      onPointerLeave={ctx.onSlotAction ? () => setHover(null) : undefined}
      onClick={
        ctx.onSlotAction
          ? (e) => {
              if (onEvent(e)) return
              const m = slotAt(e)
              const start = toCalendarDateTime(day, new Time(Math.floor(m / 60), m % 60))
              ctx.onSlotAction?.({ start, end: start.add({ minutes: slotMinutes }), allDay: false })
            }
          : undefined
      }
    >
      {hover != null && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0.5 rounded-sm bg-primary/12 px-2 text-label-sm text-primary transition-[top] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial motion-reduce:transition-none"
          style={{ top: y(hover), height: (slotMinutes / 60) * hourHeight }}
        >
          {ctx.fmt.time(hover)}
        </div>
      )}
      {segments.map((s) => {
        const h = y(s.end) - y(s.start)
        const compact = h < 40
        return (
          <div
            key={s.item.event.id}
            className="absolute"
            style={{
              top: y(s.start) + 1,
              height: h - 2,
              insetInlineStart: `calc(${(s.col / s.cols) * 100}% + 2px)`,
              width: `calc(${(s.span / s.cols) * 100}% - 4px)`,
            }}
          >
            <SchedulerEventItem item={s.item} variant="block" className={cn(compact && "py-0.5")}>
              {compact ? (
                <span className="truncate text-label-md">
                  {s.item.event.title} <span className="text-label-sm">{ctx.fmt.time(s.start)}</span>
                </span>
              ) : (
                <>
                  <span
                    className="text-label-md break-words"
                    // Tall, narrow blocks wrap the title over the lines the block has room for.
                    style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: Math.max(1, Math.floor((h - 10) / 16) - 1), overflow: "hidden" }}
                  >
                    {s.item.event.title}
                  </span>
                  <span className="truncate text-label-sm tabular-nums">
                    {ctx.fmt.timeRange(s.item.startJ === dayJ ? s.item.startMin : 0, s.item.endDateJ === dayJ ? s.item.endMin : 1440)}
                  </span>
                </>
              )}
            </SchedulerEventItem>
          </div>
        )
      })}
      {showNow && (
        <div
          aria-hidden
          data-slot="scheduler-now"
          className="pointer-events-none absolute inset-x-0 z-10 h-0.5 -translate-y-1/2 bg-primary"
          style={{ top: y(ctx.nowMinutes) }}
        >
          <span className="absolute -start-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Agenda view
 * -----------------------------------------------------------------------------------------------*/

function SchedulerAgenda({ days, items }: { days: CalendarDate[]; items: NormalizedEvent[] }) {
  const ctx = useSchedulerContext()
  const groups = days
    .map((d) => {
      const j = julian(d)
      return { day: d, j, items: items.filter((it) => it.startJ <= j && it.endJ >= j).sort(byStart) }
    })
    .filter((g) => g.items.length > 0)

  if (!groups.length) {
    return (
      <p data-slot="scheduler-agenda" className="rounded-lg bg-surface-container-low px-4 py-12 text-center text-body-md text-on-surface-variant">
        {ctx.labels.noEvents}
      </p>
    )
  }

  const when = (it: NormalizedEvent, j: number) => {
    if (it.allDay || (j !== it.startJ && j !== it.endDateJ)) return ctx.labels.allDay
    if (j === it.startJ) return ctx.fmt.time(it.startMin)
    return `– ${ctx.fmt.time(it.endMin)}`
  }

  return (
    <div data-slot="scheduler-agenda" className="space-y-4">
      {groups.map((g) => {
        const isToday = g.j === ctx.todayJ
        const id = `scheduler-agenda-${g.day.toString()}`
        return (
          <div key={g.day.toString()} role="group" aria-labelledby={id}>
            <div id={id} className={cn("px-2 text-label-lg", isToday ? "text-primary" : "text-on-surface-variant")}>
              {isToday && `${ctx.labels.today} · `}
              {ctx.fmt.date(g.day, ctx.fmt.agendaDay)}
            </div>
            <ul className="mt-1 divide-y divide-outline-variant">
              {g.items.map((it) => (
                <li key={it.event.id} className="py-0.5">
                  <SchedulerEventItem item={it} variant="row">
                    <span className="w-20 shrink-0 text-body-sm text-on-surface-variant tabular-nums">{when(it, g.j)}</span>
                    <span aria-hidden className={cn("h-9 w-1 shrink-0 rounded-full", accentColor[it.color])} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-label-lg">{it.event.title}</span>
                      {it.event.description && <span className="block truncate text-body-sm text-on-surface-variant">{it.event.description}</span>}
                    </span>
                  </SchedulerEventItem>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Hooks
 * -----------------------------------------------------------------------------------------------*/

/** Current time, refreshed every minute (moves the now line and rolls "today" over at midnight). */
function useNow(timeZone: string): ZonedDateTime {
  const [value, setValue] = React.useState(() => nowIn(timeZone))
  React.useEffect(() => {
    setValue(nowIn(timeZone))
    const id = setInterval(() => setValue(nowIn(timeZone)), 60_000)
    return () => clearInterval(id)
  }, [timeZone])
  return value
}

/** True while the element is narrower than `threshold` (M3 compact window class, measured on the component). */
function useIsCompact(ref: React.RefObject<HTMLElement | null>, threshold = 600) {
  const [compact, setCompact] = React.useState(() => typeof window !== "undefined" && window.innerWidth < threshold)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setCompact(el.getBoundingClientRect().width < threshold)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, threshold])
  return compact
}

/* -------------------------------------------------------------------------------------------------
 * Scheduler
 * -----------------------------------------------------------------------------------------------*/

export interface SchedulerProps {
  events?: SchedulerEvent[]
  /** Controlled view. */
  view?: SchedulerView
  /** Initial view. Defaults to month, or agenda (else day) when the component is narrower than 600dp. */
  defaultView?: SchedulerView
  onViewChange?: (view: SchedulerView) => void
  /** Views offered by the switcher, in order. */
  views?: SchedulerView[]
  /** Controlled focused date; any calendar system. */
  date?: CalendarDate
  defaultDate?: CalendarDate
  /** Called with the new focused date, in the calendar system of `date`/`defaultDate` (else the locale's). */
  onDateChange?: (date: CalendarDate) => void
  /** Pressing an event (Enter / Space on keyboard). Without it, events render as static surfaces. */
  onEventAction?: (event: SchedulerEvent) => void
  /** Pressing an empty slot: a time slot in week/day, a day cell in month or the all-day row. Pointer only. */
  onSlotAction?: (slot: SchedulerSlot) => void
  /** First and last hour drawn in week/day views (0–24). */
  dayStartHour?: number
  dayEndHour?: number
  /** Height of one hour in week/day views, in px. */
  hourHeight?: number
  /** Granularity of empty-slot presses, in minutes. */
  slotMinutes?: number
  /** Hour scrolled to when the week/day grid first renders. */
  scrollToHour?: number
  /** Hide the locale's weekend days (Saturday and Sunday in most regions). */
  hideWeekends?: boolean
  /** Exact days to show, e.g. ["mon", "tue", "wed", "thu", "fri"]. Overrides hideWeekends. */
  weekdays?: DayOfWeek[]
  /** First day of the week. Defaults to the locale's. */
  firstDayOfWeek?: DayOfWeek
  /** Event lanes per month cell before "+N more". */
  maxEvents?: number
  /** Time zone that CalendarDateTime values are in and ZonedDateTime values are shown in. Defaults to the user's. */
  timeZone?: string
  /** Replace the inside of an event surface (the button, position and color stay). */
  renderEvent?: (event: SchedulerEvent, info: { view: SchedulerView; variant: "chip" | "block" | "row" }) => React.ReactNode
  /** UI strings, for non-English locales. */
  labels?: Partial<SchedulerLabels>
  /** Extra header controls before the view switcher, e.g. a "New event" button. */
  actions?: React.ReactNode
  className?: string
  "aria-label"?: string
}

/** Event calendar with month, week, day and agenda views, in the locale's calendar system. */
function Scheduler({
  events = [],
  view,
  defaultView,
  onViewChange,
  views: viewsProp,
  date,
  defaultDate,
  onDateChange,
  onEventAction,
  onSlotAction,
  dayStartHour = 0,
  dayEndHour = 24,
  hourHeight = 48,
  slotMinutes = 30,
  scrollToHour = 8,
  hideWeekends = false,
  weekdays,
  firstDayOfWeek,
  maxEvents = 2,
  timeZone: timeZoneProp,
  renderEvent,
  labels: labelsProp,
  actions,
  className,
  "aria-label": ariaLabel,
}: SchedulerProps) {
  const { locale, direction } = useLocale()
  const calendar = useLocaleCalendar(locale)
  const timeZone = timeZoneProp ?? getLocalTimeZone()
  const fmt = useFormatters(locale, timeZone)
  const labels = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labelsProp }), [labelsProp])
  const rootRef = React.useRef<HTMLDivElement>(null)
  const pageRef = React.useRef<HTMLDivElement>(null)
  const compact = useIsCompact(rootRef)

  const nowValue = useNow(timeZone)
  const today = toCalendar(toCalendarDate(nowValue), calendar)
  const todayJ = julian(today)

  // View
  const views = viewsProp?.length ? viewsProp : ALL_VIEWS
  const [chosenView, setChosenView] = React.useState<SchedulerView | null>(defaultView ?? null)
  const fallbackView: SchedulerView = compact
    ? views.includes("agenda") ? "agenda" : views.includes("day") ? "day" : views[0]
    : views.includes("month") ? "month" : views[0]
  let current = view ?? chosenView ?? fallbackView
  if (!views.includes(current)) current = views[0]
  const setView = (next: SchedulerView) => {
    if (view === undefined) setChosenView(next)
    onViewChange?.(next)
  }

  // Focused date, held in the locale's calendar system
  const [uncontrolledDate, setUncontrolledDate] = React.useState<CalendarDate | null>(defaultDate ?? null)
  const focused = toCalendar(date ?? uncontrolledDate ?? today, calendar)
  const setFocused = (next: CalendarDate) => {
    const out = toCalendar(next, (date ?? defaultDate)?.calendar ?? calendar)
    if (date === undefined) setUncontrolledDate(out)
    onDateChange?.(out)
  }

  const isShown = React.useCallback(
    (d: CalendarDate) =>
      weekdays ? weekdays.includes(WEEKDAY_IDS[getDayOfWeek(d, "en-US")]) : hideWeekends ? !isWeekend(d, locale) : true,
    [weekdays, hideWeekends, locale],
  )
  const visible = React.useCallback(
    (days: CalendarDate[]) => {
      const kept = days.filter(isShown)
      return kept.length ? kept : days
    },
    [isShown],
  )

  const items = React.useMemo(() => events.map((e) => normalizeEvent(e, timeZone, calendar)), [events, timeZone, calendar])

  const focusedKey = focused.toString()
  const period = React.useMemo(() => {
    if (current === "month") {
      const gridStart = startOfWeek(startOfMonth(focused), locale, firstDayOfWeek)
      const weeks = Array.from({ length: getWeeksInMonth(focused, locale, firstDayOfWeek) }, (_, w) =>
        visible(Array.from({ length: 7 }, (_, i) => gridStart.add({ weeks: w, days: i }))),
      )
      return { days: weeks.flat(), weeks }
    }
    if (current === "week") {
      const start = startOfWeek(focused, locale, firstDayOfWeek)
      return { days: visible(Array.from({ length: 7 }, (_, i) => start.add({ days: i }))), weeks: [] }
    }
    if (current === "day") return { days: [focused], weeks: [] }
    const first = startOfMonth(focused)
    const count = julian(endOfMonth(focused)) - julian(first) + 1
    return { days: visible(Array.from({ length: count }, (_, i) => first.add({ days: i }))), weeks: [] }
  }, [current, focusedKey, calendar, locale, firstDayOfWeek, visible])

  const title =
    current === "week"
      ? fmt.monthYear.formatRange(period.days[0].toDate(timeZone), period.days[period.days.length - 1].toDate(timeZone))
      : current === "day"
        ? fmt.date(focused, fmt.dayTitle)
        : fmt.date(focused, fmt.monthYear)

  // Paging slides the page 24dp on FastSpatial and fades it in on FastEffects.
  const slide = (dir: number) => {
    const el = pageRef.current
    if (!el || !dir || prefersReducedMotion()) return
    const x = dir * (direction === "rtl" ? -1 : 1) * 24
    el.animate([{ transform: `translateX(${x}px)` }, { transform: "none" }], springTiming("fast-spatial"))
    el.animate([{ opacity: 0 }, { opacity: 1 }], springTiming("fast-effects"))
  }
  const step = (dir: 1 | -1) => {
    let next = focused
    if (current === "month" || current === "agenda") next = focused.add({ months: dir })
    else if (current === "week") next = focused.add({ weeks: dir })
    else for (let i = 0; i < 7; i++) if (isShown((next = next.add({ days: dir })))) break
    slide(dir)
    setFocused(next)
  }
  const goToday = () => {
    if (!period.days.some((d) => julian(d) === todayJ)) slide(Math.sign(todayJ - julian(focused)))
    setFocused(today)
  }

  const canOpenDay = views.includes("day") && current !== "day"
  const openDay = (day: CalendarDate) => {
    setFocused(day)
    setView("day")
    requestAnimationFrame(() => pageRef.current?.focus({ preventScroll: true }))
  }

  const ctx: SchedulerContextValue = {
    fmt,
    labels,
    todayJ,
    nowMinutes: nowValue.hour * 60 + nowValue.minute,
    onEventAction,
    onSlotAction,
    openDay: canOpenDay ? openDay : null,
    renderEvent,
    view: current,
  }

  return (
    <SchedulerContext.Provider value={ctx}>
      <div
        ref={rootRef}
        data-slot="scheduler"
        data-view={current}
        role="group"
        aria-label={ariaLabel}
        className={cn("@container w-full min-w-0 text-on-surface [--scheduler-max-height:min(75vh,720px)]", className)}
      >
        <SchedulerHeader
          title={title}
          view={current}
          views={views}
          labels={labels}
          actions={actions}
          onPrevious={() => step(-1)}
          onNext={() => step(1)}
          onToday={goToday}
          onViewChange={setView}
        />
        <div ref={pageRef} tabIndex={-1} data-slot="scheduler-page" className="outline-none">
          {current === "month" && <SchedulerMonthView weeks={period.weeks} focused={focused} items={items} maxEvents={maxEvents} />}
          {(current === "week" || current === "day") && (
            <SchedulerTimeGrid
              days={period.days}
              items={items}
              dayStartHour={Math.max(0, Math.min(dayStartHour, 23))}
              dayEndHour={Math.max(Math.min(dayStartHour, 23) + 1, Math.min(dayEndHour, 24))}
              hourHeight={hourHeight}
              slotMinutes={slotMinutes}
              scrollToHour={scrollToHour}
            />
          )}
          {current === "agenda" && <SchedulerAgenda days={period.days} items={items} />}
        </div>
      </div>
    </SchedulerContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Timetable · a weekly timetable of ordered sessions per day (no time axis)
 * -----------------------------------------------------------------------------------------------*/

export interface TimetableDay {
  id: string
  label: string
}

export interface TimetableSession {
  id: string | number
  /** TimetableDay id. */
  day: string
  /** "08:00" (24 h, zero-padded): sessions are ordered by it. */
  start?: string
  end?: string
  title: string
  subtitle?: string
  color?: SchedulerEventColor
}

const timetableSessionVariants = tv({
  base: [
    "state-layer focus-ring relative flex min-w-0 flex-col gap-1 rounded-md px-3 py-2.5 text-start outline-none",
    "data-disabled:opacity-38",
  ],
  variants: {
    color: {
      primary: "bg-primary-container text-on-primary-container",
      secondary: "bg-secondary-container text-on-secondary-container",
      tertiary: "bg-tertiary-container text-on-tertiary-container",
      error: "bg-error-container text-on-error-container",
      neutral: "bg-surface-container-highest text-on-surface",
    },
    interactive: { true: "cursor-pointer", false: "cursor-default" },
    selectable: { true: "data-selected:ring-2 data-selected:ring-primary", false: "" },
  },
  defaultVariants: { color: "primary", interactive: false, selectable: false },
})

export interface TimetableProps {
  days: TimetableDay[]
  sessions: TimetableSession[]
  /** Pressing a session (when selectionMode is "none"). */
  onSessionAction?: (session: TimetableSession) => void
  /** Shows an add button under each day's sessions. */
  onAddSession?: (dayId: string) => void
  /** Accessible name of the add buttons ("Add session, Monday"). */
  addSessionLabel?: string
  /** "multiple" turns sessions into toggles (pressing selects instead of firing onSessionAction). */
  selectionMode?: "none" | "multiple"
  selectedKeys?: Iterable<Key>
  defaultSelectedKeys?: Iterable<Key>
  onSelectionChange?: (keys: Set<Key>) => void
  /** Replace a session card's content. */
  renderSession?: (session: TimetableSession, state: { isSelected: boolean }) => React.ReactNode
  /** Shown in a day without sessions. */
  emptyLabel?: string
  className?: string
  "aria-label"?: string
}

const byTime = (a: TimetableSession, b: TimetableSession) =>
  a.start && b.start ? a.start.localeCompare(b.start) : a.start ? -1 : b.start ? 1 : 0

/** Weekly timetable: one column of ordered session cards per day, with optional add buttons and selection. */
function Timetable({
  days,
  sessions,
  onSessionAction,
  onAddSession,
  addSessionLabel = "Add session",
  selectionMode = "none",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  renderSession,
  emptyLabel = "No sessions",
  className,
  "aria-label": ariaLabel,
}: TimetableProps) {
  const idPrefix = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState<Set<Key>>(() => new Set(defaultSelectedKeys ?? []))
  const selected = React.useMemo(() => (selectedKeys ? new Set(selectedKeys) : uncontrolled), [selectedKeys, uncontrolled])
  const byDay = React.useMemo(() => {
    const map = new Map<string, TimetableSession[]>()
    for (const s of sessions) map.set(s.day, [...(map.get(s.day) ?? []), s])
    for (const list of map.values()) list.sort(byTime)
    return map
  }, [sessions])
  const selectable = selectionMode === "multiple"

  const updateDay = (dayKeys: Key[], next: Selection) => {
    const dayNext = next === "all" ? new Set(dayKeys) : next
    const merged = new Set([...selected].filter((k) => !dayKeys.includes(k)))
    dayNext.forEach((k) => merged.add(k))
    if (!selectedKeys) setUncontrolled(merged)
    onSelectionChange?.(merged)
  }

  return (
    <div data-slot="timetable" role="group" aria-label={ariaLabel} className={cn("w-full min-w-0 overflow-x-auto", className)}>
      <div className="grid auto-cols-[minmax(10rem,1fr)] grid-flow-col gap-3 pb-1">
        {days.map((day) => {
          const list = byDay.get(day.id) ?? []
          const keys = list.map((s) => s.id)
          const labelId = `${idPrefix}-${day.id}`
          return (
            <div key={day.id} data-slot="timetable-day" className="flex min-w-0 flex-col gap-2">
              <div id={labelId} className="truncate text-center text-title-sm text-on-surface">
                {day.label}
              </div>
              <div className="flex flex-1 flex-col gap-2 rounded-lg bg-surface-container-low p-2">
                <ListBox
                  aria-labelledby={labelId}
                  items={list}
                  selectionMode={selectable ? "multiple" : "none"}
                  // Always controlled, so switching selectionMode doesn't flip React Aria's state ownership.
                  selectedKeys={selectable ? keys.filter((k) => selected.has(k)) : []}
                  onSelectionChange={(next) => selectable && updateDay(keys, next)}
                  // Item renders are cached; re-render them when these change.
                  dependencies={[selectable, onSessionAction, renderSession]}
                  onAction={!selectable && onSessionAction ? (key) => onSessionAction(list.find((s) => s.id === key)!) : undefined}
                  escapeKeyBehavior="none"
                  className="focus-ring flex flex-col gap-2 rounded-md outline-none"
                  renderEmptyState={() => <p className="px-2 py-4 text-center text-body-sm text-on-surface-variant">{emptyLabel}</p>}
                >
                  {(s) => (
                    <ListBoxItem
                      id={s.id}
                      textValue={s.title}
                      data-slot="timetable-session"
                      className={timetableSessionVariants({
                        color: s.color,
                        interactive: selectable || !!onSessionAction,
                        selectable,
                      })}
                    >
                      {({ isSelected }) => (
                        <>
                          {renderSession ? (
                            renderSession(s, { isSelected })
                          ) : (
                            <>
                              <span className="flex items-start gap-2">
                                <span className="min-w-0 flex-1 truncate text-title-sm">{s.title}</span>
                                {selectable && (
                                  <Icon size={20} filled={isSelected} className="-me-1">
                                    {isSelected ? "check_circle" : "radio_button_unchecked"}
                                  </Icon>
                                )}
                              </span>
                              {s.subtitle && <span className="truncate text-body-sm">{s.subtitle}</span>}
                              {(s.start || s.end) && (
                                <span className="flex items-center gap-1 text-label-md tabular-nums">
                                  <Icon size={16}>schedule</Icon>
                                  {[s.start, s.end].filter(Boolean).join(" – ")}
                                </span>
                              )}
                            </>
                          )}
                          <Ripple />
                        </>
                      )}
                    </ListBoxItem>
                  )}
                </ListBox>
                {onAddSession && (
                  <IconButton
                    data-slot="timetable-add"
                    variant="tonal"
                    aria-label={`${addSessionLabel}, ${day.label}`}
                    onPress={() => onAddSession(day.id)}
                    className="self-center"
                  >
                    <Icon>add</Icon>
                  </IconButton>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { Scheduler, Timetable, schedulerEventVariants, timetableSessionVariants }
