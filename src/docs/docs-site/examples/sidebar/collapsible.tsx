import { Sidebar, SidebarContent, SidebarGroup, SidebarInset, SidebarItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function SidebarCollapsible() {
  return (
    <div className="flex h-96 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <SidebarProvider mode="full">
        <Sidebar defaultValue="files" surface="surface" className="border-e border-outline-variant">
          <SidebarContent className="pt-3">
            <SidebarGroup>
              <SidebarItem value="files" icon="folder" label="Files" />
              <SidebarItem value="shared" icon="folder_shared" label="Shared" />
              <SidebarItem value="starred" icon="star" label="Starred" />
              <SidebarItem value="trash" icon="delete" label="Trash" />
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-2 px-2">
            <SidebarTrigger />
            <span className="text-title-md">My drive</span>
          </header>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
