import * as React from "react"
import { RouterProvider } from "react-aria-components"
import { Navigate, useHref, useNavigate, useParams } from "react-router"

import { ComponentPage, TOC_SECTIONS, tocFor } from "@/docs/docs-site/component-page"
import { DocsShell } from "@/docs/docs-site/docs-shell"
import { findPage, isReferencePage, neighbours, type DocsPageRef } from "@/docs/docs-site/nav"
import { Pager } from "@/docs/docs-site/primitives"
import { registryItem } from "@/docs/docs-site/registry"
import type { ComponentDoc, GuideModule } from "@/docs/docs-site/types"
import { SiteLayout } from "@/docs/site/site-layout"
import { DOCS_ALIASES } from "@/docs/site/site-nav"

export const meta = { path: "/docs/:page?" }

/* One file per page; loaded on demand so each page is its own chunk. */
const CONTENT = import.meta.glob<{ default: ComponentDoc }>("/src/docs/docs-site/content/*.tsx")
const GUIDES = import.meta.glob<GuideModule>("/src/docs/docs-site/guides/*.tsx")

type Loaded = { id: string; content: ComponentDoc | null; guide: GuideModule | null }

function useDocsModule(page: DocsPageRef | undefined): Loaded | null {
  const [loaded, setLoaded] = React.useState<Loaded | null>(null)
  const id = page?.id
  React.useEffect(() => {
    if (!page) return
    let live = true
    const reference = isReferencePage(page.group.section)
    const loader = reference ? CONTENT[`/src/docs/docs-site/content/${page.id}.tsx`] : GUIDES[`/src/docs/docs-site/guides/${page.id}.tsx`]
    if (!loader) {
      setLoaded({ id: page.id, content: null, guide: null })
      return
    }
    loader().then((mod) => {
      if (!live) return
      setLoaded(reference ? { id: page.id, content: (mod as { default: ComponentDoc }).default, guide: null } : { id: page.id, content: null, guide: mod as GuideModule })
    })
    return () => {
      live = false
    }
    // `page` is a stable nav constant per id
  }, [id])
  return loaded?.id === id ? loaded : null
}

export default function DocsRoute() {
  const { page: param = "intro" } = useParams()
  const navigate = useNavigate()

  if (DOCS_ALIASES[param]) return <Navigate to={`/docs/${DOCS_ALIASES[param]}`} replace />
  const page = findPage(param)
  const reference = page ? isReferencePage(page.group.section) : false

  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <SiteLayout active={reference ? "components" : "docs"}>
        <DocsPage page={page} param={param} />
      </SiteLayout>
    </RouterProvider>
  )
}

function DocsPage({ page, param }: { page: DocsPageRef | undefined; param: string }) {
  const loaded = useDocsModule(page)

  React.useEffect(() => {
    document.title = page ? `${page.label} · Expressive React` : "Docs · Expressive React"
  }, [page])

  if (!page)
    return (
      <DocsShell page={undefined} toc={[]}>
        <article className="mx-auto max-w-3xl">
          <h1 className="text-display-sm font-semibold tracking-tight">Not found</h1>
          <p className="mt-4 text-title-lg text-on-surface-variant">
            There's no docs page called <code className="font-mono">{param}</code>.
          </p>
          <Pager next={{ to: "/docs", label: "Introduction" }} />
        </article>
      </DocsShell>
    )

  const reference = isReferencePage(page.group.section)
  const toc = reference && loaded ? tocFor(loaded.content).map((id) => ({ id, label: TOC_SECTIONS.find(([t]) => t === id)![1] })) : []

  const editPath = !reference
    ? `src/docs/docs-site/guides/${page.id}.tsx`
    : loaded?.content
      ? `src/docs/docs-site/content/${page.id}.tsx`
      : registryItem(page.id)?.files?.[0]?.path

  return (
    <DocsShell page={page} toc={toc} editPath={editPath}>
      {!loaded ? <div className="min-h-[60vh]" aria-busy /> : reference ? <ComponentPage page={page} doc={loaded.content} /> : <GuidePage page={page} guide={loaded.guide} />}
    </DocsShell>
  )
}

function GuidePage({ page, guide }: { page: DocsPageRef; guide: GuideModule | null }) {
  const { prev, next } = neighbours(page.id)
  const Body = guide?.default
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-display-sm font-semibold tracking-tight">{page.label}</h1>
      {guide?.lead && <p className="mt-4 text-title-lg text-pretty text-on-surface-variant">{guide.lead}</p>}
      {Body ? <Body /> : <p className="mt-8 text-body-lg text-on-surface-variant">This guide is on its way.</p>}
      <Pager prev={prev && { to: `/docs/${prev.id}`, label: prev.label }} next={next && { to: `/docs/${next.id}`, label: next.label }} />
    </article>
  )
}
