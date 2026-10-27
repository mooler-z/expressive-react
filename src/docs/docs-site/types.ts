import type * as React from "react"

/**
 * One component / hook docs page: `src/docs/docs-site/content/<registry-id>.tsx` default-exports this.
 * Installation (CLI + Manual source), the install chip, breadcrumbs, TOC and prev/next are derived
 * automatically from the registry item and the nav — don't repeat them here.
 */
export interface ComponentDoc {
  /** Page title. Defaults to the nav label. */
  title?: string
  /** Lead paragraph under the title. */
  description: React.ReactNode
  /** External references shown as chips next to the title. */
  links?: { m3?: string; aria?: string }
  /** Main demo at the top of the page (Preview / Code tabs, light/dark + RTL toggles). */
  preview: DocDemo
  /** Minimal usage snippet (imports + one call). Plain code, not rendered. */
  usage?: string
  /** Numbered examples. Each is a real .tsx file; its source is shown in the Code tab. */
  examples?: DocExample[]
  /** Props tables, one per exported component (or hook signature). */
  api?: DocApi[]
  accessibility?: DocAccessibility
  /** "M3 spec values" section. */
  spec?: DocSpec
}

/** A live demo plus the exact source of the file it comes from (`import x from "…/demo"` + `import src from "…/demo?raw"`). */
export interface DocDemo {
  component: React.ComponentType
  source: string
  /** Classes for the preview stage (defaults: centered flex-wrap, min-h 320 for the main preview, 160 for examples). */
  className?: string
}

export interface DocExample extends DocDemo {
  /** Anchor id; rendered as `#ex-<id>`. */
  id: string
  title: string
  description?: React.ReactNode
}

export interface DocApi {
  /** Component or hook name, e.g. "Button" or "useTilt(ref, options)". */
  name: string
  /** One line above the table, e.g. what it extends. */
  description?: React.ReactNode
  props: DocProp[]
}

export interface DocProp {
  name: string
  /** TypeScript type as text: '"xs" | "sm"', "ReactNode", "(e: PressEvent) => void". */
  type: string
  /** Default as text; omit or "—" for none. */
  default?: string
  description: React.ReactNode
}

export interface DocAccessibility {
  /** Paragraph on semantics (native element, roles, labels). */
  description?: React.ReactNode
  /** Keyboard table. `keys` render as <kbd>; use a plain string row label (e.g. "Pending") via `label`. */
  keyboard?: { keys?: string[]; label?: string; description: React.ReactNode }[]
  /** Extra bullet notes. */
  notes?: React.ReactNode[]
}

export interface DocSpec {
  /** Optional intro line. */
  description?: React.ReactNode
  /** Tables of measured values (sizes, colors…). */
  tables?: { title?: string; columns: string[]; rows: React.ReactNode[][] }[]
  /** Small cards under the tables, e.g. Motion / States / Elevation & color. */
  cards?: { title: string; items: React.ReactNode[] }[]
  /** Where the numbers come from (androidx token files, m3.material.io…). */
  source?: React.ReactNode
}

/** A Getting-started guide page: `src/docs/docs-site/guides/<id>.tsx` default-exports the body; `lead` is the intro line. */
export type GuideModule = { default: React.ComponentType; lead?: React.ReactNode }
