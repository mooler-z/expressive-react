import Demo from "@/docs/docs-site/examples/navigation-drawer/demo"
import demoSrc from "@/docs/docs-site/examples/navigation-drawer/demo?raw"
import End from "@/docs/docs-site/examples/navigation-drawer/end"
import endSrc from "@/docs/docs-site/examples/navigation-drawer/end?raw"
import Groups from "@/docs/docs-site/examples/navigation-drawer/groups"
import groupsSrc from "@/docs/docs-site/examples/navigation-drawer/groups?raw"
import Leading from "@/docs/docs-site/examples/navigation-drawer/leading"
import leadingSrc from "@/docs/docs-site/examples/navigation-drawer/leading?raw"
import Modal from "@/docs/docs-site/examples/navigation-drawer/modal"
import modalSrc from "@/docs/docs-site/examples/navigation-drawer/modal?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

const sharedProps = [
  { name: "value", type: "string", default: "—", description: "Active destination (controlled)." },
  { name: "defaultValue", type: "string", default: "—", description: "Initial active destination when uncontrolled." },
  { name: "onValueChange", type: "(value: string) => void", default: "—", description: "Called when an item with a value is pressed." },
  { name: "dense", type: "boolean", default: "false", description: "48dp items instead of 56dp." },
  { name: "indicator", type: '"secondary" | "tertiary" | "primary"', default: '"secondary"', description: "Active-indicator color family." },
  { name: "aria-label", type: "string", default: '"Main"', description: "Name of the navigation landmark (and the modal dialog)." },
]

