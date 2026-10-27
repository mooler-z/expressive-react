import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { RichTooltip, TooltipTrigger } from "@/components/ui/tooltip"

export default function TooltipRich() {
  return (
    <TooltipTrigger>
      <IconButton size="md" variant="tonal" aria-label="About autosave">
        <Icon name="cloud_sync" />
      </IconButton>
      <RichTooltip title="Autosave is on">
        Changes save to the cloud every few seconds. You can restore earlier versions from History.
      </RichTooltip>
    </TooltipTrigger>
  )
}
