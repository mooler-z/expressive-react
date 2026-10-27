"use client"

import * as React from "react"
import type { VariantProps } from "tailwind-variants"

import { cn, tv } from "@/lib/utils"

/*
 * Badges · M3 (androidx BadgeTokens)
 *   small  6dp dot · error
 *   large  16dp high, label-small, on-error on error, full corners
 * Pin to the top-end of an icon with <BadgeAnchor>.
 */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Count or short text. Omit for the small dot. */
  count?: number | string
  /** Numbers above this render as "max+". */
  max?: number
}

function Badge({ count, max = 999, className, ...props }: BadgeProps) {
  if (count === undefined || count === null) {
    return <span data-slot="badge" data-size="small" className={cn("inline-block size-1.5 shrink-0 rounded-full bg-error", className)} {...props} />
  }
  const label = typeof count === "number" && count > max ? `${max}+` : String(count)
  return (
    <span
      data-slot="badge"
      data-size="large"
      className={cn(
        "inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-error px-1 text-label-sm text-on-error tabular-nums",
        className,
      )}
      {...props}
    >
      {label}
    </span>
  )
}

export interface BadgeAnchorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Count to show; `0` hides the badge. Omit (with `dot`) for the small badge. */
  count?: number | string
  max?: number
  /** Show the 6dp dot when there's no count. */
  dot?: boolean
  /** Accessible description of the badge, e.g. "3 unread". */
  badgeLabel?: string
  badgeClassName?: string
}

/**
 * Wraps an icon (or a nav-bar active indicator) and pins a badge to its top-end corner:
 * the dot sits on the corner; the count starts at the icon's horizontal center, 4dp above it.
 */
function BadgeAnchor({ count, max, dot, badgeLabel, badgeClassName, className, children, ...props }: BadgeAnchorProps) {
  const hidden = count === 0 || (count === undefined && !dot)
  return (
    <span data-slot="badge-anchor" className={cn("relative inline-flex", className)} {...props}>
      {children}
      {!hidden && (
        <Badge
          count={count}
          max={max}
          aria-label={badgeLabel}
          className={cn(count === undefined ? "absolute end-0 top-0" : "absolute start-[calc(50%+2px)] -top-1", badgeClassName)}
        />
      )}
    </span>
  )
}

/*
 * Status label · a small tag for states and metadata ("New", "Beta", "Deprecated", "128").
 * Not an M3 component; built from M3 roles so it sits alongside chips and badges.
 */
const statusBadgeVariants = tv({
  base: "inline-flex h-5 shrink-0 items-center gap-1 px-2 text-label-sm whitespace-nowrap tabular-nums [--icon-size:14px]",
  variants: {
    variant: {
      primary: "bg-primary text-on-primary",
      "primary-container": "bg-primary-container text-on-primary-container",
      secondary: "bg-secondary-container text-on-secondary-container",
      tertiary: "bg-tertiary-container text-on-tertiary-container",
      error: "bg-error-container text-on-error-container",
      neutral: "bg-surface-container-highest text-on-surface-variant",
      outlined: "border border-outline-variant text-on-surface-variant",
    },
    shape: {
      rounded: "rounded-sm",
      pill: "rounded-full",
    },
    size: {
      sm: "",
      md: "h-6 text-label-md [--icon-size:16px]",
    },
  },
  defaultVariants: { variant: "secondary", shape: "rounded", size: "sm" },
})

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, shape, size, ...props }: StatusBadgeProps) {
  return <span data-slot="status-badge" className={statusBadgeVariants({ variant, shape, size, className })} {...props} />
}

export { Badge, BadgeAnchor, StatusBadge, statusBadgeVariants }
