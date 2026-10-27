import { Sidebar, SidebarContent, SidebarGroup, SidebarInset, SidebarItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function SidebarModal() {
  return (
    <div className="flex h-72 w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <SidebarProvider mode="modal">
        <Sidebar defaultValue="today">
          <SidebarContent className="pt-3">
            <SidebarGroup label="Tasks">
              <SidebarItem value="today" icon="today" label="Today" badge={4} />
              <SidebarItem value="upcoming" icon="event_upcoming" label="Upcoming" />
              <SidebarItem value="done" icon="task_alt" label="Completed" />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 border-b border-outline-variant px-2">
            <SidebarTrigger />
            <span className="text-title-md">Today</span>
          </header>
          <p className="p-4 text-body-md text-on-surface-variant">The menu button opens the sidebar as a modal drawer.</p>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
