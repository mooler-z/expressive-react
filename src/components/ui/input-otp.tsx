"use client"

import * as React from "react"
import {
  FieldError as AriaFieldError,
  Input as AriaInput,
  Label as AriaLabel,
  Text as AriaText,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { cn, tv } from "@/lib/utils"

/*
 * Input OTP · one-time codes and PINs
 * 56dp cells (48 on compact), headline-small digits, active cell outlined 2dp primary.
 * One real <input autocomplete="one-time-code"> sits over the cells, so paste, SMS autofill,
 * screen readers and native validation all behave like a single field.
 * tonal: secondary-container circles that morph to the large corner on focus (FastSpatial spring).
 */
const cellVariants = tv({
  base: [
    "shape-morph relative grid shrink-0 place-items-center border text-on-surface tabular-nums",
    "group-data-disabled/otp:opacity-38",
  ],
  variants: {
    variant: {
      outlined: "rounded-md border-outline bg-surface",
      tonal: "rounded-full border-transparent bg-secondary-container text-on-secondary-container",
    },
    size: {
      md: "size-12 text-headline-sm sm:size-14",
      sm: "size-11 text-title-lg sm:size-12",
    },
    active: { true: "border-2 border-primary", false: "" },
    invalid: { true: "border-2 border-error text-error", false: "" },
    /** Cells share the available width (square, min-width 0) instead of a fixed size. */
    fullWidth: { true: "aspect-square size-auto min-w-0 flex-1 sm:size-auto", false: "" },
  },
  compoundVariants: [{ variant: "tonal", active: true, class: "rounded-lg" }],
  defaultVariants: { variant: "outlined", size: "md", active: false, invalid: false, fullWidth: false },
})

const SANITIZE = {
  numeric: (v: string) => v.replace(/\D/g, ""),
  alphanumeric: (v: string) => v.replace(/[^a-z0-9]/gi, "").toUpperCase(),
}

export interface InputOTPProps
  extends Omit<AriaTextFieldProps, "children" | "className" | "maxLength" | "minLength" | "pattern">,
    Pick<VariantProps<typeof cellVariants>, "variant" | "size" | "fullWidth"> {
  /** Number of cells. */
  length?: number
  /** Cell grouping, e.g. [3, 3] renders a dash between two groups of three. Defaults to [3, 3] for 6. */
  groups?: number[]
  /** Accepted characters. */
  pattern?: "numeric" | "alphanumeric"
  /** Show dots instead of characters (PINs). */
  mask?: boolean
  /** Called once every cell is filled. */
  onComplete?: (value: string) => void
  label?: React.ReactNode
  description?: React.ReactNode
  errorMessage?: React.ReactNode | ((v: ValidationResult) => React.ReactNode)
  className?: string
}

function InputOTP({
  length = 6,
  groups,
  pattern = "numeric",
  mask = false,
  variant,
  size,
  fullWidth = false,
  onComplete,
  label,
  description,
  errorMessage,
  className,
  value: valueProp,
  defaultValue,
  onChange,
  "aria-label": ariaLabel,
  ...props
}: InputOTPProps) {
  const sanitize = SANITIZE[pattern]
  const [inner, setInner] = React.useState(() => sanitize(defaultValue ?? "").slice(0, length))
  const value = valueProp !== undefined ? sanitize(valueProp).slice(0, length) : inner
  const [focused, setFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const layout = groups ?? (length === 6 ? [3, 3] : length === 8 ? [4, 4] : [length])
  const active = focused ? Math.min(value.length, length - 1) : -1
  const invalid = !!props.isInvalid

  const handleChange = (raw: string) => {
    const next = sanitize(raw).slice(0, length)
    if (valueProp === undefined) setInner(next)
    onChange?.(next)
    if (next.length === length && next !== value) onComplete?.(next)
  }

  // Keep the caret at the end: cells always fill left to right.
  const pinCaret = () => {
    const el = inputRef.current
    if (el) requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length))
  }

  let index = 0
  return (
    <AriaTextField
      data-slot="input-otp"
      aria-label={label ? undefined : (ariaLabel ?? "Verification code")}
      {...props}
      value={value}
      onChange={handleChange}
      onFocusChange={(f) => {
        setFocused(f)
        props.onFocusChange?.(f)
        if (f) pinCaret()
      }}
      className={cn("group/otp inline-flex flex-col items-center gap-2", fullWidth && "flex w-full items-stretch", className)}
    >
      {label && <AriaLabel className="text-label-lg text-on-surface">{label}</AriaLabel>}
      <div className={cn("relative flex items-center gap-2 sm:gap-3", fullWidth && "w-full")}>
        {layout.map((count, g) => (
          <React.Fragment key={g}>
            {g > 0 && <span aria-hidden className="h-0.5 w-3 shrink-0 rounded-full bg-outline-variant" />}
            {Array.from({ length: count }, () => {
              const i = index++
              const char = value[i]
              return (
                <div key={i} aria-hidden data-active={i === active || undefined} className={cellVariants({ variant, size, fullWidth, active: i === active && !invalid, invalid })}>
                  {char != null ? (
                    mask ? (
                      <span className="size-3 rounded-full bg-current" />
                    ) : (
                      char
                    )
                  ) : (
                    i === active && <span className="h-7 w-0.5 animate-[m3-caret-blink_1s_steps(1)_infinite] bg-primary" />
                  )}
                </div>
              )
            })}
          </React.Fragment>
        ))}
        <AriaInput
          ref={inputRef}
          maxLength={length}
          inputMode={pattern === "numeric" ? "numeric" : "text"}
          autoComplete="one-time-code"
          spellCheck={false}
          onClick={pinCaret}
          onKeyUp={pinCaret}
          className="absolute inset-0 size-full cursor-text bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-default"
          style={{ fontSize: 1, letterSpacing: "-1em" }}
        />
      </div>
      {description != null && (
        <AriaText slot="description" className={cn("text-body-sm text-on-surface-variant", errorMessage != null && "group-data-invalid/otp:hidden")}>
          {description}
        </AriaText>
      )}
      <AriaFieldError className="text-body-sm text-error">{errorMessage}</AriaFieldError>
    </AriaTextField>
  )
}

export { InputOTP, cellVariants as inputOTPCellVariants }
