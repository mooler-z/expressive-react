"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Floating action buttons · M3 Expressive
 * androidx FabSmall/FabBaseline/FabMedium/FabLarge tokens:
 *   sm 40 · r12 · icon 24      base 56 · r16 · icon 24
 *   md 80 · r20 · icon 28      lg 96 · r28 · icon 36 (Compose notes FabLargeTokens.IconSize 32 is wrong)
 * Elevation level 3, hover level 4. Default color primary-container; secondary/tertiary containers
 * and the solid primary/secondary/tertiary roles are alternates.
 */
const fabVariants = tv({
  base: [
    "state-layer focus-ring shape-morph relative inline-flex shrink-0 cursor-pointer items-center justify-center select-none",
    "shadow-3 data-hovered:shadow-4 data-focus-visible:shadow-3 data-pressed:shadow-3",
    "data-disabled:cursor-default data-disabled:bg-on-surface/10 data-disabled:text-on-surface/38 data-disabled:shadow-none",
  ],
  variants: {
    color: {
      "primary-container": "bg-primary-container text-on-primary-container",
      "secondary-container": "bg-secondary-container text-on-secondary-container",
      "tertiary-container": "bg-tertiary-container text-on-tertiary-container",
      primary: "bg-primary text-on-primary",
      secondary: "bg-secondary text-on-secondary",
      tertiary: "bg-tertiary text-on-tertiary",
      surface: "bg-surface-container-high text-primary",
    },
    size: {
      sm: "size-10 rounded-[12px] [--icon-size:24px]",
      base: "size-14 rounded-[16px] [--icon-size:24px]",
      md: "size-20 rounded-[20px] [--icon-size:28px]",
      lg: "size-24 rounded-[28px] [--icon-size:36px]",
    },
  },
  defaultVariants: { color: "primary-container", size: "base" },
})

type FabStyleProps = VariantProps<typeof fabVariants>

type Labelled = { "aria-label": string } | { "aria-labelledby": string }

export type FabProps = AriaButtonProps & FabStyleProps & Labelled & { ref?: React.Ref<HTMLButtonElement> }

/** Icon-only FAB. Pass an `<Icon>` as the child; an accessible name is required. */
function Fab({ className, color, size, children, ...props }: FabProps) {
  return (
    <AriaButton
      data-slot="fab"
      {...props}
      className={composeRenderProps(className, (className) => fabVariants({ color, size, className }))}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <Ripple />
        </>
      ))}
    </AriaButton>
  )
}

/*
 * Extended FAB · androidx ExtendedFabSmall/Medium/Large tokens:
 *   sm 56 · r16 · pad 16 · gap 8  · icon 24 · title-medium
 *   md 80 · r20 · pad 26 · gap 16 · icon 28 · title-large
 *   lg 96 · r28 · pad 28 · gap 20 · icon 32 · headline-small
 * `expanded={false}` collapses to the icon-only FAB of the same height (FastSpatial spring).
 */
const extendedFabVariants = tv({
  slots: {
    root: [
      "state-layer focus-ring shape-morph relative inline-flex shrink-0 cursor-pointer items-center justify-start overflow-hidden whitespace-nowrap select-none",
      "shadow-3 data-hovered:shadow-4 data-focus-visible:shadow-3 data-pressed:shadow-3",
      "transition-[padding,border-radius,background-color,color,box-shadow] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
      "data-disabled:cursor-default data-disabled:bg-on-surface/10 data-disabled:text-on-surface/38 data-disabled:shadow-none",
    ],
    label: [
      "grid grid-cols-[1fr] transition-[grid-template-columns,opacity,margin] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
      "group-data-[collapsed]/fab:grid-cols-[0fr] group-data-[collapsed]/fab:ml-0 group-data-[collapsed]/fab:opacity-0",
    ],
  },
  variants: {
    color: {
      "primary-container": { root: "bg-primary-container text-on-primary-container" },
      "secondary-container": { root: "bg-secondary-container text-on-secondary-container" },
      "tertiary-container": { root: "bg-tertiary-container text-on-tertiary-container" },
      primary: { root: "bg-primary text-on-primary" },
      secondary: { root: "bg-secondary text-on-secondary" },
      tertiary: { root: "bg-tertiary text-on-tertiary" },
      surface: { root: "bg-surface-container-high text-primary" },
    },
    size: {
      sm: { root: "h-14 rounded-[16px] px-4 text-title-md [--icon-size:24px]", label: "ml-2" },
      md: { root: "h-20 rounded-[20px] px-[26px] text-title-lg [--icon-size:28px]", label: "ml-4" },
      lg: { root: "h-24 rounded-[28px] px-7 text-headline-sm [--icon-size:32px] data-[collapsed]:px-8", label: "ml-5" },
    },
    hasIcon: {
      true: {},
      false: { label: "ml-0" },
    },
  },
  compoundVariants: [
    { hasIcon: false, size: "sm", class: { root: "px-5" } },
  ],
  defaultVariants: { color: "primary-container", size: "sm", hasIcon: true },
})

