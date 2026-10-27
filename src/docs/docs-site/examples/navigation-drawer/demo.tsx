import { useState } from "react"

import {
  NavigationDrawer,
  NavigationDrawerDivider,
  NavigationDrawerHeadline,
  NavigationDrawerItem,
} from "@/components/ui/navigation-drawer"

export default function NavigationDrawerDemo() {
  const [folder, setFolder] = useState("inbox")

  return (
    <div className="flex h-[520px] w-full max-w-3xl overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <NavigationDrawer value={folder} onValueChange={setFolder} className="overflow-y-auto">
        <NavigationDrawerHeadline>Mail</NavigationDrawerHeadline>
        <NavigationDrawerItem value="inbox" icon="inbox" badge={24} badgeLabel="24 unread">
          Inbox
        </NavigationDrawerItem>
        <NavigationDrawerItem value="outbox" icon="send">Outbox</NavigationDrawerItem>
        <NavigationDrawerItem value="favorites" icon="favorite">Favorites</NavigationDrawerItem>
        <NavigationDrawerItem value="trash" icon="delete">Trash</NavigationDrawerItem>
        <NavigationDrawerDivider />
        <NavigationDrawerHeadline>Labels</NavigationDrawerHeadline>
        <NavigationDrawerItem value="family" icon="bookmark">Family</NavigationDrawerItem>
        <NavigationDrawerItem value="work" icon="bookmark" badge badgeLabel="New activity">
          Work
        </NavigationDrawerItem>
      </NavigationDrawer>
      <div className="hidden flex-1 rounded-s-xl bg-surface-container-low p-6 text-body-lg capitalize text-on-surface-variant sm:block">{folder}</div>
    </div>
  )
}
