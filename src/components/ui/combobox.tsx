"use client"

import * as React from "react"
import {
  ComboBox as AriaComboBox,
  ComboBoxStateContext,
  Collection,
  Header,
  ListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection,
  Popover as AriaPopover,
  TagGroup,
  TagList,
  Text,
  composeRenderProps,
  type ComboBoxProps as AriaComboBoxProps,
  type Key,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxSectionProps,
  type ValidationResult,
} from "react-aria-components"

import { InputChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { menuPopoverStyles, menuVariants } from "@/components/ui/menu"
import { FieldContainer, FieldInput, FieldSupportingText } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Combobox · M3 text field + filtering menu
 * The TextField shell (<FieldContainer>) with an editable input; typing filters an Expressive menu the
 * width of the field. Matches are emphasized in primary; the selected option shows a check.
 * selectionMode="multiple" renders the picks as input chips inside the field (Backspace removes the last).
 *
 * <ComboBox label="Region" defaultItems={regions}>
 *   {(r) => <ComboBoxItem id={r.id} icon="public">{r.name}</ComboBoxItem>}
 * </ComboBox>
 */

type SelectionMode = "single" | "multiple"

export interface ComboBoxProps<T extends object, M extends SelectionMode = "single">
  extends Omit<AriaComboBoxProps<T, M>, "children" | "className"> {
  label?: React.ReactNode
  description?: React.ReactNode
  errorMessage?: React.ReactNode | ((v: ValidationResult) => React.ReactNode)
  placeholder?: string
  variant?: "outlined" | "filled"
  density?: "md" | "sm" | "xs"
  /** Leading icon name or node. */
  leading?: React.ReactNode
  /** Shows a loading indicator in the field and a loading row in the menu. */
  isLoading?: boolean
  loadingText?: React.ReactNode
  /** Menu content when nothing matches. */
  emptyText?: React.ReactNode
  children: React.ReactNode | ((item: T) => React.ReactNode)
  className?: string
}

function ComboBox<T extends object, M extends SelectionMode = "single">({
  label,
  description,
  errorMessage,
  placeholder,
  variant = "outlined",
  density = "md",
  leading,
  isLoading = false,
  loadingText = "Loading…",
  emptyText = "No results",
  children,
  className,
  allowsEmptyCollection = true,
  ...props
}: ComboBoxProps<T, M>) {
  const fieldRef = React.useRef<HTMLDivElement>(null)
  return (
    <AriaComboBox
      data-slot="combobox"
      allowsEmptyCollection={allowsEmptyCollection}
      {...props}
      className={cn("group/field flex w-full min-w-0 flex-col", className)}
    >
      <div ref={fieldRef}>
        <ComboBoxField
          label={label}
          placeholder={placeholder}
          variant={variant}
          density={density}
          leading={leading}
          isLoading={isLoading}
          multiple={props.selectionMode === "multiple"}
        />
      </div>
      <FieldSupportingText description={description} errorMessage={errorMessage} />
      <AriaPopover
        data-slot="combobox-popover"
        triggerRef={fieldRef}
        offset={4}
        className={cn(menuPopoverStyles, "w-(--trigger-width) max-w-none")}
      >
        <ListBox
          className={menuVariants().menu({ className: "max-h-80" })}
          renderEmptyState={() => (
            <div className="flex min-h-11 items-center gap-3 px-3 text-body-lg text-on-surface-variant">
              {isLoading ? (
                <>
                  <LoadingIndicator size={24} aria-hidden />
                  {loadingText}
                </>
              ) : (
                emptyText
              )}
            </div>
          )}
        >
          {children}
        </ListBox>
      </AriaPopover>
    </AriaComboBox>
  )
}

function ComboBoxField({
  label,
  placeholder,
  variant,
  density,
  leading,
  isLoading,
  multiple,
}: {
  label?: React.ReactNode
  placeholder?: string
  variant: "outlined" | "filled"
  density: "md" | "sm" | "xs"
  leading?: React.ReactNode
  isLoading: boolean
  multiple: boolean
}) {
  const state = React.useContext(ComboBoxStateContext)
  const isOpen = !!state?.isOpen
  const selected = multiple ? (state?.selectedItems ?? []) : []

  const remove = (keys: Set<Key>) => {
    if (!state) return
    const value = (state.value as readonly Key[]) ?? []
    state.setValue(value.filter((k) => !keys.has(k)))
  }

  const trailing = isLoading ? (
    <span className="grid size-10 place-items-center">
      <LoadingIndicator size={24} aria-label="Loading" />
    </span>
  ) : (
    <IconButton aria-label="Show suggestions" className="data-pressed:rounded-[8px]">
      <Icon
        className={cn(
          "transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
          isOpen && "rotate-180",
        )}
      >
        arrow_drop_down
      </Icon>
    </IconButton>
  )

  const input = (
    <FieldInput
      placeholder={placeholder}
      className={cn(multiple && "min-w-16")}
      onKeyDown={(e) => {
        if (multiple && e.key === "Backspace" && !e.currentTarget.value && selected.length) {
          remove(new Set([selected[selected.length - 1].key]))
        }
      }}
    />
  )

  return (
    <FieldContainer
      variant={variant}
      density={density}
      label={label}
      leading={leading}
      trailing={trailing}
      populated={selected.length > 0 || undefined}
    >
      {multiple ? (
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-1.5">
          {selected.length > 0 && (
            <TagGroup aria-label="Selected" onRemove={remove} className="contents">
              <TagList className="contents">
                {selected.map((item) => (
                  <InputChip key={item.key} id={item.key} dense textValue={item.textValue}>
                    {item.textValue}
                  </InputChip>
                ))}
              </TagList>
            </TagGroup>
          )}
          {input}
        </div>
      ) : (
        input
      )}
    </FieldContainer>
  )
}

/** Emphasizes the part of `text` that matches the combobox input. */
function ComboBoxHighlight({ children }: { children: string }) {
  const state = React.useContext(ComboBoxStateContext)
  const query = state?.inputValue.trim() ?? ""
  const i = query ? children.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) : -1
  if (i < 0) return <>{children}</>
  return (
    <>
      {children.slice(0, i)}
      <span data-slot="combobox-match" className="font-semibold text-primary">
        {children.slice(i, i + query.length)}
      </span>
      {children.slice(i + query.length)}
    </>
  )
}

