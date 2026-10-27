import Collapsible from "@/docs/docs-site/examples/sidebar/collapsible"
import collapsibleSrc from "@/docs/docs-site/examples/sidebar/collapsible?raw"
import Demo from "@/docs/docs-site/examples/sidebar/demo"
import demoSrc from "@/docs/docs-site/examples/sidebar/demo?raw"
import Modal from "@/docs/docs-site/examples/sidebar/modal"
import modalSrc from "@/docs/docs-site/examples/sidebar/modal?raw"
import Rail from "@/docs/docs-site/examples/sidebar/rail"
import railSrc from "@/docs/docs-site/examples/sidebar/rail?raw"
import Slots from "@/docs/docs-site/examples/sidebar/slots"
import slotsSrc from "@/docs/docs-site/examples/sidebar/slots?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "A product sidebar composed from the M3 navigation drawer and rail. One tree of items renders as a 300dp column, a 96dp rail or a modal drawer, and mode=\"auto\" picks between them from the window size class.",
  preview: { component: Demo, source: demoSrc, className: "p-3 sm:p-6" },
  usage: `import { Sidebar, SidebarContent, SidebarInset, SidebarItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

<SidebarProvider>
  <Sidebar value={page} onValueChange={setPage}>
    <SidebarContent>
      <SidebarItem value="home" icon="home" label="Home" />
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    …
  </SidebarInset>
</SidebarProvider>`,
  examples: [
    {
      id: "collapsible",
      title: "Collapse to a rail",
      description: (
        <>
          In <InlineCode>mode="full"</InlineCode>, <InlineCode>SidebarTrigger</InlineCode> toggles between the full column and the rail; the width
          animates on the default spatial spring.
        </>
      ),
      component: Collapsible,
      source: collapsibleSrc,
    },
    {
      id: "rail",
      title: "Rail",
      description: (
        <>
          <InlineCode>mode="rail"</InlineCode> always shows the rail. Group labels turn into short dividers and a{" "}
          <InlineCode>SidebarSubmenu</InlineCode> becomes an item that opens its children as a menu.
        </>
      ),
      component: Rail,
      source: railSrc,
    },
    {
      id: "modal",
      title: "Modal drawer",
      description: (
        <>
          <InlineCode>mode="modal"</InlineCode> hides the sidebar until the trigger opens it as a modal drawer. Choosing an item closes it.
        </>
      ),
      component: Modal,
      source: modalSrc,
    },
    {
      id: "slots",
      title: "Full-only and rail-only content",
      description: (
        <>
          <InlineCode>SidebarFullOnly</InlineCode> and <InlineCode>SidebarRailOnly</InlineCode> swap content between layouts, e.g. a search field
          that becomes a search icon button. Collapse it to see the swap.
        </>
      ),
      component: Slots,
      source: slotsSrc,
    },
  ],
  api: [
    {
      name: "SidebarProvider",
      description: "Holds the sidebar state. Wrap the Sidebar and the content next to it.",
      props: [
        {
          name: "mode",
          type: '"auto" | "full" | "rail" | "modal"',
          default: '"auto"',
          description: "auto: modal below 600px, rail from 600px, full from 1200px (M3 window size classes).",
        },
        { name: "collapsed", type: "boolean", default: "—", description: "Full sidebar collapsed to a rail (controlled). Ignored in modal mode." },
        { name: "defaultCollapsed", type: "boolean", default: "false", description: "Initial collapsed state when uncontrolled." },
        { name: "onCollapsedChange", type: "(collapsed: boolean) => void", default: "—", description: "Called by SidebarTrigger." },
      ],
    },
    {
      name: "Sidebar",
      description: (
        <>
          Renders a {c("<nav>")} (inside a modal dialog in modal mode); HTML attributes are forwarded. Also exported: {c("sidebarVariants")}. Set{" "}
          {c("--sidebar-width")} to change the 300dp full width.
        </>
      ),
      props: [
        { name: "value", type: "string", default: "—", description: "Active item (controlled)." },
        { name: "defaultValue", type: "string", default: "—", description: "Initial active item when uncontrolled." },
        { name: "onValueChange", type: "(value: string) => void", default: "—", description: "Called when an item with a value is chosen." },
        { name: "surface", type: '"low" | "surface" | "transparent"', default: '"low"', description: "surface-container-low, surface, or none." },
        { name: "aria-label", type: "string", default: '"Main"', description: "Name of the navigation landmark." },
      ],
    },
    {
      name: "SidebarItem",
      props: [
        { name: "label", type: "ReactNode", default: "—", description: "Item label. Required." },
        { name: "value", type: "string", default: "—", description: "Compared with the sidebar's value." },
        { name: "icon", type: "string", default: "—", description: "Material Symbols name; fills when active." },
        { name: "leading", type: "ReactNode", default: "—", description: "Custom leading content (a color dot, an avatar) instead of an icon." },
        { name: "badge", type: "number | string | boolean", default: "—", description: "Count or short text, or true for a dot." },
        { name: "badgeTone", type: '"primary" | "error" | "plain"', default: '"primary"', description: "Badge colors in the full layout." },
        { name: "badgeLabel", type: "string", default: "—", description: "Accessible badge description." },
        { name: "href", type: "string", default: "—", description: <>Render as a link (use React Aria's {c("RouterProvider")}).</> },
        { name: "isActive", type: "boolean", default: "—", description: "Force the active state." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables the item." },
        { name: "onPress", type: "(e: PressEvent) => void", default: "—", description: "Press handler. In modal mode the drawer closes first." },
      ],
    },
    {
      name: "SidebarSubmenu",
      description: "A collapsible section of nested items. In rail mode it becomes an item that opens a menu built from its SidebarItem children.",
      props: [
        { name: "title", type: "string", default: "—", description: "Section title. Required." },
        { name: "icon", type: "string", default: '"folder"', description: "Shown in rail mode." },
        { name: "defaultExpanded", type: "boolean", default: "expanded if a child is active", description: "Initial expansion." },
        { name: "children", type: "ReactNode", default: "—", description: "SidebarItems (only SidebarItems appear in the rail menu)." },
      ],
    },
    {
      name: "SidebarMenuButton",
      description: (
        <>
          A header or footer row (workspace switcher, account). Usually the trigger of a {c("MenuTrigger")}. React Aria Button props plus:
        </>
      ),
      props: [
        { name: "leading", type: "ReactNode", default: "—", description: "Avatar or logo; the only part shown in rail mode. Required." },
        { name: "title", type: "ReactNode", default: "—", description: "Primary text (also the accessible name in rail mode). Required." },
        { name: "subtitle", type: "ReactNode", default: "—", description: "Second line." },
        { name: "trailing", type: "ReactNode", default: "unfold icon", description: "Trailing content; null for none." },
      ],
    },
    {
      name: "Layout parts",
      description: "SidebarHeader, SidebarContent (scrolls), SidebarFooter (divider above), SidebarSeparator, SidebarInset (the content next to the sidebar). All take div attributes.",
      props: [
        { name: "SidebarGroup · label", type: "ReactNode", default: "—", description: "Group label (title-small); a short divider in rail mode." },
        { name: "SidebarTrigger · aria-label", type: "string", default: "by state", description: "Menu button: full ⇄ rail, or opens the drawer in modal mode." },
        { name: "SidebarFullOnly · SidebarRailOnly", type: "children", default: "—", description: "Render children only in the full or the rail layout." },
      ],
    },
    {
      name: "useSidebar()",
      description: "Reads the sidebar state inside a SidebarProvider.",
      props: [
        { name: "mode", type: '"full" | "rail" | "modal"', description: "Resolved layout." },
        { name: "collapsed · setCollapsed", type: "boolean · (c: boolean) => void", description: "User-collapsed state of the full sidebar." },
        { name: "openMobile · setOpenMobile", type: "boolean · (o: boolean) => void", description: "Modal drawer open state." },
        { name: "toggle", type: "() => void", description: "What SidebarTrigger does." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The sidebar is a {c("<nav>")} landmark named "Main" by default. Items are buttons (or links) with {c('aria-current="page"')} on the active one.
        Submenus are disclosure buttons with {c("aria-expanded")}; in rail mode they're menu buttons. The trigger exposes {c("aria-expanded")}. In modal
        mode the sidebar is a React Aria dialog with focus trapping, Esc and scrim dismissal.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through header buttons, items, submenu headings and the footer." },
      { keys: ["Space", "Enter"], description: "Selects an item or toggles a submenu." },
      { keys: ["Esc"], description: "Closes the modal drawer or a rail submenu menu." },
    ],
    notes: [
      "Rail items show their label below the icon, so they keep a visible accessible name.",
      <>
        For a single fixed layout, the <TextLink to="/docs/navigation-drawer">navigation drawer</TextLink> or{" "}
        <TextLink to="/docs/navigation-rail">navigation rail</TextLink> is simpler.
      </>,
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Layout", "Width", "Item", "Label"],
        rows: [
          ["Full", "300dp (--sidebar-width)", "48dp, full-radius indicator, 16dp leading", c("label-large")],
          ["Full · nested", "300dp", "44dp, 48dp indent", c("label-large")],
          ["Rail", "96dp", "32 × 56dp indicator, label below", c("label-medium")],
          ["Modal", "300dp, up to window − 56dp", "as full", c("label-large")],
        ],
      },
    ],
    cards: [
      {
        title: "Color",
        items: ["Container: surface-container-low", "Active: secondary-container, on-secondary-container (label secondary in the rail)", "Group labels: title-small, on-surface-variant"],
      },
      {
        title: "Motion",
        items: [<>Width: {c("default-spatial")} 0.8 / 380 (414ms)</>, <>Rail indicator: {c("fast-spatial")}</>, <>Submenu height: {c("default-spatial")}</>],
      },
    ],
    source: (
      <>
        Composed from androidx {c("NavigationDrawerTokens")} and {c("NavigationRailCollapsedTokens")}; there's no M3 "sidebar" component.
      </>
    ),
  },
} satisfies ComponentDoc
