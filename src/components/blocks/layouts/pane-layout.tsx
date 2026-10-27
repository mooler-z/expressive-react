"use client"

import type * as React from "react"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import type { WindowSizeClass } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"

import { useLayoutWindowSize } from "./window-size"

/*
 * Fixed + flexible panes · the building blocks of every layout.
 *   fixed pane     360dp by default; holds lists, navigation or filters
 *   flexible pane  takes the remaining width; its content reflows
 *   spacer         24dp between panes, doubling as the drag target (4×48dp pill that grows on press)
 * Compact windows show one pane at a time: the panes stack.
 */

export interface FixedFlexiblePanesProps {
  fixed: React.ReactNode
  flexible: React.ReactNode
  /** Initial fixed-pane size, e.g. "360px" or "35%". */
  defaultFixedSize?: string
  minFixedSize?: string
  maxFixedSize?: string
  windowSize?: WindowSizeClass
  className?: string
}

function FixedFlexiblePanes({
  fixed,
  flexible,
  defaultFixedSize = "360px",
  minFixedSize = "240px",
  maxFixedSize = "60%",
  windowSize,
  className,
}: FixedFlexiblePanesProps) {
  const size = useLayoutWindowSize(windowSize)
  if (size === "compact")
    return (
      <div data-slot="pane-layout" className={cn("flex flex-col gap-4", className)}>
        <section className="min-w-0 rounded-xl bg-surface">{fixed}</section>
        <section className="min-w-0 rounded-xl bg-surface">{flexible}</section>
      </div>
    )
  return (
    <ResizablePanelGroup data-slot="pane-layout" orientation="horizontal" className={className}>
      <ResizablePanel defaultSize={defaultFixedSize} minSize={minFixedSize} maxSize={maxFixedSize} className="rounded-xl bg-surface">
        {fixed}
      </ResizablePanel>
      <ResizableHandle aria-label="Resize panes" />
      <ResizablePanel className="rounded-xl bg-surface">{flexible}</ResizablePanel>
    </ResizablePanelGroup>
  )
}

export { FixedFlexiblePanes }
