import { Button as AriaButton } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { Kbd } from "@/components/ui/kbd"
import { Menu, MenuItem, MenuPopover, MenuSeparator, MenuTrigger } from "@/components/ui/menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarFullOnly,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRailOnly,
  SidebarSeparator,
  SidebarSubmenu,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

function Dot({ className }: { className: string }) {
  return <span aria-hidden className={`mx-2 size-2 shrink-0 rounded-full ${className}`} />
}

function WorkspaceSwitcher() {
  return (
    <MenuTrigger>
      <SidebarMenuButton
        leading={
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-on-primary">
            <Icon size={20} filled>
              flight_takeoff
            </Icon>
          </span>
        }
        title="Kestrel Ops"
        subtitle="Enterprise plan"
      />
      <MenuPopover placement="bottom start">
        <Menu aria-label="Workspace" onAction={(k) => snackbar(String(k))} className="w-64">
          <MenuItem id="Kestrel Ops" icon="check">Kestrel Ops</MenuItem>
          <MenuItem id="Kestrel Labs">Kestrel Labs</MenuItem>
          <MenuItem id="Personal sandbox">Personal sandbox</MenuItem>
          <MenuSeparator />
          <MenuItem id="Create workspace" icon="add">Create workspace</MenuItem>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}

function UserMenu() {
  return (
    <MenuTrigger>
      <SidebarMenuButton
        leading={<Avatar name="Maya Lindqvist" size="sm" color="tertiary" />}
        title="Maya Lindqvist"
        subtitle="maya@kestrel.io"
        trailing={<Icon className="text-on-surface-variant">more_vert</Icon>}
      />
      <MenuPopover placement="top start">
        <Menu aria-label="Account" onAction={(k) => snackbar(String(k))} className="w-60">
          <MenuItem id="Profile" icon="person">Profile</MenuItem>
          <MenuItem id="Appearance" icon="dark_mode">Appearance</MenuItem>
          <MenuItem id="Sign out" icon="logout">Sign out</MenuItem>
        </Menu>
      </MenuPopover>
    </MenuTrigger>
  )
}

function Search() {
  return (
    <>
      <SidebarFullOnly>
        <AriaButton
          onPress={() => snackbar("Open command palette")}
          className="state-layer focus-ring relative flex h-12 w-full cursor-pointer items-center gap-2 rounded-full bg-surface-container-high ps-4 pe-3 text-body-md text-on-surface-variant"
        >
          <Icon size={20}>search</Icon>
          <span className="flex-1 text-start">Search</span>
          <Kbd size="sm">⌘K</Kbd>
        </AriaButton>
      </SidebarFullOnly>
      <SidebarRailOnly>
        <AriaButton
          aria-label="Search"
          onPress={() => snackbar("Open command palette")}
          className="state-layer focus-ring relative grid size-12 cursor-pointer place-items-center rounded-full bg-surface-container-high text-on-surface-variant"
        >
          <Icon>search</Icon>
        </AriaButton>
      </SidebarRailOnly>
    </>
  )
}

function ProductSidebar({ className }: { className?: string }) {
  return (
    <Sidebar defaultValue="overview" className={className}>
      <SidebarHeader>
        <WorkspaceSwitcher />
        <Search />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup label="Platform">
          <SidebarItem value="overview" icon="dashboard" label="Overview" />
          <SidebarItem value="deployments" icon="rocket_launch" label="Deployments" badge={3} badgeLabel="3 running" />
          <SidebarItem value="services" icon="dns" label="Services" />
          <SidebarItem value="policies" icon="policy" label="Policies" />
          <SidebarItem value="incidents" icon="warning" label="Incidents" badge badgeTone="error" badgeLabel="Open incident" />
        </SidebarGroup>
        <SidebarSubmenu title="Projects" icon="folder" defaultExpanded>
          <SidebarItem value="checkout" leading={<Dot className="bg-primary" />} label="checkout" />
          <SidebarItem value="identity" leading={<Dot className="bg-tertiary" />} label="identity" />
          <SidebarItem value="edge-cache" leading={<Dot className="bg-secondary" />} label="edge-cache" />
          <SidebarItem icon="add" label="New project" className="text-primary" onPress={() => snackbar("New project", { action: { label: "Create", onAction: () => {} } })} />
        </SidebarSubmenu>
        <SidebarSeparator />
        <SidebarItem value="settings" icon="settings" label="Settings" />
        <SidebarItem value="help" icon="help" label="Help & feedback" />
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  )
}

function ModeLabel() {
  const { mode } = useSidebar()
  return <span className="font-mono text-label-md text-on-surface-variant">mode: {mode}</span>
}

export default function SidebarSection() {
  return (
    <Section
      id="sidebar"
      description="A product sidebar composed from the navigation drawer and rail: workspace switcher, search, grouped destinations with badges, a collapsible section and a user footer. mode=&quot;auto&quot; adapts to the window size class."
    >
      <div className="flex flex-wrap items-start gap-8">
        <SidebarProvider mode="full">
          <div className="flex h-[640px] w-full max-w-[640px] overflow-hidden rounded-lg ring-1 ring-outline-variant">
            <ProductSidebar />
            <SidebarInset className="bg-surface">
              <div className="flex h-16 items-center gap-2 px-2">
                <SidebarTrigger />
                <span className="text-title-lg">Overview</span>
                <span className="flex-1" />
                <ModeLabel />
              </div>
              <div className="grid flex-1 gap-3 p-4 pt-0">
                <div className="rounded-lg bg-surface-container" />
                <div className="rounded-lg bg-surface-container" />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <div className="max-w-sm space-y-3 text-body-md text-on-surface-variant">
          <div className="text-title-sm text-on-surface">Collapse behaviour</div>
          <p>
            With <code className="font-mono text-body-sm">mode=&quot;auto&quot;</code> the sidebar is a modal drawer behind the menu button on compact
            windows, a 96dp rail (icons + labels) on medium and expanded windows, and the full sidebar from 1200px. The menu button collapses the full
            sidebar to the rail — try it on the left.
          </p>
          <div className="flex flex-wrap gap-2">
            {["< 600 drawer", "600 rail", "1200 sidebar"].map((t) => (
              <span key={t} className="inline-flex h-8 items-center rounded-sm bg-surface-container-high px-3 font-mono text-label-md">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="Collapsed · rail" className="flex justify-center overflow-hidden rounded-lg bg-surface">
          <SidebarProvider mode="rail">
            <ProductSidebar className="h-[560px]" />
          </SidebarProvider>
        </Variant>
        <Variant n={2} label="Compact · modal drawer" className="overflow-hidden rounded-lg bg-surface">
          <SidebarProvider mode="modal">
            <div className="flex h-16 w-full items-center gap-2 px-2">
              <SidebarTrigger />
              <span className="text-title-lg">Overview</span>
            </div>
            <ProductSidebar />
          </SidebarProvider>
        </Variant>
        <Variant n={3} label="Docs · nested tree" className="overflow-hidden rounded-lg bg-surface">
          <SidebarProvider mode="full">
            <Sidebar defaultValue="install" surface="surface" aria-label="Docs" className="h-[560px] w-full">
              <SidebarHeader>
                <AriaButton className="state-layer focus-ring relative flex h-10 w-full cursor-pointer items-center gap-2 rounded-full bg-surface-container-high ps-4 pe-3 text-body-md text-on-surface-variant">
                  <Icon size={20}>search</Icon>
                  <span className="flex-1 text-start">Search docs</span>
                  <Kbd size="sm">/</Kbd>
                </AriaButton>
              </SidebarHeader>
              <SidebarContent>
                <SidebarSubmenu title="Getting started" defaultExpanded>
                  <SidebarItem value="intro" label="Introduction" />
                  <SidebarItem value="install" label="Install the CLI" />
                  <SidebarItem value="first" label="First deploy" />
                </SidebarSubmenu>
                <SidebarSubmenu title="Guides">
                  <SidebarItem value="rollouts" label="Progressive rollouts" />
                  <SidebarItem value="canary" label="Canary" />
                  <SidebarItem value="bluegreen" label="Blue / green" />
                  <SidebarItem value="rollbacks" label="Rollbacks" />
                </SidebarSubmenu>
                <SidebarSubmenu title="Concepts">
                  <SidebarItem value="clusters" label="Clusters" />
                  <SidebarItem value="policies" label="Policies" />
                </SidebarSubmenu>
                <SidebarSubmenu title="API reference">
                  <SidebarItem value="api-deploys" label="Deploys" />
                  <SidebarItem value="api-services" label="Services" />
                </SidebarSubmenu>
              </SidebarContent>
              <SidebarFooter className="flex-row items-center justify-between text-label-md text-on-surface-variant">
                v4.2 · latest
                <Icon size={18}>unfold_more</Icon>
              </SidebarFooter>
            </Sidebar>
          </SidebarProvider>
        </Variant>
      </Variants>
    </Section>
  )
}
