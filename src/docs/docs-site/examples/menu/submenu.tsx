import { Button } from "@/components/ui/button"
import { Menu, MenuItem, MenuPopover, MenuTrigger, SubmenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function MenuSubmenu() {
  return (
    <MenuTrigger>
      <Button variant="tonal">File</Button>
      <MenuPopover>
        <Menu aria-label="File" onAction={(key) => snackbar(String(key))} className="w-56">
          <MenuItem id="New file" icon="note_add" shortcut="⌘N">New file</MenuItem>
          <SubmenuTrigger>
            <MenuItem id="share" icon="share">Share</MenuItem>
            <MenuPopover>
              <Menu aria-label="Share" onAction={(key) => snackbar(String(key))}>
                <MenuItem id="Shared by email" icon="mail">Email</MenuItem>
                <MenuItem id="Shared to Slack" icon="chat">Slack</MenuItem>
                <MenuItem id="Link copied" icon="link">Copy link</MenuItem>
              </Menu>
            </MenuPopover>
          </SubmenuTrigger>
          <MenuItem id="Downloaded" icon="download">Download</MenuItem>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}
