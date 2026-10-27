import * as React from "react"
import type { Placement } from "react-aria-components"
import { useLocation } from "react-router"

import { Icon } from "@/components/ui/icon"
import { IconButton, ToggleIconButton } from "@/components/ui/icon-button"
import {
  NavigationDrawer,
  NavigationDrawerDivider,
  NavigationDrawerGroup,
  NavigationDrawerItem,
} from "@/components/ui/navigation-drawer"
import { NavigationRail, NavigationRailFab, NavigationRailHeader, NavigationRailItem, NavigationRailSpacer } from "@/components/ui/navigation-rail"
import { Shape } from "@/components/ui/shape"
import { useTheme } from "@/components/ui/theme-provider"
import { CATEGORIES, ENTRIES } from "@/docs/site/blocks-gallery/catalog"
import type { SiteSection } from "@/docs/site/site-layout"
import { DOCS_GROUPS, SITE_LINKS, docsHref } from "@/docs/site/site-nav"
import { openSiteSearch } from "@/docs/site/site-search"
import { setSpecsOn, useSpecsOn } from "@/docs/site/specs-overlay"
import { ThemeMenu } from "@/docs/site/theme-menu"
import { cn } from "@/lib/utils"

/*
 * Site navigation rail (600dp and up), after m3.material.io: search FAB, seven destinations,
 * theme controls at the bottom. Destinations with sub-pages open a flyout drawer beside the rail
 * on hover or keyboard focus; Tab continues into it, Esc closes it. Below 600dp the site keeps the
 * top app bar + bottom navigation bar (M3's compact pattern).
 */

export type RailId = "home" | "start" | "foundations" | "themes" | "components" | "blocks" | "charts"

interface FlyoutLink {
  label: string
  href: string
  badge?: number
}

export interface RailDestination {
  id: RailId
  label: string
  icon: string | "logo"
  href: string
  /** Flyout items, then collapsible groups, then `more` under a divider. */
  links?: FlyoutLink[]
  groups?: { title: string; links: FlyoutLink[] }[]
  more?: FlyoutLink[]
}

const toLinks = (items: [string, string, boolean?][]) => items.map(([id, label]) => ({ label, href: docsHref(id) }))
const group = (section: string) => DOCS_GROUPS.filter((g) => g.section === section)

export const RAIL: RailDestination[] = [
  { id: "home", label: "Home", icon: "logo", href: "/" },
  { id: "start", label: "Get started", icon: "apps", href: "/docs", links: group("start").flatMap((g) => toLinks(g.items)) },
  {
    id: "foundations",
    label: "Foundations",
    icon: "book",
    href: "/tokens",
    links: [{ label: "Design tokens", href: "/tokens" }, ...group("foundations").flatMap((g) => toLinks(g.items))],
    more: [
      { label: "Motion annotations", href: "/annotations" },
      { label: "Review board", href: "/review" },
    ],
  },
  { id: "themes", label: "Themes", icon: "palette", href: "/themes" },
  {
    id: "components",
    label: "Components",
    icon: "add_circle",
    href: "/docs/button",
    groups: [...group("components"), ...group("hooks")].map((g) => ({ title: g.name, links: toLinks(g.items) })),
  },
  {
    id: "blocks",
    label: "Blocks",
    icon: "view_quilt",
    href: "/blocks",
    links: CATEGORIES.map((c) => ({
      label: c.label,
      href: c.id === "templates" ? "/blocks" : `/blocks?cat=${c.id}`,
      badge: ENTRIES.filter((e) => e.category === c.id).length,
    })),
    groups: [
      {
        title: "Original kit",
        links: [
          { label: "Components", href: "/kit" },
          { label: "Shell", href: "/kit/blocks/shell" },
          { label: "Data", href: "/kit/blocks/data" },
          { label: "Auth", href: "/kit/blocks/auth" },
          { label: "Settings", href: "/kit/blocks/settings" },
          { label: "People", href: "/kit/blocks/people" },
        ],
      },
    ],
  },
  { id: "charts", label: "Charts", icon: "bar_chart", href: "/docs/chart" },
]

const hasFlyout = (d: RailDestination) => !!(d.links?.length || d.groups?.length)

export function railIdFor(active: SiteSection, pathname: string): RailId {
  if (pathname === "/docs/chart") return "charts"
  const map: Record<SiteSection, RailId> = {
    home: "home",
    docs: "start",
    components: "components",
    blocks: "blocks",
    themes: "themes",
    charts: "charts",
    tokens: "foundations",
  }
  return map[active]
}

/** The flyout link matching the current URL; the most specific one wins (/tokens#shape over /tokens). */
function useActiveHref(dest: RailDestination) {
  const { pathname, search, hash } = useLocation()
  const all = [...(dest.links ?? []), ...(dest.groups ?? []).flatMap((g) => g.links), ...(dest.more ?? [])]
  let best: string | undefined
  for (const { href } of all) {
    const u = new URL(href, "https://x")
    if (u.pathname === pathname && u.search === search && (!u.hash || u.hash === hash) && href.length > (best?.length ?? 0)) best = href
  }
  return best
}

