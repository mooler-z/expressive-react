import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuPanelLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export default function NavigationMenuHover() {
  return (
    <div className="h-72 w-full max-w-2xl rounded-xl border border-outline-variant bg-surface p-2">
      <NavigationMenu openOnHover>
        <NavigationMenuList>
          <NavigationMenuItem value="shop">
            <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuPanelLink href="#new" icon="new_releases" title="New arrivals" />
              <NavigationMenuPanelLink href="#sale" icon="sell" title="Sale" />
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="help">
            <NavigationMenuTrigger>Help</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuPanelLink href="#shipping" icon="local_shipping" title="Shipping" />
              <NavigationMenuPanelLink href="#returns" icon="undo" title="Returns" />
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
