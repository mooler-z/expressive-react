import { ContextMenu, ContextMenuArea, ContextMenuContent } from "@/components/ui/context-menu"
import { MenuItem, MenuSection } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function ContextMenuDisabledDestructive() {
  return (
    <ContextMenu>
      <ContextMenuArea className="w-full max-w-md rounded-lg bg-surface-container-low p-4 text-body-md text-on-surface">
        Right-click this paragraph. Nothing is selected, so Cut and Copy are unavailable, and Delete is styled as destructive.
      </ContextMenuArea>
      <ContextMenuContent aria-label="Edit" onAction={(key) => snackbar(String(key))} disabledKeys={["Cut", "Copy"]} className="w-60">
        <MenuSection title="Nothing selected">
          <MenuItem id="Cut" icon="content_cut" shortcut="⌘X">Cut</MenuItem>
          <MenuItem id="Copy" icon="content_copy" shortcut="⌘C">Copy</MenuItem>
          <MenuItem id="Pasted" icon="content_paste" shortcut="⌘V">Paste</MenuItem>
        </MenuSection>
        <MenuSection>
          <MenuItem id="Deleted" icon="delete" className="text-error [&_[data-slot=icon]]:text-error">Delete</MenuItem>
        </MenuSection>
      </ContextMenuContent>
    </ContextMenu>
  )
}
