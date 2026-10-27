import * as React from "react"
import { Button as AriaButton } from "react-aria-components"
import { useNavigate } from "react-router"

import { CommandDialog, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Kbd } from "@/components/ui/kbd"
import { blockHref, DOCS_GROUPS, docsHref } from "@/docs/site/site-nav"

/*
 * ⌘K search · design-reference/site/SiteHeader.dc.html (#er-cmd)
 * Indexes the site pages, every docs page (getting started, foundations, components, hooks) and every registry block.
 */

type RegistryItem = { name: string; type: string; title?: string; description?: string; categories?: string[] }
const registry = Object.values(import.meta.glob<RegistryItem>("/registry/*.json", { eager: true, import: "default" }))
const blocks = registry.filter((i) => i.type === "registry:block").sort((a, b) => a.name.localeCompare(b.name))

type Entry = { id: string; label: string; href: string; icon: string; hint?: string }
type Group = { name: string; items: Entry[] }

const COMPONENT_ICONS: Record<string, string> = {
  button: "smart_button", switch: "toggle_on", slider: "tune", fab: "add_circle", chip: "label", "loading-indicator": "progress_activity",
  "navigation-bar": "bottom_navigation", "text-field": "text_fields", "date-picker": "calendar_month", "data-table": "table_chart",
  chart: "bar_chart", dialog: "open_in_full", menu: "menu_open", tabs: "tab", card: "web_asset", list: "list", checkbox: "check_box",
  radio: "radio_button_checked", progress: "linear_scale", snackbar: "notifications_active", toast: "campaign", tooltip: "tooltip",
  search: "search", avatar: "account_circle", calendar: "calendar_today", "time-picker": "schedule", command: "keyboard_command_key",
}

const BLOCK_ICONS: Record<string, string> = {
  authentication: "login", settings: "settings", dashboard: "dashboard", marketing: "campaign", layout: "view_sidebar", people: "group",
}

function blockIcon(b: RegistryItem) {
  for (const c of b.categories ?? []) if (BLOCK_ICONS[c]) return BLOCK_ICONS[c]
  if (/^(login|signup|reset|two-factor|verify)/.test(b.name)) return "login"
  if (/settings|notifications|integrations/.test(b.name)) return "settings"
  if (/^(landing|marketing)/.test(b.name)) return "web"
  if (/dashboard|kpi|chart|stats/.test(b.name)) return "dashboard"
  if (/shell|sidebar|layout|scaffold|pane/.test(b.name)) return "view_sidebar"
  if (/user|member|invite/.test(b.name)) return "group"
  return "view_quilt"
}

const GROUPS: Group[] = [
  {
    name: "Pages",
    items: [
      ["home", "Home", "/"],
      ["menu_book", "Introduction", "/docs"],
      ["download", "Installation", "/docs/install"],
      ["view_quilt", "Blocks", "/blocks"],
      ["palette", "Theme builder", "/themes"],
      ["style", "Design tokens", "/tokens"],
      ["square_foot", "Motion annotations", "/annotations"],
      ["grid_view", "Review board", "/review"],
      ["widgets", "Kit · all components", "/kit"],
    ].map(([icon, label, href]) => ({ id: `page:${href}`, icon, label, href, hint: href })),
  },
  ...DOCS_GROUPS.map((g) => ({
    name: g.section === "components" ? `Components · ${g.name}` : g.name,
    items: g.items.map(([id, label]) => ({
      id: `${g.name}:${id}`,
      label,
      href: docsHref(id),
      icon:
        g.section === "start" ? "menu_book" : g.section === "foundations" ? "style" : g.section === "hooks" ? "webhook" : (COMPONENT_ICONS[id] ?? "widgets"),
      hint: g.section === "components" || g.section === "hooks" ? `@expressive/${id}` : undefined,
    })),
  })),
  {
    name: "Blocks",
    items: blocks.map((b) => ({ id: `block:${b.name}`, label: b.title ?? b.name, href: blockHref(b.name), icon: blockIcon(b), hint: `@expressive/${b.name}` })),
  },
]

const HREFS = new Map(GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.href] as const)))

/** Opens the site's ⌘K command palette. SiteSearch's CommandDialog owns the shortcut, so we press it. */
export function openSiteSearch() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))
}

export function SiteSearch() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  return (
    <>
      <AriaButton
        onPress={() => setOpen(true)}
        data-spec="Search · ⌘K|Opens the command palette: scrim fades in, the card rises on the emphasized-decelerate curve. Esc closes, ↑↓ moves the secondary-container highlight."
        className="state-layer focus-ring hidden h-10 cursor-pointer items-center gap-3 rounded-full bg-surface-container-high pr-2 pl-4 text-body-md text-on-surface-variant xl:inline-flex"
      >
        <Icon size={20}>search</Icon>
        Search docs…
        <Kbd size="sm">⌘K</Kbd>
      </AriaButton>
      <IconButton aria-label="Search" size="md" width="narrow" className="xl:hidden" onPress={() => setOpen(true)}>
        <Icon>search</Icon>
      </IconButton>

      <CommandDialog isOpen={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search components, blocks, docs…" aria-label="Search the site" />
        <CommandList
          aria-label="Search results"
          items={GROUPS}
          onAction={(key) => {
            const href = HREFS.get(String(key))
            setOpen(false)
            if (href) navigate(href)
          }}
          emptyState={
            <span className="flex flex-col items-center gap-2">
              <Icon size={32}>search_off</Icon>
              Nothing matches. Try “button” or “auth”.
            </span>
          }
        >
          {(group: Group) => (
            <CommandGroup id={group.name} title={group.name} items={group.items}>
              {(item: Entry) => (
                <CommandItem id={item.id} icon={item.icon} textValue={`${item.label} ${item.hint ?? ""}`} meta={item.hint}>
                  {item.label}
                </CommandItem>
              )}
            </CommandGroup>
          )}
        </CommandList>
        <CommandFooter>
          <span className="inline-flex items-center gap-1.5">
            <Kbd size="sm">↑</Kbd>
            <Kbd size="sm">↓</Kbd>
            move
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd size="sm">⏎</Kbd>
            open
          </span>
          <span className="ml-auto">{registry.length} installable items</span>
        </CommandFooter>
      </CommandDialog>
    </>
  )
}
