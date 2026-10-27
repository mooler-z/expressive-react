import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"

export default function NavigationBarBadges() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant">
      <NavigationBar defaultValue="mail">
        <NavigationBarItem value="mail" icon="mail" label="Mail" badge={24} badgeLabel="24 unread" />
        <NavigationBarItem value="chat" icon="chat_bubble" label="Chat" badge={1000} badgeLabel="Over 999 unread" />
        <NavigationBarItem value="meet" icon="videocam" label="Meet" badge badgeLabel="Meeting starting" />
        <NavigationBarItem value="spaces" icon="group" label="Spaces" />
      </NavigationBar>
    </div>
  )
}
