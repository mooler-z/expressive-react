"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  Disclosure,
  DisclosurePanel,
  Heading,
  Link as AriaLink,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
  type ModalOverlayProps,
  type PressEvent,
} from "react-aria-components"

import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Navigation drawer · M3 (androidx NavigationDrawerTokens)
 *   360dp wide · items 56dp, full-radius active indicator (336dp = the item) · icon 24 · label-large
 *   active   secondary-container / on-secondary-container   inactive  on-surface-variant (on-surface when hovered)
 *   headline title-small on-surface-variant · trailing badge label-large
 *   standard surface, no elevation · modal surface-container-low, 16dp end corners, elevation 1, scrim
 * Modal drawers close on scrim tap, Esc, or selecting a destination.
 */

interface DrawerContextValue {
  value?: string
  onValueChange?: (value: string) => void
  dense: boolean
  /** Nesting depth (inside NavigationDrawerGroup). */
  level: number
  closeOnSelect: boolean
}

const DrawerContext = React.createContext<DrawerContextValue>({ dense: false, level: 0, closeOnSelect: false })

const drawerVariants = tv({
  base: "flex w-full max-w-[360px] flex-col gap-0.5 p-3 text-on-surface-variant",
  variants: {
    variant: {
      standard: "bg-surface",
      modal: "h-full overflow-y-auto bg-surface-container-low shadow-1",
      plain: "",
    },
    indicator: {
      secondary: "[--nav-indicator:var(--md-secondary-container)] [--nav-on-indicator:var(--md-on-secondary-container)]",
      tertiary: "[--nav-indicator:var(--md-tertiary-container)] [--nav-on-indicator:var(--md-on-tertiary-container)]",
      primary: "[--nav-indicator:var(--md-primary-container)] [--nav-on-indicator:var(--md-on-primary-container)]",
    },
  },
  defaultVariants: { variant: "standard", indicator: "secondary" },
})

export interface NavigationDrawerProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** 48dp items instead of 56dp. */
  dense?: boolean
  indicator?: "secondary" | "tertiary" | "primary"
  /** `plain` drops the container color/padding so you can host items anywhere. */
  variant?: "standard" | "modal" | "plain"
}

function useDrawerState(valueProp?: string, defaultValue?: string, onValueChange?: (v: string) => void) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const select = React.useCallback(
    (v: string) => {
      setUncontrolled(v)
      onValueChange?.(v)
    },
    [onValueChange],
  )
  return [valueProp ?? uncontrolled, select] as const
}

/** Standard (inline) navigation drawer. */
function NavigationDrawer({
  value: valueProp,
  defaultValue,
  onValueChange,
  dense = false,
  indicator,
  variant,
  className,
  children,
  "aria-label": ariaLabel = "Main",
  ...props
}: NavigationDrawerProps) {
  const [value, select] = useDrawerState(valueProp, defaultValue, onValueChange)
  const ctx = React.useMemo(() => ({ value, onValueChange: select, dense, level: 0, closeOnSelect: false }), [value, select, dense])
  return (
    <DrawerContext.Provider value={ctx}>
      <nav data-slot="navigation-drawer" aria-label={ariaLabel} className={drawerVariants({ variant, indicator, className })} {...props}>
        {children}
      </nav>
    </DrawerContext.Provider>
  )
}

export interface ModalNavigationDrawerProps
  extends Omit<NavigationDrawerProps, "variant">,
    Pick<ModalOverlayProps, "isOpen" | "defaultOpen" | "onOpenChange"> {
  /** Edge the drawer slides from. */
  side?: "start" | "end"
  /** Keep open after a destination is chosen. */
  keepOpenOnSelect?: boolean
}

/**
 * Modal drawer. Put it in a `DialogTrigger` next to the button that opens it, or control it with
 * `isOpen` / `onOpenChange`.
 */
function ModalNavigationDrawer({
  isOpen,
  defaultOpen,
  onOpenChange,
  side = "start",
  keepOpenOnSelect = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  dense = false,
  indicator,
  className,
  children,
  "aria-label": ariaLabel = "Main",
  ...props
}: ModalNavigationDrawerProps) {
  const [value, select] = useDrawerState(valueProp, defaultValue, onValueChange)
  const ctx = React.useMemo(
    () => ({ value, onValueChange: select, dense, level: 0, closeOnSelect: !keepOpenOnSelect }),
    [value, select, dense, keepOpenOnSelect],
  )
  return (
    <ModalOverlay
      isDismissable
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      className={cn(
        "fixed inset-0 z-50 bg-scrim/32",
        "data-entering:animate-[m3-fade-in_200ms_var(--md-easing-standard)] data-exiting:animate-[m3-fade-out_200ms_var(--md-easing-standard)]",
      )}
    >
      <Modal
        className={cn(
          "fixed inset-y-0 h-full w-[360px] max-w-[calc(100vw-56px)] outline-none",
          side === "start"
            ? "start-0 data-entering:animate-[m3-rail-in_var(--md-spring-default-spatial-duration)_var(--md-spring-default-spatial)] data-exiting:animate-[m3-rail-out_200ms_var(--md-easing-emphasized-accelerate)]"
            : "end-0 data-entering:animate-[m3-rail-in-end_var(--md-spring-default-spatial-duration)_var(--md-spring-default-spatial)] data-exiting:animate-[m3-rail-out-end_200ms_var(--md-easing-emphasized-accelerate)]",
        )}
      >
        <AriaDialog aria-label={ariaLabel} className="h-full outline-none">
          <DrawerContext.Provider value={ctx}>
            <nav
              data-slot="navigation-drawer"
              data-modal
              aria-label={ariaLabel}
              className={drawerVariants({
                variant: "modal",
                indicator,
                className: cn("max-w-none", side === "start" ? "rounded-e-lg" : "rounded-s-lg", className),
              })}
              {...props}
            >
              {children}
            </nav>
          </DrawerContext.Provider>
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  )
}

