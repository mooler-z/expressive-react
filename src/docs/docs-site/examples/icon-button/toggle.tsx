import { Icon } from "@/components/ui/icon"
import { ToggleIconButton } from "@/components/ui/icon-button"

export default function IconButtonToggle() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ToggleIconButton size="md" aria-label="Notifications">
        <Icon name="notifications" />
      </ToggleIconButton>
      <ToggleIconButton size="md" variant="filled" defaultSelected aria-label="Favorite">
        <Icon name="favorite" />
      </ToggleIconButton>
      <ToggleIconButton size="md" variant="tonal" aria-label="Bookmark">
        <Icon name="bookmark" />
      </ToggleIconButton>
      <ToggleIconButton size="md" variant="outlined" aria-label="Star">
        <Icon name="star" />
      </ToggleIconButton>
      <ToggleIconButton size="md" variant="filled" shape="square" defaultSelected aria-label="Pin">
        <Icon name="push_pin" />
      </ToggleIconButton>
    </div>
  )
}
