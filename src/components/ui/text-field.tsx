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
  type InputProps as AriaInputProps,
  type TextAreaProps as AriaTextAreaProps,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { cn, tv } from "@/lib/utils"

/*
 * Text fields · M3
 * androidx FilledTextFieldTokens / OutlinedTextFieldTokens:
 *   filled    surface-container-highest · CornerExtraSmallTop (4dp) · active indicator 1dp → 2dp primary on focus
 *   outlined  CornerExtraSmall (4dp) · outline 1dp → 2dp primary on focus · notched floating label
 *   height    56dp (density: 48 / 40)
 *
 * <FieldContainer> is the reusable shell (container, indicator/outline, floating label, icons, affixes).
 * Other field-like components (DatePicker, ComboBox, Select) render it inside their React Aria root,
 * so they get identical visuals. Field state comes from the field-* variants in expressive.css.
 */
const fieldContainerVariants = tv({
  slots: {
    container: "group/tf relative flex w-full min-w-0 cursor-text text-on-surface",
    outline: [
      "pointer-events-none absolute inset-x-0 -top-[5px] bottom-0 m-0 min-w-0 rounded-[inherit] border border-outline px-3 text-left",
      "transition-[border-color] duration-(--md-spring-fast-effects-duration) ease-fast-effects",
      // hover is ordered after focus-within in Tailwind, so focus/invalid/disabled colors are !important
      "group-hover/tf:border-on-surface group-focus-within/tf:border-2 group-focus-within/tf:border-primary! group-focus-within/tf:px-[11px]",
      "field-invalid:border-error! field-readonly:border-dashed field-disabled:border-on-surface/12!",
    ],
    legend: [
      "invisible float-none h-[11px] w-auto max-w-[0.01px] overflow-hidden p-0 text-body-sm whitespace-nowrap",
      "transition-[max-width] duration-50 field-float:max-w-full field-float:duration-100",
    ],
    leading: "flex shrink-0 items-center text-on-surface-variant field-disabled:text-on-surface/38",
    trailing: "flex shrink-0 items-center text-on-surface-variant field-invalid:text-error field-disabled:text-on-surface/38",
    row: "flex min-w-0 flex-1 items-center gap-0.5",
    affix: [
      "shrink-0 text-body-lg text-on-surface-variant opacity-0 transition-opacity duration-150 field-float:opacity-100",
      "field-disabled:text-on-surface/38",
    ],
    label: [
      "pointer-events-none absolute top-0 max-w-[calc(100%-2rem)] origin-[left_center] truncate text-body-lg text-on-surface-variant",
      "transition-[translate,scale,color] duration-200 ease-emphasized",
      "group-focus-within/tf:text-primary field-invalid:text-error group-focus-within/tf:field-invalid:text-error field-disabled:text-on-surface/38",
    ],
  },
  variants: {
    variant: {
      filled: {
        container: [
          "rounded-t-xs bg-surface-container-highest",
          // state layer
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-on-surface before:opacity-0 before:transition-opacity before:duration-150",
          "hover:before:opacity-8 field-disabled:before:hidden",
          // active indicator
          "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-on-surface-variant",
          "after:transition-[height,background-color] after:duration-(--md-spring-fast-effects-duration) after:ease-fast-effects",
          "hover:after:bg-on-surface group-focus-within/tf:after:h-0.5 group-focus-within/tf:after:bg-primary!",
          "field-invalid:after:bg-error! field-disabled:bg-on-surface/4 field-disabled:after:bg-on-surface/38!",
        ],
      },
      outlined: { container: "rounded-xs" },
    },
    density: {
      md: { container: "min-h-14", label: "translate-y-4" },
      sm: { container: "min-h-12", label: "translate-y-3" },
      xs: { container: "min-h-10", label: "translate-y-2" },
    },
    multiline: {
      true: { container: "items-start", leading: "pt-4", trailing: "pt-4", label: "translate-y-4" },
      false: { container: "items-stretch" },
    },
    hasLabel: { true: {}, false: {} },
    hasLeading: {
      true: { label: "left-13" },
      false: { label: "left-4", row: "pl-4" },
    },
    hasTrailing: { true: {}, false: { row: "pr-4" } },
    leadingIsIcon: { true: { leading: "pr-4 pl-3" }, false: { leading: "pl-1" } },
    trailingIsIcon: { true: { trailing: "pr-3 pl-4" }, false: { trailing: "pr-1 pl-1" } },
  },
  compoundVariants: [
    // Filled: label floats inside the container, input sits below it
    { variant: "filled", hasLabel: true, density: "md", multiline: false, class: { row: "pt-6 pb-2", label: "field-float:translate-y-1 field-float:scale-75" } },
    { variant: "filled", hasLabel: true, density: ["sm", "xs"], multiline: false, class: { row: "pt-5 pb-1", label: "field-float:-translate-y-0.5 field-float:scale-75" } },
    { variant: "filled", hasLabel: true, multiline: true, class: { row: "pt-6 pb-2", label: "field-float:translate-y-1 field-float:scale-75" } },
    { variant: "filled", hasLabel: false, multiline: true, class: { row: "py-4" } },
    // Outlined: label floats into the notch on the top edge, always aligned to the 16dp start
    { variant: "outlined", class: { label: "field-float:-translate-y-3 field-float:scale-75" } },
    { variant: "outlined", hasLeading: true, class: { label: "field-float:-translate-x-9" } },
    { variant: "outlined", multiline: true, class: { row: "py-4" } },
  ],
  defaultVariants: {
    variant: "outlined",
    density: "md",
    multiline: false,
    hasLabel: false,
    hasLeading: false,
    hasTrailing: false,
    leadingIsIcon: true,
    trailingIsIcon: true,
  },
})

