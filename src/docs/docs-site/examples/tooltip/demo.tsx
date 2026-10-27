import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"

export default function TooltipDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <TooltipTrigger>
        <IconButton size="md" aria-label="Bookmark">
          <Icon name="bookmark" />
        </IconButton>
        <Tooltip>Save to bookmarks</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <IconButton size="md" aria-label="Share">
          <Icon name="share" />
        </IconButton>
        <Tooltip>Share</Tooltip>
      </TooltipTrigger>
      <TooltipTrigger>
        <IconButton size="md" aria-label="Bold">
          <Icon name="format_bold" />
        </IconButton>
        <Tooltip shortcut="⌘B">Bold</Tooltip>
      </TooltipTrigger>
    </div>
  )
}
