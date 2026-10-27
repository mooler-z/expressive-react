"use client"

import { DialogTrigger, Link } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { ModalNavigationDrawer, NavigationDrawerItem } from "@/components/ui/navigation-drawer"
import { useTheme } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"

import { AboutPage } from "./marketing-about"
import { ChangelogFeed } from "./marketing-changelog"
import { ContactSupportingPane } from "./marketing-contact"
import { CtaBanner } from "./marketing-cta-banner"
import { FeatureListDetail } from "./marketing-feature-list-detail"
import { HeroShowcase } from "./marketing-hero-showcase"
import { PricingSupportingPane } from "./marketing-pricing"
import { ProblemCards } from "./marketing-problem-cards"
import { ProofBento } from "./marketing-proof-bento"
import { BrandLogo, ButtonLink, LogoCloud, SiteFooter, useHashPage, useScrolled } from "./marketing-shared"

const PAGES = ["home", "features", "pricing", "about", "changelog", "contact"] as const
type Page = (typeof PAGES)[number]
const NAV: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "features", label: "Features", icon: "auto_awesome" },
  { id: "pricing", label: "Pricing", icon: "sell" },
  { id: "about", label: "About", icon: "groups" },
  { id: "changelog", label: "Changelog", icon: "campaign" },
  { id: "contact", label: "Contact", icon: "mail" },
]

/** Top app bar with primary-tab navigation; surface at rest, surface-container once scrolled. */
function TabAppBar({ page }: { page: Page }) {
  const scrolled = useScrolled(8)
  const { resolvedMode, setMode } = useTheme()
  const dark = resolvedMode === "dark"
  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300 ease-emphasized",
        scrolled ? "bg-surface-container" : "bg-surface",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-1 px-2 md:px-6">
        <DialogTrigger>
          <IconButton aria-label="Open navigation" size="md" width="narrow" className="text-on-surface lg:hidden">
            <Icon>menu</Icon>
          </IconButton>
          <ModalNavigationDrawer value={page} aria-label="Primary" className="h-full">
            <div className="flex h-14 items-center justify-between pl-2">
              <BrandLogo size="sm" />
            </div>
            <div className="mt-3 flex flex-col gap-1">
              {NAV.map((n) => (
                <NavigationDrawerItem key={n.id} value={n.id} icon={n.icon} href={`#${n.id}`}>
                  {n.label}
                </NavigationDrawerItem>
              ))}
            </div>
            <span className="flex-1" />
            <div className="mt-6 flex flex-col gap-2 border-t border-outline-variant px-1 pt-4">
              <ButtonLink href="#pricing" className="h-12">
                Start free
              </ButtonLink>
              <ButtonLink href="#contact" variant="tonal" className="h-12">
                Book a demo
              </ButtonLink>
            </div>
          </ModalNavigationDrawer>
        </DialogTrigger>
        <BrandLogo size="sm" className="state-layer h-12 pr-3 pl-2" />
        <nav className="ml-4 hidden h-16 items-stretch lg:flex" aria-label="Primary">
          {NAV.filter((n) => n.id !== "home").map((n) => {
            const on = page === n.id
            return (
              <Link
                key={n.id}
                href={`#${n.id}`}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "state-layer focus-ring relative flex items-center px-4 text-title-sm outline-none transition-colors duration-200",
                  on ? "text-primary" : "text-on-surface-variant data-hovered:text-on-surface",
                )}
              >
                {n.label}
                <span
                  className={cn(
                    "absolute inset-x-4 bottom-0 h-[3px] rounded-t-full bg-primary",
                    "transition-[opacity,scale] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
                    on ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
                  )}
                />
              </Link>
            )
          })}
        </nav>
        <span className="flex-1" />
        <IconButton aria-label="Toggle dark mode" size="md" width="narrow" onPress={() => setMode(dark ? "light" : "dark")}>
          <Icon>{dark ? "light_mode" : "dark_mode"}</Icon>
        </IconButton>
        <ButtonLink href="#contact" variant="text" className="hidden shrink-0 sm:inline-flex">
          Book a demo
        </ButtonLink>
        <ButtonLink href="#pricing" className="shrink-0 px-5">
          Start free
        </ButtonLink>
      </div>
    </header>
  )
}

/**
 * Landing v3 · the same six-page site on M3 canonical layouts: tab app bar + modal drawer,
 * list-detail Features, supporting-pane Pricing and Contact, feed Changelog.
 */
export function LandingV3() {
  const page = useHashPage(PAGES, "home")
  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      <TabAppBar page={page} />
      <main
        key={page}
        className="origin-top animate-[m3-page-in_450ms_var(--md-easing-emphasized-decelerate)] motion-reduce:animate-none"
      >
        {page === "home" && (
          <>
            <HeroShowcase />
            <LogoCloud />
            <ProblemCards />
            <ProofBento />
            <CtaBanner />
          </>
        )}
        {page === "features" && <FeatureListDetail />}
        {page === "pricing" && <PricingSupportingPane />}
        {page === "about" && <AboutPage />}
        {page === "changelog" && <ChangelogFeed />}
        {page === "contact" && <ContactSupportingPane />}
      </main>
      <SiteFooter />
    </div>
  )
}
