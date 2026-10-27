import { FilterChip } from "@/components/ui/chip"
import { ScrollArea } from "@/components/ui/scroll-area"

const TAGS = ["All", "Production", "Staging", "Preview", "Failed", "Rolled back", "Canary", "Scheduled", "Manual", "Hotfix", "Security"]

export default function ScrollAreaHorizontal() {
  return (
    <ScrollArea orientation="horizontal" fade scrollButtons dragScroll hideScrollbar className="w-full max-w-md">
      <div className="flex w-max gap-2 px-1 py-1">
        {TAGS.map((tag, i) => (
          <FilterChip key={tag} defaultSelected={i === 0}>
            {tag}
          </FilterChip>
        ))}
      </div>
    </ScrollArea>
  )
}
