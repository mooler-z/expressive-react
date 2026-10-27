import * as React from "react"
import type { Key } from "react-aria-components"
import { Link, useSearchParams } from "react-router"

import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { BlockSection } from "@/docs/site/blocks-gallery/block-section"
import { CATEGORIES, ENTRIES, REGISTRY_BLOCKS, UNMAPPED, type BlockCategory } from "@/docs/site/blocks-gallery/catalog"
import { useFrameThemeSync } from "@/docs/site/blocks-gallery/frame-theme"
import { SiteLayout } from "@/docs/site/site-layout"
import { cn } from "@/lib/utils"

export const meta = { path: "/blocks" }

if (import.meta.env.DEV && UNMAPPED.length) console.warn("[blocks] registry blocks missing from the gallery:", UNMAPPED)

const IDS = CATEGORIES.map((c) => c.id)
const COUNTS = Object.fromEntries(IDS.map((id) => [id, ENTRIES.filter((e) => e.category === id).length])) as Record<BlockCategory, number>

const KIT_LINKS = [
  ["/kit", "Components"],
  ["/kit/blocks/shell", "Blocks · Shell"],
  ["/kit/blocks/data", "Blocks · Data"],
  ["/kit/blocks/auth", "Blocks · Auth"],
  ["/kit/blocks/settings", "Blocks · Settings"],
  ["/kit/blocks/people", "Blocks · People"],
] as const

/** Blocks gallery · design-reference/site/Blocks.dc.html */
export default function BlocksPage() {
  const [params, setParams] = useSearchParams()
  const raw = params.get("cat") as BlockCategory | null
  const cat: BlockCategory = raw && IDS.includes(raw) ? raw : "templates"
  const category = CATEGORIES.find((c) => c.id === cat)!
  const entries = ENTRIES.filter((e) => e.category === cat)
  const listRef = React.useRef<HTMLDivElement>(null)
  const chipsRef = React.useRef<HTMLDivElement>(null)
  useFrameThemeSync()

  // Compact widths scroll the chip row: keep the selected category in view (without scrolling the page).
  React.useEffect(() => {
    const row = chipsRef.current?.querySelector<HTMLElement>("[data-slot=chip-group]")
    const chip = row?.querySelector<HTMLElement>("[data-selected]")
    if (!row || !chip) return
    const r = row.getBoundingClientRect()
    const c = chip.getBoundingClientRect()
    if (c.left < r.left || c.right > r.right) row.scrollTo({ left: row.scrollLeft + c.left - r.left - 16, behavior: "smooth" })
  }, [cat])

  const pick = (next: BlockCategory) => {
    setParams(next === "templates" ? {} : { cat: next })
    // Keep the filter bar in place: if we've scrolled past it, jump back to the top of the list.
    const top = listRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 160 })
  }

  return (
    <SiteLayout active="blocks">
      <main className="mx-auto max-w-[1400px] px-4 pt-8 pb-24 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-display-sm font-semibold tracking-tight text-balance">Building blocks, already assembled.</h1>
            <p className="mt-3 text-body-lg text-pretty text-on-surface-variant">
              {REGISTRY_BLOCKS.length} blocks built from Expressive React components, from a login card to a 21-page admin. Resize the frame,
              copy the install command, or open the code.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-label-lg">
            <span className="inline-flex h-8 items-center gap-2 rounded-sm bg-secondary-container px-3 text-on-secondary-container">
              <Icon size={18}>view_quilt</Icon>
              {REGISTRY_BLOCKS.length} blocks
            </span>
            <span className="inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant px-3 text-on-surface-variant">Light · dark · RTL</span>
            <span className="inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant px-3 text-on-surface-variant">
              Compact → extra-large
            </span>
          </div>
        </div>

        <div
          ref={chipsRef}
          className="sticky top-16 z-30 -mx-4 mt-8 bg-surface/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8"
          data-spec="Category filter chips|Single-select filter chips: selected chip fills secondary-container, grows an 18dp check and tightens start padding. 200ms standard color, 300ms emphasized radius."
        >
          <ChipGroup
            aria-label="Block categories"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[cat]}
            onSelectionChange={(keys: Set<Key>) => {
              const next = [...keys][0] as BlockCategory | undefined
              if (next) pick(next)
            }}
            className="no-scrollbar relative flex-nowrap overflow-x-auto"
          >
            {CATEGORIES.map((c) => (
              <FilterChip key={c.id} id={c.id} className="shrink-0">
                {c.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-label-sm tabular-nums",
                    c.id === cat ? "bg-on-secondary-container/10" : "bg-surface-container-high",
                  )}
                >
                  {COUNTS[c.id]}
                </span>
              </FilterChip>
            ))}
          </ChipGroup>
        </div>

        <p className="mt-6 max-w-prose text-body-md text-pretty text-on-surface-variant">{category.description}</p>

        <div ref={listRef} key={cat} className="mt-6 space-y-10">
          {entries.map((entry) => (
            <BlockSection key={entry.id} entry={entry} />
          ))}
        </div>

        {cat === "templates" && (
          <aside className="mt-12 rounded-xl border border-outline-variant p-6">
            <div className="flex items-center gap-2 text-title-md">
              <Icon size={20}>history_edu</Icon>
              The original kit
            </div>
            <p className="mt-1 max-w-prose text-body-md text-on-surface-variant">
              Every component and block page from the M3 Expressive kit these were ported from, kept as reference.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {KIT_LINKS.map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="state-layer focus-ring inline-flex h-8 items-center gap-1 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant"
                >
                  {label}
                  <Icon size={18}>arrow_outward</Icon>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </main>
    </SiteLayout>
  )
}
