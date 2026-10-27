"use client"

import * as React from "react"
import { Button as AriaButton, Link as AriaLink, type PressEvent } from "react-aria-components"

import { Badge, BadgeAnchor } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { tv } from "@/lib/utils"

/*
 * Navigation bar · M3 Expressive (androidx NavigationBarTokens, NavigationBar{Vertical,Horizontal}ItemTokens)
 *   container   64dp (Expressive "short" bar) · surface-container
 *   vertical    indicator 32×56 full · icon 24 · 4dp to a label-medium label   (compact windows)
 *   horizontal  indicator 40dp high, 16dp leading/trailing · icon + label side by side   (medium windows)
 *   colors      active: indicator secondary-container, icon on-secondary-container, label secondary
 *               inactive: icon + label on-surface-variant
 * The indicator grows out from its center on the FastSpatial spring; the icon fills.
 * `layout="auto"` switches vertical → horizontal at the 600px window size class.
 */

type Layout = "vertical" | "horizontal" | "auto"

interface NavigationBarContextValue {
  value?: string
  onValueChange?: (value: string) => void
  layout: Layout
}

const NavigationBarContext = React.createContext<NavigationBarContextValue>({ layout: "vertical" })

const navigationBarVariants = tv({
  base: "flex h-16 w-full items-stretch bg-surface-container text-on-surface-variant",
  variants: {
    indicator: {
      secondary: "[--nav-indicator:var(--md-secondary-container)] [--nav-on-indicator:var(--md-on-secondary-container)] [--nav-active-label:var(--md-secondary)]",
      tertiary: "[--nav-indicator:var(--md-tertiary-container)] [--nav-on-indicator:var(--md-on-tertiary-container)] [--nav-active-label:var(--md-tertiary)]",
      primary: "[--nav-indicator:var(--md-primary-container)] [--nav-on-indicator:var(--md-on-primary-container)] [--nav-active-label:var(--md-primary)]",
    },
  },
  defaultVariants: { indicator: "secondary" },
})

export interface NavigationBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Active destination (controlled). Items compare against their `value`. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Item layout. `auto`: vertical on compact windows, horizontal from 600px. */
  layout?: Layout
  /** Active-indicator color family. */
  indicator?: "secondary" | "tertiary" | "primary"
}

function NavigationBar({
  value: valueProp,
  defaultValue,
  onValueChange,
  layout = "vertical",
  indicator,
  className,
  children,
  "aria-label": ariaLabel = "Main",
  ...props
}: NavigationBarProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled
  const ctx = React.useMemo<NavigationBarContextValue>(
    () => ({
      value,
      layout,
      onValueChange: (v) => {
        setUncontrolled(v)
        onValueChange?.(v)
      },
    }),
    [value, layout, onValueChange],
  )
  return (
    <NavigationBarContext.Provider value={ctx}>
      <nav
        data-slot="navigation-bar"
        data-layout={layout}
        aria-label={ariaLabel}
        className={navigationBarVariants({ indicator, className })}
        {...props}
      >
        {children}
      </nav>
    </NavigationBarContext.Provider>
  )
}

