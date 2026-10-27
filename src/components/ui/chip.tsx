"use client"

import * as React from "react"
import {
  Button as AriaButton,
  Input as AriaInput,
  Label as AriaLabel,
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type TagGroupProps as AriaTagGroupProps,
  type TagListProps as AriaTagListProps,
  type TagProps as AriaTagProps,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Chips · M3 (androidx AssistChipTokens / FilterChipTokens / InputChipTokens)
 * 32dp tall, 8dp corners (CornerSmall), label-large, 18dp icons, 1dp outline-variant outline.
 * Elevated chips drop the outline for surface-container-low at level 1 (level 2 on hover).
 * Selected filter/input chips: secondary-container, no outline, on-secondary-container content.
 * Leading space 16dp, 8dp with a leading icon, 4dp with an avatar; trailing 16dp, 8dp with a trailing icon.
 * Disabled: content on-surface 38%, outline on-surface 12%, elevated container on-surface 12%.
 */
const chipVariants = tv({
  base: [
    "chip-morph relative inline-flex h-8 shrink-0 items-center gap-2 rounded-sm px-4 text-label-lg whitespace-nowrap select-none",
    "[--icon-size:18px] data-disabled:cursor-default data-disabled:text-on-surface/38",
  ],
  variants: {
    kind: {
      assist: "text-on-surface *:data-[slot=icon]:text-primary",
      suggestion: "text-on-surface-variant",
      filter: [
        "text-on-surface-variant *:data-[slot=icon]:text-primary",
        "data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container data-selected:*:data-[slot=icon]:text-on-secondary-container",
      ],
      input: [
        "text-on-surface-variant",
        "data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container",
      ],
      /** Non-interactive display chip (status, tags). */
      static: "",
    },
    elevated: {
      true: "bg-surface-container-low shadow-1 data-hovered:shadow-2 data-disabled:bg-on-surface/12 data-disabled:shadow-none",
      false: "border border-outline-variant data-disabled:border-on-surface/12",
    },
    leading: { none: "", icon: "pl-2", avatar: "pl-1" },
    trailing: { true: "pr-2", false: "" },
    dense: {
      true: "h-6 gap-1 rounded-xs px-2 text-label-md [--icon-size:16px]",
      false: "",
    },
  },
  compoundVariants: [
    { dense: true, leading: ["icon", "avatar"], class: "pl-1" },
    { dense: true, trailing: true, class: "pr-1" },
    { kind: ["assist", "suggestion", "filter", "input"], class: "state-layer focus-ring cursor-pointer" },
    // Disabled + selected: container on-surface 12%, content 38%
    { kind: ["filter", "input"], class: "data-disabled:data-selected:bg-on-surface/12 data-disabled:data-selected:text-on-surface/38" },
  ],
  defaultVariants: { kind: "assist", elevated: false, leading: "none", trailing: false, dense: false },
})

type ChipStyleProps = Pick<VariantProps<typeof chipVariants>, "elevated" | "dense">

interface ChipSlots {
  /** Leading icon (an <Icon>). */
  icon?: React.ReactNode
  /** Trailing icon, e.g. <Icon>arrow_drop_down</Icon> for a dropdown filter. */
  trailingIcon?: React.ReactNode
}

function iconSlot(node: React.ReactNode) {
  return typeof node === "string" ? <Icon>{node}</Icon> : node
}

/* ---------------- Assist & suggestion ---------------- */

export interface AssistChipProps extends AriaButtonProps, ChipStyleProps, ChipSlots {}

/** Assist chip: a smart action related to the content (Add to calendar, Directions). */
function AssistChip({ className, elevated, dense, icon, trailingIcon, children, ...props }: AssistChipProps) {
  return (
    <AriaButton
      data-slot="chip"
      {...props}
      className={composeRenderProps(className, (className) =>
        chipVariants({ kind: "assist", elevated, dense, leading: icon ? "icon" : "none", trailing: !!trailingIcon, className }),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          {iconSlot(icon)}
          {children}
          {iconSlot(trailingIcon)}
          <Ripple />
        </>
      ))}
    </AriaButton>
  )
}

export type SuggestionChipProps = AssistChipProps

/** Suggestion chip: a dynamically generated suggestion (a reply, a query). */
function SuggestionChip({ className, elevated, dense, icon, trailingIcon, children, ...props }: SuggestionChipProps) {
  return (
    <AriaButton
      data-slot="chip"
      {...props}
      className={composeRenderProps(className, (className) =>
        chipVariants({ kind: "suggestion", elevated, dense, leading: icon ? "icon" : "none", trailing: !!trailingIcon, className }),
      )}
    >
      {composeRenderProps(children, (children) => (
        <>
          {iconSlot(icon)}
          {children}
          {iconSlot(trailingIcon)}
          <Ripple />
        </>
      ))}
    </AriaButton>
  )
}

