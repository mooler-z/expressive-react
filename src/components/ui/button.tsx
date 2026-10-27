"use client"

import type { ReactNode, Ref } from "react"
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Ripple } from "@/components/ui/ripple"
import { tv } from "@/lib/utils"

/*
 * Common buttons · M3 Expressive
 * Five color styles × five sizes (XS 32 · S 40 · M 56 · L 96 · XL 136), round or square.
 * Shapes follow androidx ButtonXxxTokens / ToggleButtonDefaults:
 *   resting   round = full · square = 12 / 12 / 16 / 28 / 28
 *   pressed   8 / 8 / 12 / 16 / 16 (round and square alike)
 *   selected  square radius, whatever the resting shape (toggle buttons)
 * Morphs ride the M3 Expressive FastSpatial spring (shape-morph utility).
 */
const buttonVariants = tv({
  base: [
    "state-layer focus-ring relative inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap select-none",
    "shape-morph",
    "data-pending:cursor-wait data-disabled:cursor-default",
  ],
  variants: {
    variant: {
      elevated: "bg-surface-container-low text-primary shadow-1 data-hovered:shadow-2",
      filled: "bg-primary text-on-primary data-hovered:shadow-1",
      tonal: "bg-secondary-container text-on-secondary-container data-hovered:shadow-1",
      outlined: "border border-outline-variant text-on-surface-variant",
      text: "text-primary",
    },
    size: {
      xs: "h-8 gap-1 px-3 text-label-lg [--icon-size:20px] data-pressed:rounded-[8px]",
      sm: "h-10 gap-2 px-4 text-label-lg [--icon-size:20px] data-pressed:rounded-[8px]",
      md: "h-14 gap-2 px-6 text-title-md [--icon-size:24px] data-pressed:rounded-[12px]",
      lg: "h-24 gap-3 px-12 text-headline-sm [--icon-size:32px] data-pressed:rounded-[16px]",
      xl: "h-[136px] gap-4 px-16 text-headline-lg [--icon-size:40px] data-pressed:rounded-[16px]",
    },
    shape: {
      round: "",
      square: "",
    },
    /** Accent role. Omit for the M3 defaults (primary; tonal uses secondary). */
    color: { primary: "", secondary: "", tertiary: "", error: "" },
    /** Set by <ToggleButton>; swaps in the selected/unselected color pairs. */
    toggle: {
      true: "data-selected:[--icon-fill:1]",
      false: "",
    },
  },
  compoundVariants: [
    // Resting corners · round = half the height so the morph animates from the first frame
    { shape: "round", size: "xs", class: "rounded-[16px]" },
    { shape: "round", size: "sm", class: "rounded-[20px]" },
    { shape: "round", size: "md", class: "rounded-[28px]" },
    { shape: "round", size: "lg", class: "rounded-[48px]" },
    { shape: "round", size: "xl", class: "rounded-[68px]" },
    { shape: "square", size: ["xs", "sm"], class: "rounded-[12px]" },
    { shape: "square", size: "md", class: "rounded-[16px]" },
    { shape: "square", size: ["lg", "xl"], class: "rounded-[28px]" },

    // Toggle · selected takes the square radius (ToggleButtonDefaults.checkedShape)
    { toggle: true, shape: "round", size: ["xs", "sm"], class: "data-selected:not-data-pressed:rounded-[12px]" },
    { toggle: true, shape: "round", size: "md", class: "data-selected:not-data-pressed:rounded-[16px]" },
    { toggle: true, shape: "round", size: ["lg", "xl"], class: "data-selected:not-data-pressed:rounded-[28px]" },

    // Toggle · color pairs (unselected → selected)
    { toggle: true, variant: "elevated", class: "data-selected:bg-primary data-selected:text-on-primary" },
    { toggle: true, variant: "filled", class: "bg-surface-container text-on-surface-variant data-selected:bg-primary data-selected:text-on-primary" },
    { toggle: true, variant: "tonal", class: "data-selected:bg-secondary data-selected:text-on-secondary" },
    { toggle: true, variant: "outlined", class: "data-selected:border-transparent data-selected:bg-inverse-surface data-selected:text-inverse-on-surface" },
    { toggle: true, variant: "text", class: "text-on-surface-variant data-selected:text-primary" },

    { variant: "text", size: ["xs", "sm"], class: "px-3" },

    // color · filled → solid role, tonal → role container, the rest → role-colored label
    { toggle: false, color: "primary", variant: "filled", class: "bg-primary text-on-primary" },
    { toggle: false, color: "secondary", variant: "filled", class: "bg-secondary text-on-secondary" },
    { toggle: false, color: "tertiary", variant: "filled", class: "bg-tertiary text-on-tertiary" },
    { toggle: false, color: "error", variant: "filled", class: "bg-error text-on-error" },
    { toggle: false, color: "primary", variant: "tonal", class: "bg-primary-container text-on-primary-container" },
    { toggle: false, color: "secondary", variant: "tonal", class: "bg-secondary-container text-on-secondary-container" },
    { toggle: false, color: "tertiary", variant: "tonal", class: "bg-tertiary-container text-on-tertiary-container" },
    { toggle: false, color: "error", variant: "tonal", class: "bg-error-container text-on-error-container" },
    { toggle: false, color: "secondary", variant: ["elevated", "outlined", "text"], class: "text-secondary" },
    { toggle: false, color: "tertiary", variant: ["elevated", "outlined", "text"], class: "text-tertiary" },
    { toggle: false, color: "error", variant: ["elevated", "outlined", "text"], class: "text-error" },

    // Disabled · container on-surface 10%, content on-surface 38%
    { variant: ["elevated", "filled", "tonal"], class: "data-disabled:bg-on-surface/10 data-disabled:text-on-surface/38 data-disabled:shadow-none" },
    { variant: "outlined", class: "data-disabled:border-on-surface/12 data-disabled:text-on-surface/38" },
    { variant: "text", class: "data-disabled:text-on-surface/38" },
  ],
  defaultVariants: {
    variant: "filled",
    size: "sm",
    shape: "round",
    toggle: false,
  },
})

