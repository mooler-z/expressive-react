"use client"

import * as React from "react"

import { cn, tv } from "@/lib/utils"

/*
 * App bars · M3 Expressive (androidx AppBarTokens, AppBar{Small,MediumFlexible,LargeFlexible}Tokens, BottomAppBarTokens)
 *   small           64dp · title-large · subtitle label-medium
 *   center          small with a centered title
 *   medium flexible 112dp (136 with subtitle) · headline-medium · subtitle label-large
 *   large flexible  120dp (152 with subtitle) · display-small · subtitle title-medium
 *   container       surface at rest → surface-container once content scrolls beneath (DefaultEffects spring)
 *   spacing         4dp leading/trailing · leading icon on-surface, trailing icons on-surface-variant
 *   bottom app bar  80dp · surface-container
 * Medium/large: the big title scrolls away under a pinned 64dp bar; the small title fades in once it's gone.
 * Scroll is read from the nearest scrolling ancestor (or the window), so no wiring is needed.
 */

function scrollParent(el: HTMLElement | null): HTMLElement | Window {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const { overflowY } = getComputedStyle(p)
    if (/(auto|scroll|overlay)/.test(overflowY) && p.scrollHeight > p.clientHeight) return p
  }
  return window
}

const barVariants = tv({
  slots: {
    bar: [
      "sticky top-0 z-10 flex flex-col text-on-surface",
      "transition-[background-color] duration-(--md-spring-default-effects-duration) ease-default-effects",
    ],
    row: "flex h-16 shrink-0 items-center gap-1 px-1",
    navigation: "flex shrink-0 items-center text-on-surface",
    titleBox: "min-w-0 flex-1 px-1",
    title: "truncate text-title-lg",
    subtitle: "truncate text-label-md text-on-surface-variant",
    actions: "flex shrink-0 items-center gap-0 text-on-surface-variant",
    expanded: "px-4",
    expandedTitle: "",
    expandedSubtitle: "text-on-surface-variant",
  },
  variants: {
    variant: {
      small: {},
      center: {
        row: "grid grid-cols-[1fr_auto_1fr]",
        titleBox: "text-center",
        actions: "justify-self-end",
      },
      medium: {
        expandedTitle: "text-headline-md",
        expandedSubtitle: "text-label-lg",
      },
      large: {
        expandedTitle: "text-display-sm",
        expandedSubtitle: "text-title-md",
      },
    },
    hasSubtitle: { true: {}, false: {} },
    scrolled: {
      true: { bar: "bg-surface-container" },
      false: { bar: "bg-surface" },
    },
  },
  compoundVariants: [
    { variant: "medium", hasSubtitle: false, class: { expanded: "pb-3" } },
    { variant: "medium", hasSubtitle: true, class: { expanded: "pb-4" } },
    { variant: "large", hasSubtitle: false, class: { expanded: "pb-3" } },
    { variant: "large", hasSubtitle: true, class: { expanded: "pb-5" } },
  ],
})

export interface TopAppBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  variant?: "small" | "center" | "medium" | "large"
  title?: React.ReactNode
  subtitle?: React.ReactNode
  /** Leading navigation icon button (back, menu, close). */
  navigation?: React.ReactNode
  /** Trailing action icon buttons / avatar. */
  actions?: React.ReactNode
  /** Replaces the title area (e.g. a search bar). */
  children?: React.ReactNode
  /** Pinned below the bar (tabs, a progress indicator). */
  bottom?: React.ReactNode
  /** Force the scrolled (surface-container) state instead of reading scroll. */
  scrolled?: boolean
  /** Classes for the 64dp row (e.g. a contextual `bg-secondary-container`). */
  rowClassName?: string
  /** Container color for the whole bar, expanded title included (e.g. `bg-primary-container text-on-primary-container`). Overrides the scroll colors. */
  containerClassName?: string
}

function TopAppBar({
  variant = "small",
  title,
  subtitle,
  navigation,
  actions,
  children,
  bottom,
  scrolled: scrolledProp,
  className,
  rowClassName,
  containerClassName,
  ...props
}: TopAppBarProps) {
  const barRef = React.useRef<HTMLDivElement>(null)
  const expandedRef = React.useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)
  const flexible = variant === "medium" || variant === "large"

  React.useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const scroller = scrollParent(bar)
    // Geometry, not scroll offsets: a bar is "scrolled" only while it is pinned to the top of its
    // scroller with content passing beneath, and "collapsed" once the big title has slid under it.
    const read = () => {
      const top = scroller === window ? window.scrollY : (scroller as HTMLElement).scrollTop
      const edge = scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top
      const barRect = bar.getBoundingClientRect()
      setScrolled(top > 0 && Math.abs(barRect.top - edge) < 1)
      const expanded = expandedRef.current
      setCollapsed(!!expanded && expanded.getBoundingClientRect().bottom <= barRect.bottom + 4)
    }
    read()
    scroller.addEventListener("scroll", read, { passive: true })
    window.addEventListener("resize", read)
    return () => {
      scroller.removeEventListener("scroll", read)
      window.removeEventListener("resize", read)
    }
  }, [])

  const isScrolled = scrolledProp ?? (flexible ? collapsed : scrolled)
  const s = barVariants({ variant, hasSubtitle: !!subtitle, scrolled: isScrolled })

  const smallTitle = (
    <div
      className={cn(
        s.titleBox(),
        flexible && "transition-opacity duration-(--md-spring-default-effects-duration)",
        flexible && !collapsed && "opacity-0",
      )}
      aria-hidden={flexible && !collapsed ? true : undefined}
    >
      {children ?? (
        <>
          <div className={s.title()}>{title}</div>
          {subtitle && !flexible && <div className={s.subtitle()}>{subtitle}</div>}
        </>
      )}
    </div>
  )

  return (
    <header data-slot="top-app-bar" data-variant={variant} className="contents" {...props}>
      <div ref={barRef} data-scrolled={isScrolled || undefined} className={s.bar({ className: cn(containerClassName, className) })}>
        <div className={s.row({ className: rowClassName })}>
          {variant === "center" ? (
            <>
              <div className={s.navigation()}>{navigation}</div>
              {smallTitle}
              <div className={s.actions()}>{actions}</div>
            </>
          ) : (
            <>
              {navigation && <div className={s.navigation()}>{navigation}</div>}
              {smallTitle}
              {actions && <div className={s.actions()}>{actions}</div>}
            </>
          )}
        </div>
        {bottom}
      </div>
      {flexible && (
        <div ref={expandedRef} className={cn("bg-surface", s.expanded(), containerClassName)}>
          <div className={cn("truncate", s.expandedTitle())}>{title}</div>
          {subtitle && <div className={cn("truncate", s.expandedSubtitle())}>{subtitle}</div>}
        </div>
      )}
    </header>
  )
}

export interface BottomAppBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Up to four action icon buttons. */
  children?: React.ReactNode
  /** Floating action button at the end. */
  fab?: React.ReactNode
}

/** 80dp surface-container bar with actions and an optional FAB. */
function BottomAppBar({ children, fab, className, ...props }: BottomAppBarProps) {
  return (
    <div
      data-slot="bottom-app-bar"
      role="toolbar"
      className={cn("flex h-20 shrink-0 items-center gap-1 bg-surface-container ps-1 pe-4 text-on-surface-variant", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">{children}</div>
      {fab}
    </div>
  )
}

export { BottomAppBar, TopAppBar, barVariants as topAppBarVariants }
