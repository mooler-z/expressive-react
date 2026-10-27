import { ScrollArea } from "@/components/ui/scroll-area"

const CARDS = ["Overview", "Latency", "Errors", "Throughput", "Saturation", "Cost"]

export default function ScrollAreaSnap() {
  return (
    <ScrollArea orientation="horizontal" dragScroll fade={24} className="w-full max-w-lg" viewportClassName="snap-x snap-mandatory">
      <div className="flex w-max gap-3 p-1">
        {CARDS.map((title, i) => (
          <div key={title} className="grid h-32 w-48 shrink-0 snap-start place-items-center rounded-lg bg-secondary-container text-title-md text-on-secondary-container">
            {i + 1}. {title}
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
