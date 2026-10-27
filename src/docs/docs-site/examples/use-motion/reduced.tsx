import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { springTiming, useReducedMotion } from "@/hooks/use-motion"

export default function MotionReduced() {
  const reduce = useReducedMotion()
  const box = useRef<HTMLDivElement>(null)

  const pop = () => {
    const el = box.current
    if (!el || reduce) return
    const { easing, duration } = springTiming("default-spatial")
    el.animate([{ scale: "0.6" }, { scale: "1" }], { duration, easing })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={box} className="grid size-24 place-items-center rounded-xl bg-tertiary-container text-title-md text-on-tertiary-container">
        Pop
      </div>
      <Button variant="tonal" onPress={pop}>
        Play
      </Button>
      <p className="text-body-sm text-on-surface-variant">
        Reduced motion is <span className="font-medium">{reduce ? "on: the animation is skipped" : "off"}</span>.
      </p>
    </div>
  )
}
