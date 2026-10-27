import Demo from "@/docs/docs-site/examples/pagination/demo"
import demoSrc from "@/docs/docs-site/examples/pagination/demo?raw"
import Dots from "@/docs/docs-site/examples/pagination/dots"
import dotsSrc from "@/docs/docs-site/examples/pagination/dots?raw"
import Options from "@/docs/docs-site/examples/pagination/options"
import optionsSrc from "@/docs/docs-site/examples/pagination/options?raw"
import Range from "@/docs/docs-site/examples/pagination/range"
import rangeSrc from "@/docs/docs-site/examples/pagination/range?raw"
import Variants from "@/docs/docs-site/examples/pagination/variants"
import variantsSrc from "@/docs/docs-site/examples/pagination/variants?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Pagination moves through long result sets one page at a time. Numbered pages in four styles (including an Expressive connected group), a compact range control for table footers, and carousel-style dots.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { Pagination } from "@/components/ui/pagination"

<Pagination page={page} onPageChange={setPage} pageCount={12} />`,
  examples: [
    {
      id: "variants",
      title: "Variants",
      description: (
        <>
          The current page is primary (standard), secondary-container (tonal) or an outline ring (outlined). <InlineCode>connected</InlineCode> is
          an Expressive connected button group: 2dp gaps, small inner corners, and the current page morphs into a full pill.
        </>
      ),
      component: Variants,
      source: variantsSrc,
    },
    {
      id: "options",
      title: "Labels, edges and range",
      description: (
        <>
          <InlineCode>showLabels</InlineCode> adds Previous / Next text, <InlineCode>showEdges</InlineCode> adds first and last page arrows.{" "}
          <InlineCode>siblings</InlineCode> and <InlineCode>boundaries</InlineCode> set how many pages show around the current one and at each end.
        </>
      ),
      component: Options,
      source: optionsSrc,
    },
    {
      id: "range",
      title: "Range for table footers",
      description: (
        <>
          <InlineCode>PaginationRange</InlineCode> shows "1–25 of 240" with arrows, a rows-per-page menu and an optional jump field. The{" "}
          <TextLink to="/docs/data-table">data table</TextLink> footer uses the same pattern.
        </>
      ),
      component: Range,
      source: rangeSrc,
    },
    {
      id: "dots",
      title: "Dots",
      description: (
        <>
          <InlineCode>PaginationDots</InlineCode> for carousels and onboarding. The current dot stretches into a 24dp pill on the FastSpatial spring.
        </>
      ),
      component: Dots,
      source: dotsSrc,
    },
  ],
  api: [
    {
      name: "Pagination",
      description: (
        <>
          Renders a {c("<nav>")}; HTML attributes are forwarded. Also exported: {c("paginationItemVariants")} and{" "}
          {c("paginationRange(page, pageCount, siblings?, boundaries?)")}, which returns the page numbers and ellipsis markers to render.
        </>
      ),
      props: [
        { name: "pageCount", type: "number", default: "—", description: "Number of pages. Required." },
        { name: "page", type: "number", default: "—", description: "1-based current page (controlled)." },
        { name: "defaultPage", type: "number", default: "1", description: "Initial page when uncontrolled." },
        { name: "onPageChange", type: "(page: number) => void", default: "—", description: "Called with the new page, clamped to 1…pageCount." },
        { name: "siblings", type: "number", default: "1", description: "Pages shown on each side of the current page." },
        { name: "boundaries", type: "number", default: "1", description: "Pages always shown at each end." },
        { name: "variant", type: '"standard" | "tonal" | "outlined" | "connected"', default: '"standard"', description: "Current-page style." },
        { name: "size", type: '"md" | "sm"', default: '"md"', description: "40dp or 32dp page buttons." },
        { name: "showLabels", type: "boolean", default: "false", description: "Previous / Next text beside the arrows (not in connected)." },
        { name: "showEdges", type: "boolean", default: "false", description: "First and last page arrow buttons." },
        {
          name: "labels",
          type: "{ previous?, next?, first?, last?: string; page?: (n) => string }",
          default: "English",
          description: 'Localized labels. page defaults to "Page n".',
        },
        { name: "aria-label", type: "string", default: '"Pagination"', description: "Name of the navigation landmark." },
      ],
    },
    {
      name: "PaginationRange",
      props: [
        { name: "pageSize", type: "number", default: "—", description: "Items per page. Required." },
        { name: "total", type: "number", default: "—", description: "Total number of items. Required." },
        { name: "page", type: "number", default: "—", description: "1-based page (controlled)." },
        { name: "defaultPage", type: "number", default: "1", description: "Initial page when uncontrolled." },
        { name: "onPageChange", type: "(page: number) => void", default: "—", description: "Called with the new page." },
        { name: "pageSizeOptions", type: "number[]", default: "—", description: "Rows-per-page choices; shows the menu when given." },
        { name: "onPageSizeChange", type: "(size: number) => void", default: "—", description: "Called when a page size is chosen." },
        { name: "showJump", type: "boolean", default: "false", description: 'Show a "Go to page" number field.' },
        { name: "formatRange", type: "(from, to, total) => ReactNode", default: '"from–to of total"', description: "Format the range text." },
      ],
    },
    {
      name: "PaginationDots",
      props: [
        { name: "count", type: "number", default: "—", description: "Number of dots. Required." },
        { name: "index", type: "number", default: "—", description: "0-based active index (controlled)." },
        { name: "defaultIndex", type: "number", default: "0", description: "Initial index when uncontrolled." },
        { name: "onIndexChange", type: "(index: number) => void", default: "—", description: "Called when a dot is pressed." },
        { name: "label", type: "(i: number) => string", default: '"Slide n"', description: "Accessible name of each dot." },
        { name: "aria-label", type: "string", default: '"Slides"', description: "Name of the group." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Pagination is a {c("<nav>")} landmark. Page buttons are named "Page n" and the current one has {c('aria-current="page"')}. Arrow buttons are
        disabled at the ends. PaginationRange announces the range text politely as it changes. PaginationDots is a {c('role="group"')} whose current
        dot has {c('aria-current="step"')}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through the arrows and page buttons." },
      { keys: ["Space", "Enter"], description: "Goes to the focused page." },
      { label: "Rows per page", description: "A menu button: Space, Enter or ↓ opens it, arrows move, Enter picks." },
      { label: "Go to page", description: "A number field: type a page, or use ↑ / ↓ to step." },
    ],
    notes: ["Ellipses are decorative and hidden from assistive tech.", "Arrow icons mirror in right-to-left layouts."],
  },
  spec: {
    tables: [
      {
        columns: ["Variant", "Page button", "Current page"],
        rows: [
          ["Standard", "40dp (32dp sm), full radius, label-large", "primary, on-primary"],
          ["Tonal", "40dp (32dp sm), full radius", "secondary-container, on-secondary-container"],
          ["Outlined", "40dp (32dp sm), full radius", "primary label, 1dp outline ring"],
          ["Connected", "40dp high, 8dp corners, 2dp gaps, surface-container", "full pill, primary"],
          ["Dots", "8dp dot, 24dp touch height", "24 × 8dp pill, primary"],
        ],
      },
    ],
    cards: [
      { title: "Motion", items: [<>Connected morph and dot stretch: {c("fast-spatial")} 0.6 / 800 (374ms)</>, "Pressing a connected page tightens it back to 8dp"] },
      { title: "States", items: ["Hover 8%, focus 10% + 3dp ring, pressed 12% with ripple", "Disabled arrows: 38% opacity"] },
    ],
    source: "No M3 spec component; built from M3 buttons and the Expressive connected button group.",
  },
} satisfies ComponentDoc
