import * as React from "react"
import { Link, useSearchParams } from "react-router"

import { Icon } from "@/components/ui/icon"
import { BlockSection } from "@/docs/site/blocks-gallery/block-section"
import { CategoryBar, CategoryCards, CategorySidebar } from "@/docs/site/blocks-gallery/category-cards"
import { CATEGORIES, ENTRIES, REGISTRY_BLOCKS, UNMAPPED, type BlockCategory } from "@/docs/site/blocks-gallery/catalog"
import { useFrameThemeSync } from "@/docs/site/blocks-gallery/frame-theme"
import { SiteLayout, getSiteTop } from "@/docs/site/site-layout"

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
  const headingRef = React.useRef<HTMLDivElement>(null)
  const cardsRef = React.useRef<HTMLDivElement>(null)
  const [cardsVisible, setCardsVisible] = React.useState(true)
  useFrameThemeSync()

  // The compact category bar takes over once the cards have scrolled under the header.
  React.useEffect(() => {
    const el = cardsRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setCardsVisible(e.isIntersecting), { rootMargin: `-${getSiteTop()}px 0px 0px 0px` })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const pick = (next: BlockCategory) => {
    setParams(next === "templates" ? {} : { cat: next })
    // Switching from the sticky bar or sidebar: bring the new category's heading back into view,
    // under the top app bar (compact) and the category bar (below xl, where there's no sidebar).
    const offset = getSiteTop() + (window.matchMedia("(min-width: 1200px)").matches ? 24 : 72)
    const top = headingRef.current?.getBoundingClientRect().top ?? 0
    if (top < offset) window.scrollTo({ top: window.scrollY + top - offset })
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
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-body-md text-on-surface-variant">
            <li className="inline-flex items-center gap-1.5">
              <Icon size={18}>view_quilt</Icon>
              {REGISTRY_BLOCKS.length} blocks
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon size={18}>contrast</Icon>
              Light, dark and RTL
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Icon size={18}>devices</Icon>
              Compact to extra-large
            </li>
          </ul>
        </div>

        <div ref={cardsRef} className="mt-8">
          <CategoryCards value={cat} onChange={pick} counts={COUNTS} />
        </div>
        <CategoryBar
          value={cat}
          onChange={pick}
          counts={COUNTS}
          visible={!cardsVisible}
          onShowAll={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="xl:hidden"
        />

        {/* Extra-large and up (1200+): sticky category list beside the gallery. */}
        <div className="mt-10 xl:grid xl:grid-cols-[15rem_minmax(0,1fr)] xl:items-start xl:gap-8">
          <CategorySidebar value={cat} onChange={pick} counts={COUNTS} className="sticky top-6 hidden xl:block" />

          <div className="min-w-0">
            <div ref={headingRef}>
              <h2 className="text-headline-sm font-medium">{category.label}</h2>
              <p className="mt-1 max-w-prose text-body-md text-pretty text-on-surface-variant">{category.description}</p>
            </div>

            <div key={cat} className="mt-6 space-y-10">
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
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}
