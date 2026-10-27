import { useRef } from "react"

import { useDragScroll } from "@/hooks/use-drag-scroll"

const CARDS = ["Overview", "Latency", "Errors", "Throughput", "Saturation", "Costs", "Deploys", "Incidents"]
const TONES = ["bg-primary-container text-on-primary-container", "bg-secondary-container text-on-secondary-container", "bg-tertiary-container text-on-tertiary-container"]

export default function DragScrollDemo() {
  const ref = useRef<HTMLDivElement>(null)
  useDragScroll(ref)

  return (
    <div
      ref={ref}
      className="no-scrollbar flex w-full max-w-xl snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 py-2 select-none data-dragging:cursor-grabbing md:cursor-grab"
    >
      {CARDS.map((title, i) => (
        <div key={title} className={`h-36 w-44 shrink-0 snap-start rounded-xl p-4 ${TONES[i % TONES.length]}`}>
          <div className="text-title-md">{title}</div>
          <div className="mt-1 text-body-sm opacity-80">Card {i + 1}</div>
        </div>
      ))}
    </div>
  )
}
