"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  Link as AriaLink,
  Modal,
  ModalOverlay,
  type PressEvent,
} from "react-aria-components"

import { Badge, BadgeAnchor } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Navigation rail · M3 Expressive (androidx NavigationRail{Collapsed,Expanded,VerticalItem,HorizontalItem,Color}Tokens)
 *   collapsed  96dp wide (80 narrow) · surface · vertical items: indicator 32×56, 4dp to a label-medium label
 *   expanded   220–360dp · horizontal items: 56dp high full-radius indicator, 16dp leading, 8dp icon-label, label-large
 *   modal      expanded rail floats over content: surface-container, 16dp end corners, elevation 2, scrim
 *   colors     active: indicator secondary-container, icon on-secondary-container, label secondary (collapsed)
 * Collapsed ⇄ expanded is one component: width rides the DefaultSpatial spring, items swap layout.
 */

interface RailContextValue {
  value?: string
  onValueChange?: (value: string) => void
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  /** Inside the modal copy: selecting an item also closes the modal. */
  inModal: boolean
}

const RailContext = React.createContext<RailContextValue>({ expanded: false, setExpanded: () => {}, inModal: false })

/** Read rail state (e.g. to show content only when expanded). */
function useNavigationRail() {
  return React.useContext(RailContext)
}

const railVariants = tv({
  base: [
    "flex h-full shrink-0 flex-col gap-1 overflow-x-hidden overflow-y-auto pt-3 pb-3 text-on-surface-variant no-scrollbar",
    "transition-[width] duration-(--md-spring-default-spatial-duration) ease-default-spatial",
  ],
  variants: {
    expanded: {
      false: "w-24 items-center px-0",
      true: "w-55 items-stretch px-3",
    },
    narrow: { true: "", false: "" },
    surface: {
      standard: "bg-surface",
      container: "bg-surface-container",
      transparent: "bg-transparent",
    },
    indicator: {
      secondary: "[--nav-indicator:var(--md-secondary-container)] [--nav-on-indicator:var(--md-on-secondary-container)] [--nav-active-label:var(--md-secondary)]",
      tertiary: "[--nav-indicator:var(--md-tertiary-container)] [--nav-on-indicator:var(--md-on-tertiary-container)] [--nav-active-label:var(--md-tertiary)]",
      primary: "[--nav-indicator:var(--md-primary-container)] [--nav-on-indicator:var(--md-on-primary-container)] [--nav-active-label:var(--md-primary)]",
    },
  },
  compoundVariants: [{ expanded: false, narrow: true, class: "w-20" }],
  defaultVariants: { expanded: false, narrow: false, surface: "standard", indicator: "secondary" },
})

export interface NavigationRailProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Expanded rail with inline labels (controlled). */
  expanded?: boolean
  defaultExpanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
  /** Expand as a modal rail over the content (the collapsed rail keeps its place). */
  modal?: boolean
  /** 80dp collapsed width. */
  narrow?: boolean
  surface?: "standard" | "container" | "transparent"
  indicator?: "secondary" | "tertiary" | "primary"
}

