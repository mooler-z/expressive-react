import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function IconButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <IconButton isDisabled aria-label="Settings">
        <Icon name="settings" />
      </IconButton>
      <IconButton variant="filled" isDisabled aria-label="Add">
        <Icon name="add" />
      </IconButton>
      <IconButton variant="tonal" isDisabled aria-label="Edit">
        <Icon name="edit" />
      </IconButton>
      <IconButton variant="outlined" isDisabled aria-label="Share">
        <Icon name="share" />
      </IconButton>
    </div>
  )
}
