import { useRef } from "react"

import { Shape } from "@/components/ui/shape"
import { usePressScale } from "@/hooks/use-press-scale"

export default function PressScaleDemo() {
  const ref = useRef<HTMLButtonElement>(null)
  usePressScale(ref)

  return (
    <button ref={ref} type="button" className="focus-ring flex cursor-pointer flex-col items-center gap-3 rounded-xl bg-primary-container p-8 text-on-primary-container">
      <Shape shape="cookie9" className="size-20 text-primary" />
      <span className="text-title-md">Press and hold</span>
    </button>
  )
}