function NavigationRail({
  value: valueProp,
  defaultValue,
  onValueChange,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  modal = false,
  narrow,
  surface,
  indicator,
  className,
  children,
  "aria-label": ariaLabel = "Main",
  ...props
}: NavigationRailProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded)
  const value = valueProp ?? uncontrolledValue
  const expanded = expandedProp ?? uncontrolledExpanded

  const setExpanded = React.useCallback(
    (next: boolean) => {
      setUncontrolledExpanded(next)
      onExpandedChange?.(next)
    },
    [onExpandedChange],
  )
  const select = React.useCallback(
    (v: string) => {
      setUncontrolledValue(v)
      onValueChange?.(v)
    },
    [onValueChange],
  )

  const inline = React.useMemo<RailContextValue>(
    () => ({ value, onValueChange: select, expanded: modal ? false : expanded, setExpanded, inModal: false }),
    [value, select, expanded, modal, setExpanded],
  )
  const floating = React.useMemo<RailContextValue>(
    () => ({ value, onValueChange: select, expanded: true, setExpanded, inModal: true }),
    [value, select, setExpanded],
  )

  return (
    <>
      <RailContext.Provider value={inline}>
        <nav
          data-slot="navigation-rail"
          data-expanded={inline.expanded || undefined}
          aria-label={ariaLabel}
          className={railVariants({ expanded: inline.expanded, narrow, surface, indicator, className })}
          {...props}
        >
          {children}
        </nav>
      </RailContext.Provider>
      {modal && (
        <ModalOverlay
          isDismissable
          isOpen={expanded}
          onOpenChange={setExpanded}
          className={cn(
            "fixed inset-0 z-50 bg-scrim/32",
            "data-entering:animate-[m3-fade-in_200ms_var(--md-easing-standard)] data-exiting:animate-[m3-fade-out_150ms_var(--md-easing-standard)]",
          )}
        >
          <Modal
            className={cn(
              "fixed inset-y-0 start-0 h-full outline-none",
              "data-entering:animate-[m3-rail-in_var(--md-spring-default-spatial-duration)_var(--md-spring-default-spatial)]",
              "data-exiting:animate-[m3-rail-out_200ms_var(--md-easing-emphasized-accelerate)]",
            )}
          >
            <AriaDialog aria-label={ariaLabel} className="h-full outline-none">
              <RailContext.Provider value={floating}>
                <nav
                  data-slot="navigation-rail"
                  data-expanded
                  data-modal
                  aria-label={ariaLabel}
                  className={railVariants({
                    expanded: true,
                    surface: "container",
                    indicator,
                    className: "max-w-[360px] min-w-55 rounded-e-lg shadow-2",
                  })}
                >
                  {children}
                </nav>
              </RailContext.Provider>
            </AriaDialog>
          </Modal>
        </ModalOverlay>
      )}
    </>
  )
}

/** Top block: menu button and FAB. 44dp top space above the first destination. */
function NavigationRailHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useNavigationRail()
  return (
    <div
      data-slot="navigation-rail-header"
      className={cn("flex shrink-0 flex-col gap-1 pb-10", expanded ? "items-start" : "items-center", className)}
      {...props}
    />
  )
}

/** Toggles collapsed ⇄ expanded (closes the modal rail). */
function NavigationRailMenuButton({ className, "aria-label": ariaLabel }: { className?: string; "aria-label"?: string }) {
  const { expanded, setExpanded } = useNavigationRail()
  return (
    <AriaButton
      aria-label={ariaLabel ?? (expanded ? "Collapse navigation" : "Expand navigation")}
      aria-expanded={expanded}
      onPress={() => setExpanded(!expanded)}
      className={cn(
        "state-layer focus-ring relative inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface-variant",
        expanded && "ms-1",
        className,
      )}
    >
      <Icon>{expanded ? "menu_open" : "menu"}</Icon>
      <Ripple />
    </AriaButton>
  )
}

const fabTones = {
  primary: "bg-primary-container text-on-primary-container",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
} as const

export interface NavigationRailFabProps {
  icon: string
  /** Shown when expanded (extended FAB); the accessible name when collapsed. */
  label: string
  tone?: keyof typeof fabTones
  onPress?: (e: PressEvent) => void
  className?: string
}

/** 56dp FAB collapsed, extended FAB with label when expanded. */
function NavigationRailFab({ icon, label, tone = "primary", onPress, className }: NavigationRailFabProps) {
  const { expanded } = useNavigationRail()
  return (
    <AriaButton
      aria-label={expanded ? undefined : label}
      onPress={onPress}
      className={cn(
        "state-layer focus-ring shape-morph relative mt-1 inline-flex h-14 shrink-0 cursor-pointer items-center rounded-lg text-label-lg shadow-1 data-hovered:shadow-2",
        "data-pressed:rounded-[12px]",
        fabTones[tone],
        expanded ? "gap-3 pr-5 pl-4" : "w-14 justify-center",
        className,
      )}
    >
      <Icon>{icon}</Icon>
      {expanded && <span className="truncate">{label}</span>}
      <Ripple />
    </AriaButton>
  )
}

/** Section headline; only visible in the expanded rail. */
function NavigationRailSection({ title, className, children }: { title: React.ReactNode; className?: string; children?: React.ReactNode }) {
  const { expanded } = useNavigationRail()
  return (
    <div role="group" aria-label={typeof title === "string" ? title : undefined} className={cn("flex flex-col gap-1", !expanded && "items-center", className)}>
      {expanded ? (
        <div className="flex h-12 shrink-0 items-center px-4 text-title-sm text-on-surface-variant">{title}</div>
      ) : (
        <div aria-hidden className="mx-auto my-2 h-px w-8 bg-outline-variant first:hidden" />
      )}
      {children}
    </div>
  )
}

