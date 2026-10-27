"use client"

import * as React from "react"
import {
  GridList,
  GridListItem,
  composeRenderProps,
  type GridListItemProps,
  type GridListProps,
} from "react-aria-components"

import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Lists · M3 (androidx ListTokens)
 *   heights   one-line 56 · two-line 72 · three-line 88
 *   spacing   16dp leading/trailing · 12dp between · 10dp top/bottom
 *   type      headline body-large · supporting body-medium · overline + trailing text label-small
 *   leading   avatar 40 · icon 24 · image 56 · video 100×56
 *   selected  secondary-container, large (16dp) corners
 *   segmented (Expressive) items 4dp apart-ish with 4dp corners, 12dp on hover, 16dp selected / pressed / focused,
 *             outer corners 16dp (container large)
 */
const listItemVariants = tv({
  slots: {
    root: "relative flex w-full items-center gap-3 px-4 py-2.5 text-start text-on-surface",
    leading: "flex shrink-0 items-center justify-center text-on-surface-variant [--icon-size:24px] in-data-selected:text-on-secondary-container",
    content: "min-w-0 flex-1",
    overline: "truncate text-label-sm text-on-surface-variant in-data-selected:text-on-secondary-container",
    headline: "truncate text-body-lg",
    supporting: "text-body-md text-on-surface-variant in-data-selected:text-on-secondary-container",
    trailing: "flex shrink-0 items-center gap-2 text-on-surface-variant [--icon-size:24px] in-data-selected:text-on-secondary-container",
    trailingText: "text-label-sm whitespace-nowrap",
  },
  variants: {
    lines: {
      1: { root: "min-h-14", supporting: "truncate" },
      2: { root: "min-h-18", supporting: "truncate" },
      3: { root: "min-h-22 items-start", supporting: "line-clamp-2", leading: "mt-0.5", trailing: "mt-0.5" },
    },
  },
  defaultVariants: { lines: 1 },
})

export interface ListItemContentProps {
  /** Avatar, icon, image, checkbox… */
  leading?: React.ReactNode
  /** Label-small line above the headline. */
  overline?: React.ReactNode
  supportingText?: React.ReactNode
  /** Icon, switch, checkbox, icon button… */
  trailing?: React.ReactNode
  /** Short meta text at the end ("09:41", "2.4 MB"). */
  trailingText?: React.ReactNode
  /** Force a line count; otherwise inferred (3 needs an explicit value or overline + supporting text). */
  lines?: 1 | 2 | 3
}

function inferLines({ lines, overline, supportingText }: ListItemContentProps): 1 | 2 | 3 {
  if (lines) return lines
  if (overline && supportingText) return 3
  return overline || supportingText ? 2 : 1
}

function ItemContent({
  slots,
  leading,
  overline,
  supportingText,
  trailing,
  trailingText,
  children,
}: ListItemContentProps & { slots: ReturnType<typeof listItemVariants>; children?: React.ReactNode }) {
  return (
    <>
      {leading && <span data-slot="list-item-leading" className={slots.leading()}>{leading}</span>}
      <span className={slots.content()}>
        {overline && <span className={cn(slots.overline(), "block")}>{overline}</span>}
        <span data-slot="list-item-headline" className={cn(slots.headline(), "block")}>{children}</span>
        {supportingText && <span className={cn(slots.supporting(), "block")}>{supportingText}</span>}
      </span>
      {(trailing || trailingText) && (
        <span data-slot="list-item-trailing" className={slots.trailing()}>
          {trailingText && <span className={slots.trailingText()}>{trailingText}</span>}
          {trailing}
        </span>
      )}
    </>
  )
}

/* ---------- Static list (display only) ---------- */

