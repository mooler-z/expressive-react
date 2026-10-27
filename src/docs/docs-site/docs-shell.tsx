import * as React from "react"
import { Dialog, Modal, ModalOverlay } from "react-aria-components"
import { Link } from "react-router"

import { Icon } from "@/components/ui/icon"
import { DOCS_RAIL, type DocsPageRef } from "@/docs/docs-site/nav"
import { DOCS_GROUPS, SITE_LINKS, type DocsSection } from "@/docs/site/site-nav"
import { cn } from "@/lib/utils"

/** Opens the site's ⌘K command palette. The header's CommandDialog owns the shortcut, so we press it. */
export function openSiteSearch() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }))
}

const groupAnchor = (name: string) => "docs-group-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

function hrefOf(groupExternal: ((id: string) => string) | undefined, id: string) {
  return groupExternal ? groupExternal(id) : `/docs/${id}`
}

/** Sidebar / drawer link list. `dense` = sidebar (40dp rows), else drawer (48dp rows). */
function DocsNavList({ current, dense, onNavigate }: { current: string; dense?: boolean; onNavigate?: () => void }) {
  return (
    <>
      {DOCS_GROUPS.map((g) => (
        <div key={g.name} id={dense ? undefined : groupAnchor(g.name)} className="scroll-mt-2">
          <div className={cn("px-4 pb-1 text-title-sm text-on-surface-variant", dense ? "pt-5" : "pt-4")}>{g.name}</div>
          {g.items.map(([id, label, isNew]) => {
            const active = !g.external && id === current
            return (
              <Link
                key={id}
                to={hrefOf(g.external, id)}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "state-layer focus-ring mb-0.5 flex items-center gap-2 rounded-full px-4 text-label-lg transition-colors duration-300",
                  dense ? "h-10" : "h-12",
                  active ? "bg-secondary-container font-semibold text-on-secondary-container" : "text-on-surface-variant",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{label}</span>
                {isNew && <span className="rounded-xs bg-primary-container px-1.5 text-label-sm text-on-primary-container">New</span>}
              </Link>
            )
          })}
        </div>
      ))}
    </>
  )
}

function SearchField() {
  return (
    <button
      type="button"
      onClick={openSiteSearch}
      className="state-layer focus-ring flex h-12 w-full cursor-pointer items-center gap-3 rounded-full bg-surface-container-high pr-3 pl-4 text-body-md text-on-surface-variant"
    >
      <Icon name="search" size={20} />
      <span className="flex-1 text-left">Search docs…</span>
      <kbd className="inline-flex h-6 items-center rounded-xs border border-outline-variant px-1.5 font-mono text-label-md">⌘K</kbd>
    </button>
  )
}

const TOP = "top-16 h-[calc(100dvh-4rem)]"


export interface DocsShellProps {
  page: DocsPageRef | undefined
  /** TOC entries for this page (component pages); empty hides the TOC. */
  toc: { id: string; label: string }[]
  /** Repo path of the file behind this page, for "Edit this page". */
  editPath?: string
  children: React.ReactNode
}

