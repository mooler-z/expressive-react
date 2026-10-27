import Bottom from "@/docs/docs-site/examples/app-bar/bottom"
import bottomSrc from "@/docs/docs-site/examples/app-bar/bottom?raw"
import Contextual from "@/docs/docs-site/examples/app-bar/contextual"
import contextualSrc from "@/docs/docs-site/examples/app-bar/contextual?raw"
import Demo from "@/docs/docs-site/examples/app-bar/demo"
import demoSrc from "@/docs/docs-site/examples/app-bar/demo?raw"
import Scroll from "@/docs/docs-site/examples/app-bar/scroll"
import scrollSrc from "@/docs/docs-site/examples/app-bar/scroll?raw"
import Search from "@/docs/docs-site/examples/app-bar/search"
import searchSrc from "@/docs/docs-site/examples/app-bar/search?raw"
import Subtitle from "@/docs/docs-site/examples/app-bar/subtitle"
import subtitleSrc from "@/docs/docs-site/examples/app-bar/subtitle?raw"
import Tabs from "@/docs/docs-site/examples/app-bar/tabs"
import tabsSrc from "@/docs/docs-site/examples/app-bar/tabs?raw"
import Variants from "@/docs/docs-site/examples/app-bar/variants"
import variantsSrc from "@/docs/docs-site/examples/app-bar/variants?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Top app bars carry the screen title, navigation and the most important actions. Small, center-aligned, medium flexible and large flexible, plus the bottom app bar. The container picks up surface-container as content scrolls beneath it.",
  links: { m3: "https://m3.material.io/components/app-bars/overview" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { TopAppBar } from "@/components/ui/app-bar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

<TopAppBar
  title="Inbox"
  navigation={<IconButton aria-label="Back"><Icon name="arrow_back" /></IconButton>}
  actions={<IconButton aria-label="Search"><Icon name="search" /></IconButton>}
/>`,
  examples: [
    {
      id: "variants",
      title: "Variants",
      description: "Small (64dp, title-large), center-aligned, medium flexible (112dp, headline-medium) and large flexible (120dp, display-small).",
      component: Variants,
      source: variantsSrc,
    },
    {
      id: "scroll",
      title: "Collapse on scroll",
      description: (
        <>
          Medium and large bars scroll their big title away under a pinned 64dp row; the small title fades in once it's gone and the row turns
          surface-container. The bar reads scroll from its nearest scrolling ancestor, or the window, with no wiring.
        </>
      ),
      component: Scroll,
      source: scrollSrc,
    },
    {
      id: "subtitle",
      title: "Subtitle",
      description: "A subtitle sits under the title: label-medium on small bars, label-large on medium, title-medium on large.",
      component: Subtitle,
      source: subtitleSrc,
    },
    {
      id: "contextual",
      title: "Contextual actions",
      description: (
        <>
          Swap the bar while items are selected. <InlineCode>rowClassName</InlineCode> recolors the 64dp row; a close button clears the selection.
        </>
      ),
      component: Contextual,
      source: contextualSrc,
    },
    {
      id: "search",
      title: "Search in the bar",
      description: (
        <>
          Children replace the title area, so a <TextLink to="/docs/search">SearchBar</TextLink> can sit between the navigation icon and an avatar.
        </>
      ),
      component: Search,
      source: searchSrc,
    },
    {
      id: "tabs",
      title: "With tabs",
      description: (
        <>
          <InlineCode>bottom</InlineCode> pins content under the row (tabs, a progress indicator) so it stays attached while the bar scrolls.
        </>
      ),
      component: Tabs,
      source: tabsSrc,
    },
    {
      id: "bottom",
      title: "Bottom app bar",
      description: "80dp, surface-container. Up to four actions at the start and an optional FAB at the end.",
      component: Bottom,
      source: bottomSrc,
    },
  ],
  api: [
    {
      name: "TopAppBar",
      description: (
        <>
          Renders a {c("<header>")}; other HTML attributes are forwarded to it. Also exported: {c("topAppBarVariants")}, the slot recipe.
        </>
      ),
      props: [
        { name: "variant", type: '"small" | "center" | "medium" | "large"', default: '"small"', description: "Bar type. Medium and large add the flexible expanded title." },
        { name: "title", type: "ReactNode", default: "—", description: "Screen title." },
        { name: "subtitle", type: "ReactNode", default: "—", description: "Second line under the title." },
        { name: "navigation", type: "ReactNode", default: "—", description: "Leading navigation icon button (back, menu, close)." },
        { name: "actions", type: "ReactNode", default: "—", description: "Trailing action icon buttons or an avatar." },
        { name: "children", type: "ReactNode", default: "—", description: "Replaces the title area, e.g. a search bar." },
        { name: "bottom", type: "ReactNode", default: "—", description: "Pinned below the row: tabs or a progress indicator." },
        {
          name: "scrolled",
          type: "boolean",
          default: "—",
          description: "Force the scrolled (surface-container) state instead of reading scroll. Medium and large bars otherwise switch once the big title has collapsed.",
        },
        { name: "rowClassName", type: "string", default: "—", description: "Classes for the 64dp row, e.g. a contextual secondary-container." },
        {
          name: "containerClassName",
          type: "string",
          default: "—",
          description: "Container color for the whole bar, expanded title included. Overrides the scroll colors.",
        },
      ],
    },
    {
      name: "BottomAppBar",
      description: <>A {c('role="toolbar"')} {c("<div>")}; HTML attributes are forwarded.</>,
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "Up to four action icon buttons." },
        { name: "fab", type: "ReactNode", default: "—", description: "Floating action button at the end." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The top app bar renders a {c("<header>")}. At the top level of a page that's the banner landmark; inside {c("<main>")} or a section it's a plain
        header. Every action is an <TextLink to="/docs/icon-button">Icon button</TextLink> with its own {c("aria-label")}. Medium and large bars
        render the title twice (expanded and collapsed); the copy that isn't visible is {c("aria-hidden")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through the navigation button, any title content and the actions, in reading order." },
      { keys: ["Space", "Enter"], description: "Activates the focused action." },
    ],
    notes: [
      <>Give the bottom app bar an {c("aria-label")} describing its actions; it is announced as a toolbar.</>,
      "Contextual bars should move focus back to the content when the selection clears.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Variant", "Height", "Title", "Subtitle"],
        rows: [
          ["Small", "64dp", c("title-large"), c("label-medium")],
          ["Center-aligned", "64dp", c("title-large"), c("label-medium")],
          ["Medium flexible", "112dp (taller with a subtitle)", c("headline-medium"), c("label-large")],
          ["Large flexible", "120dp (taller with a subtitle)", c("display-small"), c("title-medium")],
          ["Bottom app bar", "80dp", "—", "—"],
        ],
      },
    ],
    cards: [
      {
        title: "Color",
        items: [
          "Container: surface at rest, surface-container when scrolled",
          "Leading icon on-surface, trailing icons on-surface-variant",
          "Bottom app bar: surface-container",
        ],
      },
      {
        title: "Motion",
        items: [<>Container color: {c("default-effects")} 1.0 / 1600 (223ms)</>, "Collapsed title: fades in on the same spring once the big title has slid under the row"],
      },
      { title: "Layout", items: ["4dp leading and trailing padding", "48dp icon button touch targets", "Row stays pinned (sticky) while the expanded title scrolls"] },
    ],
    source: (
      <>
        androidx {c("AppBarSmallTokens")}, {c("AppBarMediumFlexibleTokens")}, {c("AppBarLargeFlexibleTokens")} and {c("BottomAppBarTokens")}.
      </>
    ),
  },
} satisfies ComponentDoc
