import { Sidebar, SidebarContent, SidebarGroup, SidebarInset, SidebarItem, SidebarProvider, SidebarSubmenu } from "@/components/ui/sidebar"

export default function SidebarRail() {
  return (
    <div className="flex h-[440px] w-full overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <SidebarProvider mode="rail">
        <Sidebar defaultValue="home">
          <SidebarContent className="pt-3">
            <SidebarItem value="home" icon="home" label="Home" />
            <SidebarItem value="inbox" icon="inbox" label="Inbox" badge={9} badgeLabel="9 unread" />
            <SidebarGroup label="Projects">
              <SidebarSubmenu title="Projects" icon="folder">
                <SidebarItem value="atlas" label="Atlas" />
                <SidebarItem value="beacon" label="Beacon" />
              </SidebarSubmenu>
              <SidebarItem value="reports" icon="bar_chart" label="Reports" />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="bg-surface-container-low p-6 text-body-md text-on-surface-variant">
          In rail mode a submenu becomes an item that opens a menu.
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
