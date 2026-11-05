import Demo from "@/docs/docs-site/examples/calendar/demo"
import demoSrc from "@/docs/docs-site/examples/calendar/demo?raw"
import Events from "@/docs/docs-site/examples/calendar/events"
import eventsSrc from "@/docs/docs-site/examples/calendar/events?raw"
import Range from "@/docs/docs-site/examples/calendar/range"
import rangeSrc from "@/docs/docs-site/examples/calendar/range?raw"
import Unavailable from "@/docs/docs-site/examples/calendar/unavailable"
import unavailableSrc from "@/docs/docs-site/examples/calendar/unavailable?raw"
import YearView from "@/docs/docs-site/examples/calendar/year-view"
import yearViewSrc from "@/docs/docs-site/examples/calendar/year-view?raw"
import Ethiopian from "@/docs/docs-site/examples/calendar/ethiopian"
import ethiopianSrc from "@/docs/docs-site/examples/calendar/ethiopian?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description: (
    <>
      The M3 date-picker grid on its own: a month of days, a year grid, and a range variant with the secondary-container band. It's what the{" "}
      <TextLink to="/docs/date-picker">Date picker</TextLink> opens; EventCalendar turns it into a month planner.
    </>
  ),
  links: {
    m3: "https://m3.material.io/components/date-pickers/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Calendar.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Calendar, todayDate } from "@/components/ui/calendar"

const [date, setDate] = useState(todayDate())

<Calendar aria-label="Due date" value={date} onChange={setDate} />`,
  examples: [
    {
      id: "range",
      title: "Range",
      description: "RangeCalendar selects a start and an end. The band rounds off where it wraps to a new week.",
      component: Range,
      source: rangeSrc,
    },
    {
      id: "unavailable",
      title: "Limits and unavailable dates",
      description: (
        <>
          <InlineCode>minValue</InlineCode> and <InlineCode>maxValue</InlineCode> bound the range (and disable paging past it);{" "}
          <InlineCode>isDateUnavailable</InlineCode> strikes out individual days, here weekends.
        </>
      ),
      component: Unavailable,
      source: unavailableSrc,
    },
    {
      id: "year-view",
      title: "Year grid",
      description: (
        <>
          The month label opens a grid of years. <InlineCode>defaultView="year"</InlineCode> starts there, which suits birth dates; it focuses the
          selected year on mount, so use it in a dialog. <InlineCode>yearPicker={"{false}"}</InlineCode> removes the year grid.
        </>
      ),
      component: YearView,
      source: yearViewSrc,
    },
    {
      id: "events",
      title: "Event calendar",
      description: (
        <>
          <InlineCode>EventCalendar</InlineCode> is a month planner: event chips on container roles, "+N more" past <InlineCode>maxEvents</InlineCode>,
          and a toolbar with paging and Today.
        </>
      ),
      component: Events,
      source: eventsSrc,
    },
    {
      id: "ethiopian",
      title: "Ethiopian calendar",
      description: (
        <>
          The calendar system comes from the locale. Wrap the calendar in <InlineCode>I18nProvider</InlineCode> with{" "}
          <InlineCode>am-ET-u-ca-ethiopic</InlineCode> for Amharic, or <InlineCode>en-GB-u-ca-ethiopic</InlineCode> for an English UI: 13 months, with
          Pagume's 5 or 6 days, and Ethiopian years in the year grid. <InlineCode>value</InlineCode> and <InlineCode>onChange</InlineCode> stay in the
          calendar you pass in, so an app can store Gregorian ISO dates and still show Ethiopian ones. Both calendars here share one value.
        </>
      ),
      component: Ethiopian,
      source: ethiopianSrc,
    },
  ],
  api: [
    {
      name: "Calendar",
      description: <>Everything React Aria's {c("Calendar")} accepts, plus:</>,
      props: [
        { name: "value · defaultValue", type: "DateValue | null", default: "—", description: "Selected date (CalendarDate from @internationalized/date)." },
        { name: "onChange", type: "(value: DateValue) => void", default: "—", description: "Called when a day is picked." },
        { name: "minValue · maxValue", type: "DateValue", default: "—", description: "Selectable range." },
        { name: "isDateUnavailable", type: "(date: DateValue) => boolean", default: "—", description: "Marks individual days unavailable." },
        { name: "yearPicker", type: "boolean", default: "true", description: "Show the month/year button that opens the year grid." },
        { name: "defaultView", type: '"day" | "year"', default: '"day"', description: "Open on the day grid or the year grid." },
        { name: "aria-label", type: "string", default: "—", description: "Names the calendar for assistive tech." },
      ],
    },
    {
      name: "RangeCalendar",
      description: <>Same as Calendar, on React Aria's {c("RangeCalendar")}: value is {c("{ start, end }")}.</>,
      props: [{ name: "allowsNonContiguousRanges", type: "boolean", default: "false", description: "Let a range span unavailable days." }],
    },
    {
      name: "EventCalendar",
      description: <>React Aria {c("Calendar")} props, plus:</>,
      props: [
        { name: "events", type: "CalendarEvent[]", default: "[]", description: "{ id, date: CalendarDate, title, tone? }" },
        { name: "maxEvents", type: "number", default: "2", description: 'Chips per day before "+N more".' },
        { name: "toolbar", type: "ReactNode", default: "—", description: "Right side of the toolbar, e.g. a view switcher." },
      ],
    },
    {
      name: "CalendarEventChip · todayDate",
      description: (
        <>
          The event chip on its own ({c("tone")}: primary, secondary, tertiary, error or neutral), and {c("todayDate()")}, today in the user's time
          zone.
        </>
      ),
      props: [],
    },
  ],
  accessibility: {
    description: (
      <>
        A labelled {c("grid")} of buttons with the month announced as it changes. Today, selection and unavailable days are announced. Dates use{" "}
        {c("@internationalized/date")}, so calendars other than Gregorian and right-to-left locales work.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves between the previous/next buttons, the month button and the grid." },
      { keys: ["←", "→"], description: "Previous or next day." },
      { keys: ["↑", "↓"], description: "Same day of the previous or next week." },
      { keys: ["Page Up", "Page Down"], description: "Previous or next month." },
      { keys: ["Enter", "Space"], description: "Selects the focused day (for a range, the first press starts it, the second ends it)." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Day cell", <>40dp circle in a 48dp column · {c("body-large")} · full corners</>],
          ["Selected", "primary / on-primary"],
          ["Today", "1dp primary outline, primary label"],
          ["Range", "secondary-container band, 40dp tall, between primary endpoints"],
          ["Year grid", <>72×36dp pills · {c("body-large")} · selected primary</>],
          ["Header", "month and year button; chevrons page months"],
        ],
      },
    ],
    source: <>androidx {c("DatePickerModalTokens")}.</>,
  },
} satisfies ComponentDoc
