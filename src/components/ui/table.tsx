"use client"

import * as React from "react"
import type { VariantProps } from "tailwind-variants"

import { Icon } from "@/components/ui/icon"
import { cn, tv } from "@/lib/utils"

/*
 * Table · plain content tables (invoices, specs, comparisons).
 * Caption in title-medium, label headers in on-surface-variant, outline-variant row dividers,
 * tabular numerals for numeric cells and a title-small totals footer.
 * Variants: plain · striped · grid (bordered) · cards (separated rows). Density: default · dense.
 * For sorting, selection, resizing and pagination use <DataTable> (data-table.tsx).
 */
const tableVariants = tv({
  slots: {
    container: "relative w-full overflow-x-auto",
    table: "w-full caption-bottom text-left text-body-md text-on-surface",
    caption: "pb-4 text-left text-title-md text-on-surface [caption-side:top]",
    header: "text-on-surface-variant",
    body: "",
    footer: "text-title-sm",
    row: "",
    head: "font-medium whitespace-nowrap",
    cell: "",
  },
  variants: {
    variant: {
      plain: {
        header: "text-label-lg [&_tr]:border-b [&_tr]:border-outline-variant",
        body: "[&>tr+tr]:border-t [&>tr+tr]:border-outline-variant",
        footer: "[&>tr]:border-t [&>tr]:border-outline-variant",
        head: "py-3 pr-4 last:pr-0",
        cell: "py-3 pr-4 last:pr-0 [tfoot_&]:pt-4",
      },
      striped: {
        table: "overflow-hidden rounded-lg",
        header: "text-label-md",
        row: "[tbody>&:nth-child(odd)]:bg-surface-container [tbody>&]:transition-colors [tbody>&]:hover:bg-on-surface/6",
        head: "px-3 py-2",
        cell: "px-3 py-2.5 [tfoot_&]:pt-3",
      },
      grid: {
        table: "border-collapse",
        header: "bg-surface-container-high text-label-md",
        head: "border border-outline-variant px-3 py-2",
        cell: "border border-outline-variant px-3 py-2",
      },
      cards: {
        table: "border-separate border-spacing-y-1.5",
        header: "text-label-md",
        row: "group/row",
        head: "px-3 py-2",
        cell: [
          "[tbody_&]:bg-surface px-3 py-3 first:rounded-l-lg last:rounded-r-lg",
          "[tbody_&]:transition-colors [tbody_&]:group-hover/row:bg-surface-container-high",
        ],
      },
    },
    density: {
      default: {},
      dense: {
        table: "text-body-sm",
        header: "text-label-md",
        head: "py-2",
        cell: "py-1",
      },
    },
  },
  compoundVariants: [
    { variant: "plain", density: "dense", class: { head: "px-3 last:pr-3", cell: "px-3 last:pr-3", body: "[&>tr+tr]:border-outline-variant/60" } },
  ],
  defaultVariants: { variant: "plain", density: "default" },
})

type TableStyleProps = VariantProps<typeof tableVariants>

const TableContext = React.createContext<ReturnType<typeof tableVariants>>(tableVariants())
const useTableStyles = () => React.useContext(TableContext)

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement>, TableStyleProps {
  /** Classes for the scroll container around the table. */
  containerClassName?: string
}

function Table({ className, containerClassName, variant, density, ...props }: TableProps) {
  const styles = React.useMemo(() => tableVariants({ variant, density }), [variant, density])
  return (
    <TableContext.Provider value={styles}>
      <div data-slot="table-container" className={styles.container({ className: containerClassName })}>
        <table data-slot="table" className={styles.table({ className })} {...props} />
      </div>
    </TableContext.Provider>
  )
}

function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption data-slot="table-caption" className={useTableStyles().caption({ className })} {...props} />
}

function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead data-slot="table-header" className={useTableStyles().header({ className })} {...props} />
}

function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody data-slot="table-body" className={useTableStyles().body({ className })} {...props} />
}

function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot data-slot="table-footer" className={useTableStyles().footer({ className })} {...props} />
}

function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr data-slot="table-row" className={useTableStyles().row({ className })} {...props} />
}

type Align = "start" | "center" | "end"
const alignClass = { start: "text-left", center: "text-center", end: "text-right" } as const

export interface TableHeadProps extends Omit<React.ThHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: Align
  /** Current sort of this column. Passing it (with `onSort`) renders a sort button. */
  sort?: "ascending" | "descending" | "none"
  onSort?: () => void
}

function TableHead({ className, align = "start", sort, onSort, children, ...props }: TableHeadProps) {
  const sortable = sort !== undefined || onSort !== undefined
  return (
    <th
      data-slot="table-head"
      scope="col"
      aria-sort={sortable ? (sort ?? "none") : undefined}
      className={useTableStyles().head({ className: cn(alignClass[align], className) })}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "state-layer focus-ring -ml-2 inline-flex h-8 cursor-pointer items-center gap-1 rounded-full pr-1 pl-2 [--icon-size:18px]",
            align === "end" && "-mr-1 ml-0 flex-row-reverse pr-2 pl-1",
            sort && sort !== "none" && "text-on-surface",
          )}
        >
          {children}
          <Icon
            className={cn(
              "transition-[rotate,opacity] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
              (!sort || sort === "none") && "opacity-0",
              sort === "descending" && "rotate-180",
            )}
          >
            arrow_upward
          </Icon>
        </button>
      ) : (
        children
      )}
    </th>
  )
}

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "align"> {
  align?: Align
  /** Tabular numerals; right-aligned unless `align` says otherwise. */
  numeric?: boolean
  /** De-emphasised text (on-surface-variant). */
  muted?: boolean
}

function TableCell({ className, align, numeric, muted, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={useTableStyles().cell({
        className: cn(alignClass[align ?? (numeric ? "end" : "start")], numeric && "tabular-nums", muted && "text-on-surface-variant", className),
      })}
      {...props}
    />
  )
}

/** Full-width group label row (e.g. "Compute", "Storage") inside a body. */
function TableGroupRow({ className, colSpan, children, ...props }: React.HTMLAttributes<HTMLTableRowElement> & { colSpan: number }) {
  return (
    <tr data-slot="table-group-row" {...props}>
      <th
        scope="colgroup"
        colSpan={colSpan}
        className={cn("bg-secondary-container px-3 py-1.5 text-left text-label-lg font-normal text-on-secondary-container", className)}
      >
        {children}
      </th>
    </tr>
  )
}

/**
 * Local sort state for plain tables.
 * `const { sorted, headProps } = useTableSort(rows, { amount: r => r.amount })`
 * then `<TableHead {...headProps("amount")}>Amount</TableHead>`.
 */
function useTableSort<T, K extends string>(
  rows: readonly T[],
  accessors: Record<K, (row: T) => string | number>,
  initial?: { column: K; direction: "ascending" | "descending" },
) {
  const [sort, setSort] = React.useState(initial)
  const sorted = React.useMemo(() => {
    if (!sort) return rows
    const get = accessors[sort.column]
    const out = [...rows].sort((a, b) => {
      const x = get(a), y = get(b)
      return typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })
    })
    return sort.direction === "descending" ? out.reverse() : out
  }, [rows, sort])
  const headProps = (column: K) => ({
    sort: sort?.column === column ? sort.direction : ("none" as const),
    onSort: () =>
      setSort((s) => ({ column, direction: s?.column === column && s.direction === "ascending" ? "descending" : "ascending" })),
  })
  return { sorted, sort, setSort, headProps }
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableGroupRow,
  TableHead,
  TableHeader,
  TableRow,
  tableVariants,
  useTableSort,
}
