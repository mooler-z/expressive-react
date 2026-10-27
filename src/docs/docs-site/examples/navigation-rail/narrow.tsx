import { NavigationRail, NavigationRailItem } from "@/components/ui/navigation-rail"

export default function NavigationRailNarrow() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <div className="h-80 overflow-hidden rounded-xl border border-outline-variant">
        <NavigationRail aria-label="Standard surface" defaultValue="chat">
          <NavigationRailItem value="chat" icon="chat" label="Chat" badge={4} badgeLabel="4 unread" />
          <NavigationRailItem value="calls" icon="call" label="Calls" />
          <NavigationRailItem value="people" icon="group" label="People" />
        </NavigationRail>
      </div>
      <div className="h-80 overflow-hidden rounded-xl border border-outline-variant">
        <NavigationRail aria-label="Narrow on a container" narrow surface="container" indicator="tertiary" defaultValue="calls">
          <NavigationRailItem value="chat" icon="chat" label="Chat" />
          <NavigationRailItem value="calls" icon="call" label="Calls" badge />
          <NavigationRailItem value="people" icon="group" label="People" />
        </NavigationRail>
      </div>
    </div>
  )
}
