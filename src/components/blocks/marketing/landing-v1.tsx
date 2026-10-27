"use client"

import { Dialog, DialogTrigger, Link, Modal, ModalOverlay } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { useTheme } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"

import { AboutPage } from "./marketing-about"
import { ChangelogTimeline } from "./marketing-changelog"
import { ContactPage } from "./marketing-contact"
import { CtaBanner } from "./marketing-cta-banner"
import { FeatureRows } from "./marketing-feature-rows"
import { HeroShowcase } from "./marketing-hero-showcase"
import { PricingPage } from "./marketing-pricing"
import { ProblemCards } from "./marketing-problem-cards"
import { ProofBento } from "./marketing-proof-bento"
import { BrandLogo, ButtonLink, LogoCloud, SiteFooter, useHashPage, useScrolled } from "./marketing-shared"

const PAGES = ["home", "features", "pricing", "about", "contact", "changelog"] as const
type Page = (typeof PAGES)[number]
const NAV: { id: Page; label: string }[] = [
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "changelog", label: "Changelog" },
]

function ThemeToggle() {
  const { resolvedMode, setMode } = useTheme()
  const dark = resolvedMode === "dark"
  return (
    <IconButton aria-label="Toggle dark mode" size="md" width="narrow" onPress={() => setMode(dark ? "light" : "dark")}>
      <Icon>{dark ? "light_mode" : "dark_mode"}</Icon>
    </IconButton>
  )
}

/** Floating pill navigation; tightens its shadow once the page scrolls. */
function PillNav({ page }: { page: Page }) {
  const scrolled = useScrolled()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 md:top-5">
      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto flex h-16 max-w-full items-center gap-1 rounded-full bg-surface-container/85 p-2 ring-1 ring-outline-variant/40 backdrop-blur-xl",
          "transition-[box-shadow,background-color] duration-500 ease-emphasized",
          scrolled ? "bg-surface-container/95 shadow-3" : "shadow-1",
        )}
      >
        <BrandLogo className="state-layer h-12 gap-2.5 pr-4 pl-1.5 [&>span:last-child]:text-title-md" />
        <div className="hidden h-12 shrink-0 items-center gap-0.5 rounded-full bg-surface-container-highest/70 p-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.id}
              href={`#${n.id}`}
              aria-current={page === n.id ? "page" : undefined}
              className={cn(
                "state-layer focus-ring inline-flex h-10 items-center rounded-full px-4 text-label-lg outline-none shape-morph",
                page === n.id
                  ? "bg-secondary-container font-semibold text-on-secondary-container"
                  : "text-on-surface-variant data-hovered:text-on-surface",
              )}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <div className="ml-1 flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <ButtonLink href="#contact" variant="text" className="hidden h-12 px-4 md:inline-flex">
            Book a demo
          </ButtonLink>
          <ButtonLink href="#pricing" className="h-12 pr-4 pl-5">
            Start free
            <Icon size={20}>arrow_forward</Icon>
          </ButtonLink>
          <MobileMenu page={page} />
        </div>
      </nav>
    </div>
  )
}

function MobileMenu({ page }: { page: Page }) {
  return (
    <DialogTrigger>
      <IconButton aria-label="Menu" size="md" width="narrow" className="text-on-surface lg:hidden">
        <Icon>menu</Icon>
      </IconButton>
      <ModalOverlay
        isDismissable
        className="fixed inset-0 z-[60] bg-scrim/40 data-entering:animate-[m3-fade-in_200ms] data-exiting:animate-[m3-fade-out_150ms] lg:hidden"
      >
        <Modal className="absolute inset-x-3 top-3 rounded-xl bg-surface-container-high p-3 shadow-3 outline-none data-entering:animate-pop">
          <Dialog aria-label="Menu" className="outline-none">
            {({ close }) => (
              <>
                <div className="flex h-12 items-center justify-between pl-4 text-title-md">
                  <span>Menu</span>
                  <IconButton aria-label="Close" size="md" width="narrow" onPress={close}>
                    <Icon>close</Icon>
                  </IconButton>
                </div>
                {NAV.map((n) => (
                  <Link
                    key={n.id}
                    href={`#${n.id}`}
                    onPress={close}
                    className={cn(
                      "state-layer focus-ring flex h-14 items-center rounded-full px-4 text-label-lg outline-none",
                      page === n.id && "bg-secondary-container font-semibold text-on-secondary-container",
                    )}
                  >
                    {n.label}
                  </Link>
                ))}
                <div className="mt-2 flex gap-2 p-2">
                  <ButtonLink href="#contact" variant="tonal" onPress={close} className="h-12 flex-1">
                    Book a demo
                  </ButtonLink>
                  <ButtonLink href="#pricing" onPress={close} className="h-12 flex-1">
                    Start free
                  </ButtonLink>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}

/**
 * Landing v1 · six-page marketing site with a floating pill nav (Home, Features, Pricing, About, Contact, Changelog).
 * Pages switch on the URL hash, so links like `#pricing` work anywhere.
 */
export function LandingV1() {
  const page = useHashPage(PAGES, "home")
  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      <PillNav page={page} />
      <main key={page} className="animate-[m3-fade-in_300ms_var(--md-easing-standard)] pt-24 md:pt-28">
        {page === "home" && (
          <>
            <HeroShowcase />
            <LogoCloud />
            <ProblemCards />
            <ProofBento />
            <CtaBanner />
          </>
        )}
        {page === "features" && <FeatureRows />}
        {page === "pricing" && <PricingPage />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
        {page === "changelog" && <ChangelogTimeline />}
      </main>
      <SiteFooter />
    </div>
  )
}

