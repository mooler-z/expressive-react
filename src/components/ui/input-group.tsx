"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Group as AriaGroup,
  Input as AriaInput,
  TextArea as AriaTextArea,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type GroupProps as AriaGroupProps,
  type InputProps as AriaInputProps,
  type TextAreaProps as AriaTextAreaProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Input group · addons attached to a field
 * Static prefixes/suffixes on surface-container, inline action buttons, selects joined to an input.
 * Outlined (4dp, 1dp outline → 2dp primary ring on focus) or pill (surface-container-high, full corners).
 *
 * <TextField>                                   // react-aria-components TextField, or <Field> from field.tsx
 *   <FieldLabel>Custom domain</FieldLabel>
 *   <InputGroup>
 *     <InputGroupAddon>https://</InputGroupAddon>
 *     <InputGroupInput />
 *     <InputGroupAddon align="end">.kestrel.io</InputGroupAddon>
 *   </InputGroup>
 * </TextField>
 */
const inputGroupVariants = tv({
  base: [
    "group/ig flex w-full min-w-0 items-stretch overflow-hidden text-on-surface",
    "transition-[border-color,box-shadow] duration-(--md-spring-fast-effects-duration) ease-fast-effects",
    "data-disabled:opacity-38",
  ],
  variants: {
    variant: {
      outlined: [
        "rounded-xs border border-outline data-hovered:border-on-surface",
        "data-focus-within:border-primary data-focus-within:ring-1 data-focus-within:ring-primary data-focus-within:ring-inset",
        "data-invalid:border-2 data-invalid:border-error data-invalid:ring-0",
      ],
      pill: [
        "items-center gap-2 rounded-full bg-surface-container-high pr-1.5 pl-5",
        "data-focus-within:ring-2 data-focus-within:ring-primary data-invalid:ring-2 data-invalid:ring-error",
      ],
    },
    size: { md: "h-14", sm: "h-12", auto: "h-auto flex-col" },
  },
  defaultVariants: { variant: "outlined", size: "md" },
})

export interface InputGroupProps extends AriaGroupProps, VariantProps<typeof inputGroupVariants> {}

function InputGroup({ className, variant, size, ...props }: InputGroupProps) {
  return (
    <AriaGroup
      data-slot="input-group"
      data-variant={variant ?? "outlined"}
      {...props}
      className={composeRenderProps(className, (className) => inputGroupVariants({ variant, size, className }))}
    />
  )
}

const addonVariants = tv({
  base: "flex shrink-0 items-center gap-1 text-body-lg text-on-surface-variant [--icon-size:20px] group-data-invalid/ig:text-error",
  variants: {
    variant: {
      /** Tonal block with a divider: https://, $, units */
      container: "bg-surface-container px-4 group-data-invalid/ig:border-error/40",
      /** Bare icon or text sitting inside the field */
      plain: "px-0 first:pl-3 last:pr-3",
    },
    align: { start: "", end: "" },
  },
  compoundVariants: [
    { variant: "container", align: "start", class: "border-r border-outline" },
    { variant: "container", align: "end", class: "border-l border-outline" },
  ],
  defaultVariants: { variant: "container", align: "start" },
})

export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof addonVariants> {}

function InputGroupAddon({ className, variant, align, ...props }: InputGroupAddonProps) {
  return <span data-slot="input-group-addon" className={addonVariants({ variant, align, className })} {...props} />
}

function InputGroupInput({ className, ...props }: AriaInputProps) {
  return (
    <AriaInput
      data-slot="input-group-input"
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "w-full min-w-0 flex-1 bg-transparent px-4 text-body-lg text-on-surface caret-primary outline-none placeholder:text-on-surface-variant",
          "group-data-[variant=pill]/ig:px-0 data-invalid:caret-error disabled:cursor-default",
          className,
        ),
      )}
    />
  )
}

function InputGroupTextArea({ className, rows = 3, ...props }: AriaTextAreaProps) {
  return (
    <AriaTextArea
      data-slot="input-group-textarea"
      rows={rows}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "block w-full resize-none bg-transparent px-4 py-3 text-body-lg text-on-surface caret-primary outline-none placeholder:text-on-surface-variant",
          className,
        ),
      )}
    />
  )
}

/** Flat action that fills the group's height (e.g. a scope picker or show/hide toggle). For icon actions, <IconButton> also fits. */
function InputGroupButton({ className, children, ...props }: AriaButtonProps) {
  return (
    <AriaButton
      data-slot="input-group-button"
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "state-layer focus-ring flex shrink-0 cursor-pointer items-center gap-1 px-3 text-body-md text-on-surface [--icon-size:20px]",
          "data-disabled:cursor-default data-disabled:text-on-surface/38",
          className,
        ),
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

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextArea, inputGroupVariants }
