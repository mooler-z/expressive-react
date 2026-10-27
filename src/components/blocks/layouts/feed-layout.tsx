"use client"

import type * as React from "react"

import type { WindowSizeClass } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"

import { useLayoutWindowSize } from "./window-size"

/*
 * Feed · M3 canonical layout. A grid of equal-weight cards that reflows as the window grows.
 *   compact 1 column · medium 2 · expanded 3 · large and up 4 — 24dp gutters (16dp compact)
 * One item can span two columns with <FeedItem span={2}>.
 */

const COLUMNS: Record<WindowSizeClass, number> = { compact: 1, medium: 2, expanded: 3, large: 4, "extra-large": 4 }

function FeedLayout({ windowSize, className, children }: { windowSize?: WindowSizeClass; className?: string; children: React.ReactNode }) {
  const size = useLayoutWindowSize(windowSize)
  return (
    <div
      data-slot="feed-layout"
      data-size={size}
      className={cn("grid content-start", size === "compact" ? "gap-4 p-4" : "gap-6 p-6", className)}
      style={{ gridTemplateColumns: `repeat(${COLUMNS[size]}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  )
}

function FeedItem({ span = 1, className, children }: { span?: 1 | 2; className?: string; children: React.ReactNode }) {
  return (
    <div data-slot="feed-item" className={cn("min-w-0", span === 2 && "col-span-2 max-[599px]:col-span-1", className)}>
      {children}
    </div>
  )
}

export { FeedItem, FeedLayout }