export interface ComboBoxItemProps<T> extends Omit<AriaListBoxItemProps<T>, "children"> {
  children?: React.ReactNode
  /** Leading Material Symbol. */
  icon?: string
  /** Leading node (avatar, flag). Wins over `icon`. */
  leading?: React.ReactNode
  description?: React.ReactNode
  /** Emphasize the matched substring (string children only). Defaults to true. */
  highlight?: boolean
}

function ComboBoxItem<T extends object>({
  className,
  children,
  icon,
  leading,
  description,
  highlight = true,
  textValue,
  ...props
}: ComboBoxItemProps<T>) {
  const s = menuVariants()
  const label = typeof children === "string" && highlight ? <ComboBoxHighlight>{children}</ComboBoxHighlight> : children
  return (
    <AriaListBoxItem
      data-slot="combobox-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      {...props}
      className={composeRenderProps(className, (className) =>
        s.item({ className: cn("cursor-pointer data-focused:bg-on-surface/8", className) }),
      )}
    >
      {({ isSelected }) => (
        <>
          {(leading || icon) && <span className={s.leading()}>{leading ?? <Icon>{icon!}</Icon>}</span>}
          <span className={s.label()}>
            {description ? (
              <>
                <Text slot="label" className="block truncate">
                  {label}
                </Text>
                <Text slot="description" className={s.description()}>
                  {description}
                </Text>
              </>
            ) : (
              label
            )}
          </span>
          {isSelected && (
            <span className={s.trailing()}>
              <Icon>check</Icon>
            </span>
          )}
        </>
      )}
    </AriaListBoxItem>
  )
}

function ComboBoxSection<T extends object>({
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

export { ComboBox, ComboBoxHighlight, ComboBoxItem, ComboBoxSection }
