import { ContextMenu, ContextMenuArea, ContextMenuContent } from "@/components/ui/context-menu"
import { Icon } from "@/components/ui/icon"
import { MenuItem, MenuSection } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuArea className="grid h-56 w-full max-w-md place-items-center rounded-lg border-2 border-dashed border-outline-variant text-body-md text-on-surface-variant">
        <span className="flex items-center gap-2">
          <Icon name="ads_click" />
          Right-click or long-press here
        </span>
      </ContextMenuArea>
      <ContextMenuContent aria-label="File actions" onAction={(key) => snackbar(String(key))} className="w-56">
        <MenuSection>
          <MenuItem id="Opened" icon="open_in_new">Open</MenuItem>
          <MenuItem id="Renamed" icon="drive_file_rename_outline" shortcut="F2">Rename</MenuItem>
          <MenuItem id="Duplicated" icon="content_copy" shortcut="⌘D">Duplicate</MenuItem>
        </MenuSection>
        <MenuSection>
          <MenuItem id="Moved to trash" icon="delete">Move to trash</MenuItem>
        </MenuSection>
      </ContextMenuContent>
    </ContextMenu>
  )
}
