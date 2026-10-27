import * as React from "react"

import { FixedFlexiblePanes } from "@/components/blocks/layouts/pane-layout"
import { Icon } from "@/components/ui/icon"
import { Shape } from "@/components/ui/shape"

/*
 * Layouts page sections (docs only), ported from design-reference/Layouts.dc.html.
 * The wireframes illustrate the shipped layout blocks in src/components/blocks/layouts.
 */

export type WinOption = {
  id: string
  label: string
  icon: string
  w: number
  range: string
  start: string
  flex: number
  prefix: string
  nav: string
  panes: string
  cols: number
  margin: number
  rulerCls: string
  cardCls: string
  pick: () => void
}

function FixedPaneMock() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-title-sm">Fixed pane</span>
        <span className="rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">360dp</span>
      </div>
      <div className="mt-2 space-y-1">
        <span className="flex items-center gap-3 rounded-md bg-secondary-container p-2.5">
          <i className="block size-8 shrink-0 rounded-full bg-primary"></i>
          <i className="block h-2 flex-1 rounded-full bg-on-secondary-container/25"></i>
        </span>
        <span className="flex items-center gap-3 p-2.5">
          <i className="block size-8 shrink-0 rounded-full bg-tertiary-container"></i>
          <i className="block h-2 flex-1 rounded-full bg-on-surface/15"></i>
        </span>
        <span className="flex items-center gap-3 p-2.5">
          <i className="block size-8 shrink-0 rounded-full bg-primary-container"></i>
          <i className="block h-2 flex-1 rounded-full bg-on-surface/15"></i>
        </span>
        <span className="flex items-center gap-3 p-2.5">
          <i className="block size-8 shrink-0 rounded-full bg-secondary-container"></i>
          <i className="block h-2 flex-1 rounded-full bg-on-surface/15"></i>
        </span>
      </div>
    </div>
  )
}

function FlexiblePaneMock() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-title-sm">Flexible pane</span>
        <span className="rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">fills</span>
      </div>
      <i className="block h-24 rounded-md bg-primary-container"></i>
      <i className="block h-2 w-full rounded-full bg-on-surface/10"></i>
      <i className="block h-2 w-5/6 rounded-full bg-on-surface/10"></i>
      <i className="block h-2 w-2/3 rounded-full bg-on-surface/10"></i>
    </div>
  )
}

export function LayoutsHero() {
  return (
    <section className="grid gap-10 pb-6 pt-8 lg:pt-12 2xl:grid-cols-[minmax(0,1fr)_auto] 2xl:items-end">
      {" "}
      <div className="max-w-2xl">
        {" "}
        <span className="inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant">
          <Icon size={18} className="text-primary">
            view_quilt
          </Icon>
          Canonical layouts · panes · app shells · page templates
        </span>{" "}
        <h1 className="mt-5 text-display-sm font-semibold tracking-tight text-balance md:text-display-md">
          Layouts that adapt from phone to desktop.
        </h1>{" "}
        <p className="mt-4 max-w-xl text-body-lg text-on-surface-variant text-pretty">
          Window size classes, the three M3 canonical layouts, pane rules, app shells and twelve page templates. All of it is Tailwind on
          the kit's tokens, so any layout here can seed a new template.
        </p>{" "}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#adaptive"
            className="state-layer inline-flex h-14 items-center gap-2 rounded-full bg-primary px-6 text-title-md text-on-primary transition-[border-radius] duration-300 ease-emphasized active:rounded-lg"
          >
            <Icon>devices</Icon>Try the adaptive demo
          </a>
          <a
            href="#pages"
            className="state-layer inline-flex h-14 items-center gap-2 rounded-full bg-secondary-container px-6 text-title-md text-on-secondary-container transition-[border-radius] duration-300 ease-emphasized active:rounded-lg"
          >
            Page templates
          </a>
        </div>{" "}
      </div>{" "}
      <div className="flex flex-wrap items-end gap-4">
        {" "}
        <figure className="flex flex-col items-center gap-2">
          {" "}
          <div className="flex h-48 w-[92px] flex-col overflow-hidden rounded-[22px] border-4 border-surface-container-highest bg-surface shadow-2">
            {" "}
            <span className="flex h-8 shrink-0 items-center gap-1.5 px-2.5">
              <i className="block h-2 w-9 rounded-full bg-on-surface/30"></i>
              <i className="ml-auto block size-4 rounded-full bg-tertiary-container"></i>
            </span>{" "}
            <span className="flex flex-1 flex-col gap-1 px-1.5">
              <span className="flex items-center gap-1.5 rounded-md bg-secondary-container p-1.5">
                <i className="block size-3.5 shrink-0 rounded-full bg-error-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-secondary-container/30"></i>
              </span>
              <span className="flex items-center gap-1.5 p-1.5">
                <i className="block size-3.5 shrink-0 rounded-full bg-tertiary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1.5 p-1.5">
                <i className="block size-3.5 shrink-0 rounded-full bg-primary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1.5 p-1.5">
                <i className="block size-3.5 shrink-0 rounded-full bg-secondary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
            </span>{" "}
            <span className="flex h-10 shrink-0 items-center justify-around bg-surface-container px-1">
              <i className="block h-4 w-7 rounded-full bg-secondary-container"></i>
              <i className="block size-2.5 rounded-full bg-on-surface/25"></i>
              <i className="block size-2.5 rounded-full bg-on-surface/25"></i>
              <i className="block size-2.5 rounded-full bg-on-surface/25"></i>
            </span>{" "}
          </div>{" "}
          <figcaption className="text-label-md text-on-surface-variant">Compact</figcaption>{" "}
        </figure>{" "}
        <figure className="flex flex-col items-center gap-2">
          {" "}
          <div className="flex h-48 w-36 gap-1.5 overflow-hidden rounded-[22px] border-4 border-surface-container-highest bg-surface-container p-1.5 shadow-2">
            {" "}
            <span className="flex w-6 shrink-0 flex-col items-center gap-2 pt-1.5">
              <i className="block size-4 rounded-md bg-tertiary-container"></i>
              <i className="mt-1 block h-3 w-5 rounded-full bg-secondary-container"></i>
              <i className="block size-2 rounded-full bg-on-surface/25"></i>
              <i className="block size-2 rounded-full bg-on-surface/25"></i>
            </span>{" "}
            <span className="flex flex-1 flex-col gap-1 rounded-lg bg-surface p-1.5">
              <i className="mb-0.5 block h-2 w-2/3 rounded-full bg-on-surface/30"></i>
              <span className="flex items-center gap-1 p-1">
                <i className="block size-3 shrink-0 rounded-full bg-error-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1 p-1">
                <i className="block size-3 shrink-0 rounded-full bg-tertiary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1 p-1">
                <i className="block size-3 shrink-0 rounded-full bg-primary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1 p-1">
                <i className="block size-3 shrink-0 rounded-full bg-secondary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
            </span>{" "}
          </div>{" "}
          <figcaption className="text-label-md text-on-surface-variant">Medium</figcaption>{" "}
        </figure>{" "}
        <figure className="flex flex-col items-center gap-2">
          {" "}
          <div className="flex h-48 w-72 gap-1.5 overflow-hidden rounded-[22px] border-4 border-surface-container-highest bg-surface-container p-1.5 shadow-2">
            {" "}
            <span className="flex w-6 shrink-0 flex-col items-center gap-2 pt-1.5">
              <i className="block size-4 rounded-md bg-tertiary-container"></i>
              <i className="mt-1 block h-3 w-5 rounded-full bg-secondary-container"></i>
              <i className="block size-2 rounded-full bg-on-surface/25"></i>
              <i className="block size-2 rounded-full bg-on-surface/25"></i>
            </span>{" "}
            <span className="flex w-[38%] flex-col gap-1 rounded-lg bg-surface p-1.5">
              <i className="mb-0.5 block h-2 w-2/3 rounded-full bg-on-surface/30"></i>
              <span className="flex items-center gap-1 rounded-sm bg-secondary-container p-1">
                <i className="block size-3 shrink-0 rounded-full bg-error-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-secondary-container/30"></i>
              </span>
              <span className="flex items-center gap-1 p-1">
                <i className="block size-3 shrink-0 rounded-full bg-tertiary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1 p-1">
                <i className="block size-3 shrink-0 rounded-full bg-primary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
            </span>{" "}
            <span className="flex flex-1 flex-col gap-1.5 rounded-lg bg-surface p-2">
              <i className="block h-2.5 w-2/3 rounded-full bg-on-surface/30"></i>
              <span className="flex gap-1">
                <i className="block h-3 w-8 rounded-sm bg-error-container"></i>
                <i className="block h-3 w-10 rounded-sm bg-surface-container-high"></i>
              </span>
              <i className="block h-1.5 w-full rounded-full bg-on-surface/10"></i>
              <i className="block h-1.5 w-5/6 rounded-full bg-on-surface/10"></i>
              <span className="grid grid-cols-3 gap-1">
                <i className="block h-7 rounded-md bg-surface-container"></i>
                <i className="block h-7 rounded-md bg-surface-container"></i>
                <i className="block h-7 rounded-md bg-surface-container"></i>
              </span>
              <span className="mt-auto flex gap-1">
                <i className="block h-4 w-12 rounded-full bg-primary"></i>
                <i className="block h-4 w-10 rounded-full border border-outline-variant"></i>
              </span>
            </span>{" "}
          </div>{" "}
          <figcaption className="text-label-md text-on-surface-variant">Expanded</figcaption>{" "}
        </figure>{" "}
      </div>{" "}
    </section>
  )
}

