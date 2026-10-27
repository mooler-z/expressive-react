import Demo from "@/docs/docs-site/examples/table/demo"
import demoSrc from "@/docs/docs-site/examples/table/demo?raw"
import Dense from "@/docs/docs-site/examples/table/dense"
import denseSrc from "@/docs/docs-site/examples/table/dense?raw"
import Groups from "@/docs/docs-site/examples/table/groups"
import groupsSrc from "@/docs/docs-site/examples/table/groups?raw"
import Sortable from "@/docs/docs-site/examples/table/sortable"
import sortableSrc from "@/docs/docs-site/examples/table/sortable?raw"
import Variants from "@/docs/docs-site/examples/table/variants"
import variantsSrc from "@/docs/docs-site/examples/table/variants?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description: (
    <>
      Semantic HTML tables for invoices, specs and comparisons, styled with M3 roles: four variants, two densities, numeric cells and an optional local sort
      hook. For selection, resizing and pagination use <TextLink to="/docs/data-table">Data table</TextLink>.
    </>
  ),
  preview: { component: Demo, source: demoSrc },
  usage: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow><TableHead>Item</TableHead><TableHead align="end">Amount</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow><TableCell>Compute</TableCell><TableCell numeric>$30.24</TableCell></TableRow>
  </TableBody>
</Table>`,
  examples: [
    {
      id: "variants",
      title: "Variants",
      description: "Plain (the default, row dividers), striped (alternating surface-container rows), grid (bordered cells) and cards (separated rounded rows).",
      component: Variants,
      source: variantsSrc,
    },
    {
      id: "dense",
      title: "Dense",
      description: "density=\"dense\" drops to body-small with tighter rows, for logs and long lists.",
      component: Dense,
      source: denseSrc,
    },
    {
      id: "sortable",
      title: "Sortable columns",
      description: (
        <>
          <InlineCode>useTableSort(rows, accessors, initial)</InlineCode> keeps sort state locally. Spread <InlineCode>headProps(column)</InlineCode> on a{" "}
          <InlineCode>TableHead</InlineCode> to render the sort button and <InlineCode>aria-sort</InlineCode>.
        </>
      ),
      component: Sortable,
      source: sortableSrc,
    },
    {
      id: "groups",
      title: "Grouped rows",
      description: "Use one TableBody per group with a TableGroupRow label on secondary-container.",
      component: Groups,
      source: groupsSrc,
    },
  ],
  api: [
    {
      name: "Table",
      description: <>A {c("<table>")} inside a horizontal scroll container. Accepts every table attribute.</>,
      props: [
        { name: "variant", type: '"plain" | "striped" | "grid" | "cards"', default: '"plain"', description: "Row and cell treatment." },
        { name: "density", type: '"default" | "dense"', default: '"default"', description: "Dense: body-small, tighter padding." },
        { name: "containerClassName", type: "string", default: "—", description: "Classes for the scroll container, e.g. a max width." },
      ],
    },
    {
      name: "TableHead",
      description: <>A {c('<th scope="col">')}.</>,
      props: [
        { name: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Text alignment." },
        { name: "sort", type: '"ascending" | "descending" | "none"', default: "—", description: "Current sort. With onSort, renders a sort button and sets aria-sort." },
        { name: "onSort", type: "() => void", default: "—", description: "Called when the sort button is pressed." },
      ],
    },
    {
      name: "TableCell",
      description: <>A {c("<td>")}.</>,
      props: [
        { name: "align", type: '"start" | "center" | "end"', default: 'numeric ? "end" : "start"', description: "Text alignment." },
        { name: "numeric", type: "boolean", default: "false", description: "Tabular numerals, end-aligned unless align says otherwise." },
        { name: "muted", type: "boolean", default: "false", description: "on-surface-variant text." },
      ],
    },
    {
      name: "TableGroupRow",
      description: <>A full-width group label row ({c('<th scope="colgroup">')}).</>,
      props: [{ name: "colSpan", type: "number", default: "—", description: "Number of columns to span (required)." }],
    },
    {
      name: "TableCaption · TableHeader · TableBody · TableFooter · TableRow",
      description: <>Semantic wrappers ({c("caption")}, {c("thead")}, {c("tbody")}, {c("tfoot")}, {c("tr")}) that pick up the variant styles.</>,
      props: [{ name: "className", type: "string", default: "—", description: "Merged with the variant classes." }],
    },
    {
      name: "useTableSort(rows, accessors, initial?)",
      description: "Local sort state for plain tables.",
      props: [
        { name: "rows", type: "readonly T[]", default: "—", description: "The data." },
        { name: "accessors", type: "Record<K, (row: T) => string | number>", default: "—", description: "Sort value per column key. Numbers compare numerically, strings with numeric-aware collation." },
        { name: "initial", type: '{ column: K; direction: "ascending" | "descending" }', default: "—", description: "Initial sort. Type column as keyof your accessors object so K covers every column." },
        { name: "returns", type: "{ sorted, sort, setSort, headProps(column) }", default: "—", description: "headProps(column) returns { sort, onSort } for a TableHead. Pressing toggles ascending → descending." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Plain {c("<table>")} semantics: column headers use {c('scope="col"')}, so screen readers announce headers with each cell. A {c("TableCaption")} names
        the table. Sortable headers expose {c("aria-sort")} and a native button.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves to each sort button in the header; the table itself isn't a focus stop." },
      { keys: ["Space", "Enter"], description: "Toggles the column's sort direction." },
    ],
    notes: ["Use isRowHeader-style first columns (a <th scope=\"row\">) when rows have a natural name.", "Need keyboard row navigation or selection? Use Data table."],
  },
  spec: {
    tables: [
      {
        columns: ["Element", "Style"],
        rows: [
          ["Caption", <>{c("title-medium")}, {c("on-surface")}, above the table</>],
          ["Header", <>{c("label-large")}, {c("on-surface-variant")}</>],
          ["Body", <>{c("body-medium")} (dense: {c("body-small")})</>],
          ["Footer", c("title-small")],
          ["Row divider", <>1dp {c("outline-variant")}</>],
          ["Striped rows", c("surface-container")],
          ["Group row", <>{c("secondary-container")} / {c("on-secondary-container")}, {c("label-large")}</>],
        ],
      },
    ],
    source: <>M3 has no plain-table spec; these use M3 role and type tokens, matching Data table.</>,
  },
} satisfies ComponentDoc