/* ---------------- Filter ---------------- */

export interface FilterChipProps extends AriaToggleButtonProps, ChipStyleProps, ChipSlots {}

/**
 * Filter chip. Selected → secondary-container with a leading check that grows in on the
 * FastSpatial spring. A leading icon, if given, is swapped for the check while selected.
 * Group them with <ChipGroup> for single (choice) or multiple selection.
 */
function FilterChip({ className, elevated, dense, icon, trailingIcon, children, ...props }: FilterChipProps) {
  return (
    <AriaToggleButton
      data-slot="chip"
      {...props}
      className={composeRenderProps(className, (className, { isSelected }) =>
        chipVariants({
          kind: "filter",
          elevated,
          dense,
          leading: icon || isSelected ? "icon" : "none",
          trailing: !!trailingIcon,
          className: cn("group", className),
        }),
      )}
    >
      {composeRenderProps(children, (children, { isSelected }) => (
        <>
          {icon ? (
            isSelected ? <Icon>check</Icon> : iconSlot(icon)
          ) : (
            // 0 → 18dp check; the negative margin cancels the flex gap while collapsed
            <span
              aria-hidden
              className={cn(
                "chip-morph -mr-2 inline-grid grid-cols-[0fr] group-data-selected:mr-0 group-data-selected:grid-cols-[1fr]",
                dense && "-mr-1",
              )}
            >
              <span className="overflow-hidden">
                <Icon className="opacity-0 transition-opacity group-data-selected:opacity-100">check</Icon>
              </span>
            </span>
          )}
          {children}
          {iconSlot(trailingIcon)}
          <Ripple />
        </>
      ))}
    </AriaToggleButton>
  )
}

export interface ChipGroupProps extends AriaToggleButtonGroupProps {}

/**
 * A set of filter chips. `selectionMode="single"` gives choice chips (radio semantics);
 * "multiple" gives independent filters. Children need an `id`.
 */
function ChipGroup({ className, selectionMode = "multiple", ...props }: ChipGroupProps) {
  return (
    <AriaToggleButtonGroup
      data-slot="chip-group"
      selectionMode={selectionMode}
      {...props}
      className={composeRenderProps(className, (className) => cn("flex flex-wrap gap-2", className))}
    />
  )
}

/* ---------------- Input ---------------- */

export interface InputChipProps extends Omit<AriaTagProps, "children">, ChipStyleProps {
  children: React.ReactNode
  /** 24dp avatar: initials, an <img>, or any node. */
  avatar?: React.ReactNode
  /** Leading icon when there is no avatar. */
  icon?: React.ReactNode
}

/**
 * Input chip: a discrete piece of user input (a person, an address). Lives inside <InputChipGroup>;
 * shows a remove button when the group has `onRemove`.
 */
function InputChip({ className, elevated, dense, avatar, icon, children, textValue, ...props }: InputChipProps) {
  return (
    <AriaTag
      data-slot="chip"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      {...props}
      className={composeRenderProps(className, (className, { allowsRemoving }) =>
        chipVariants({
          kind: "input",
          elevated,
          dense,
          leading: avatar ? "avatar" : icon ? "icon" : "none",
          trailing: allowsRemoving,
          className: cn("outline-none", className),
        }),
      )}
    >
      {({ allowsRemoving }) => (
        <>
          {avatar ? (
            <span
              data-slot="chip-avatar"
              className={cn(
                "grid size-6 shrink-0 place-items-center overflow-hidden rounded-full bg-primary-container text-label-sm text-on-primary-container *:size-full *:object-cover",
                dense && "size-4 text-[9px]",
              )}
            >
              {avatar}
            </span>
          ) : (
            iconSlot(icon)
          )}
          {children}
          {allowsRemoving && (
            <AriaButton
              slot="remove"
              className="state-layer focus-ring -my-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full outline-none"
            >
              <Icon>close</Icon>
            </AriaButton>
          )}
        </>
      )}
    </AriaTag>
  )
}

export interface InputChipGroupProps<T extends object>
  extends Omit<AriaTagGroupProps, "children">,
    Pick<AriaTagListProps<T>, "items" | "children" | "renderEmptyState"> {
  label?: React.ReactNode
  listClassName?: string
}