export function WindowClassesSection({ winOpts }: { winOpts: WinOption[] }) {
  return (
    <section id="classes" className="mt-20 scroll-mt-24" data-toc>
      {" "}
      <h2 className="text-headline-lg font-semibold">Window size classes</h2>{" "}
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
        Tailwind breakpoints are mapped to the five M3 classes, so{" "}
        <code className="rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-body-sm">md:</code> means medium and up. Each
        class sets the navigation, the pane count and the margins. Pick one to load it into the demo above.
      </p>{" "}
      <div className="mt-6 space-y-6 rounded-xl bg-surface-container-low p-6 md:p-8">
        {" "}
        <div>
          {" "}
          <div className="flex h-12 gap-1 text-label-lg">
            {winOpts.map((o) => (
              <React.Fragment key={o.id}>
                <button
                  className={`state-layer flex min-w-0 items-center justify-center truncate rounded-md px-2 transition-colors duration-300 ${o.rulerCls}`}
                  style={{ flex: `${o.flex} 1 0%` }}
                  onClick={o.pick}
                >
                  {o.label}
                </button>
              </React.Fragment>
            ))}
          </div>{" "}
          <div className="mt-2 flex gap-1 font-mono text-label-sm text-on-surface-variant">
            {winOpts.map((o) => (
              <React.Fragment key={o.id}>
                <span className="min-w-0 border-l border-outline-variant pl-1.5" style={{ flex: `${o.flex} 1 0%` }}>
                  {o.start}
                </span>
              </React.Fragment>
            ))}
          </div>{" "}
        </div>{" "}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {winOpts.map((o) => (
            <React.Fragment key={o.id}>
              <button
                className={`state-layer flex flex-col gap-3 rounded-lg p-4 text-left transition-colors duration-300 ${o.cardCls}`}
                onClick={o.pick}
              >
                <span className="flex items-center gap-2">
                  <Icon>{o.icon}</Icon>
                  <span className="flex-1 text-title-md">{o.label}</span>
                  <span className="rounded-xs bg-on-surface/10 px-1.5 py-0.5 font-mono text-label-sm">{o.prefix}</span>
                </span>
                <span className="text-headline-sm font-medium tabular-nums">
                  {o.range}
                  <span className="text-body-md opacity-70"> dp</span>
                </span>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-body-sm">
                  <dt className="opacity-70">Navigation</dt>
                  <dd>{o.nav}</dd>
                  <dt className="opacity-70">Panes</dt>
                  <dd>{o.panes}</dd>
                  <dt className="opacity-70">Columns</dt>
                  <dd>{o.cols}</dd>
                  <dt className="opacity-70">Margins</dt>
                  <dd>{o.margin}dp</dd>
                </dl>
              </button>
            </React.Fragment>
          ))}
        </div>{" "}
      </div>{" "}
    </section>
  )
}