export default {
  description:
    "Navigation drawers list destinations, headlines and nested groups in a 360dp column. Use the standard drawer inline on large windows and the modal drawer on compact ones.",
  links: { m3: "https://m3.material.io/components/navigation-drawer/overview" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { NavigationDrawer, NavigationDrawerItem } from "@/components/ui/navigation-drawer"

<NavigationDrawer value={folder} onValueChange={setFolder}>
  <NavigationDrawerItem value="inbox" icon="inbox" badge={24}>Inbox</NavigationDrawerItem>
  <NavigationDrawerItem value="sent" icon="send">Sent</NavigationDrawerItem>
</NavigationDrawer>`,
  examples: [
    {
      id: "modal",
      title: "Modal drawer",
      description: (
        <>
          Put <InlineCode>ModalNavigationDrawer</InlineCode> in a <InlineCode>DialogTrigger</InlineCode> next to the button that opens it. It slides in
          over a scrim and closes on the scrim, Esc, or when a destination is chosen.
        </>
      ),
      component: Modal,
      source: modalSrc,
    },
    {
      id: "groups",
      title: "Nested groups",
      description: (
        <>
          <InlineCode>NavigationDrawerGroup</InlineCode> collapses a run of destinations under a heading; its height animates on the default spatial
          spring. Nested items indent and usually drop their icon.
        </>
      ),
      component: Groups,
      source: groupsSrc,
    },
    {
      id: "leading",
      title: "Custom leading, dense",
      description: (
        <>
          <InlineCode>leading</InlineCode> takes any node (a color dot, an avatar) in place of an icon. <InlineCode>dense</InlineCode> drops items to
          48dp.
        </>
      ),
      component: Leading,
      source: leadingSrc,
    },
    {
      id: "end",
      title: "End side, controlled",
      description: (
        <>
          <InlineCode>side="end"</InlineCode> slides in from the trailing edge. <InlineCode>keepOpenOnSelect</InlineCode> keeps it open while the user
          picks; <InlineCode>isOpen</InlineCode> / <InlineCode>onOpenChange</InlineCode> control it without a trigger.
        </>
      ),
      component: End,
      source: endSrc,
    },
  ],
  api: [
    {
      name: "NavigationDrawer",
      description: (
        <>
          The standard (inline) drawer. Renders a {c("<nav>")}; HTML attributes are forwarded. Also exported: {c("navigationDrawerVariants")}.
        </>
      ),
      props: [
        ...sharedProps,
        {
          name: "variant",
          type: '"standard" | "modal" | "plain"',
          default: '"standard"',
          description: "standard: surface. modal: the modal styling without the overlay. plain: no container color or padding, to host items anywhere.",
        },
      ],
    },
    {
      name: "ModalNavigationDrawer",
      description: (
        <>
          A React Aria {c("ModalOverlay")} containing the drawer. Same props as {c("NavigationDrawer")} except {c("variant")}, plus:
        </>
      ),
      props: [
        { name: "isOpen", type: "boolean", default: "—", description: "Open state (controlled). Not needed inside a DialogTrigger." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state when uncontrolled." },
        { name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—", description: "Called on open, scrim press, Esc and selection." },
        { name: "side", type: '"start" | "end"', default: '"start"', description: "Edge the drawer slides from." },
        { name: "keepOpenOnSelect", type: "boolean", default: "false", description: "Keep the drawer open after a destination is chosen." },
      ],
    },
    {
      name: "NavigationDrawerItem",
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "Label. Required." },
        { name: "value", type: "string", default: "—", description: "Compared with the drawer's value; pressing the item selects it." },
        { name: "icon", type: "string", default: "—", description: "Material Symbols name; fills when active. Nested items usually omit it." },
        { name: "leading", type: "ReactNode", default: "—", description: "Custom leading content (color dot, avatar) when there's no icon." },
        { name: "badge", type: "number | string | boolean", default: "—", description: "Trailing count or text, or true for a dot." },
        { name: "badgeLabel", type: "string", default: "—", description: "Accessible badge description." },
        { name: "href", type: "string", default: "—", description: <>Render as a link (use React Aria's {c("RouterProvider")} for client routing).</> },
        { name: "isActive", type: "boolean", default: "—", description: "Force the active state instead of comparing value." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables the item." },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Press handler. In a modal drawer the drawer closes first (unless keepOpenOnSelect)." },
        { name: "className", type: "string", default: "—", description: "Classes for the item." },
      ],
    },
    {
      name: "NavigationDrawerGroup",
      description: "A collapsible group of nested destinations (React Aria Disclosure).",
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Group heading (title-small). Required." },
        { name: "icon", type: "string", default: "—", description: "Material Symbols name before the title." },
        { name: "defaultExpanded", type: "boolean", default: "false", description: "Initially expanded when uncontrolled." },
        { name: "isExpanded", type: "boolean", default: "—", description: "Expanded state (controlled)." },
        { name: "onExpandedChange", type: "(expanded: boolean) => void", default: "—", description: "Called when the heading is pressed." },
        { name: "children", type: "ReactNode", default: "—", description: "NavigationDrawerItems (or more groups, up to two levels deep)." },
      ],
    },
    {
      name: "NavigationDrawerHeadline · NavigationDrawerDivider",
      description: "Section headline (title-small, on-surface-variant) and a 1dp outline-variant divider with 16dp insets.",
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "Headline text. The headline takes div attributes." },
        { name: "className", type: "string", default: "—", description: "Classes for either part." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The drawer is a {c("<nav>")} landmark named "Main" by default. Items are buttons (or links); the active one has {c('aria-current="page"')}.
        Group headings are disclosure buttons inside a heading, with {c("aria-expanded")}. The modal drawer is a React Aria dialog: focus moves in,
        is trapped while open, and returns to the trigger when it closes.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through destinations and group headings." },
      { keys: ["Space", "Enter"], description: "Selects a destination or toggles a group." },
      { keys: ["Esc"], description: "Closes the modal drawer." },
    ],
    notes: [
      <>
        Badge counts are read as plain text; set {c("badgeLabel")} for a clearer announcement, e.g. "24 unread".
      </>,
      <>
        On medium windows prefer a <TextLink to="/docs/navigation-rail">navigation rail</TextLink>; on compact ones, the modal drawer or a{" "}
        <TextLink to="/docs/navigation-bar">navigation bar</TextLink>.
      </>,
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Width", "360dp (modal: up to the window width minus 56dp)"],
          ["Item", "56dp (48dp dense), full radius, 16dp leading, 24dp trailing"],
          ["Icon · label", <>24dp · {c("label-large")}, 12dp apart</>],
          ["Headline", <>{c("title-small")}, on-surface-variant, 56dp</>],
          ["Nested item", "48dp leading indent (64dp at the second level)"],
        ],
      },
    ],
    cards: [
      {
        title: "Color",
        items: [
          "Active: secondary-container, on-secondary-container",
          "Inactive: on-surface-variant, on-surface when hovered",
          "Standard: surface, no elevation",
          "Modal: surface-container-low, level 1, 16dp end corners, 32% scrim",
        ],
      },
      {
        title: "Motion",
        items: [
          <>Modal enters on {c("default-spatial")} 0.8 / 380 (414ms), exits in 200ms</>,
          <>Group height: {c("default-spatial")}</>,
          <>Chevron rotation: {c("fast-spatial")}</>,
        ],
      },
    ],
    source: <>androidx {c("NavigationDrawerTokens")}.</>,
  },
} satisfies ComponentDoc
