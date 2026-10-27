"use client"

import * as React from "react"
import { Button as AriaButton } from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { cn, tv } from "@/lib/utils"

/*
 * Alert · inline message on a container role with a leading icon and text-button actions.
 *   tones     info (surface-container-high + primary icon) · success (tertiary-container)
 *             warning (secondary-container) · error (error-container)
 *   variants  tonal (filled container) · outlined · inverse (pill on inverse-surface)
 * Banner · the M3 banner: full content width under the app bar, icon on a container,
 * right-aligned text-button actions, divider below.
 */

const alertVariants = tv({
  slots: {
    root: "flex items-center gap-3 rounded-md px-4 py-3",
    icon: "shrink-0 [--icon-fill:1]",
    main: "flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1",
    content: "min-w-[min(200px,100%)] flex-1",
    title: "text-title-sm",
    description: "text-body-md",
    actions: "-mx-2 flex flex-wrap items-center gap-1",
    close: "state-layer focus-ring -mr-2 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full",
  },
  variants: {
    tone: { info: {}, success: {}, warning: {}, error: {} },
    variant: {
      tonal: {},
      outlined: { root: "border bg-transparent" },
      inverse: {
        root: "min-h-12 rounded-[24px] bg-inverse-surface py-2 pr-3 pl-5 text-inverse-on-surface",
        close: "text-inverse-on-surface",
      },
    },
    hasTitle: { true: { root: "items-start", content: "space-y-0.5", icon: "mt-0.5" }, false: {} },
  },
  compoundVariants: [
    { variant: "tonal", tone: "info", class: { root: "bg-surface-container-high text-on-surface", icon: "text-primary [--icon-fill:0]", close: "text-on-surface-variant" } },
    { variant: "tonal", tone: "success", class: { root: "bg-tertiary-container text-on-tertiary-container" } },
    { variant: "tonal", tone: "warning", class: { root: "bg-secondary-container text-on-secondary-container" } },
    { variant: "tonal", tone: "error", class: { root: "bg-error-container text-on-error-container" } },
    { variant: "outlined", tone: "info", class: { root: "border-outline-variant text-on-surface", icon: "text-primary" } },
    { variant: "outlined", tone: "success", class: { root: "border-tertiary text-on-surface", icon: "text-tertiary" } },
    { variant: "outlined", tone: "warning", class: { root: "border-secondary text-on-surface", icon: "text-secondary" } },
    { variant: "outlined", tone: "error", class: { root: "border-error text-on-surface", icon: "text-error" } },
    { variant: "inverse", tone: "info", class: { icon: "text-inverse-primary" } },
    { variant: "inverse", tone: "success", class: { icon: "text-tertiary-fixed-dim" } },
    { variant: "inverse", tone: "warning", class: { icon: "text-secondary-fixed-dim" } },
    { variant: "inverse", tone: "error", class: { icon: "text-error-container" } },
  ],
  defaultVariants: { tone: "info", variant: "tonal", hasTitle: false },
})

const TONE_ICON = { info: "info", success: "check_circle", warning: "warning", error: "error" } as const

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    Omit<VariantProps<typeof alertVariants>, "hasTitle"> {
  title?: React.ReactNode
  /** Material Symbols name; defaults per tone. Pass null to hide. */
  icon?: string | null
  /** Text buttons or a filled button, right-aligned. */
  actions?: React.ReactNode
  /** Renders a close icon button. */
  onDismiss?: () => void
}

function Alert({ tone = "info", variant, title, icon, actions, onDismiss, className, children, role, ...props }: AlertProps) {
  const s = alertVariants({ tone, variant, hasTitle: !!title })
  const glyph = icon === undefined ? TONE_ICON[tone] : icon
  return (
    <div
      data-slot="alert"
      role={role ?? (tone === "error" ? "alert" : "status")}
      className={cn(s.root(), className)}
      {...props}
    >
      {glyph && <Icon className={s.icon()}>{glyph}</Icon>}
      {/* Content and actions share a wrapping row; icon and close stay pinned at the edges */}
      <div className={s.main()}>
        <div className={s.content()}>
          {title && <div className={s.title()}>{title}</div>}
          {children && <div className={s.description()}>{children}</div>}
        </div>
        {actions && <div className={s.actions()}>{actions}</div>}
      </div>
      {onDismiss && (
        <AriaButton aria-label="Dismiss" className={s.close()} onPress={onDismiss}>
          <Icon size={20}>close</Icon>
        </AriaButton>
      )}
    </div>
  )
}

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Material Symbols name, shown on a primary-container circle. */
  icon?: string
  /** Right-aligned text buttons. */
  actions?: React.ReactNode
}

/** M3 banner: spans the content width, sits under the app bar, ends with a divider. */
function Banner({ icon, actions, className, children, ...props }: BannerProps) {
  return (
    <div data-slot="banner" role="status" className={cn("overflow-hidden bg-surface", className)} {...props}>
      <div className="flex items-start gap-4 px-4 pt-4">
        {icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
            <Icon>{icon}</Icon>
          </span>
        )}
        <div className="min-w-0 flex-1 self-center text-body-md text-on-surface">{children}</div>
      </div>
      <div className="flex justify-end gap-2 px-2 pt-3 pb-2">{actions}</div>
      <hr className="border-0 border-t border-outline-variant" />
    </div>
  )
}

export { Alert, Banner, alertVariants }
