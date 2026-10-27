// Mirrors design-reference: page list and the Components page's groups/sections, in the kit's order.

export type DocsPage = { path: string; title: string; icon: string; file: string }

/** Kit-mirror pages (one per design-reference/*.dc.html), linked from the kit header. `file` is the reference source.
 *  The Expressive React site itself (/, /docs, /blocks, /themes, /tokens) follows design-reference/site/. */
export const PAGES: DocsPage[] = [
  { path: "/kit", title: "Components", icon: "widgets", file: "Components.dc.html" },
  { path: "/landing", title: "Landing", icon: "web", file: "Landing.dc.html" },
  { path: "/admin", title: "Dashboard", icon: "space_dashboard", file: "Admin Dashboard.dc.html" },
  { path: "/dashboard-kit", title: "Dashboard kit", icon: "monitoring", file: "Dashboard Kit.dc.html" },
  { path: "/kit/blocks/shell", title: "Blocks", icon: "view_quilt", file: "Blocks Shell.dc.html" },
  { path: "/layouts", title: "Layouts", icon: "dashboard", file: "Layouts.dc.html" },
]

export const BLOCK_PAGES = [
  { path: "/kit/blocks/shell", title: "Shell", file: "Blocks Shell.dc.html" },
  { path: "/kit/blocks/data", title: "Data", file: "Blocks Data.dc.html" },
  { path: "/kit/blocks/auth", title: "Auth", file: "Blocks Auth.dc.html" },
  { path: "/kit/blocks/settings", title: "Settings", file: "Blocks Settings.dc.html" },
  { path: "/kit/blocks/people", title: "People", file: "Blocks People.dc.html" },
]

export const LANDING_PAGES = [
  { path: "/landing", title: "Landing", file: "Landing.dc.html" },
  { path: "/landing-v1", title: "Landing v1", file: "Landing v1.dc.html" },
  { path: "/landing-v3", title: "Landing v3", file: "Landing v3.dc.html" },
  { path: "/landing-variants", title: "Landing variants", file: "Landing Variants.dc.html" },
]

/** Components page: group → [section id, title], exactly as Components.dc.html orders them. */
export const GROUPS: { title: string; sections: [id: string, title: string][] }[] = [
  {
    title: "Styles",
    sections: [
      ["color", "Color roles"], ["typography", "Typography"], ["shape", "Shape"], ["elevation", "Elevation"],
      ["motion", "Motion"], ["interactions", "Interactions"], ["icons", "Icons"], ["layout", "Layout · window size classes"],
    ],
  },
  {
    title: "Actions",
    sections: [["buttons", "Common buttons"], ["icon-buttons", "Icon buttons"], ["fab", "Floating action buttons"], ["button-groups", "Button groups & split button"]],
  },
  {
    title: "Communication",
    sections: [["badges", "Badges"], ["progress", "Progress indicators"], ["loading", "Loading indicator"], ["snackbar", "Snackbar"], ["tooltips", "Tooltips"]],
  },
  {
    title: "Containment",
    sections: [["cards", "Cards"], ["carousel", "Carousel"], ["dialogs", "Dialogs"], ["dividers", "Dividers"], ["lists", "Lists"], ["sheets", "Bottom sheets & side sheets"]],
  },
  {
    title: "Navigation",
    sections: [
      ["app-bars", "App bars"], ["navigation-bar", "Navigation bar"], ["navigation-rail", "Navigation rail"],
      ["navigation-drawer", "Navigation drawer"], ["tabs", "Tabs"], ["search", "Search"], ["toolbars", "Toolbars"],
    ],
  },
  {
    title: "Selection",
    sections: [
      ["checkbox", "Checkbox"], ["chips", "Chips"], ["date-pickers", "Date pickers"], ["menus", "Menus"],
      ["radio", "Radio button"], ["sliders", "Sliders"], ["switch", "Switch"], ["time-pickers", "Time pickers"],
    ],
  },
  { title: "Text inputs", sections: [["text-fields", "Text fields"]] },
  {
    title: "Content & layout",
    sections: [
      ["accordion", "Accordion & collapsible"], ["avatar", "Avatar"], ["breadcrumb", "Breadcrumb"], ["aspect-ratio", "Aspect ratio"],
      ["code-block", "Code block & Kbd"], ["empty", "Empty state"], ["skeleton", "Skeleton"], ["scroll-area", "Scroll area & resizable"],
      ["marker", "Marker"], ["direction", "Direction · RTL"],
    ],
  },
  {
    title: "Overlays & menus",
    sections: [
      ["alert", "Alert · Banner"], ["alert-dialog", "Alert dialog"], ["popover", "Popover & hover card"], ["context-menu", "Context menu & menubar"],
      ["navigation-menu", "Navigation menu"], ["command", "Command palette"], ["combobox", "Combobox"], ["toast", "Toast"],
    ],
  },
  {
    title: "Data",
    sections: [["data-table", "Data table"], ["table", "Table"], ["pagination", "Pagination"], ["chart", "Charts"], ["calendar", "Calendar"], ["trace", "Trace"]],
  },
  {
    title: "Forms, chat & shell",
    sections: [
      ["field", "Field & label"], ["input-group", "Input group"], ["input-otp", "Input OTP"], ["questionnaire", "Questionnaire"],
      ["attachment", "Attachment"], ["message", "Message & bubble"], ["message-scroller", "Message scroller"], ["sidebar", "Sidebar"],
    ],
  },
]

export const SECTION_TITLES = Object.fromEntries(GROUPS.flatMap((g) => g.sections)) as Record<string, string>