/** Section headline (title-small). */
function NavigationDrawerHeadline({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="navigation-drawer-headline"
      className={cn("flex min-h-14 shrink-0 items-center px-4 text-title-sm text-on-surface-variant", className)}
      {...props}
    />
  )
}

function NavigationDrawerDivider({ className }: { className?: string }) {
  return <hr className={cn("mx-4 my-2 shrink-0 border-0 border-t border-outline-variant", className)} />
}

const itemVariants = tv({
  base: [
    "group state-layer focus-ring relative flex w-full shrink-0 cursor-pointer items-center gap-3 rounded-full pe-6 text-start text-label-lg outline-none select-none",
    "data-hovered:text-on-surface data-pressed:text-on-surface",
    "data-active:bg-(--nav-indicator) data-active:font-semibold data-active:text-(--nav-on-indicator)",
    "data-disabled:cursor-default data-disabled:opacity-38",
  ],
  variants: {
    dense: { false: "h-14", true: "h-12" },
    level: { 0: "ps-4", 1: "ps-12", 2: "ps-16" },
  },
  defaultVariants: { dense: false, level: 0 },
})

export interface NavigationDrawerItemProps {
  value?: string
  /** Material Symbols name. Nested items usually omit it. */
  icon?: string
  /** Custom leading content (color dot, avatar) instead of an icon. */
  leading?: React.ReactNode
  children: React.ReactNode
  /** Trailing count/text, or `true` for a dot. */
  badge?: number | string | boolean
  badgeLabel?: string
  href?: string
  isActive?: boolean
  isDisabled?: boolean
  onPress?: (e: PressEvent) => void
  className?: string
}

function NavigationDrawerItem({
  value,
  icon,
  leading,
  children,
  badge,
  badgeLabel,
  href,
  isActive: isActiveProp,
  isDisabled,
  onPress,
  className,
}: NavigationDrawerItemProps) {
  const ctx = React.useContext(DrawerContext)
  const overlay = React.useContext(OverlayTriggerStateContext)
  const isActive = isActiveProp ?? (value !== undefined && ctx.value === value)
  const content = (
    <>
      {icon ? (
        <Icon filled={isActive} className="transition-[--icon-fill] duration-(--md-spring-default-effects-duration)">
          {icon}
        </Icon>
      ) : (
        leading
      )}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {badge === true ? (
        <Badge aria-label={badgeLabel} />
      ) : badge !== undefined && badge !== false ? (
        <span aria-label={badgeLabel} className="text-label-lg tabular-nums">
          {badge}
        </span>
      ) : null}
      <Ripple />
    </>
  )
  const shared = {
    "data-slot": "navigation-drawer-item",
    "data-active": isActive || undefined,
    "aria-current": isActive ? ("page" as const) : undefined,
    isDisabled,
    className: itemVariants({ dense: ctx.dense, level: Math.min(ctx.level, 2) as 0 | 1 | 2, className }),
    onPress: (e: PressEvent) => {
      if (value !== undefined) ctx.onValueChange?.(value)
      if (ctx.closeOnSelect) overlay?.close()
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

export interface NavigationDrawerGroupProps {
  title: React.ReactNode
  icon?: string
  defaultExpanded?: boolean
  isExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  children: React.ReactNode
  className?: string
}

/** Collapsible group of nested destinations (RAC Disclosure; height animates on the spatial spring). */
function NavigationDrawerGroup({ title, icon, defaultExpanded, isExpanded, onExpandedChange, children, className }: NavigationDrawerGroupProps) {
  const ctx = React.useContext(DrawerContext)
  const nested = React.useMemo(() => ({ ...ctx, level: ctx.level + 1 }), [ctx])
  return (
    <Disclosure
      data-slot="navigation-drawer-group"
      defaultExpanded={defaultExpanded}
      isExpanded={isExpanded}
      onExpandedChange={onExpandedChange}
      className={cn("group/drawer-group flex shrink-0 flex-col gap-0.5", className)}
    >
      <Heading className="contents">
        <AriaButton
          slot="trigger"
          className={itemVariants({ dense: ctx.dense, level: Math.min(ctx.level, 2) as 0 | 1 | 2, className: "text-title-sm" })}
        >
          {icon && <Icon>{icon}</Icon>}
          <span className="min-w-0 flex-1 truncate">{title}</span>
          <Icon
            size={20}
            className="transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-data-expanded/drawer-group:rotate-180"
          >
            expand_more
          </Icon>
          <Ripple />
        </AriaButton>
      </Heading>
      <DisclosurePanel className="h-(--disclosure-panel-height) overflow-clip transition-[height] duration-(--md-spring-default-spatial-duration) ease-default-spatial motion-reduce:transition-none">
        <div className="flex flex-col gap-0.5">
          <DrawerContext.Provider value={nested}>{children}</DrawerContext.Provider>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

export {
  ModalNavigationDrawer,
  NavigationDrawer,
  NavigationDrawerDivider,
  NavigationDrawerGroup,
  NavigationDrawerHeadline,
  NavigationDrawerItem,
  drawerVariants as navigationDrawerVariants,
}