export interface ExtendedFabProps extends Omit<AriaButtonProps, "children">, Omit<VariantProps<typeof extendedFabVariants>, "hasIcon"> {
  /** Leading icon: a Material Symbols name or a node. */
  icon?: React.ReactNode
  /** The label. Stays in the accessibility tree when collapsed. */
  children: React.ReactNode
  /** Show the label. Animate between true/false to collapse into an icon-only FAB. */
  expanded?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

function ExtendedFab({ className, color, size, icon, expanded = true, children, ...props }: ExtendedFabProps) {
  const { root, label } = extendedFabVariants({ color, size, hasIcon: icon != null })
  return (
    <AriaButton
      data-slot="extended-fab"
      data-collapsed={!expanded || undefined}
      {...props}
      className={composeRenderProps(className, (className) => cn("group/fab", root({ className })))}
    >
      {icon != null && (typeof icon === "string" ? <Icon>{icon}</Icon> : icon)}
      <span className={label()}>
        <span className="min-w-0 overflow-hidden">{children}</span>
      </span>
      <Ripple />
    </AriaButton>
  )
}

/*
 * FAB menu · M3 Expressive (androidx FloatingActionButtonMenu + FabMenuBaselineTokens)
 * The toggle FAB morphs from its size (56/80/96, r16/20/28, primary-container) into a 56dp round close
 * button (primary, 20dp icon). Items are 56dp pills (primary-container, title-medium, 24dp sides,
 * 8dp icon gap, 4dp apart) stacked 8dp above the button; they reveal bottom-up, each growing out
 * from the trailing edge (FastSpatial) while fading in (FastEffects).
 */
const fabMenuVariants = tv({
  slots: {
    anchor: "relative inline-block shrink-0",
    toggle: [
      // Pinned top-end inside the fixed-size anchor (Compose contentAlignment = TopEnd), so the items keep their 8dp gap
      "state-layer focus-ring absolute end-0 top-0 grid cursor-pointer place-items-center shadow-3 select-none data-hovered:shadow-4",
      "transition-[width,height,border-radius,background-color,color,box-shadow] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
      "aria-expanded:size-14 aria-expanded:rounded-[28px] aria-expanded:[--icon-size:20px]",
    ],
    item: [
      "state-layer focus-ring relative inline-flex h-14 shrink-0 cursor-pointer items-center gap-2 self-end rounded-full pr-6 pl-6 text-title-md whitespace-nowrap shadow-3 outline-none select-none",
      "[--icon-size:24px] data-disabled:opacity-38",
    ],
  },
  variants: {
    color: {
      primary: {
        toggle: "bg-primary-container text-on-primary-container aria-expanded:bg-primary aria-expanded:text-on-primary",
        item: "bg-primary-container text-on-primary-container",
      },
      secondary: {
        toggle: "bg-secondary-container text-on-secondary-container aria-expanded:bg-secondary aria-expanded:text-on-secondary",
        item: "bg-secondary-container text-on-secondary-container",
      },
      tertiary: {
        toggle: "bg-tertiary-container text-on-tertiary-container aria-expanded:bg-tertiary aria-expanded:text-on-tertiary",
        item: "bg-tertiary-container text-on-tertiary-container",
      },
    },
    size: {
      base: { anchor: "size-14", toggle: "size-14 rounded-[16px] [--icon-size:24px]" },
      md: { anchor: "size-20", toggle: "size-20 rounded-[20px] [--icon-size:28px]" },
      lg: { anchor: "size-24", toggle: "size-24 rounded-[28px] [--icon-size:36px]" },
    },
  },
  defaultVariants: { color: "primary", size: "base" },
})

type FabMenuContextValue = { color: NonNullable<VariantProps<typeof fabMenuVariants>["color"]>; count: number }
const FabMenuContext = React.createContext<FabMenuContextValue>({ color: "primary", count: 0 })

export interface FabMenuProps<T> extends Omit<AriaMenuProps<T>, "className" | "children">, VariantProps<typeof fabMenuVariants> {
  /** Accessible name for the toggle button, e.g. "New meeting". */
  "aria-label": string
  /** Icon shown while closed. */
  icon?: string
  /** Icon shown while open. */
  closeIcon?: string
  /** Horizontal alignment of the items relative to the button. */
  align?: "end" | "start"
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  className?: string
  children: React.ReactNode
}

function FabMenu<T extends object>({
  "aria-label": ariaLabel,
  icon = "add",
  closeIcon = "close",
  align = "end",
  color,
  size,
  isOpen: isOpenProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...menuProps
}: FabMenuProps<T>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen)
  const isOpen = isOpenProp ?? uncontrolled
  const setOpen = (open: boolean) => {
    setUncontrolled(open)
    onOpenChange?.(open)
  }
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const { anchor, toggle } = fabMenuVariants({ color, size })
  const count = React.Children.count(children)

