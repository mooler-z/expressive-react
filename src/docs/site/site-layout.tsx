import * as React from "react"

import { SiteFooter } from "@/docs/site/site-footer"
import { SiteBottomNav, SiteHeader } from "@/docs/site/site-header"
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
 * Shared chrome for the Expressive React site pages (/, /docs, /blocks, /themes, /tokens…):
 * sticky SiteHeader, page content, SiteFooter, the compact bottom navigation bar and the Specs overlay.
 *
 * Content sits directly under the 64dp sticky header; at compact widths the wrapper reserves 64dp at the
 * bottom for the navigation bar. Anything a page pins with `sticky top-16` sits just under the header.
 * Annotate interactive moments with `data-spec="Label|Spec text"` and they show up in the Specs overlay.
 */
export function SiteLayout({ active, children, hideFooter, hideSpecs, className }: SiteLayoutProps) {
  return (
    <div data-slot="site" className={cn("flex min-h-dvh flex-col bg-surface pb-16 font-sans text-on-surface md:pb-0", className)}>
      <SiteHeader active={active} />
      {/* Block (not flex) so pages' `mx-auto max-w-*` mains fill the width instead of shrinking to content */}
      <div className="min-w-0 flex-1">{children}</div>
      {!hideFooter && <SiteFooter />}
      <SiteBottomNav active={active} />
      {!hideSpecs && <SpecsOverlay />}
    </div>
  )
}
