import Demo from "@/docs/docs-site/examples/input-otp/demo"
import demoSrc from "@/docs/docs-site/examples/input-otp/demo?raw"
import FullWidth from "@/docs/docs-site/examples/input-otp/full-width"
import fullWidthSrc from "@/docs/docs-site/examples/input-otp/full-width?raw"
import Groups from "@/docs/docs-site/examples/input-otp/groups"
import groupsSrc from "@/docs/docs-site/examples/input-otp/groups?raw"
import Invalid from "@/docs/docs-site/examples/input-otp/invalid"
import invalidSrc from "@/docs/docs-site/examples/input-otp/invalid?raw"
import Pin from "@/docs/docs-site/examples/input-otp/pin"
import pinSrc from "@/docs/docs-site/examples/input-otp/pin?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Input OTP",
  description:
    "One-time codes and PINs. Separate cells in groups, the active cell outlined in primary, and one real input underneath, so paste, SMS autofill and screen readers behave like a single field.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/TextField.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { InputOTP } from "@/components/ui/input-otp"

<InputOTP label="Verification code" onComplete={(code) => verify(code)} />`,
  examples: [
    {
      id: "pin",
      title: "Masked PIN",
      description: (
        <>
          <InlineCode>length={4}</InlineCode>, <InlineCode>mask</InlineCode> shows dots instead of digits, and the tonal variant uses secondary-container circles
          that morph to 16dp corners on the active cell.
        </>
      ),
      component: Pin,
      source: pinSrc,
    },
    {
      id: "groups",
      title: "Groups and alphanumeric",
      description: (
        <>
          <InlineCode>groups</InlineCode> sets the dash positions. <InlineCode>pattern="alphanumeric"</InlineCode> accepts letters and uppercases them; anything
          else is dropped as you type or paste.
        </>
      ),
      component: Groups,
      source: groupsSrc,
    },
    {
      id: "invalid",
      title: "Error",
      description: "isInvalid outlines every cell in error and shows the message under the row.",
      component: Invalid,
      source: invalidSrc,
    },
    {
      id: "full-width",
      title: "Full width",
      description: (
        <>
          <InlineCode>fullWidth</InlineCode> stretches square cells across the container, for cards and dialogs where fixed 56dp cells would leave a ragged edge.
        </>
      ),
      component: FullWidth,
      source: fullWidthSrc,
    },
  ],
  api: [
    {
      name: "InputOTP",
      description: <>React Aria {c("TextField")} props (value, defaultValue, onChange, isInvalid, isDisabled, name, isRequired…), except maxLength, minLength and pattern, plus:</>,
      props: [
        { name: "length", type: "number", default: "6", description: "Number of cells. Also the input's maxLength." },
        { name: "groups", type: "number[]", default: "[3, 3] for 6, [4, 4] for 8", description: "Cell counts per group; a dash separates groups." },
        { name: "pattern", type: '"numeric" | "alphanumeric"', default: '"numeric"', description: "Accepted characters. Alphanumeric uppercases letters. Sets inputMode." },
        { name: "mask", type: "boolean", default: "false", description: "Show dots instead of characters." },
        { name: "onComplete", type: "(value: string) => void", default: "—", description: "Called once every cell is filled." },
        { name: "variant", type: '"outlined" | "tonal"', default: '"outlined"', description: "outlined: 12dp cells with a 1dp outline. tonal: secondary-container circles." },
        { name: "size", type: '"md" | "sm"', default: '"md"', description: "md: 56dp cells (48dp below 480dp), headline-small. sm: 48dp (44dp below 480dp), title-large." },
        { name: "fullWidth", type: "boolean", default: "false", description: "Cells share the available width as squares." },
        { name: "label · description · errorMessage", type: "ReactNode", default: "—", description: "Label above, supporting text and error below. Without a label, aria-label defaults to “Verification code”." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        There is one {c("<input autocomplete=\"one-time-code\">")} stretched over the cells, so it's announced as a single text field with its label, and
        iOS / Android offer the SMS code as an autofill suggestion. The cells are {c("aria-hidden")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Focuses the input; the next empty cell shows a blinking caret and the primary outline." },
      { label: "Typing / paste", description: "Fills cells left to right. Disallowed characters are removed, and a pasted code fills every cell at once." },
      { keys: ["Backspace"], description: "Deletes the last character. The caret always stays at the end." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["", "Cell", "Digits", "Corners", "Active", "Invalid"],
        rows: [
          ["md", "56dp (48 below 480dp)", c("headline-small"), "12dp · tonal full", "2dp primary · tonal 16dp", "2dp error"],
          ["sm", "48dp (44 below 480dp)", c("title-large"), "12dp · tonal full", "2dp primary · tonal 16dp", "2dp error"],
        ],
      },
    ],
    cards: [
      { title: "Layout", items: ["8dp between cells (12dp from 480dp)", "Group separator: 12×2dp outline-variant dash"] },
      { title: "Motion", items: [<>Tonal active-cell morph: {c("shape-morph")} on {c("fast-spatial")} 0.6 / 800</>, "Caret blink: 1s steps"] },
    ],
    source: <>Cell sizes follow the text-field heights; tonal shapes from the M3 Expressive shape scale.</>,
  },
} satisfies ComponentDoc
