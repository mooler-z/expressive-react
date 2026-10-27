"use client"

import * as React from "react"
import {
  Autocomplete,
  Button as AriaButton,
  Collection,
  Dialog as AriaDialog,
  Header,
  Input,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  Modal,
  ModalOverlay,
  SearchField,
  Text,
  composeRenderProps,
  useFilter,
  type AutocompleteProps,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type MenuSectionProps as AriaMenuSectionProps,
  type ModalOverlayProps,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { cn } from "@/lib/utils"

/*
 * Command palette · M3 search view in a dialog
 *   surface   surface-container-high · 28dp corners · elevation 3 · top-aligned, 640dp max
 *   input     56dp search row: leading search icon, body-large, trailing Esc hint
 *   results   grouped (title-small headers), 48dp rows · highlighted row on secondary-container
 *   footer    keyboard hints
 * Built on React Aria Autocomplete: focus stays in the input, ↑ ↓ move a virtual highlight, ⏎ runs.
 *
 * <CommandDialog isOpen={open} onOpenChange={setOpen}>
 *   <CommandInput placeholder="Search commands" />
 *   <CommandList>
 *     <CommandGroup title="Actions">
 *       <CommandItem icon="rocket_launch" shortcut={["⌘", "N"]} onAction={deploy}>New deployment</CommandItem>
 *     </CommandGroup>
 *   </CommandList>
 *   <CommandFooter />
 * </CommandDialog>
 */

export interface CommandProps extends Omit<AutocompleteProps<object>, "children"> {
  children: React.ReactNode
  className?: string
}

/** Filterable command surface (inline). Wrap in <CommandDialog> for the modal palette. */
function Command({ children, className, filter, ...props }: CommandProps) {
  const { contains } = useFilter({ sensitivity: "base" })
  return (
    <div data-slot="command" className={cn("flex min-h-0 flex-col overflow-hidden text-on-surface", className)}>
      <Autocomplete filter={filter ?? contains} {...props}>
        {children}
      </Autocomplete>
    </div>
  )
}

export interface CommandInputProps {
  placeholder?: string
  "aria-label"?: string
  /** Trailing hint; defaults to an Esc key cap. Pass null to hide. */
  hint?: React.ReactNode
  autoFocus?: boolean
  className?: string
}

function CommandInput({ placeholder = "Type a command or search", hint, autoFocus = true, className, ...props }: CommandInputProps) {
  return (
    <SearchField
      data-slot="command-input"
      aria-label={props["aria-label"] ?? "Search commands"}
      autoFocus={autoFocus}
      className={cn("flex h-14 shrink-0 items-center gap-3 border-b border-outline-variant px-4", className)}
    >
      <Icon className="text-on-surface-variant">search</Icon>
      <Input
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-body-lg text-on-surface caret-primary outline-none placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:appearance-none"
      />
      <AriaButton
        aria-label="Clear"
        className="state-layer grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-on-surface-variant outline-none in-data-empty:hidden"
      >
        <Icon size={20}>close</Icon>
      </AriaButton>
      {hint === undefined ? (
        <Kbd size="sm" className="hidden sm:inline-flex">
          Esc
        </Kbd>
      ) : (
        hint
      )}
    </SearchField>
  )
}

export interface CommandListProps<T> extends Omit<AriaMenuProps<T>, "renderEmptyState"> {
  /** Shown when nothing matches. */
  emptyState?: React.ReactNode
  isLoading?: boolean
  loadingText?: React.ReactNode
}

function CommandList<T extends object>({
  className,
  emptyState,
  isLoading,
  loadingText = "Searching…",
  ...props
}: CommandListProps<T>) {
  return (
    <AriaMenu
      data-slot="command-list"
      aria-label="Commands"
      {...props}
      renderEmptyState={() => (
        <div className="flex items-center justify-center gap-3 px-4 py-10 text-body-md text-on-surface-variant">
          {isLoading ? (
            <>
              <LoadingIndicator size={32} aria-hidden />
              {loadingText}
            </>
          ) : (
            (emptyState ?? (
              <span className="flex flex-col items-center gap-2">
                <Icon size={32}>search_off</Icon>
                No matching commands
              </span>
            ))
          )}
        </div>
      )}
      className={composeRenderProps(className, (className) =>
        cn("relative min-h-0 flex-1 overflow-y-auto p-2 outline-none", className),
      )}
    />
  )
}

export interface CommandGroupProps<T> extends AriaMenuSectionProps<T> {
  title?: React.ReactNode
}

function CommandGroup<T extends object>({ title, children, items, className, ...props }: CommandGroupProps<T>) {
  return (
    <AriaMenuSection data-slot="command-group" {...props} className={cn("pb-2 last:pb-0", className)}>
      {title && <Header className="px-3 pt-2 pb-1 text-title-sm text-on-surface-variant">{title}</Header>}
      <Collection items={items}>{children}</Collection>
    </AriaMenuSection>
  )
}

export interface CommandItemProps<T> extends Omit<AriaMenuItemProps<T>, "children"> {
  children?: React.ReactNode
  icon?: string
  leading?: React.ReactNode
  description?: React.ReactNode
  /** Key caps, e.g. ["⌘", "N"]. */
  shortcut?: string[]
  /** Right-aligned meta text, e.g. "Service". */
  meta?: React.ReactNode
}

function CommandItem<T extends object>({
  className,
  children,
  icon,
  leading,
  description,
  shortcut,
  meta,
  textValue,
  ...props
}: CommandItemProps<T>) {
  return (
    <AriaMenuItem
      data-slot="command-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "group/cmd state-layer flex min-h-12 cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-body-lg text-on-surface outline-none select-none",
          "data-focused:bg-secondary-container data-focused:text-on-secondary-container",
          "data-disabled:cursor-default data-disabled:text-on-surface/38 [--icon-size:20px]",
          className,
        ),
      )}
    >
      {(leading || icon) && (
        <span className="flex shrink-0 items-center text-on-surface-variant group-data-focused/cmd:text-on-secondary-container">
          {leading ?? <Icon>{icon!}</Icon>}
        </span>
      )}
      <span className="min-w-0 flex-1">
        {description ? (
          <>
            <Text slot="label" className="block truncate">
              {children}
            </Text>
            <Text slot="description" className="block truncate text-body-sm text-on-surface-variant group-data-focused/cmd:text-on-secondary-container">
              {description}
            </Text>
          </>
        ) : (
          <span className="block truncate">{children}</span>
        )}
      </span>
      {meta && <span className="shrink-0 text-label-md text-on-surface-variant group-data-focused/cmd:text-on-secondary-container">{meta}</span>}
      {shortcut && <KbdGroup keys={shortcut} size="sm" className="shrink-0" />}
    </AriaMenuItem>
  )
}

