import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { Shape, type ShapeName } from "@/components/ui/shape"
import { cn, tv } from "@/lib/utils"

/*
 * Empty state · an Expressive shape carries the icon; headline, one sentence,
 * one primary action and an optional secondary one.
 */
const emptyStateVariants = tv({
  slots: {
    root: "flex flex-col items-center justify-center rounded-lg px-6 text-center",
    media: "relative grid shrink-0 place-items-center",
    title: "text-on-surface",
    description: "max-w-xs text-on-surface-variant",
    actions: "flex flex-wrap justify-center gap-2",
  },
  variants: {
    variant: {
      default: { root: "bg-surface" },
      dashed: { root: "border-2 border-dashed border-outline-variant" },
      plain: {},
    },
    size: {
      md: { root: "py-12", media: "size-28 [--icon-size:40px]", title: "mt-6 text-headline-sm", description: "mt-2 text-body-md", actions: "mt-6" },
      sm: { root: "py-6", media: "size-20 [--icon-size:32px]", title: "mt-4 text-title-md", description: "mt-1 text-body-sm", actions: "mt-4" },
    },
  },
  defaultVariants: { variant: "default", size: "md" },
})

const DEFAULT_CYCLE: ShapeName[] = ["clover4", "cookie7", "sunny"]

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Material Symbol shown on the shape. */
  icon?: string
  /** Shape behind the icon; `false` for a bare icon. Without `shape`, the default morphs clover → cookie → sunny. */
  shape?: ShapeName | false
  shapeCycle?: ShapeName[]
  /** Replace the shape + icon entirely (chart outline, error disc, lock tile…). */
  media?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Buttons. Primary first. */
  actions?: React.ReactNode
  variant?: "default" | "dashed" | "plain"
  size?: "md" | "sm"
}

function EmptyState({
  icon = "inbox",
  shape,
  shapeCycle,
  media,
  title,
  description,
  actions,
  variant,
  size,
  className,
  children,
  ...props
}: EmptyStateProps) {
  const s = emptyStateVariants({ variant, size })
  const cycle = shapeCycle ?? (shape === undefined ? DEFAULT_CYCLE : undefined)
  return (
    <div data-slot="empty-state" className={s.root({ className })} {...props}>
      {media ?? (
        <span className={s.media({ className: shape === false && "size-auto" })}>
          {shape !== false ? (
            <>
              <Shape shape={shape ?? "clover4"} cycle={cycle} interval={3000} className="absolute inset-0 size-full text-primary-container" />
              <Icon className="relative text-on-primary-container">{icon}</Icon>
            </>
          ) : (
            <Icon className="text-on-surface-variant">{icon}</Icon>
          )}
        </span>
      )}
      <h4 className={cn(s.title(), shape === false && !media && "mt-4")}>{title}</h4>
      {description && <p className={s.description()}>{description}</p>}
      {actions && <div className={s.actions()}>{actions}</div>}
      {children}
    </div>
  )
}

export { EmptyState, emptyStateVariants }