export function CanonicalSection() {
  return (
    <section id="canonical" className="mt-20 scroll-mt-24" data-toc>
      {" "}
      <h2 className="text-headline-lg font-semibold">Canonical layouts: list-detail, supporting pane, feed</h2>{" "}
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
        The three starting points M3 recommends. Each has an expanded form (left) and a compact form (the phone).
      </p>{" "}
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {" "}
        <article className="flex flex-col gap-5 rounded-xl bg-surface-container-low p-5">
          {" "}
          <div className="flex items-end gap-3">
            {" "}
            <div className="flex aspect-[16/10] min-w-0 flex-1 gap-1.5 overflow-hidden rounded-lg bg-surface-container p-1.5">
              <span className="flex w-5 shrink-0 flex-col items-center gap-1.5 pt-1">
                <i className="block size-3.5 rounded-md bg-tertiary-container"></i>
                <i className="mt-1 block h-2.5 w-4 rounded-full bg-secondary-container"></i>
                <i className="block size-2 rounded-full bg-on-surface/20"></i>
                <i className="block size-2 rounded-full bg-on-surface/20"></i>
              </span>
              <span className="flex w-[36%] flex-col gap-1 rounded-md bg-surface p-1.5">
                <i className="mb-0.5 block h-2 w-1/2 rounded-full bg-on-surface/25"></i>
                <span className="flex items-center gap-1 rounded-sm bg-secondary-container p-1">
                  <i className="block size-2.5 shrink-0 rounded-full bg-primary"></i>
                  <i className="block h-1.5 flex-1 rounded-full bg-on-secondary-container/25"></i>
                </span>
                <span className="flex items-center gap-1 p-1">
                  <i className="block size-2.5 shrink-0 rounded-full bg-tertiary-container"></i>
                  <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
                </span>
                <span className="flex items-center gap-1 p-1">
                  <i className="block size-2.5 shrink-0 rounded-full bg-primary-container"></i>
                  <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
                </span>
                <span className="flex items-center gap-1 p-1">
                  <i className="block size-2.5 shrink-0 rounded-full bg-secondary-container"></i>
                  <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
                </span>
              </span>
              <span className="flex flex-1 flex-col gap-1.5 rounded-md bg-surface p-2">
                <i className="block h-2 w-2/3 rounded-full bg-on-surface/25"></i>
                <i className="block h-1.5 w-full rounded-full bg-on-surface/10"></i>
                <i className="block h-1.5 w-5/6 rounded-full bg-on-surface/10"></i>
                <i className="mt-1 block flex-1 rounded-sm bg-primary-container"></i>
                <span className="flex gap-1">
                  <i className="block h-3 w-8 rounded-full bg-primary"></i>
                  <i className="block h-3 w-8 rounded-full bg-on-surface/10"></i>
                </span>
              </span>
            </div>{" "}
            <div className="flex aspect-[9/19] w-14 shrink-0 flex-col gap-1 overflow-hidden rounded-xl border-2 border-surface-container-highest bg-surface p-1">
              <i className="mb-0.5 block h-1.5 w-2/3 rounded-full bg-on-surface/25"></i>
              <i className="block h-3 rounded-sm bg-secondary-container"></i>
              <i className="block h-3 rounded-sm bg-surface-container"></i>
              <i className="block h-3 rounded-sm bg-surface-container"></i>
              <i className="block h-3 rounded-sm bg-surface-container"></i>
              <i className="mt-auto block h-3 rounded-full bg-surface-container-high"></i>
            </div>{" "}
          </div>{" "}
          <div>
            <h3 className="text-title-lg font-medium">List-detail</h3>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Browse a collection and open one item beside it. The list stays in place while the detail changes.
            </p>
          </div>{" "}
          <dl className="grid grid-cols-[88px_1fr] gap-y-2 border-t border-outline-variant pt-4 text-body-sm">
            <dt className="text-on-surface-variant">Compact</dt>
            <dd>List first; the detail opens as its own screen</dd>
            <dt className="text-on-surface-variant">Expanded</dt>
            <dd>List in a 360dp fixed pane, detail flexible</dd>
            <dt className="text-on-surface-variant">Use for</dt>
            <dd>Inbox, files, incidents, settings</dd>
          </dl>{" "}
        </article>{" "}
        <article className="flex flex-col gap-5 rounded-xl bg-surface-container-low p-5">
          {" "}
          <div className="flex items-end gap-3">
            {" "}
            <div className="flex aspect-[16/10] min-w-0 flex-1 gap-1.5 overflow-hidden rounded-lg bg-surface-container p-1.5">
              <span className="flex w-5 shrink-0 flex-col items-center gap-1.5 pt-1">
                <i className="block size-3.5 rounded-md bg-tertiary-container"></i>
                <i className="mt-1 block h-2.5 w-4 rounded-full bg-secondary-container"></i>
                <i className="block size-2 rounded-full bg-on-surface/20"></i>
                <i className="block size-2 rounded-full bg-on-surface/20"></i>
              </span>
              <span className="flex flex-1 flex-col gap-1.5 rounded-md bg-surface p-2">
                <i className="block h-2 w-1/2 rounded-full bg-on-surface/25"></i>
                <i className="block flex-1 rounded-sm bg-tertiary-container"></i>
                <i className="block h-1.5 w-full rounded-full bg-on-surface/10"></i>
                <i className="block h-1.5 w-4/5 rounded-full bg-on-surface/10"></i>
              </span>
              <span className="flex w-[30%] flex-col gap-1 rounded-md bg-surface p-1.5">
                <i className="mb-0.5 block h-2 w-2/3 rounded-full bg-on-surface/25"></i>
                <i className="block h-5 rounded-sm bg-surface-container"></i>
                <i className="block h-5 rounded-sm bg-surface-container"></i>
                <i className="block h-5 rounded-sm bg-primary-container"></i>
              </span>
            </div>{" "}
            <div className="relative flex aspect-[9/19] w-14 shrink-0 flex-col gap-1 overflow-hidden rounded-xl border-2 border-surface-container-highest bg-surface p-1">
              <i className="block h-1.5 w-2/3 rounded-full bg-on-surface/25"></i>
              <i className="block h-10 rounded-sm bg-tertiary-container"></i>
              <i className="block h-1 w-full rounded-full bg-on-surface/10"></i>
              <i className="block h-1 w-4/5 rounded-full bg-on-surface/10"></i>
              <span className="absolute inset-x-0 bottom-0 flex h-12 flex-col items-center gap-1 rounded-t-lg bg-surface-container-high pt-1">
                <i className="block h-0.5 w-4 rounded-full bg-on-surface/30"></i>
                <i className="block h-2 w-10 rounded-sm bg-surface-container-highest"></i>
                <i className="block h-2 w-10 rounded-sm bg-surface-container-highest"></i>
              </span>
            </div>{" "}
          </div>{" "}
          <div>
            <h3 className="text-title-lg font-medium">Supporting pane</h3>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Primary content takes most of the width; a narrower pane holds related tools or context.
            </p>
          </div>{" "}
          <dl className="grid grid-cols-[88px_1fr] gap-y-2 border-t border-outline-variant pt-4 text-body-sm">
            <dt className="text-on-surface-variant">Compact</dt>
            <dd>Supporting content moves below, or into a bottom sheet</dd>
            <dt className="text-on-surface-variant">Expanded</dt>
            <dd>Main pane flexible, supporting pane about one third</dd>
            <dt className="text-on-surface-variant">Use for</dt>
            <dd>Docs with comments, editors, video with chat</dd>
          </dl>{" "}
        </article>{" "}
        <article className="flex flex-col gap-5 rounded-xl bg-surface-container-low p-5">
          {" "}
          <div className="flex items-end gap-3">
            {" "}
            <div className="flex aspect-[16/10] min-w-0 flex-1 gap-1.5 overflow-hidden rounded-lg bg-surface-container p-1.5">
              <span className="flex w-5 shrink-0 flex-col items-center gap-1.5 pt-1">
                <i className="block size-3.5 rounded-md bg-tertiary-container"></i>
                <i className="mt-1 block h-2.5 w-4 rounded-full bg-secondary-container"></i>
                <i className="block size-2 rounded-full bg-on-surface/20"></i>
                <i className="block size-2 rounded-full bg-on-surface/20"></i>
              </span>
              <span className="grid flex-1 grid-cols-3 grid-rows-2 gap-1.5 rounded-md bg-surface p-1.5">
                <i className="col-span-2 block rounded-sm bg-primary-container"></i>
                <i className="block rounded-sm bg-secondary-container"></i>
                <i className="block rounded-sm bg-tertiary-container"></i>
                <i className="block rounded-sm bg-surface-container-high"></i>
                <i className="block rounded-sm bg-primary-fixed-dim"></i>
              </span>
            </div>{" "}
            <div className="flex aspect-[9/19] w-14 shrink-0 flex-col gap-1 overflow-hidden rounded-xl border-2 border-surface-container-highest bg-surface p-1">
              <i className="block h-1.5 w-2/3 rounded-full bg-on-surface/25"></i>
              <i className="block h-8 rounded-sm bg-primary-container"></i>
              <i className="block h-8 rounded-sm bg-secondary-container"></i>
              <i className="block h-8 rounded-sm bg-tertiary-container"></i>
              <i className="mt-auto block h-3 rounded-full bg-surface-container-high"></i>
            </div>{" "}
          </div>{" "}
          <div>
            <h3 className="text-title-lg font-medium">Feed</h3>
            <p className="mt-1 text-body-md text-on-surface-variant">
              A grid of equal-weight cards that reflows as the window grows. One item can span two columns.
            </p>
          </div>{" "}
          <dl className="grid grid-cols-[88px_1fr] gap-y-2 border-t border-outline-variant pt-4 text-body-sm">
            <dt className="text-on-surface-variant">Compact</dt>
            <dd>One column of full-width cards</dd>
            <dt className="text-on-surface-variant">Expanded</dt>
            <dd>Three or four columns with 24dp gutters</dd>
            <dt className="text-on-surface-variant">Use for</dt>
            <dd>News, catalogs, galleries, dashboards</dd>
          </dl>{" "}
        </article>{" "}
      </div>{" "}
    </section>
  )
}

export function PanesSection() {
  return (
    <section id="panes" className="mt-20 scroll-mt-24" data-toc>
      {" "}
      <h2 className="text-headline-lg font-semibold">Panes: fixed, flexible and the spacer between</h2>{" "}
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
        Panes are the building blocks of every layout on this page. Drag the handle to resize the fixed pane; the flexible pane takes what's
        left.
      </p>{" "}
      <div className="mt-6 grid gap-6 rounded-xl bg-surface-container-low p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        {" "}
        <div className="h-80 overflow-hidden rounded-xl bg-surface-container p-3">
          <FixedFlexiblePanes
            defaultFixedSize="42%"
            minFixedSize="25%"
            maxFixedSize="70%"
            windowSize="expanded"
            fixed={<FixedPaneMock />}
            flexible={<FlexiblePaneMock />}
          />
        </div>{" "}
        <dl className="space-y-4 text-body-md">
          {" "}
          <div>
            <dt className="text-title-sm">Fixed pane</dt>
            <dd className="mt-0.5 text-on-surface-variant">360dp by default. Holds lists, navigation or filters.</dd>
          </div>{" "}
          <div>
            <dt className="text-title-sm">Flexible pane</dt>
            <dd className="mt-0.5 text-on-surface-variant">Takes the remaining width; its content reflows.</dd>
          </div>{" "}
          <div>
            <dt className="text-title-sm">Spacer</dt>
            <dd className="mt-0.5 text-on-surface-variant">24dp between panes. It doubles as the drag target.</dd>
          </div>{" "}
          <div>
            <dt className="text-title-sm">Drag handle</dt>
            <dd className="mt-0.5 text-on-surface-variant">A 4 × 48dp pill that grows on hover and press.</dd>
          </div>{" "}
          <div>
            <dt className="text-title-sm">Pane count</dt>
            <dd className="mt-0.5 text-on-surface-variant">
              One in compact and medium, two in expanded and large, up to three in extra-large.
            </dd>
          </div>{" "}
        </dl>{" "}
      </div>{" "}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] gap-1.5 rounded-lg bg-surface-container p-1.5">
            <i className="block flex-1 rounded-md bg-surface"></i>
          </div>
          <figcaption className="px-1">
            <span className="block text-title-sm">Single pane</span>
            <span className="block text-body-sm text-on-surface-variant">Compact and medium windows</span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] gap-1.5 rounded-lg bg-surface-container p-1.5">
            <i className="block w-[38%] rounded-md bg-surface"></i>
            <i className="block flex-1 rounded-md bg-surface"></i>
          </div>
          <figcaption className="px-1">
            <span className="block text-title-sm">Fixed + flexible</span>
            <span className="block text-body-sm text-on-surface-variant">List-detail in expanded and large</span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] gap-1.5 rounded-lg bg-surface-container p-1.5">
            <i className="block flex-1 rounded-md bg-surface"></i>
            <i className="block flex-1 rounded-md bg-surface"></i>
          </div>
          <figcaption className="px-1">
            <span className="block text-title-sm">Split</span>
            <span className="block text-body-sm text-on-surface-variant">Two equal panes for comparing items</span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] gap-1.5 rounded-lg bg-surface-container p-1.5">
            <i className="block w-[28%] rounded-md bg-surface"></i>
            <i className="block flex-1 rounded-md bg-surface"></i>
            <i className="block w-[24%] rounded-md bg-surface-container-highest"></i>
          </div>
          <figcaption className="px-1">
            <span className="block text-title-sm">Three panes</span>
            <span className="block text-body-sm text-on-surface-variant">List, detail and supporting in extra-large</span>
          </figcaption>
        </figure>{" "}
      </div>{" "}
    </section>
  )
}

