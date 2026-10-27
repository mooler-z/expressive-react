"use client"

import * as React from "react"
import {
  Cell as AriaCell,
  Collection,
  Column as AriaColumn,
  ColumnResizer,
  ResizableTableContainer,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableColumnResizeStateContext,
  TableHeader as AriaTableHeader,
  composeRenderProps,
  useTableOptions,
  type CellProps as AriaCellProps,
  type ColumnProps as AriaColumnProps,
  type Key,
  type RowProps as AriaRowProps,
  type SortDescriptor,
  type TableBodyProps as AriaTableBodyProps,
  type TableHeaderProps as AriaTableHeaderProps,
  type TableProps as AriaTableProps,
} from "react-aria-components"

import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuPopover, MenuTrigger, type MenuProps } from "@/components/ui/menu"
import { LinearProgress } from "@/components/ui/progress"
import { SearchBar, type SearchBarProps } from "@/components/ui/search"
import { Select, SelectItem } from "@/components/ui/select"
import { cn, composeTailwindRenderProps } from "@/lib/utils"

/*
 * Data table · M3 data table on React Aria's Table.
 * Toolbar (search + filter chips + actions), selectable rows with checkboxes, sortable headers,
 * optional column resizing, row-action menus and a pagination footer.
 * Rows: outline-variant dividers, on-surface 4% hover, primary 5% selected. Headers: label-large.
 * Dense: 12dp cell padding, body-small.
 *
 * <DataTableCard>
 *   <DataTableToolbar><DataTableSearch … /></DataTableToolbar>
 *   <DataTable aria-label="…" selectionMode="multiple" sortDescriptor={…} onSortChange={…}>
 *     <DataTableHeader>
 *       <DataTableColumn id="name" isRowHeader allowsSorting>Name</DataTableColumn>
 *     </DataTableHeader>
 *     <DataTableBody items={rows}>{(row) => <DataTableRow>…<DataTableCell/></DataTableRow>}</DataTableBody>
 *   </DataTable>
 *   <DataTablePagination … />
 * </DataTableCard>
 */

type Density = "default" | "dense"
const DensityContext = React.createContext<Density>("default")

/* ---------- Surface & toolbar ---------- */

/** The rounded surface that holds toolbar, table and footer. */
function DataTableCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div data-slot="data-table-card" className={cn("overflow-hidden rounded-xl bg-surface-container-low", className)} {...props} />
}

function DataTableToolbar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn("flex flex-wrap items-center gap-3 p-4 md:px-6", className)}
      {...props}
    />
  )
}

/** Compact pill search for the toolbar. */
function DataTableSearch({ className, ...props }: SearchBarProps) {
  return <SearchBar {...props} className={cn("h-12 min-w-[220px] flex-1 sm:max-w-sm [&_input]:text-body-md", className)} />
}

/** 4dp indeterminate bar that sits between toolbar and table while refreshing. Keeps its height when idle. */
function DataTableProgress({ isLoading, className }: { isLoading?: boolean; className?: string }) {
  return (
    <div data-slot="data-table-progress" className={cn("h-1 overflow-hidden", className)}>
      {isLoading && <LinearProgress isIndeterminate showStop={false} aria-label="Refreshing" className="w-full" />}
    </div>
  )
}

/* ---------- Table ---------- */

export interface DataTableProps extends AriaTableProps {
  density?: Density
  /** Wrap in a ResizableTableContainer so columns get drag/keyboard resizers. */
  resizable?: boolean
  /** Dims the rows and sets aria-busy (pair with <DataTableProgress>). */
  isLoading?: boolean
  /** Classes for the scroll container (e.g. a max height for sticky headers). */
  containerClassName?: string
}

