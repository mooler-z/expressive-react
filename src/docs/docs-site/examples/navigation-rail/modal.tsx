import {
  NavigationRail,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailMenuButton,
  NavigationRailSection,
} from "@/components/ui/navigation-rail"

export default function NavigationRailModal() {
  return (
    <div className="flex h-96 w-full max-w-2xl overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <NavigationRail modal defaultValue="home">
        <NavigationRailHeader>
          <NavigationRailMenuButton />
        </NavigationRailHeader>
        <NavigationRailItem value="home" icon="home" label="Home" />
        <NavigationRailItem value="library" icon="video_library" label="Library" />
        <NavigationRailItem value="subscriptions" icon="subscriptions" label="Subscriptions" badge />
        <NavigationRailSection title="You">
          <NavigationRailItem value="history" icon="history" label="History" />
          <NavigationRailItem value="later" icon="watch_later" label="Watch later" />
        </NavigationRailSection>
      </NavigationRail>
      <div className="grid flex-1 place-items-center bg-surface-container-low p-6 text-center text-body-md text-on-surface-variant">
        Open the menu: the expanded rail floats over the content with a scrim.
      </div>
    </div>
  )
}
