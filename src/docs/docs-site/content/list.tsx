import Demo from "@/docs/docs-site/examples/list/demo"
import demoSrc from "@/docs/docs-site/examples/list/demo?raw"
import Leading from "@/docs/docs-site/examples/list/leading"
import leadingSrc from "@/docs/docs-site/examples/list/leading?raw"
import Lines from "@/docs/docs-site/examples/list/lines"
import linesSrc from "@/docs/docs-site/examples/list/lines?raw"
import Segmented from "@/docs/docs-site/examples/list/segmented"
import segmentedSrc from "@/docs/docs-site/examples/list/segmented?raw"
import Selection from "@/docs/docs-site/examples/list/selection"
import selectionSrc from "@/docs/docs-site/examples/list/selection?raw"
import Subheaders from "@/docs/docs-site/examples/list/subheaders"
import subheadersSrc from "@/docs/docs-site/examples/list/subheaders?raw"
import Trailing from "@/docs/docs-site/examples/list/trailing"
import trailingSrc from "@/docs/docs-site/examples/list/trailing?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

const contentProps = [
  { name: "children", type: "ReactNode", default: "—", description: "The headline (body-large)." },
  { name: "leading", type: "ReactNode", default: "—", description: "Avatar, icon, ListItemMedia, checkbox…" },
  { name: "overline", type: "ReactNode", default: "—", description: "Label-small line above the headline." },
  { name: "supportingText", type: "ReactNode", default: "—", description: "Body-medium line under the headline. Clamped to 2 lines in three-line items." },
  { name: "trailing", type: "ReactNode", default: "—", description: "Icon, switch, checkbox, icon button…" },
  { name: "trailingText", type: "ReactNode", default: "—", description: "Short label-small meta before `trailing` (\"09:41\", \"2.4 MB\")." },
  {
    name: "lines",
    type: "1 | 2 | 3",
    default: "inferred",
    description: "Forces the line count. Inferred: overline + supporting text → 3, either one → 2, else 1.",
  },
]