function DataTable({ className, density = "default", resizable = false, isLoading, containerClassName, ...props }: DataTableProps) {
  const table = (
    <AriaTable
      data-slot="data-table"
      aria-busy={isLoading || undefined}
      {...props}
      className={composeTailwindRenderProps(
        className,
        cn(
          "w-full border-collapse text-left text-on-surface outline-none",
          density === "dense" ? "text-body-sm" : "text-body-md",
          "data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-secondary",
          isLoading && "[&>tbody]:opacity-60",
        ),
      )}
    />
  )
  return (
    <DensityContext.Provider value={density}>
      {resizable ? (
        <ResizableTableContainer data-slot="data-table-container" className={cn("relative w-full overflow-auto", containerClassName)}>
          {table}
        </ResizableTableContainer>
      ) : (
        <div data-slot="data-table-container" className={cn("relative w-full overflow-x-auto", containerClassName)}>
          {table}
        </div>
      )}
    </DensityContext.Provider>
  )
}

function DataTableHeader<T extends object>({ columns, children, className, ...props }: AriaTableHeaderProps<T>) {
  const { selectionBehavior, selectionMode } = useTableOptions()
  const density = React.useContext(DensityContext)
  return (
    <AriaTableHeader
      data-slot="data-table-header"
      {...props}
      className={composeTailwindRenderProps(
        className,
        cn(
          "text-on-surface-variant [&>tr]:border-y [&>tr]:border-outline-variant",
          density === "dense" ? "text-label-md" : "text-label-lg",
        ),
      )}
    >
      {selectionBehavior === "toggle" && selectionMode !== "none" && (
        <AriaColumn width={56} minWidth={56} className="w-14 px-1 py-0 outline-none">
          {selectionMode === "multiple" && <Checkbox slot="selection" aria-label="Select all rows" className="-my-1" />}
        </AriaColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  )
}

export interface DataTableColumnProps extends AriaColumnProps {
  align?: "start" | "end"
}

function DataTableColumn({ className, children, align = "start", ...props }: DataTableColumnProps) {
  const density = React.useContext(DensityContext)
  return (
    <AriaColumn
      data-slot="data-table-column"
      {...props}
      className={composeTailwindRenderProps(
        className,
        cn(
          "group/col relative cursor-default text-left font-medium whitespace-nowrap outline-none",
          density === "dense" ? "px-3 py-2" : "px-4 py-3",
          "data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-secondary",
        ),
      )}
    >
      {composeRenderProps(children, (children, { allowsSorting, sortDirection }) => (
        <div className={cn("flex min-w-0 items-center", align === "end" && "justify-end")}>
          {allowsSorting ? (
            <span
              className={cn(
                "state-layer inline-flex h-8 min-w-0 items-center gap-1 rounded-full [--icon-size:18px]",
                align === "end" ? "-mr-1 flex-row-reverse pr-2 pl-1" : "-ml-2 pr-1 pl-2",
                sortDirection && "text-on-surface",
              )}
            >
              <span className="truncate">{children}</span>
              <Icon
                className={cn(
                  "transition-[rotate,opacity] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
                  !sortDirection && "opacity-0 group-data-hovered/col:opacity-38",
                  sortDirection === "descending" && "rotate-180",
                )}
              >
                arrow_upward
              </Icon>
            </span>
          ) : (
            <span className="truncate">{children}</span>
          )}
          <DataTableColumnResizer />
        </div>
      ))}
    </AriaColumn>
  )
}

/**
 * Resize handle, shown only inside a ResizableTableContainer. It reads the resize state here, inside the
 * column's render function: React Aria builds the column collection outside the Table's providers,
 * so the context is always null in DataTableColumn's own body.
 */
function DataTableColumnResizer() {
  if (React.useContext(TableColumnResizeStateContext) == null) return null
  return (
    <ColumnResizer
      className={cn(
        "absolute inset-y-2 right-0 box-content w-0.5 cursor-col-resize touch-none rounded-full bg-clip-content px-1.5 outline-none",
        "bg-outline-variant opacity-0 transition-opacity group-data-hovered/col:opacity-100",
        "data-resizing:bg-primary data-resizing:opacity-100 data-focus-visible:bg-secondary data-focus-visible:opacity-100",
      )}
    />
  )
}

function DataTableBody<T extends object>({ className, renderEmptyState, ...props }: AriaTableBodyProps<T>) {
  return (
    <AriaTableBody
      data-slot="data-table-body"
      renderEmptyState={renderEmptyState ?? (() => <DataTableEmpty />)}
      {...props}
      className={composeTailwindRenderProps(className, "transition-opacity [&>tr+tr]:border-t [&>tr+tr]:border-outline-variant")}
    />
  )
}

/** Default empty state; pass your own to DataTableBody's `renderEmptyState`. */
function DataTableEmpty({ icon = "search_off", title = "No results", children }: { icon?: string; title?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center text-on-surface-variant">
      <Icon size={32}>{icon}</Icon>
      <div className="text-title-md text-on-surface">{title}</div>
      {children && <div className="text-body-md">{children}</div>}
    </div>
  )
}

function DataTableRow<T extends object>({ id, columns, children, className, ...props }: AriaRowProps<T>) {
  const { selectionBehavior, selectionMode } = useTableOptions()
  const interactive = !!(props.onAction || props.href)
  return (
    <AriaRow
      id={id}
      data-slot="data-table-row"
      {...props}
      className={composeTailwindRenderProps(
        className,
        cn(
          "relative outline-none transition-colors duration-150",
          "data-hovered:bg-on-surface/4 data-selected:bg-primary/5 data-selected:data-hovered:bg-primary/8",
          "data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-secondary",
          "data-disabled:text-on-surface/38",
          interactive && "cursor-pointer",
        ),
      )}
    >
      {selectionBehavior === "toggle" && selectionMode !== "none" && (
        <AriaCell className="px-1 py-0 outline-none">
          <Checkbox slot="selection" className="-my-1" />
        </AriaCell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  )
}

export interface DataTableCellProps extends AriaCellProps {
  align?: "start" | "end"
  /** Tabular numerals, end-aligned. */
  numeric?: boolean
  /** De-emphasised text (on-surface-variant). */
  muted?: boolean
}

function DataTableCell({ className, align, numeric, muted, ...props }: DataTableCellProps) {
  const density = React.useContext(DensityContext)
  return (
    <AriaCell
      data-slot="data-table-cell"
      {...props}
      className={composeTailwindRenderProps(
        className,
        cn(
          "outline-none",
          density === "dense" ? "px-3 py-1.5" : "px-4 py-3",
          (align === "end" || (numeric && align !== "start")) && "text-right",
          numeric && "tabular-nums",
          muted && "text-on-surface-variant",
          "data-focus-visible:outline-2 data-focus-visible:-outline-offset-2 data-focus-visible:outline-secondary",
        ),
      )}
    />
  )
}

/* ---------- Row actions ---------- */

export interface DataTableRowActionsProps<T> extends MenuProps<T> {
  /** Accessible name for the ⋮ button. */
  label?: string
}

/** ⋮ icon button that opens a menu. Put it in the last cell; pressing it never toggles row selection. */
function DataTableRowActions<T extends object>({ label = "Row actions", ...props }: DataTableRowActionsProps<T>) {
  return (
    <MenuTrigger>
      <IconButton aria-label={label} className="-my-2">
        <Icon>more_vert</Icon>
      </IconButton>
      <MenuPopover placement="bottom end">
        <Menu {...props} />
      </MenuPopover>
    </MenuTrigger>
  )
}

/* ---------- Pagination ---------- */

export interface DataTablePaginationProps {
  /** 1-based page. */
  page: number
  pageSize: number
  /** Total rows across all pages. */
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
  /** Leading content, e.g. "3 of 48 selected". */
  start?: React.ReactNode
  className?: string
}

function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  start,
  className,
}: DataTablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)
  const fmt = (n: number) => n.toLocaleString()
  return (
    <div
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-outline-variant px-4 py-2 text-body-sm text-on-surface-variant md:px-6",
        className,
      )}
    >
      {start && <span>{start}</span>}
      <span className="ml-auto flex items-center gap-2">
        {onPageSizeChange && (
          <>
            <span className="hidden sm:inline">Rows per page</span>
            <Select
              aria-label="Rows per page"
              density="xs"
              selectedKey={pageSize}
              onSelectionChange={(k) => k != null && onPageSizeChange(Number(k))}
              className="w-24"
            >
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} id={n}>
                  {String(n)}
                </SelectItem>
              ))}
            </Select>
          </>
        )}
      </span>
      <span className="tabular-nums" aria-live="polite">
        {fmt(from)}–{fmt(to)} of {fmt(total)}
      </span>
      <span className="flex">
        <IconButton aria-label="First page" isDisabled={page <= 1} onPress={() => onPageChange(1)}>
          <Icon>first_page</Icon>
        </IconButton>
        <IconButton aria-label="Previous page" isDisabled={page <= 1} onPress={() => onPageChange(page - 1)}>
          <Icon>chevron_left</Icon>
        </IconButton>
        <IconButton aria-label="Next page" isDisabled={page >= pageCount} onPress={() => onPageChange(page + 1)}>
          <Icon>chevron_right</Icon>
        </IconButton>
        <IconButton aria-label="Last page" isDisabled={page >= pageCount} onPress={() => onPageChange(pageCount)}>
          <Icon>last_page</Icon>
        </IconButton>
      </span>
    </div>
  )
}

