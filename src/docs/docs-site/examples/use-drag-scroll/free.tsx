import { useRef } from "react"

import { useDragScroll } from "@/hooks/use-drag-scroll"

export default function DragScrollFree() {
  const ref = useRef<HTMLDivElement>(null)
  useDragScroll(ref, { snapTargets: () => [] })

  return (
    <div ref={ref} className="w-full max-w-xl overflow-x-auto rounded-lg bg-surface-container select-none md:cursor-grab">
      <div className="flex h-24 w-[1600px] items-end gap-1 p-3">
        {Array.from({ length: 80 }, (_, i) => (
          <span key={i} className="flex-1 rounded-t-xs bg-primary" style={{ height: `${20 + ((i * 37) % 80)}%` }} />
        ))}
      </div>
    </div>
  )
}
