"use client"

import * as React from "react"
import {
  DateField as AriaDateField,
  DateInput,
  DateSegment,
  TimeField as AriaTimeField,
  type DateFieldProps as AriaDateFieldProps,
  type DateValue,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue,
  type ValidationResult,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { FieldContainer, FieldSupportingText } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Date & time fields · segment inputs in the M3 text-field shell (<FieldContainer>), so they match TextField:
 * filled or outlined, floating label, supporting text, error. Each segment (month, day, year, hour, minute,
 * AM/PM) is a spinbutton: type digits or use ↑ ↓. The focused segment is tinted primary-container.
 *
 * <DateField label="Date" description="MM/DD/YYYY" />
 * <TimeField label="Start time" />
 */

type FieldVariant = "outlined" | "filled"
type FieldDensity = "md" | "sm" | "xs"

/** True when any date segment holds a typed value (so the label stays floated with partial input). */
function useHasEnteredSegments(ref: React.RefObject<HTMLElement | null>) {
  const [has, setHas] = React.useState(false)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => {
      // React Aria's hidden form <input> has no placeholder, so it would always match the shell's
      // `input:not(:placeholder-shown)` float rule. A blank placeholder keeps it floating only with a value.
      el.querySelectorAll("input[hidden]:not([placeholder])").forEach((i) => i.setAttribute("placeholder", " "))
      setHas(!!el.querySelector("[data-slot=date-segment]:not([data-type=literal]):not([data-placeholder])"))
    }
    check()
    const mo = new MutationObserver(check)
    mo.observe(el, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["data-placeholder"] })
    return () => mo.disconnect()
  }, [ref])
  return has
}

/** Editable date/time segments, styled for <FieldContainer>. Hidden until the label floats when the field has a label. */
function DateSegments({ slot, hideUntilFloat = true, className }: { slot?: string; hideUntilFloat?: boolean; className?: string }) {
  return (
    <DateInput
      slot={slot}
      data-slot="date-input"
      className={cn(
        "flex h-6 min-w-0 items-center text-body-lg text-on-surface tabular-nums outline-none",
        hideUntilFloat && "in-data-has-label:opacity-0 in-data-has-label:field-float:opacity-100",
        "transition-opacity duration-(--md-spring-fast-effects-duration) ease-fast-effects",
        className,
      )}
    >
      {(segment) => (
        <DateSegment
          segment={segment}
          data-slot="date-segment"
          className={cn(
            "rounded-xs px-px caret-transparent outline-none",
            "data-placeholder:text-on-surface-variant data-[type=literal]:px-0 data-[type=literal]:text-on-surface-variant",
            "data-focused:bg-primary-container data-focused:text-on-primary-container",
            "field-disabled:text-on-surface/38 field-invalid:data-focused:bg-error-container field-invalid:data-focused:text-on-error-container",
          )}
        />
      )}
    </DateInput>
  )
}

export interface FieldChromeProps {
  label?: React.ReactNode
  description?: React.ReactNode
  errorMessage?: React.ReactNode | ((v: ValidationResult) => React.ReactNode)
  variant?: FieldVariant
  density?: FieldDensity
  /** Leading icon name or node. */
  leading?: React.ReactNode
  className?: string
}

/* ---------------------------------------------------------------- DateField */

export interface DateFieldProps<T extends DateValue>
  extends Omit<AriaDateFieldProps<T>, "children" | "className">,
    FieldChromeProps {
  trailing?: React.ReactNode
}

/** Typed date input (segments) in the M3 text-field shell. */
function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  variant = "outlined",
  density = "md",
  leading,
  trailing,
  className,
  ...props
}: DateFieldProps<T>) {
  const ref = React.useRef<HTMLDivElement>(null)
  const populated = useHasEnteredSegments(ref)
  return (
    <AriaDateField data-slot="date-field" {...props} className={cn("group/field flex w-full flex-col", className)}>
      <div ref={ref}>
        <FieldContainer
          variant={variant}
          density={density}
          label={label}
          leading={leading}
          trailing={trailing ?? (props.isInvalid ? <Icon filled className="text-error">error</Icon> : undefined)}
          populated={populated}
        >
          <DateSegments />
        </FieldContainer>
      </div>
      <FieldSupportingText description={description} errorMessage={errorMessage} />
    </AriaDateField>
  )
}

/* ---------------------------------------------------------------- TimeField */

export interface TimeFieldProps<T extends TimeValue>
  extends Omit<AriaTimeFieldProps<T>, "children" | "className">,
    FieldChromeProps {
  trailing?: React.ReactNode
}

/** Typed time input (hour, minute, AM/PM segments) in the M3 text-field shell. */
function TimeField<T extends TimeValue>({
  label,
  description,
  errorMessage,
  variant = "outlined",
  density = "md",
  leading,
  trailing,
  className,
  ...props
}: TimeFieldProps<T>) {
  const ref = React.useRef<HTMLDivElement>(null)
  const populated = useHasEnteredSegments(ref)
  return (
    <AriaTimeField data-slot="time-field" {...props} className={cn("group/field flex w-full flex-col", className)}>
      <div ref={ref}>
        <FieldContainer
          variant={variant}
          density={density}
          label={label}
          leading={leading}
          trailing={trailing ?? (props.isInvalid ? <Icon filled className="text-error">error</Icon> : "schedule")}
          populated={populated}
        >
          <DateSegments />
        </FieldContainer>
      </div>
      <FieldSupportingText description={description} errorMessage={errorMessage} />
    </AriaTimeField>
  )
}

export { DateField, DateSegments, TimeField, useHasEnteredSegments }
