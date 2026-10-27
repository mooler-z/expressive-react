"use client"

import type * as React from "react"

import type { WindowSizeClass } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"

import { isSinglePane, useLayoutWindowSize } from "./window-size"

/*
 * Supporting pane · M3 canonical layout.
 *   compact / medium  supporting content moves below the main pane (or into a bottom sheet)
 *   expanded and up   main pane flexible, supporting pane about one third, 24dp spacer
 * Use for docs with comments, editors, video with chat.
 */

export interface SupportingPaneLayoutProps {
  main: React.ReactNode
  supporting: React.ReactNode
  /** Supporting pane share of the width when side by side. */
  supportingFraction?: number
  windowSize?: WindowSizeClass
  className?: string
}

function SupportingPaneLayout({ main, supporting, supportingFraction = 1 / 3, windowSize, className }: SupportingPaneLayoutProps) {
  const size = useLayoutWindowSize(windowSize)
  const stacked = isSinglePane(size)
  const compact = size === "compact"
  return (
    <div
      data-slot="supporting-pane-layout"
      data-size={size}
      className={cn("flex min-h-0 flex-1", stacked ? "flex-col overflow-y-auto" : "gap-6", compact ? "gap-4 p-4" : "gap-6 p-6", className)}
    >
      <section aria-label="Main" className={cn("flex min-w-0 flex-col overflow-hidden rounded-xl bg-surface", stacked ? "shrink-0" : "flex-1")}>
        {main}
      </section>
      <aside
        aria-label="Supporting"
        className="flex min-w-0 shrink-0 flex-col overflow-hidden rounded-xl bg-surface"
        style={stacked ? undefined : { width: `${supportingFraction * 100}%` }}
      >
        {supporting}
      </aside>
    </div>
  )
}

export { SupportingPaneLayout }
