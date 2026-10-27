import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"

export default function TooltipDelay() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <TooltipTrigger>
        <Button variant="tonal">Default · 500ms</Button>
        <Tooltip>Shows after half a second</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger delay={0}>
        <Button variant="tonal">Instant</Button>
        <Tooltip>Shows right away</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger delay={1200}>
        <Button variant="tonal">Slow · 1.2s</Button>
        <Tooltip>Shows after a longer hover</Tooltip>
      </TooltipTrigger>
    </div>
  )
}
