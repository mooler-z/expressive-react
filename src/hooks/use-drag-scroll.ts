"use client"

import * as React from "react"

export interface DragScrollOptions {
  /** Axis the mouse drag scrolls. */
  axis?: "x" | "y" | "both"
  disabled?: boolean
  /**
   * Scroll positions to settle on after a drag (px along `axis`). Defaults to the
   * direct children that declare `scroll-snap-align`. Return [] to skip settling.
   */
  snapTargets?: (el: HTMLElement) => number[]
}

/**
 * Mouse drag-to-scroll for overflow containers. Touch and trackpads already scroll natively,
 * so only `pointerType === "mouse"` is handled. Scroll-snap is suspended while dragging, then the
 * container glides to the nearest snap target (projected with release velocity). A click that ends
 * a drag is swallowed so items under the cursor don't activate. Sets `data-dragging` while dragging.
 */
export function useDragScroll<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { axis = "x", disabled = false, snapTargets }: DragScrollOptions = {},
) {
  const targetsRef = React.useRef(snapTargets)
  targetsRef.current = snapTargets

  React.useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    const vertical = axis === "y"
    let pointerId = -1
    let dragging = false
    let moved = false
    let start = { x: 0, y: 0, left: 0, top: 0 }
    let samples: { t: number; v: number }[] = []

    const pos = () => (vertical ? el.scrollTop : el.scrollLeft)

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable], [data-no-drag]")) return
      dragging = true
      moved = false
      pointerId = e.pointerId
      start = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop }
      samples = [{ t: e.timeStamp, v: pos() }]
    }

    const move = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      if (!moved) {
        if (Math.hypot(dx, dy) < 4) return
        moved = true
        el.setPointerCapture(pointerId)
        el.style.scrollSnapType = "none"
        el.style.scrollBehavior = "auto"
        el.dataset.dragging = ""
      }
      if (axis !== "y") el.scrollLeft = start.left - dx
      if (axis !== "x") el.scrollTop = start.top - dy
      samples.push({ t: e.timeStamp, v: pos() })
      if (samples.length > 6) samples.shift()
    }

    const settle = () => {
      const list = targetsRef.current ? targetsRef.current(el) : defaultTargets(el, vertical)
      el.style.scrollBehavior = ""
      if (!list.length) {
        el.style.scrollSnapType = ""
        return
      }
      const first = samples[0]
      const last = samples[samples.length - 1]
      const velocity = last.t > first.t ? (last.v - first.v) / (last.t - first.t) : 0 // px/ms
      const projected = pos() + velocity * 160
      const to = list.reduce((best, x) => (Math.abs(x - projected) < Math.abs(best - projected) ? x : best), list[0])
      el.scrollTo({ [vertical ? "top" : "left"]: to, behavior: "smooth" })
      const restore = () => {
        el.style.scrollSnapType = ""
        el.removeEventListener("scrollend", restore)
        clearTimeout(timer)
      }
      const timer = setTimeout(restore, 700)
      el.addEventListener("scrollend", restore)
    }

    const up = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return
      dragging = false
      if (!moved) return
      delete el.dataset.dragging
      if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId)
      const block = (ev: MouseEvent) => {
        ev.stopPropagation()
        ev.preventDefault()
      }
      el.addEventListener("click", block, { capture: true, once: true })
      setTimeout(() => el.removeEventListener("click", block, { capture: true }), 0)
      settle()
    }

    el.addEventListener("pointerdown", down)
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerup", up)
    el.addEventListener("pointercancel", up)
    return () => {
      el.removeEventListener("pointerdown", down)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerup", up)
      el.removeEventListener("pointercancel", up)
    }
  }, [ref, axis, disabled])
}

function defaultTargets(el: HTMLElement, vertical: boolean): number[] {
  // Measured from rects so it holds in RTL, where scrollLeft runs from 0 down to -max.
  const cs = getComputedStyle(el)
  const rtl = !vertical && cs.direction === "rtl"
  const pad = parseFloat(vertical ? cs.scrollPaddingTop : rtl ? cs.scrollPaddingRight : cs.scrollPaddingLeft) || 0
  const max = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth
  const [lo, hi] = rtl ? [-max, 0] : [0, max]
  const box = el.getBoundingClientRect()
  const now = vertical ? el.scrollTop : el.scrollLeft
  const out: number[] = []
  for (const child of Array.from(el.children) as HTMLElement[]) {
    const align = getComputedStyle(child).scrollSnapAlign.split(" ").pop()
    if (!align || align === "none") continue
    const r = child.getBoundingClientRect()
    // Physical edges along the axis, with "start" meaning inline-start
    const [cStart, cEnd, bStart, bEnd] = vertical
      ? [r.top, r.bottom, box.top, box.bottom]
      : rtl
        ? [-r.right, -r.left, -box.right, -box.left]
        : [r.left, r.right, box.left, box.right]
    const delta =
      align === "center" ? (cStart + cEnd) / 2 - (bStart + bEnd) / 2 : align === "end" ? cEnd - bEnd : cStart - bStart - pad
    out.push(Math.max(lo, Math.min(hi, now + (rtl ? -delta : delta))))
  }
  return out
}
