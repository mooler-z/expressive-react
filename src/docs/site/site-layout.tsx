import * as React from "react"

import { SiteFooter } from "@/docs/site/site-footer"
import { SiteBottomNav, SiteHeader } from "@/docs/site/site-header"
import { SiteRail } from "@/docs/site/site-rail"
import { SpecsOverlay } from "@/docs/site/specs-overlay"
import { cn } from "@/lib/utils"

/** Which top-level nav item is active (design-reference/site/SiteHeader.dc.html NAV). */
export type SiteSection = "home" | "docs" | "components" | "blocks" | "themes" | "charts" | "tokens"

export interface SiteLayoutProps {
  active: SiteSection
  children: React.ReactNode
  /** Hide the shared footer (e.g. full-height app-like pages). */
  hideFooter?: boolean
  /** Hide the floating Specs toggle (e.g. pages that embed other pages). */
  hideSpecs?: boolean
  /** Classes for the wrapper around header + content + footer. */
  className?: string
}

/**
 * Shared chrome for the Expressive React site pages (/, /docs, /blocks, /themes, /tokens…), after m3.material.io:
 * - 600dp and up: a fixed 96dp navigation rail on the start edge (SiteRail) with flyout drawers; no top bar.
 * - Compact: the 64dp top app bar (SiteHeader) and the bottom navigation bar.
 *
 * Pin things with `top-(--site-top)` (64px compact, 0 beside the rail) and offset fixed full-width bars with
 * `md:start-24`. Annotate interactive moments with `data-spec="Label|Spec text"` for the Specs overlay.
 */
export function SiteLayout({ active, children, hideFooter, hideSpecs, className }: SiteLayoutProps) {
  return (
    <div
      data-slot="site"
      className={cn("flex min-h-dvh flex-col bg-surface pb-16 font-sans text-on-surface [--site-top:64px] md:ps-24 md:pb-0 md:[--site-top:0px]", className)}
    >
      <SiteRail active={active} specs={!hideSpecs} />
      <SiteHeader />
      {/* Block (not flex) so pages' `mx-auto max-w-*` mains fill the width instead of shrinking to content */}
      <div className="min-w-0 flex-1">{children}</div>
      {!hideFooter && <SiteFooter />}
      <SiteBottomNav active={active} />
      {!hideSpecs && <SpecsOverlay />}
    </div>
  )
}

/** Height of the chrome pinned to the top of the viewport (compact top app bar, or 0 beside the rail), in px. */
export function getSiteTop() {
  const el = document.querySelector('[data-slot="site"]')
  return el ? parseFloat(getComputedStyle(el).getPropertyValue("--site-top")) || 0 : 0
}