/** Pushes the following items to the bottom of the rail. */
function NavigationRailSpacer() {
  return <span aria-hidden className="flex-1" />
}

const itemVariants = tv({
  slots: {
    root: "group relative flex shrink-0 cursor-pointer outline-none select-none data-disabled:cursor-default data-disabled:opacity-38",
    indicator: "relative isolate grid shrink-0 place-items-center",
    pill: [
      "absolute inset-0 -z-10 rounded-full bg-(--nav-indicator) opacity-0",
      "transition-[scale,opacity] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
      "group-data-active:scale-x-100 group-data-active:opacity-100",
    ],
    layer: [
      "pointer-events-none absolute inset-0 rounded-full bg-current opacity-0 transition-opacity duration-150",
      "group-data-hovered:opacity-8 group-data-focus-visible:opacity-10 group-data-pressed:opacity-12",
      "group-data-focus-visible:outline-3 group-data-focus-visible:outline-offset-2 group-data-focus-visible:outline-secondary",
    ],
    icon: "group-data-active:text-(--nav-on-indicator)",
    label: "truncate",
  },
  variants: {
    expanded: {
      false: {
        root: "w-full flex-col items-center gap-1 py-1",
        indicator: "h-8 w-14",
        pill: "scale-x-[.32]",
        label: "max-w-full px-1 text-label-md group-data-active:font-semibold group-data-active:text-(--nav-active-label)",
      },
      true: {
        root: "h-14 w-full",
        indicator: "h-14 w-full grid-flow-col justify-start gap-2 ps-4 pe-6",
        pill: "origin-left scale-x-[.6]",
        label: "text-start text-label-lg group-data-active:font-semibold group-data-active:text-(--nav-on-indicator)",
      },
    },
  },
})

export interface NavigationRailItemProps {
  value?: string
  /** Material Symbols name (fills when active), or your own 24dp element such as a logo. */
  icon: string | React.ReactElement
  label: React.ReactNode
  /** Count, short text, or `true` for the dot. */
  badge?: number | string | boolean
  badgeLabel?: string
  href?: string
  isActive?: boolean
  isDisabled?: boolean
  onPress?: (e: PressEvent) => void
  className?: string
}

function NavigationRailItem({
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
}: NavigationRailItemProps) {
  const ctx = useNavigationRail()
  const isActive = isActiveProp ?? (value !== undefined && ctx.value === value)
  const s = itemVariants({ expanded: ctx.expanded })
  const count = typeof badge === "boolean" ? undefined : badge

  const glyph =
    typeof icon === "string" ? (
      <Icon filled={isActive} className="transition-[--icon-fill] duration-(--md-spring-default-effects-duration)">
        {icon}
      </Icon>
    ) : (
      icon
    )
  const content = ctx.expanded ? (
    <span className={s.indicator()}>
      <span aria-hidden className={s.pill()} />
      <span className={s.icon()}>{glyph}</span>
      <span className={s.label()}>{label}</span>
      {count !== undefined ? (
        <span aria-label={badgeLabel} className="ms-auto ps-3 text-label-lg tabular-nums group-data-active:text-(--nav-on-indicator)">
          {count}
        </span>
      ) : badge === true ? (
        <Badge aria-label={badgeLabel} className="ms-auto" />
      ) : null}
      <span aria-hidden className={s.layer()} />
      <Ripple />
    </span>
  ) : (
    <>
      <span className={s.indicator()}>
        <span aria-hidden className={s.pill()} />
        <BadgeAnchor count={count} dot={badge === true} badgeLabel={badgeLabel} className={s.icon()}>
          {glyph}
        </BadgeAnchor>
        <span aria-hidden className={s.layer()} />
        <Ripple />
      </span>
      <span className={s.label()}>{label}</span>
    </>
  )

  const shared = {
    "data-slot": "navigation-rail-item",
    "data-active": isActive || undefined,
    "aria-current": isActive ? ("page" as const) : undefined,
    isDisabled,
    className: s.root({ className }),
    onPress: (e: PressEvent) => {
      if (value !== undefined) ctx.onValueChange?.(value)
      if (ctx.inModal) ctx.setExpanded(false)
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

export {
  NavigationRail,
  NavigationRailFab,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailMenuButton,
  NavigationRailSection,
  NavigationRailSpacer,
  railVariants as navigationRailVariants,
  useNavigationRail,
}
