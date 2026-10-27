import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { SECTION_TITLES } from "@/docs/catalog"

/**
 * One Components-page section. `id` must match a design-reference article id (see catalog.ts);
 * the title comes from the catalog unless overridden.
 */
export function Section({
  id,
  title,
  description,
  spec,
  children,
}: {
  id: string
  title?: string
  description: string
  spec?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-headline-sm font-medium">{title ?? SECTION_TITLES[id] ?? id}</h3>
          <p className="max-w-prose text-body-md text-on-surface-variant">{description}</p>
        </div>
        {spec && (
          <a href={spec} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-label-lg text-primary">
            Spec
            <Icon size={18}>open_in_new</Icon>
          </a>
        )}
      </header>
      <div className="space-y-8 rounded-xl bg-surface-container-low p-6 md:p-8">{children}</div>
    </section>
  )
}

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="text-label-md tracking-wider text-on-surface-variant uppercase">{label}</div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

/** Numbered variant tile, like the kit's "N variants" panels. */
export function Variants({ children, cols = "md:grid-cols-2 xl:grid-cols-4" }: { children: React.ReactNode; cols?: string }) {
  return <div className={`grid items-start gap-5 ${cols}`}>{children}</div>
}

export function Variant({ n, label, children, className }: { n: number; label: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className="flex min-w-0 flex-col gap-2">
      <figcaption className="flex items-center gap-2 text-label-md text-on-surface-variant">
        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-secondary-container text-label-sm text-on-secondary-container">
          {n}
        </span>
        {label}
      </figcaption>
      <div className={className ?? "flex min-h-24 flex-wrap items-center justify-center gap-3 rounded-lg bg-surface p-4"}>{children}</div>
    </figure>
  )
}
