"use client"

import * as React from "react"
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type MenuProps as AriaMenuProps,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { Menu, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { Ripple } from "@/components/ui/ripple"
import { prefersReducedMotion, springTiming } from "@/hooks/use-motion"
import { cn, tv } from "@/lib/utils"

/* -------------------------------------------------------------------------------------------------
 * Press expansion · androidx ButtonGroup (ButtonGroupDefaults.ExpandedRatio = 0.15, FastSpatial)
 * The pressed child widens by 15% of its width; neighbours give up the same amount, never more than
 * their own inline padding (the "compression limit"), so their content is never clipped.
 * -----------------------------------------------------------------------------------------------*/

/** Attach to a flex container whose direct children are buttons. */
export function usePressExpansion(ref: React.RefObject<HTMLElement | null>, expandedRatio = 0.15) {
  React.useEffect(() => {
    const group = ref.current
    if (!group || expandedRatio <= 0) return

    let release: (() => void) | null = null

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || prefersReducedMotion()) return
      const items = Array.from(group.children).filter(
        (c): c is HTMLElement => c instanceof HTMLElement && getComputedStyle(c).display !== "none",
      )
      const i = items.findIndex((c) => c.contains(e.target as Node))
      if (i < 0 || items.length < 2) return
      if (items[i].matches(':disabled, [data-disabled], [aria-disabled="true"]')) return

      release?.()
      const widths = items.map((c) => c.getBoundingClientRect().width)
      const limit = (c: HTMLElement) => {
        const cs = getComputedStyle(c)
        return Math.min(parseFloat(cs.paddingInlineStart) || 0, parseFloat(cs.paddingInlineEnd) || 0)
      }
      const next = widths.slice()
      const last = items.length - 1
      if (i > 0 && i < last) {
        const g = Math.min((expandedRatio * widths[i]) / 2, limit(items[i - 1]), limit(items[i + 1]))
        next[i - 1] -= g
        next[i + 1] -= g
        next[i] += 2 * g
      } else {
        const n = i === 0 ? 1 : last - 1
        const g = Math.min(expandedRatio * widths[i], limit(items[n]))
        next[n] -= g
        next[i] += g
      }

      const { easing, duration } = springTiming("fast-spatial")
      const animations = items.map((c, k) =>
        widths[k] === next[k]
          ? null
          : c.animate([{ width: `${widths[k]}px` }, { width: `${next[k]}px` }], { duration, easing, fill: "forwards" }),
      )

      release = () => {
        release = null
        items.forEach((c, k) => {
          const pressed = animations[k]
          if (!pressed) return
          const current = c.getBoundingClientRect().width
          const back = c.animate([{ width: `${current}px` }, { width: `${widths[k]}px` }], { duration, easing, fill: "forwards" })
          pressed.cancel()
          back.onfinish = () => back.cancel()
        })
      }
      const done = () => release?.()
      window.addEventListener("pointerup", done, { once: true })
      window.addEventListener("pointercancel", done, { once: true })
    }

    group.addEventListener("pointerdown", onDown)
    return () => group.removeEventListener("pointerdown", onDown)
  }, [ref, expandedRatio])
}

/* -------------------------------------------------------------------------------------------------
 * Standard button group · ButtonGroupSmallTokens: 12dp between (spec: XS 18 · S 12 · M/L/XL 8)
 * -----------------------------------------------------------------------------------------------*/

const buttonGroupVariants = tv({
  base: "inline-flex items-center",
  variants: {
    size: { xs: "gap-[18px]", sm: "gap-3", md: "gap-2", lg: "gap-2", xl: "gap-2" },
    orientation: { horizontal: "flex-row", vertical: "flex-col items-stretch" },
  },
  defaultVariants: { size: "sm", orientation: "horizontal" },
})

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof buttonGroupVariants> {
  /** Share of the pressed button's width it grows by. 0 disables the effect. */
  expandedRatio?: number
}

/** Standard button group: spaced buttons whose neighbours squish when one is pressed. */
function ButtonGroup({ className, size, orientation, expandedRatio = 0.15, ...props }: ButtonGroupProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  usePressExpansion(ref, orientation === "vertical" ? 0 : expandedRatio)
  return (
    <div
      ref={ref}
      role="group"
      data-slot="button-group"
      className={buttonGroupVariants({ size, orientation, className })}
      {...props}
    />
  )
}

/* -------------------------------------------------------------------------------------------------
 * Connected button group · ConnectedButtonGroupSmallTokens
 *   2dp between · outer corners full · inner corners 8 (pressed 4) · selected segment → fully round
 * Only the Small size has androidx tokens; other sizes scale the inner corners (L/XL use 16/12).
 * Colors follow ToggleButtonDefaults: surface-container → primary (filled), etc.
 * -----------------------------------------------------------------------------------------------*/

