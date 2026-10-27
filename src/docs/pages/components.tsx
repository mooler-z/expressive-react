import * as React from "react"
import { Link } from "react-router"

import { Icon } from "@/components/ui/icon"
import { DocsHeader } from "@/docs/docs-header"
import { GROUPS } from "@/docs/catalog"
import { cn } from "@/lib/utils"

export const meta = { path: "/kit" }

/* Every file in ../sections is one section: `export default function XSection()`, file name = section id. */
const modules = import.meta.glob<{ default: React.ComponentType }>("../sections/*.tsx", { eager: true })
const SECTIONS = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split("/").pop()!.replace(".tsx", ""), mod.default]),
)

const done = GROUPS.flatMap((g) => g.sections).filter(([id]) => SECTIONS[id]).length
const total = GROUPS.flatMap((g) => g.sections).length

export default function ComponentsPage() {
  const [navOpen, setNavOpen] = React.useState(false)
  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      <DocsHeader
        leading={
          <button
            className="state-layer inline-flex size-12 items-center justify-center rounded-full lg:hidden"
            aria-label="Menu"
            onClick={() => setNavOpen((o) => !o)}
          >
            <Icon>menu</Icon>
          </button>
        }
      />
      <div className="mx-auto flex max-w-[1600px] gap-8 px-4 pb-24 md:px-6">
        <nav
          className={cn(
            "no-scrollbar top-16 z-30 h-[calc(100dvh-4rem)] w-64 shrink-0 overflow-y-auto pt-4 pb-8",
            navOpen ? "fixed inset-x-0 bg-surface-container-low px-4 lg:sticky lg:bg-transparent lg:px-0" : "hidden lg:sticky lg:block",
          )}
          onClick={(e) => (e.target as HTMLElement).closest("a") && setNavOpen(false)}
        >
          {GROUPS.map((g) => (
            <div key={g.title} className="mb-4">
              <div className="px-4 pb-1 text-title-sm text-on-surface-variant">{g.title}</div>
              {g.sections.map(([id, title]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={cn(
                    "state-layer flex h-10 items-center rounded-full px-4 text-label-lg",
                    SECTIONS[id] ? "text-on-surface" : "text-on-surface/38",
                  )}
                >
                  {title}
                </a>
              ))}
            </div>
          ))}
        </nav>

        <main className="min-w-0 flex-1 space-y-16 pt-4">
          <Templates />
          {GROUPS.map((g) => (
            <div key={g.title} className="space-y-16">
              <h2 className="text-display-sm font-medium">{g.title}</h2>
              {g.sections.map(([id, title]) => {
                const S = SECTIONS[id]
                return S ? (
                  <SectionBoundary key={id} id={id} title={title}>
                    <S />
                  </SectionBoundary>
                ) : (
                  <Pending key={id} id={id} title={title} />
                )
              })}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

function Templates() {
  return (
    <div className="space-y-4">
      <div className="text-label-lg text-on-surface-variant">
        {done} of {total} sections ported
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["/landing", "web", "Landing site · 6 pages", "Home, Features, Pricing, About, Contact, Changelog. Floating pill nav, expressive hero, responsive to compact widths."],
          ["/admin", "space_dashboard", "Admin portal · 6 pages", "Overview, Analytics, Users, Orders, Products, Settings. Adaptive nav (bar → rail → expanded rail), charts, data tables."],
        ].map(([to, icon, title, body]) => (
          <Link key={to} to={to} className="state-layer group flex gap-4 rounded-xl bg-primary-container p-6 text-on-primary-container">
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-primary text-on-primary">
              <Icon>{icon}</Icon>
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-title-lg">
                {title}
                <Icon size={20} className="transition-transform group-hover:translate-x-1">arrow_forward</Icon>
              </span>
              <span className="mt-1 block text-body-md">{body}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function Pending({ id, title }: { id: string; title: string }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <h3 className="text-headline-sm font-medium text-on-surface/38">{title}</h3>
      <div className="rounded-xl border border-dashed border-outline-variant p-6 text-body-md text-on-surface-variant">
        Pending port of <code className="font-mono">#{id}</code> from Components.dc.html.
      </div>
    </section>
  )
}

/** One broken section (e.g. mid-edit) must not take down the whole page. */
class SectionBoundary extends React.Component<{ id: string; title: string; children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <section id={this.props.id} className="scroll-mt-24 space-y-4">
        <h3 className="text-headline-sm font-medium text-error">{this.props.title}</h3>
        <pre className="overflow-auto rounded-xl bg-error-container p-6 font-mono text-body-sm whitespace-pre-wrap text-on-error-container">
          {this.state.error.message}
        </pre>
      </section>
    )
  }
}
