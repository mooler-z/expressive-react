"use client"

import * as React from "react"
import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

/*
 * Resizable panes (react-resizable-panels) with the M3 pane drag handle
 * (androidx DragHandleTokens): 24dp container · 4×48 outline pill, full corners →
 * pressed/dragged 12×52 on-surface with 12dp corners, morphing on the FastSpatial spring.
 * Keyboard: focus a handle and use the arrow keys; Home/End collapse to min/max.
 */

function ResizablePanelGroup({ className, ...props }: React.ComponentProps<typeof Group>) {
  return <Group data-slot="resizable-panel-group" className={cn("size-full", className)} {...props} />
}

function ResizablePanel({ className, ...props }: React.ComponentProps<typeof Panel>) {
  return <Panel data-slot="resizable-panel" className={cn("min-h-0 min-w-0", className)} {...props} />
}

export interface ResizableHandleProps extends React.ComponentProps<typeof Separator> {
  /**
   * `handle` (default): M3 24dp container with the morphing pill.
   * `bar`: a 12dp tonal bar with a short pill (the kit's compact style).
   * `line`: a 1px divider with a wide invisible hit area.
   */
  variant?: "handle" | "bar" | "line"
}

/**
 * Separator between panels. Orientation follows the group: in a horizontal group it's a vertical
 * bar you drag left/right. Styled through react-resizable-panels' `data-separator`
 * (inactive · hover · active · focus · disabled) and `aria-orientation`.
 */
function ResizableHandle({ className, variant = "handle", ...props }: ResizableHandleProps) {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "group/handle relative flex shrink-0 items-center justify-center outline-none",
        // vertical separator (horizontal group)
        "aria-[orientation=vertical]:cursor-col-resize",
        // horizontal separator (vertical group)
        "aria-[orientation=horizontal]:cursor-row-resize",
        variant === "handle" && "aria-[orientation=horizontal]:h-6 aria-[orientation=vertical]:w-6",
        variant === "bar" && [
          "bg-surface-container transition-colors duration-150",
          "aria-[orientation=horizontal]:h-3 aria-[orientation=vertical]:w-3",
          "data-[separator=active]:bg-primary/20 data-[separator=hover]:bg-primary/20",
        ],
        variant === "line" && [
          "bg-outline-variant",
          "aria-[orientation=horizontal]:h-px aria-[orientation=vertical]:w-px",
          "after:absolute after:inset-x-0 after:-inset-y-1.5 aria-[orientation=vertical]:after:-inset-x-1.5 aria-[orientation=vertical]:after:inset-y-0",
          "data-[separator=active]:bg-primary data-[separator=hover]:bg-primary",
        ],
        "data-[separator=focus]:outline-3 data-[separator=focus]:-outline-offset-3 data-[separator=focus]:outline-secondary",
        className,
      )}
      {...props}
    >
      {variant !== "line" && (
        <span
          aria-hidden
          className={cn(
            "rounded-full",
            "transition-[width,height,border-radius,background-color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
            variant === "handle"
              ? [
                  "bg-outline group-data-[separator=hover]/handle:bg-on-surface-variant",
                  "group-aria-[orientation=vertical]/handle:h-12 group-aria-[orientation=vertical]/handle:w-1",
                  "group-aria-[orientation=horizontal]/handle:h-1 group-aria-[orientation=horizontal]/handle:w-12",
                  "group-data-[separator=active]/handle:rounded-[12px] group-data-[separator=active]/handle:bg-on-surface",
                  "group-aria-[orientation=vertical]/handle:group-data-[separator=active]/handle:h-[52px] group-aria-[orientation=vertical]/handle:group-data-[separator=active]/handle:w-3",
                  "group-aria-[orientation=horizontal]/handle:group-data-[separator=active]/handle:h-3 group-aria-[orientation=horizontal]/handle:group-data-[separator=active]/handle:w-[52px]",
                ]
              : [
                  "bg-outline",
                  "group-aria-[orientation=vertical]/handle:h-8 group-aria-[orientation=vertical]/handle:w-1",
                  "group-aria-[orientation=horizontal]/handle:h-1 group-aria-[orientation=horizontal]/handle:w-8",
                ],
          )}
        />
      )}
    </Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
