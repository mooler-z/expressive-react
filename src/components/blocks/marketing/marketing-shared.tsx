"use client"

import * as React from "react"
import { Link, composeRenderProps, type LinkProps } from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { buttonVariants } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { Shape, type ShapeProps } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { useMagnetic } from "@/hooks/use-magnetic"
import { useTilt } from "@/hooks/use-tilt"
import { cn } from "@/lib/utils"

/*
 * Shared pieces for the marketing blocks (Kestrel demo brand).
 * Swap the brand, links and copy for your own.
 */

export const BRAND = { name: "Kestrel", icon: "flight_takeoff", legal: "© 2026 Kestrel Systems AB" }

/** Round brand mark + wordmark. */
export function BrandLogo({
  href = "#home",
  size = "md",
  className,
  onPress,
}: {
  href?: string
  size?: "sm" | "md"
  className?: string
  onPress?: () => void
}) {
  return (
    <Link
      href={href}
      onPress={onPress}
      className={cn("focus-ring flex shrink-0 items-center gap-2 rounded-full text-current outline-none", className)}
    >
      <span
        className={cn(
          "grid place-items-center rounded-full bg-primary text-on-primary",
          size === "sm" ? "size-8" : "size-9",
        )}
      >
        <Icon size={20} filled>
          {BRAND.icon}
        </Icon>
      </span>
      <span className={cn("font-semibold tracking-tight", size === "sm" ? "text-title-md" : "text-title-lg")}>
        {BRAND.name}
      </span>
    </Link>
  )
}

type ButtonLinkProps = LinkProps & Omit<VariantProps<typeof buttonVariants>, "toggle">

/** A link that looks like a Button (same press morph, ripple and state layer). */
export function ButtonLink({ className, variant, size, shape, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={composeRenderProps(className, (className) => buttonVariants({ variant, size, shape, className }))}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <Ripple />
        </>
      ))}
    </Link>
  )
}

/** Tilts toward the pointer (useTilt). */
export function Tilt({ max = 6, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { max?: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  useTilt(ref, { max })
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  )
}

/** Drifts toward the pointer while hovered (useMagnetic). */
export function Magnetic({ strength = 0.25, className, children }: { strength?: number; className?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  useMagnetic(ref, { strength })
  return (
    <span ref={ref} className={cn("inline-flex", className)}>
      {children}
    </span>
  )
}

/** Fades each direct child up in turn on mount. */
export function StaggerIn({
  step = 80,
  delay = 0,
  className,
  children,
}: {
  step?: number
  delay?: number
  className?: string
  children: React.ReactNode
}) {
  let i = 0
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<{ className?: string; style?: React.CSSProperties }>(child)) return child
        const d = delay + i++ * step
        return React.cloneElement(child, {
          className: cn(
            child.props.className,
            "animate-[m3-fade-up_700ms_var(--md-easing-emphasized-decelerate)_backwards] motion-reduce:animate-none",
          ),
          style: { ...child.props.style, animationDelay: `${d}ms` },
        })
      })}
    </div>
  )
}

/**
 * A decorative M3 shape. Put position/size/color classes on it; `spin` is seconds per turn.
 */
export function DecorShape({
  spin,
  className,
  style,
  ...props
}: ShapeProps & { spin?: number }) {
  return (
    <div
      aria-hidden
      className={cn(spin && "animate-[spin_var(--spin)_linear_infinite] motion-reduce:animate-none", className)}
      style={{ ...(spin ? { "--spin": `${spin}s` } : null), ...style } as React.CSSProperties}
    >
      <Shape className="size-full" {...props} />
    </div>
  )
}

/** Copy to clipboard and confirm with a snackbar. */
export async function copyWithSnackbar(text: string, label = text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // clipboard unavailable (permissions, insecure origin): still confirm what would have been copied
  }
  snackbar(`Copied ${label}`)
}

export const FOOTER_LINKS = [
  { label: "Landing", href: "/landing" },
  { label: "Components", href: "/" },
  { label: "Admin", href: "/admin" },
  { label: "Dashboard kit", href: "/dashboard-kit" },
]

/** One-line footer used by the single-page variants. */
export function SimpleFooter({ links = FOOTER_LINKS }: { links?: { label: string; href: string }[] }) {
  return (
    <footer className="border-t border-outline-variant/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-body-sm text-on-surface-variant md:px-8">
        <span>{BRAND.legal}</span>
        <nav className="flex flex-wrap gap-4">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="focus-ring rounded-xs text-primary underline underline-offset-[3px] outline-none data-hovered:text-on-primary-container"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

const SITE_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
      { label: "Dashboard template", href: "/admin" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Careers", href: "#about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "M3 Expressive kit", href: "/" },
      { label: "Material 3", href: "https://m3.material.io" },
      { label: "Status", href: "#contact" },
    ],
  },
]

