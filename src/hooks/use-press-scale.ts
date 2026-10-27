"use client"

import * as React from "react"

import { prefersReducedMotion, springTiming } from "@/hooks/use-motion"

/**
 * Elastic press: squish to `scale` on pointer down, spring back on release.
 * Animates the independent `scale` property, so it composes with `translate`
 * (useMagnetic) and `transform` (useTilt) on the same element.
 *
 *   const ref = React.useRef<HTMLButtonElement>(null)
 *   usePressScale(ref)
 */
export function usePressScale<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { scale = 0.92, disabled = false }: { scale?: number; disabled?: boolean } = {},
) {
  React.useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    let anim: Animation | null = null

    const to = (value: number, easing: string, duration: number) => {
      const from = getComputedStyle(el).scale
      anim?.cancel()
      anim = el.animate([{ scale: from === "none" ? "1" : from }, { scale: String(value) }], {
        duration,
        easing,
        fill: "forwards",
      })
    }
    const release = () => {
      window.removeEventListener("pointerup", release)
      window.removeEventListener("pointercancel", release)
      const { easing, duration } = springTiming("fast-spatial")
      to(1, easing, duration)
    }
    const press = (e: PointerEvent) => {
      if (e.button !== 0 || prefersReducedMotion()) return
      if (el.matches(':disabled, [data-disabled], [aria-disabled="true"]')) return
      to(scale, "cubic-bezier(0.3, 0, 0.8, 0.15)", 110)
      window.addEventListener("pointerup", release)
      window.addEventListener("pointercancel", release)
    }

    el.addEventListener("pointerdown", press)
    return () => {
      el.removeEventListener("pointerdown", press)
      window.removeEventListener("pointerup", release)
      window.removeEventListener("pointercancel", release)
      anim?.cancel()
    }
  }, [ref, scale, disabled])
}
