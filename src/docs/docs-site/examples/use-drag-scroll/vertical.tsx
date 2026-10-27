import { useRef } from "react"

import { useDragScroll } from "@/hooks/use-drag-scroll"

const DAYS = Array.from({ length: 14 }, (_, i) => `Oct ${16 + i}`)

export default function DragScrollVertical() {
  const ref = useRef<HTMLDivElement>(null)
  useDragScroll(ref, { axis: "y" })

  return (
    <div ref={ref} className="h-56 w-full max-w-xs snap-y snap-mandatory overflow-y-auto rounded-lg bg-surface-container select-none md:cursor-grab">
      {DAYS.map((d) => (
        <div key={d} className="flex h-14 snap-start items-center border-b border-outline-variant px-4 text-body-lg">
          {d}
        </div>
      ))}
    </div>
  )
}
