import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import {
  ModalNavigationDrawer,
  NavigationDrawerDivider,
  NavigationDrawerHeadline,
  NavigationDrawerItem,
} from "@/components/ui/navigation-drawer"

export default function NavigationDrawerModal() {
  return (
    <DialogTrigger>
      <Button variant="tonal" icon={<Icon name="menu" />}>
        Open drawer
      </Button>
      <ModalNavigationDrawer defaultValue="home">
        <NavigationDrawerHeadline>Kestrel</NavigationDrawerHeadline>
        <NavigationDrawerItem value="home" icon="home">Home</NavigationDrawerItem>
        <NavigationDrawerItem value="projects" icon="folder" badge={8}>Projects</NavigationDrawerItem>
        <NavigationDrawerItem value="reports" icon="bar_chart">Reports</NavigationDrawerItem>
        <NavigationDrawerDivider />
        <NavigationDrawerItem value="settings" icon="settings">Settings</NavigationDrawerItem>
      </ModalNavigationDrawer>
    </DialogTrigger>
  )
}
