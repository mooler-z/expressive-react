import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPanelLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export default function NavigationMenuDemo() {
  return (
    <div className="h-80 w-full max-w-2xl rounded-xl border border-outline-variant bg-surface p-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuPanelLink href="#grid" icon="grid_view" title="Kestrel Grid">
                One control plane for every cluster
              </NavigationMenuPanelLink>
              <NavigationMenuPanelLink href="#pulse" icon="monitor_heart" title="Kestrel Pulse">
                Metrics, traces and alerts
              </NavigationMenuPanelLink>
              <NavigationMenuPanelLink href="#vault" icon="encrypted" title="Kestrel Vault">
                Secrets with audit trails
              </NavigationMenuPanelLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="resources">
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuPanelLink href="#docs" icon="menu_book" title="Docs" />
              <NavigationMenuPanelLink href="#changelog" icon="history" title="Changelog" />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#pricing">Pricing</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
