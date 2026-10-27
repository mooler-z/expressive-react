"use client"

import * as React from "react"
import { Button as AriaButton, Group, Input, Label, NumberField } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Pagination · built from M3 buttons (no M3 spec component)
 *   numbered   40dp (32dp `sm`) round page buttons, label-large · current page on primary
 *              (`tonal`: secondary-container, `outlined`: outline ring) · ellipsis for gaps
 *   connected  Expressive connected button group: 2dp gaps, small inner corners, the current page
 *              morphs to a full pill on the FastSpatial spring
 *   range      "21–30 of 240" + arrows, optional rows-per-page menu and jump-to-page field (table footers)
 *   dots       carousel-style indicator; the current dot stretches into a pill
 */

export type PaginationItem = number | "ellipsis-start" | "ellipsis-end"

/** Pages to show: always the first/last `boundaries`, `siblings` around the current page, ellipses for gaps. */
export function paginationRange(page: number, pageCount: number, siblings = 1, boundaries = 1): PaginationItem[] {
  const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i)
  const total = boundaries * 2 + siblings * 2 + 3
  if (pageCount <= total) return range(1, pageCount)
  const start = Math.max(Math.min(page - siblings, pageCount - boundaries - siblings * 2 - 1), boundaries + 2)
  const end = Math.min(Math.max(page + siblings, boundaries + siblings * 2 + 2), pageCount - boundaries - 1)
  return [
    ...range(1, boundaries),
    start > boundaries + 2 ? "ellipsis-start" : boundaries + 1,
    ...range(start, end),
    end < pageCount - boundaries - 1 ? "ellipsis-end" : pageCount - boundaries,
    ...range(pageCount - boundaries + 1, pageCount),
  ]
}

function useControlled(value: number | undefined, defaultValue: number, onChange?: (v: number) => void) {
  const [inner, setInner] = React.useState(defaultValue)
  const set = React.useCallback(
    (v: number) => {
      setInner(v)
      onChange?.(v)
    },
    [onChange],
  )
  return [value ?? inner, set] as const
}

const pageVariants = tv({
  base: [
    "state-layer focus-ring shape-morph relative inline-flex shrink-0 cursor-pointer items-center justify-center text-label-lg tabular-nums outline-none select-none",
    "data-disabled:cursor-default data-disabled:opacity-38",
  ],
  variants: {
    variant: {
      standard: "rounded-full text-on-surface data-current:bg-primary data-current:text-on-primary",
      tonal: "rounded-full text-on-surface data-current:bg-secondary-container data-current:text-on-secondary-container",
      outlined: "rounded-full text-on-surface data-current:text-primary data-current:ring-1 data-current:ring-outline data-current:ring-inset",
      connected: [
        "rounded-[8px] bg-surface-container px-4 text-on-surface-variant",
        "data-current:rounded-full data-current:bg-primary data-current:px-5 data-current:text-on-primary",
        "data-pressed:rounded-[8px]",
      ],
    },
    size: { md: "h-10 min-w-10", sm: "h-8 min-w-8 text-label-md" },
  },
  defaultVariants: { variant: "standard", size: "md" },
})

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** 1-based current page (controlled). */
  page?: number
  defaultPage?: number
  pageCount: number
  onPageChange?: (page: number) => void
  siblings?: number
  boundaries?: number
  variant?: "standard" | "tonal" | "outlined" | "connected"
  size?: "md" | "sm"
  /** "Previous" / "Next" text beside the arrows (standard variants). */
  showLabels?: boolean
  /** First/last page arrow buttons. */
  showEdges?: boolean
  labels?: { previous?: string; next?: string; first?: string; last?: string; page?: (n: number) => string }
}

function Pagination({
  page: pageProp,
  defaultPage = 1,
  pageCount,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  variant = "standard",
  size = "md",
  showLabels = false,
  showEdges = false,
  labels = {},
  className,
  "aria-label": ariaLabel = "Pagination",
  ...props
}: PaginationProps) {
  const [page, setPage] = useControlled(pageProp, defaultPage, onPageChange)
  const go = (p: number) => setPage(Math.min(pageCount, Math.max(1, p)))
  const connected = variant === "connected"
  const pageLabel = labels.page ?? ((n: number) => `Page ${n}`)

  const arrow = (dir: "first" | "previous" | "next" | "last") => {
    const target = { first: 1, previous: page - 1, next: page + 1, last: pageCount }[dir]
    const disabled = dir === "first" || dir === "previous" ? page <= 1 : page >= pageCount
    const icon = { first: "first_page", previous: "chevron_left", next: "chevron_right", last: "last_page" }[dir]
    const text = labels[dir] ?? { first: "First page", previous: "Previous", next: "Next", last: "Last page" }[dir]
    const withLabel = showLabels && !connected && (dir === "previous" || dir === "next")
    return (
      <AriaButton
        key={dir}
        aria-label={withLabel ? undefined : text}
        isDisabled={disabled}
        onPress={() => go(target)}
        className={cn(
          pageVariants({ variant: connected ? "connected" : "standard", size }),
          "text-on-surface-variant",
          withLabel && (dir === "previous" ? "ps-2 pe-4" : "ps-4 pe-2"),
          connected && dir === "previous" && "rounded-s-full",
          connected && dir === "next" && "rounded-e-full",
        )}
      >
        {dir === "next" && withLabel && text}
        <Icon size={20} className="rtl:rotate-180">{icon}</Icon>
        {dir === "previous" && withLabel && text}
        <Ripple />
      </AriaButton>
    )
  }

  return (
    <nav data-slot="pagination" aria-label={ariaLabel} className={cn("flex flex-wrap items-center", connected ? "gap-0.5" : "gap-1", className)} {...props}>
      {showEdges && arrow("first")}
      {arrow("previous")}
      {paginationRange(page, pageCount, siblings, boundaries).map((item) =>
        typeof item === "number" ? (
          <AriaButton
            key={item}
            aria-label={pageLabel(item)}
            aria-current={item === page ? "page" : undefined}
            data-current={item === page || undefined}
            onPress={() => go(item)}
            className={pageVariants({ variant, size })}
          >
            {item}
            <Ripple />
          </AriaButton>
        ) : (
          <span
            key={item}
            aria-hidden
            className={cn("grid shrink-0 place-items-center text-on-surface-variant", size === "sm" ? "size-8" : "size-10", connected && "rounded-[8px] bg-surface-container")}
          >
            <Icon size={20}>more_horiz</Icon>
          </span>
        ),
      )}
      {arrow("next")}
      {showEdges && arrow("last")}
    </nav>
  )
}