export function ShellsSection() {
  return (
    <section id="shells" className="mt-20 scroll-mt-24" data-toc>
      {" "}
      <h2 className="text-headline-lg font-semibold">App shells: the frame around your content</h2>{" "}
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
        Navigation, app bars and the body pane arranged for the main kinds of product. The <a href="/admin" className="text-primary underline underline-offset-3 hover:text-on-primary-container">Admin</a> template uses the rail
        shell; <a href="/landing" className="text-primary underline underline-offset-3 hover:text-on-primary-container">Landing</a> uses the marketing shell.
      </p>{" "}
      <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="grid aspect-[16/10] place-items-center rounded-lg bg-surface-container">
            <div className="relative flex aspect-[9/19] h-[88%] flex-col overflow-hidden rounded-xl border-2 border-surface-container-highest bg-surface">
              <span className="flex h-5 shrink-0 items-center gap-1 px-1.5">
                <i className="block size-2 rounded-full bg-on-surface/25"></i>
                <i className="block h-1.5 w-8 rounded-full bg-on-surface/25"></i>
              </span>
              <span className="flex flex-1 flex-col gap-1 px-1.5">
                <i className="block h-6 rounded-sm bg-primary-container"></i>
                <i className="block h-1 w-full rounded-full bg-on-surface/10"></i>
                <i className="block h-4 rounded-sm bg-surface-container"></i>
                <i className="block h-4 rounded-sm bg-surface-container"></i>
              </span>
              <i className="absolute bottom-8 right-1.5 block size-4 rounded-md bg-tertiary-container"></i>
              <span className="flex h-6 shrink-0 items-center justify-around bg-surface-container">
                <i className="block h-2.5 w-4 rounded-full bg-secondary-container"></i>
                <i className="block size-1.5 rounded-full bg-on-surface/30"></i>
                <i className="block size-1.5 rounded-full bg-on-surface/30"></i>
                <i className="block size-1.5 rounded-full bg-on-surface/30"></i>
              </span>
            </div>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="flex items-center gap-2">
              <span className="text-title-md">Navigation bar</span>
              <span className="ml-auto rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">
                &lt; 600
              </span>
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Top app bar, one pane, three to five destinations in the bar and a FAB above it.
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] gap-1.5 overflow-hidden rounded-lg bg-surface-container p-1.5">
            <span className="flex w-6 shrink-0 flex-col items-center gap-1.5 pt-1">
              <i className="block size-2 rounded-full bg-on-surface/25"></i>
              <i className="block size-4 rounded-md bg-primary-container"></i>
              <i className="mt-1 block h-2.5 w-5 rounded-full bg-secondary-container"></i>
              <i className="block size-2 rounded-full bg-on-surface/20"></i>
              <i className="block size-2 rounded-full bg-on-surface/20"></i>
              <i className="block size-2 rounded-full bg-on-surface/20"></i>
            </span>
            <span className="flex flex-1 flex-col gap-1.5 rounded-md bg-surface p-2">
              <span className="flex items-center gap-1">
                <i className="block h-3 w-1/3 rounded-full bg-surface-container-high"></i>
                <i className="ml-auto block size-3 rounded-full bg-tertiary-container"></i>
              </span>
              <span className="grid grid-cols-3 gap-1">
                <i className="block h-6 rounded-sm bg-primary-container"></i>
                <i className="block h-6 rounded-sm bg-secondary-container"></i>
                <i className="block h-6 rounded-sm bg-tertiary-container"></i>
              </span>
              <i className="block flex-1 rounded-sm bg-surface-container"></i>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="flex items-center gap-2">
              <span className="text-title-md">Rail + body pane</span>
              <span className="ml-auto rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">
                md: · lg:
              </span>
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              A 96dp rail beside a rounded body pane that scrolls on its own.
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] gap-1.5 overflow-hidden rounded-lg bg-surface-container p-1.5">
            <span className="flex w-[26%] shrink-0 flex-col gap-1 p-1">
              <i className="block h-2 w-2/3 rounded-full bg-on-surface/25"></i>
              <i className="mt-1 block h-4 w-3/4 rounded-md bg-primary-container"></i>
              <i className="mt-1.5 block h-3 rounded-full bg-secondary-container"></i>
              <i className="block h-1.5 w-3/4 rounded-full bg-on-surface/15"></i>
              <i className="block h-1.5 w-2/3 rounded-full bg-on-surface/15"></i>
              <i className="block h-1.5 w-3/4 rounded-full bg-on-surface/15"></i>
            </span>
            <span className="flex flex-1 flex-col gap-1.5 rounded-md bg-surface p-2">
              <i className="block h-3 w-1/2 rounded-full bg-surface-container-high"></i>
              <span className="grid flex-1 grid-cols-3 gap-1">
                <i className="block rounded-sm bg-surface-container"></i>
                <i className="block rounded-sm bg-surface-container"></i>
                <i className="block rounded-sm bg-surface-container"></i>
                <i className="block rounded-sm bg-surface-container"></i>
                <i className="block rounded-sm bg-primary-container"></i>
                <i className="block rounded-sm bg-surface-container"></i>
              </span>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="flex items-center gap-2">
              <span className="text-title-md">Expanded rail</span>
              <span className="ml-auto rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">
                xl:
              </span>
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Labels inline at 220dp or more, extended FAB, grouped destinations.
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] flex-col overflow-hidden rounded-lg bg-surface">
            <span className="flex h-6 shrink-0 items-center gap-1.5 bg-surface-container px-2">
              <i className="block size-2 rounded-full bg-on-surface/30"></i>
              <i className="block h-1.5 w-1/4 rounded-full bg-on-surface/30"></i>
              <i className="ml-auto block size-2 rounded-full bg-on-surface/30"></i>
            </span>
            <span className="flex h-5 shrink-0 items-end gap-3 border-b border-outline-variant bg-surface-container px-3">
              <span className="flex flex-col items-center gap-1">
                <i className="block h-1.5 w-6 rounded-full bg-primary/70"></i>
                <i className="block h-0.5 w-6 rounded-t-full bg-primary"></i>
              </span>
              <i className="mb-1.5 block h-1.5 w-6 rounded-full bg-on-surface/20"></i>
              <i className="mb-1.5 block h-1.5 w-6 rounded-full bg-on-surface/20"></i>
            </span>
            <span className="flex flex-1 flex-col gap-1.5 p-2">
              <span className="flex items-center gap-1.5">
                <i className="block size-3 shrink-0 rounded-full bg-primary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1.5">
                <i className="block size-3 shrink-0 rounded-full bg-tertiary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1.5">
                <i className="block size-3 shrink-0 rounded-full bg-secondary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="flex items-center gap-2">
              <span className="text-title-md">App bar + tabs</span>
              <span className="ml-auto rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">
                any
              </span>
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Primary tabs under the top app bar for peer views of the same content.
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] flex-col gap-1.5 overflow-hidden rounded-lg bg-surface p-2">
            <span className="flex items-center gap-1.5">
              <i className="block size-2.5 rounded-full bg-primary"></i>
              <i className="block h-1.5 w-6 rounded-full bg-on-surface/25"></i>
              <i className="ml-auto block h-1.5 w-5 rounded-full bg-on-surface/15"></i>
              <i className="block h-1.5 w-5 rounded-full bg-on-surface/15"></i>
              <i className="block h-3 w-8 rounded-full bg-primary"></i>
            </span>
            <span className="grid flex-1 grid-cols-[1.2fr_1fr] items-center gap-2">
              <span className="space-y-1">
                <i className="block h-2.5 w-full rounded-full bg-on-surface/30"></i>
                <i className="block h-2.5 w-3/4 rounded-full bg-primary/60"></i>
                <i className="block h-1.5 w-5/6 rounded-full bg-on-surface/10"></i>
                <i className="mt-1.5 block h-3 w-10 rounded-full bg-primary"></i>
              </span>
              <Shape
                className="mx-auto size-14 text-primary-container"
                shape="cookie7"
                cycle={["cookie7", "clover4", "sunny"]}
                interval={3000}
              />
            </span>
            <span className="grid grid-cols-3 gap-1">
              <i className="block h-5 rounded-sm bg-surface-container"></i>
              <i className="block h-5 rounded-sm bg-surface-container"></i>
              <i className="block h-5 rounded-sm bg-surface-container"></i>
            </span>
            <i className="block h-3 shrink-0 rounded-sm bg-inverse-surface"></i>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="flex items-center gap-2">
              <span className="text-title-md">Marketing site</span>
              <span className="ml-auto rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">
                any
              </span>
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Top navigation, full-bleed sections in a 1280dp max-width column, inverse footer.
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] flex-col overflow-hidden rounded-lg bg-surface">
            <span className="flex h-5 shrink-0 items-center gap-1.5 border-b border-outline-variant px-2">
              <i className="block size-2 rounded-full bg-primary"></i>
              <i className="block h-1.5 w-8 rounded-full bg-on-surface/25"></i>
              <i className="ml-auto block h-2.5 w-14 rounded-full bg-surface-container-high"></i>
            </span>
            <span className="flex min-h-0 flex-1 gap-2 p-2">
              <span className="flex w-[20%] flex-col gap-1">
                <i className="block h-1.5 w-3/4 rounded-full bg-on-surface/25"></i>
                <i className="block h-2.5 rounded-full bg-secondary-container"></i>
                <i className="block h-1.5 w-2/3 rounded-full bg-on-surface/15"></i>
                <i className="block h-1.5 w-3/4 rounded-full bg-on-surface/15"></i>
                <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex flex-1 flex-col gap-1 px-1">
                <i className="block h-2.5 w-2/3 rounded-full bg-on-surface/30"></i>
                <i className="block h-1.5 w-full rounded-full bg-on-surface/10"></i>
                <i className="block h-1.5 w-11/12 rounded-full bg-on-surface/10"></i>
                <i className="my-1 block h-8 rounded-sm bg-surface-container-lowest ring-1 ring-outline-variant"></i>
                <i className="block h-1.5 w-full rounded-full bg-on-surface/10"></i>
                <i className="block h-1.5 w-4/5 rounded-full bg-on-surface/10"></i>
              </span>
              <span className="flex w-[16%] flex-col gap-1 border-l border-outline-variant pl-1.5">
                <i className="block h-1 w-3/4 rounded-full bg-primary/60"></i>
                <i className="block h-1 w-2/3 rounded-full bg-on-surface/15"></i>
                <i className="block h-1 w-3/4 rounded-full bg-on-surface/15"></i>
              </span>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="flex items-center gap-2">
              <span className="text-title-md">Documentation</span>
              <span className="ml-auto rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">
                lg:
              </span>
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Section nav, a readable content column and an "on this page" list.
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="grid aspect-[16/10] grid-cols-2 overflow-hidden rounded-lg bg-surface">
            <span className="relative grid place-items-center overflow-hidden bg-primary-container">
              <Shape className="size-20 text-primary/40" shape="sunny" cycle={["sunny", "cookie9", "clover4"]} interval={3200} />
              <i className="absolute bottom-2 left-2 block h-1.5 w-1/2 rounded-full bg-on-primary-container/40"></i>
            </span>
            <span className="flex flex-col justify-center gap-1.5 px-4">
              <i className="block h-2.5 w-1/2 rounded-full bg-on-surface/30"></i>
              <i className="block h-5 rounded-xs border border-outline"></i>
              <i className="block h-5 rounded-xs border border-outline"></i>
              <i className="mt-1 block h-4 rounded-full bg-primary"></i>
              <i className="mx-auto block h-1.5 w-1/2 rounded-full bg-on-surface/10"></i>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="flex items-center gap-2">
              <span className="text-title-md">Split screen</span>
              <span className="ml-auto rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">
                lg:
              </span>
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Sign-in and sign-up: brand panel beside the form. The panel hides in compact.
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] flex-col overflow-hidden rounded-lg bg-surface-container">
            <span className="flex h-6 shrink-0 items-center gap-1 px-2">
              <i className="block size-2.5 rounded-sm bg-primary"></i>
              <i className="block h-1.5 w-8 rounded-full bg-on-surface/25"></i>
              <span className="mx-auto flex gap-1 rounded-full bg-surface px-1.5 py-1">
                <i className="block size-2 rounded-full bg-secondary-container"></i>
                <i className="block size-2 rounded-full bg-on-surface/20"></i>
                <i className="block size-2 rounded-full bg-on-surface/20"></i>
              </span>
              <i className="block h-3 w-7 rounded-full bg-primary"></i>
            </span>
            <span className="flex min-h-0 flex-1 gap-1.5 px-1.5 pb-1.5">
              <span className="flex w-[18%] flex-col gap-1 rounded-md bg-surface p-1.5">
                <i className="block h-1.5 w-3/4 rounded-full bg-on-surface/25"></i>
                <i className="block h-1.5 w-2/3 rounded-full bg-secondary-container"></i>
                <i className="block h-1.5 w-3/4 rounded-full bg-on-surface/15"></i>
                <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="grid flex-1 place-items-center rounded-md bg-surface bg-[radial-gradient(var(--md-outline-variant)_1px,transparent_1px)] [background-size:10px_10px]">
                <i className="block h-1/2 w-1/2 rounded-md bg-tertiary-container ring-2 ring-primary"></i>
              </span>
              <span className="flex w-[20%] flex-col gap-1 rounded-md bg-surface p-1.5">
                <i className="block h-1.5 w-2/3 rounded-full bg-on-surface/25"></i>
                <span className="grid grid-cols-2 gap-1">
                  <i className="block h-3 rounded-xs bg-surface-container-high"></i>
                  <i className="block h-3 rounded-xs bg-surface-container-high"></i>
                </span>
                <i className="block h-3 rounded-xs bg-surface-container-high"></i>
                <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/15"></i>
              </span>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="flex items-center gap-2">
              <span className="text-title-md">Editor</span>
              <span className="ml-auto rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-label-sm text-on-surface-variant">
                lg:
              </span>
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Toolbar on top, layers left, canvas centre, inspector right. Panels become sheets in compact.
            </span>
          </figcaption>
        </figure>{" "}
      </div>{" "}
    </section>
  )
}