type FieldStyleProps = Pick<VariantProps<typeof fieldContainerVariants>, "variant" | "density">

export interface FieldContainerProps extends FieldStyleProps {
  /** Floating label (rendered as a React Aria <Label>, so it labels the enclosing field). */
  label?: React.ReactNode
  /** Icon name (string) or a node such as an <IconButton>. */
  leading?: React.ReactNode
  trailing?: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  /** Force the floated label (e.g. a date input that always shows segments). */
  populated?: boolean
  multiline?: boolean
  className?: string
  children: React.ReactNode
}

/** The M3 text-field shell. Put an input-like control in `children`; place it inside a React Aria field root. */
function FieldContainer({
  variant = "outlined",
  density = "md",
  label,
  leading,
  trailing,
  prefix,
  suffix,
  populated,
  multiline = false,
  className,
  children,
}: FieldContainerProps) {
  const s = fieldContainerVariants({
    variant,
    density,
    multiline,
    hasLabel: !!label,
    hasLeading: leading != null,
    hasTrailing: trailing != null,
    leadingIsIcon: typeof leading === "string",
    trailingIsIcon: typeof trailing === "string",
  })

  // Clicks on padding / label focus the control, like a native field.
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement
    if (t.closest("input, textarea, button, a, [role=button], [role=spinbutton]")) return
    const control = e.currentTarget.querySelector<HTMLElement>("input, textarea, [role=spinbutton], button")
    if (control) {
      e.preventDefault()
      control.focus()
    }
  }

  return (
    <div
      data-slot="field-container"
      data-variant={variant}
      data-populated={populated || undefined}
      data-has-label={label ? "" : undefined}
      className={s.container({ className })}
      onMouseDown={onMouseDown}
    >
      {variant === "outlined" && (
        <fieldset aria-hidden className={s.outline()}>
          <legend className={s.legend()}>{label && <span className="px-1">{label}</span>}</legend>
        </fieldset>
      )}
      {leading != null && (
        <span data-slot="field-leading" className={s.leading()}>
          {typeof leading === "string" ? <Icon>{leading}</Icon> : leading}
        </span>
      )}
      <div data-slot="field-row" className={s.row()}>
        {prefix != null && <span className={s.affix()}>{prefix}</span>}
        {children}
        {suffix != null && <span className={s.affix()}>{suffix}</span>}
      </div>
      {trailing != null && (
        <span data-slot="field-trailing" className={s.trailing()}>
          {typeof trailing === "string" ? <Icon>{trailing}</Icon> : trailing}
        </span>
      )}
      {label && <AriaLabel className={s.label()}>{label}</AriaLabel>}
    </div>
  )
}

const controlClass = cn(
  "w-full min-w-0 flex-1 bg-transparent text-body-lg text-on-surface outline-none",
  "caret-primary field-invalid:caret-error disabled:cursor-default field-disabled:text-on-surface/38",
  "placeholder:text-on-surface-variant in-data-has-label:placeholder:text-transparent group-focus-within/tf:placeholder:text-on-surface-variant",
  "placeholder:transition-colors [&::-webkit-search-cancel-button]:appearance-none",
)

/** Bare input for <FieldContainer>. Keeps a " " placeholder so the label can float on :placeholder-shown. */
function FieldInput({ className, placeholder, ...props }: AriaInputProps) {
  return (
    <AriaInput
      data-slot="field-input"
      placeholder={placeholder || " "}
      {...props}
      className={composeRenderProps(className, (className) => cn(controlClass, className))}
    />
  )
}