export interface PaginationRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** 1-based page (controlled). */
  page?: number
  defaultPage?: number
  onPageChange?: (page: number) => void
  pageSize: number
  /** Total number of items. */
  total: number
  /** Rows-per-page choices; shows the menu when given. */
  pageSizeOptions?: number[]
  onPageSizeChange?: (size: number) => void
  /** Show a "Go to page" field. */
  showJump?: boolean
  /** Format the range text. */
  formatRange?: (from: number, to: number, total: number) => React.ReactNode
}

/** Compact range + arrows, as used in table footers. */
function PaginationRange({
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  pageSize,
  total,
  pageSizeOptions,
  onPageSizeChange,
  showJump = false,
  formatRange = (from, to, t) => `${from}–${to} of ${t}`,
  className,
  ...props
}: PaginationRangeProps) {
  const [page, setPage] = useControlled(pageProp, defaultPage, onPageChange)
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)
  const go = (p: number) => setPage(Math.min(pageCount, Math.max(1, p)))
  const iconButton = "state-layer focus-ring relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-on-surface data-disabled:cursor-default data-disabled:opacity-38"

  return (
    <div data-slot="pagination-range" className={cn("flex flex-wrap items-center gap-2 text-body-sm text-on-surface-variant", className)} {...props}>
      {pageSizeOptions && (
        <span className="me-2 flex items-center gap-2">
          Rows per page
          <MenuTrigger>
            <AriaButton className="state-layer focus-ring relative inline-flex h-8 cursor-pointer items-center gap-1 rounded-[8px] ps-3 pe-1 text-label-lg text-on-surface">
              {pageSize}
              <Icon size={20}>arrow_drop_down</Icon>
            </AriaButton>
            <MenuPopover>
              <Menu
                aria-label="Rows per page"
                selectionMode="single"
                selectedKeys={[pageSize]}
                onAction={(k) => onPageSizeChange?.(Number(k))}
                className="min-w-24"
              >
                {pageSizeOptions.map((n) => (
                  <MenuItem key={n} id={n}>
                    {String(n)}
                  </MenuItem>
                ))}
              </Menu>
            </MenuPopover>
          </MenuTrigger>
        </span>
      )}
      <span aria-live="polite" className="tabular-nums">
        {formatRange(from, to, total)}
      </span>
      <AriaButton aria-label="Previous page" isDisabled={page <= 1} onPress={() => go(page - 1)} className={iconButton}>
        <Icon className="rtl:rotate-180">chevron_left</Icon>
        <Ripple />
      </AriaButton>
      <AriaButton aria-label="Next page" isDisabled={page >= pageCount} onPress={() => go(page + 1)} className={iconButton}>
        <Icon className="rtl:rotate-180">chevron_right</Icon>
        <Ripple />
      </AriaButton>
      {showJump && (
        <NumberField
          key={page}
          defaultValue={page}
          minValue={1}
          maxValue={pageCount}
          onChange={(v) => !Number.isNaN(v) && go(v)}
          className="ms-4 flex items-center gap-2"
        >
          <Label>Go to page</Label>
          <Group>
            <Input className="h-9 w-14 rounded-xs border border-outline-variant bg-transparent text-center text-body-sm text-on-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:ring-inset" />
          </Group>
        </NumberField>
      )}
    </div>
  )
}

export interface PaginationDotsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  count: number
  /** 0-based active index (controlled). */
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  label?: (i: number) => string
}

/** Carousel / onboarding dots. The active dot stretches into a pill. */
function PaginationDots({
  count,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  label = (i) => `Slide ${i + 1}`,
  className,
  "aria-label": ariaLabel = "Slides",
  ...props
}: PaginationDotsProps) {
  const [index, setIndex] = useControlled(indexProp, defaultIndex, onIndexChange)
  return (
    <div role="group" aria-label={ariaLabel} data-slot="pagination-dots" className={cn("flex items-center gap-1", className)} {...props}>
      {Array.from({ length: count }, (_, i) => (
        <AriaButton
          key={i}
          aria-label={label(i)}
          aria-current={i === index ? "step" : undefined}
          onPress={() => setIndex(i)}
          className="group focus-ring grid h-6 min-w-4 cursor-pointer place-items-center rounded-full"
        >
          <span
            className={cn(
              "block h-2 rounded-full transition-[width,background-color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
              i === index ? "w-6 bg-primary" : "w-2 bg-outline-variant group-data-hovered:bg-on-surface-variant",
            )}
          />
        </AriaButton>
      ))}
    </div>
  )
}

export { Pagination, PaginationDots, PaginationRange, pageVariants as paginationItemVariants }
