import * as React from "react"
import { Link } from "react-router"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import { useTheme } from "@/components/ui/theme-provider"
import { LogoMark } from "@/docs/site/logo"
import type { SiteSection } from "@/docs/site/site-layout"
import { SITE_BOTTOM_NAV } from "@/docs/site/site-nav"
import { SiteSearch } from "@/docs/site/site-search"
import { ThemeMenu } from "@/docs/site/theme-menu"
import { cn } from "@/lib/utils"

/*
 * Site header · design-reference/site/SiteHeader.dc.html, compact widths only (below 600dp).
 * From 600dp the navigation rail (site-rail.tsx) takes over, like m3.material.io.
 * 64dp pinned bar: surface at rest → surface-container once content scrolls under it (300ms emphasized).
 * Logo · search · theme menu · dark toggle. It also hosts the ⌘K dialog for every width.
 */

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])
  return scrolled
}

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Expressive React home"
      className={cn("group state-layer focus-ring flex h-12 shrink-0 items-center gap-2 rounded-full pr-3 pl-2", className)}
    >
      <LogoMark className="size-8" />
      <span className="text-title-md font-semibold tracking-tight">
        Expressive<span className="font-normal text-on-surface-variant"> React</span>
      </span>
    </Link>
  )
}

export function SiteHeader() {
  const scrolled = useScrolled()
  const { resolvedMode, setMode } = useTheme()
  const dark = resolvedMode === "dark"

  return (
    <header
      data-slot="site-header"
      data-scrolled={scrolled || undefined}
      data-spec="Top app bar|Surface at rest → surface-container once content scrolls under it. 300ms emphasized color crossfade. Pinned at 64dp."
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-1 px-2 text-on-surface transition-colors duration-300 ease-emphasized md:hidden",
        scrolled ? "bg-surface-container" : "bg-surface",
      )}
    >
      <SiteLogo />
      <div className="ml-auto flex items-center gap-0.5">
        <SiteSearch />
        <ThemeMenu />
        <IconButton aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} size="md" width="narrow" onPress={() => setMode(dark ? "light" : "dark")}>
          <Icon>{dark ? "light_mode" : "dark_mode"}</Icon>
        </IconButton>
      </div>
    </header>
  )
}

/** Compact-width primary navigation (below 600dp); the rail replaces it from 600dp. */
export function SiteBottomNav({ active }: { active: SiteSection }) {
  const current = active === "components" || active === "charts" || active === "tokens" ? "docs" : active
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 bg-surface-container pb-[env(safe-area-inset-bottom)] md:hidden"
      data-spec="Navigation bar · compact|Shown under 600dp instead of the top nav. Active indicator 56×32 pill in secondary-container grows on the FastSpatial spring; icon FILL 0→1 and label weight 500→600."
    >
      <NavigationBar aria-label="Primary" value={current}>
        {SITE_BOTTOM_NAV.map((n) => (
          <NavigationBarItem key={n.id} value={n.id} icon={n.icon} label={n.label} href={n.href} isActive={n.id === current} />
        ))}
      </NavigationBar>
    </div>
  )
}
