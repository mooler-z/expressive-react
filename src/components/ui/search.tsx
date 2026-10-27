"use client"

import * as React from "react"
import {
  Autocomplete,
  Button as AriaButton,
  Dialog as AriaDialog,
  Header as AriaHeader,
  Input as AriaInput,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Modal,
  ModalOverlay,
  Popover,
  SearchField as AriaSearchField,
  composeRenderProps,
  useFilter,
  type AutocompleteProps,
  type Key,
  type ListBoxItemProps,
  type ListBoxSectionProps,
  type SearchFieldProps as AriaSearchFieldProps,
} from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Ripple } from "@/components/ui/ripple"
import { cn } from "@/lib/utils"

/*
 * Search · M3
 * androidx SearchBarTokens / SearchViewTokens:
 *   bar          56dp, CornerFull, surface-container-high, body-large input, on-surface leading icon
 *   docked view  CornerExtraLarge (28dp), surface-container-high, 56dp header, divider, results
 *   full screen  CornerNone, 72dp header (compact windows)
 */

const slot = (node: React.ReactNode, pad: string) =>
  node == null ? null : typeof node === "string" ? (
    <span className={cn("flex shrink-0 items-center text-on-surface", pad)}>
      <Icon>{node}</Icon>
    </span>
  ) : (
    node
  )

/* ---------- Search bar ---------- */

export interface SearchBarProps extends Omit<AriaSearchFieldProps, "children" | "className"> {
  placeholder?: string
  /** Icon name or node (e.g. a menu IconButton). Defaults to "search". */
  leading?: React.ReactNode
  /** Trailing actions, e.g. a mic IconButton or an avatar. */
  trailing?: React.ReactNode
  className?: string
}

/** Standalone M3 search bar: a pill-shaped search field with a clear button. */
function SearchBar({ placeholder = "Search", leading = "search", trailing, className, ...props }: SearchBarProps) {
  return (
    <div
      data-slot="search-bar"
      className={cn(
        "flex h-14 w-full min-w-0 items-center gap-1 rounded-full bg-surface-container-high pr-1 text-on-surface-variant",
        "has-data-disabled:opacity-38",
        typeof leading === "string" ? "pl-0" : "pl-1",
        className,
      )}
    >
      {slot(leading, "pl-4 pr-2")}
      {/* Trailing actions sit outside the SearchField: every Button inside it becomes the clear button. */}
      <AriaSearchField aria-label={props["aria-label"] ?? placeholder} {...props} className="group/search flex h-full min-w-0 flex-1 items-center">
        <AriaInput
          placeholder={placeholder}
          className="h-full w-full min-w-0 flex-1 bg-transparent px-2 text-body-lg text-on-surface caret-primary outline-none placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:appearance-none"
        />
        <IconButton aria-label="Clear search" className="group-data-empty/search:hidden">
          <Icon>close</Icon>
        </IconButton>
      </AriaSearchField>
      {trailing}
    </div>
  )
}

/* ---------- Search view ---------- */

const SearchQueryContext = React.createContext("")

export interface SearchViewProps<T extends object = object> {
  placeholder?: string
  /** Collapsed bar: icon name or node. Defaults to "search". */
  leading?: React.ReactNode
  /** Collapsed bar trailing actions (mic, avatar). */
  trailing?: React.ReactNode
  /** Results. Use <SearchItem> / <SearchSection>, or a render function with `items`. */
  children: React.ReactNode | ((item: T) => React.ReactNode)
  items?: Iterable<T>
  inputValue?: string
  defaultInputValue?: string
  onInputChange?: (value: string) => void
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** A result was chosen. The view closes afterwards. */
  onAction?: (key: Key) => void
  /** Enter pressed in the input. */
  onSubmit?: (value: string) => void
  /** Client-side filter. Defaults to a case/diacritic-insensitive "contains"; pass null for server results. */
  filter?: AutocompleteProps<T>["filter"] | null
  /** docked: expands in place (default). fullscreen: covers the window (use on compact widths). */
  mode?: "docked" | "fullscreen"
  /** Shows a loading indicator in the header. */
  isLoading?: boolean
  /** Rendered when nothing matches. */
  renderEmptyState?: (query: string) => React.ReactNode
  className?: string
}

