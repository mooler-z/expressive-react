import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { snackbar } from "@/components/ui/snackbar"
import { RichTooltipActions, RichTooltipSubhead, richTooltipStyles } from "@/components/ui/tooltip"

export default function TooltipRichActions() {
  return (
    <PopoverTrigger>
      <IconButton size="md" variant="outlined" aria-label="Grant access help">
        <Icon name="help" />
      </IconButton>
      <Popover aria-label="Grant access" className={richTooltipStyles}>
        <RichTooltipSubhead>Grant access</RichTooltipSubhead>
        People you share with can view and comment. Editors can also change the file.
        <RichTooltipActions>
          <Button variant="text" size="xs" slot="close">
            Got it
          </Button>
          <Button variant="text" size="xs" slot="close" onPress={() => snackbar("Opening sharing settings")}>
            Learn more
          </Button>
        </RichTooltipActions>
      </Popover>
    </PopoverTrigger>
  )
}
