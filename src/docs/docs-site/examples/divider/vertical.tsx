import { Divider } from "@/components/ui/divider"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function VerticalDivider() {
  return (
    <div className="flex h-12 items-center gap-1 rounded-full bg-surface-container px-2">
      <IconButton aria-label="Bold">
        <Icon name="format_bold" />
      </IconButton>
      <IconButton aria-label="Italic">
        <Icon name="format_italic" />
      </IconButton>
      <Divider orientation="vertical" inset="middle" className="mx-1" />
      <IconButton aria-label="Bulleted list">
        <Icon name="format_list_bulleted" />
      </IconButton>
      <IconButton aria-label="Insert link">
        <Icon name="link" />
      </IconButton>
    </div>
  )
}
