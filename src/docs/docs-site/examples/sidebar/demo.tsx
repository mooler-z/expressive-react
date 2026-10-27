import { useState } from "react"

import { Avatar } from "@/components/ui/avatar"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSubmenu,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { snackbar } from "@/components/ui/snackbar"

export default function SidebarDemo() {
  const [page, setPage] = useState("overview")

  return (
    <div className="flex h-[560px] w-full overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <SidebarProvider>
        <Sidebar value={page} onValueChange={setPage}>
          <SidebarHeader>
            <MenuTrigger>
              <SidebarMenuButton
                leading={<Avatar fallback="K" shape="square" size="md" color="primary-solid" />}
                title="Kestrel"
                subtitle="Pro workspace"
              />
              <MenuPopover placement="bottom start">
                <Menu aria-label="Switch workspace" onAction={(k) => snackbar(`Switched to ${k}`)}>
                  <MenuItem id="Kestrel">Kestrel</MenuItem>
                  <MenuItem id="Osprey Labs">Osprey Labs</MenuItem>
                </Menu>
              </MenuPopover>
            </MenuTrigger>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup label="Workspace">
              <SidebarItem value="overview" icon="space_dashboard" label="Overview" />
              <SidebarItem value="deploys" icon="rocket_launch" label="Deploys" badge={3} badgeLabel="3 running" />
              <SidebarItem value="incidents" icon="emergency" label="Incidents" badge={1} badgeTone="error" badgeLabel="1 open incident" />
            </SidebarGroup>
            <SidebarGroup label="Settings">
              <SidebarSubmenu title="Team" icon="group">
                <SidebarItem value="members" label="Members" />
                <SidebarItem value="roles" label="Roles" />
              </SidebarSubmenu>
              <SidebarItem value="billing" icon="payments" label="Billing" />
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenuButton
              leading={<Avatar name="Maya Lindqvist" size="md" status="online" />}
              title="Maya Lindqvist"
              subtitle="maya@kestrel.io"
              trailing={null}
              onPress={() => snackbar("Account")}
            />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b border-outline-variant px-2">
            <SidebarTrigger />
            <span className="text-title-md capitalize">{page}</span>
          </header>
          <div className="flex-1 bg-surface-container-low p-6 text-body-md text-on-surface-variant">
            Resize the window: full sidebar on large windows, a rail on medium ones, a modal drawer on compact ones.
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
