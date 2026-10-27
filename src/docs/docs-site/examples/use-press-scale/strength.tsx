import { useRef } from "react"

import { usePressScale } from "@/hooks/use-press-scale"

function Tile({ scale }: { scale: number }) {
  const ref = useRef<HTMLButtonElement>(null)
  usePressScale(ref, { scale })
  return (
    <button ref={ref} type="button" className="focus-ring grid size-28 cursor-pointer place-items-center rounded-lg bg-secondary-container font-mono text-title-md text-on-secondary-container">
      {scale}
    </button>
  )
}

export default function PressScaleStrength() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Tile scale={0.96} />
      <Tile scale={0.92} />
      <Tile scale={0.85} />
    </div>
  )
}
