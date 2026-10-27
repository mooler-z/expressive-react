"use client"

import * as React from "react"
import { Link as AriaLink } from "react-aria-components"

import { LandingAbout } from "@/components/blocks/landing/landing-about"
import { LandingChangelog } from "@/components/blocks/landing/landing-changelog"
import { LandingContact } from "@/components/blocks/landing/landing-contact"
import { LandingFeatures } from "@/components/blocks/landing/landing-features"
import { LandingHome } from "@/components/blocks/landing/landing-home"
import { LandingPricing } from "@/components/blocks/landing/landing-pricing"
import {
  Brand,
  BrandMark,
  LANDING_NAV,
  LANDING_PAGES,
  LANDING_TITLES,
  LandingContext,
  PageButtonLink,
  PageLink,
  useLanding,
  type LandingLinks,
  type LandingPage,
} from "@/components/blocks/landing/landing-shared"
import { TopAppBar } from "@/components/ui/app-bar"
import { Button } from "@/components/ui/button"
import { fabVariants } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { IconButton, iconButtonVariants } from "@/components/ui/icon-button"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import {
  NavigationRail,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailMenuButton,
  useNavigationRail,
} from "@/components/ui/navigation-rail"
import { Ripple } from "@/components/ui/ripple"
import { snackbar } from "@/components/ui/snackbar"
import { useTheme } from "@/components/ui/theme-provider"
import { useWindowSizeAtLeast } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"

/*
 * Landing · a six-page marketing site (Home, Features, Pricing, About, Changelog, Contact).
 *
 * Adaptive chrome per M3 window size classes:
 *   compact   top app bar + navigation bar + FAB
 *   medium+   navigation rail (96dp) beside a rounded body pane on surface-container
 *   large+    the rail starts expanded (264dp, extended FAB); the menu button toggles it
 *
 * Routing is yours: pass `page` and `getHref` from your router and wrap the app in react-aria's
 * <RouterProvider navigate={…}> for client-side links. With neither, it runs on `#hash` links.
 */

export type { LandingLinks, LandingPage }

export interface LandingProps {
  /** Current page. Omit to let the block follow `location.hash` (#pricing …). */
  page?: LandingPage
  /** Href for a page. Defaults to `#<page>`. */
  getHref?: (page: LandingPage) => string
  /** Links that leave the site: component kit, dashboard template. */
  links?: LandingLinks
  className?: string
}

function pageFromHash(): LandingPage {
  const id = (typeof window === "undefined" ? "" : window.location.hash.slice(1).split("?")[0]) as LandingPage
  return LANDING_PAGES.includes(id) ? id : "home"
}

