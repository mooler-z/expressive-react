import { useState } from "react"

import { ContextMenu, ContextMenuArea, ContextMenuContent } from "@/components/ui/context-menu"
import { MenuItem } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function ContextMenuLongPress() {
  const [open, setOpen] = useState(false)
  return (
    <ContextMenu onOpenChange={setOpen}>
      <ContextMenuArea
        longPressDelay={300}
        className="grid h-40 w-full max-w-md place-items-center rounded-lg bg-secondary-container text-body-md text-on-secondary-container"
      >
        {open ? "Menu open" : "Long-press (300ms), right-click or Shift+F10"}
      </ContextMenuArea>
      <ContextMenuContent aria-label="Message actions" onAction={(key) => snackbar(String(key))}>
        <MenuItem id="Replied" icon="reply">Reply</MenuItem>
        <MenuItem id="Forwarded" icon="forward">Forward</MenuItem>
        <MenuItem id="Pinned" icon="push_pin">Pin</MenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