export function DocsShell({ page, toc, editPath, children }: DocsShellProps) {
  const [drawer, setDrawer] = React.useState<{ open: boolean; group?: string }>({ open: false })
  const current = page?.id ?? ""
  const section: DocsSection = page?.group.section ?? "start"
  const openDrawer = (group?: string) => setDrawer({ open: true, group })

  return (
    <div className="mx-auto flex max-w-[1600px]">
      {/* Medium (600–839): rail. Each destination opens the drawer at its group. */}
      <nav aria-label="Docs sections" className={cn("sticky hidden w-20 shrink-0 flex-col items-center gap-3 py-3 text-label-md text-on-surface-variant md:flex lg:hidden", TOP)}>
        <button type="button" onClick={() => openDrawer()} aria-label="Open docs menu" className="state-layer focus-ring inline-flex size-12 cursor-pointer items-center justify-center rounded-full">
          <Icon name="menu" />
        </button>
        {DOCS_RAIL.map((r) => {
          const on = r.section === section
          const group = DOCS_GROUPS.find((g) => g.section === r.section)?.name
          return (
            <button key={r.section} type="button" onClick={() => openDrawer(group)} className={cn("group flex w-full cursor-pointer flex-col items-center gap-1 pt-2", on && "text-on-surface")}>
              <span
                className={cn(
                  "state-layer grid h-8 w-14 place-items-center rounded-full transition-colors duration-300 ease-emphasized",
                  on && "bg-secondary-container text-on-secondary-container",
                )}
              >
                <Icon name={r.icon} filled={on} />
              </span>
              <span className={cn(on && "font-semibold")}>{r.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Expanded and up (840+): sticky sidebar. */}
      <nav aria-label="Docs" className={cn("no-scrollbar sticky hidden w-64 shrink-0 overflow-y-auto px-3 pt-4 pb-10 lg:block", TOP)}>
        <SearchField />
        <DocsNavList current={current} dense />
      </nav>

      <main className="min-w-0 flex-1 px-4 pt-6 pb-24 md:px-8 lg:px-12">
        <div className="mb-4 flex min-w-0 items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => openDrawer(page?.group.name)}
            className="state-layer focus-ring inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-outline-variant pr-4 pl-3 text-label-lg text-on-surface-variant"
          >
            <Icon name="menu" size={20} />
            Docs menu
          </button>
          {page && (
            <span className="min-w-0 truncate text-body-md text-on-surface-variant">
              {page.group.name} / {page.label}
            </span>
          )}
        </div>
        {children}
      </main>

      {/* Large and up (1200+): on-this-page. Hidden (but keeps its width) on guides, like the design. */}
      <aside aria-label="On this page" className={cn("no-scrollbar sticky hidden w-56 shrink-0 overflow-y-auto px-3 pt-6 pb-10 xl:block", TOP)}>
        {toc.length > 0 && <Toc items={toc} />}
        {editPath && (
          <a
            href={`${SITE_LINKS.github}/blob/main/${editPath}`}
            target="_blank"
            rel="noreferrer"
            className="state-layer focus-ring mt-6 flex h-9 items-center gap-2 rounded-full px-3 text-label-lg text-on-surface-variant"
          >
            <Icon name="edit" size={18} />
            Edit this page
          </a>
        )}
      </aside>

      <DocsDrawer state={drawer} onClose={() => setDrawer({ open: false })} current={current} />
    </div>
  )
}

function DocsDrawer({ state, onClose, current }: { state: { open: boolean; group?: string }; onClose: () => void; current: string }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!state.open || !state.group) return
    const t = setTimeout(() => scrollRef.current?.querySelector(`#${groupAnchor(state.group!)}`)?.scrollIntoView({ block: "start" }), 30)
    return () => clearTimeout(t)
  }, [state])
  return (
    <ModalOverlay
      isDismissable
      isOpen={state.open}
      onOpenChange={(o) => !o && onClose()}
      className="fixed inset-0 z-[100] bg-scrim/40 data-entering:animate-[m3-fade-in_200ms_var(--md-easing-standard)] data-exiting:animate-[m3-fade-out_150ms_var(--md-easing-standard)] lg:hidden"
    >
      <Modal className="fixed inset-y-0 left-0 w-90 max-w-[85vw] data-entering:animate-[m3-sheet-in-left_400ms_var(--md-easing-emphasized-decelerate)] data-exiting:animate-[m3-sheet-out-left_200ms_var(--md-easing-emphasized-accelerate)]">
        <Dialog aria-label="Docs" className="h-full outline-none">
          <div ref={scrollRef} className="h-full overflow-y-auto rounded-r-lg bg-surface-container-low p-3 text-on-surface shadow-1">
            <div className="flex h-14 items-center justify-between pl-4 text-title-md">
              Docs
              <button type="button" onClick={onClose} aria-label="Close" className="state-layer focus-ring inline-flex size-12 cursor-pointer items-center justify-center rounded-full text-on-surface-variant">
                <Icon name="close" />
              </button>
            </div>
            <div className="mb-2 px-1">
              <SearchField />
            </div>
            <DocsNavList current={current} onNavigate={onClose} />
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}

/** Scroll-spied table of contents: the active heading gets a 3dp primary bar. */
function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = React.useState(items[0]?.id)
  const key = items.map((i) => i.id).join()

  React.useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setActive(en.target.id)
      },
      { rootMargin: "-96px 0px -70% 0px" },
    )
    const t = setTimeout(() => items.forEach(({ id }) => { const el = document.getElementById(id); if (el) io.observe(el) }), 60)
    return () => {
      clearTimeout(t)
      io.disconnect()
    }
  }, [key])

  return (
    <>
      <div className="px-3 pb-2 text-title-sm text-on-surface-variant">On this page</div>
      {items.map((t) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          aria-current={active === t.id ? "location" : undefined}
          onClick={(e) => {
            e.preventDefault()
            const el = document.getElementById(t.id)
            if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" })
            history.replaceState(null, "", `#${t.id}`)
            setActive(t.id)
          }}
          className={cn(
            "flex h-9 items-center border-l-[3px] pl-3 text-label-lg transition-colors duration-200",
            active === t.id ? "border-primary text-primary" : "border-outline-variant text-on-surface-variant hover:text-on-surface",
          )}
        >
          {t.label}
        </a>
      ))}
    </>
  )
}
