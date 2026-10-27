import { FabMenu, FabMenuItem } from "@/components/ui/fab"
import { snackbar } from "@/components/ui/snackbar"

export default function FabMenuExample() {
  return (
    <div className="flex w-full justify-end">
      <FabMenu aria-label="Create" onAction={(key) => snackbar(String(key))}>
        <FabMenuItem id="Meeting started" icon="videocam">
          Start meeting
        </FabMenuItem>
        <FabMenuItem id="Meeting scheduled" icon="calendar_add_on">
          Schedule
        </FabMenuItem>
        <FabMenuItem id="Link copied" icon="link">
          Copy link
        </FabMenuItem>
      </FabMenu>
    </div>
  )
}
