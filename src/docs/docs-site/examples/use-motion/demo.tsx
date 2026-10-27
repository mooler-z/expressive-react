import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { prefersReducedMotion, springTiming, type SpringName } from "@/hooks/use-motion"

const SPRINGS: SpringName[] = ["fast-spatial", "default-spatial", "slow-spatial", "fast-effects", "default-effects", "slow-effects"]

function Lane({ name }: { name: SpringName }) {
  const dot = useRef<HTMLSpanElement>(null)
  const out = useRef(false)

  const play = () => {
    const el = dot.current
    if (!el) return
    out.current = !out.current
    const to = out.current ? "calc(100% - 1.5rem)" : "0px"
    if (prefersReducedMotion()) {
      el.style.left = to
      return
    }
    const { easing, duration } = springTiming(name)
    el.animate([{ left: getComputedStyle(el).left }, { left: to }], { duration, easing, fill: "forwards" })
  }

  const { duration } = springTiming(name)
  return (
    <div className="flex items-center gap-3">
      <Button variant="text" size="xs" onPress={play} className="w-36 justify-start font-mono">
        {name}
      </Button>
      <div className="relative h-6 flex-1 rounded-full bg-surface-container-high">
        <span ref={dot} className="absolute top-0 left-0 size-6 rounded-full bg-primary" />
      </div>
      <span className="w-14 text-right font-mono text-label-sm text-on-surface-variant tabular-nums">{Math.round(duration)}ms</span>
    </div>
  )
}

export default function MotionDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      {SPRINGS.map((s) => (
        <Lane key={s} name={s} />
      ))}
    </div>
  )
}