export default {
  description:
    "Lists are continuous, vertical groups of text and images. Static lists for display, and keyboard-navigable interactive lists with selection, actions and the Expressive segmented style.",
  links: {
    m3: "https://m3.material.io/components/lists/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/GridList.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Avatar } from "@/components/ui/avatar"
import { List, ListItem } from "@/components/ui/list"

<List>
  <ListItem leading={<Avatar name="Maya Lindqvist" />} supportingText="Deploy finished" trailingText="09:41">
    Maya Lindqvist
  </ListItem>
</List>`,
  examples: [
    {
      id: "lines",
      title: "One, two and three lines",
      description: "Height follows the content: 56, 72 or 88dp. Three-line items align leading and trailing content to the top.",
      component: Lines,
      source: linesSrc,
    },
    {
      id: "leading",
      title: "Leading content",
      description: (
        <>
          Icons are 24dp, avatars 40dp. <InlineCode>ListItemMedia</InlineCode> is a 56dp image or a 100×56dp video thumbnail with 8dp corners.
        </>
      ),
      component: Leading,
      source: leadingSrc,
    },
    {
      id: "trailing",
      title: "Trailing content",
      description: "trailingText shows short meta; trailing takes controls such as a switch or a chevron.",
      component: Trailing,
      source: trailingSrc,
    },
    {
      id: "selection",
      title: "Selection",
      description: (
        <>
          <InlineCode>InteractiveList</InlineCode> is React Aria's GridList. Put <InlineCode>{'<Checkbox slot="selection" />'}</InlineCode> in an item to bind
          it to the row's selection. Selected rows take secondary-container and 16dp corners.
        </>
      ),
      component: Selection,
      source: selectionSrc,
    },
    {
      id: "segmented",
      title: "Segmented (Expressive)",
      description: "variant=\"segmented\" separates items by 2dp. Corners morph from 4dp to 12dp on hover and 16dp when pressed, focused or selected.",
      component: Segmented,
      source: segmentedSrc,
    },
    {
      id: "subheaders",
      title: "Subheaders and dividers",
      description: "ListSubheader labels a group in title-small primary. Separate groups with a middle-inset Divider.",
      component: Subheaders,
      source: subheadersSrc,
    },
  ],
  api: [
    { name: "List", description: <>Static {c('<ul role="list">')}. Accepts every ul attribute.</>, props: [{ name: "className", type: "string", default: "—", description: "Merged with the 8dp vertical padding." }] },
    { name: "ListItem", description: <>An {c("<li>")} row. Also takes li attributes.</>, props: contentProps },
    {
      name: "InteractiveList",
      description: <>React Aria {c("GridList")}: everything it accepts (items, selectionMode, selectedKeys, onAction, renderEmptyState…), plus:</>,
      props: [
        { name: "variant", type: '"standard" | "segmented"', default: '"standard"', description: "segmented: separate rounded items that morph on hover, press and selection." },
        { name: "selectionMode", type: '"none" | "single" | "multiple"', default: '"none"', description: "From GridList." },
        { name: "onAction", type: "(key: Key) => void", default: "—", description: "From GridList: called when an item is activated." },
      ],
    },
    {
      name: "InteractiveListItem",
      description: <>React Aria {c("GridListItem")} (id, textValue, href, isDisabled…) with the same content props as ListItem.</>,
      props: [
        ...contentProps,
        { name: "textValue", type: "string", default: "children if a string", description: "Text for typeahead and announcements. Required when children isn't a plain string." },
      ],
    },
    { name: "ListSubheader", description: <>Group label, a {c("<div>")} in title-small primary.</>, props: [{ name: "className", type: "string", default: "—", description: "Merged with the subheader classes." }] },
    {
      name: "ListItemMedia",
      description: <>Leading image or video thumbnail slot. Also takes span attributes.</>,
      props: [{ name: "variant", type: '"image" | "video"', default: '"image"', description: "56×56dp image or 100×56dp video, 8dp corners. <img> children get object-cover." }],
    },
  ],
  accessibility: {
    description: (
      <>
        {c("List")} renders a semantic list. {c("InteractiveList")} renders a {c("grid")} with one focus stop; arrow keys move between rows, and selection
        state is announced. Give it an {c("aria-label")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves focus into the interactive list (to the last focused or selected row) and out again." },
      { keys: ["↑", "↓"], description: "Moves focus between rows." },
      { keys: ["Home", "End"], description: "Focuses the first or last row." },
      { keys: ["Space"], description: "Toggles selection of the focused row." },
      { keys: ["Enter"], description: "Triggers onAction (or follows href) on the focused row." },
      { label: "Typeahead", description: "Typing jumps to the next row whose textValue matches." },
    ],
    notes: ["Controls inside a static ListItem (switches, checkboxes) need their own aria-label.", "Disabled rows are skipped by keyboard navigation and announced as disabled."],
  },
  spec: {
    tables: [
      {
        columns: ["Lines", "Height", "Headline", "Supporting", "Overline · trailing text"],
        rows: [
          ["One", "56dp", c("body-large"), "—", c("label-small")],
          ["Two", "72dp", c("body-large"), c("body-medium"), c("label-small")],
          ["Three", "88dp", c("body-large"), <>{c("body-medium")}, 2 lines</>, c("label-small")],
        ],
      },
      {
        title: "Segmented corners",
        columns: ["State", "Corner"],
        rows: [
          ["Rest", "4dp (extra-small)"],
          ["Hovered", "12dp (medium)"],
          ["Pressed · focused · selected", "16dp (large)"],
          ["First and last item outer corners", "16dp"],
        ],
      },
    ],
    cards: [
      { title: "Spacing", items: ["Leading and trailing padding 16dp", "12dp between elements", "10dp top and bottom", "Segmented gap 2dp"] },
      { title: "Leading", items: ["Icon 24dp", "Avatar 40dp", "Image 56dp, 8dp corners", "Video 100×56dp, 8dp corners"] },
      { title: "Color", items: ["Container surface", "Selected: secondary-container, 16dp corners", "Disabled text on-surface 38%"] },
    ],
    source: <>androidx {c("ListTokens")}, including the Expressive segmented shape tokens.</>,
  },
} satisfies ComponentDoc
