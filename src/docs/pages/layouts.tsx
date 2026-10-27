import * as React from "react"

import { Icon } from "@/components/ui/icon"
import type { WindowSizeClass } from "@/hooks/use-window-size-class"
import { DocsHeader } from "@/docs/docs-header"
import { AdaptiveDemo, winOptions } from "@/docs/layouts/adaptive-demo"
import {
  CanonicalSection,
  GridSection,
  LayoutsHero,
  PageTemplatesSection,
  PanesSection,
  ShellsSection,
  WindowClassesSection,
} from "@/docs/layouts/layouts-sections"
import { cn } from "@/lib/utils"

export const meta = { path: "/layouts" }

const TOC = [
  ["adaptive", "Adaptive demo", "devices"],
  ["classes", "Window size classes", "straighten"],
  ["canonical", "Canonical layouts", "view_quilt"],
  ["panes", "Panes", "view_column"],
  ["shells", "App shells", "web_asset"],
  ["pages", "Page templates", "dashboard_customize"],
  ["grid", "Grid & bento", "grid_view"],
] as const

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = React.useState(ids[0])
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: "-15% 0px -75% 0px",
    })
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [ids])
  return active
}

const IDS = TOC.map(([id]) => id)

export default function Page() {
  const [win, setWin] = React.useState<WindowSizeClass>("expanded")
  const active = useActiveSection(IDS)
  const [navOpen, setNavOpen] = React.useState(false)
  const toc = (onPick?: () => void) =>
    TOC.map(([id, label, icon]) => (
      <a
        key={id}
        href={`#${id}`}
        onClick={onPick}
        className={cn(
          "state-layer flex h-11 items-center gap-3 rounded-full px-4 text-label-lg transition-colors",
          id === active ? "bg-secondary-container font-semibold text-on-secondary-container" : "text-on-surface-variant",
        )}
      >
        <Icon size={20}>{icon}</Icon>
        {label}
      </a>
    ))
  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      <DocsHeader
        leading={
          <button
            type="button"
            className="state-layer inline-flex size-12 cursor-pointer items-center justify-center rounded-full xl:hidden"
            aria-label="On this page"
            onClick={() => setNavOpen(true)}
          >
            <Icon>menu</Icon>
          </button>
        }
      />
      {navOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-scrim/40" onClick={() => setNavOpen(false)} />
          <nav className="absolute inset-y-0 left-0 w-80 max-w-[85vw] space-y-0.5 overflow-y-auto rounded-r-lg bg-surface-container-low p-3 shadow-1">
            <div className="flex h-14 items-center justify-between pl-4 text-title-sm text-on-surface-variant">
              On this page
              <button type="button" className="state-layer size-12 cursor-pointer rounded-full" onClick={() => setNavOpen(false)} aria-label="Close">
                <Icon>close</Icon>
              </button>
            </div>
            {toc(() => setNavOpen(false))}
          </nav>
        </div>
      )}
      <div className="mx-auto flex max-w-[1680px]" id="top">
        <nav className="no-scrollbar sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 space-y-0.5 overflow-y-auto px-3 pt-4 pb-10 xl:block">
          <div className="px-4 pb-2 text-title-sm text-on-surface-variant">On this page</div>
          {toc()}
        </nav>
        <main className="min-w-0 flex-1 px-4 pb-32 md:px-6 lg:px-10">
          <LayoutsHero />
          <AdaptiveDemo win={win} setWin={setWin} />
          <WindowClassesSection winOpts={winOptions(win, setWin)} />
          <CanonicalSection />
          <PanesSection />
          <ShellsSection />
          <PageTemplatesSection />
          <GridSection />
          <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant pt-8 text-body-sm text-on-surface-variant">
            <span>
              Layouts share the theme in <code className="font-mono">expressive.css</code>. Breakpoints follow the M3 window size classes.
            </span>
            <a href="#top" className="state-layer inline-flex h-10 items-center gap-2 rounded-full px-4 text-label-lg text-primary">
              <Icon size={20}>arrow_upward</Icon>
              Back to top
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
