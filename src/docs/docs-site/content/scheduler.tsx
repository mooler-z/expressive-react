import Create from "@/docs/docs-site/examples/scheduler/create"
import createSrc from "@/docs/docs-site/examples/scheduler/create?raw"
import Demo from "@/docs/docs-site/examples/scheduler/demo"
import demoSrc from "@/docs/docs-site/examples/scheduler/demo?raw"
import Ethiopian from "@/docs/docs-site/examples/scheduler/ethiopian"
import ethiopianSrc from "@/docs/docs-site/examples/scheduler/ethiopian?raw"
import SchoolDay from "@/docs/docs-site/examples/scheduler/school-day"
import schoolDaySrc from "@/docs/docs-site/examples/scheduler/school-day?raw"
import Timetable from "@/docs/docs-site/examples/scheduler/timetable"
import timetableSrc from "@/docs/docs-site/examples/scheduler/timetable?raw"
import Views from "@/docs/docs-site/examples/scheduler/views"
import viewsSrc from "@/docs/docs-site/examples/scheduler/views?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const STAGE = "items-stretch justify-start"

export default {
  description: (
    <>
      An event calendar with month, week, day and agenda views, and a weekly timetable of ordered sessions. Dates are{" "}
      {c("@internationalized/date")} values, and grids, paging and titles follow the locale's calendar system, so the Ethiopian calendar's 13
      months work the same way the Gregorian ones do. For picking a single date, use the <TextLink to="/docs/calendar">Calendar</TextLink>.
    </>
  ),
  links: { aria: "https://react-spectrum.adobe.com/react-aria/Calendar.html" },
  preview: { component: Demo, source: demoSrc, className: STAGE },
  usage: `import { Scheduler, type SchedulerEvent } from "@/components/ui/scheduler"
import { parseDate, parseDateTime } from "@internationalized/date"

const events: SchedulerEvent[] = [
  { id: 1, title: "Mid-term exams", start: parseDate("2026-11-16"), end: parseDate("2026-11-20"), color: "error" },
  { id: 2, title: "Staff meeting", start: parseDateTime("2026-11-17T08:00"), end: parseDateTime("2026-11-17T09:00") },
]

<Scheduler aria-label="School calendar" events={events} onEventAction={open} onSlotAction={create} />`,
  examples: [
    {
      id: "views",
      title: "Views",
      description: (
        <>
          Month, week, day and agenda share the header: previous/next page by the current view, Today returns to today, and the switcher changes
          the view. Pass <InlineCode>view</InlineCode> and <InlineCode>onViewChange</InlineCode> to control it, and{" "}
          <InlineCode>views</InlineCode> to offer fewer. Overlapping events in the time grid sit side by side. Without{" "}
          <InlineCode>defaultView</InlineCode>, the scheduler opens on month, or on agenda when it's narrower than 600dp.
        </>
      ),
      component: Views,
      source: viewsSrc,
      className: STAGE,
    },
    {
      id: "create",
      title: "Creating events",
      description: (
        <>
          <InlineCode>onSlotAction</InlineCode> fires when an empty time slot, all-day cell or month day is pressed, with{" "}
          <InlineCode>{"{ start, end, allDay }"}</InlineCode> snapped to <InlineCode>slotMinutes</InlineCode>. Slots are pointer targets, so also
          give keyboard users a button: <InlineCode>actions</InlineCode> places one in the header. Press an event here to delete it.
        </>
      ),
      component: Create,
      source: createSrc,
      className: STAGE,
    },
    {
      id: "school-day",
      title: "School day",
      description: (
        <>
          <InlineCode>dayStartHour</InlineCode> and <InlineCode>dayEndHour</InlineCode> crop the time grid to the school day,{" "}
          <InlineCode>hideWeekends</InlineCode> drops the locale's weekend (use <InlineCode>weekdays</InlineCode> for any other set), and{" "}
          <InlineCode>hourHeight</InlineCode> gives 45-minute periods room for two lines.
        </>
      ),
      component: SchoolDay,
      source: schoolDaySrc,
      className: STAGE,
    },
    {
      id: "ethiopian",
      title: "Ethiopian calendar",
      description: (
        <>
          Wrap the scheduler in <InlineCode>I18nProvider</InlineCode> with <InlineCode>am-ET-u-ca-ethiopic</InlineCode>, or{" "}
          <InlineCode>en-US-u-ca-ethiopic</InlineCode> for an English UI. Months, weeks, titles and paging switch to the Ethiopian calendar,
          including Pagume, the 13th month of 5 or 6 days. Events can be given in either calendar. <InlineCode>labels</InlineCode> translates the UI
          strings.
        </>
      ),
      component: Ethiopian,
      source: ethiopianSrc,
      className: STAGE,
    },
    {
      id: "timetable",
      title: "Timetable",
      description: (
        <>
          <InlineCode>Timetable</InlineCode> lays out a recurring week: a column per day with its sessions ordered by start time.{" "}
          <InlineCode>onAddSession</InlineCode> adds a button under each day, and <InlineCode>selectionMode="multiple"</InlineCode> turns the
          cards into toggles. Columns scroll sideways when they don't fit.
        </>
      ),
      component: Timetable,
      source: timetableSrc,
      className: STAGE,
    },
  ],
  api: [
    {
      name: "Scheduler",
      description: (
        <>
          The file also exports {c("schedulerEventVariants")} and {c("timetableSessionVariants")}, the tv() styles behind events and session
          cards.
        </>
      ),
      props: [
        { name: "events", type: "SchedulerEvent[]", default: "[]", description: "Events to show." },
        { name: "view · defaultView", type: '"month" | "week" | "day" | "agenda"', default: "month, or agenda below 600dp", description: "Current view." },
        { name: "onViewChange", type: "(view) => void", default: "—", description: "Called when the switcher or a day number changes the view." },
        { name: "views", type: "SchedulerView[]", default: "all four", description: "Views in the switcher, in order. One view hides the switcher." },
        { name: "date · defaultDate", type: "CalendarDate", default: "today", description: "Focused date. Any calendar system." },
        {
          name: "onDateChange",
          type: "(date: CalendarDate) => void",
          default: "—",
          description: "Called when paging, Today or a day number moves the focused date, in the calendar of date/defaultDate (else the locale's).",
        },
        { name: "onEventAction", type: "(event: SchedulerEvent) => void", default: "—", description: "Pressing an event. Without it, events aren't interactive." },
        {
          name: "onSlotAction",
          type: "(slot: SchedulerSlot) => void",
          default: "—",
          description: "Pressing an empty slot. SchedulerSlot is { start, end, allDay } in the locale's calendar.",
        },
        { name: "dayStartHour · dayEndHour", type: "number", default: "0 · 24", description: "Hours drawn in the week and day views." },
        { name: "hourHeight", type: "number", default: "48", description: "Height of one hour, in px." },
        { name: "slotMinutes", type: "number", default: "30", description: "Granularity of empty-slot presses." },
        { name: "scrollToHour", type: "number", default: "8", description: "Hour the time grid scrolls to when it first renders." },
        { name: "hideWeekends", type: "boolean", default: "false", description: "Hide the locale's weekend days." },
        { name: "weekdays", type: 'DayOfWeek[]', default: "—", description: 'Exact days to show, e.g. ["mon", "tue", "wed", "thu", "fri"]. Overrides hideWeekends.' },
        { name: "firstDayOfWeek", type: '"sun" | "mon" | … | "sat"', default: "locale", description: "First column of the week." },
        { name: "maxEvents", type: "number", default: "2", description: 'Event lanes per month cell before "+N more".' },
        { name: "timeZone", type: "string", default: "user's", description: "Zone CalendarDateTime values are in and ZonedDateTime values are shown in." },
        {
          name: "renderEvent",
          type: "(event, { view, variant }) => ReactNode",
          default: "—",
          description: 'Replaces the inside of an event. variant is "chip" (month, all-day), "block" (time grid) or "row" (agenda).',
        },
        { name: "labels", type: "Partial<SchedulerLabels>", default: "English", description: "today, previous, next, view, month, week, day, agenda, allDay, noEvents, more(n)." },
        { name: "actions", type: "ReactNode", default: "—", description: "Header controls before the view switcher." },
        { name: "aria-label", type: "string", default: "—", description: "Names the scheduler group." },
      ],
    },
    {
      name: "SchedulerEvent",
      description: "One event.",
      props: [
        { name: "id", type: "string | number", description: "Unique key." },
        { name: "title", type: "string", description: "Shown on the event and in its accessible name." },
        {
          name: "start",
          type: "CalendarDate | CalendarDateTime | ZonedDateTime",
          description: "A CalendarDate is an all-day event. CalendarDateTime is wall-clock time in timeZone. ZonedDateTime is converted to timeZone.",
        },
        { name: "end", type: "same as start", default: "start + 1 h", description: "Timed events: exclusive end. All-day events: the last day, inclusive." },
        { name: "allDay", type: "boolean", default: "false", description: "Treat a timed start as all-day." },
        { name: "color", type: '"primary" | "secondary" | "tertiary" | "error" | "neutral"', default: '"primary"', description: "Container role of the fill." },
        { name: "description", type: "string", default: "—", description: "Second line in the agenda." },
      ],
    },
    {
      name: "Timetable",
      props: [
        { name: "days", type: "{ id: string; label: string }[]", description: "Columns, in order." },
        { name: "sessions", type: "TimetableSession[]", description: '{ id, day, start?, end?, title, subtitle?, color? }. Ordered per day by start ("08:00").' },
        { name: "onSessionAction", type: "(session) => void", default: "—", description: "Pressing a session when selectionMode is none." },
        { name: "onAddSession", type: "(dayId: string) => void", default: "—", description: "Shows an add button under each day." },
        { name: "addSessionLabel", type: "string", default: '"Add session"', description: 'Add buttons are named "{label}, {day}".' },
        { name: "selectionMode", type: '"none" | "multiple"', default: '"none"', description: "Multiple makes the cards toggles." },
        { name: "selectedKeys · defaultSelectedKeys", type: "Iterable<Key>", default: "—", description: "Selected session ids across all days." },
        { name: "onSelectionChange", type: "(keys: Set<Key>) => void", default: "—", description: "Called with the full selection." },
        { name: "renderSession", type: "(session, { isSelected }) => ReactNode", default: "—", description: "Replaces a card's content." },
        { name: "emptyLabel", type: "string", default: '"No sessions"', description: "Shown in an empty day." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The scheduler is a labelled group. With {c("onEventAction")}, every event is a button whose name gives its title, date and time, and day
        numbers are buttons that open the day view. The title is a polite live region, so paging is announced. Empty-slot presses are pointer
        shortcuts, so offer a button for creating events too. Each timetable day is a React Aria {c("ListBox")} labelled by its day name.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through the header controls, then the day numbers, events and +N more buttons in reading order." },
      { keys: ["Enter", "Space"], description: "Activates the focused event, day number or button. +N more opens a popover of the day's events." },
      { keys: ["Esc"], description: "Closes the +N more popover and returns focus to its button." },
      { keys: ["↑", "↓"], description: "Timetable: moves between the sessions of a day." },
      { keys: ["Space"], description: "Timetable in selection mode: toggles the focused session." },
    ],
    notes: [
      "Day numbers open the day view and move focus to it.",
      "Previous/next icons mirror in right-to-left locales.",
      "The paging slide is skipped when reduced motion is requested.",
    ],
  },
  spec: {
    description: "M3 has no scheduler component, so this composes M3 parts on the kit's calendar layout.",
    tables: [
      {
        title: "Scheduler",
        columns: ["Part", "Value"],
        rows: [
          ["Header", <>title-large · standard icon buttons S (40dp) · Today outlined button XS · connected button group XS</>],
          ["Month grid", "1dp outline-variant lines · weekday row surface-container-low, label-medium"],
          ["Day number", "28dp circle (40dp in week headers), label-large · today primary / on-primary · other months on-surface 38%"],
          ["Event chip", "20dp, label-small, extra-small corners (4dp), container role / on-container"],
          ["Time grid", "48dp per hour · hour labels label-small · event blocks small corners (8dp), label-medium + label-small"],
          ["Now line", "2dp primary line with a 12dp primary dot"],
          ["Agenda", "label-large day header (today primary) · body-small time · 4dp accent bar · label-large title"],
        ],
      },
      {
        title: "Timetable",
        columns: ["Part", "Value"],
        rows: [
          ["Day column", "surface-container-low, large corners (16dp), 8dp padding and gap"],
          ["Session card", "medium corners (12dp), container role · title-small, body-small, label-medium time"],
          ["Selected", "2dp primary ring, filled check"],
          ["Add button", "tonal icon button S (40dp)"],
        ],
      },
    ],
    cards: [
      {
        title: "Motion",
        items: [
          "Paging slides the page 24dp on the FastSpatial spring and fades it in on FastEffects.",
          "State layers and colors use DefaultEffects. The slot highlight moves on FastSpatial.",
        ],
      },
      { title: "Color", items: ["Events: primary, secondary, tertiary and error containers, or surface-container-highest for neutral.", "Today and the now line: primary."] },
    ],
    source: <>androidx {c("ShapeTokens")} (corners) and {c("ExpressiveMotionTokens")} (springs).</>,
  },
} satisfies ComponentDoc
