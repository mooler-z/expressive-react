import Async from "@/docs/docs-site/examples/combobox/async"
import asyncSrc from "@/docs/docs-site/examples/combobox/async?raw"
import CustomValue from "@/docs/docs-site/examples/combobox/custom-value"
import customValueSrc from "@/docs/docs-site/examples/combobox/custom-value?raw"
import Demo from "@/docs/docs-site/examples/combobox/demo"
import demoSrc from "@/docs/docs-site/examples/combobox/demo?raw"
import Multiple from "@/docs/docs-site/examples/combobox/multiple"
import multipleSrc from "@/docs/docs-site/examples/combobox/multiple?raw"
import Sections from "@/docs/docs-site/examples/combobox/sections"
import sectionsSrc from "@/docs/docs-site/examples/combobox/sections?raw"
import States from "@/docs/docs-site/examples/combobox/states"
import statesSrc from "@/docs/docs-site/examples/combobox/states?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "A combobox is a text field that filters a menu of options as you type. Matches are emphasized, the selected option gets a check, and selectionMode=\"multiple\" collects picks as input chips.",
  links: {
    m3: "https://m3.material.io/components/menus/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/ComboBox.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { ComboBox, ComboBoxItem } from "@/components/ui/combobox"

<ComboBox label="Region" defaultItems={regions} onChange={setRegion}>
  {(region) => <ComboBoxItem id={region.id}>{region.name}</ComboBoxItem>}
</ComboBox>`,
  examples: [
    {
      id: "sections",
      title: "Sections, descriptions and a leading icon",
      description: (
        <>
          <InlineCode>ComboBoxSection</InlineCode> groups options into segments; items take <InlineCode>description</InlineCode>,{" "}
          <InlineCode>icon</InlineCode> or <InlineCode>leading</InlineCode>. Static children filter just like <InlineCode>defaultItems</InlineCode>.
        </>
      ),
      component: Sections,
      source: sectionsSrc,
    },
    {
      id: "multiple",
      title: "Multiple selection",
      description: (
        <>
          <InlineCode>selectionMode="multiple"</InlineCode> shows picks as dense input chips inside the field. Backspace on an empty input removes the
          last one; <InlineCode>value</InlineCode> is an array of keys.
        </>
      ),
      component: Multiple,
      source: multipleSrc,
    },
    {
      id: "async",
      title: "Async results",
      description: (
        <>
          Control <InlineCode>inputValue</InlineCode> and swap <InlineCode>items</InlineCode> as results arrive. <InlineCode>isLoading</InlineCode> shows the
          loading indicator in the field and a loading row in the menu.
        </>
      ),
      component: Async,
      source: asyncSrc,
    },
    {
      id: "custom-value",
      title: "Custom values",
      description: <>allowsCustomValue keeps whatever was typed when it doesn't match an option, for tags and free-form entries.</>,
      component: CustomValue,
      source: customValueSrc,
    },
    {
      id: "states",
      title: "Validation and disabled",
      description: "errorMessage shows under the field when it's invalid; disabled fields drop to 38%.",
      component: States,
      source: statesSrc,
    },
  ],
  api: [
    {
      name: "ComboBox",
      description: <>Everything React Aria's {c("ComboBox")} accepts, plus:</>,
      props: [
        { name: "label", type: "ReactNode", default: "—", description: "Floating label. Without it, pass aria-label." },
        { name: "description", type: "ReactNode", default: "—", description: "Supporting text below the field." },
        { name: "errorMessage", type: "ReactNode | (v: ValidationResult) => ReactNode", default: "—", description: "Shown when invalid." },
        { name: "placeholder", type: "string", default: "—", description: "Input placeholder." },
        { name: "variant", type: '"outlined" | "filled"', default: '"outlined"', description: "Text-field style." },
        { name: "density", type: '"md" | "sm" | "xs"', default: '"md"', description: "Field height 56 / 48 / 40dp." },
        { name: "leading", type: "ReactNode", default: "—", description: "Leading icon name or node." },
        { name: "isLoading", type: "boolean", default: "false", description: "Loading indicator in the field and a loading row in the menu." },
        { name: "loadingText", type: "ReactNode", default: '"Loading…"', description: "Loading row text." },
        { name: "emptyText", type: "ReactNode", default: '"No results"', description: "Menu content when nothing matches." },
        { name: "defaultItems · items", type: "Iterable<T>", default: "—", description: "Options. defaultItems are filtered for you; items you filter yourself." },
        { name: "selectionMode", type: '"single" | "multiple"', default: '"single"', description: "multiple renders the picks as input chips." },
        { name: "value · defaultValue · onChange", type: "Key | Key[] | null", default: "—", description: "The selected key (or keys when multiple)." },
        { name: "inputValue · onInputChange", type: "string", default: "—", description: "Control the text, e.g. for async search." },
        { name: "allowsCustomValue", type: "boolean", default: "false", description: "Keep typed text that matches no option." },
        { name: "menuTrigger", type: '"input" | "focus" | "manual"', default: '"input"', description: "What opens the menu." },
        { name: "allowsEmptyCollection", type: "boolean", default: "true", description: "Open the menu even with no matches (to show emptyText)." },
      ],
    },
    {
      name: "ComboBoxItem",
      description: <>React Aria {c("ListBoxItem")} props, plus:</>,
      props: [
        { name: "icon", type: "string", default: "—", description: "Leading Material Symbol." },
        { name: "leading", type: "ReactNode", default: "—", description: "Leading node (avatar, flag). Wins over icon." },
        { name: "description", type: "ReactNode", default: "—", description: "Second line." },
        { name: "highlight", type: "boolean", default: "true", description: "Emphasize the matched text in primary (string children only)." },
        { name: "textValue", type: "string", default: "children", description: "Text used for filtering and the input when selected." },
      ],
    },
    {
      name: "ComboBoxSection · ComboBoxHighlight",
      description: (
        <>
          A section with an optional {c("title")}, and the match emphasis on its own for custom item layouts ({c("<ComboBoxHighlight>{name}</ComboBoxHighlight>")}).
        </>
      ),
      props: [],
    },
  ],
  accessibility: {
    description: (
      <>
        An input with {c('role="combobox"')} controlling a {c("listbox")}; focus stays in the input while ↑ ↓ move a virtual highlight, so typing never
        stops. Selected options are announced. For a fixed list without typing, use <TextLink to="/docs/select">Select</TextLink>.
      </>
    ),
    keyboard: [
      { keys: ["↓"], description: "Opens the menu and highlights the first (or next) option." },
      { keys: ["↑"], description: "Highlights the previous option." },
      { keys: ["Enter"], description: "Selects the highlighted option." },
      { keys: ["Esc"], description: "Closes the menu." },
      { keys: ["Backspace"], description: "With selectionMode=\"multiple\" and an empty input, removes the last chip." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Field", "the TextField shell: 56dp (48 / 40dp) · outlined or filled"],
          ["Trailing", "arrow_drop_down icon button (rotates while open) · 24dp loading indicator while loading"],
          ["Menu", "the field's width · max 320dp tall · Expressive menu styling"],
          ["Match", <>semibold, primary</>],
          ["Highlighted option", "on-surface 8% · selected: tertiary-container with a check"],
          ["Chips (multiple)", "dense input chips, 24dp"],
        ],
      },
    ],
    cards: [{ title: "See also", items: [<TextLink to="/docs/chip">Input chips</TextLink>, <TextLink to="/docs/command">Command palette</TextLink>] }],
    source: <>M3 text-field and menu tokens; the combobox pattern itself comes from React Aria.</>,
  },
} satisfies ComponentDoc
