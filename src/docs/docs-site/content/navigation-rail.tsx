import Controlled from "@/docs/docs-site/examples/navigation-rail/controlled"
import controlledSrc from "@/docs/docs-site/examples/navigation-rail/controlled?raw"
import Demo from "@/docs/docs-site/examples/navigation-rail/demo"
import demoSrc from "@/docs/docs-site/examples/navigation-rail/demo?raw"
import Expanded from "@/docs/docs-site/examples/navigation-rail/expanded"
import expandedSrc from "@/docs/docs-site/examples/navigation-rail/expanded?raw"
import Modal from "@/docs/docs-site/examples/navigation-rail/modal"
import modalSrc from "@/docs/docs-site/examples/navigation-rail/modal?raw"
import Narrow from "@/docs/docs-site/examples/navigation-rail/narrow"
import narrowSrc from "@/docs/docs-site/examples/navigation-rail/narrow?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

const itemProps = [
  { name: "icon", type: "string", default: "—", description: "Material Symbols name. Required; fills when active." },
  { name: "label", type: "ReactNode", default: "—", description: "Destination label. Required. Below the icon when collapsed, beside it when expanded." },
  { name: "value", type: "string", default: "—", description: "Compared with the rail's value; pressing the item selects it." },
  { name: "badge", type: "number | string | boolean", default: "—", description: "Count, short text, or true for the dot. Expanded rails show counts at the end of the row." },
  { name: "badgeLabel", type: "string", default: "—", description: "Accessible badge description." },
  { name: "href", type: "string", default: "—", description: <>Render as a link (use React Aria's {c("RouterProvider")} for client routing).</> },
  { name: "isActive", type: "boolean", default: "—", description: "Force the active state instead of comparing value." },
  { name: "isDisabled", type: "boolean", default: "false", description: "Disables the item." },
  { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Called on press. In the modal rail, pressing an item also closes it." },
  { name: "className", type: "string", default: "—", description: "Classes for the item root." },
]

export default {
  description:
    "The navigation rail gives medium and expanded windows access to three to seven destinations. One component covers the collapsed rail, the expanded rail with inline labels, and the modal rail that floats over content.",
  links: { m3: "https://m3.material.io/components/navigation-rail/overview" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { NavigationRail, NavigationRailItem } from "@/components/ui/navigation-rail"

<NavigationRail value={page} onValueChange={setPage}>
  <NavigationRailItem value="inbox" icon="inbox" label="Inbox" />
  <NavigationRailItem value="sent" icon="send" label="Sent" />
</NavigationRail>`,
  examples: [
    {
      id: "expanded",
      title: "Expanded rail",
      description: (
        <>
          Expanded, items lay out horizontally on a 56dp full-radius indicator and the FAB extends with its label.{" "}
          <InlineCode>NavigationRailSection</InlineCode> adds a headline that collapses to a short divider in the collapsed rail.
        </>
      ),
      component: Expanded,
      source: expandedSrc,
    },
    {
      id: "modal",
      title: "Modal rail",
      description: (
        <>
          With <InlineCode>modal</InlineCode>, the collapsed rail keeps its place and the menu button opens the expanded rail as a dialog over the
          content: surface-container, 16dp end corners, a scrim. Choosing a destination closes it.
        </>
      ),
      component: Modal,
      source: modalSrc,
    },
    {
      id: "narrow",
      title: "Narrow, surface and indicator color",
      description: (
        <>
          <InlineCode>narrow</InlineCode> is the 80dp collapsed width. <InlineCode>surface</InlineCode> picks the container color and{" "}
          <InlineCode>indicator</InlineCode> the active-indicator family.
        </>
      ),
      component: Narrow,
      source: narrowSrc,
    },
    {
      id: "controlled",
      title: "Controlled expansion",
      description: (
        <>
          <InlineCode>expanded</InlineCode> and <InlineCode>onExpandedChange</InlineCode> let you drive the rail from your layout, e.g. from{" "}
          <TextLink to="/docs/use-window-size-class">useWindowSizeClass</TextLink>.
        </>
      ),
      component: Controlled,
      source: controlledSrc,
    },
  ],
  api: [
    {
      name: "NavigationRail",
      description: (
        <>
          Renders a {c("<nav>")}; HTML attributes are forwarded. Also exported: {c("<NavigationRailSpacer />")}, which pushes the items after it
          to the bottom of the rail, and {c("navigationRailVariants")}.
        </>
      ),
      props: [
        { name: "value", type: "string", default: "—", description: "Active destination (controlled)." },
        { name: "defaultValue", type: "string", default: "—", description: "Initial active destination when uncontrolled." },
        { name: "onValueChange", type: "(value: string) => void", default: "—", description: "Called when an item with a value is pressed." },
        { name: "expanded", type: "boolean", default: "—", description: "Expanded rail with inline labels (controlled)." },
        { name: "defaultExpanded", type: "boolean", default: "false", description: "Initial expansion when uncontrolled." },
        { name: "onExpandedChange", type: "(expanded: boolean) => void", default: "—", description: "Called by the menu button, the scrim and Esc (modal)." },
        { name: "modal", type: "boolean", default: "false", description: "Expand as a modal rail over the content; the collapsed rail keeps its place." },
        { name: "narrow", type: "boolean", default: "false", description: "80dp collapsed width instead of 96dp." },
        { name: "surface", type: '"standard" | "container" | "transparent"', default: '"standard"', description: "Container color: surface, surface-container or none." },
        { name: "indicator", type: '"secondary" | "tertiary" | "primary"', default: '"secondary"', description: "Active-indicator color family." },
        { name: "aria-label", type: "string", default: '"Main"', description: "Name of the navigation landmark (and of the modal dialog)." },
      ],
    },
    { name: "NavigationRailItem", props: itemProps },
    {
      name: "NavigationRailHeader",
      description: "Top block for the menu button and FAB, with 40dp below it before the first destination. Takes div attributes.",
      props: [{ name: "children", type: "ReactNode", default: "—", description: "Usually NavigationRailMenuButton and NavigationRailFab." }],
    },
    {
      name: "NavigationRailMenuButton",
      description: "Toggles collapsed ⇄ expanded; in a modal rail it opens and closes the dialog.",
      props: [
        { name: "aria-label", type: "string", default: '"Expand navigation" / "Collapse navigation"', description: "Override the accessible name." },
        { name: "className", type: "string", default: "—", description: "Classes for the button." },
      ],
    },
    {
      name: "NavigationRailFab",
      description: "56dp FAB when collapsed, extended FAB with its label when expanded.",
      props: [
        { name: "icon", type: "string", default: "—", description: "Material Symbols name. Required." },
        { name: "label", type: "string", default: "—", description: "Shown when expanded; the accessible name when collapsed. Required." },
        { name: "tone", type: '"primary" | "secondary" | "tertiary"', default: '"primary"', description: "Container family." },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Press handler." },
        { name: "className", type: "string", default: "—", description: "Classes for the button." },
      ],
    },
    {
      name: "NavigationRailSection",
      description: 'A role="group" of items. Its headline shows only when expanded.',
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Section headline (title-small). Strings also name the group. Required." },
        { name: "children", type: "ReactNode", default: "—", description: "NavigationRailItems." },
        { name: "className", type: "string", default: "—", description: "Classes for the group." },
      ],
    },
    {
      name: "useNavigationRail()",
      description: "Reads the rail state inside a NavigationRail, e.g. to show content only when expanded.",
      props: [
        { name: "expanded", type: "boolean", description: "Whether this copy of the rail is expanded (the modal copy is always expanded)." },
        { name: "setExpanded", type: "(expanded: boolean) => void", description: "Expand or collapse." },
        { name: "value", type: "string | undefined", description: "Active destination." },
        { name: "onValueChange", type: "(value: string) => void", description: "Select a destination." },
        { name: "inModal", type: "boolean", description: "True inside the modal rail." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The rail is a {c("<nav>")} landmark named "Main" by default. Items are buttons (or links) and the active one carries{" "}
        {c('aria-current="page"')}. The menu button exposes {c("aria-expanded")}. The modal rail is a React Aria dialog: focus moves into it, stays
        trapped while open, and returns to the menu button on close. The collapsed FAB is named by its {c("label")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through the menu button, FAB and destinations; each is its own tab stop." },
      { keys: ["Space", "Enter"], description: "Activates the focused destination or toggles expansion." },
      { keys: ["Esc"], description: "Closes the modal rail and returns focus to the menu button." },
    ],
    notes: [
      <>
        In a modal rail, pressing a destination closes the dialog. Navigation the user can't reach on compact windows belongs in a{" "}
        <TextLink to="/docs/navigation-drawer">modal drawer</TextLink> or the <TextLink to="/docs/navigation-bar">navigation bar</TextLink>.
      </>,
    ],
  },
  spec: {
    tables: [
      {
        columns: ["State", "Width", "Item", "Indicator", "Label"],
        rows: [
          ["Collapsed", "96dp (80dp narrow)", "icon over label, 4dp gap", "32 × 56dp", c("label-medium")],
          ["Expanded", "220–360dp", "56dp row, 16dp leading, 8dp icon–label", "56dp high, full radius", c("label-large")],
          ["Modal", "220–360dp", "as expanded", "as expanded", c("label-large")],
        ],
      },
    ],
    cards: [
      {
        title: "Color",
        items: [
          "Container: surface (modal: surface-container, level 2, 16dp end corners)",
          "Active: indicator secondary-container, icon on-secondary-container, label secondary when collapsed",
          "Inactive: on-surface-variant",
        ],
      },
      {
        title: "Motion",
        items: [
          <>Width: {c("default-spatial")} 0.8 / 380 (414ms)</>,
          <>Indicator: {c("fast-spatial")} 0.6 / 800 (374ms)</>,
          <>Modal enters on the default spatial spring and exits in 200ms</>,
        ],
      },
      { title: "Layout", items: ["44dp above the first destination", "4dp between items", "FAB 56dp, extended when expanded"] },
    ],
    source: (
      <>
        androidx {c("NavigationRailCollapsedTokens")}, {c("NavigationRailExpandedTokens")}, {c("NavigationRailVerticalItemTokens")},{" "}
        {c("NavigationRailHorizontalItemTokens")} and {c("NavigationRailColorTokens")}.
      </>
    ),
  },
} satisfies ComponentDoc
