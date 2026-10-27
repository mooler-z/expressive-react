import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function IconButtonShapes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <IconButton variant="filled" size="sm" aria-label="Play, round">
        <Icon name="play_arrow" />
      </IconButton>
      <IconButton variant="filled" size="sm" shape="square" aria-label="Play, square">
        <Icon name="play_arrow" />
      </IconButton>
      <IconButton variant="filled" size="md" aria-label="Play, round">
        <Icon name="play_arrow" />
      </IconButton>
      <IconButton variant="filled" size="md" shape="square" aria-label="Play, square">
        <Icon name="play_arrow" />
      </IconButton>
      <IconButton variant="filled" size="lg" aria-label="Play, round">
        <Icon name="play_arrow" />
      </IconButton>
      <IconButton variant="filled" size="lg" shape="square" aria-label="Play, square">
        <Icon name="play_arrow" />
      </IconButton>
    </div>
  )
}
