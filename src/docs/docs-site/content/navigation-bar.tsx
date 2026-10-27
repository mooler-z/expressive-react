import Auto from "@/docs/docs-site/examples/navigation-bar/auto"
import autoSrc from "@/docs/docs-site/examples/navigation-bar/auto?raw"
import Badges from "@/docs/docs-site/examples/navigation-bar/badges"
import badgesSrc from "@/docs/docs-site/examples/navigation-bar/badges?raw"
import Colors from "@/docs/docs-site/examples/navigation-bar/colors"
import colorsSrc from "@/docs/docs-site/examples/navigation-bar/colors?raw"
import Demo from "@/docs/docs-site/examples/navigation-bar/demo"
import demoSrc from "@/docs/docs-site/examples/navigation-bar/demo?raw"
import Disabled from "@/docs/docs-site/examples/navigation-bar/disabled"
import disabledSrc from "@/docs/docs-site/examples/navigation-bar/disabled?raw"
import Horizontal from "@/docs/docs-site/examples/navigation-bar/horizontal"
import horizontalSrc from "@/docs/docs-site/examples/navigation-bar/horizontal?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "The navigation bar switches between three to five top-level destinations on compact windows. The active indicator grows out from its center on the FastSpatial spring and the icon fills.",
  links: { m3: "https://m3.material.io/components/navigation-bar/overview" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"

<NavigationBar value={page} onValueChange={setPage}>
  <NavigationBarItem value="home" icon="home" label="Home" />
  <NavigationBarItem value="explore" icon="explore" label="Explore" />
</NavigationBar>`,
  examples: [
    {
      id: "badges",
      title: "Badges",
      description: (
        <>
          <InlineCode>badge</InlineCode> takes a count, short text, or <InlineCode>true</InlineCode> for the small dot. Counts above 999 read
          "999+". <InlineCode>badgeLabel</InlineCode> is what screen readers hear.
        </>
      ),
      component: Badges,
      source: badgesSrc,
    },
    {
      id: "horizontal",
      title: "Horizontal items",
      description: "On medium windows the icon and label sit side by side inside a 40dp indicator. Counts move inline after the label.",
      component: Horizontal,
      source: horizontalSrc,
    },
    {
      id: "auto",
      title: "Adaptive layout",
      description: (
        <>
          <InlineCode>layout="auto"</InlineCode> stacks items on compact windows and switches to horizontal from 600px. Resize the window to watch it
          change. From 840px, M3 recommends a <TextLink to="/docs/navigation-rail">navigation rail</TextLink> instead.
        </>
      ),
      component: Auto,
      source: autoSrc,
    },
    {
      id: "colors",
      title: "Indicator color",
      description: "Secondary-container is the M3 default; tertiary and primary families are available for brand emphasis.",
      component: Colors,
      source: colorsSrc,
    },
    {
      id: "disabled",
      title: "Disabled destination",
      description: "Disabled items drop to 38% opacity, ignore presses and leave the tab order.",
      component: Disabled,
      source: disabledSrc,
    },
  ],
  api: [
    {
      name: "NavigationBar",
      description: (
        <>
          Renders a {c("<nav>")}; HTML attributes are forwarded. Also exported: {c("navigationBarVariants")}.
        </>
      ),
      props: [
        { name: "value", type: "string", default: "—", description: "Active destination (controlled). Items compare against their own value." },
        { name: "defaultValue", type: "string", default: "—", description: "Initial active destination when uncontrolled." },
        { name: "onValueChange", type: "(value: string) => void", default: "—", description: "Called when an item with a value is pressed." },
        {
          name: "layout",
          type: '"vertical" | "horizontal" | "auto"',
          default: '"vertical"',
          description: "Item layout. auto is vertical on compact windows and horizontal from 600px.",
        },
        { name: "indicator", type: '"secondary" | "tertiary" | "primary"', default: '"secondary"', description: "Active-indicator color family." },
        { name: "aria-label", type: "string", default: '"Main"', description: "Name of the navigation landmark." },
      ],
    },
    {
      name: "NavigationBarItem",
      props: [
        { name: "icon", type: "string", default: "—", description: "Material Symbols name. Required; fills when active." },
        { name: "label", type: "ReactNode", default: "—", description: "Destination label. Required." },
        { name: "value", type: "string", default: "—", description: "Compared with the bar's value; pressing the item selects it." },
        { name: "badge", type: "number | string | boolean", default: "—", description: "Count, short text, or true for the small dot." },
        { name: "badgeLabel", type: "string", default: "—", description: 'Accessible badge description, e.g. "4 new alerts".' },
        {
          name: "href",
          type: "string",
          default: "—",
          description: (
            <>
              Render as a link. Wrap your app in React Aria's {c("RouterProvider")} for client-side routing.
            </>
          ),
        },
        { name: "isActive", type: "boolean", default: "—", description: "Force the active state (e.g. from your router) instead of comparing value." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables the item." },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Called on press, after the bar's onValueChange." },
        { name: "className", type: "string", default: "—", description: "Classes for the item root." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The bar is a {c("<nav>")} landmark named "Main" by default; give it a different {c("aria-label")} when a page has more than one. Items are
        buttons (or links with {c("href")}) and the active one carries {c('aria-current="page"')}. The visible label is the accessible name, so there's
        no need for an extra {c("aria-label")} on items.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves between destinations. Each item is its own tab stop." },
      { keys: ["Space", "Enter"], description: "Selects the focused destination. The focus ring is a 3dp secondary outline around the indicator." },
      { label: "Disabled", description: "Skipped by Tab and announced as disabled." },
    ],
    notes: ["Keep labels short and always visible; M3 doesn't hide navigation bar labels.", "Badge counts aren't read from the visual number; set badgeLabel."],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Vertical item", "Horizontal item"],
        rows: [
          ["Container", "64dp, surface-container", "64dp, surface-container"],
          ["Active indicator", "32 × 56dp, full radius", "40dp high, 16dp leading/trailing, full radius"],
          ["Icon", "24dp", "24dp"],
          ["Label", <>{c("label-medium")}, 4dp below the indicator</>, <>{c("label-large")}, beside the icon</>],
        ],
      },
    ],
    cards: [
      {
        title: "Color",
        items: [
          "Active: indicator secondary-container, icon on-secondary-container, label secondary",
          "Inactive: icon and label on-surface-variant",
          "State layers: 8% hover, 10% focus, 12% pressed",
        ],
      },
      {
        title: "Motion",
        items: [
          <>Indicator grows from 32% width: {c("fast-spatial")} 0.6 / 800 (374ms)</>,
          <>Icon fill: {c("default-effects")} 1.0 / 1600 (223ms)</>,
        ],
      },
    ],
    source: (
      <>
        androidx {c("NavigationBarTokens")}, {c("NavigationBarVerticalItemTokens")} and {c("NavigationBarHorizontalItemTokens")} (the Expressive
        64dp "short" bar).
      </>
    ),
  },
} satisfies ComponentDoc
