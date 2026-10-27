import * as React from "react"
import { NavLink } from "react-router"

import { DocsHeader } from "@/docs/docs-header"
import { BLOCK_PAGES } from "@/docs/catalog"
import { cn } from "@/lib/utils"

/** Shared chrome for the five Blocks pages: docs header + block-category tabs. */
export function BlocksLayout({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      <DocsHeader />
      <div className="mx-auto max-w-[1600px] px-4 pb-24 md:px-6">
        <nav className="no-scrollbar flex gap-2 overflow-x-auto py-4">
          {BLOCK_PAGES.map((p) => (
            <NavLink
              key={p.path}
              to={p.path}
              className={({ isActive }) =>
                cn(
                  "state-layer inline-flex h-8 shrink-0 items-center rounded-sm border border-outline-variant px-4 text-label-lg text-on-surface-variant",
                  isActive && "border-transparent bg-secondary-container text-on-secondary-container",
                )
              }
            >
              {p.title}
            </NavLink>
          ))}
        </nav>
        <header className="py-6">
          <h1 className="text-display-sm font-medium">{title}</h1>
          <p className="mt-2 max-w-prose text-body-lg text-on-surface-variant">{description}</p>
        </header>
        <div className="space-y-16">{children}</div>
      </div>
    </div>
  )
}

/** One block with its numbered variants, mirroring the reference `<section id="login">` + `login-1…3` pattern. */
export function BlockSection({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-headline-sm font-medium">{title}</h2>
        {description && <p className="max-w-prose text-body-md text-on-surface-variant">{description}</p>}
      </div>
      {children}
    </section>
  )
}

/** Frame for previewing a block at full width inside the docs. */
export function BlockPreview({ id, label, children, className }: { id?: string; label?: string; children: React.ReactNode; className?: string }) {
  return (
    <figure id={id} className="scroll-mt-24 space-y-2">
      {label && <figcaption className="text-label-md text-on-surface-variant">{label}</figcaption>}
      <div className={cn("@container overflow-hidden rounded-xl border border-outline-variant bg-surface", className)}>{children}</div>
    </figure>
  )
}
