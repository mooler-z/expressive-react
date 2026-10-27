import { useState } from "react"

import {
  NavigationRail,
  NavigationRailFab,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailMenuButton,
  NavigationRailSpacer,
} from "@/components/ui/navigation-rail"
import { snackbar } from "@/components/ui/snackbar"

export default function NavigationRailDemo() {
  const [page, setPage] = useState("inbox")

  return (
    <div className="flex h-[480px] w-full max-w-2xl overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <NavigationRail value={page} onValueChange={setPage}>
        <NavigationRailHeader>
          <NavigationRailMenuButton />
          <NavigationRailFab icon="edit" label="Compose" onPress={() => snackbar("New message")} />
        </NavigationRailHeader>
        <NavigationRailItem value="inbox" icon="inbox" label="Inbox" badge={12} badgeLabel="12 unread" />
        <NavigationRailItem value="starred" icon="star" label="Starred" />
        <NavigationRailItem value="sent" icon="send" label="Sent" />
        <NavigationRailItem value="drafts" icon="draft" label="Drafts" badge badgeLabel="Unsaved draft" />
        <NavigationRailSpacer />
        <NavigationRailItem value="settings" icon="settings" label="Settings" />
      </NavigationRail>
      <div className="flex-1 rounded-s-xl bg-surface-container-low p-6 text-body-lg capitalize text-on-surface-variant">{page}</div>
    </div>
  )
}
