import Controlled from "@/docs/docs-site/examples/select/controlled"
import controlledSrc from "@/docs/docs-site/examples/select/controlled?raw"
import Demo from "@/docs/docs-site/examples/select/demo"
import demoSrc from "@/docs/docs-site/examples/select/demo?raw"
import IconsDescription from "@/docs/docs-site/examples/select/icons-description"
import iconsDescriptionSrc from "@/docs/docs-site/examples/select/icons-description?raw"
import Sections from "@/docs/docs-site/examples/select/sections"
import sectionsSrc from "@/docs/docs-site/examples/select/sections?raw"
import States from "@/docs/docs-site/examples/select/states"
import statesSrc from "@/docs/docs-site/examples/select/states?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Select is the M3 exposed dropdown menu: a text field that opens a menu of options the width of the field. Outlined or filled, with icons, descriptions, sections and validation.",
  links: {
    m3: "https://m3.material.io/components/menus/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Select.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Select, SelectItem } from "@/components/ui/select"

<Select label="Region" defaultSelectedKey="fra" onSelectionChange={setRegion}>
  <SelectItem id="iad">US East (N. Virginia)</SelectItem>
  <SelectItem id="fra">Europe (Frankfurt)</SelectItem>
</Select>`,
  examples: [
    {
      id: "icons-description",
      title: "Icons and descriptions",
      description: (
        <>
          <InlineCode>icon</InlineCode> leads the field; items take their own <InlineCode>icon</InlineCode> and a second line with{" "}
          <InlineCode>description</InlineCode>. The field's <InlineCode>description</InlineCode> is supporting text below it.
        </>
      ),
      component: IconsDescription,
      source: iconsDescriptionSrc,
    },
    {
      id: "sections",
      title: "Sections",
      description: "SelectSection groups options under a header; each group is its own segment of the menu.",
      component: Sections,
      source: sectionsSrc,
    },
    {
      id: "controlled",
      title: "Controlled with items",
      description: (
        <>
          Pass <InlineCode>items</InlineCode> and a render function for dynamic lists, and <InlineCode>selectedKey</InlineCode> with{" "}
          <InlineCode>onSelectionChange</InlineCode> to control the value.
        </>
      ),
      component: Controlled,
      source: controlledSrc,
    },
    {
      id: "states",
      title: "Validation, disabled and density",
      description: (
        <>
          <InlineCode>errorMessage</InlineCode> replaces the description when invalid. <InlineCode>density</InlineCode> shrinks the 56dp field to 48 or
          40dp; at <InlineCode>xs</InlineCode> use <InlineCode>aria-label</InlineCode>, since there's no room for a floating label.
        </>
      ),
      component: States,
      source: statesSrc,
    },
  ],
  api: [
    {
      name: "Select",
      description: <>Everything React Aria's {c("Select")} accepts, plus:</>,
      props: [
        { name: "label", type: "ReactNode", default: "—", description: "Floating label. Without it, pass aria-label." },
        { name: "description", type: "ReactNode", default: "—", description: "Supporting text below the field." },
        { name: "errorMessage", type: "string | (v: ValidationResult) => string", default: "—", description: "Shown when invalid, in place of the description." },
        { name: "variant", type: '"outlined" | "filled"', default: '"outlined"', description: "Text-field style." },
        { name: "density", type: '"md" | "sm" | "xs"', default: '"md"', description: "Field height 56 / 48 / 40dp." },
        { name: "icon", type: "string", default: "—", description: "Material Symbol shown before the value." },
        { name: "items", type: "Iterable<T>", default: "—", description: "Dynamic options; children is then a render function." },
        { name: "selectedKey · defaultSelectedKey", type: "Key | null", default: "—", description: "Selected option, controlled or initial." },
        { name: "onSelectionChange", type: "(key: Key | null) => void", default: "—", description: "Called when an option is picked." },
        { name: "placeholder", type: "string", default: '" " with a label, else "Select…"', description: "Shown when nothing is selected." },
        { name: "isRequired · isInvalid · isDisabled", type: "boolean", default: "false", description: "Validation and disabled state." },
        { name: "name", type: "string", default: "—", description: "Submits the selected key with a form." },
      ],
    },
    {
      name: "SelectItem",
      description: <>React Aria {c("ListBoxItem")} props, plus:</>,
      props: [
        { name: "id", type: "Key", default: "—", description: "The option's key." },
        { name: "icon", type: "string", default: "—", description: "Leading Material Symbol." },
        { name: "description", type: "ReactNode", default: "—", description: "Second line of supporting text." },
        { name: "textValue", type: "string", default: "children", description: "Text for typeahead and the field value when children aren't a string." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Can't be selected." },
      ],
    },
    {
      name: "SelectSection",
      description: <>React Aria {c("ListBoxSection")} props, plus {c("title")} (ReactNode) for the group header.</>,
      props: [],
    },
  ],
  accessibility: {
    description: (
      <>
        A button with {c('aria-haspopup="listbox"')} opens a {c("listbox")}; a hidden native {c("<select>")} keeps form submission and browser autofill
        working. The label names both. For free text with suggestions use <TextLink to="/docs/combobox">Combobox</TextLink>.
      </>
    ),
    keyboard: [
      { keys: ["Enter", "Space", "↓", "↑"], description: "Opens the menu with the selected option focused." },
      { keys: ["↑", "↓"], description: "Moves between options." },
      { keys: ["Enter"], description: "Selects the focused option and closes the menu." },
      { keys: ["Esc"], description: "Closes the menu without changing the value." },
      { label: "Typeahead", description: "Typing on the closed field selects the first matching option; in the menu, it moves focus." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Field", "the TextField shell: 56dp (48 / 40dp dense) · outlined 4dp corners or filled with a 1dp indicator"],
          ["Trailing icon", "arrow_drop_down, rotates 180° while open"],
          ["Open field", "2dp primary outline (or indicator), primary label"],
          ["Menu", "the field's width · 4dp below · Expressive menu styling"],
          ["Selected option", "tertiary-container with a trailing check"],
        ],
      },
    ],
    cards: [
      { title: "Motion", items: [<>Menu opens on {c("fast-spatial")} (374ms)</>, <>Arrow rotation on {c("fast-spatial")}</>] },
      { title: "See also", items: [<TextLink to="/docs/text-field">Text field</TextLink>, <TextLink to="/docs/menu">Menu</TextLink>] },
    ],
    source: <>M3 exposed dropdown menu: the text-field tokens for the field and the menu tokens for the list.</>,
  },
} satisfies ComponentDoc