export function PageTemplatesSection() {
  return (
    <section id="pages" className="mt-20 scroll-mt-24" data-toc>
      {" "}
      <h2 className="text-headline-lg font-semibold">Page templates: twelve pages every product needs</h2>{" "}
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">Each one lists the catalog components it is built from.</p>{" "}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] flex-col gap-1.5 overflow-hidden rounded-lg bg-surface-container p-2">
            <span className="flex items-center gap-1.5">
              <i className="block h-2 w-1/4 rounded-full bg-on-surface/30"></i>
              <i className="ml-auto block h-3 w-10 rounded-full bg-surface"></i>
              <i className="block h-3 w-6 rounded-full bg-primary"></i>
            </span>
            <span className="grid grid-cols-4 gap-1.5">
              <i className="block h-7 rounded-md bg-primary-container"></i>
              <i className="block h-7 rounded-md bg-surface"></i>
              <i className="block h-7 rounded-md bg-surface"></i>
              <i className="block h-7 rounded-md bg-surface"></i>
            </span>
            <span className="grid min-h-0 flex-1 grid-cols-3 gap-1.5">
              <span className="col-span-2 flex items-end gap-1 rounded-md bg-surface p-1.5">
                <i className="block h-3 flex-1 rounded-t-xs bg-primary/30"></i>
                <i className="block h-5 flex-1 rounded-t-xs bg-primary/30"></i>
                <i className="block h-4 flex-1 rounded-t-xs bg-primary/30"></i>
                <i className="block h-6 flex-1 rounded-t-xs bg-primary/30"></i>
                <i className="block h-8 flex-1 rounded-t-xs bg-primary"></i>
              </span>
              <span className="flex flex-col gap-1 rounded-md bg-surface p-1.5">
                <i className="block h-1.5 rounded-full bg-on-surface/15"></i>
                <i className="block h-1.5 w-3/4 rounded-full bg-on-surface/15"></i>
                <i className="block h-1.5 rounded-full bg-on-surface/15"></i>
              </span>
            </span>
            <span className="flex flex-col gap-1 rounded-md bg-surface p-1.5">
              <i className="block h-1.5 rounded-full bg-on-surface/10"></i>
              <i className="block h-1.5 rounded-full bg-on-surface/10"></i>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Dashboard</span>
            <span className="block text-body-sm text-on-surface-variant">
              KPI row, a two-thirds chart beside a one-third list, then a table.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#cards" className="text-primary underline underline-offset-3 hover:text-on-primary-container">cards</a>, <a href="/kit#chart" className="text-primary underline underline-offset-3 hover:text-on-primary-container">charts</a>, <a href="/kit#data-table" className="text-primary underline underline-offset-3 hover:text-on-primary-container">data table</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] gap-2 overflow-hidden rounded-lg bg-surface p-2">
            <span className="flex w-[28%] flex-col gap-1">
              <i className="mb-1 block h-2 w-2/3 rounded-full bg-on-surface/30"></i>
              <i className="block h-3.5 rounded-full bg-secondary-container"></i>
              <i className="block h-1.5 w-3/4 rounded-full bg-on-surface/15"></i>
              <i className="block h-1.5 w-2/3 rounded-full bg-on-surface/15"></i>
              <i className="block h-1.5 w-3/4 rounded-full bg-on-surface/15"></i>
            </span>
            <span className="flex flex-1 flex-col gap-2 border-l border-outline-variant pl-2">
              <span className="space-y-1">
                <i className="block h-1.5 w-1/3 rounded-full bg-on-surface/30"></i>
                <i className="block h-5 rounded-xs border border-outline"></i>
              </span>
              <span className="space-y-1">
                <i className="block h-1.5 w-1/4 rounded-full bg-on-surface/25"></i>
                <i className="block h-5 rounded-xs border border-outline"></i>
              </span>
              <span className="flex items-center justify-between rounded-md bg-surface-container p-1.5">
                <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/20"></i>
                <i className="block h-3 w-5 rounded-full bg-primary"></i>
              </span>
              <span className="flex items-center justify-between rounded-md bg-surface-container p-1.5">
                <i className="block h-1.5 w-2/5 rounded-full bg-on-surface/20"></i>
                <i className="block h-3 w-5 rounded-full border border-outline bg-surface-container-highest"></i>
              </span>
              <span className="mt-auto flex justify-end gap-1">
                <i className="block h-3.5 w-8 rounded-full bg-on-surface/10"></i>
                <i className="block h-3.5 w-10 rounded-full bg-primary"></i>
              </span>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Settings</span>
            <span className="block text-body-sm text-on-surface-variant">
              Section list on the left, grouped fields and switches, a save bar at the end.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#field" className="text-primary underline underline-offset-3 hover:text-on-primary-container">field</a>, <a href="/kit#switch" className="text-primary underline underline-offset-3 hover:text-on-primary-container">switch</a>, <a href="/kit#navigation-drawer" className="text-primary underline underline-offset-3 hover:text-on-primary-container">drawer</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="grid aspect-[16/10] grid-cols-4 items-start gap-1.5 overflow-hidden rounded-lg bg-surface-container p-2">
            <span className="flex flex-col gap-1 rounded-md bg-surface-container-low p-1">
              <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/30"></i>
              <i className="block h-6 rounded-sm bg-surface"></i>
              <i className="block h-8 rounded-sm bg-surface"></i>
              <i className="block h-5 rounded-sm bg-surface"></i>
            </span>
            <span className="flex flex-col gap-1 rounded-md bg-surface-container-low p-1">
              <i className="block h-1.5 w-2/3 rounded-full bg-on-surface/30"></i>
              <i className="block h-8 rounded-sm bg-surface"></i>
              <i className="block h-6 rotate-3 rounded-sm bg-primary-container shadow-2"></i>
            </span>
            <span className="flex flex-col gap-1 rounded-md bg-surface-container-low p-1">
              <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/30"></i>
              <i className="block h-5 rounded-sm bg-surface"></i>
              <i className="block h-7 rounded-sm bg-surface"></i>
              <i className="block h-5 rounded-sm bg-surface"></i>
            </span>
            <span className="flex flex-col gap-1 rounded-md bg-surface-container-low p-1">
              <i className="block h-1.5 w-1/3 rounded-full bg-on-surface/30"></i>
              <i className="block h-6 rounded-sm bg-surface"></i>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Board</span>
            <span className="block text-body-sm text-on-surface-variant">
              Fixed-width columns that scroll sideways; a card lifts while it's dragged.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#cards" className="text-primary underline underline-offset-3 hover:text-on-primary-container">cards</a>, <a href="/kit#chips" className="text-primary underline underline-offset-3 hover:text-on-primary-container">chips</a>, <a href="/kit#avatar" className="text-primary underline underline-offset-3 hover:text-on-primary-container">avatar</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="aspect-[16/10] overflow-hidden rounded-lg bg-surface p-1.5">
            <div className="columns-4 gap-1.5">
              <i className="mb-1.5 block h-12 rounded-md bg-primary-container"></i>
              <i className="mb-1.5 block h-7 rounded-md bg-tertiary-container"></i>
              <i className="mb-1.5 block h-9 rounded-md bg-surface-container-high"></i>
              <i className="mb-1.5 block h-6 rounded-md bg-secondary-container"></i>
              <i className="mb-1.5 block h-12 rounded-md bg-primary-fixed-dim"></i>
              <i className="mb-1.5 block h-8 rounded-md bg-surface-container-high"></i>
              <i className="mb-1.5 block h-10 rounded-md bg-tertiary-container"></i>
              <i className="mb-1.5 block h-7 rounded-md bg-primary-container"></i>
              <i className="mb-1.5 block h-12 rounded-md bg-secondary-container"></i>
              <i className="mb-1.5 block h-6 rounded-md bg-surface-container-high"></i>
              <i className="mb-1.5 block h-9 rounded-md bg-primary-container"></i>
              <i className="mb-1.5 block h-8 rounded-md bg-tertiary-container"></i>
            </div>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Gallery</span>
            <span className="block text-body-sm text-on-surface-variant">
              Masonry with CSS columns, two in compact and up to five on wide windows.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#aspect-ratio" className="text-primary underline underline-offset-3 hover:text-on-primary-container">aspect ratio</a>, <a href="/kit#carousel" className="text-primary underline underline-offset-3 hover:text-on-primary-container">carousel</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="grid aspect-[16/10] grid-cols-[1.5fr_1fr] gap-2 overflow-hidden rounded-lg bg-surface p-2">
            <span className="flex flex-col gap-1.5">
              <i className="block h-2 w-1/3 rounded-full bg-on-surface/30"></i>
              <span className="grid grid-cols-2 gap-1">
                <i className="block h-5 rounded-xs border border-outline"></i>
                <i className="block h-5 rounded-xs border border-outline"></i>
              </span>
              <i className="block h-5 rounded-xs border border-outline"></i>
              <span className="flex gap-1">
                <i className="block h-5 flex-1 rounded-md border-2 border-primary bg-primary/5"></i>
                <i className="block h-5 flex-1 rounded-md border border-outline-variant"></i>
              </span>
              <i className="block h-5 rounded-xs border border-outline"></i>
            </span>
            <span className="flex flex-col gap-1 rounded-lg bg-surface-container p-2">
              <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/30"></i>
              <span className="flex items-center gap-1">
                <i className="block size-4 rounded-sm bg-tertiary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1">
                <i className="block size-4 rounded-sm bg-primary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <i className="mt-auto block h-px bg-outline-variant"></i>
              <span className="flex justify-between">
                <i className="block h-2 w-1/4 rounded-full bg-on-surface/30"></i>
                <i className="block h-2 w-1/4 rounded-full bg-on-surface/30"></i>
              </span>
              <i className="block h-4 rounded-full bg-primary"></i>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Checkout</span>
            <span className="block text-body-sm text-on-surface-variant">
              Form at three fifths, order summary at two fifths; the summary moves on top in compact.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#text-fields" className="text-primary underline underline-offset-3 hover:text-on-primary-container">text fields</a>, <a href="/kit#radio" className="text-primary underline underline-offset-3 hover:text-on-primary-container">radio</a>, <a href="/kit#table" className="text-primary underline underline-offset-3 hover:text-on-primary-container">table</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] flex-col overflow-hidden rounded-lg bg-surface">
            <i className="block h-[30%] shrink-0 bg-tertiary-container"></i>
            <span className="flex items-end gap-2 px-3">
              <i className="-mt-5 block size-10 shrink-0 rounded-full bg-primary ring-2 ring-surface"></i>
              <span className="flex-1 space-y-1 pb-0.5">
                <i className="block h-2 w-1/3 rounded-full bg-on-surface/30"></i>
                <i className="block h-1.5 w-1/4 rounded-full bg-on-surface/15"></i>
              </span>
              <i className="mb-0.5 block h-3.5 w-10 rounded-full bg-primary"></i>
            </span>
            <span className="mt-2 flex items-end gap-3 border-b border-outline-variant px-3">
              <span className="flex flex-col items-center gap-1">
                <i className="block h-1.5 w-6 rounded-full bg-primary/70"></i>
                <i className="block h-0.5 w-6 rounded-t-full bg-primary"></i>
              </span>
              <i className="mb-1.5 block h-1.5 w-6 rounded-full bg-on-surface/20"></i>
              <i className="mb-1.5 block h-1.5 w-6 rounded-full bg-on-surface/20"></i>
            </span>
            <span className="grid flex-1 grid-cols-3 gap-1.5 p-2">
              <i className="block rounded-sm bg-surface-container"></i>
              <i className="block rounded-sm bg-surface-container"></i>
              <i className="block rounded-sm bg-surface-container"></i>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Profile</span>
            <span className="block text-body-sm text-on-surface-variant">
              Cover, an overlapping avatar, the primary action, then tabs over a content grid.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#avatar" className="text-primary underline underline-offset-3 hover:text-on-primary-container">avatar</a>, <a href="/kit#tabs" className="text-primary underline underline-offset-3 hover:text-on-primary-container">tabs</a>, <a href="/kit#cards" className="text-primary underline underline-offset-3 hover:text-on-primary-container">cards</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] flex-col items-center gap-1.5 overflow-hidden rounded-lg bg-surface p-2">
            <i className="block h-2.5 w-1/3 shrink-0 rounded-full bg-on-surface/30"></i>
            <span className="flex shrink-0 gap-0.5 rounded-full bg-surface-container-high p-0.5">
              <i className="block h-2.5 w-6 rounded-full bg-surface"></i>
              <i className="block h-2.5 w-6 rounded-full"></i>
            </span>
            <span className="grid min-h-0 w-full flex-1 grid-cols-3 gap-1.5">
              <span className="my-2 flex flex-col gap-1 rounded-lg bg-surface-container p-1.5">
                <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/25"></i>
                <i className="block h-3 w-2/3 rounded-full bg-on-surface/30"></i>
                <i className="block h-1 w-full rounded-full bg-on-surface/10"></i>
                <i className="block h-1 w-4/5 rounded-full bg-on-surface/10"></i>
                <i className="mt-auto block h-3 rounded-full border border-outline"></i>
              </span>
              <span className="flex flex-col gap-1 rounded-lg bg-primary p-1.5">
                <i className="block h-1.5 w-1/2 rounded-full bg-on-primary/60"></i>
                <i className="block h-3 w-2/3 rounded-full bg-on-primary/80"></i>
                <i className="block h-1 w-full rounded-full bg-on-primary/30"></i>
                <i className="block h-1 w-4/5 rounded-full bg-on-primary/30"></i>
                <i className="block h-1 w-full rounded-full bg-on-primary/30"></i>
                <i className="mt-auto block h-3 rounded-full bg-on-primary"></i>
              </span>
              <span className="my-2 flex flex-col gap-1 rounded-lg bg-surface-container p-1.5">
                <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/25"></i>
                <i className="block h-3 w-2/3 rounded-full bg-on-surface/30"></i>
                <i className="block h-1 w-full rounded-full bg-on-surface/10"></i>
                <i className="block h-1 w-4/5 rounded-full bg-on-surface/10"></i>
                <i className="mt-auto block h-3 rounded-full border border-outline"></i>
              </span>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Pricing</span>
            <span className="block text-body-sm text-on-surface-variant">
              A monthly/yearly toggle and three tiers, the recommended one filled.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#button-groups" className="text-primary underline underline-offset-3 hover:text-on-primary-container">button groups</a>, <a href="/kit#cards" className="text-primary underline underline-offset-3 hover:text-on-primary-container">cards</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] justify-center gap-3 overflow-hidden rounded-lg bg-surface p-2">
            <span className="flex w-[55%] flex-col gap-1">
              <i className="block h-1.5 w-1/4 rounded-full bg-primary/60"></i>
              <i className="block h-3 w-full rounded-full bg-on-surface/30"></i>
              <i className="block h-3 w-3/4 rounded-full bg-on-surface/30"></i>
              <span className="flex items-center gap-1 py-0.5">
                <i className="block size-3 rounded-full bg-tertiary-container"></i>
                <i className="block h-1.5 w-1/3 rounded-full bg-on-surface/15"></i>
              </span>
              <i className="block h-10 shrink-0 rounded-md bg-secondary-container"></i>
              <i className="block h-1.5 w-full rounded-full bg-on-surface/10"></i>
              <i className="block h-1.5 w-11/12 rounded-full bg-on-surface/10"></i>
              <i className="block h-1.5 w-full rounded-full bg-on-surface/10"></i>
            </span>
            <span className="flex w-[22%] flex-col gap-1 pt-6">
              <i className="block h-1.5 w-2/3 rounded-full bg-on-surface/25"></i>
              <i className="block h-6 rounded-sm bg-surface-container"></i>
              <i className="block h-6 rounded-sm bg-surface-container"></i>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Article</span>
            <span className="block text-body-sm text-on-surface-variant">
              A 65-character measure, a metadata row, media, and related links in an aside.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#typography" className="text-primary underline underline-offset-3 hover:text-on-primary-container">typography</a>, <a href="/kit#avatar" className="text-primary underline underline-offset-3 hover:text-on-primary-container">avatar</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="grid aspect-[16/10] place-items-center overflow-hidden rounded-lg bg-surface-container p-2">
            <span className="flex w-[62%] flex-col gap-1.5 rounded-lg bg-surface p-2.5 shadow-1">
              <span className="flex gap-0.5">
                <i className="block h-1 w-1/3 rounded-full bg-primary"></i>
                <i className="block h-1 flex-1 rounded-full bg-secondary-container"></i>
              </span>
              <i className="mt-1 block h-2.5 w-3/4 rounded-full bg-on-surface/30"></i>
              <i className="block h-4 rounded-md border border-outline-variant"></i>
              <i className="block h-4 rounded-md bg-secondary-container"></i>
              <i className="block h-4 rounded-md border border-outline-variant"></i>
              <span className="mt-1 flex justify-between">
                <i className="block h-3 w-8 rounded-full bg-on-surface/10"></i>
                <i className="block h-3 w-10 rounded-full bg-primary"></i>
              </span>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Onboarding</span>
            <span className="block text-body-sm text-on-surface-variant">
              One question per step in a centred card, with progress and back/next.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#questionnaire" className="text-primary underline underline-offset-3 hover:text-on-primary-container">questionnaire</a>, <a href="/kit#progress" className="text-primary underline underline-offset-3 hover:text-on-primary-container">progress</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] gap-1.5 overflow-hidden rounded-lg bg-surface-container p-1.5">
            <span className="flex w-[32%] flex-col gap-1 rounded-md bg-surface p-1.5">
              <i className="block h-3 shrink-0 rounded-full bg-surface-container-high"></i>
              <span className="flex items-center gap-1 rounded-sm bg-secondary-container p-1">
                <i className="block size-3 shrink-0 rounded-full bg-primary"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-secondary-container/25"></i>
              </span>
              <span className="flex items-center gap-1 p-1">
                <i className="block size-3 shrink-0 rounded-full bg-tertiary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
              <span className="flex items-center gap-1 p-1">
                <i className="block size-3 shrink-0 rounded-full bg-primary-container"></i>
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
              </span>
            </span>
            <span className="flex flex-1 flex-col gap-1 rounded-md bg-surface p-1.5">
              <i className="block h-4 w-3/5 rounded-[8px_8px_8px_2px] bg-surface-container-high"></i>
              <i className="block h-4 w-1/2 self-end rounded-[8px_8px_2px_8px] bg-primary"></i>
              <i className="block h-6 w-2/3 rounded-[8px_8px_8px_2px] bg-surface-container-high"></i>
              <i className="block h-4 w-2/5 self-end rounded-[8px_8px_2px_8px] bg-primary"></i>
              <span className="mt-auto flex items-center gap-1 rounded-full bg-surface-container-high p-0.5 pl-2">
                <i className="block h-1.5 flex-1 rounded-full bg-on-surface/15"></i>
                <i className="block size-3.5 rounded-full bg-primary"></i>
              </span>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Chat</span>
            <span className="block text-body-sm text-on-surface-variant">
              Conversations beside the open thread; only the thread shows in compact.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#message" className="text-primary underline underline-offset-3 hover:text-on-primary-container">message</a>, <a href="/kit#message-scroller" className="text-primary underline underline-offset-3 hover:text-on-primary-container">message scroller</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] flex-col gap-1 overflow-hidden rounded-lg bg-surface p-2">
            <span className="flex shrink-0 items-center gap-1.5">
              <i className="block h-2 w-1/4 rounded-full bg-on-surface/30"></i>
              <span className="ml-auto flex gap-0.5">
                <i className="block h-3 w-5 rounded-l-full rounded-r-xs bg-surface-container"></i>
                <i className="block h-3 w-5 rounded-full bg-primary"></i>
                <i className="block h-3 w-5 rounded-l-xs rounded-r-full bg-surface-container"></i>
              </span>
            </span>
            <span className="relative grid flex-1 grid-cols-5 gap-px overflow-hidden rounded-md bg-outline-variant">
              <i className="block bg-surface"></i>
              <i className="block bg-surface"></i>
              <i className="block bg-surface"></i>
              <i className="block bg-surface"></i>
              <i className="block bg-surface"></i>
              <i className="absolute left-[2%] top-[12%] block h-[26%] w-[16%] rounded-sm bg-primary-container"></i>
              <i className="absolute left-[22%] top-[42%] block h-[34%] w-[16%] rounded-sm bg-tertiary-container"></i>
              <i className="absolute left-[42%] top-[8%] block h-[18%] w-[16%] rounded-sm bg-secondary-container"></i>
              <i className="absolute left-[62%] top-[30%] block h-[40%] w-[16%] rounded-sm bg-primary"></i>
              <i className="absolute left-[82%] top-[58%] block h-[22%] w-[16%] rounded-sm bg-error-container"></i>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Scheduler</span>
            <span className="block text-body-sm text-on-surface-variant">
              A week grid with event blocks and a connected day/week/month switch.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#calendar" className="text-primary underline underline-offset-3 hover:text-on-primary-container">calendar</a>, <a href="/kit#button-groups" className="text-primary underline underline-offset-3 hover:text-on-primary-container">button groups</a>
            </span>
          </figcaption>
        </figure>{" "}
        <figure className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-surface p-2">
            <span className="relative grid size-14 place-items-center">
              <Shape
                className="absolute inset-0 size-14 text-tertiary-container"
                shape="puffy"
                cycle={["puffy", "cookie9", "clover4"]}
                interval={2600}
              />
              <Icon className="relative text-on-tertiary-container">explore_off</Icon>
            </span>
            <i className="mt-1 block h-2.5 w-1/3 rounded-full bg-on-surface/30"></i>
            <i className="block h-1.5 w-1/2 rounded-full bg-on-surface/15"></i>
            <span className="mt-1 flex gap-1">
              <i className="block h-3.5 w-10 rounded-full bg-primary"></i>
              <i className="block h-3.5 w-8 rounded-full bg-on-surface/10"></i>
            </span>
          </div>
          <figcaption className="space-y-1 px-1">
            <span className="block text-title-md">Not found</span>
            <span className="block text-body-sm text-on-surface-variant">
              An expressive shape, one sentence, and a primary and secondary way out.
            </span>
            <span className="block text-body-sm text-on-surface-variant">
              Uses <a href="/kit#empty" className="text-primary underline underline-offset-3 hover:text-on-primary-container">empty state</a>, <a href="/kit#buttons" className="text-primary underline underline-offset-3 hover:text-on-primary-container">buttons</a>
            </span>
          </figcaption>
        </figure>{" "}
      </div>{" "}
    </section>
  )
}

