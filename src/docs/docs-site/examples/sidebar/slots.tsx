import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { SearchBar } from "@/components/ui/search"
import {
  Sidebar,
  SidebarContent,
  SidebarFullOnly,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarProvider,
  SidebarRailOnly,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function SidebarSlots() {
  return (
    <div className="flex h-96 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <SidebarProvider mode="full">
        <Sidebar defaultValue="notes">
          <SidebarHeader>
            <SidebarFullOnly>
              <SearchBar placeholder="Search notes" className="h-12" />
            </SidebarFullOnly>
            <SidebarRailOnly>
              <IconButton aria-label="Search notes">
                <Icon name="search" />
              </IconButton>
            </SidebarRailOnly>
          </SidebarHeader>
          <SidebarContent>
            <SidebarItem value="notes" icon="sticky_note_2" label="Notes" />
            <SidebarItem value="reminders" icon="notifications" label="Reminders" />
            <SidebarItem value="archive" icon="archive" label="Archive" />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center px-2">
            <SidebarTrigger />
          </header>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
