import Affixes from "@/docs/docs-site/examples/text-field/affixes"
import affixesSrc from "@/docs/docs-site/examples/text-field/affixes?raw"
import Container from "@/docs/docs-site/examples/text-field/container"
import containerSrc from "@/docs/docs-site/examples/text-field/container?raw"
import Demo from "@/docs/docs-site/examples/text-field/demo"
import demoSrc from "@/docs/docs-site/examples/text-field/demo?raw"
import Density from "@/docs/docs-site/examples/text-field/density"
import densitySrc from "@/docs/docs-site/examples/text-field/density?raw"
import Icons from "@/docs/docs-site/examples/text-field/icons"
import iconsSrc from "@/docs/docs-site/examples/text-field/icons?raw"
import Multiline from "@/docs/docs-site/examples/text-field/multiline"
import multilineSrc from "@/docs/docs-site/examples/text-field/multiline?raw"
import States from "@/docs/docs-site/examples/text-field/states"
import statesSrc from "@/docs/docs-site/examples/text-field/states?raw"
import Validation from "@/docs/docs-site/examples/text-field/validation"
import validationSrc from "@/docs/docs-site/examples/text-field/validation?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Text fields let people enter and edit text. Filled and outlined, with a floating label, icons, prefix and suffix, supporting text, validation and a character counter.",
  links: {
    m3: "https://m3.material.io/components/text-fields/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/TextField.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { TextField } from "@/components/ui/text-field"

<TextField variant="filled" label="Email" type="email" description="We'll send the receipt here" />`,
  examples: [
    {
      id: "icons",
      title: "Icons and actions",
      description: (
        <>
          <InlineCode>leading</InlineCode> and <InlineCode>trailing</InlineCode> take an icon name or a node. Pass an icon button for actions like clear or
          show password.
        </>
      ),
      component: Icons,
      source: iconsSrc,
    },
    {
      id: "validation",
      title: "Validation",
      description: (
        <>
          Set <InlineCode>isInvalid</InlineCode> yourself, or let React Aria validate with <InlineCode>isRequired</InlineCode>, <InlineCode>type</InlineCode>{" "}
          and <InlineCode>validate</InlineCode>. The outline, label and caret turn error, an error icon fills the trailing slot, and the message replaces the
          description.
        </>
      ),
      component: Validation,
      source: validationSrc,
    },
    {
      id: "affixes",
      title: "Prefix and suffix",
      description: "Affixes stay hidden until the label floats, then sit beside the input in on-surface-variant.",
      component: Affixes,
      source: affixesSrc,
    },
    {
      id: "multiline",
      title: "Multiline and counter",
      description: (
        <>
          <InlineCode>multiline</InlineCode> renders a resizable textarea. <InlineCode>showCount</InlineCode> with <InlineCode>maxLength</InlineCode> adds the
          “n / max” counter at the end of the supporting row.
        </>
      ),
      component: Multiline,
      source: multilineSrc,
    },
    {
      id: "density",
      title: "Density",
      description: "56, 48 and 40dp containers for dense forms and toolbars. The label and padding scale with them.",
      component: Density,
      source: densitySrc,
    },
    {
      id: "states",
      title: "Read-only and disabled",
      description: "Read-only keeps the value selectable behind a dashed outline. Disabled drops content to on-surface at 38% and the outline to 12%.",
      component: States,
      source: statesSrc,
    },
    {
      id: "container",
      title: "Custom control with FieldContainer",
      description: (
        <>
          <InlineCode>FieldContainer</InlineCode> is the shell on its own: container, outline or indicator, floating label, icons and affixes. Put it in any
          React Aria field to build controls that match. <TextLink to="/docs/date-field">Date field</TextLink> and{" "}
          <TextLink to="/docs/select">Select</TextLink> use it.
        </>
      ),
      component: Container,
      source: containerSrc,
    },
  ],
  api: [
    {
      name: "TextField",
      description: <>Everything React Aria's {c("TextField")} accepts (value, onChange, validation, input props), plus:</>,
      props: [
        { name: "variant", type: '"outlined" | "filled"', default: '"outlined"', description: "Outlined: 1dp outline with a notched label. Filled: surface-container-highest with an active indicator." },
        { name: "density", type: '"md" | "sm" | "xs"', default: '"md"', description: "Container height 56 / 48 / 40dp." },
        { name: "label", type: "ReactNode", default: "—", description: "Floating label. Floats on focus, with a value, or on autofill." },
        { name: "description", type: "ReactNode", default: "—", description: "Supporting text under the field. Replaced by the error message while invalid." },
        { name: "errorMessage", type: "ReactNode | (v: ValidationResult) => ReactNode", default: "—", description: "Shown while invalid. Omit it to show React Aria's native validation message." },
        { name: "placeholder", type: "string", default: "—", description: "Shown only while focused when there's a label, so it never collides with it." },
        { name: "leading", type: "string | ReactNode", default: "—", description: "Icon name (24dp, on-surface-variant) or a node such as an IconButton." },
        { name: "trailing", type: "string | ReactNode", default: "—", description: "Icon name or node. Invalid fields show a filled error icon when this is empty." },
        { name: "prefix", type: "ReactNode", default: "—", description: "Text before the input, shown once the label floats." },
        { name: "suffix", type: "ReactNode", default: "—", description: "Text after the input, shown once the label floats." },
        { name: "multiline", type: "boolean", default: "false", description: "Render a resizable <textarea>." },
        { name: "rows", type: "number", default: "3", description: "Initial textarea rows." },
        { name: "showCount", type: "boolean", default: "false", description: "Show “n / maxLength” in the supporting row. Needs maxLength." },
        { name: "containerClassName", type: "string", default: "—", description: "Classes for the field container (the shell)." },
        { name: "inputClassName", type: "string", default: "—", description: "Classes for the <input> or <textarea>." },
      ],
    },
    {
      name: "FieldContainer",
      description: <>The text-field shell, for custom controls. Render it inside a React Aria field root and put the control in {c("children")}.</>,
      props: [
        { name: "variant", type: '"outlined" | "filled"', default: '"outlined"', description: "Same styles as TextField." },
        { name: "density", type: '"md" | "sm" | "xs"', default: '"md"', description: "Container height." },
        { name: "label", type: "ReactNode", default: "—", description: "Rendered as a React Aria Label, so it labels the enclosing field." },
        { name: "leading, trailing", type: "string | ReactNode", default: "—", description: "Icon name or node." },
        { name: "prefix, suffix", type: "ReactNode", default: "—", description: "Affixes around the control." },
        { name: "populated", type: "boolean", default: "—", description: "Force the floated label, for controls that are never empty (segments, chips)." },
        { name: "multiline", type: "boolean", default: "false", description: "Top-align icons and label for tall controls." },
        { name: "children", type: "ReactNode", default: "—", description: "The control: FieldInput, FieldTextArea, DateInput, chips…" },
      ],
    },
    {
      name: "FieldInput · FieldTextArea · FieldSupportingText",
      description: <>Building blocks for {c("FieldContainer")}. The inputs keep a single-space placeholder so the label can float on {c(":placeholder-shown")}.</>,
      props: [
        { name: "FieldInput", type: "InputProps", default: "—", description: "React Aria Input styled for the shell." },
        { name: "FieldTextArea", type: "TextAreaProps", default: "rows 3", description: "React Aria TextArea styled for the shell, vertically resizable." },
        { name: "FieldSupportingText", type: "{ description, errorMessage, counter }", default: "—", description: "The row under the field. Always renders FieldError so native validation messages show." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        A native {c("<input>")} or {c("<textarea>")} inside React Aria's TextField. The floating label is a real {c("<label>")}, the description and error are
        wired with {c("aria-describedby")}, and invalid fields set {c("aria-invalid")}. Fields with only a placeholder still need an {c("aria-label")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus into the field. The outline (or indicator) thickens to 2dp primary and the label floats." },
      { label: "Typing", description: "Native text editing, IME and autofill. The label stays floated while there's a value." },
      { label: "Invalid", description: "Screen readers announce the field as invalid and read the error message as its description." },
    ],
    notes: [
      <>Clicking anywhere on the container, including the label and padding, focuses the input, like a native field.</>,
      <>Icon buttons in the trailing slot need their own {c("aria-label")} (enforced by the IconButton type).</>,
    ],
  },
  spec: {
    tables: [
      {
        columns: ["", "Container", "Shape", "Indicator / outline", "Focused", "Disabled"],
        rows: [
          ["Filled", "surface-container-highest", "4dp top corners", "1dp on-surface-variant", "2dp primary", "container on-surface 4%, content 38%"],
          ["Outlined", "transparent", "4dp", "1dp outline", "2dp primary", "outline on-surface 12%, content 38%"],
        ],
      },
      {
        title: "Type & size",
        columns: ["Part", "Value"],
        rows: [
          ["Height", "56dp · density 48 / 40dp"],
          ["Input and resting label", c("body-large")],
          ["Floated label, supporting text", c("body-small")],
          ["Leading and trailing icons", "24dp, on-surface-variant"],
          ["Horizontal padding", "16dp (12dp beside an icon)"],
        ],
      },
    ],
    cards: [
      {
        title: "States",
        items: ["Hover: filled state layer 8%, outline on-surface", "Focus: label and caret primary", "Error: outline, indicator, label, caret and icon in error", "Read-only: dashed outline"],
      },
      {
        title: "Motion",
        items: [
          <>Label float: 200ms {c("ease-emphasized")} (translate + scale 0.75)</>,
          <>Outline and indicator: {c("fast-effects")} 1.0 / 3800 (154ms)</>,
        ],
      },
    ],
    source: (
      <>
        androidx {c("FilledTextFieldTokens")} and {c("OutlinedTextFieldTokens")}.
      </>
    ),
  },
} satisfies ComponentDoc
