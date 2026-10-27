import { BadgeAnchor } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10 text-on-surface-variant">
      <BadgeAnchor dot badgeLabel="New activity">
        <Icon name="notifications" />
      </BadgeAnchor>
      <BadgeAnchor count={3} badgeLabel="3 unread messages">
        <Icon name="mail" />
      </BadgeAnchor>
      <BadgeAnchor count={42} badgeLabel="42 updates">
        <Icon name="system_update" />
      </BadgeAnchor>
      <BadgeAnchor count={1280} badgeLabel="Over 999 notifications">
        <Icon name="forum" />
      </BadgeAnchor>
    </div>
  )
}