const connectedButtonVariants = tv({
  base: [
    "state-layer focus-ring shape-morph relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap select-none",
    "data-selected:[--icon-fill:1] data-disabled:cursor-default",
  ],
  variants: {
    variant: {
      filled: "bg-surface-container text-on-surface-variant data-selected:bg-primary data-selected:text-on-primary",
      tonal: "bg-secondary-container text-on-secondary-container data-selected:bg-secondary data-selected:text-on-secondary",
      elevated: "bg-surface-container-low text-primary shadow-1 data-selected:bg-primary data-selected:text-on-primary",
      outlined:
        "border border-outline-variant text-on-surface-variant data-selected:border-transparent data-selected:bg-inverse-surface data-selected:text-inverse-on-surface",
    },
    size: {
      xs: "h-8 gap-1 px-3 text-label-lg [--icon-size:20px] [--full:16px] [--in:8px] [--in-p:4px]",
      sm: "h-10 gap-2 px-4 text-label-lg [--icon-size:20px] [--full:20px] [--in:8px] [--in-p:4px]",
      md: "h-14 gap-2 px-6 text-title-md [--icon-size:24px] [--full:28px] [--in:8px] [--in-p:4px]",
      lg: "h-24 gap-3 px-12 text-headline-sm [--icon-size:32px] [--full:48px] [--in:16px] [--in-p:12px]",
      xl: "h-[136px] gap-4 px-16 text-headline-lg [--icon-size:40px] [--full:68px] [--in:16px] [--in-p:12px]",
    },
    position: {
      only: "rounded-[var(--full)]",
      first:
        "rounded-s-[var(--full)] rounded-e-[var(--in)] data-pressed:rounded-e-[var(--in-p)] data-selected:not-data-pressed:rounded-e-[var(--full)]",
      middle: "rounded-[var(--in)] data-pressed:rounded-[var(--in-p)] data-selected:not-data-pressed:rounded-[var(--full)]",
      last: "rounded-s-[var(--in)] rounded-e-[var(--full)] data-pressed:rounded-s-[var(--in-p)] data-selected:not-data-pressed:rounded-s-[var(--full)]",
    },
    iconOnly: { true: "", false: "" },
  },
  compoundVariants: [
    { iconOnly: true, size: "xs", class: "px-2" },
    { iconOnly: true, size: "sm", class: "px-3" },
    { iconOnly: true, size: "md", class: "px-4" },
    { iconOnly: true, size: ["lg", "xl"], class: "px-8" },
    { variant: ["filled", "tonal", "elevated"], class: "data-disabled:bg-on-surface/10 data-disabled:text-on-surface/38 data-disabled:shadow-none" },
    { variant: "outlined", class: "data-disabled:border-on-surface/12 data-disabled:text-on-surface/38" },
  ],
  defaultVariants: { variant: "filled", size: "sm", position: "middle", iconOnly: false },
})

type ConnectedStyle = Pick<VariantProps<typeof connectedButtonVariants>, "variant" | "size">
const ConnectedContext = React.createContext<ConnectedStyle>({})

type Position = "only" | "first" | "middle" | "last"
const positionOf = (i: number, n: number): Position => (n === 1 ? "only" : i === 0 ? "first" : i === n - 1 ? "last" : "middle")

