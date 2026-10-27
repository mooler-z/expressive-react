import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function MenuVibrant() {
  return (
    <MenuTrigger>
      <Button color="tertiary" icon={<Icon name="auto_awesome" />}>Create</Button>
      <MenuPopover>
        <Menu variant="vibrant" aria-label="Create" onAction={(key) => snackbar(String(key))} className="w-56">
          <MenuItem id="New project" icon="folder">Project</MenuItem>
          <MenuItem id="New service" icon="dns">Service</MenuItem>
          <MenuItem id="New dashboard" icon="space_dashboard">Dashboard</MenuItem>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}