/** Hash-driven page state, used only when no `page` prop is passed. */
function useHashPage(enabled: boolean) {
  const [page, setPage] = React.useState<LandingPage>(() => (enabled ? pageFromHash() : "home"))
  React.useEffect(() => {
    if (!enabled) return
    const sync = () => setPage(pageFromHash())
    sync()
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [enabled])
  return page
}

const PAGES: Record<LandingPage, React.ComponentType> = {
  home: LandingHome,
  features: LandingFeatures,
  pricing: LandingPricing,
  about: LandingAbout,
  changelog: LandingChangelog,
  contact: LandingContact,
}

export function Landing({ page: pageProp, getHref, links = {}, className }: LandingProps) {
  const hashPage = useHashPage(pageProp === undefined)
  const page = pageProp ?? hashPage
  const href = React.useCallback((p: LandingPage) => (getHref ? getHref(p) : `#${p}`), [getHref])
  const ctx = React.useMemo(() => ({ page, href, links }), [page, href, links])

  const medium = useWindowSizeAtLeast("medium")
  const large = useWindowSizeAtLeast("large")
  const [railPref, setRailPref] = React.useState<boolean | null>(null)
  const railExpanded = medium && (railPref ?? large)

  // The body pane scrolls on medium+ windows, the window scrolls on compact ones: watch both.
  const paneRef = React.useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const pane = paneRef.current
    const read = () => setScrolled((pane?.scrollTop ?? 0) > 8 || window.scrollY > 8)
    pane?.addEventListener("scroll", read, { passive: true })
    window.addEventListener("scroll", read, { passive: true })
    return () => {
      pane?.removeEventListener("scroll", read)
      window.removeEventListener("scroll", read)
    }
  }, [])

  // A new page starts at the top.
  React.useEffect(() => {
    paneRef.current?.scrollTo({ top: 0 })
    window.scrollTo({ top: 0 })
    setScrolled(false)
  }, [page])

  const Page = PAGES[page]

  return (
    <LandingContext.Provider value={ctx}>
      <div
        data-slot="landing"
        className={cn(
          "flex min-h-dvh bg-surface font-sans text-on-surface md:h-dvh md:overflow-hidden md:bg-surface-container",
          className,
        )}
      >
        <NavigationRail
          aria-label="Primary"
          value={page}
          expanded={railExpanded}
          onExpandedChange={setRailPref}
          surface="transparent"
          className={cn("hidden pb-6 md:flex", railExpanded && "w-[264px]")}
        >
          <RailHeader />
          {LANDING_NAV.map((n) => (
            <NavigationRailItem key={n.id} value={n.id} icon={n.icon} label={n.label} href={href(n.id)} />
          ))}
        </NavigationRail>

        <div className="flex min-w-0 flex-1 flex-col md:py-3 md:pr-3">
          <div ref={paneRef} className="relative min-h-0 flex-1 bg-surface pb-16 md:overflow-y-auto md:rounded-xl md:pb-0">
            <TopAppBar
              scrolled={scrolled}
              className="z-40"
              rowClassName="px-2 md:px-4"
              navigation={!railExpanded && <Brand />}
              title={
                <span
                  className={cn(
                    "transition-opacity duration-(--md-spring-default-effects-duration)",
                    scrolled && page !== "home" ? "opacity-100" : "opacity-0",
                  )}
                >
                  {LANDING_TITLES[page]}
                </span>
              }
              actions={<BarActions />}
            />

            <main
              key={page}
              className="origin-top animate-[m3-landing-page-in_450ms_cubic-bezier(0.05,0.7,0.1,1)] motion-reduce:animate-none"
            >
              <Page />
            </main>

            <LandingFooter />
          </div>
        </div>

        {/* Compact: FAB + navigation bar */}
        <AriaLink
          href={href("contact")}
          aria-label="Book a demo"
          className={cn(fabVariants({ size: "base" }), "fixed right-4 bottom-20 z-40 md:hidden")}
        >
          <Icon>calendar_month</Icon>
          <Ripple />
        </AriaLink>
        <NavigationBar aria-label="Primary" value={page} className="fixed inset-x-0 bottom-0 z-40 md:hidden">
          {LANDING_NAV.map((n) => (
            <NavigationBarItem key={n.id} value={n.id} icon={n.icon} label={n.label} href={href(n.id)} />
          ))}
        </NavigationBar>
      </div>
    </LandingContext.Provider>
  )
}

/** Rail top: menu button (+ brand when expanded) and the Book-a-demo FAB, extended when expanded. */
function RailHeader() {
  const { expanded } = useNavigationRail()
  const { href } = useLanding()
  return (
    <NavigationRailHeader className={expanded ? "pb-6" : "pb-8"}>
      {expanded ? (
        <div className="flex h-14 items-center gap-1">
          <NavigationRailMenuButton />
          <Brand />
        </div>
      ) : (
        <NavigationRailMenuButton />
      )}
      <AriaLink
        href={href("contact")}
        aria-label={expanded ? undefined : "Book a demo"}
        className={cn(
          "state-layer focus-ring shape-morph relative inline-flex h-14 shrink-0 items-center rounded-[16px] bg-primary-container text-label-lg text-on-primary-container outline-none",
          "shadow-1 data-hovered:shadow-2 data-pressed:rounded-[12px]",
          expanded ? "mt-2 gap-3 pr-5 pl-4" : "mt-1 w-14 justify-center",
        )}
      >
        <Icon>calendar_month</Icon>
        {expanded && "Book a demo"}
        <Ripple />
      </AriaLink>
    </NavigationRailHeader>
  )
}

