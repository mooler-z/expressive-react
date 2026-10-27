"use client"

import * as React from "react"
import {
  FieldError as AriaFieldError,
  Label as AriaLabel,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  Text as AriaText,
  composeRenderProps,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/*
 * Radio button · M3 (androidx RadioButtonTokens)
 * 20dp ring, 2dp stroke; selected = primary ring + 10dp primary dot. 40dp state layer in a 48dp target.
 * Unselected ring on-surface-variant (on-surface when hovered/pressed). Error tints ring and dot.
 * Disabled: on-surface 38%. The dot scales in on the FastSpatial spring.
 * Accent color is --radio-accent (primary); e.g. className="[--radio-accent:var(--md-tertiary)]".
 */

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, "children"> {
  children: React.ReactNode
  label?: React.ReactNode
  description?: React.ReactNode
  /** Shown when `isInvalid` (or validation fails). */
  errorMessage?: React.ReactNode
}

function RadioGroup({ className, label, description, errorMessage, orientation = "vertical", children, ...props }: RadioGroupProps) {
  return (
    <AriaRadioGroup
      data-slot="radio-group"
      orientation={orientation}
      {...props}
      className={composeRenderProps(className, (className) => cn("group/radio-group flex flex-col gap-1", className))}
    >
      {label && (
        <AriaLabel className="px-3 text-label-lg text-on-surface-variant group-data-invalid/radio-group:text-error">{label}</AriaLabel>
      )}
      <div className={cn("flex", orientation === "horizontal" ? "flex-row flex-wrap gap-x-2" : "flex-col")}>{children}</div>
      {description && (
        <AriaText slot="description" className="px-3 text-body-sm text-on-surface-variant">
          {description}
        </AriaText>
      )}
      <AriaFieldError className="flex items-center gap-1 px-3 text-body-sm text-error">
        <Icon size={16} filled>
          error
        </Icon>
        {errorMessage}
      </AriaFieldError>
    </AriaRadioGroup>
  )
}

export interface RadioProps extends AriaRadioProps {
  /** Indicator before (default) or after the label, e.g. trailing radios in list rows. */
  placement?: "start" | "end"
  /** 40dp target instead of 48dp. */
  dense?: boolean
}

function Radio({ className, children, placement = "start", dense = false, ...props }: RadioProps) {
  return (
    <AriaRadio
      data-slot="radio"
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "group inline-flex cursor-pointer items-center gap-1 text-body-lg text-on-surface [--radio-accent:var(--md-primary)]",
          "data-disabled:cursor-default data-disabled:text-on-surface/38",
          className,
        ),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          {placement === "start" && <RadioIndicator dense={dense} />}
          {children}
          {placement === "end" && <RadioIndicator dense={dense} />}
        </>
      ))}
    </AriaRadio>
  )
}

/** The ring + dot. Exported for custom layouts; must sit inside a <Radio>. */
function RadioIndicator({ dense, className }: { dense?: boolean; className?: string }) {
  return (
    <span
      aria-hidden
      data-slot="radio-indicator"
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full",
        dense ? "size-10" : "size-12",
        // 40dp state layer
        "before:absolute before:rounded-full before:bg-on-surface before:opacity-0 before:transition-opacity before:duration-(--md-spring-fast-effects-duration) before:ease-fast-effects",
        dense ? "before:inset-0" : "before:inset-1",
        "group-data-selected:before:bg-(--radio-accent) group-data-invalid:before:bg-error",
        "group-data-hovered:before:opacity-8 group-data-focus-visible:before:opacity-10 group-data-pressed:before:opacity-12 group-data-disabled:before:hidden",
        className,
      )}
    >
      <span
        className={cn(
          "relative grid size-5 place-items-center rounded-full border-2 border-on-surface-variant",
          "transition-colors duration-(--md-spring-default-effects-duration) ease-default-effects",
          "group-data-hovered:border-on-surface group-data-pressed:border-on-surface",
          "group-data-selected:border-(--radio-accent) group-data-invalid:border-error group-data-disabled:border-on-surface/38",
          "group-data-focus-visible:outline-3 group-data-focus-visible:outline-offset-[8px] group-data-focus-visible:outline-secondary",
        )}
      >
        <span
          className={cn(
            "size-2.5 scale-0 rounded-full bg-(--radio-accent)",
            "transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-data-selected:scale-100",
            "group-data-invalid:bg-error group-data-disabled:bg-on-surface/38",
          )}
        />
      </span>
    </span>
  )
}

export { Radio, RadioGroup, RadioIndicator }
