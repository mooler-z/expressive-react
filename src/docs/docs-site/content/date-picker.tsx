import Demo from "@/docs/docs-site/examples/date-picker/demo"
import demoSrc from "@/docs/docs-site/examples/date-picker/demo?raw"
import Modal from "@/docs/docs-site/examples/date-picker/modal"
import modalSrc from "@/docs/docs-site/examples/date-picker/modal?raw"
import ModalRange from "@/docs/docs-site/examples/date-picker/modal-range"
import modalRangeSrc from "@/docs/docs-site/examples/date-picker/modal-range?raw"
import Panel from "@/docs/docs-site/examples/date-picker/panel"
import panelSrc from "@/docs/docs-site/examples/date-picker/panel?raw"
import Range from "@/docs/docs-site/examples/date-picker/range"
import rangeSrc from "@/docs/docs-site/examples/date-picker/range?raw"
import Validation from "@/docs/docs-site/examples/date-picker/validation"
import validationSrc from "@/docs/docs-site/examples/date-picker/validation?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

const MODAL_PROPS = [
  { name: "title", type: "string", default: '"Select date" / "Select dates"', description: "Supporting text above the headline." },
  { name: "minValue · maxValue", type: "DateValue", default: "—", description: "Selectable range." },
  { name: "isDateUnavailable", type: "(date: DateValue) => boolean", default: "—", description: "Marks individual days unavailable." },
  { name: "defaultMode", type: '"calendar" | "input"', default: '"calendar"', description: "Start on the calendar or the typed input." },
  { name: "confirmLabel · cancelLabel", type: "string", default: '"OK" / "Save" · "Cancel"', description: "Action labels." },
  { name: "isDismissable · overlayProps", type: "Dialog props", default: "—", description: "Everything Dialog accepts, e.g. overlayProps.isOpen to control it." },
]

export default {
  description:
    "Date pickers let people select a date or a range. Docked pickers are text fields with a calendar popover; modal pickers are dialogs with a headline, a calendar and a typed-input mode.",
  links: {
    m3: "https://m3.material.io/components/date-pickers/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/DatePicker.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { DatePicker } from "@/components/ui/date-picker"

<DatePicker label="Launch date" value={date} onChange={setDate} />`,
  examples: [
    {
      id: "range",
      title: "Docked range",
      description: "DateRangePicker holds start and end segments in one field and opens a RangeCalendar.",
      component: Range,
      source: rangeSrc,
    },
    {
      id: "modal",
      title: "Modal",
      description: (
        <>
          Put <InlineCode>DatePickerDialog</InlineCode> inside a <InlineCode>DialogTrigger</InlineCode>. The selection is a draft until OK; the edit icon
          switches to a typed date.
        </>
      ),
      component: Modal,
      source: modalSrc,
    },
    {
      id: "modal-range",
      title: "Modal range",
      description: "DateRangePickerDialog shows the range in the headline and saves both ends together.",
      component: ModalRange,
      source: modalRangeSrc,
    },
    {
      id: "validation",
      title: "Validation and disabled",
      description: (
        <>
          <InlineCode>minValue</InlineCode>, <InlineCode>maxValue</InlineCode> and <InlineCode>isDateUnavailable</InlineCode> constrain the calendar; a typed
          date outside them shows <InlineCode>errorMessage</InlineCode>.
        </>
      ),
      component: Validation,
      source: validationSrc,
    },
    {
      id: "panel",
      title: "Embedded panel",
      description: (
        <>
          <InlineCode>DatePickerPanel</InlineCode> is the modal's content without the dialog, for sheets, cards or a custom popover.
        </>
      ),
      component: Panel,
      source: panelSrc,
    },
  ],
  api: [
    {
      name: "DatePicker · DateRangePicker",
      description: <>Everything React Aria's {c("DatePicker")} / {c("DateRangePicker")} accepts, plus the text-field chrome:</>,
      props: [
        { name: "label", type: "ReactNode", default: "—", description: "Floating label." },
        { name: "description", type: "ReactNode", default: "—", description: "Supporting text, e.g. the format." },
        { name: "errorMessage", type: "ReactNode | (v: ValidationResult) => ReactNode", default: "—", description: "Shown when invalid." },
        { name: "variant", type: '"outlined" | "filled"', default: '"outlined"', description: "Text-field style." },
        { name: "density", type: '"md" | "sm" | "xs"', default: '"md"', description: "Field height 56 / 48 / 40dp." },
        { name: "leading", type: "ReactNode", default: "—", description: "Leading icon name or node." },
        { name: "value · defaultValue · onChange", type: "DateValue | { start, end } | null", default: "—", description: "The date or range." },
        { name: "minValue · maxValue · isDateUnavailable", type: "—", default: "—", description: "Constraints, applied to typing and the calendar." },
        { name: "isRequired · isInvalid · isDisabled", type: "boolean", default: "false", description: "Validation and disabled state." },
      ],
    },
    {
      name: "DatePickerDialog",
      props: [
        { name: "value · defaultValue", type: "DateValue | null", default: "null", description: "The committed date." },
        { name: "onChange", type: "(value: DateValue | null) => void", default: "—", description: "Fires on OK, not while picking." },
        ...MODAL_PROPS,
      ],
    },
    {
      name: "DateRangePickerDialog",
      props: [
        { name: "value · defaultValue", type: "DateRange | null", default: "null", description: "{ start, end }" },
        { name: "onChange", type: "(value: DateRange | null) => void", default: "—", description: "Fires on Save." },
        ...MODAL_PROPS,
      ],
    },
    {
      name: "DatePickerPanel · DateRangePickerPanel",
      description: "The dialogs' content without the dialog.",
      props: [
        { name: "defaultValue", type: "DateValue | DateRange | null", default: "null", description: "Initial draft." },
        { name: "onConfirm", type: "(value) => void", default: "—", description: "OK / Save pressed." },
        { name: "onCancel", type: "() => void", default: "—", description: "Cancel pressed." },
        { name: "autoFocus", type: "boolean", default: "false", description: "Move focus into the calendar or field on mount." },
        { name: "title · defaultMode · labels · constraints", type: "—", default: "—", description: "As on the dialogs." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The field is a group of spin-button segments (month, day, year) in the locale's order, labelled by the label; the calendar button opens a dialog
        with the <TextLink to="/docs/calendar">Calendar</TextLink> grid. Typed and picked dates go through the same validation.
      </>
    ),
    keyboard: [
      { keys: ["←", "→"], description: "Moves between date segments." },
      { keys: ["↑", "↓"], description: "Increments or decrements the focused segment." },
      { keys: ["0–9"], description: "Types into a segment and advances when it's complete." },
      { keys: ["Backspace"], description: "Clears the focused segment." },
      { label: "Calendar", description: "Tab to the calendar button and press Enter or Space; the grid keys are on the Calendar page." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Docked", "Modal"],
        rows: [
          ["Container", "surface-container-high · 16dp corners · level 3", "360dp · surface-container-high · 28dp corners · level 3"],
          ["Field / header", "the TextField shell with a trailing calendar button", <>title {c("label-large")} · headline {c("headline-large")}, on-surface-variant</>],
          ["Actions", "—", "text buttons: Cancel, OK (range: Save)"],
          ["Input mode", "—", "DateField in the text-field shell; invalid dates show the field error"],
        ],
      },
    ],
    source: <>androidx {c("DatePickerModalTokens")} and the docked picker spec; day cells are on the Calendar page.</>,
  },
} satisfies ComponentDoc
