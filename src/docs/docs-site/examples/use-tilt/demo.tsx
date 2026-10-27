import { useRef } from "react"

import { Shape } from "@/components/ui/shape"
import { useTilt } from "@/hooks/use-tilt"

export default function TiltDemo() {
  const ref = useRef<HTMLDivElement>(null)
  useTilt(ref)

  return (
    <div ref={ref} className="w-full max-w-xs rounded-xl bg-primary-container p-6 text-on-primary-container shadow-2">
      <Shape shape="sunny" className="size-16 text-primary" />
      <div className="mt-6 text-title-lg">Expressive Pro</div>
      <p className="mt-1 text-body-md">Move the pointer over the card.</p>
    </div>
  )
}