function BarActions() {
  const { links } = useLanding()
  const { resolvedMode, setMode } = useTheme()
  const dark = resolvedMode === "dark"
  return (
    <div className="flex items-center gap-1">
      {links.kit && (
        <AriaLink href={links.kit} aria-label="Component kit" className={iconButtonVariants({ size: "md", width: "narrow", className: "hidden size-12 sm:inline-flex" })}>
          <Icon>widgets</Icon>
          <Ripple />
        </AriaLink>
      )}
      <IconButton aria-label={dark ? "Light mode" : "Dark mode"} className="size-12" onPress={() => setMode(dark ? "light" : "dark")}>
        <Icon>{dark ? "light_mode" : "dark_mode"}</Icon>
      </IconButton>
      <Button
        variant="text"
        className="hidden sm:inline-flex"
        onPress={() =>
          snackbar("Sign-in is part of the dashboard template", {
            action: links.dashboard ? { label: "Open", onAction: () => window.location.assign(links.dashboard!) } : undefined,
          })
        }
      >
        Sign in
      </Button>
      <PageButtonLink to="pricing">Start free</PageButtonLink>
    </div>
  )
}

const footerLink = "rounded-xs outline-none focus-ring data-hovered:text-primary"

function LandingFooter() {
  const { links } = useLanding()
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-container-low">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <PageLink to="home" className="flex w-fit items-center gap-2 rounded-full outline-none focus-ring">
            <BrandMark />
            <span className="text-title-md font-semibold">Kestrel</span>
          </PageLink>
          <p className="mt-4 max-w-xs text-body-md text-on-surface-variant">
            The enterprise control plane. Built in Stockholm, Berlin and Austin.
          </p>
          <div className="mt-5 flex gap-1">
            {[
              ["code", "GitHub", "github.com/kestrel"],
              ["work", "LinkedIn", "linkedin.com/company/kestrel"],
              ["rss_feed", "RSS", "kestrel.io/changelog.xml"],
            ].map(([icon, label, url]) => (
              <IconButton key={label} aria-label={label} onPress={() => snackbar(url)}>
                <Icon size={20}>{icon}</Icon>
              </IconButton>
            ))}
          </div>
        </div>
        <FooterColumn title="Product">
          <PageLink to="features" className={footerLink}>Features</PageLink>
          <PageLink to="pricing" className={footerLink}>Pricing</PageLink>
          <PageLink to="changelog" className={footerLink}>Changelog</PageLink>
          {links.dashboard && <AriaLink href={links.dashboard} className={footerLink}>Dashboard template</AriaLink>}
        </FooterColumn>
        <FooterColumn title="Company">
          <PageLink to="about" className={footerLink}>About</PageLink>
          <PageLink to="contact" className={footerLink}>Contact</PageLink>
          <PageLink to="about" className={footerLink}>Careers</PageLink>
        </FooterColumn>
        <FooterColumn title="Resources">
          {links.kit && <AriaLink href={links.kit} className={footerLink}>M3 Expressive kit</AriaLink>}
          <AriaLink href="https://m3.material.io" target="_blank" rel="noreferrer" className={footerLink}>
            Material 3
          </AriaLink>
          <PageLink to="contact" className={footerLink}>Status</PageLink>
        </FooterColumn>
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-outline-variant/60 px-4 py-6 text-body-sm text-on-surface-variant md:px-8">
        <span>© 2026 Kestrel Systems AB</span>
        <span className="flex gap-4">
          {["Privacy", "Terms", "Security"].map((l) => (
            <PageLink key={l} to="home" className={footerLink}>
              {l}
            </PageLink>
          ))}
        </span>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-title-sm">{title}</div>
      <ul className="mt-3 space-y-2 text-body-md text-on-surface-variant">
        {React.Children.toArray(children)
          .filter(Boolean)
          .map((child, i) => (
            <li key={i}>{child}</li>
          ))}
      </ul>
    </div>
  )
}
