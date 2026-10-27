import { DOCS_ALIASES, DOCS_GROUPS, type DocsGroup, type DocsSection } from "@/docs/site/site-nav"

export interface DocsPageRef {
  id: string
  label: string
  isNew: boolean
  group: DocsGroup
}

/** Every /docs page in sidebar order (Foundations excluded: they live on /tokens). */
export const DOCS_PAGES: DocsPageRef[] = DOCS_GROUPS.filter((g) => !g.external).flatMap((group) =>
  group.items.map(([id, label, isNew]) => ({ id, label, isNew: !!isNew, group })),
)

export function findPage(id: string): DocsPageRef | undefined {
  const real = DOCS_ALIASES[id] ?? id
  return DOCS_PAGES.find((p) => p.id === real)
}

export function neighbours(id: string): { prev?: DocsPageRef; next?: DocsPageRef } {
  const i = DOCS_PAGES.findIndex((p) => p.id === id)
  return { prev: DOCS_PAGES[i - 1], next: DOCS_PAGES[i + 1] }
}

export const isReferencePage = (section: DocsSection) => section === "components" || section === "hooks"

/** Medium-width rail destinations (design: Start / Styles / Parts / Hooks). */
export const DOCS_RAIL: { section: DocsSection; label: string; icon: string }[] = [
  { section: "start", label: "Start", icon: "rocket_launch" },
  { section: "foundations", label: "Styles", icon: "palette" },
  { section: "components", label: "Parts", icon: "widgets" },
  { section: "hooks", label: "Hooks", icon: "webhook" },
]