const itemVariants = tv({
  slots: {
    root: "group relative flex min-w-0 flex-1 cursor-pointer items-center justify-center outline-none select-none data-disabled:cursor-default data-disabled:opacity-38",
    indicator: "relative isolate grid shrink-0 place-items-center",
    pill: [
      "absolute inset-0 -z-10 rounded-full bg-(--nav-indicator) opacity-0 scale-x-[.32]",
      "transition-[scale,opacity] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
      "group-data-active:scale-x-100 group-data-active:opacity-100",
    ],
    layer: [
      "pointer-events-none absolute inset-0 rounded-full bg-current opacity-0 transition-opacity duration-150",
      "group-data-hovered:opacity-8 group-data-focus-visible:opacity-10 group-data-pressed:opacity-12",
      "group-data-focus-visible:outline-3 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-secondary",
    ],
    icon: "group-data-active:text-(--nav-on-indicator)",
    /** Label under the indicator (vertical items). */
    labelBelow: "max-w-full truncate px-1 text-label-md group-data-active:font-semibold group-data-active:text-(--nav-active-label)",
    /** Label inside the indicator (horizontal items). */
    labelInside: "truncate text-label-lg group-data-active:font-semibold group-data-active:text-(--nav-on-indicator)",
  },
  variants: {
    layout: {
      vertical: {
        root: "flex-col gap-1 pt-1.5 pb-1.5",
        indicator: "h-8 w-14",
      },
      horizontal: {
        root: "",
        indicator: "h-10 grid-flow-col gap-1 px-4",
      },
      auto: {
        root: "flex-col gap-1 pt-1.5 pb-1.5 md:flex-row md:gap-0 md:p-0",
        indicator: "h-8 w-14 md:h-10 md:w-auto md:grid-flow-col md:gap-1 md:px-4",
        labelBelow: "md:hidden",
        labelInside: "hidden md:inline",
      },
    },
  },
})

export interface NavigationBarItemProps {
  /** Compared with the bar's `value`; pressing the item selects it. */
  value?: string
  /** Material Symbols name. */
  icon: string
  label: React.ReactNode
  /** Count, short text, or `true` for the small dot. */
  badge?: number | string | boolean
  /** Accessible badge description, e.g. "4 new alerts". */
  badgeLabel?: string
  /** Render as a link (use react-aria's RouterProvider for client routing). */
  href?: string
  /** Force the active state (e.g. from your router) instead of comparing `value`. */
  isActive?: boolean
  isDisabled?: boolean
  onPress?: (e: PressEvent) => void
  className?: string
}

function NavigationBarItem({
  value,
  icon,
  label,
  badge,
  badgeLabel,
  href,
  isActive: isActiveProp,
  isDisabled,
  onPress,
  className,
}: NavigationBarItemProps) {
  const ctx = React.useContext(NavigationBarContext)
  const isActive = isActiveProp ?? (value !== undefined && ctx.value === value)
  const s = itemVariants({ layout: ctx.layout })
  const count = typeof badge === "boolean" ? undefined : badge
  // Horizontal items carry a count inline after the label (anchored to the icon it would cover the text).
  const inlineCount = count !== undefined && ctx.layout !== "vertical"
  const content = (
    <>
      <span className={s.indicator()}>
        <span aria-hidden className={s.pill()} />
        <BadgeAnchor
          count={ctx.layout === "horizontal" ? undefined : count}
          dot={badge === true}
          badgeLabel={badgeLabel}
          className={s.icon()}
          badgeClassName={ctx.layout === "auto" && count !== undefined ? "md:hidden" : undefined}
        >
          <Icon filled={isActive} className="transition-[--icon-fill] duration-(--md-spring-default-effects-duration)">
            {icon}
          </Icon>
        </BadgeAnchor>
        {ctx.layout !== "vertical" && (
          <span className={s.labelInside()}>{label}</span>
        )}
        {inlineCount && <Badge count={count} aria-label={badgeLabel} className={ctx.layout === "auto" ? "hidden md:inline-flex" : undefined} />}
        <span aria-hidden className={s.layer()} />
        <Ripple />
      </span>
      {ctx.layout !== "horizontal" && (
        <span className={s.labelBelow()}>{label}</span>
      )}
    </>
  )
  const shared = {
    "data-slot": "navigation-bar-item",
    "data-active": isActive || undefined,
    "aria-current": isActive ? ("page" as const) : undefined,
    isDisabled,
    className: s.root({ className }),
    onPress: (e: PressEvent) => {
      if (value !== undefined) ctx.onValueChange?.(value)
      onPress?.(e)
    },
  }
  return href ? (
    <AriaLink href={href} {...shared}>
      {content}
    </AriaLink>
  ) : (
    <AriaButton {...shared}>{content}</AriaButton>
  )
}

export { NavigationBar, NavigationBarItem, navigationBarVariants }
