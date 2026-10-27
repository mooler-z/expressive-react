// Blocks gallery data: design-reference/site/Blocks.dc.html categories, filled from registry/*.json.
// Every registry:block appears in exactly one category, except helper modules (HELPERS).

export interface RegistryFile {
  path: string
  type: string
}

export interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  categories?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
}

const registry = import.meta.glob<RegistryItem>("/registry/*.json", { eager: true, import: "default" })

export const REGISTRY: Record<string, RegistryItem> = Object.fromEntries(
  Object.values(registry).map((item) => [item.name, item]),
)

export const REGISTRY_BLOCKS = Object.values(REGISTRY).filter((i) => i.type === "registry:block")

export type BlockCategory = "templates" | "marketing" | "dashboard" | "layouts" | "auth" | "settings" | "shell" | "data" | "people"

export const CATEGORIES: { id: BlockCategory; label: string; description: string }[] = [
  { id: "templates", label: "Templates", description: "Full products, ready to fork. Every page is live below; frames scroll and navigate." },
  { id: "marketing", label: "Marketing", description: "Hero, features, pricing, CTA, about, contact and changelog sections, plus ten complete one-page landings." },
  { id: "dashboard", label: "Dashboard", description: "KPI cards, chart galleries and every chart state (loading, empty, error, stale, offline)." },
  { id: "layouts", label: "Layouts", description: "M3 canonical layouts: list-detail, supporting pane, feed, pane layout and the adaptive scaffold." },
  { id: "auth", label: "Auth", description: "Login, signup, reset, two-factor and verify. Three takes on each." },
  { id: "settings", label: "Settings", description: "Profile, members, notifications and integrations pages." },
  { id: "shell", label: "Shell", description: "App shells and sidebars with adaptive navigation." },
  { id: "data", label: "Data", description: "Dashboards, data tables, stat rows and chart cards." },
  { id: "people", label: "People", description: "Invite user, user profile and member list." },
]

/** Shared code other blocks install as a dependency; not a block on its own. */
export const HELPERS = ["marketing-shared", "dashboard-kit-core"]

const LANDING_VARIANTS = [
  "landing-orbit", "landing-bento", "landing-terminal", "landing-editorial", "landing-split",
  "landing-marquee", "landing-global", "landing-steps", "landing-calculator", "landing-playful",
]

const LAYOUT_BLOCKS = ["adaptive-scaffold", "list-detail-layout", "supporting-pane-layout", "feed-layout", "pane-layout", "incidents-app"]

const triple = (...prefixes: string[]) => prefixes.flatMap((p) => [1, 2, 3].map((n) => `${p}-${n}`))

/** Registry blocks per category, in display order. */
const ORDER: Record<Exclude<BlockCategory, "templates">, string[]> = {
  marketing: [
    "marketing-hero-showcase", "marketing-problem-cards", "marketing-proof-bento", "marketing-feature-previews",
    "marketing-feature-rows", "marketing-feature-list-detail", "marketing-pricing", "marketing-about",
    "marketing-contact", "marketing-changelog", "marketing-cta-banner", ...LANDING_VARIANTS,
  ],
  dashboard: [
    "kpi-cards", "interactive-chart-cards", "trend-charts", "comparison-charts", "composition-charts",
    "relationship-charts", "dashboard-viz", "dashboard-data-display", "chart-states",
  ],
  layouts: LAYOUT_BLOCKS,
  auth: triple("login", "signup", "reset", "two-factor", "verify"),
  settings: triple("profile-settings", "members-settings", "notifications", "integrations"),
  shell: triple("app-shell", "sidebar-block"),
  data: triple("dashboard", "data-table-block", "stats", "chart-card"),
  people: triple("invite-user", "user-profile", "member-list"),
}

export interface GalleryEntry {
  /** Anchor id, and the registry name when the entry is one item. */
  id: string
  title: string
  description: string
  category: BlockCategory
  /** What the frame loads. */
  previewHref: string
  /** Registry items `npx shadcn add` installs. */
  install: string[]
  files: RegistryFile[]
  registryDependencies: string[]
}

function fromItems(id: string, category: BlockCategory, previewHref: string, names: string[], title?: string, description?: string): GalleryEntry {
  const items = names.map((n) => REGISTRY[n]).filter(Boolean)
  const first = items[0]
  const files = items.flatMap((i) => i.files ?? []).filter((f, i, all) => all.findIndex((g) => g.path === f.path) === i)
  const own = new Set(names.map((n) => `@expressive/${n}`))
  const deps = [...new Set(items.flatMap((i) => i.registryDependencies ?? []))].filter((d) => !own.has(d)).sort()
  return {
    id,
    title: title ?? first?.title ?? id,
    description: description ?? first?.description ?? "",
    category,
    previewHref,
    install: names,
    files,
    registryDependencies: deps,
  }
}

const TEMPLATES: GalleryEntry[] = [
  fromItems("landing", "templates", "/landing", ["landing"]),
  fromItems("landing-v1", "templates", "/landing-v1", ["landing-v1"]),
  fromItems("landing-v3", "templates", "/landing-v3", ["landing-v3"]),
  fromItems(
    "landing-variants",
    "templates",
    "/landing-variants",
    LANDING_VARIANTS,
    "Landing variants",
    "Ten hero and section treatments on the same content, for picking a direction fast. Use the switcher at the bottom of the frame.",
  ),
  fromItems("admin-dashboard", "templates", "/admin", ["admin-dashboard"]),
  fromItems("dashboard-kit", "templates", "/dashboard-kit", ["dashboard-kit"]),
  fromItems(
    "layouts",
    "templates",
    "/layouts",
    LAYOUT_BLOCKS,
    "Layouts",
    "Window size classes, the canonical layouts, panes, app shells and page templates, with a live adaptive app.",
  ),
]

export const ENTRIES: GalleryEntry[] = [
  ...TEMPLATES,
  ...(Object.entries(ORDER) as [BlockCategory, string[]][]).flatMap(([category, names]) =>
    names.map((name) => fromItems(name, category, `/blocks/view/${name}`, [name])),
  ),
]

/** Registry blocks that are neither shown nor a known helper (should be empty). */
export const UNMAPPED = REGISTRY_BLOCKS.map((b) => b.name).filter(
  (n) => !HELPERS.includes(n) && !ENTRIES.some((e) => e.install.length === 1 && e.install[0] === n),
)

/** Every registry name that /blocks/view/:name can render (all blocks, helpers included). */
export const VIEWABLE = REGISTRY_BLOCKS.map((b) => b.name)

export function installCommand(names: string[]) {
  return `npx shadcn add ${names.map((n) => `@expressive/${n}`).join(" ")}`
}