type ButtonStyleProps = Omit<VariantProps<typeof buttonVariants>, "toggle">

const pendingSize = { xs: 18, sm: 20, md: 24, lg: 32, xl: 40 } as const

interface ButtonSlots {
  /** Leading icon, e.g. `<Icon name="add" />`. Replaced by the loading indicator while pending. */
  icon?: ReactNode
  /** Trailing icon, e.g. `<Icon name="arrow_forward" />`. */
  trailingIcon?: ReactNode
}

export interface ButtonProps extends AriaButtonProps, ButtonStyleProps, ButtonSlots {
  ref?: Ref<HTMLButtonElement>
}

function Button({ className, variant, size, shape, color, icon, trailingIcon, children, ...props }: ButtonProps) {
  return (
    <AriaButton
      data-slot="button"
      {...props}
      className={composeRenderProps(className, (className) =>
        buttonVariants({ variant, size, shape, color, className }),
      )}
    >
      {composeRenderProps(children, (children, { isPending }) => (
        <>
          {isPending ? (
            <LoadingIndicator aria-hidden size={pendingSize[size ?? "sm"]} className="-my-1 text-current" />
          ) : (
            icon
          )}
          {children}
          {trailingIcon}
          <Ripple />
        </>
      ))}
    </AriaButton>
  )
}

export interface ToggleButtonProps extends AriaToggleButtonProps, ButtonStyleProps, ButtonSlots {
  ref?: Ref<HTMLButtonElement>
}

/** Selectable button. Round ⇄ square shape morph plus the M3 selected color pair. */
function ToggleButton({ className, variant, size, shape, color, icon, trailingIcon, children, ...props }: ToggleButtonProps) {
  return (
    <AriaToggleButton
      data-slot="toggle-button"
      {...props}
      className={composeRenderProps(className, (className) =>
        buttonVariants({ variant, size, shape, color, toggle: true, className }),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          {icon}
          {children}
          {trailingIcon}
          <Ripple />
        </>
      ))}
    </AriaToggleButton>
  )
}

export { Button, ToggleButton, buttonVariants }
