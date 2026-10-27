"use client"

import * as React from "react"

import { prefersReducedMotion, springTiming } from "@/hooks/use-motion"

/**
 * Perspective tilt toward the pointer, spring reset on leave.
 * `max` is the tilt in degrees at the element's edge. Animates `transform`.
 */
export function useTilt<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { max = 8, perspective = 900, disabled = false }: { max?: number; perspective?: number; disabled?: boolean } = {},
) {
  React.useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    let anim: Animation | null = null

    const go = (rx: number, ry: number, easing: string, duration: number) => {
      const from = getComputedStyle(el).transform
      anim?.cancel()
      anim = el.animate(
        [
          { transform: from === "none" ? `perspective(${perspective}px)` : from },
          { transform: `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg)` },
        ],
        { duration, easing, fill: "forwards" },
      )
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || prefersReducedMotion()) return
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      go(-py * max * 2, px * max * 2, "cubic-bezier(0.2, 0, 0, 1)", 400)
    }
    const leave = () => {
      const { easing, duration } = springTiming("slow-spatial")
      go(0, 0, easing, duration)
    }

    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
      anim?.cancel()
    }
  }, [ref, max, perspective, disabled])
}
