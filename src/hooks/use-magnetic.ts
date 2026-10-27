"use client"

import * as React from "react"

import { prefersReducedMotion, springTiming } from "@/hooks/use-motion"

/**
 * Magnetic hover: the element drifts toward the pointer while it's inside,
 * then springs home on leave. `strength` is the fraction of the pointer offset to follow.
 * Animates the independent `translate` property.
 */
export function useMagnetic<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { strength = 0.35, disabled = false }: { strength?: number; disabled?: boolean } = {},
) {
  React.useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    let anim: Animation | null = null
    // Measure the resting box once per hover so the drift doesn't feed back into itself
    let rest: DOMRect | null = null

    const go = (x: number, y: number, easing: string, duration: number) => {
      const from = getComputedStyle(el).translate
      anim?.cancel()
      anim = el.animate([{ translate: from === "none" ? "0px 0px" : from }, { translate: `${x}px ${y}px` }], {
        duration,
        easing,
        fill: "forwards",
      })
    }
    const enter = () => {
      const r = el.getBoundingClientRect()
      const t = getComputedStyle(el).translate.split(" ").map(parseFloat)
      rest = new DOMRect(r.x - (t[0] || 0), r.y - (t[1] || 0), r.width, r.height)
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || prefersReducedMotion()) return
      if (!rest) enter()
      const r = rest!
      go((e.clientX - (r.left + r.width / 2)) * strength, (e.clientY - (r.top + r.height / 2)) * strength, "cubic-bezier(0.2, 0, 0, 1)", 300)
    }
    const leave = () => {
      rest = null
      const { easing, duration } = springTiming("slow-spatial")
      go(0, 0, easing, duration)
    }

    el.addEventListener("pointerenter", enter)
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointerenter", enter)
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
      anim?.cancel()
    }
  }, [ref, strength, disabled])
}
