import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuGroupLabel,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPanelLink,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export default function NavigationMenuMega() {
  return (
    <div className="h-96 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <NavigationMenu>
        <div className="flex h-16 items-center gap-4 px-4">
          <span className="text-title-md font-semibold">Kestrel</span>
          <NavigationMenuList>
            <NavigationMenuItem value="platform">
              <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
              <NavigationMenuContent className="grid gap-6 p-4 sm:grid-cols-2">
                <div>
                  <NavigationMenuGroupLabel>Build</NavigationMenuGroupLabel>
                  <NavigationMenuPanelLink href="#deploys" icon="rocket_launch" title="Deploys">Preview every pull request</NavigationMenuPanelLink>
                  <NavigationMenuPanelLink href="#functions" icon="function" title="Functions">Run code at the edge</NavigationMenuPanelLink>
                </div>
                <div>
                  <NavigationMenuGroupLabel>Operate</NavigationMenuGroupLabel>
                  <NavigationMenuPanelLink href="#observability" icon="query_stats" title="Observability">Logs, traces, metrics</NavigationMenuPanelLink>
                  <NavigationMenuPanelLink href="#incidents" icon="emergency" title="Incidents">Page the right person</NavigationMenuPanelLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem value="company">
              <NavigationMenuTrigger>Company</NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-wrap gap-2 p-4">
                <NavigationMenuPanelLink href="#about" icon="info" title="About" />
                <NavigationMenuPanelLink href="#careers" icon="work" title="Careers" />
                <NavigationMenuPanelLink href="#press" icon="newspaper" title="Press" />
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#blog">Blog</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
        <NavigationMenuViewport />
      </NavigationMenu>
    </div>
  )
}