/** Keyboard hints row. */
function CommandFooter({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div
      data-slot="command-footer"
      className={cn(
        "flex shrink-0 items-center gap-4 border-t border-outline-variant px-4 py-2 text-body-sm text-on-surface-variant",
        className,
      )}
    >
      {children ?? (
        <>
          <span className="inline-flex items-center gap-1.5">
            <Kbd size="sm">↑</Kbd>
            <Kbd size="sm">↓</Kbd>
            navigate
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd size="sm">⏎</Kbd>
            select
          </span>
          <span className="ml-auto hidden items-center gap-1.5 sm:inline-flex">
            <Kbd size="sm">Esc</Kbd>
            close
          </span>
        </>
      )}
    </div>
  )
}

export interface CommandDialogProps extends Omit<ModalOverlayProps, "children" | "className"> {
  children: React.ReactNode
  className?: string
  /** Bind ⌘K / Ctrl+K (or another key) to open the palette. Pass null to skip. */
  shortcut?: string | null
  filter?: CommandProps["filter"]
}

/** Modal command palette: top-aligned dialog holding a <Command>. */
function CommandDialog({ children, className, shortcut = "k", filter, isOpen, onOpenChange, ...props }: CommandDialogProps) {
  useCommandShortcut(shortcut, () => onOpenChange?.(!isOpen))
  return (
    <ModalOverlay
      isDismissable
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      {...props}
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center bg-scrim/32 p-4 pt-[12vh]",
        "data-entering:animate-[m3-fade-in_200ms_var(--md-easing-standard)] data-exiting:animate-[m3-fade-out_150ms_var(--md-easing-standard)]",
      )}
    >
      <Modal
        className={cn(
          "flex max-h-[min(560px,76vh)] w-full max-w-[640px] flex-col overflow-hidden rounded-xl bg-surface-container-high shadow-3",
          "data-entering:animate-[m3-dialog-in_450ms_var(--md-easing-emphasized-decelerate)] data-exiting:animate-[m3-dialog-out_150ms_var(--md-easing-emphasized-accelerate)]",
          className,
        )}
      >
        <AriaDialog aria-label="Command palette" className="flex min-h-0 flex-1 flex-col outline-none">
          <Command filter={filter} className="flex-1">
            {children}
          </Command>
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  )
}

/** ⌘/Ctrl + key toggles the palette. */
function useCommandShortcut(key: string | null | undefined, onTrigger: () => void) {
  const ref = React.useRef(onTrigger)
  ref.current = onTrigger
  React.useEffect(() => {
    if (!key) return
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault()
        ref.current()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [key])
}

export { Command, CommandDialog, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList, useCommandShortcut }
