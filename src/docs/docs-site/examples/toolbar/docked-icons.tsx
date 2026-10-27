import { Fab } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { DockedToolbar, ToolbarButton } from "@/components/ui/toolbar"

export default function ToolbarDockedIcons() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-outline-variant">
      <DockedToolbar aria-label="Document actions">
        <div className="flex items-center gap-1">
          <ToolbarButton aria-label="Undo">
            <Icon name="undo" />
          </ToolbarButton>
          <ToolbarButton aria-label="Redo">
            <Icon name="redo" />
          </ToolbarButton>
          <ToolbarButton aria-label="Comment">
            <Icon name="comment" />
          </ToolbarButton>
        </div>
        <Fab size="sm" color="secondary-container" aria-label="Edit">
          <Icon name="edit" />
        </Fab>
      </DockedToolbar>
    </div>
  )
}
