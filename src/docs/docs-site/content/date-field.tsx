import Demo from "@/docs/docs-site/examples/date-field/demo"
import demoSrc from "@/docs/docs-site/examples/date-field/demo?raw"
import Granularity from "@/docs/docs-site/examples/date-field/granularity"
import granularitySrc from "@/docs/docs-site/examples/date-field/granularity?raw"
import Range from "@/docs/docs-site/examples/date-field/range"
import rangeSrc from "@/docs/docs-site/examples/date-field/range?raw"
import States from "@/docs/docs-site/examples/date-field/states"
import statesSrc from "@/docs/docs-site/examples/date-field/states?raw"
import Variants from "@/docs/docs-site/examples/date-field/variants"
import variantsSrc from "@/docs/docs-site/examples/date-field/variants?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description: (
    <>
      Typed date and time inputs. Each part (month, day, year, hour, minute, AM/PM) is its own segment, inside the same shell as{" "}
      <TextLink to="/docs/text-field">Text field</TextLink>: filled or outlined, floating label, supporting text and error. For a calendar or clock dial, use{" "}
      <TextLink to="/docs/date-picker">Date picker</TextLink> and <TextLink to="/docs/time-picker">Time picker</TextLink>, which wrap these fields.
    </>
  ),
  links: {
    m3: "https://m3.material.io/components/date-pickers/guidelines#input-mode",
    aria: "https://react-spectrum.adobe.com/react-aria/DateField.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { parseDate } from "@internationalized/date"
import { DateField, TimeField } from "@/components/ui/date-field"

<DateField label="Start date" defaultValue={parseDate("2026-10-29")} />
<TimeField label="Start time" />`,
  examples: [
    {
      id: "variants",
      title: "Filled and empty",
      description: "Empty fields show only the label; segments fade in as the label floats on focus. The leading slot takes an icon, as in TextField.",
      component: Variants,
      source: variantsSrc,
    },
    {
      id: "range",
      title: "Min and max",
      description: (
        <>
          <InlineCode>minValue</InlineCode> and <InlineCode>maxValue</InlineCode> validate the value. With <InlineCode>validationBehavior="aria"</InlineCode> the
          error shows live; the default (native) shows it on form submit.
        </>
      ),
      component: Range,
      source: rangeSrc,
    },
    {
      id: "granularity",
      title: "Date-time and seconds",
      description: (
        <>
          <InlineCode>granularity</InlineCode> adds time segments to a DateField or seconds to a TimeField. <InlineCode>hourCycle={24}</InlineCode> drops the
          AM/PM segment.
        </>
      ),
      component: Granularity,
      source: granularitySrc,
    },
    {
      id: "states",
      title: "Read-only and disabled",
      description: "Read-only segments stay focusable but can't change. Disabled fades to 38% and leaves the tab order.",
      component: States,
      source: statesSrc,
    },
  ],
  api: [
    {
      name: "DateField",
      description: <>React Aria {c("DateField")} props (value, defaultValue, onChange, minValue, maxValue, granularity, isDateUnavailable, validation…), plus:</>,
      props: [
        { name: "variant", type: '"outlined" | "filled"', default: '"outlined"', description: "Same shells as TextField." },
        { name: "density", type: '"md" | "sm" | "xs"', default: '"md"', description: "56 / 48 / 40dp." },
        { name: "label", type: "ReactNode", default: "—", description: "Floating label. Stays floated once any segment has a value." },
        { name: "description · errorMessage", type: "ReactNode", default: "—", description: "Supporting row; the error replaces the description while invalid." },
        { name: "leading · trailing", type: "string | ReactNode", default: "—", description: "Icon name or node. Invalid fields show an error icon in the trailing slot." },
        { name: "value", type: "DateValue", default: "—", description: "CalendarDate, CalendarDateTime or ZonedDateTime from @internationalized/date." },
      ],
    },
    {
      name: "TimeField",
      description: <>React Aria {c("TimeField")} props (value, onChange, hourCycle, granularity, minValue, maxValue…), plus the same chrome props as DateField.</>,
      props: [
        { name: "trailing", type: "string | ReactNode", default: '"schedule"', description: "Defaults to a clock icon; the error icon while invalid." },
        { name: "hourCycle", type: "12 | 24", default: "locale", description: "24 removes the AM/PM segment." },
        { name: "value", type: "TimeValue", default: "—", description: "Time, CalendarDateTime or ZonedDateTime." },
      ],
    },
    {
      name: "DateSegments · useHasEnteredSegments",
      description: <>Building blocks for custom fields inside a {c("FieldContainer")} (the date pickers use them).</>,
      props: [
        { name: "DateSegments", type: "{ slot?, hideUntilFloat?, className? }", default: "hideUntilFloat true", description: "React Aria DateInput with styled segments. Hidden until the label floats when the field has a label." },
        { name: "useHasEnteredSegments", type: "(ref) => boolean", default: "—", description: "True when any segment holds a typed value; pass it to FieldContainer's populated." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        React Aria renders each segment as a {c("role=\"spinbutton\"")} with its own label (“month”, “day”…), grouped under the field label. Formatting and
        segment order follow the locale, and a hidden input carries the ISO value for forms.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves between fields; within a field, focus starts on the first segment." },
      { keys: ["←", "→"], description: "Move between segments." },
      { keys: ["↑", "↓"], description: "Increment or decrement the focused segment, wrapping within its range." },
      { label: "Digits", description: "Type a value; focus advances to the next segment once it's complete." },
      { keys: ["Backspace"], description: "Deletes the last digit; on an empty segment, moves to the previous one." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Shell", "Text-field container: 56dp, outlined 4dp or filled 4dp top"],
          ["Segments", <>{c("body-large")}, tabular numerals; placeholders on-surface-variant</>],
          ["Focused segment", "primary-container, on-primary-container text (error-container while invalid)"],
          ["Separators", "on-surface-variant"],
          ["TimeField trailing icon", "24dp schedule"],
        ],
      },
    ],
    cards: [{ title: "Motion", items: [<>Segments fade in with the label float: {c("fast-effects")} (154ms)</>] }],
    source: <>Shell values from androidx {c("OutlinedTextFieldTokens")} / {c("FilledTextFieldTokens")}; input mode from the M3 date-picker guidelines.</>,
  },
} satisfies ComponentDoc
