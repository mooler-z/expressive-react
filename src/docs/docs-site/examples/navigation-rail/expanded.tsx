import {
  NavigationRail,
  NavigationRailFab,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailMenuButton,
  NavigationRailSection,
} from "@/components/ui/navigation-rail"

export default function NavigationRailExpanded() {
  return (
    <div className="flex h-[520px] w-full max-w-2xl overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <NavigationRail defaultExpanded defaultValue="all">
        <NavigationRailHeader>
          <NavigationRailMenuButton />
          <NavigationRailFab icon="add" label="New project" />
        </NavigationRailHeader>
        <NavigationRailItem value="all" icon="folder" label="All projects" badge={24} />
        <NavigationRailItem value="shared" icon="folder_shared" label="Shared with me" />
        <NavigationRailItem value="recent" icon="schedule" label="Recent" />
        <NavigationRailSection title="Labels">
          <NavigationRailItem value="design" icon="palette" label="Design" />
          <NavigationRailItem value="research" icon="science" label="Research" badge={3} />
        </NavigationRailSection>
      </NavigationRail>
      <div className="flex-1 bg-surface-container-low" />
    </div>
  )
}
