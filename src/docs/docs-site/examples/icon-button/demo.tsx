import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function IconButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <IconButton size="md" aria-label="Settings">
        <Icon name="settings" />
      </IconButton>
      <IconButton size="md" variant="filled" aria-label="Add">
        <Icon name="add" />
      </IconButton>
      <IconButton size="md" variant="tonal" aria-label="Edit">
        <Icon name="edit" />
      </IconButton>
      <IconButton size="md" variant="outlined" aria-label="Share">
        <Icon name="share" />
      </IconButton>
    </div>
  )
}