export interface ConnectedButtonGroupProps extends Omit<AriaToggleButtonGroupProps, "children">, ConnectedStyle {
  children: React.ReactNode
  expandedRatio?: number
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Connected button group: segmented toggle buttons, 2dp apart. The selected segment turns fully round.
 * `selectionMode="single"` (default, one always selected) or `"multiple"`.
 */
function ConnectedButtonGroup({
  className,
  variant,
  size,
  children,
  selectionMode = "single",
  disallowEmptySelection,
  expandedRatio = 0.15,
  ...props
}: ConnectedButtonGroupProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  usePressExpansion(ref, props.orientation === "vertical" ? 0 : expandedRatio)
  const items = React.Children.toArray(children).filter(React.isValidElement)
  return (
    <ConnectedContext.Provider value={{ variant, size }}>
      <AriaToggleButtonGroup
        ref={ref}
        data-slot="connected-button-group"
        selectionMode={selectionMode}
        disallowEmptySelection={disallowEmptySelection ?? selectionMode === "single"}
        {...props}
        className={composeRenderProps(className, (className) =>
          cn("inline-flex gap-0.5 data-[orientation=vertical]:flex-col", className),
        )}
      >
        {items.map((child, i) =>
          React.cloneElement(child as React.ReactElement<{ position?: Position }>, { position: positionOf(i, items.length) }),
        )}
      </AriaToggleButtonGroup>
    </ConnectedContext.Provider>
  )
}

export interface ConnectedButtonProps extends AriaToggleButtonProps {
  /** Set by ConnectedButtonGroup. */
  position?: Position
  /** Tighter padding for icon-only segments (give it an aria-label). */
  iconOnly?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

function ConnectedButton({ className, position, iconOnly, children, ...props }: ConnectedButtonProps) {
  const { variant, size } = React.useContext(ConnectedContext)
  return (
    <AriaToggleButton
      data-slot="connected-button"
      {...props}
      className={composeRenderProps(className, (className) =>
        connectedButtonVariants({ variant, size, position, iconOnly, className }),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <Ripple />
        </>
      ))}
    </AriaToggleButton>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Split button · androidx SplitButton{XSmall…XLarge}Tokens + SplitButtonDefaults
 *   2dp between · outer corners full · inner corners xs/s/m 4, l 8, xl 12
 *   hovered/pressed inner corners xs 8, s/m 12, l/xl 20 · open trailing button → circle, icon turns 180°
 *   leading padding 12/10 · 16/12 · 24/24 · 48/48 · 64/64 · trailing padding 13 · 13 · 15 · 29 · 43
 *   trailing icon 22 · 22 · 26 · 38 · 50
 * -----------------------------------------------------------------------------------------------*/

const splitButtonVariants = tv({
  slots: {
    root: "inline-flex gap-0.5",
    action: [
      "state-layer focus-ring shape-morph relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap select-none",
      "rounded-s-[var(--full)] rounded-e-[var(--in)] data-hovered:rounded-e-[var(--in-h)] data-pressed:rounded-e-[var(--in-h)]",
      "data-disabled:cursor-default",
    ],
    trigger: [
      "group/split state-layer focus-ring shape-morph relative inline-flex shrink-0 cursor-pointer items-center justify-center select-none",
      "rounded-s-[var(--in)] rounded-e-[var(--full)] data-hovered:not-aria-expanded:rounded-s-[var(--in-h)] data-pressed:not-aria-expanded:rounded-s-[var(--in-h)] aria-expanded:rounded-s-[var(--full)]",
      "data-disabled:cursor-default",
    ],
    triggerIcon:
      "transition-[rotate] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-aria-expanded/split:rotate-180",
  },
  variants: {
    variant: {
      filled: { action: "bg-primary text-on-primary", trigger: "bg-primary text-on-primary" },
      tonal: {
        action: "bg-secondary-container text-on-secondary-container",
        trigger: "bg-secondary-container text-on-secondary-container",
      },
      elevated: {
        action: "bg-surface-container-low text-primary shadow-1 data-hovered:shadow-2",
        trigger: "bg-surface-container-low text-primary shadow-1 data-hovered:shadow-2",
      },
      outlined: {
        action: "border border-outline-variant text-on-surface-variant",
        trigger: "border border-outline-variant text-on-surface-variant",
      },
    },
    size: {
      xs: {
        root: "[--full:16px] [--in:4px] [--in-h:8px]",
        action: "h-8 gap-1 ps-3 pe-2.5 text-label-lg [--icon-size:20px]",
        trigger: "h-8 px-[13px] [--icon-size:22px]",
      },
      sm: {
        root: "[--full:20px] [--in:4px] [--in-h:12px]",
        action: "h-10 gap-2 ps-4 pe-3 text-label-lg [--icon-size:20px]",
        trigger: "h-10 px-[13px] [--icon-size:22px]",
      },
      md: {
        root: "[--full:28px] [--in:4px] [--in-h:12px]",
        action: "h-14 gap-2 px-6 text-title-md [--icon-size:24px]",
        trigger: "h-14 px-[15px] [--icon-size:26px]",
      },
      lg: {
        root: "[--full:48px] [--in:8px] [--in-h:20px]",
        action: "h-24 gap-3 px-12 text-headline-sm [--icon-size:32px]",
        trigger: "h-24 px-[29px] [--icon-size:38px]",
      },
      xl: {
        root: "[--full:68px] [--in:12px] [--in-h:20px]",
        action: "h-[136px] gap-4 px-16 text-headline-lg [--icon-size:40px]",
        trigger: "h-[136px] px-[43px] [--icon-size:50px]",
      },
    },
  },
  compoundVariants: [
    {
      variant: ["filled", "tonal", "elevated"],
      class: {
        action: "data-disabled:bg-on-surface/10 data-disabled:text-on-surface/38 data-disabled:shadow-none",
        trigger: "data-disabled:bg-on-surface/10 data-disabled:text-on-surface/38 data-disabled:shadow-none",
      },
    },
    {
      variant: "outlined",
      class: {
        action: "data-disabled:border-on-surface/12 data-disabled:text-on-surface/38",
        trigger: "data-disabled:border-on-surface/12 data-disabled:text-on-surface/38",
      },
    },
  ],
  defaultVariants: { variant: "filled", size: "sm" },
})

type SplitStyle = VariantProps<typeof splitButtonVariants>
const SplitContext = React.createContext<SplitStyle>({})

export interface SplitButtonProps extends React.HTMLAttributes<HTMLDivElement>, SplitStyle {}

/**
 * Split button: a leading action plus a trailing menu button.
 * <SplitButton><SplitButtonAction onPress>…</SplitButtonAction><SplitButtonMenu aria-label>…MenuItems</SplitButtonMenu></SplitButton>
 */
function SplitButton({ className, variant, size, ...props }: SplitButtonProps) {
  const { root } = splitButtonVariants({ variant, size })
  return (
    <SplitContext.Provider value={{ variant, size }}>
      <div role="group" data-slot="split-button" className={root({ className })} {...props} />
    </SplitContext.Provider>
  )
}

export interface SplitButtonActionProps extends AriaButtonProps {
  ref?: React.Ref<HTMLButtonElement>
}

function SplitButtonAction({ className, children, ...props }: SplitButtonActionProps) {
  const { action } = splitButtonVariants(React.useContext(SplitContext))
  return (
    <AriaButton
      data-slot="split-button-action"
      {...props}
      className={composeRenderProps(className, (className) => action({ className }))}
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

export interface SplitButtonMenuProps<T> extends Omit<AriaMenuProps<T>, "aria-label"> {
  /** Accessible name for the trailing button, e.g. "More save options". */
  "aria-label": string
  /** Trailing glyph; rotates 180° while the menu is open. */
  icon?: string
  isDisabled?: boolean
  placement?: React.ComponentProps<typeof MenuPopover>["placement"]
  triggerClassName?: string
}

function SplitButtonMenu<T extends object>({
  "aria-label": ariaLabel,
  icon = "keyboard_arrow_down",
  isDisabled,
  placement = "bottom end",
  triggerClassName,
  ...menuProps
}: SplitButtonMenuProps<T>) {
  const { trigger, triggerIcon } = splitButtonVariants(React.useContext(SplitContext))
  return (
    <MenuTrigger>
      <AriaButton
        data-slot="split-button-trigger"
        aria-label={ariaLabel}
        isDisabled={isDisabled}
        className={trigger({ className: triggerClassName })}
      >
        <Icon className={triggerIcon()}>{icon}</Icon>
        <Ripple />
      </AriaButton>
      <MenuPopover placement={placement}>
        <Menu {...menuProps} />
      </MenuPopover>
    </MenuTrigger>
  )
}

/* -------------------------------------------------------------------------------------------------
 * Segmented buttons · M3 (pre-Expressive) outlined segments, 40dp, a check replaces the icon when
 * selected. Expressive recommends the connected button group instead; kept for parity with the kit.
 * -----------------------------------------------------------------------------------------------*/

export interface SegmentedButtonGroupProps extends Omit<AriaToggleButtonGroupProps, "children"> {
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

function SegmentedButtonGroup({ className, selectionMode = "single", disallowEmptySelection, ...props }: SegmentedButtonGroupProps) {
  return (
    <AriaToggleButtonGroup
      data-slot="segmented-button-group"
      selectionMode={selectionMode}
      disallowEmptySelection={disallowEmptySelection ?? selectionMode === "single"}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn("inline-flex overflow-hidden rounded-full border border-outline", className),
      )}
    />
  )
}

export interface SegmentedButtonProps extends AriaToggleButtonProps {
  /** Leading icon; replaced by a check while selected. */
  icon?: string
  ref?: React.Ref<HTMLButtonElement>
}

function SegmentedButton({ className, icon, children, ...props }: SegmentedButtonProps) {
  return (
    <AriaToggleButton
      data-slot="segmented-button"
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "state-layer relative inline-flex h-10 min-w-12 flex-1 cursor-pointer items-center justify-center gap-2 border-e border-outline px-4 text-label-lg whitespace-nowrap text-on-surface outline-none select-none last:border-e-0",
          "data-focus-visible:outline-3 data-focus-visible:-outline-offset-3 data-focus-visible:outline-secondary",
          "data-selected:bg-secondary-container data-selected:text-on-secondary-container",
          "data-disabled:cursor-default data-disabled:text-on-surface/38",
          className,
        ),
      )}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {isSelected ? <Icon size={18}>check</Icon> : icon ? <Icon size={18}>{icon}</Icon> : null}
          {children}
          <Ripple />
        </>
      ))}
    </AriaToggleButton>
  )
}

export {
  ButtonGroup,
  ConnectedButton,
  ConnectedButtonGroup,
  SegmentedButton,
  SegmentedButtonGroup,
  SplitButton,
  SplitButtonAction,
  SplitButtonMenu,
  buttonGroupVariants,
  connectedButtonVariants,
  splitButtonVariants,
}
