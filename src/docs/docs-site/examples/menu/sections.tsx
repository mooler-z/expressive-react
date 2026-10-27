import { Button } from "@/components/ui/button"
import { Menu, MenuItem, MenuPopover, MenuSection, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function MenuSections() {
  return (
    <MenuTrigger>
      <Button variant="outlined">Deploy</Button>
      <MenuPopover>
        <Menu aria-label="Deploy actions" onAction={(key) => snackbar(String(key))} className="w-64">
          <MenuSection title="Deploy">
            <MenuItem id="Deploying to production" icon="rocket_launch" description="Ships main to all regions">Production</MenuItem>
            <MenuItem id="Deploying to staging" icon="science" description="Preview with real data">Staging</MenuItem>
          </MenuSection>
          <MenuSection title="Danger">
            <MenuItem id="Rolling back" icon="history">Roll back</MenuItem>
            <MenuItem id="Deploys paused" icon="pause_circle">Pause deploys</MenuItem>
          </MenuSection>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}
