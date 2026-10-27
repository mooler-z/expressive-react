"use client"

import * as React from "react"

import { Icon } from "@/components/ui/icon"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarFullOnly,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  SidebarSubmenu,
  useSidebar,
} from "@/components/ui/sidebar"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Sidebar 02 · Collapsible rail
 * A full sidebar that collapses into a 96dp rail from its footer; the nested section
 * becomes a menu while collapsed.
 */

function CollapseItem() {
  const { collapsed, toggle } = useSidebar()
  return (
    <SidebarItem
      icon={collapsed ? "left_panel_open" : "left_panel_close"}
      label={collapsed ? "Expand" : "Collapse"}
      onPress={toggle}
    />
  )
}

export function SidebarBlock2({ className }: { className?: string }) {
  const [page, setPage] = React.useState("Overview")

  return (
    <SidebarProvider mode="full">
      <div className={cn("flex h-full min-h-0 bg-surface", className)}>
        <Sidebar value={page} onValueChange={setPage} className="border-r border-outline-variant">
          <SidebarHeader className="h-16 flex-row items-center gap-3 px-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-on-primary">
              <Icon filled>stadia_controller</Icon>
            </span>
            <SidebarFullOnly>
              <span className="truncate text-title-md">
                <span className="font-semibold">Lumen</span> <span className="text-on-surface-variant">Live ops</span>
              </span>
            </SidebarFullOnly>
          </SidebarHeader>

          <SidebarContent>
            <SidebarItem value="Overview" icon="space_dashboard" label="Overview" />
            <SidebarSubmenu title="Live events" icon="celebration" defaultExpanded>
              <SidebarItem value="Running events" label="Running" badge={3} badgeTone="plain" />
              <SidebarItem value="Scheduled events" label="Scheduled" badge={3} badgeTone="plain" />
              <SidebarItem value="Event archive" label="Archive" />
            </SidebarSubmenu>
            <SidebarItem value="Players" icon="group" label="Players" />
            <SidebarItem value="Economy" icon="storefront" label="Economy" />
            <SidebarItem value="Moderation" icon="gavel" label="Moderation" badge={12} badgeTone="error" badgeLabel="12 open reports" />
            <SidebarItem value="Servers" icon="dns" label="Servers" />
          </SidebarContent>

          <SidebarFooter className="border-t border-outline-variant">
            <SidebarItem icon="help" label="Help & runbooks" onPress={() => snackbar("Docs and runbooks")} />
            <CollapseItem />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="hidden gap-3 p-6 sm:flex">
          <div className="text-body-sm text-on-surface-variant">Ember Tactics</div>
          <h4 className="-mt-2 text-headline-sm font-medium">{page}</h4>
          <div className="grid gap-3 lg:grid-cols-4">
            <div className="h-24 rounded-lg bg-surface-container-low" />
            <div className="h-24 rounded-lg bg-surface-container-low" />
            <div className="h-24 rounded-lg bg-surface-container-low" />
            <div className="h-24 rounded-lg bg-surface-container-low" />
          </div>
          <div className="flex-1 rounded-lg bg-surface-container-low" />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