const SOCIAL = [
  { label: "GitHub", icon: "code", note: "github.com/kestrel" },
  { label: "LinkedIn", icon: "work", note: "linkedin.com/company/kestrel" },
  { label: "RSS", icon: "rss_feed", note: "kestrel.io/changelog.xml" },
]

/** Four-column site footer used by the multi-page landing templates. */
export function SiteFooter({ columns = SITE_COLUMNS }: { columns?: typeof SITE_COLUMNS }) {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-container-low">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-8">
        <div>
          <BrandLogo size="sm" />
          <p className="mt-4 max-w-xs text-body-md text-on-surface-variant">
            The enterprise control plane. Built in Stockholm, Berlin and Austin.
          </p>
          <div className="mt-5 flex gap-1">
            {SOCIAL.map((s) => (
              <Link
                key={s.label}
                aria-label={s.label}
                onPress={() => snackbar(s.note)}
                className="state-layer focus-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-on-surface-variant outline-none"
              >
                <Icon size={20}>{s.icon}</Icon>
              </Link>
            ))}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="text-title-sm">{col.title}</div>
            <ul className="mt-3 space-y-2 text-body-md text-on-surface-variant">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    className="focus-ring rounded-xs outline-none data-hovered:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-outline-variant/60 px-4 py-6 text-body-sm text-on-surface-variant md:px-8">
        <span>{BRAND.legal}</span>
        <span className="flex gap-4">
          {["Privacy", "Terms", "Security"].map((l) => (
            <Link key={l} href="#home" className="focus-ring rounded-xs outline-none data-hovered:text-primary">
              {l}
            </Link>
          ))}
        </span>
      </div>
    </footer>
  )
}

export const CUSTOMERS = ["Northwind", "Halide Bank", "Meridian Health", "Tessera Logistics", "Quorum Energy", "Lattice Labs"]

/** Customer logo wordmarks. `band` spans the page between borders; `panel` sits in a rounded container. */
export function LogoCloud({ variant = "band", names = CUSTOMERS }: { variant?: "band" | "panel"; names?: string[] }) {
  const row = (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-y-3 text-title-md font-semibold tracking-tight text-on-surface-variant/70",
        variant === "band" ? "gap-x-12" : "gap-x-10",
      )}
    >
      {names.map((n) => (
        <span key={n}>{n}</span>
      ))}
    </div>
  )
  if (variant === "panel")
    return (
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <div className="rounded-2xl bg-surface-container-low px-6 py-8">{row}</div>
      </section>
    )
  return (
    <section className="border-y border-outline-variant/60 bg-surface-container-low/60">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">{row}</div>
    </section>
  )
}

/**
 * Tiny hash router for single-file marketing sites: `#pricing` → "pricing".
 * Unknown hashes keep the current page; page changes scroll to top.
 */
export function useHashPage<T extends string>(pages: readonly T[], fallback: T) {
  const read = React.useCallback((): T | null => {
    const h = window.location.hash.slice(1).split("?")[0] as T
    return pages.includes(h) ? h : null
  }, [pages])
  const [page, setPage] = React.useState<T>(() => (typeof window === "undefined" ? fallback : (read() ?? fallback)))
  React.useEffect(() => {
    const onHash = () => {
      const p = read()
      if (p) {
        setPage(p)
        window.scrollTo({ top: 0 })
      }
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [read])
  return page
}

/** True once the window has scrolled past `threshold` px. */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = React.useState(false)
  React.useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [threshold])
  return scrolled
}

export const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Customers", href: "#customers" },
  { label: "Docs", href: "#docs" },
]

/** Product / Pricing / Customers / Docs text links (pill state layers). */
export function NavLinks({
  className,
  linkClassName,
  links = NAV_LINKS,
}: {
  className?: string
  linkClassName?: string
  links?: { label: string; href: string }[]
}) {
  return (
    <nav aria-label="Primary" className={cn("hidden items-center gap-1 lg:flex", className)}>
      {links.map((l) => (
        <Link
          key={l.label}
          href={l.href}
          className={cn(
            "state-layer focus-ring inline-flex h-10 items-center rounded-full px-4 text-label-lg text-on-surface-variant outline-none",
            linkClassName,
          )}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
