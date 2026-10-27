import Demo from "@/docs/docs-site/examples/toolbar/demo"
import demoSrc from "@/docs/docs-site/examples/toolbar/demo?raw"
import Docked from "@/docs/docs-site/examples/toolbar/docked"
import dockedSrc from "@/docs/docs-site/examples/toolbar/docked?raw"
import DockedIcons from "@/docs/docs-site/examples/toolbar/docked-icons"
import dockedIconsSrc from "@/docs/docs-site/examples/toolbar/docked-icons?raw"
import Vertical from "@/docs/docs-site/examples/toolbar/vertical"
import verticalSrc from "@/docs/docs-site/examples/toolbar/vertical?raw"
import Vibrant from "@/docs/docs-site/examples/toolbar/vibrant"
import vibrantSrc from "@/docs/docs-site/examples/toolbar/vibrant?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Toolbars hold contextual actions for the current page. The floating toolbar is a 64dp pill, standard or vibrant, optionally paired with a FAB; the docked toolbar spans the bottom of the window and replaces the bottom app bar.",
  links: {
    m3: "https://m3.material.io/components/toolbars/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Toolbar.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Icon } from "@/components/ui/icon"
import { FloatingToolbar, ToolbarButton } from "@/components/ui/toolbar"

<FloatingToolbar aria-label="Formatting">
  <ToolbarButton aria-label="Bold"><Icon name="format_bold" /></ToolbarButton>
  <ToolbarButton aria-label="Italic"><Icon name="format_italic" /></ToolbarButton>
</FloatingToolbar>`,
  examples: [
    {
      id: "vibrant",
      title: "Vibrant",
      description: (
        <>
          <InlineCode>color="vibrant"</InlineCode> uses primary-container with on-primary-container icons; the selected item flips to surface-container.
          The paired <InlineCode>ToolbarFab</InlineCode> switches to tertiary-container to keep contrast.
        </>
      ),
      component: Vibrant,
      source: vibrantSrc,
    },
    {
      id: "vertical",
      title: "Vertical",
      description: (
        <>
          <InlineCode>orientation="vertical"</InlineCode> stacks items in a 64dp-wide column. Separators turn horizontal and the arrow keys become ↑ / ↓.
        </>
      ),
      component: Vertical,
      source: verticalSrc,
    },
    {
      id: "docked",
      title: "Docked",
      description: (
        <>
          <InlineCode>DockedToolbar</InlineCode> is a 64dp surface-container strip. <InlineCode>DockedToolbarAction</InlineCode> puts a label under each
          icon; <InlineCode>justify</InlineCode> controls spacing.
        </>
      ),
      component: Docked,
      source: dockedSrc,
    },
    {
      id: "docked-icons",
      title: "Docked with icons and a FAB",
      description: (
        <>
          Any content works inside a docked toolbar: icon buttons at the start and a <TextLink to="/docs/fab">FAB</TextLink> at the end.
        </>
      ),
      component: DockedIcons,
      source: dockedIconsSrc,
    },
  ],
  api: [
    {
      name: "FloatingToolbar",
      description: (
        <>
          React Aria's {c("Toolbar")} props ({c("aria-label")}, {c("children")}) plus the props below. Also exported: {c("floatingToolbarVariants")}.
        </>
      ),
      props: [
        { name: "color", type: '"standard" | "vibrant"', default: '"standard"', description: "surface-container or primary-container. Items and the FAB recolor to match." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Row or column, and the arrow-key axis." },
        { name: "fab", type: "ReactNode", default: "—", description: "A paired FAB, usually ToolbarFab, placed 8dp after the toolbar." },
        { name: "className", type: "string", default: "—", description: "Classes for the toolbar (or the toolbar + FAB group)." },
      ],
    },
    {
      name: "ToolbarButton · ToolbarToggleButton",
      description: (
        <>
          <TextLink to="/docs/icon-button">IconButton</TextLink> and ToggleIconButton, recolored for the toolbar. Same props, including the required{" "}
          {c("aria-label")}. Toggle buttons morph round → square when selected.
        </>
      ),
      props: [
        { name: "aria-label", type: "string", default: "—", description: "Accessible name. Required." },
        { name: "id", type: "Key", default: "—", description: "ToolbarToggleButton: identifies it inside a ToolbarToggleGroup." },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "ToolbarButton press handler." },
      ],
    },
    {
      name: "ToolbarToggleGroup",
      description: <>React Aria's {c("ToggleButtonGroup")}, following the toolbar's orientation.</>,
      props: [
        { name: "selectionMode", type: '"single" | "multiple"', default: '"single"', description: "Single or multiple selection." },
        { name: "selectedKeys", type: "Iterable<Key>", default: "—", description: "Selected items (controlled)." },
        { name: "defaultSelectedKeys", type: "Iterable<Key>", default: "—", description: "Initial selection when uncontrolled." },
        { name: "onSelectionChange", type: "(keys: Set<Key>) => void", default: "—", description: "Called when the selection changes." },
        { name: "disallowEmptySelection", type: "boolean", default: "false", description: "Keep at least one item selected." },
      ],
    },
    {
      name: "ToolbarFab",
      description: (
        <>
          A <TextLink to="/docs/fab">Fab</TextLink> that picks primary-container (standard) or tertiary-container (vibrant) from its toolbar. Same props as Fab.
        </>
      ),
      props: [{ name: "color", type: "Fab color", default: "from the toolbar", description: "Override the automatic container color." }],
    },
    {
      name: "ToolbarSeparator",
      description: "A 1dp divider at 20% of the content color; vertical in a horizontal toolbar and vice versa.",
      props: [{ name: "className", type: "string", default: "—", description: "Classes for the separator." }],
    },
    {
      name: "DockedToolbar",
      description: (
        <>
          React Aria's {c("Toolbar")} props plus {c("justify")}. Also exported: {c("dockedToolbarVariants")}.
        </>
      ),
      props: [
        {
          name: "justify",
          type: '"between" | "around" | "center" | "start" | "end"',
          default: '"between"',
          description: "Item distribution. center adds 32dp gaps.",
        },
      ],
    },
    {
      name: "DockedToolbarAction",
      description: <>A React Aria {c("Button")} with an icon over a label-medium label. Button props plus:</>,
      props: [
        { name: "icon", type: "string", default: "—", description: "Material Symbols name. Required." },
        { name: "children", type: "ReactNode", default: "—", description: "Label. Required." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Both toolbars use React Aria's {c("Toolbar")}: {c('role="toolbar"')} with {c("aria-orientation")}, named by {c("aria-label")}. Toggle groups
        add {c("aria-pressed")} (multiple) or radio semantics (single). Every icon-only item needs an {c("aria-label")}.
      </>
    ),
    keyboard: [
      { keys: ["←", "→"], description: "Move between items in a horizontal toolbar (↑ / ↓ when vertical)." },
      { keys: ["Tab"], description: "Moves focus into and out of the toolbar." },
      { keys: ["Space", "Enter"], description: "Activates or toggles the focused item." },
    ],
    notes: ["A paired FAB sits outside the toolbar's arrow-key group; Tab reaches it next.", "Keep floating toolbars 16dp from the window edge so they don't cover system gestures."],
  },
  spec: {
    tables: [
      {
        columns: ["Toolbar", "Size", "Shape", "Padding", "Container"],
        rows: [
          ["Floating", "64dp", "full", "8dp ends, 4dp between items", "surface-container · vibrant: primary-container"],
          ["Docked", "64dp", "none", "16dp sides, 4–32dp between items", "surface-container"],
        ],
      },
    ],
    cards: [
      {
        title: "Selected item",
        items: ["Standard: secondary-container, on-secondary-container", "Vibrant: surface-container, on-surface", "Shape: round → square on select"],
      },
      {
        title: "Elevation & FAB",
        items: ["Floating toolbar level 3, level 1 next to a FAB", "FAB 8dp after the toolbar, level 2 → 3 on hover", "FAB: primary-container (standard) or tertiary-container (vibrant)"],
      },
    ],
    source: (
      <>
        androidx {c("FloatingToolbarTokens")} and {c("DockedToolbarTokens")}. Compose leaves the floating toolbar's resting elevation unset; level 3
        matches the kit.
      </>
    ),
  },
} satisfies ComponentDoc
