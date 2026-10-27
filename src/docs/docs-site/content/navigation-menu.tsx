import Controlled from "@/docs/docs-site/examples/navigation-menu/controlled"
import controlledSrc from "@/docs/docs-site/examples/navigation-menu/controlled?raw"
import Demo from "@/docs/docs-site/examples/navigation-menu/demo"
import demoSrc from "@/docs/docs-site/examples/navigation-menu/demo?raw"
import Hover from "@/docs/docs-site/examples/navigation-menu/hover"
import hoverSrc from "@/docs/docs-site/examples/navigation-menu/hover?raw"
import Viewport from "@/docs/docs-site/examples/navigation-menu/viewport"
import viewportSrc from "@/docs/docs-site/examples/navigation-menu/viewport?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "A marketing-site header with flyout panels. One panel opens at a time, as a dropdown card under its trigger or, with a viewport, as a full-width mega menu.",
  preview: { component: Demo, source: demoSrc, className: "items-start" },
  usage: `import {
  NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList,
  NavigationMenuPanelLink, NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem value="products">
      <NavigationMenuTrigger>Products</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuPanelLink href="/grid" icon="grid_view" title="Grid">One control plane</NavigationMenuPanelLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
  examples: [
    {
      id: "viewport",
      title: "Mega menu",
      description: (
        <>
          Add <InlineCode>NavigationMenuViewport</InlineCode> and panels render into that full-width row instead of a dropdown card. Group links under{" "}
          <InlineCode>NavigationMenuGroupLabel</InlineCode>.
        </>
      ),
      component: Viewport,
      source: viewportSrc,
      className: "items-start",
    },
    {
      id: "hover",
      title: "Open on hover",
      description: (
        <>
          <InlineCode>openOnHover</InlineCode> opens panels as the pointer moves across triggers and closes them when it leaves the menu. Press still
          works, so touch and keyboard users aren't left out.
        </>
      ),
      component: Hover,
      source: hoverSrc,
      className: "items-start",
    },
    {
      id: "controlled",
      title: "Controlled",
      description: (
        <>
          <InlineCode>value</InlineCode> is the open item's value (or <InlineCode>null</InlineCode>); <InlineCode>onValueChange</InlineCode> reports
          every open and close.
        </>
      ),
      component: Controlled,
      source: controlledSrc,
      className: "items-start",
    },
  ],
  api: [
    {
      name: "NavigationMenu",
      description: <>Renders a {c("<nav>")}; HTML attributes are forwarded.</>,
      props: [
        { name: "openOnHover", type: "boolean", default: "false", description: "Open panels on hover as well as press." },
        { name: "value", type: "string | null", default: "—", description: "Open item (controlled)." },
        { name: "onValueChange", type: "(value: string | null) => void", default: "—", description: "Called when a panel opens or closes." },
      ],
    },
    {
      name: "NavigationMenuItem",
      description: <>An {c("<li>")} that scopes a trigger and its content.</>,
      props: [{ name: "value", type: "string", default: "auto id", description: "Identifies the item for value / onValueChange." }],
    },
    {
      name: "NavigationMenuTrigger · NavigationMenuContent",
      description: "The button that toggles a panel, and the panel itself (rendered only while open).",
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "Trigger label, or panel content. Required." },
        { name: "className", type: "string", default: "—", description: "Classes for the trigger or the panel (e.g. a grid layout)." },
      ],
    },
    {
      name: "NavigationMenuPanelLink",
      description: <>React Aria {c("Link")} props plus:</>,
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Link title (title-small). Required." },
        { name: "icon", type: "string", default: "—", description: "Leading Material Symbol in primary." },
        { name: "children", type: "ReactNode", default: "—", description: "One line of description (body-small)." },
        { name: "href", type: "string", default: "—", description: "Link target. Following it closes the panel." },
      ],
    },
    {
      name: "NavigationMenuLink",
      description: <>A top-level React Aria {c("Link")} in the row; {c('aria-current="page"')} colors it primary.</>,
      props: [{ name: "href", type: "string", default: "—", description: "Link target." }],
    },
    {
      name: "NavigationMenuList · NavigationMenuViewport · NavigationMenuGroupLabel",
      description: "The row of items (a wrapping <ul>), the full-width panel row (hidden while empty), and a small uppercase heading inside panels.",
      props: [{ name: "className", type: "string", default: "—", description: "Classes for the element." }],
    },
  ],
  accessibility: {
    description: (
      <>
        Triggers are buttons with {c("aria-expanded")} and {c("aria-controls")} pointing at their open panel. Panels contain ordinary links, so
        screen readers list them as links. Following a link, pressing Esc or pressing outside closes the open panel.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves between triggers and links, and into an open panel." },
      { keys: ["Space", "Enter"], description: "Opens or closes the focused trigger's panel." },
      { keys: ["Esc"], description: "Closes the open panel and returns focus to its trigger." },
    ],
    notes: [
      "Triggers don't use arrow-key roving; each is its own tab stop.",
      <>
        For app commands rather than site navigation, use a <TextLink to="/docs/menubar">menubar</TextLink>.
      </>,
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Trigger / link", <>40dp, full radius, {c("label-large")}, on-surface-variant</>],
          ["Open trigger", "secondary-container, on-secondary-container, chevron turned 180°"],
          ["Dropdown panel", "min 288dp, 16dp corners, surface-container, level 2, 8dp below"],
          ["Viewport", "full width, surface-container, 1dp outline-variant top border"],
          ["Panel link", <>12dp padding, 12dp corners, icon primary, {c("title-small")} + {c("body-small")}</>],
        ],
      },
    ],
    cards: [{ title: "Motion", items: [<>Chevron: {c("fast-spatial")} 0.6 / 800</>, "Panels enter with the menu / panel spring animations"] }],
    source: "No M3 spec component; composed from M3 menu, button and shape tokens.",
  },
} satisfies ComponentDoc
