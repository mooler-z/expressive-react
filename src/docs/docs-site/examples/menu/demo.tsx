import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuSection, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function MenuDemo() {
  return (
    <MenuTrigger>
      <Button variant="tonal" trailingIcon={<Icon name="arrow_drop_down" />}>Edit</Button>
      <MenuPopover>
        <Menu aria-label="Edit" onAction={(key) => snackbar(String(key))} className="w-60">
          <MenuSection>
            <MenuItem id="Cut" icon="content_cut" shortcut="⌘X">Cut</MenuItem>
            <MenuItem id="Copy" icon="content_copy" shortcut="⌘C">Copy</MenuItem>
            <MenuItem id="Paste" icon="content_paste" shortcut="⌘V">Paste</MenuItem>
          </MenuSection>
          <MenuSection>
            <MenuItem id="Rename" icon="drive_file_rename_outline">Rename</MenuItem>
            <MenuItem id="Delete" icon="delete" isDisabled>Delete</MenuItem>
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}