/**
 * Search bar that expands into a search view with live-filtered suggestions.
 * Keyboard: type to filter, ↑/↓ to move, Enter to pick, Esc clears then closes.
 */
function SearchView<T extends object>({
  placeholder = "Search",
  leading = "search",
  trailing,
  children,
  items,
  inputValue,
  defaultInputValue = "",
  onInputChange,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  onAction,
  onSubmit,
  filter,
  mode = "docked",
  isLoading,
  renderEmptyState,
  className,
}: SearchViewProps<T>) {
  const barRef = React.useRef<HTMLDivElement>(null)
  const [openInner, setOpenInner] = React.useState(defaultOpen)
  const open = isOpen ?? openInner
  const setOpen = (o: boolean) => {
    if (isOpen === undefined) setOpenInner(o)
    onOpenChange?.(o)
  }
  const [queryInner, setQueryInner] = React.useState(defaultInputValue)
  const query = inputValue ?? queryInner
  const setQuery = (q: string) => {
    if (inputValue === undefined) setQueryInner(q)
    onInputChange?.(q)
  }

  const { contains } = useFilter({ sensitivity: "base" })
  const activeFilter = filter === null ? undefined : (filter ?? contains)

  const view = (
    <AriaDialog aria-label={placeholder} className="flex max-h-[inherit] flex-col outline-none">
      <Autocomplete inputValue={query} onInputChange={setQuery} filter={activeFilter}>
        <div className={cn("flex shrink-0 items-center gap-1 px-1", mode === "fullscreen" ? "h-18" : "h-14")}>
          <IconButton aria-label="Back" onPress={() => setOpen(false)} className="text-on-surface">
            <Icon>arrow_back</Icon>
          </IconButton>
          <AriaSearchField
            aria-label={placeholder}
            autoFocus
            onSubmit={(v) => {
              onSubmit?.(v)
              setOpen(false)
            }}
            className="group/search flex min-w-0 flex-1 items-center"
          >
            <AriaInput
              placeholder={placeholder}
              className="h-12 w-full min-w-0 flex-1 bg-transparent px-2 text-body-lg text-on-surface caret-primary outline-none placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:appearance-none"
            />
            {isLoading && <LoadingIndicator size={32} className="mx-2" />}
            <IconButton aria-label="Clear search" className="group-data-empty/search:hidden">
              <Icon>close</Icon>
            </IconButton>
          </AriaSearchField>
        </div>
        <hr className="m-0 shrink-0 border-0 border-t border-outline" />
        <SearchQueryContext.Provider value={query}>
          <ListBox
            aria-label="Suggestions"
            items={items}
            onAction={(key) => {
              onAction?.(key)
              setOpen(false)
            }}
            renderEmptyState={() =>
              renderEmptyState ? (
                renderEmptyState(query)
              ) : query ? (
                <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
                  <Icon size={32} className="text-on-surface-variant">
                    search_off
                  </Icon>
                  <div className="text-title-md text-on-surface">No matches for “{query}”</div>
                </div>
              ) : null
            }
            className="relative min-h-0 flex-1 overflow-y-auto py-2 outline-none"
          >
            {children}
          </ListBox>
        </SearchQueryContext.Provider>
      </Autocomplete>
    </AriaDialog>
  )

  return (
    <div
      ref={barRef}
      data-slot="search-view"
      className={cn("flex h-14 w-full min-w-0 items-center gap-1 rounded-full bg-surface-container-high pr-1 text-on-surface-variant", className)}
    >
      {slot(leading, "pl-4 pr-2")}
      <AriaButton
        aria-haspopup="dialog"
        aria-expanded={open}
        onPress={() => setOpen(true)}
        className={cn(
          "state-layer focus-ring relative flex h-12 min-w-0 flex-1 cursor-text items-center truncate rounded-full px-2 text-left text-body-lg",
          query ? "text-on-surface" : "text-on-surface-variant",
          leading == null && "pl-4",
        )}
      >
        {query || placeholder}
        <Ripple />
      </AriaButton>
      {trailing}

      {mode === "docked" ? (
        <Popover
          triggerRef={barRef}
          isOpen={open}
          onOpenChange={setOpen}
          placement="bottom"
          offset={-56}
          containerPadding={8}
          className={cn(
            "flex w-(--trigger-width) max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-xl bg-surface-container-high text-on-surface shadow-2 outline-none",
            "max-h-[min(70vh,560px)]",
            "data-entering:animate-[m3-search-expand_450ms_var(--md-easing-emphasized-decelerate)]",
            "data-exiting:animate-[m3-search-collapse_200ms_var(--md-easing-emphasized-accelerate)]",
          )}
        >
          {view}
        </Popover>
      ) : (
        <ModalOverlay
          isOpen={open}
          onOpenChange={setOpen}
          isDismissable
          className="fixed inset-0 z-50 data-entering:animate-[m3-fade-in_250ms_var(--md-easing-emphasized-decelerate)] data-exiting:animate-[m3-fade-out_150ms_var(--md-easing-emphasized-accelerate)]"
        >
          <Modal className="flex h-dvh w-full flex-col bg-surface-container-high text-on-surface">{view}</Modal>
        </ModalOverlay>
      )}
    </div>
  )
}

