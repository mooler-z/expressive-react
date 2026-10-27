import Assist from "@/docs/docs-site/examples/chip/assist"
import assistSrc from "@/docs/docs-site/examples/chip/assist?raw"
import ChipInputExample from "@/docs/docs-site/examples/chip/chip-input"
import chipInputSrc from "@/docs/docs-site/examples/chip/chip-input?raw"
import Choice from "@/docs/docs-site/examples/chip/choice"
import choiceSrc from "@/docs/docs-site/examples/chip/choice?raw"
import Demo from "@/docs/docs-site/examples/chip/demo"
import demoSrc from "@/docs/docs-site/examples/chip/demo?raw"
import Filter from "@/docs/docs-site/examples/chip/filter"
import filterSrc from "@/docs/docs-site/examples/chip/filter?raw"
import Input from "@/docs/docs-site/examples/chip/input"
import inputSrc from "@/docs/docs-site/examples/chip/input?raw"
import SuggestionStatic from "@/docs/docs-site/examples/chip/suggestion-static"
import suggestionStaticSrc from "@/docs/docs-site/examples/chip/suggestion-static?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

const SHARED = [
  { name: "elevated", type: "boolean", default: "false", description: "surface-container-low at level 1 instead of the outline. Use on images or busy backgrounds." },
  { name: "dense", type: "boolean", default: "false", description: "24dp tall, 4dp corners, 16dp icons." },
]
const SLOTS = [
  { name: "icon", type: "ReactNode", default: "—", description: "Leading icon: a Material Symbol name or any node." },
  { name: "trailingIcon", type: "ReactNode", default: "—", description: "Trailing icon, e.g. arrow_drop_down for a dropdown filter." },
]

