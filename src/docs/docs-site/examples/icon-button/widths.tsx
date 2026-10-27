import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function IconButtonWidths() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <IconButton variant="filled" size="md" width="narrow" aria-label="Microphone, narrow">
        <Icon name="mic" />
      </IconButton>
      <IconButton variant="filled" size="md" width="default" aria-label="Microphone, default">
        <Icon name="mic" />
      </IconButton>
      <IconButton variant="filled" size="md" width="wide" aria-label="Microphone, wide">
        <Icon name="mic" />
      </IconButton>
    </div>
  )
}
