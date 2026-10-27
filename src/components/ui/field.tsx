"use client"

import * as React from "react"
import {
  FieldError as AriaFieldError,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  composeRenderProps,
  type FieldErrorProps as AriaFieldErrorProps,
  type InputProps as AriaInputProps,
  type LabelProps as AriaLabelProps,
  type TextAreaProps as AriaTextAreaProps,
  type TextFieldProps as AriaTextFieldProps,
  type TextProps as AriaTextProps,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { cn, tv } from "@/lib/utils"

/*
 * Field & label · form anatomy with external labels
 * label-large label (required mark in the error role) · control · body-small description or error ·
 * fieldset groups · horizontal layout for settings pages.
 *
 * <Field>
 *   <FieldLabel isRequired>Workspace name</FieldLabel>
 *   <Input />
 *   <FieldDescription>Shown in the sidebar and on invoices.</FieldDescription>
 *   <FieldError />
 * </Field>
 */

export interface FieldProps extends AriaTextFieldProps {
  /** horizontal: label column + control column (settings pages). */
  orientation?: "vertical" | "horizontal"
}

/** A text field with an external label. Wraps React Aria's TextField, so label/description/error are wired up. */
function Field({ className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <AriaTextField
      data-slot="field"
      data-orientation={orientation}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "group/field flex flex-col gap-2",
          orientation === "horizontal" && "md:grid md:grid-cols-[240px_1fr] md:items-start md:gap-x-6",
          className,
        ),
      )}
    />
  )
}

export interface FieldLabelProps extends AriaLabelProps {
  /** Appends a required mark in the error color. */
  isRequired?: boolean
  /** Right-aligned hint, e.g. "Optional". */
  hint?: React.ReactNode
}

function FieldLabel({ className, isRequired, hint, children, ...props }: FieldLabelProps) {
  return (
    <AriaLabel
      data-slot="field-label"
      {...props}
      className={cn(
        "flex items-center gap-1 text-label-lg text-on-surface",
        "group-data-invalid/field:text-error group-data-disabled/field:text-on-surface/38",
        hint != null && "justify-between",
        className,
      )}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {isRequired && (
          <span aria-hidden className="text-error">
            *
          </span>
        )}
      </span>
      {hint != null && <span className="text-body-sm font-normal text-on-surface-variant">{hint}</span>}
    </AriaLabel>
  )
}

function FieldDescription({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      data-slot="field-description"
      slot="description"
      {...props}
      className={cn("text-body-sm text-on-surface-variant", className)}
    />
  )
}

/** Error message with the filled error icon. Renders only while the field is invalid. */
function FieldError({ className, children, ...props }: AriaFieldErrorProps) {
  return (
    <AriaFieldError
      data-slot="field-error"
      {...props}
      className={composeRenderProps(className, (className) => cn("flex items-center gap-1 text-body-sm text-error", className))}
    >
      {composeRenderProps(children, (children, { validationErrors }) => (
        <>
          <Icon size={16} filled>
            error
          </Icon>
          {children ?? validationErrors.join(" ")}
        </>
      ))}
    </AriaFieldError>
  )
}

/*
 * Outlined control without a floating label (the label lives outside, in <FieldLabel>).
 * Sizes follow the text-field densities: 56 / 48 / 40.
 */
const inputVariants = tv({
  base: [
    "w-full min-w-0 rounded-xs border border-outline bg-transparent px-4 text-body-lg text-on-surface outline-none",
    "placeholder:text-on-surface-variant caret-primary",
    "transition-[border-color,box-shadow] duration-(--md-spring-fast-effects-duration) ease-fast-effects",
    "data-hovered:border-on-surface",
    "data-focused:border-primary data-focused:ring-1 data-focused:ring-primary data-focused:ring-inset",
    "data-invalid:border-2 data-invalid:border-error data-invalid:caret-error data-invalid:ring-0",
    "data-disabled:cursor-default data-disabled:border-on-surface/12 data-disabled:text-on-surface/38",
    "[&[readonly]]:border-dashed",
  ],
  variants: {
    size: { md: "h-14", sm: "h-12", xs: "h-10" },
  },
  defaultVariants: { size: "md" },
})

export interface InputProps extends Omit<AriaInputProps, "size"> {
  size?: "md" | "sm" | "xs"
}

function Input({ className, size, ...props }: InputProps) {
  return (
    <AriaInput
      data-slot="input"
      {...props}
      className={composeRenderProps(className, (className) => inputVariants({ size, className }))}
    />
  )
}

function TextArea({ className, rows = 3, ...props }: AriaTextAreaProps) {
  return (
    <AriaTextArea
      data-slot="textarea"
      rows={rows}
      {...props}
      className={composeRenderProps(className, (className) => inputVariants({ className: cn("h-auto py-3", className) }))}
    />
  )
}

/** Groups related controls (checkbox lists, radio sets) under a legend. */
function Fieldset({ className, ...props }: React.FieldsetHTMLAttributes<HTMLFieldSetElement>) {
  return <fieldset data-slot="fieldset" className={cn("m-0 min-w-0 space-y-1 border-0 p-0", className)} {...props} />
}

function FieldLegend({ className, ...props }: React.HTMLAttributes<HTMLLegendElement>) {
  return <legend data-slot="field-legend" className={cn("pb-2 text-label-lg text-on-surface", className)} {...props} />
}

export { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, Fieldset, Input, TextArea, inputVariants }
