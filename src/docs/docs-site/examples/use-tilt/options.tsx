import { useRef } from "react"

import { useTilt } from "@/hooks/use-tilt"

function Card({ max, perspective }: { max: number; perspective: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useTilt(ref, { max, perspective })
  return (
    <div ref={ref} className="grid size-36 place-items-center rounded-lg bg-secondary-container text-center text-on-secondary-container">
      <span className="font-mono text-label-lg">
        {max}° · {perspective}px
      </span>
    </div>
  )
}

export default function TiltOptions() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Card max={4} perspective={1200} />
      <Card max={8} perspective={900} />
      <Card max={16} perspective={500} />
    </div>
  )
}
