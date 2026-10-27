import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function IconButtonSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <IconButton variant="tonal" size="xs" aria-label="Edit, extra small">
        <Icon name="edit" />
      </IconButton>
      <IconButton variant="tonal" size="sm" aria-label="Edit, small">
        <Icon name="edit" />
      </IconButton>
      <IconButton variant="tonal" size="md" aria-label="Edit, medium">
        <Icon name="edit" />
      </IconButton>
      <IconButton variant="tonal" size="lg" aria-label="Edit, large">
        <Icon name="edit" />
      </IconButton>
      <IconButton variant="tonal" size="xl" aria-label="Edit, extra large">
        <Icon name="edit" />
      </IconButton>
    </div>
  )
}
