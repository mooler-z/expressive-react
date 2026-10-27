import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"

const placements = ["top", "bottom", "start", "end"] as const

export default function TooltipPlacement() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {placements.map((placement) => (
        <TooltipTrigger key={placement} delay={0}>
          <Button variant="outlined">{placement}</Button>
          <Tooltip placement={placement}>Opens {placement}</Tooltip>
        </TooltipTrigger>
      ))}
    </div>
  )
}
