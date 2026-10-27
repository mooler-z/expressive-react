import Demo from "@/docs/docs-site/examples/checkbox/demo"
import demoSrc from "@/docs/docs-site/examples/checkbox/demo?raw"
import RichLabel from "@/docs/docs-site/examples/checkbox/rich-label"
import richLabelSrc from "@/docs/docs-site/examples/checkbox/rich-label?raw"
import SelectAll from "@/docs/docs-site/examples/checkbox/select-all"
import selectAllSrc from "@/docs/docs-site/examples/checkbox/select-all?raw"
import States from "@/docs/docs-site/examples/checkbox/states"
import statesSrc from "@/docs/docs-site/examples/checkbox/states?raw"
import Validation from "@/docs/docs-site/examples/checkbox/validation"
import validationSrc from "@/docs/docs-site/examples/checkbox/validation?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Checkboxes let people select one or more options from a list, or turn a single option on or off. Selected, indeterminate, error and disabled states, with an animated check.",
  links: {
    m3: "https://m3.material.io/components/checkbox/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Checkbox.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Checkbox } from "@/components/ui/checkbox"

<Checkbox defaultSelected onChange={(isSelected) => save(isSelected)}>
  Email me about deploys
</Checkbox>`,
  examples: [
    {
      id: "states",
      title: "States",
      description: "Unselected, selected, indeterminate, error and disabled. The check draws in along its path when selected.",
      component: States,
      source: statesSrc,
    },
    {
      id: "select-all",
      title: "Select all",
      description: (
        <>
          A parent checkbox is <InlineCode>isIndeterminate</InlineCode> while only some children are selected. Indeterminate wins over{" "}
          <InlineCode>isSelected</InlineCode> visually; pressing it selects everything.
        </>
      ),
      component: SelectAll,
      source: selectAllSrc,
    },
    {
      id: "validation",
      title: "Validation",
      description: (
        <>
          <InlineCode>isInvalid</InlineCode> tints the box, check and state layer with the error role. Pair it with a message in{" "}
          <InlineCode>text-error</InlineCode>.
        </>
      ),
      component: Validation,
      source: validationSrc,
    },
    {
      id: "rich-label",
      title: "Two-line labels",
      description: "Children can be any node. The whole row is the label, so pressing the text toggles the box.",
      component: RichLabel,
      source: richLabelSrc,
    },
  ],
  api: [
    {
      name: "Checkbox",
      description: (
        <>
          Everything React Aria's {c("Checkbox")} accepts. There are no extra recipe props: the M3 look comes from its state attributes.
        </>
      ),
      props: [
        { name: "isSelected", type: "boolean", default: "—", description: "Controlled selected state." },
        { name: "defaultSelected", type: "boolean", default: "false", description: "Initial selected state when uncontrolled." },
        { name: "onChange", type: "(isSelected: boolean) => void", default: "—", description: "Called when the selected state changes." },
        { name: "isIndeterminate", type: "boolean", default: "false", description: "Shows the dash. Doesn't change isSelected; you manage it." },
        { name: "isInvalid", type: "boolean", default: "false", description: "Error colors for the box, mark and state layer." },
        { name: "isDisabled", type: "boolean", default: "false", description: "On-surface at 38%, no state layer, removed from the tab order." },
        { name: "isRequired", type: "boolean", default: "false", description: "Native required validation inside a form." },
        { name: "value · name", type: "string", default: "—", description: "Form value and field name for the hidden native input." },
        { name: "children", type: "ReactNode", default: "—", description: "The label. Rendered after the box, inside the same <label>." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        A visually hidden native {c('<input type="checkbox">')} inside a {c("<label>")}, so the label text, form submission and browser validation all work.
        Indeterminate sets {c('aria-checked="mixed"')}. For groups of related options, label the group with a heading or a{" "}
        <TextLink to="/docs/field">Fieldset</TextLink>.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus to the checkbox. The 3dp secondary focus ring sits 11dp outside the box." },
      { keys: ["Space"], description: "Toggles the selected state." },
      { label: "Disabled", description: "Skipped by Tab and announced as disabled." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Container", "18dp, 2dp corners"],
          ["Outline (unselected)", "2dp on-surface-variant"],
          ["Selected container", "primary, mark on-primary (error / on-error when invalid)"],
          ["State layer", "40dp circle in a 48dp touch target"],
          ["Disabled", "outline on-surface 38%; selected container on-surface 38%, mark surface"],
        ],
      },
    ],
    cards: [
      { title: "States", items: ["Hover 8%", "Focus 10% + 3dp secondary ring", "Pressed 12%", "State layer color follows the selected/error role"] },
      { title: "Motion", items: ["Container color: 150ms standard", <>Check: path draws in, 200ms {c("emphasized-decelerate")}</>] },
    ],
    source: <>androidx {c("CheckboxTokens")}: container 18dp, CornerExtraSmall 2dp, state layer 40dp, outline 2dp.</>,
  },
} satisfies ComponentDoc
