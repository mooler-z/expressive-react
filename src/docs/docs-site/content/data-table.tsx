import Demo from "@/docs/docs-site/examples/data-table/demo"
import demoSrc from "@/docs/docs-site/examples/data-table/demo?raw"
import Empty from "@/docs/docs-site/examples/data-table/empty"
import emptySrc from "@/docs/docs-site/examples/data-table/empty?raw"
import Loading from "@/docs/docs-site/examples/data-table/loading"
import loadingSrc from "@/docs/docs-site/examples/data-table/loading?raw"
import Resizable from "@/docs/docs-site/examples/data-table/resizable"
import resizableSrc from "@/docs/docs-site/examples/data-table/resizable?raw"
import Selection from "@/docs/docs-site/examples/data-table/selection"
import selectionSrc from "@/docs/docs-site/examples/data-table/selection?raw"
import Sorting from "@/docs/docs-site/examples/data-table/sorting"
import sortingSrc from "@/docs/docs-site/examples/data-table/sorting?raw"
import Expandable from "@/docs/docs-site/examples/data-table/expandable"
import expandableSrc from "@/docs/docs-site/examples/data-table/expandable?raw"
import Server from "@/docs/docs-site/examples/data-table/server"
import serverSrc from "@/docs/docs-site/examples/data-table/server?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "An interactive table on React Aria's Table: sortable columns, row selection with checkboxes, column resizing, row-action menus, a search toolbar, pagination and loading and empty states. useDataTable handles search, sort and paging for client-side data.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/Table.html" },
  preview: { component: Demo, source: demoSrc, className: "items-stretch" },
  usage: `import {
  DataTable, DataTableBody, DataTableCell, DataTableColumn, DataTableHeader, DataTableRow, useDataTable,
} from "@/components/ui/data-table"

const dt = useDataTable(rows, { pageSize: 10 })

<DataTable aria-label="Deployments" {...dt.tableProps}>
  <DataTableHeader>
    <DataTableColumn id="service" isRowHeader allowsSorting>Service</DataTableColumn>
  </DataTableHeader>
  <DataTableBody items={dt.items}>
    {(row) => <DataTableRow id={row.id}><DataTableCell>{row.service}</DataTableCell></DataTableRow>}
  </DataTableBody>
</DataTable>`,
  examples: [
    {
      id: "sorting",
      title: "Sorting",
      description: (
        <>
          Mark columns <InlineCode>allowsSorting</InlineCode> and spread <InlineCode>dt.tableProps</InlineCode> (sortDescriptor + onSortChange). Sort values
          default to <InlineCode>row[columnId]</InlineCode>; pass <InlineCode>sortValue</InlineCode> for anything else.
        </>
      ),
      component: Sorting,
      source: sortingSrc,
    },
    {
      id: "selection",
      title: "Selection",
      description: "selectionMode adds a checkbox column (and select-all in multiple mode). disabledKeys keeps rows unselectable. Selected rows tint to primary at 5%.",
      component: Selection,
      source: selectionSrc,
    },
    {
      id: "resizable",
      title: "Resizable columns",
      description: "resizable wraps the table in React Aria's ResizableTableContainer. Hover a header edge and drag; minWidth and maxWidth bound each column.",
      component: Resizable,
      source: resizableSrc,
    },
    {
      id: "loading",
      title: "Loading and dense",
      description: (
        <>
          <InlineCode>DataTableProgress</InlineCode> shows a 4dp indeterminate bar while <InlineCode>isLoading</InlineCode> dims the rows and sets{" "}
          <InlineCode>aria-busy</InlineCode>. density="dense" tightens cells to 12dp.
        </>
      ),
      component: Loading,
      source: loadingSrc,
    },
    {
      id: "empty",
      title: "Empty state",
      description: "DataTableBody shows DataTableEmpty when there are no rows. Pass renderEmptyState for your own message and actions.",
      component: Empty,
      source: emptySrc,
    },
    {
      id: "expandable",
      title: "Expandable rows",
      description: (
        <>
          A <InlineCode>DataTableExpandButton</InlineCode> in the row opens a <InlineCode>DataTableDetailRow</InlineCode> rendered right after it: one
          surface-container cell spanning <InlineCode>colSpan</InlineCode> columns. <InlineCode>useExpandedRows</InlineCode> holds the open rows; its{" "}
          <InlineCode>tableProps</InlineCode> keep detail rows focusable but out of selection, and <InlineCode>single</InlineCode> allows one open row
          at a time. Render the body from a <InlineCode>map</InlineCode> with a <InlineCode>Fragment</InlineCode> per row.
        </>
      ),
      component: Expandable,
      source: expandableSrc,
    },
    {
      id: "server",
      title: "Server-side pagination",
      description: (
        <>
          Drive <InlineCode>DataTablePagination</InlineCode> from your API's page and total, and show <InlineCode>DataTableProgress</InlineCode> while a
          page loads. <InlineCode>showJump</InlineCode> adds a Go to page field, which commits on Enter or blur.
        </>
      ),
      component: Server,
      source: serverSrc,
    },
  ],
  api: [
    {
      name: "DataTable",
      description: <>React Aria {c("Table")}: everything it accepts (selectionMode, selectedKeys, onSelectionChange, sortDescriptor, onSortChange, disabledKeys, onRowAction…), plus:</>,
      props: [
        { name: "density", type: '"default" | "dense"', default: '"default"', description: "Cell padding 16dp / 12dp and body-medium / body-small." },
        { name: "resizable", type: "boolean", default: "false", description: "Adds drag and keyboard column resizers." },
        { name: "isLoading", type: "boolean", default: "false", description: "Dims rows and sets aria-busy. Pair with DataTableProgress." },
        { name: "containerClassName", type: "string", default: "—", description: "Classes for the scroll container, e.g. a max height for long tables." },
      ],
    },
    {
      name: "DataTableColumn",
      description: <>React Aria {c("Column")}: id, isRowHeader, allowsSorting, width, defaultWidth, minWidth, maxWidth, plus:</>,
      props: [{ name: "align", type: '"start" | "end"', default: '"start"', description: "Header alignment. Use end for numeric columns." }],
    },
    {
      name: "DataTableCell",
      description: <>React Aria {c("Cell")}, plus:</>,
      props: [
        { name: "align", type: '"start" | "end"', default: "—", description: "Text alignment." },
        { name: "numeric", type: "boolean", default: "false", description: "Tabular numerals, end-aligned." },
        { name: "muted", type: "boolean", default: "false", description: "on-surface-variant text." },
      ],
    },
    {
      name: "DataTableHeader · DataTableBody · DataTableRow",
      description: (
        <>
          React Aria {c("TableHeader")}, {c("TableBody")} (items, renderEmptyState, dependencies) and {c("Row")}. Header and row add the checkbox column
          automatically when selection is on.
        </>
      ),
      props: [{ name: "renderEmptyState", type: "() => ReactNode", default: "<DataTableEmpty />", description: "On DataTableBody: content when there are no rows." }],
    },
    {
      name: "DataTableRowActions",
      description: <>⋮ icon button that opens a Menu. Accepts Menu props (onAction, children of MenuItem). Pressing it never toggles selection.</>,
      props: [{ name: "label", type: "string", default: '"Row actions"', description: "Accessible name for the button; include the row name." }],
    },
    {
      name: "DataTableExpandButton",
      description: "Chevron icon button that toggles a row's detail panel; sets aria-expanded.",
      props: [
        { name: "isExpanded", type: "boolean", default: "—", description: "Required. Rotates the chevron." },
        { name: "onExpandedChange", type: "(isExpanded: boolean) => void", default: "—", description: "Required." },
        { name: "label", type: "string", default: '"Details"', description: "Accessible name; include the row name." },
      ],
    },
    {
      name: "DataTableDetailRow",
      description: "Everything React Aria's Row accepts (id, textValue…), plus:",
      props: [
        { name: "colSpan", type: "number", default: "—", description: "Required. The number of DataTableColumns you declared; the selection column is added for you." },
        { name: "className", type: "string", default: "—", description: "Classes for the panel cell." },
        { name: "children", type: "ReactNode", default: "—", description: "The panel content." },
      ],
    },
    {
      name: "useExpandedRows(options?)",
      props: [
        { name: "options.defaultExpandedKeys", type: "Iterable<Key>", default: "—", description: "Rows open on mount." },
        { name: "options.single", type: "boolean", default: "false", description: "Opening a row closes the previous one." },
        {
          name: "returns",
          type: "object",
          default: "—",
          description:
            "expandedKeys, setExpandedKeys, isExpanded(key), setExpanded(key, open), toggle(key), detailKey(key) for the detail row's id, expandButtonProps(key) for DataTableExpandButton, and tableProps to spread on DataTable.",
        },
      ],
    },
    {
      name: "DataTablePagination",
      description: "Footer with a rows-per-page select, the range and first/previous/next/last buttons.",
      props: [
        { name: "page", type: "number", default: "—", description: "1-based page (required)." },
        { name: "pageSize · total", type: "number", default: "—", description: "Rows per page and total rows across pages (required)." },
        { name: "onPageChange", type: "(page: number) => void", default: "—", description: "Required." },
        { name: "onPageSizeChange", type: "(size: number) => void", default: "—", description: "Shows the rows-per-page select when set." },
        { name: "pageSizeOptions", type: "number[]", default: "[10, 25, 50]", description: "Choices in the select." },
        { name: "start", type: "ReactNode", default: "—", description: "Leading content, e.g. \"3 of 48 selected\"." },
        { name: "showJump", type: "boolean", default: "false", description: "Adds a Go to page number field (commits on Enter or blur)." },
      ],
    },
    {
      name: "DataTableCard · DataTableToolbar · DataTableSearch · DataTableProgress · DataTableEmpty",
      description: (
        <>
          Surface ({c("surface-container-low")}, 28dp), toolbar row, pill {c("SearchBar")}, 4dp progress strip ({c("isLoading")}) and the default empty state (
          {c("icon")}, {c("title")}, {c("children")}).
        </>
      ),
      props: [{ name: "className", type: "string", default: "—", description: "Merged with the part's classes." }],
    },
    {
      name: "useDataTable(rows, options?)",
      description: "Client-side search, sort and pagination.",
      props: [
        { name: "options.pageSize", type: "number", default: "10", description: "Initial rows per page." },
        { name: "options.initialSort", type: "SortDescriptor", default: "—", description: "{ column, direction }." },
        { name: "options.sortValue", type: "(row, column) => string | number | null", default: "row[column]", description: "Sort value per column. null sorts last." },
        { name: "options.search", type: "(row, query) => boolean", default: "any string/number field", description: "Search predicate; query is lower-cased and trimmed." },
        {
          name: "returns",
          type: "{ items, total, page, pageCount, pageSize, query, sortDescriptor, set…, tableProps, searchProps, paginationProps }",
          default: "—",
          description: "Spread tableProps on DataTable, searchProps on DataTableSearch, paginationProps on DataTablePagination; pass items to DataTableBody.",
        },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        A {c('role="grid"')} with one focus stop, row and cell navigation, announced sort state and selection. Give the table an {c("aria-label")}, and mark the
        column that names each row with {c("isRowHeader")}.
      </>
    ),
    keyboard: [
      { keys: ["↑", "↓"], description: "Moves between rows." },
      { keys: ["←", "→"], description: "Moves between cells in the focused row." },
      { keys: ["Home", "End"], description: "First or last cell in the row; with Ctrl, first or last row." },
      { keys: ["Space"], description: "Toggles selection of the focused row." },
      { keys: ["Enter"], description: "Sorts a focused sortable column header, or triggers onRowAction." },
    ],
    notes: ["Row action buttons need a label that includes the row, e.g. \"Actions for ledger\".", "The page range in the pagination footer is a polite live region."],
  },
  spec: {
    tables: [
      {
        columns: ["Element", "Default", "Dense"],
        rows: [
          ["Cell padding", "16dp × 12dp", "12dp × 6dp"],
          ["Body", c("body-medium"), c("body-small")],
          ["Header", <>{c("label-large")}, {c("on-surface-variant")}</>, c("label-medium")],
          ["Selection column", "56dp", "56dp"],
        ],
      },
      {
        title: "Row states",
        columns: ["State", "Treatment"],
        rows: [
          ["Divider", <>1dp {c("outline-variant")}</>],
          ["Hover", <>{c("on-surface")} 4%</>],
          ["Selected", <>{c("primary")} 5% (8% hovered)</>],
          ["Focus", <>2dp {c("secondary")} inset outline</>],
          ["Disabled", <>{c("on-surface")} 38%</>],
        ],
      },
    ],
    cards: [
      { title: "Surface", items: ["DataTableCard: surface-container-low, 28dp corners", "Toolbar 16dp padding (24dp from medium width)", "Progress strip 4dp"] },
      { title: "Motion", items: ["Sort arrow rotates on fast-spatial (0.6 / 800)", "Resizer appears on header hover"] },
    ],
    source: <>Styles follow the M3 data table guidance with M3 role tokens; behavior is React Aria's Table.</>,
  },
} satisfies ComponentDoc
