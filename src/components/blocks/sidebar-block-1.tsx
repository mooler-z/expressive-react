"use client"

import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Kbd } from "@/components/ui/kbd"
import { Menu, MenuItem, MenuPopover, MenuSeparator, MenuTrigger } from "@/components/ui/menu"
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
} from "@/components/ui/sidebar"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Sidebar 01 · Grouped with meters
 * Workspace menu, jump-to search, grouped destinations with counts, a capacity meter
 * and an account menu in the footer.
 */

type Item = {
  value: string
  icon: string
  badge?: string | number
  tone?: "primary" | "error" | "plain"
}

const GROUPS: { label: string; items: Item[] }[] = [
  {
    label: "Live",
    items: [
      { value: "Overview", icon: "space_dashboard" },
      { value: "Live events", icon: "celebration", badge: 3 },
      { value: "Store & offers", icon: "storefront" },
      { value: "Matchmaking", icon: "hub", badge: "38s", tone: "plain" },
    ],
  },
  {
    label: "Players",
    items: [
      { value: "Directory", icon: "group", badge: "1.2M", tone: "plain" },
      { value: "Moderation", icon: "gavel", badge: 12, tone: "error" },
      { value: "Support", icon: "support_agent", badge: 5, tone: "plain" },
    ],
  },
  {
    label: "Studio",
    items: [
      { value: "Builds & patches", icon: "deployed_code", badge: "7.2.1", tone: "plain" },
      { value: "Analytics", icon: "monitoring" },
      { value: "Settings", icon: "settings" },
    ],
  },
]

const WORKSPACES = ["Cinder Studio", "Cinder QA sandbox"]

export function SidebarBlock1({ className }: { className?: string }) {
  const [page, setPage] = React.useState("Live events")
  const [workspace, setWorkspace] = React.useState(WORKSPACES[0])

  return (
    <SidebarProvider mode="full">
      <div className={cn("flex h-full min-h-0 bg-surface", className)}>
        <Sidebar value={page} onValueChange={setPage} className="w-72 border-r border-outline-variant">
          <SidebarHeader>
            <MenuTrigger>
              <SidebarMenuButton
                leading={
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-on-primary">
                    <Icon filled>local_fire_department</Icon>
                  </span>
                }
                title={workspace}
                subtitle="3 titles · Studio plan"
              />
              <MenuPopover placement="bottom start">
                <Menu
                  aria-label="Workspaces"
                  className="w-64"
                  onAction={(k) => {
                    if (k === "create") return snackbar("New workspace dialog")
                    setWorkspace(String(k))
                    snackbar(`Switched to ${k}`)
                  }}
                >
                  {WORKSPACES.map((w) => (
                    <MenuItem key={w} id={w} icon={w === workspace ? "check" : undefined} leading={w === workspace ? undefined : <span className="w-6" />}>
                      {w}
                    </MenuItem>
                  ))}
                  <MenuSeparator />
                  <MenuItem id="create" icon="add">
                    Create workspace
                  </MenuItem>
                </Menu>
              </MenuPopover>
            </MenuTrigger>
            <label className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-surface-container-high px-3 text-on-surface-variant">
              <Icon size={20}>search</Icon>
              <input
                placeholder="Jump to…"
                aria-label="Jump to"
                className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-on-surface-variant"
              />
              <Kbd size="sm">⌘K</Kbd>
            </label>
          </SidebarHeader>

          <SidebarContent>
            {GROUPS.map((g) => (
              <SidebarGroup key={g.label} label={g.label}>
                {g.items.map((item) => (
                  <SidebarItem
                    key={item.value}
                    value={item.value}
                    icon={item.icon}
                    label={item.value}
                    badge={item.badge}
                    badgeTone={item.tone}
                  />
                ))}
              </SidebarGroup>
            ))}
          </SidebarContent>

          <SidebarFooter className="space-y-2 border-t border-outline-variant">
            <div className="rounded-lg bg-surface-container-high p-3">
              <div className="flex items-center justify-between text-label-lg">
                <span className="inline-flex items-center gap-2">
                  <Icon size={20} className="text-primary">
                    dns
                  </Icon>
                  Server capacity
                </span>
                <span className="tabular-nums">68%</span>
              </div>
              <div role="meter" aria-label="Server capacity" aria-valuenow={68} className="mt-2 flex h-1.5 items-center gap-1">
                <div className="h-full w-[68%] rounded-full bg-primary" />
                <div className="h-full flex-1 rounded-full bg-secondary-container" />
              </div>
              <div className="mt-2 text-body-sm text-on-surface-variant">182k of 268k player slots in use</div>
            </div>
            <div className="flex items-center gap-3 p-1">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary-container text-label-lg text-on-secondary-container">MO</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-title-sm">Maya Ortiz</span>
                <span className="block truncate text-body-sm text-on-surface-variant">maya@cinder.gg</span>
              </span>
              <MenuTrigger>
                <IconButton aria-label="Account menu">
                  <Icon>more_vert</Icon>
                </IconButton>
                <MenuPopover placement="top end">
                  <Menu aria-label="Account" className="w-56" onAction={(k) => snackbar(String(k))}>
                    <MenuItem id="Profile" icon="person">
                      Profile
                    </MenuItem>
                    <MenuItem id="Keyboard shortcuts" icon="keyboard">
                      Shortcuts
                    </MenuItem>
                    <MenuItem id="Signed out (demo)" icon="logout">
                      Sign out
                    </MenuItem>
                  </Menu>
                </MenuPopover>
              </MenuTrigger>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="hidden gap-3 p-6 sm:flex">
          <div className="text-body-sm text-on-surface-variant">Ember Tactics</div>
          <h4 className="-mt-2 text-headline-sm font-medium">{page}</h4>
          <div className="grid gap-3 lg:grid-cols-3">
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
