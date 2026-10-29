// Navigation data for the Expressive React site, from design-reference/site/ (SiteHeader NAV + Docs GROUPS).
// Shared by the header (nav, ⌘K search, bottom nav) and the Docs sidebar.

import type { SiteSection } from "@/docs/site/site-layout"

export const SITE_NAV: { id: SiteSection; label: string; href: string }[] = [
  { id: "docs", label: "Docs", href: "/docs" },
  { id: "components", label: "Components", href: "/docs/button" },
  { id: "blocks", label: "Blocks", href: "/blocks" },
  { id: "themes", label: "Themes", href: "/themes" },
  { id: "charts", label: "Charts", href: "/docs/chart" },
]

/** Compact-width bottom navigation. */
export const SITE_BOTTOM_NAV: { id: SiteSection; label: string; icon: string; href: string }[] = [
  { id: "home", label: "Home", icon: "home", href: "/" },
  { id: "docs", label: "Docs", icon: "menu_book", href: "/docs" },
  { id: "blocks", label: "Blocks", icon: "view_quilt", href: "/blocks" },
  { id: "themes", label: "Themes", icon: "palette", href: "/themes" },
]

export type DocsSection = "start" | "foundations" | "components" | "hooks"

export interface DocsGroup {
  section: DocsSection
  name: string
  /** Foundations live on the Tokens page: items link to `/tokens#<id>` instead of `/docs/<id>`. */
  external?: (id: string) => string
  /** [page id, label, isNewInExpressive?] */
  items: [id: string, label: string, isNew?: boolean][]
}

export const DOCS_GROUPS: DocsGroup[] = [
  {
    section: "start",
    name: "Getting started",
    items: [
      ["intro", "Introduction"], ["install", "Installation"], ["registry", "components.json & registry"], ["theming", "Theming"],
      ["dark-mode", "Dark mode"], ["dynamic-color", "Dynamic color"], ["typography", "Typography"], ["icons", "Icons"],
      ["motion", "Motion"], ["rtl", "RTL"], ["cli", "CLI"], ["changelog", "Changelog"],
    ],
  },
  {
    section: "foundations",
    name: "Foundations",
    external: (id) => `/tokens#${id}`,
    items: [
      ["color", "Color roles"], ["type", "Typography"], ["shape", "Shape"], ["elevation", "Elevation"],
      ["springs", "Motion & springs"], ["interactions", "Interactions"], ["symbols", "Icons"], ["layout", "Layout & window size classes"],
    ],
  },
  { section: "components", name: "Actions", items: [["button", "Button"], ["icon-button", "Icon button"], ["fab", "FAB · Extended · Menu", true], ["button-group", "Button group · Split", true]] },
  {
    section: "components",
    name: "Communication",
    items: [["badge", "Badge"], ["progress", "Progress", true], ["loading-indicator", "Loading indicator", true], ["snackbar", "Snackbar"], ["toast", "Toast"], ["tooltip", "Tooltip"]],
  },
  {
    section: "components",
    name: "Containment",
    items: [["card", "Card"], ["carousel", "Carousel"], ["dialog", "Dialog"], ["alert-dialog", "Alert dialog"], ["divider", "Divider"], ["list", "List"], ["sheet", "Bottom & side sheets"], ["accordion", "Accordion"]],
  },
  {
    section: "components",
    name: "Navigation",
    items: [
      ["app-bar", "App bar"], ["navigation-bar", "Navigation bar"], ["navigation-rail", "Navigation rail"], ["navigation-drawer", "Navigation drawer"],
      ["tabs", "Tabs"], ["search", "Search"], ["toolbar", "Toolbar", true], ["breadcrumb", "Breadcrumb"], ["pagination", "Pagination"],
      ["sidebar", "Sidebar"], ["navigation-menu", "Navigation menu"], ["menubar", "Menubar"],
    ],
  },
  {
    section: "components",
    name: "Selection",
    items: [
      ["checkbox", "Checkbox"], ["chip", "Chips"], ["date-picker", "Date picker"], ["time-picker", "Time picker"], ["calendar", "Calendar"],
      ["menu", "Menu"], ["select", "Select"], ["radio", "Radio"], ["slider", "Slider", true], ["switch", "Switch"], ["combobox", "Combobox"],
      ["command", "Command palette"], ["context-menu", "Context menu"],
    ],
  },
  {
    section: "components",
    name: "Inputs & forms",
    items: [["text-field", "Text field"], ["field", "Field & label"], ["input-group", "Input group"], ["input-otp", "Input OTP"], ["date-field", "Date field"]],
  },
  {
    section: "components",
    name: "Content & layout",
    items: [
      ["avatar", "Avatar"], ["aspect-ratio", "Aspect ratio"], ["code-block", "Code block & Kbd"], ["empty-state", "Empty state"], ["skeleton", "Skeleton"],
      ["scroll-area", "Scroll area"], ["resizable", "Resizable"], ["marker", "Marker"], ["popover", "Popover & hover card"],
      ["direction", "Direction (RTL)"], ["alert", "Alert & banner"],
    ],
  },
  { section: "components", name: "Data", items: [["table", "Table"], ["data-table", "Data table"], ["chart", "Charts"], ["trace", "Trace"]] },
  { section: "components", name: "Chat", items: [["message", "Message"], ["message-scroller", "Message scroller"], ["attachment", "Attachment"], ["questionnaire", "Questionnaire"]] },
  { section: "components", name: "Utilities", items: [["shape", "Shape", true], ["ripple", "Ripple"], ["reveal", "Reveal"], ["theme-provider", "Theme provider"], ["theme-presets", "Theme presets", true]] },
  {
    section: "hooks",
    name: "Hooks",
    items: [
      ["use-window-size-class", "useWindowSizeClass"], ["use-media-query", "useMediaQuery"], ["use-motion", "useMotion"], ["use-press-scale", "usePressScale"],
      ["use-magnetic", "useMagnetic"], ["use-tilt", "useTilt"], ["use-drag-scroll", "useDragScroll"],
    ],
  },
]

/** Page ids use registry item names, so `/docs/<id>` ↔ `@expressive/<id>` ↔ `src/components/ui/<id>.tsx`.
 *  Exceptions the design uses as short ids: "charts" → chart, "chips" → chip, "loading" → loading-indicator. */
export const DOCS_ALIASES: Record<string, string> = { charts: "chart", chips: "chip", loading: "loading-indicator", empty: "empty-state" }

export function docsHref(id: string) {
  for (const g of DOCS_GROUPS) if (g.external && g.items.some(([i]) => i === id)) return g.external(id)
  return `/docs/${DOCS_ALIASES[id] ?? id}`
}

/** External links (single place to change once the repo is public). */
export const SITE_LINKS = {
  github: "https://github.com/mooler-z/expressive-react",
  m3: "https://m3.material.io/",
  version: "v1.1.0",
}

/** Where a registry block opens from search and other site links. */
export function blockHref(name: string) {
  return `/blocks/view/${name}`
}