function FieldTextArea({ className, placeholder, rows = 3, ...props }: AriaTextAreaProps) {
  return (
    <AriaTextArea
      data-slot="field-textarea"
      placeholder={placeholder || " "}
      rows={rows}
      {...props}
      className={composeRenderProps(className, (className) => cn(controlClass, "resize-y", className))}
    />
  )
}

export interface FieldSupportingTextProps {
  description?: React.ReactNode
  errorMessage?: React.ReactNode | ((v: ValidationResult) => React.ReactNode)
  /** Shown at the end of the row, e.g. "12 / 500". */
  counter?: React.ReactNode
  className?: string
}

/** Supporting row under a field: description (replaced by the error when invalid) and an optional counter. */
function FieldSupportingText({ description, errorMessage, counter, className }: FieldSupportingTextProps) {
  // Nothing custom to show: still render FieldError so built-in validation (isRequired, validate,
  // minLength, type="email"…) surfaces its message. It renders nothing while the field is valid.
  if (description == null && errorMessage == null && counter == null)
    return <AriaFieldError className={cn("block px-4 pt-1 text-body-sm text-error", className)} />
  return (
    <div
      data-slot="field-supporting"
      className={cn("flex gap-4 px-4 pt-1 text-body-sm text-on-surface-variant field-disabled:text-on-surface/38", className)}
    >
      <div className="min-w-0 flex-1">
        {description != null && (
          <AriaText slot="description" className={cn("block", errorMessage != null && "field-invalid:hidden")}>
            {description}
          </AriaText>
        )}
        <AriaFieldError className="block text-error">{errorMessage}</AriaFieldError>
      </div>
      {counter != null && <span className="shrink-0 tabular-nums field-invalid:text-error">{counter}</span>}
    </div>
  )
}

export interface TextFieldProps extends Omit<AriaTextFieldProps, "children" | "className">, FieldStyleProps {
  label?: React.ReactNode
  description?: React.ReactNode
  errorMessage?: React.ReactNode | ((v: ValidationResult) => React.ReactNode)
  placeholder?: string
  /** Icon name or node (e.g. an IconButton). Invalid fields show an error icon when no trailing is given. */
  leading?: React.ReactNode
  trailing?: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  /** Render a <textarea>. */
  multiline?: boolean
  rows?: number
  /** Show "n / maxLength" (requires maxLength). */
  showCount?: boolean
  className?: string
  containerClassName?: string
  inputClassName?: string
}

/**
 * M3 text field. Filled or outlined, floating label, icons, prefix/suffix,
 * supporting text, error, counter, multiline.
 *
 * <TextField variant="filled" label="Email" type="email" description="We'll never share it" />
 */
function TextField({
  variant = "outlined",
  density = "md",
  label,
  description,
  errorMessage,
  placeholder,
  leading,
  trailing,
  prefix,
  suffix,
  multiline = false,
  rows,
  showCount = false,
  className,
  containerClassName,
  inputClassName,
  ...props
}: TextFieldProps) {
  const isControlled = props.value !== undefined
  const [length, setLength] = React.useState(() => (props.value ?? props.defaultValue ?? "").length)
  const currentLength = isControlled ? (props.value ?? "").length : length

  const trailingNode =
    trailing ??
    (props.isInvalid ? (
      <Icon filled className="text-error">
        error
      </Icon>
    ) : undefined)

  return (
    <AriaTextField
      data-slot="text-field"
      {...props}
      onChange={(v) => {
        if (!isControlled) setLength(v.length)
        props.onChange?.(v)
      }}
      className={cn("group/field flex w-full flex-col", className)}
    >
      <FieldContainer
        variant={variant}
        density={density}
        label={label}
        leading={leading}
        trailing={trailingNode}
        prefix={prefix}
        suffix={suffix}
        multiline={multiline}
        className={containerClassName}
      >
        {multiline ? (
          <FieldTextArea placeholder={placeholder} rows={rows} className={inputClassName} />
        ) : (
          <FieldInput placeholder={placeholder} className={inputClassName} />
        )}
      </FieldContainer>
      <FieldSupportingText
        description={description}
        errorMessage={errorMessage}
        counter={showCount && props.maxLength ? `${currentLength} / ${props.maxLength}` : undefined}
      />
    </AriaTextField>
  )
}

export { FieldContainer, FieldInput, FieldSupportingText, FieldTextArea, TextField, fieldContainerVariants }
