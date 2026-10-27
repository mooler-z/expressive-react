import { useRef } from "react"

import { useMagnetic } from "@/hooks/use-magnetic"

function Dot({ strength }: { strength: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useMagnetic(ref, { strength })
  return (
    <div className="grid size-32 place-items-center rounded-lg bg-surface-container">
      <div ref={ref} className="grid size-16 place-items-center rounded-full bg-tertiary font-mono text-label-lg text-on-tertiary">
        {strength}
      </div>
    </div>
  )
}

export default function MagneticStrength() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Dot strength={0.15} />
      <Dot strength={0.35} />
      <Dot strength={0.6} />
    </div>
  )
}
