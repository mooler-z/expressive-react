import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function MenuBasic() {
  return (
    <MenuTrigger>
      <IconButton aria-label="More actions">
        <Icon name="more_vert" />
      </IconButton>
      <MenuPopover placement="bottom end">
        <Menu aria-label="Actions" onAction={(key) => snackbar(String(key))}>
          <MenuItem id="Opened">Open</MenuItem>
          <MenuItem id="Duplicated">Duplicate</MenuItem>
          <MenuItem id="Archived">Archive</MenuItem>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}
