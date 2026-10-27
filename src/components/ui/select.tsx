"use client"

import * as React from "react"
import {
  Button as AriaButton,
  ListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection,
  Collection,
  Header,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectStateContext,
  SelectValue,
  Text,
  composeRenderProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxSectionProps,
  type SelectProps as AriaSelectProps,
  type ValidationResult,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { menuPopoverStyles, menuVariants } from "@/components/ui/menu"
import { FieldContainer, FieldSupportingText } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Select · M3 exposed dropdown menu
 * The TextField shell (<FieldContainer>: outlined or filled, 56dp, floating label, notch) around a
 * trigger that opens an Expressive menu the width of the field. Selected option uses the menu's
 * tertiary-container selected state.
 *
 * <Select label="Region" defaultSelectedKey="fra">
 *   <SelectItem id="iad">US East (N. Virginia)</SelectItem>
 *   <SelectItem id="fra">Europe (Frankfurt)</SelectItem>
 * </Select>
 */

export interface SelectProps<T extends object> extends Omit<AriaSelectProps<T>, "children" | "className"> {
  label?: React.ReactNode
  description?: React.ReactNode
  errorMessage?: string | ((validation: ValidationResult) => string)
  /** outlined (default) or filled text-field style. */
  variant?: "outlined" | "filled"
  density?: "md" | "sm" | "xs"
  /** Material Symbol shown before the value. */
  icon?: string
  items?: Iterable<T>
  children: React.ReactNode | ((item: T) => React.ReactNode)
  className?: string
}

function Select<T extends object>({
  label,
  description,
  errorMessage,
  variant = "outlined",
  density = "md",
  icon,
  items,
  children,
  className,
  placeholder,
  ...props
}: SelectProps<T>) {
  // The menu anchors to (and matches the width of) the whole field, not just the inner trigger.
  const fieldRef = React.useRef<HTMLDivElement>(null)
  return (
    <AriaSelect
      data-slot="select"
      placeholder={placeholder ?? (label ? " " : "Select…")}
      {...props}
      className={cn("group/field flex w-full min-w-0 flex-col", className)}
    >
      <div ref={fieldRef}>
        <SelectField label={label} variant={variant} density={density} icon={icon} />
      </div>
      <FieldSupportingText description={description} errorMessage={errorMessage} />
      <AriaPopover data-slot="select-popover" triggerRef={fieldRef} offset={4} className={cn(menuPopoverStyles, "w-(--trigger-width) max-w-none")}>
        <ListBox items={items} className={menuVariants().menu()}>
          {children}
        </ListBox>
      </AriaPopover>
    </AriaSelect>
  )
}

/** FieldContainer + trigger. Reads Select state so the label floats when there's a value or the menu is open. */
function SelectField({
  label,
  variant,
  density,
  icon,
}: {
  label?: React.ReactNode
  variant: "outlined" | "filled"
  density: "md" | "sm" | "xs"
  icon?: string
}) {
  const state = React.useContext(SelectStateContext)
  const value = state?.value
  const hasValue = Array.isArray(value) ? value.length > 0 : value != null
  const isOpen = !!state?.isOpen

  return (
    <FieldContainer
      variant={variant}
      density={density}
      label={label}
      leading={icon}
      trailing="arrow_drop_down"
      populated={hasValue || isOpen}
      className={cn(
        "cursor-pointer",
        "[&_[data-slot=field-trailing]_.md-icon]:transition-transform [&_[data-slot=field-trailing]_.md-icon]:duration-(--md-spring-fast-spatial-duration) [&_[data-slot=field-trailing]_.md-icon]:ease-fast-spatial",
        // Focus moves into the menu while open; keep the field in its focused colors.
        isOpen && [
          "[&_[data-slot=field-trailing]_.md-icon]:rotate-180",
          "[&>fieldset]:border-2 [&>fieldset]:border-primary! [&>fieldset]:px-[11px] after:h-0.5 after:bg-primary!",
          "[&>label]:text-primary",
        ],
      )}
    >
      {/* The ::after stretches the trigger's hit area over the whole field, icons included. */}
      <AriaButton className="h-6 min-w-0 flex-1 cursor-pointer text-left text-body-lg text-on-surface outline-none after:absolute after:inset-0 after:rounded-[inherit] field-disabled:cursor-default field-disabled:text-on-surface/38">
        {/* SelectValue renders the selected SelectItem's content; SelectItemContent reads this to draw one line. */}
        <InSelectValueContext.Provider value={{ hideIcon: icon != null }}>
          <SelectValue data-slot="select-value" className="flex min-w-0 items-center gap-3 data-placeholder:text-on-surface-variant">
            {({ isPlaceholder, defaultChildren }) => (isPlaceholder ? <span className="truncate">{defaultChildren}</span> : defaultChildren)}
          </SelectValue>
        </InSelectValueContext.Provider>
      </AriaButton>
    </FieldContainer>
  )
}

export interface SelectItemProps<T> extends Omit<AriaListBoxItemProps<T>, "children"> {
  children?: React.ReactNode
  icon?: string
  description?: React.ReactNode
}

function SelectItem<T extends object>({ className, children, icon, description, textValue, ...props }: SelectItemProps<T>) {
  const s = menuVariants()
  return (
    <AriaListBoxItem
      data-slot="select-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      {...props}
      className={composeRenderProps(className, (className) => s.item({ className: cn("cursor-pointer", className) }))}
    >
      {({ isSelected }) => (
        <SelectItemContent icon={icon} description={description} isSelected={isSelected}>
          {children}
        </SelectItemContent>
      )}
    </AriaListBoxItem>
  )
}

/** Set inside the field's SelectValue, which renders the selected item's content a second time. */
const InSelectValueContext = React.createContext<{ hideIcon: boolean } | null>(null)

/**
 * In the menu: leading icon, label (+ description) and the selected check.
 * In the field: one truncated line, with the item's icon unless the Select has its own leading icon.
 */
function SelectItemContent({
  icon,
  description,
  isSelected,
  children,
}: Pick<SelectItemProps<object>, "icon" | "description" | "children"> & { isSelected: boolean }) {
  const inValue = React.useContext(InSelectValueContext)
  const s = menuVariants()

  if (inValue)
    return (
      <>
        {icon && !inValue.hideIcon && <Icon className="shrink-0 text-on-surface-variant">{icon}</Icon>}
        <span className="min-w-0 truncate">{children}</span>
      </>
    )

  return (
    <>
      {icon && (
        <span className={s.leading()}>
          <Icon>{icon}</Icon>
        </span>
      )}
      <span className={s.label()}>
        {description ? (
          <>
            <Text slot="label" className="block truncate">
              {children}
            </Text>
            <Text slot="description" className={s.description()}>
              {description}
            </Text>
          </>
        ) : (
          children
        )}
      </span>
      {isSelected && (
        <span className={s.trailing()}>
          <Icon>check</Icon>
        </span>
      )}
    </>
  )
}

function SelectSection<T extends object>({
  className,
  title,
  children,
  items,
  ...props
}: ListBoxSectionProps<T> & { title?: React.ReactNode }) {
  const s = menuVariants()
  return (
    <ListBoxSection data-slot="menu-section" {...props} className={s.section({ className })}>
      {title && <Header className={s.header()}>{title}</Header>}
      <Collection items={items}>{children}</Collection>
    </ListBoxSection>
  )
}

export { Select, SelectItem, SelectSection }
