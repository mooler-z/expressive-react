"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type Wave = { id: number; x: number; y: number; size: number; released: boolean }

let uid = 0

/**
 * Press ripple. Drop it inside any `relative` interactive element; it listens to
 * its parent's pointer events, so it works with React Aria and native elements alike.
 */
function Ripple({ className }: { className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [waves, setWaves] = React.useState<Wave[]>([])

  React.useEffect(() => {
    // Skip `display: contents` wrappers (e.g. React Aria GridList cells): they have no box to measure.
    let host = ref.current?.parentElement
    while (host && getComputedStyle(host).display === "contents") host = host.parentElement
    if (!host) return
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      if (host.matches(':disabled, [data-disabled], [aria-disabled="true"]')) return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      const r = host.getBoundingClientRect()
      const size = Math.max(r.width, r.height) * 2.2
      setWaves((w) => [
        ...w,
        { id: ++uid, x: e.clientX - r.left - size / 2, y: e.clientY - r.top - size / 2, size, released: false },
      ])
    }
    const onUp = () => setWaves((w) => (w.some((x) => !x.released) ? w.map((x) => ({ ...x, released: true })) : w))
    host.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      host.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [])

  const remove = React.useCallback((id: number) => setWaves((w) => w.filter((x) => x.id !== id)), [])

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}
    >
      {waves.map((w) => (
        <RippleWave key={w.id} wave={w} onDone={remove} />
      ))}
    </span>
  )
}

function RippleWave({ wave, onDone }: { wave: Wave; onDone: (id: number) => void }) {
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    ref.current?.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
      duration: 450,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
      fill: "forwards",
    })
  }, [])

  React.useEffect(() => {
    if (!wave.released || !ref.current) return
    const fade = ref.current.animate([{ opacity: 0.14 }, { opacity: 0 }], { duration: 350, delay: 20, fill: "forwards" })
    fade.onfinish = () => onDone(wave.id)
    return () => fade.cancel()
  }, [wave.released, wave.id, onDone])

  return (
    <span
      ref={ref}
      className="absolute scale-0 rounded-full bg-current opacity-[.14]"
      style={{ left: wave.x, top: wave.y, width: wave.size, height: wave.size }}
    />
  )
}

export { Ripple }