export function GridSection() {
  return (
    <section id="grid" className="mt-20 scroll-mt-24" data-toc>
      {" "}
      <h2 className="text-headline-lg font-semibold">Grid: columns and bento</h2>{" "}
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
        Inside a pane, place content on a 12-column grid with 24dp gutters (16dp in compact), or build a bento from column and row spans.
      </p>{" "}
      <div className="mt-6 grid gap-8 rounded-xl bg-surface-container-low p-6 md:p-8 2xl:grid-cols-2">
        {" "}
        <div className="space-y-2 font-mono text-label-sm">
          {" "}
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-12 rounded-sm bg-primary-container py-2.5 text-center text-on-primary-container">col-span-12</span>
          </div>{" "}
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-6 rounded-sm bg-secondary-container py-2.5 text-center text-on-secondary-container">6</span>
            <span className="col-span-6 rounded-sm bg-secondary-container py-2.5 text-center text-on-secondary-container">6</span>
          </div>{" "}
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-4 rounded-sm bg-tertiary-container py-2.5 text-center text-on-tertiary-container">4</span>
            <span className="col-span-4 rounded-sm bg-tertiary-container py-2.5 text-center text-on-tertiary-container">4</span>
            <span className="col-span-4 rounded-sm bg-tertiary-container py-2.5 text-center text-on-tertiary-container">4</span>
          </div>{" "}
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-3 rounded-sm bg-primary-container py-2.5 text-center text-on-primary-container">3</span>
            <span className="col-span-3 rounded-sm bg-primary-container py-2.5 text-center text-on-primary-container">3</span>
            <span className="col-span-3 rounded-sm bg-primary-container py-2.5 text-center text-on-primary-container">3</span>
            <span className="col-span-3 rounded-sm bg-primary-container py-2.5 text-center text-on-primary-container">3</span>
          </div>{" "}
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-8 rounded-sm bg-secondary-container py-2.5 text-center text-on-secondary-container">8 · main</span>
            <span className="col-span-4 rounded-sm bg-surface-container-highest py-2.5 text-center text-on-surface">4 · aside</span>
          </div>{" "}
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-3 rounded-sm bg-surface-container-highest py-2.5 text-center text-on-surface">3 · nav</span>
            <span className="col-span-9 rounded-sm bg-tertiary-container py-2.5 text-center text-on-tertiary-container">9 · content</span>
          </div>{" "}
          <div className="grid grid-cols-12 gap-2">
            <span className="col-span-2 rounded-sm bg-primary-fixed-dim py-2.5 text-center text-on-primary-fixed">2</span>
            <span className="col-span-2 rounded-sm bg-primary-fixed-dim py-2.5 text-center text-on-primary-fixed">2</span>
            <span className="col-span-2 rounded-sm bg-primary-fixed-dim py-2.5 text-center text-on-primary-fixed">2</span>
            <span className="col-span-2 rounded-sm bg-primary-fixed-dim py-2.5 text-center text-on-primary-fixed">2</span>
            <span className="col-span-2 rounded-sm bg-primary-fixed-dim py-2.5 text-center text-on-primary-fixed">2</span>
            <span className="col-span-2 rounded-sm bg-primary-fixed-dim py-2.5 text-center text-on-primary-fixed">2</span>
          </div>{" "}
        </div>{" "}
        <div className="grid auto-rows-[96px] grid-cols-4 gap-3">
          {" "}
          <div className="col-span-2 row-span-2 flex flex-col justify-between rounded-xl bg-primary p-5 text-on-primary">
            <Icon size={32}>rocket_launch</Icon>
            <div>
              <div className="text-headline-sm font-medium tabular-nums">1,284 deploys</div>
              <div className="font-mono text-body-sm opacity-80">col-span-2 row-span-2</div>
            </div>
          </div>{" "}
          <div className="col-span-2 flex items-center gap-4 rounded-xl bg-secondary-container p-4 text-on-secondary-container">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface/60">
              <Icon>shield</Icon>
            </span>
            <div className="min-w-0">
              <div className="text-title-md">0 policy violations</div>
              <div className="font-mono text-body-sm opacity-80">col-span-2</div>
            </div>
          </div>{" "}
          <div className="grid place-items-center rounded-xl bg-tertiary-container text-on-tertiary-container">
            <Shape className="size-14" shape="clover4" cycle={["clover4", "cookie9", "sunny"]} interval={2800} />
          </div>{" "}
          <div className="flex flex-col justify-end rounded-xl bg-surface-container-highest p-4">
            <div className="text-title-lg font-medium tabular-nums">12/12</div>
            <div className="text-body-sm text-on-surface-variant">regions</div>
          </div>{" "}
          <div className="col-span-3 flex items-end gap-1.5 rounded-xl bg-surface p-4">
            <i className="block h-[35%] flex-1 rounded-t-xs bg-primary/30"></i>
            <i className="block h-[55%] flex-1 rounded-t-xs bg-primary/30"></i>
            <i className="block h-[45%] flex-1 rounded-t-xs bg-primary/30"></i>
            <i className="block h-[70%] flex-1 rounded-t-xs bg-primary/30"></i>
            <i className="block h-[60%] flex-1 rounded-t-xs bg-primary/30"></i>
            <i className="block h-[85%] flex-1 rounded-t-xs bg-primary/30"></i>
            <i className="block h-full flex-1 rounded-t-xs bg-primary"></i>
          </div>{" "}
          <div className="grid place-items-center rounded-xl bg-primary-fixed-dim text-on-primary-fixed">
            <Icon size={32}>bolt</Icon>
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </section>
  )
}