/* ---------- Results ---------- */

export interface SearchItemProps extends Omit<ListBoxItemProps, "children"> {
  /** Icon name (history, …) or a node such as an avatar/badge. */
  icon?: React.ReactNode
  description?: React.ReactNode
  /** Trailing glyph, e.g. "north_west" to fill the query. */
  trailing?: React.ReactNode
  children: React.ReactNode
}

function SearchItem({ icon, description, trailing, children, className, textValue, ...props }: SearchItemProps) {
  return (
    <ListBoxItem
      data-slot="search-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "state-layer flex min-h-14 cursor-pointer items-center gap-4 px-4 py-2 text-body-lg text-on-surface outline-none",
          "data-focused:after:opacity-10",
          className,
        ),
      )}
    >
      {icon != null &&
        (typeof icon === "string" ? (
          <Icon className="text-on-surface-variant">{icon}</Icon>
        ) : (
          <span className="flex shrink-0 items-center">{icon}</span>
        ))}
      <span className="min-w-0 flex-1">
        <span className="block truncate">{children}</span>
        {description != null && <span className="block truncate text-body-md text-on-surface-variant">{description}</span>}
      </span>
      {trailing != null && (typeof trailing === "string" ? <Icon className="text-on-surface-variant">{trailing}</Icon> : trailing)}
    </ListBoxItem>
  )
}

export interface SearchSectionProps<T extends object> extends Omit<ListBoxSectionProps<T>, "children"> {
  title: React.ReactNode
  children: React.ReactNode
}

function SearchSection<T extends object>({ title, children, className, ...props }: SearchSectionProps<T>) {
  return (
    <ListBoxSection {...props} className={cn("py-1", className)}>
      <AriaHeader className="px-4 pt-2 pb-1 text-title-sm text-on-surface-variant">{title}</AriaHeader>
      {children}
    </ListBoxSection>
  )
}

/** Highlights the query inside a result label. Reads the enclosing SearchView's input unless `query` is given. */
function SearchHighlight({ children, query: queryProp }: { children: string; query?: string }) {
  const fromView = React.useContext(SearchQueryContext)
  const query = (queryProp ?? fromView).trim()
  if (!query) return <>{children}</>
  const at = children.toLocaleLowerCase().indexOf(query.toLocaleLowerCase())
  if (at < 0) return <>{children}</>
  return (
    <>
      {children.slice(0, at)}
      <span className="text-primary">{children.slice(at, at + query.length)}</span>
      {children.slice(at + query.length)}
    </>
  )
}

export { SearchBar, SearchHighlight, SearchItem, SearchSection, SearchView }
