import Demo from "@/docs/docs-site/examples/field/demo"
import demoSrc from "@/docs/docs-site/examples/field/demo?raw"
import Fieldset from "@/docs/docs-site/examples/field/fieldset"
import fieldsetSrc from "@/docs/docs-site/examples/field/fieldset?raw"
import Horizontal from "@/docs/docs-site/examples/field/horizontal"
import horizontalSrc from "@/docs/docs-site/examples/field/horizontal?raw"
import Sizes from "@/docs/docs-site/examples/field/sizes"
import sizesSrc from "@/docs/docs-site/examples/field/sizes?raw"
import States from "@/docs/docs-site/examples/field/states"
import statesSrc from "@/docs/docs-site/examples/field/states?raw"
import Textarea from "@/docs/docs-site/examples/field/textarea"
import textareaSrc from "@/docs/docs-site/examples/field/textarea?raw"
import Validation from "@/docs/docs-site/examples/field/validation"
import validationSrc from "@/docs/docs-site/examples/field/validation?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Field & label",
  description: (
    <>
      Form anatomy with external labels: a label-large label with an optional required mark or hint, the control, a description or error, fieldset groups,
      and a horizontal layout for settings pages. Use it when labels sit above controls instead of floating inside a{" "}
      <TextLink to="/docs/text-field">Text field</TextLink>.
    </>
  ),
  links: { aria: "https://react-spectrum.adobe.com/react-aria/TextField.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Field, FieldDescription, FieldError, FieldLabel, Input } from "@/components/ui/field"

<Field isRequired>
  <FieldLabel isRequired>Workspace name</FieldLabel>
  <Input />
  <FieldDescription>Shown in the sidebar and on invoices.</FieldDescription>
  <FieldError />
</Field>`,
  examples: [
    {
      id: "validation",
      title: "Native validation",
      description: (
        <>
          Inside a React Aria {c("Form")}, {c("isRequired")}, {c("type")} and {c("minLength")} validate on submit. An empty{" "}
          <InlineCode>FieldError</InlineCode> shows the browser's message with the filled error icon. Submit the form empty to see it.
        </>
      ),
      component: Validation,
      source: validationSrc,
    },
    {
      id: "horizontal",
      title: "Horizontal layout",
      description: (
        <>
          <InlineCode>orientation="horizontal"</InlineCode> puts the label in a 240dp column from 600dp up, for settings pages. Group the label and description in
          one cell; they stay wired to the input.
        </>
      ),
      component: Horizontal,
      source: horizontalSrc,
    },
    {
      id: "fieldset",
      title: "Fieldset",
      description: "Fieldset and FieldLegend group related checkboxes or switches under one label-large legend.",
      component: Fieldset,
      source: fieldsetSrc,
    },
    {
      id: "textarea",
      title: "Textarea with counter",
      description: "TextArea shares Input's outline and states. Keep a live count beside the description, outside the label.",
      component: Textarea,
      source: textareaSrc,
    },
    {
      id: "sizes",
      title: "Sizes",
      description: "Input heights follow the text-field densities: 56, 48 and 40dp.",
      component: Sizes,
      source: sizesSrc,
    },
    {
      id: "states",
      title: "Disabled and read-only",
      description: "Disabled fades the label and content to 38% and the outline to 12%. Read-only keeps full contrast with a dashed outline.",
      component: States,
      source: statesSrc,
    },
  ],
  api: [
    {
      name: "Field",
      description: <>A React Aria {c("TextField")}: value, onChange, validation and input props all apply. Plus:</>,
      props: [
        { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "horizontal: 240dp label column + control column from 600dp up." },
        { name: "isRequired", type: "boolean", default: "false", description: "Native required validation. Pair with FieldLabel's isRequired for the visual mark." },
        { name: "isInvalid", type: "boolean", default: "—", description: "Controlled invalid state; shows FieldError and turns the label error." },
        { name: "isDisabled · isReadOnly", type: "boolean", default: "false", description: "Disabled fades to 38%; read-only gets a dashed outline." },
      ],
    },
    {
      name: "FieldLabel",
      description: <>React Aria {c("Label")}, label-large, turns error while invalid.</>,
      props: [
        { name: "isRequired", type: "boolean", default: "false", description: "Appends an error-colored asterisk (aria-hidden; the input carries the required state)." },
        { name: "hint", type: "ReactNode", default: "—", description: "Right-aligned body-small text, e.g. “Optional”." },
      ],
    },
    {
      name: "Input · TextArea",
      description: <>Outlined controls without a floating label.</>,
      props: [
        { name: "size", type: '"md" | "sm" | "xs"', default: '"md"', description: "Input height 56 / 48 / 40dp." },
        { name: "rows", type: "number", default: "3", description: "TextArea rows." },
      ],
    },
    {
      name: "FieldDescription · FieldError · Fieldset · FieldLegend",
      props: [
        { name: "FieldDescription", type: "TextProps", default: "—", description: "body-small on-surface-variant, wired as the description." },
        { name: "FieldError", type: "FieldErrorProps", default: "—", description: "Renders only while invalid, with the filled error icon. Children override the validation message." },
        { name: "Fieldset", type: "FieldsetHTMLAttributes", default: "—", description: "Unstyled native <fieldset> for groups of controls." },
        { name: "FieldLegend", type: "HTMLAttributes<HTMLLegendElement>", default: "—", description: "label-large legend for a Fieldset." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Field is React Aria's TextField, so the label, description and error are linked to the input with {c("aria-labelledby")} and {c("aria-describedby")}{" "}
        automatically, even when they sit in a nested layout cell. Invalid inputs set {c("aria-invalid")}. Fieldset is a native {c("<fieldset>")}, so its legend
        names the group.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus to the input. Focus shows a 2dp primary outline (1dp border + 1dp inset ring)." },
      { keys: ["Enter"], label: "In a form", description: "Submits the form; invalid fields show their errors and the first one receives focus." },
    ],
    notes: [<>The required asterisk is decorative. The input's {c("required")} attribute is what assistive tech announces.</>],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Label", <>{c("label-large")}, on-surface; error when invalid</>],
          ["Input", <>{c("body-large")}, 1dp outline, 4dp corners, 56 / 48 / 40dp</>],
          ["Focused", "2dp primary (1dp border + 1dp inset ring)"],
          ["Invalid", "2dp error outline"],
          ["Description, error", <>{c("body-small")}; error with a 16dp filled icon</>],
          ["Disabled", "content on-surface 38%, outline 12%"],
          ["Gaps", "8dp between label, control and supporting text"],
        ],
      },
    ],
    source: (
      <>
        Outline, corner and opacity values from androidx {c("OutlinedTextFieldTokens")}; label and gap sizes from the kit's form anatomy.
      </>
    ),
  },
} satisfies ComponentDoc
