"use client"

import type { Ref } from "react"
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Ripple } from "@/components/ui/ripple"
import { tv } from "@/lib/utils"

/*
 * Icon buttons · M3 Expressive
 * Standard, filled, tonal, outlined · five sizes · narrow / default / wide · round or square · optional toggle.
 * Shapes follow androidx XxxIconButtonTokens:
 *   resting   round = full · square = 12 / 12 / 16 / 28 / 28
 *   pressed   8 / 8 / 12 / 16 / 16
 *   selected  flips the family: round → square radius, square → full
 * Morphs ride the M3 Expressive FastSpatial spring (shape-morph utility).
 */
const iconButtonVariants = tv({
  base: [
    "state-layer focus-ring relative inline-flex shrink-0 cursor-pointer items-center justify-center select-none",
    "shape-morph",
    "data-disabled:cursor-default",
  ],
  variants: {
    variant: {
      standard: "text-on-surface-variant",
      filled: "bg-primary text-on-primary",
      tonal: "bg-secondary-container text-on-secondary-container",
      outlined: "border border-outline-variant text-on-surface-variant",
    },
    size: {
      xs: "h-8 [--icon-size:20px] data-pressed:rounded-[8px]",
      sm: "h-10 [--icon-size:24px] data-pressed:rounded-[8px]",
      md: "h-14 [--icon-size:24px] data-pressed:rounded-[12px]",
      lg: "h-24 [--icon-size:32px] data-pressed:rounded-[16px]",
      xl: "h-[136px] [--icon-size:40px] data-pressed:rounded-[16px]",
    },
    width: { narrow: "", default: "", wide: "" },
    shape: { round: "", square: "" },
    toggle: { true: "data-selected:[--icon-fill:1]", false: "" },
  },
  compoundVariants: [
    // Widths per size
    { size: "xs", width: "narrow", class: "w-7" },
    { size: "xs", width: "default", class: "w-8" },
    { size: "xs", width: "wide", class: "w-10" },
    { size: "sm", width: "narrow", class: "w-8" },
    { size: "sm", width: "default", class: "w-10" },
    { size: "sm", width: "wide", class: "w-13" },
    { size: "md", width: "narrow", class: "w-12" },
    { size: "md", width: "default", class: "w-14" },
    { size: "md", width: "wide", class: "w-18" },
    { size: "lg", width: "narrow", class: "w-16" },
    { size: "lg", width: "default", class: "w-24" },
    { size: "lg", width: "wide", class: "w-32" },
    { size: "xl", width: "narrow", class: "w-26" },
    { size: "xl", width: "default", class: "w-[136px]" },
    { size: "xl", width: "wide", class: "w-46" },

    // Resting corners
    { shape: "round", size: "xs", class: "rounded-[16px]" },
    { shape: "round", size: "sm", class: "rounded-[20px]" },
    { shape: "round", size: "md", class: "rounded-[28px]" },
    { shape: "round", size: "lg", class: "rounded-[48px]" },
    { shape: "round", size: "xl", class: "rounded-[68px]" },
    { shape: "square", size: ["xs", "sm"], class: "rounded-[12px]" },
    { shape: "square", size: "md", class: "rounded-[16px]" },
    { shape: "square", size: ["lg", "xl"], class: "rounded-[28px]" },

    // Toggle · selected flips the shape family
    { toggle: true, shape: "round", size: ["xs", "sm"], class: "data-selected:not-data-pressed:rounded-[12px]" },
    { toggle: true, shape: "round", size: "md", class: "data-selected:not-data-pressed:rounded-[16px]" },
    { toggle: true, shape: "round", size: ["lg", "xl"], class: "data-selected:not-data-pressed:rounded-[28px]" },
    { toggle: true, shape: "square", size: "xs", class: "data-selected:not-data-pressed:rounded-[16px]" },
    { toggle: true, shape: "square", size: "sm", class: "data-selected:not-data-pressed:rounded-[20px]" },
    { toggle: true, shape: "square", size: "md", class: "data-selected:not-data-pressed:rounded-[28px]" },
    { toggle: true, shape: "square", size: "lg", class: "data-selected:not-data-pressed:rounded-[48px]" },
    { toggle: true, shape: "square", size: "xl", class: "data-selected:not-data-pressed:rounded-[68px]" },

    // Toggle · color pairs (unselected → selected)
    { toggle: true, variant: "standard", class: "data-selected:text-primary" },
    { toggle: true, variant: "filled", class: "bg-surface-container text-on-surface-variant data-selected:bg-primary data-selected:text-on-primary" },
    { toggle: true, variant: "tonal", class: "data-selected:bg-secondary data-selected:text-on-secondary" },
    { toggle: true, variant: "outlined", class: "data-selected:border-transparent data-selected:bg-inverse-surface data-selected:text-inverse-on-surface" },

    // Disabled
    { variant: ["filled", "tonal"], class: "data-disabled:bg-on-surface/10 data-disabled:text-on-surface/38" },
    { variant: "outlined", class: "data-disabled:border-on-surface/12 data-disabled:text-on-surface/38" },
    { variant: "standard", class: "data-disabled:text-on-surface/38" },
  ],
  defaultVariants: {
    variant: "standard",
    size: "sm",
    width: "default",
    shape: "round",
    toggle: false,
  },
})

type IconButtonStyleProps = Omit<VariantProps<typeof iconButtonVariants>, "toggle">

/** Icon buttons have no visible text, so an accessible name is required. */
type Labelled = { "aria-label": string } | { "aria-labelledby": string }

export type IconButtonProps = AriaButtonProps & IconButtonStyleProps & Labelled & { ref?: Ref<HTMLButtonElement> }

function IconButton({ className, variant, size, width, shape, children, ...props }: IconButtonProps) {
  return (
    <AriaButton
      data-slot="icon-button"
      {...props}
      className={composeRenderProps(className, (className) =>
        iconButtonVariants({ variant, size, width, shape, className }),
      )}
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

export type ToggleIconButtonProps = AriaToggleButtonProps & IconButtonStyleProps & Labelled & { ref?: Ref<HTMLButtonElement> }

function ToggleIconButton({ className, variant, size, width, shape, children, ...props }: ToggleIconButtonProps) {
  return (
    <AriaToggleButton
      data-slot="toggle-icon-button"
      {...props}
      className={composeRenderProps(className, (className) =>
        iconButtonVariants({ variant, size, width, shape, toggle: true, className }),
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

export { IconButton, ToggleIconButton, iconButtonVariants }