/* ---------- Local data hook ---------- */

export interface UseDataTableOptions<T> {
  /** Value to sort a column by. Defaults to `row[columnId]`. */
  sortValue?: (row: T, column: Key) => string | number | null | undefined
  /** Search predicate for `query`. Without it, search matches any string/number field. */
  search?: (row: T, query: string) => boolean
  initialSort?: SortDescriptor
  pageSize?: number
}

/**
 * Client-side search, sort and pagination for <DataTable>.
 * `const dt = useDataTable(rows, { pageSize: 10 })` then spread `dt.tableProps` on <DataTable>,
 * pass `dt.items` to <DataTableBody>, `dt.searchProps` to <DataTableSearch>, `dt.paginationProps` to <DataTablePagination>.
 */
function useDataTable<T extends object>(rows: readonly T[], options: UseDataTableOptions<T> = {}) {
  const { sortValue, search, initialSort, pageSize: initialPageSize = 10 } = options
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor | undefined>(initialSort)
  const [query, setQueryState] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSizeState] = React.useState(initialPageSize)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    const match =
      search ??
      ((row: T, q: string) =>
        Object.values(row).some((v) => (typeof v === "string" || typeof v === "number") && String(v).toLowerCase().includes(q)))
    return rows.filter((r) => match(r, q))
  }, [rows, query, search])

  const sorted = React.useMemo(() => {
    if (!sortDescriptor) return filtered
    const col = sortDescriptor.column
    const get = sortValue ?? ((row: T, c: Key) => (row as Record<Key, unknown>)[c] as string | number | null | undefined)
    const out = [...filtered].sort((a, b) => {
      const x = get(a, col), y = get(b, col)
      if (x == null) return 1
      if (y == null) return -1
      return typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })
    })
    return sortDescriptor.direction === "descending" ? out.reverse() : out
  }, [filtered, sortDescriptor, sortValue])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(page, pageCount)
  const items = React.useMemo(() => sorted.slice((current - 1) * pageSize, current * pageSize), [sorted, current, pageSize])

  const setQuery = React.useCallback((q: string) => {
    setQueryState(q)
    setPage(1)
  }, [])
  const setPageSize = React.useCallback((n: number) => {
    setPageSizeState(n)
    setPage(1)
  }, [])

  return {
    items,
    total: sorted.length,
    page: current,
    pageCount,
    pageSize,
    query,
    sortDescriptor,
    setPage,
    setPageSize,
    setQuery,
    setSortDescriptor,
    tableProps: { sortDescriptor, onSortChange: setSortDescriptor },
    searchProps: { value: query, onChange: setQuery },
    paginationProps: { page: current, pageSize, total: sorted.length, onPageChange: setPage, onPageSizeChange: setPageSize },
  }
}

export {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTableCell,
  DataTableColumn,
  DataTableEmpty,
  DataTableHeader,
  DataTablePagination,
  DataTableProgress,
  DataTableRow,
  DataTableRowActions,
  DataTableSearch,
  DataTableToolbar,
  useDataTable,
}