function List({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul role="list" data-slot="list" className={cn("py-2", className)} {...props} />
}

export interface ListItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "children">, ListItemContentProps {
  /** Headline. */
  children?: React.ReactNode
}

function ListItem({ className, leading, overline, supportingText, trailing, trailingText, lines, children, ...props }: ListItemProps) {
  const slots = listItemVariants({ lines: inferLines({ lines, overline, supportingText }) })
  return (
    <li data-slot="list-item" className={slots.root({ className })} {...props}>
      <ItemContent slots={slots} {...{ leading, overline, supportingText, trailing, trailingText }}>
        {children}
      </ItemContent>
    </li>
  )
}

/** Section label inside a list ("Archived"). */
function ListSubheader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="presentation" data-slot="list-subheader" className={cn("px-4 pt-3 pb-1 text-title-sm text-primary", className)} {...props} />
}

/** Leading 56dp image / 100×56 video thumbnail. */
function ListItemMedia({ className, variant = "image", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "image" | "video" }) {
  return (
    <span
      data-slot="list-item-media"
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-sm [&>img]:size-full [&>img]:object-cover",
        variant === "image" ? "size-14" : "h-14 w-25",
        className,
      )}
      {...props}
    />
  )
}

/* ---------- Interactive list (React Aria GridList) ---------- */

type ListVariant = "standard" | "segmented"
const ListVariantContext = React.createContext<ListVariant>("standard")

export interface InteractiveListProps<T> extends GridListProps<T> {
  /** `segmented`: the Expressive look — separate rounded items that morph when hovered / selected. */
  variant?: ListVariant
}

/**
 * Keyboard-navigable list with optional single/multiple selection, actions and links.
 * Put `<Checkbox slot="selection" />` in `leading`/`trailing` to show selection checkboxes.
 */
function InteractiveList<T extends object>({ variant = "standard", className, ...props }: InteractiveListProps<T>) {
  return (
    <ListVariantContext.Provider value={variant}>
      <GridList
        data-slot="list"
        {...props}
        className={composeRenderProps(className, (className) =>
          cn("outline-none", variant === "segmented" ? "flex flex-col gap-0.5" : "py-2", className),
        )}
      />
    </ListVariantContext.Provider>
  )
}

export interface InteractiveListItemProps extends Omit<GridListItemProps, "children">, ListItemContentProps {
  /** Headline. */
  children?: React.ReactNode
}

function InteractiveListItem({
  className,
  leading,
  overline,
  supportingText,
  trailing,
  trailingText,
  lines,
  children,
  textValue,
  ...props
}: InteractiveListItemProps) {
  const variant = React.useContext(ListVariantContext)
  const slots = listItemVariants({ lines: inferLines({ lines, overline, supportingText }) })
  return (
    <GridListItem
      data-slot="list-item"
      textValue={textValue ?? (typeof children === "string" ? children : undefined)}
      {...props}
      className={composeRenderProps(className, (className) =>
        cn(
          "state-layer shape-morph relative flex w-full cursor-pointer text-on-surface outline-none",
          "data-focus-visible:outline-3 data-focus-visible:-outline-offset-3 data-focus-visible:outline-secondary",
          "data-selected:rounded-lg data-selected:bg-secondary-container data-selected:text-on-secondary-container",
          "data-disabled:cursor-default data-disabled:text-on-surface/38",
          variant === "segmented" &&
            "rounded-xs bg-surface first:rounded-t-lg last:rounded-b-lg data-hovered:rounded-md data-pressed:rounded-lg data-focus-visible:rounded-lg",
          className,
        ),
      )}
    >
      {/* GridList cells are display:contents, so this box carries the layout (and hosts the ripple). */}
      <div className={slots.root({ className: "rounded-[inherit] text-inherit" })}>
        <ItemContent slots={slots} {...{ leading, overline, supportingText, trailing, trailingText }}>
          {children}
        </ItemContent>
        <Ripple />
      </div>
    </GridListItem>
  )
}

export { InteractiveList, InteractiveListItem, List, ListItem, ListItemMedia, ListSubheader, listItemVariants }