/** Removable/selectable set of input chips (RAC TagGroup: arrow-key navigation, Delete to remove). */
function InputChipGroup<T extends object>({
  label,
  items,
  children,
  renderEmptyState,
  className,
  listClassName,
  ...props
}: InputChipGroupProps<T>) {
  return (
    <AriaTagGroup data-slot="input-chip-group" {...props} className={cn("flex flex-col gap-2", className)}>
      {label && <AriaLabel className="text-label-lg text-on-surface-variant">{label}</AriaLabel>}
      <AriaTagList items={items} renderEmptyState={renderEmptyState} className={cn("flex flex-wrap gap-2", listClassName)}>
        {children}
      </AriaTagList>
    </AriaTagGroup>
  )
}

/* ---------------- Chip input ---------------- */

export interface ChipInputProps {
  /** Leading label inside the field, e.g. "To". */
  label?: string
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  /** Avatar for a value (initials, image). */
  renderAvatar?: (value: string) => React.ReactNode
  /** Turn typed text into a value; return null to reject. Defaults to trimmed text. */
  parse?: (text: string) => string | null
  isDisabled?: boolean
  className?: string
  "aria-label"?: string
}

/**
 * Text field that turns entries into input chips. Enter or comma adds, Backspace on an empty
 * field removes the last chip.
 */
function ChipInput({
  label,
  value: controlled,
  defaultValue = [],
  onChange,
  placeholder,
  renderAvatar,
  parse = (t) => t.trim() || null,
  isDisabled,
  className,
  "aria-label": ariaLabel,
}: ChipInputProps) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = controlled ?? uncontrolled
  const [text, setText] = React.useState("")
  const inputId = React.useId()

  const set = (next: string[]) => {
    if (controlled === undefined) setUncontrolled(next)
    onChange?.(next)
  }
  const commit = () => {
    const v = parse(text)
    if (v && !value.includes(v)) set([...value, v])
    setText("")
  }

  return (
    <div
      data-slot="chip-input"
      className={cn(
        "flex min-h-14 w-full cursor-text flex-wrap items-center gap-2 rounded-xs border border-outline px-3 py-2 transition-colors",
        "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:ring-inset",
        isDisabled && "pointer-events-none border-on-surface/12 opacity-38",
        className,
      )}
      onClick={(e) => e.target === e.currentTarget && document.getElementById(inputId)?.focus()}
    >
      {label && (
        <label htmlFor={inputId} className="text-body-lg text-on-surface-variant">
          {label}
        </label>
      )}
      {value.length > 0 && (
        <InputChipGroup
          aria-label={label ?? ariaLabel ?? "Entries"}
          items={value.map((v) => ({ id: v }))}
          onRemove={(keys) => set(value.filter((v) => !keys.has(v)))}
          className="contents"
          listClassName="contents"
        >
          {(item) => (
            <InputChip id={item.id} avatar={renderAvatar?.(item.id)} className="pr-1">
              {item.id}
            </InputChip>
          )}
        </InputChipGroup>
      )}
      <AriaInput
        id={inputId}
        value={text}
        disabled={isDisabled}
        aria-label={label ? undefined : ariaLabel}
        placeholder={placeholder}
        onChange={(e) => {
          const t = e.target.value
          if (t.endsWith(",")) {
            setText(t.slice(0, -1))
            const v = parse(t.slice(0, -1))
            if (v && !value.includes(v)) set([...value, v])
            setText("")
          } else setText(t)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            commit()
          } else if (e.key === "Backspace" && !text && value.length) {
            set(value.slice(0, -1))
          }
        }}
        onBlur={commit}
        className="h-8 min-w-20 flex-1 bg-transparent text-body-lg text-on-surface outline-none placeholder:text-on-surface-variant"
      />
    </div>
  )
}

/* ---------------- Static ---------------- */

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement>, ChipStyleProps, ChipSlots {}

/** Non-interactive chip for display (status, metadata). Color it with bg-/text- classes. */
function Chip({ className, elevated, dense, icon, trailingIcon, children, ...props }: ChipProps) {
  return (
    <span
      data-slot="chip"
      className={chipVariants({
        kind: "static",
        elevated,
        dense,
        leading: icon ? "icon" : "none",
        trailing: !!trailingIcon,
        className,
      })}
      {...props}
    >
      {iconSlot(icon)}
      {children}
      {iconSlot(trailingIcon)}
    </span>
  )
}

export {
  AssistChip,
  Chip,
  ChipGroup,
  ChipInput,
  FilterChip,
  InputChip,
  InputChipGroup,
  SuggestionChip,
  chipVariants,
}
