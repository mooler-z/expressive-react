import * as React from "react"
import { Link } from "react-router"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import { Shape } from "@/components/ui/shape"
import { useTheme } from "@/components/ui/theme-provider"
import type { SiteSection } from "@/docs/site/site-layout"
import { SITE_BOTTOM_NAV, SITE_LINKS, SITE_NAV } from "@/docs/site/site-nav"
import { SiteSearch } from "@/docs/site/site-search"
import { ThemeMenu } from "@/docs/site/theme-menu"
import { cn } from "@/lib/utils"

/*
 * Site header · design-reference/site/SiteHeader.dc.html
 * 64dp pinned bar: surface at rest → surface-container once content scrolls under it (300ms emphasized).
 * Logo · primary nav (md+) · search (pill at xl, icon below) · theme menu · dark toggle · GitHub (sm+).
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

/** `responsive` hides the wordmark at medium widths (600–839), where the header nav needs the room. */
export function SiteLogo({ className, responsive }: { className?: string; responsive?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="Expressive React home"
      className={cn("state-layer focus-ring flex h-12 shrink-0 items-center gap-2 rounded-full pr-3 pl-2", className)}
    >
      <Shape shape="clover4" cycle={["clover4", "cookie7", "sunny"]} interval={3400} hoverShape="burst" className="size-8 text-primary" />
      <span className={cn("text-title-md font-semibold tracking-tight", responsive && "md:max-lg:hidden")}>
        Expressive<span className="font-normal text-on-surface-variant"> React</span>
      </span>
    </Link>
  )
}

export function SiteHeader({ active }: { active: SiteSection }) {
  const scrolled = useScrolled()
  const { resolvedMode, setMode } = useTheme()
  const dark = resolvedMode === "dark"

  return (
    <header
      data-slot="site-header"
      data-scrolled={scrolled || undefined}
      data-spec="Top app bar|Surface at rest → surface-container once content scrolls under it. 300ms emphasized color crossfade. Pinned at 64dp."
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-1 px-2 text-on-surface transition-colors duration-300 ease-emphasized md:px-4",
        scrolled ? "bg-surface-container" : "bg-surface",
      )}
    >
      <SiteLogo responsive />
      <nav aria-label="Primary" className="ml-1 hidden items-center gap-0.5 md:flex">
        {SITE_NAV.map((n) => (
          <Link
            key={n.id}
            to={n.href}
            aria-current={n.id === active ? "page" : undefined}
            className={cn(
              "state-layer focus-ring inline-flex h-10 shrink-0 items-center rounded-full px-3 text-label-lg shape-morph active:rounded-md md:max-lg:px-2.5 xl:px-4",
              n.id === active ? "bg-secondary-container text-on-secondary-container" : "text-on-surface-variant",
            )}
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-0.5">
        <SiteSearch />
        <ThemeMenu />
        <IconButton aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} size="md" width="narrow" onPress={() => setMode(dark ? "light" : "dark")}>
          <Icon>{dark ? "light_mode" : "dark_mode"}</Icon>
        </IconButton>
        <a
          href={SITE_LINKS.github}
          target="_blank"
          rel="noreferrer"
          className="state-layer focus-ring ml-1 hidden h-10 items-center gap-2 rounded-full border border-outline-variant px-4 text-label-lg text-on-surface-variant xl:inline-flex"
        >
          GitHub
          <Icon size={18}>open_in_new</Icon>
        </a>
      </div>
    </header>
  )
}

/** Compact-width primary navigation (below 600dp), replacing the header nav. */
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