export default {
  title: "Chips",
  description:
    "Chips help people enter information, make selections, filter content or trigger actions. Four M3 types (assist, filter, input, suggestion), plus a chip input field and a static display chip.",
  links: {
    m3: "https://m3.material.io/components/chips/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/TagGroup.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { ChipGroup, FilterChip } from "@/components/ui/chip"

<ChipGroup aria-label="Environments" defaultSelectedKeys={["production"]}>
  <FilterChip id="production">Production</FilterChip>
  <FilterChip id="staging">Staging</FilterChip>
</ChipGroup>`,
  examples: [
    {
      id: "assist",
      title: "Assist",
      description: "Smart actions related to the content. The leading icon takes the primary role; elevated drops the outline.",
      component: Assist,
      source: assistSrc,
    },
    {
      id: "filter",
      title: "Filter",
      description: (
        <>
          Selected chips fill with secondary-container and grow a leading check. A leading <InlineCode>icon</InlineCode> swaps for the check while
          selected. <InlineCode>ChipGroup</InlineCode> defaults to multiple selection.
        </>
      ),
      component: Filter,
      source: filterSrc,
    },
    {
      id: "choice",
      title: "Choice (single select)",
      description: <>selectionMode="single" turns a ChipGroup into choice chips with radio semantics.</>,
      component: Choice,
      source: choiceSrc,
    },
    {
      id: "input",
      title: "Input",
      description: (
        <>
          Discrete pieces of input, such as people or addresses. A 24dp avatar or an icon leads; passing <InlineCode>onRemove</InlineCode> to the group
          adds the remove button and Delete-key support.
        </>
      ),
      component: Input,
      source: inputSrc,
    },
    {
      id: "chip-input",
      title: "Chip input",
      description: (
        <>
          A text field that turns entries into input chips. Enter or comma adds; Backspace on an empty field removes the last chip.{" "}
          <InlineCode>parse</InlineCode> validates and normalizes, returning null to reject.
        </>
      ),
      component: ChipInputExample,
      source: chipInputSrc,
    },
    {
      id: "suggestion-static",
      title: "Suggestion and static chips",
      description: "Suggestion chips offer generated replies or queries. Chip is non-interactive: color it for status and metadata.",
      component: SuggestionStatic,
      source: suggestionStaticSrc,
    },
  ],
  api: [
    {
      name: "AssistChip · SuggestionChip",
      description: <>React Aria {c("Button")} props, plus:</>,
      props: [...SLOTS, ...SHARED, { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Press handler." }],
    },
    {
      name: "FilterChip",
      description: <>React Aria {c("ToggleButton")} props, plus the slots above. Inside a ChipGroup, give each one an {c("id")}.</>,
      props: [
        ...SLOTS,
        ...SHARED,
        { name: "id", type: "Key", default: "—", description: "Identifies the chip in its ChipGroup selection." },
        { name: "isSelected · defaultSelected", type: "boolean", default: "—", description: "Standalone selected state (a group manages it otherwise)." },
      ],
    },
    {
      name: "ChipGroup",
      description: <>React Aria {c("ToggleButtonGroup")} props. Lays chips out in a wrapping row with 8dp gaps.</>,
      props: [
        { name: "selectionMode", type: '"single" | "multiple"', default: '"multiple"', description: "single = choice chips (radio semantics); multiple = independent filters." },
        { name: "selectedKeys · defaultSelectedKeys", type: "Iterable<Key>", default: "—", description: "Selected chip ids, controlled or initial." },
        { name: "onSelectionChange", type: "(keys: Set<Key>) => void", default: "—", description: "Called with the new selection." },
        { name: "disallowEmptySelection", type: "boolean", default: "false", description: "Keep at least one chip selected." },
      ],
    },
    {
      name: "InputChip",
      description: <>React Aria {c("Tag")} props. Must render inside an InputChipGroup.</>,
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "The label. Strings become the textValue automatically." },
        { name: "avatar", type: "ReactNode", default: "—", description: "24dp avatar: initials, an <img>, or any node. Wins over icon." },
        { name: "icon", type: "ReactNode", default: "—", description: "Leading icon when there is no avatar." },
        ...SHARED,
      ],
    },
    {
      name: "InputChipGroup",
      description: <>React Aria {c("TagGroup")} + {c("TagList")}.</>,
      props: [
        { name: "items", type: "Iterable<T>", default: "—", description: "Dynamic collection; children is then a render function." },
        { name: "onRemove", type: "(keys: Set<Key>) => void", default: "—", description: "Shows the remove buttons and enables Delete / Backspace." },
        { name: "label", type: "ReactNode", default: "—", description: "Visible label above the chips." },
        { name: "renderEmptyState", type: "() => ReactNode", default: "—", description: "Shown when there are no chips." },
        { name: "listClassName", type: "string", default: "—", description: "Classes for the wrapping list." },
      ],
    },
    {
      name: "ChipInput",
      props: [
        { name: "value · defaultValue", type: "string[]", default: "[]", description: "Entries, controlled or initial." },
        { name: "onChange", type: "(value: string[]) => void", default: "—", description: "Called when an entry is added or removed." },
        { name: "label", type: "string", default: "—", description: 'Leading label inside the field, e.g. "To".' },
        { name: "aria-label", type: "string", default: "—", description: "Accessible name when there is no label." },
        { name: "placeholder", type: "string", default: "—", description: "Input placeholder." },
        { name: "parse", type: "(text: string) => string | null", default: "trim", description: "Turn typed text into a value; return null to reject." },
        { name: "renderAvatar", type: "(value: string) => ReactNode", default: "—", description: "Avatar for each chip." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables the field." },
      ],
    },
    {
      name: "Chip",
      description: <>A {c("<span>")}: HTML attributes plus the slots, {c("elevated")} and {c("dense")}. Not focusable.</>,
      props: [...SLOTS, ...SHARED],
    },
  ],
  accessibility: {
    description: (
      <>
        Assist and suggestion chips are buttons; filter chips are toggle buttons with {c("aria-pressed")}; a single-select ChipGroup is a radio group.
        Input chips form a React Aria TagGroup (a grid), which announces removal. Give every group an {c("aria-label")} or label.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus into a ChipGroup or InputChipGroup, then out of it (one tab stop per group)." },
      { keys: ["←", "→"], description: "Moves between chips in a group." },
      { keys: ["Space", "Enter"], description: "Activates an assist or suggestion chip; toggles a filter chip." },
      { keys: ["Delete", "Backspace"], description: "Removes the focused input chip when the group has onRemove." },
      { label: "Chip input", description: "Enter or comma adds the typed text; Backspace on an empty field removes the last chip." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Height · corners", "32dp · 8dp (dense: 24dp · 4dp)"],
          ["Label", <>{c("label-large")} (dense: {c("label-medium")})</>],
          ["Icons", "18dp (dense: 16dp) · avatar 24dp"],
          ["Padding", "16dp; 8dp beside an icon; 4dp beside an avatar"],
          ["Outline", "1dp outline-variant · elevated: surface-container-low, level 1 (2 on hover)"],
          ["Selected", "secondary-container, no outline, on-secondary-container content"],
          ["Disabled", "content on-surface 38%, outline on-surface 12%"],
        ],
      },
    ],
    cards: [
      { title: "Motion", items: [<>Filter check grows from 0 to 18dp on {c("fast-spatial")} (374ms)</>, <>Colors: {c("default-effects")} (223ms)</>] },
      { title: "States", items: ["Hover 8%", "Focus 10% + 3dp ring", "Pressed 12% + ripple"] },
    ],
    source: <>androidx {c("AssistChipTokens")}, {c("FilterChipTokens")} and {c("InputChipTokens")}.</>,
  },
} satisfies ComponentDoc
