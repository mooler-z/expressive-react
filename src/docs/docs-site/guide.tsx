import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/* Prose building blocks for Getting-started guides (src/docs/docs-site/guides/<id>.tsx). */

/** Body text column. Paragraphs are body-large on-surface-variant, like the design's Introduction. */
export function Prose({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mt-8 space-y-5 text-body-lg text-on-surface-variant", className)}>{children}</div>
}

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 pt-4 text-headline-sm font-semibold text-on-surface">
      {children}
    </h2>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="pt-2 text-title-lg text-on-surface">{children}</h3>
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-on-surface">{children}</strong>
}

/** Feature card grid ("What's in the box"). */
export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>
}

export function InfoCard({ icon, title, children }: { icon: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-surface-container-low p-5">
      <Icon name={icon} className="text-primary" />
      <div className="mt-3 text-title-md text-on-surface">{title}</div>
      <div className="mt-1 text-body-md">{children}</div>
    </div>
  )
}

/** Check-marked list ("Principles"). */
export function Checklist({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-3">{children}</ul>
}

export function Check({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <Icon name="check_circle" className="mt-0.5 text-primary" />
      <span className="min-w-0">{children}</span>
    </li>
  )
}

/** Plain bullet list in prose. */
export function Bullets({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6 marker:text-outline">{children}</ul>
}
