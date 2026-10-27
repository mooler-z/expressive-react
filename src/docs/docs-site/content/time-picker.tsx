import Hour24 from "@/docs/docs-site/examples/time-picker/24-hour"
import hour24Src from "@/docs/docs-site/examples/time-picker/24-hour?raw"
import Demo from "@/docs/docs-site/examples/time-picker/demo"
import demoSrc from "@/docs/docs-site/examples/time-picker/demo?raw"
import DialogExample from "@/docs/docs-site/examples/time-picker/dialog"
import dialogSrc from "@/docs/docs-site/examples/time-picker/dialog?raw"
import Input from "@/docs/docs-site/examples/time-picker/input"
import inputSrc from "@/docs/docs-site/examples/time-picker/input?raw"
import Landscape from "@/docs/docs-site/examples/time-picker/landscape"
import landscapeSrc from "@/docs/docs-site/examples/time-picker/landscape?raw"
import TimeFieldExample from "@/docs/docs-site/examples/time-picker/time-field"
import timeFieldSrc from "@/docs/docs-site/examples/time-picker/time-field?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Time pickers help people select a time. The M3 dial with a draggable hand, an input mode for typing, 12- and 24-hour cycles, portrait and landscape layouts, and a dialog wrapper.",
  links: { m3: "https://m3.material.io/components/time-pickers/overview" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Time, TimePicker } from "@/components/ui/time-picker"

const [time, setTime] = useState(new Time(9, 41))

<TimePicker value={time} onChange={setTime} />`,
  examples: [
    {
      id: "dialog",
      title: "Dialog",
      description: (
        <>
          <InlineCode>TimePickerDialog</InlineCode> inside a <InlineCode>DialogTrigger</InlineCode>. Changes are a draft until OK; Cancel discards them.
        </>
      ),
      component: DialogExample,
      source: dialogSrc,
    },
    {
      id: "24-hour",
      title: "24-hour",
      description: <>hourCycle={"{24}"} adds an inner ring for 13–00 and widens the time selectors; the AM/PM selector goes away.</>,
      component: Hour24,
      source: hour24Src,
    },
    {
      id: "input",
      title: "Input mode",
      description: (
        <>
          Typed hour and minute fields; out-of-range values show an error. The keyboard icon switches modes, or control it with{" "}
          <InlineCode>mode</InlineCode> and <InlineCode>onModeChange</InlineCode>. Input mode focuses the hour field when it appears, so start in it with{" "}
          <InlineCode>defaultMode="input"</InlineCode> only inside a dialog.
        </>
      ),
      component: Input,
      source: inputSrc,
    },
    {
      id: "landscape",
      title: "Landscape",
      description: <>orientation="horizontal" puts the selectors beside the dial, for short screens.</>,
      component: Landscape,
      source: landscapeSrc,
    },
    {
      id: "time-field",
      title: "Time field",
      description: (
        <>
          For a time inside a form, the segmented <InlineCode>TimeField</InlineCode> from <TextLink to="/docs/date-field">Date field</TextLink> fits the
          text-field shell.
        </>
      ),
      component: TimeFieldExample,
      source: timeFieldSrc,
    },
  ],
  api: [
    {
      name: "TimePicker",
      description: "The picker content (selectors, dial or inputs, actions row). Put it on a surface, or use TimePickerDialog.",
      props: [
        { name: "value · defaultValue", type: "Time | null", default: "12:00", description: "Time from @internationalized/date (re-exported as Time)." },
        { name: "onChange", type: "(value: Time) => void", default: "—", description: "Called on every change, including while dragging." },
        { name: "hourCycle", type: "12 | 24", default: "12", description: "12 shows the AM/PM selector; 24 adds the inner ring." },
        { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Portrait or landscape layout." },
        { name: "mode · defaultMode", type: '"dial" | "input"', default: '"dial"', description: "Controlled or initial mode." },
        { name: "onModeChange", type: '(mode: "dial" | "input") => void', default: "—", description: "Called when the mode toggle is pressed." },
        { name: "title", type: "string", default: '"Select time" / "Enter time"', description: "Headline." },
        { name: "actions", type: "ReactNode", default: "—", description: "End of the bottom row, e.g. Cancel and OK buttons." },
        { name: "showModeToggle", type: "boolean", default: "true", description: "Show the keyboard ⇄ clock button." },
        { name: "className", type: "string", default: "—", description: "Classes for the root." },
      ],
    },
    {
      name: "TimePickerDialog",
      description: <>Dialog props, plus {c("hourCycle")}, {c("orientation")}, {c("defaultMode")} and {c("title")} from TimePicker.</>,
      props: [
        { name: "value · defaultValue", type: "Time | null", default: "12:00", description: "The committed time." },
        { name: "onChange", type: "(value: Time) => void", default: "—", description: "Fires on OK only." },
        { name: "confirmLabel · cancelLabel", type: "string", default: '"OK" · "Cancel"', description: "Action labels." },
      ],
    },
    {
      name: "ClockDial · PeriodSelector",
      description: "The dial and the AM/PM selector on their own, for custom layouts.",
      props: [
        { name: "ClockDial", type: '{ unit: "hour" | "minute", value, hourCycle, onChange, onHourPicked? }', default: "—", description: "The 256dp dial." },
        { name: "PeriodSelector", type: '{ isPM, onChange, orientation? }', default: "—", description: "Vertical 52×80dp or horizontal 216×38dp." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The dial is a {c('role="slider"')} labelled Hour or Minute with a spoken value ("9 o'clock", "41 minutes"). The hour and minute selectors are
        buttons that switch the dial; the AM/PM selector is a {c("radiogroup")}. Input mode uses labelled numeric fields with an error alert.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves between the hour and minute selectors, the period selector, the dial, the mode toggle and the actions." },
      { keys: ["↑", "→"], description: "On the dial: next hour or minute." },
      { keys: ["↓", "←"], description: "On the dial: previous hour or minute." },
      { keys: ["Page Up", "Page Down"], description: "On the dial: larger steps." },
      { keys: ["Enter", "Space"], description: "On a selector: switches the dial between hours and minutes." },
    ],
    notes: ["Picking an hour by pointer switches the dial to minutes, as in M3."],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Dial", <>256dp surface-container-highest circle · labels {c("body-large")} · outer ring radius 101dp, inner (24h) 69dp</>],
          ["Hand", "48dp primary handle on a 2dp primary track from an 8dp center dot · selected label on-primary"],
          ["Time selectors", <>96×80dp (24h vertical: 114×80dp) · 8dp corners · {c("display-large")}</>],
          ["Selector colors", "unselected surface-container-highest / on-surface · selected primary-container / on-primary-container"],
          ["Period selector", "vertical 52×80dp · horizontal 216×38dp · 1dp outline · selected tertiary-container"],
          ["Input mode", <>96×72dp fields · {c("display-medium")} · Hour / Minute captions</>],
        ],
      },
    ],
    cards: [
      { title: "Motion", items: [<>Hand rotates on {c("fast-spatial")} (374ms) when tapped or keyed</>, "Follows the pointer 1:1 while dragging"] },
      { title: "Dialog", items: ["surface-container-high · 28dp corners · level 3"] },
    ],
    source: <>androidx {c("TimePickerTokens")} and {c("TimeInputTokens")}.</>,
  },
} satisfies ComponentDoc
