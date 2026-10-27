"use client"

import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { useDragScroll } from "@/hooks/use-drag-scroll"
import { cn } from "@/lib/utils"

/*
 * Scroll area
 * Native scrolling with thin themed scrollbars (outline thumb, transparent track), optional edge
 * fades that appear only on the sides with more content, optional prev/next buttons and mouse
 * drag-to-scroll. No custom scrollbar emulation: keyboard, wheel, touch and a11y stay native.
 */

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal" | "both"
  /** Fade the edges that have more content. `true` = 40px, or pass a length in px. */
  fade?: boolean | number
  /** Horizontal only: floating prev/next buttons that scroll by 80% of the viewport. */
  scrollButtons?: boolean
  /** Drag with the mouse to scroll (touch/trackpad already do). */
  dragScroll?: boolean
  /** Hide the scrollbar entirely (content still scrolls). */
  hideScrollbar?: boolean
  viewportClassName?: string
  viewportRef?: React.Ref<HTMLDivElement>
}

const SCROLLBAR =
  "[scrollbar-width:thin] [scrollbar-color:var(--md-outline)_transparent] [&::-webkit-scrollbar]:size-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-outline [&::-webkit-scrollbar-track]:bg-transparent"

function ScrollArea({
  className,
  orientation = "vertical",
  fade = false,
  scrollButtons = false,
  dragScroll = false,
  hideScrollbar = false,
  viewportClassName,
  viewportRef,
  children,
  ...props
}: ScrollAreaProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(viewportRef, () => ref.current as HTMLDivElement)
  const horizontal = orientation === "horizontal"
  const [edges, setEdges] = React.useState({ start: false, end: false, top: false, bottom: false })

  const measure = React.useCallback(() => {
    const el = ref.current
    if (!el) return
    const maxX = el.scrollWidth - el.clientWidth
    const maxY = el.scrollHeight - el.clientHeight
    const x = Math.abs(el.scrollLeft) // RTL scrollLeft is ≤ 0
    const next = { start: x > 1, end: x < maxX - 1, top: el.scrollTop > 1, bottom: el.scrollTop < maxY - 1 }
    setEdges((prev) =>
      prev.start === next.start && prev.end === next.end && prev.top === next.top && prev.bottom === next.bottom ? prev : next,
    )
  }, [])

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    for (const c of Array.from(el.children)) ro.observe(c)
    el.addEventListener("scroll", measure, { passive: true })
    return () => {
      ro.disconnect()
      el.removeEventListener("scroll", measure)
    }
  }, [measure])

  useDragScroll(ref, { axis: orientation === "both" ? "both" : horizontal ? "x" : "y", disabled: !dragScroll })

  const f = fade === true ? 40 : fade || 0
  const mask = f
    ? horizontal
      ? `linear-gradient(to right, transparent, black ${edges.start ? f : 0}px, black calc(100% - ${edges.end ? f : 0}px), transparent)`
      : orientation === "vertical"
        ? `linear-gradient(to bottom, transparent, black ${edges.top ? f : 0}px, black calc(100% - ${edges.bottom ? f : 0}px), transparent)`
        : undefined
    : undefined

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const rtl = getComputedStyle(el).direction === "rtl"
    el.scrollBy({
      left: dir * (rtl ? -1 : 1) * el.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    })
  }

  return (
    <div data-slot="scroll-area" className={cn("relative min-h-0 min-w-0", className)} {...props}>
      <div
        ref={ref}
        data-slot="scroll-area-viewport"
        tabIndex={0}
        className={cn(
          "relative size-full rounded-[inherit] outline-none focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-secondary",
          orientation === "vertical" && "overflow-y-auto overscroll-y-contain",
          horizontal && "overflow-x-auto overscroll-x-contain",
          orientation === "both" && "overflow-auto",
          hideScrollbar ? "no-scrollbar" : SCROLLBAR,
          dragScroll && "cursor-grab data-dragging:cursor-grabbing data-dragging:select-none",
          viewportClassName,
        )}
        style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
      >
        {children}
      </div>
      {scrollButtons && horizontal && (
        <>
          <ScrollButton dir={-1} visible={edges.start} onPress={() => scrollBy(-1)} />
          <ScrollButton dir={1} visible={edges.end} onPress={() => scrollBy(1)} />
        </>
      )}
    </div>
  )
}

function ScrollButton({ dir, visible, onPress }: { dir: 1 | -1; visible: boolean; onPress: () => void }) {
  return (
    <IconButton
      aria-label={dir < 0 ? "Scroll back" : "Scroll forward"}
      size="xs"
      onPress={onPress}
      excludeFromTabOrder
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2 bg-surface-container-high text-on-surface-variant shadow-1",
        "transition-[opacity,scale] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
        dir < 0 ? "start-0" : "end-0",
        visible ? "opacity-100" : "pointer-events-none scale-75 opacity-0",
      )}
    >
      <Icon className="rtl:-scale-x-100">{dir < 0 ? "chevron_left" : "chevron_right"}</Icon>
    </IconButton>
  )
}

export { ScrollArea }