  return (
    <FabMenuContext.Provider value={{ color: color ?? "primary", count }}>
      <div ref={anchorRef} data-slot="fab-menu" className={cn(anchor(), className)}>
        <AriaMenuTrigger isOpen={isOpen} onOpenChange={setOpen}>
          <AriaButton aria-label={ariaLabel} className={toggle()}>
            <span className="relative grid place-items-center">
              <Icon
                className={cn(
                  "col-start-1 row-start-1 transition-[rotate,opacity] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
                  isOpen && "rotate-90 opacity-0",
                )}
              >
                {icon}
              </Icon>
              <Icon
                className={cn(
                  "col-start-1 row-start-1 transition-[rotate,opacity] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
                  !isOpen && "-rotate-90 opacity-0",
                )}
              >
                {closeIcon}
              </Icon>
            </span>
            <Ripple />
          </AriaButton>
          <AriaPopover
            triggerRef={anchorRef}
            placement={align === "end" ? "top end" : "top start"}
            offset={8}
            className="data-exiting:animate-[m3-fade-out_var(--md-spring-fast-effects-duration)_var(--md-spring-fast-effects)_forwards]"
          >
            <AriaMenu
              {...menuProps}
              data-slot="fab-menu-items"
              className={cn(
                "flex flex-col gap-1 outline-none",
                align === "end" ? "items-end [--fab-clip-from:inset(-12px_-12px_-12px_100%_round_28px)]" : "items-start [--fab-clip-from:inset(-12px_100%_-12px_-12px_round_28px)]",
              )}
            >
              {React.Children.map(children, (child, index) =>
                React.isValidElement<{ index?: number }>(child) ? React.cloneElement(child, { index }) : child,
              )}
            </AriaMenu>
          </AriaPopover>
        </AriaMenuTrigger>
      </div>
    </FabMenuContext.Provider>
  )
}

export interface FabMenuItemProps<T> extends Omit<AriaMenuItemProps<T>, "children"> {
  /** Leading icon: a Material Symbols name or a node. */
  icon?: React.ReactNode
  /** Position in the list (0 = top). Used to stagger the reveal; set automatically when omitted. */
  index?: number
  children: React.ReactNode
}

function FabMenuItem<T extends object>({ className, icon, index, children, textValue, ...props }: FabMenuItemProps<T>) {
  const { color, count } = React.useContext(FabMenuContext)
  const { item } = fabMenuVariants({ color })
  // Bottom item first, ~1/3 of the SlowEffects spring apart.
  const fromBottom = index != null ? count - 1 - index : 0
  return (
    <AriaMenuItem
      data-slot="fab-menu-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      {...props}
      className={composeRenderProps(className, (className) => cn(item(), "fab-menu-item-enter", className))}
      style={{ "--fab-item-delay": `${fromBottom * 45}ms` } as React.CSSProperties}
    >
      {icon != null && (typeof icon === "string" ? <Icon>{icon}</Icon> : icon)}
      {children}
      <Ripple />
    </AriaMenuItem>
  )
}

export { ExtendedFab, Fab, FabMenu, FabMenuItem, extendedFabVariants, fabMenuVariants, fabVariants }
