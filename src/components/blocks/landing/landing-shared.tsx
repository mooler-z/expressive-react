"use client"

import * as React from "react"
import { Link as AriaLink, composeRenderProps, type LinkProps as AriaLinkProps } from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { buttonVariants } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { cn } from "@/lib/utils"

/* Shared pieces of the Landing block: page ids, navigation context, link helpers, brand. */

export type LandingPage = "home" | "features" | "pricing" | "about" | "changelog" | "contact"

export const LANDING_PAGES: LandingPage[] = ["home", "features", "pricing", "about", "changelog", "contact"]

/** Destinations in the rail / navigation bar (Contact is reached through the FAB and CTAs). */
export const LANDING_NAV: { id: LandingPage; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "features", label: "Features", icon: "auto_awesome" },
  { id: "pricing", label: "Pricing", icon: "sell" },
  { id: "about", label: "About", icon: "groups" },
  { id: "changelog", label: "Changelog", icon: "campaign" },
]

export const LANDING_TITLES: Record<LandingPage, string> = {
  home: "",
  features: "Features",
  pricing: "Pricing",
  about: "About",
  changelog: "Changelog",
  contact: "Contact",
}

/** Links that leave the landing site (footer, sign-in). Omitted ones are hidden. */
export interface LandingLinks {
  /** Component kit / docs. */
  kit?: string
  /** Dashboard template. */
  dashboard?: string
}

interface LandingContextValue {
  page: LandingPage
  href: (page: LandingPage) => string
  links: LandingLinks
}

export const LandingContext = React.createContext<LandingContextValue>({
  page: "home",
  href: (page) => `#${page}`,
  links: {},
})

export function useLanding() {
  return React.useContext(LandingContext)
}

/** Link to another landing page by id. */
export function PageLink({ to, ...props }: Omit<AriaLinkProps, "href"> & { to: LandingPage }) {
  const { href } = useLanding()
  return <AriaLink href={href(to)} {...props} />
}

type ButtonStyle = Omit<VariantProps<typeof buttonVariants>, "toggle">

/** A link that looks like an M3 button (press morph, state layer, ripple). */
export function ButtonLink({ variant, size, shape, className, children, ...props }: AriaLinkProps & ButtonStyle) {
  return (
    <AriaLink
      {...props}
      className={composeRenderProps(className, (className) => buttonVariants({ variant, size, shape, className }))}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <Ripple />
        </>
      ))}
    </AriaLink>
  )
}

/** Same as ButtonLink but targets a landing page. */
export function PageButtonLink({ to, ...props }: Omit<React.ComponentProps<typeof ButtonLink>, "href"> & { to: LandingPage }) {
  const { href } = useLanding()
  return <ButtonLink href={href(to)} {...props} />
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-8 shrink-0 place-items-center rounded-full bg-primary text-on-primary", className)}>
      <Icon size={20} filled>
        flight_takeoff
      </Icon>
    </span>
  )
}

/** Logo + wordmark linking home. */
export function Brand({ className }: { className?: string }) {
  return (
    <PageLink
      to="home"
      className={cn("state-layer focus-ring relative flex h-12 shrink-0 items-center gap-2 rounded-full pr-3 pl-2 outline-none", className)}
    >
      <BrandMark />
      <span className="text-title-md font-semibold tracking-tight">Kestrel</span>
    </PageLink>
  )
}

/** Page intro used by every page except Home: display headline and lead. */
export function PageIntro({
  title,
  children,
  aside,
  footer,
}: {
  title: React.ReactNode
  children?: React.ReactNode
  /** Beside the headline on wide windows (e.g. a subscribe form). */
  aside?: React.ReactNode
  /** Under the lead (e.g. a billing toggle). */
  footer?: React.ReactNode
}) {
  return (
    <section className="px-4 pt-4 pb-6 md:px-6 lg:px-10">
      <div className={cn(aside && "flex flex-wrap items-end justify-between gap-6")}>
        <div className={cn(aside && "max-w-2xl")}>
          <h1 className="max-w-3xl text-display-sm font-semibold tracking-tight text-balance lg:text-display-md">{title}</h1>
          {children && <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">{children}</p>}
        </div>
        {aside}
      </div>
      {footer && <div className="mt-6">{footer}</div>}
    </section>
  )
}