/** A destination's sub-pages as navigation-drawer items. `docked` (the Docs sidebar) opens every group. */
export function RailFlyoutContent({ dest, docked, className }: { dest: RailDestination; docked?: boolean; className?: string }) {
  const active = useActiveHref(dest)
  const item = (l: FlyoutLink) => (
    <NavigationDrawerItem key={l.href} href={l.href} isActive={l.href === active} badge={l.badge}>
      {l.label}
    </NavigationDrawerItem>
  )
  return (
    <NavigationDrawer variant="plain" dense aria-label={dest.label} className={className ?? "max-w-none p-0"}>
      {dest.links?.map(item)}
      {dest.groups?.map((g) => (
        <NavigationDrawerGroup key={g.title} title={g.title} defaultExpanded={docked || g.links.some((l) => l.href === active)}>
          {g.links.map(item)}
        </NavigationDrawerGroup>
      ))}
      {dest.more && (
        <>
          <NavigationDrawerDivider />
          {dest.more.map(item)}
        </>
      )}
    </NavigationDrawer>
  )
}

const GITHUB_MARK =
  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"

/** `specs`: show the Specs overlay toggle (pages that hide the overlay pass false). */
export function SiteRail({ active, specs = true }: { active: SiteSection; specs?: boolean }) {
  const location = useLocation()
  const current = railIdFor(active, location.pathname)
  const [open, setOpen] = React.useState<RailId | null>(null)
  const timer = React.useRef<number | undefined>(undefined)
  // Esc hands focus back to the rail item; that focus mustn't reopen the flyout.
  const refocusing = React.useRef(false)
  const { resolvedMode, setMode } = useTheme()
  const dark = resolvedMode === "dark"
  const specsOn = useSpecsOn()

  const schedule = (next: RailId | null, delay: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(next), delay)
  }
  React.useEffect(() => () => window.clearTimeout(timer.current), [])
  // A destination was chosen: put the flyout away.
  React.useEffect(() => {
    window.clearTimeout(timer.current)
    setOpen(null)
  }, [location.pathname, location.search, location.hash])

  return (
    <div
      className={cn("fixed inset-y-0 start-0 hidden md:block", open ? "z-[96]" : "z-50")}
      onPointerOver={(e) => {
        if (e.pointerType === "touch") return
        const t = e.target as Element
        if (t.closest("[data-rail-flyout]")) return window.clearTimeout(timer.current)
        const id = t.closest<HTMLElement>("[data-rail-dest]")?.dataset.railDest as RailId | undefined
        const dest = RAIL.find((d) => d.id === id)
        if (dest && hasFlyout(dest)) schedule(dest.id, open ? 0 : 80)
        else schedule(null, 200)
      }}
      onPointerLeave={(e) => e.pointerType !== "touch" && schedule(null, 250)}
      data-spec="Navigation rail|96dp collapsed rail on surface-container. Hover or focus a destination with sub-pages and its drawer flies out beside the rail (fade + 12dp slide on the FastSpatial spring); Esc closes it."
    >
      <NavigationRail aria-label="Primary" surface="container" value={current} className="h-dvh">
        <NavigationRailHeader className="pb-6">
          <NavigationRailFab icon="search" label="Search (⌘K)" tone="secondary" onPress={openSiteSearch} />
        </NavigationRailHeader>

        {RAIL.map((d) => (
          <div
            key={d.id}
            data-rail-dest={d.id}
            className="w-full"
            onFocus={(e) => {
              const t = e.target as HTMLElement
              if (refocusing.current) return void (refocusing.current = false)
              if (hasFlyout(d) && t.dataset.slot === "navigation-rail-item" && t.matches(":focus-visible")) {
                window.clearTimeout(timer.current)
                setOpen(d.id)
              }
            }}
            onBlur={(e) => {
              if (open === d.id && !e.currentTarget.contains(e.relatedTarget as Node | null)) schedule(null, 0)
            }}
            onKeyDown={(e) => {
              if (e.key !== "Escape" || open !== d.id) return
              e.stopPropagation()
              setOpen(null)
              refocusing.current = true
              e.currentTarget.querySelector<HTMLElement>("[data-slot=navigation-rail-item]")?.focus()
            }}
          >
            <NavigationRailItem
              value={d.id}
              href={d.href}
              label={d.label}
              icon={d.icon === "logo" ? <Shape shape="clover4" hoverShape="sunny" className="size-6 text-primary" /> : d.icon}
            />
            {open === d.id && (
              <div
                data-rail-flyout
                className={[
                  "fixed inset-y-0 start-24 w-[min(300px,calc(100vw-6rem))] overflow-y-auto overscroll-contain border-s border-outline-variant/60",
                  "rounded-e-xl bg-surface-container px-3 pt-4 pb-10 shadow-2 no-scrollbar",
                  "transition-[opacity,translate] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial starting:-translate-x-3 starting:opacity-0 motion-reduce:transition-none",
                ].join(" ")}
              >
                <RailFlyoutContent dest={d} />
              </div>
            )}
          </div>
        ))}

        <NavigationRailSpacer />
        <div className="flex flex-col items-center gap-2 pt-4 pb-1">
          {specs && (
            <ToggleIconButton aria-label="Interaction specs" variant="outlined" size="sm" isSelected={specsOn} onChange={setSpecsOn}>
              <Icon>square_foot</Icon>
            </ToggleIconButton>
          )}
          <ThemeMenu placement={"end bottom" satisfies Placement} appearance="rail" />
          <IconButton
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            variant="outlined"
            size="sm"
            onPress={() => setMode(dark ? "light" : "dark")}
          >
            <Icon>{dark ? "light_mode" : "dark_mode"}</Icon>
          </IconButton>
          <a
            href={SITE_LINKS.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="state-layer focus-ring inline-flex size-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant"
          >
            <svg viewBox="0 0 16 16" aria-hidden className="size-5 fill-current">
              <path d={GITHUB_MARK} />
            </svg>
          </a>
        </div>
      </NavigationRail>
    </div>
  )
}
