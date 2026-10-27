"use client"

import * as React from "react"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { Shape, type ShapeName } from "@/components/ui/shape"
import { cn, tv } from "@/lib/utils"

/*
 * Avatar · sizes 24 · 32 · 40 · 56 · 96 (40 = M3 list leading avatar).
 * Initials on a container role, an image, or an icon. Circle, rounded-square, or any Expressive shape.
 */
const avatarVariants = tv({
  slots: {
    root: "relative inline-grid shrink-0 place-items-center select-none",
    fill: "absolute inset-0 overflow-hidden",
    label: "pointer-events-none relative leading-none",
    status: "absolute right-0 bottom-0 rounded-full ring-2 ring-[var(--avatar-ring,var(--md-surface))]",
  },
  variants: {
    size: {
      xs: { root: "size-6 text-label-sm [--icon-size:16px]", status: "size-2" },
      sm: { root: "size-8 text-label-md [--icon-size:20px]", status: "size-2.5" },
      md: { root: "size-10 text-title-md [--icon-size:24px]", status: "size-3" },
      lg: { root: "size-14 text-title-lg [--icon-size:28px]", status: "size-3.5" },
      xl: { root: "size-24 text-headline-md [--icon-size:48px]", status: "size-5 ring-4" },
    },
    color: {
      primary: { fill: "bg-primary-container", root: "text-on-primary-container" },
      secondary: { fill: "bg-secondary-container", root: "text-on-secondary-container" },
      tertiary: { fill: "bg-tertiary-container", root: "text-on-tertiary-container" },
      "primary-solid": { fill: "bg-primary", root: "text-on-primary" },
      "secondary-solid": { fill: "bg-secondary", root: "text-on-secondary" },
      "tertiary-solid": { fill: "bg-tertiary", root: "text-on-tertiary" },
      neutral: { fill: "bg-surface-container-highest", root: "text-on-surface-variant" },
    },
    square: {
      true: {},
      false: { fill: "rounded-full" },
    },
    status: {
      online: { status: "bg-tertiary" },
      busy: { status: "bg-error" },
      away: { status: "bg-secondary" },
      offline: { status: "bg-outline" },
    },
  },
  compoundVariants: [
    { square: true, size: ["xs", "sm"], class: { fill: "rounded-sm" } },
    { square: true, size: "md", class: { fill: "rounded-md" } },
    { square: true, size: ["lg", "xl"], class: { fill: "rounded-lg" } },
  ],
  defaultVariants: { size: "md", square: false },
})

const PALETTE = ["primary", "secondary", "tertiary"] as const

/** "Maya Lindqvist" → "ML" */
export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return ""
  return ((parts[0][0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase()
}

/** Stable container color for a name, so the same person always gets the same color. */
export function colorFor(name: string): (typeof PALETTE)[number] {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0
  return PALETTE[Math.abs(h) % PALETTE.length]
}

type AvatarStyleProps = Omit<VariantProps<typeof avatarVariants>, "square" | "status">

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">, AvatarStyleProps {
  /** Image URL. Falls back to initials / icon if it fails to load. */
  src?: string
  /** Person's name: used for alt text, initials and the default color. */
  name?: string
  /** Explicit fallback text (overrides initials from `name`). */
  fallback?: string
  /** Material Symbol to show when there's no image or text, e.g. "person", "smart_toy". */
  icon?: string
  /** "circle" (default), "square" (rounded square), or any Expressive shape. */
  shape?: "circle" | "square" | ShapeName
  /** Expressive shape to morph to on hover (with a non-circle/square `shape`). */
  hoverShape?: ShapeName
  /** Presence dot at the bottom-end corner. */
  status?: "online" | "busy" | "away" | "offline"
}

function Avatar({
  src,
  name,
  fallback,
  icon,
  size,
  color,
  shape = "circle",
  hoverShape,
  status,
  className,
  style,
  children,
  ...props
}: AvatarProps) {
  const [failed, setFailed] = React.useState(false)
  React.useEffect(() => setFailed(false), [src])

  const isExpressive = shape !== "circle" && shape !== "square"
  const tone = color ?? (name ? colorFor(name) : "neutral")
  const s = avatarVariants({ size, color: tone, square: shape === "square", status })
  const text = fallback ?? (name ? initials(name) : undefined)
  const showImage = src && !failed

  return (
    <span
      data-slot="avatar"
      role={name ? "img" : undefined}
      aria-label={name}
      className={cn(s.root(), className)}
      style={style}
      {...props}
    >
      {isExpressive ? (
        <Shape
          shape={shape}
          hoverShape={hoverShape}
          morphDuration={600}
          className={cn("absolute inset-0 size-full overflow-hidden", fillText(tone))}
        >
          {showImage && <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />}
        </Shape>
      ) : (
        <span aria-hidden className={s.fill()}>
          {showImage && <img src={src} alt="" className="size-full object-cover" onError={() => setFailed(true)} />}
        </span>
      )}
      {!showImage &&
        (children ?? (text ? <span className={s.label()}>{text}</span> : <Icon className="relative">{icon ?? "person"}</Icon>))}
      {status && <span aria-label={status} className={s.status()} />}
    </span>
  )
}

/** Shapes are painted with currentColor, so map the container role onto `text-*` for the shape layer. */
function fillText(color: NonNullable<AvatarProps["color"]>) {
  return {
    primary: "text-primary-container",
    secondary: "text-secondary-container",
    tertiary: "text-tertiary-container",
    "primary-solid": "text-primary",
    "secondary-solid": "text-secondary",
    "tertiary-solid": "text-tertiary",
    neutral: "text-surface-container-highest",
  }[color]
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show at most this many avatars, then an overflow "+N". */
  max?: number
  /** Size applied to the overflow avatar (match your avatars). */
  size?: AvatarProps["size"]
  /** Custom overflow element. Receives the hidden count. */
  renderOverflow?: (hidden: number) => React.ReactNode
}

/**
 * Overlapping stack with an overflow count. Each avatar gets a 2dp ring in the surface color;
 * set `--avatar-ring` on the group (e.g. `[--avatar-ring:var(--md-surface-container-low)]`) to match the background.
 */
function AvatarGroup({ max, size = "md", renderOverflow, className, children, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children)
  const visible = max ? items.slice(0, max) : items
  const hidden = items.length - visible.length
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center *:not-first:-ms-2",
        "*:data-[slot=avatar]:rounded-full *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-[var(--avatar-ring,var(--md-surface))]",
        className,
      )}
      {...props}
    >
      {visible}
      {hidden > 0 &&
        (renderOverflow ? (
          renderOverflow(hidden)
        ) : (
          <Avatar size={size} color="neutral" fallback={`+${hidden}`} className="text-on-surface" aria-label={`${hidden} more`} />
        ))}
    </div>
  )
}

export { Avatar, AvatarGroup, avatarVariants }
