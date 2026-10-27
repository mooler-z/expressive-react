import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"

export default function NavigationBarColors() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      {(["secondary", "tertiary", "primary"] as const).map((indicator) => (
        <div key={indicator} className="overflow-hidden rounded-xl border border-outline-variant">
          <NavigationBar aria-label={`${indicator} indicator`} indicator={indicator} defaultValue="photos">
            <NavigationBarItem value="photos" icon="photo_library" label="Photos" />
            <NavigationBarItem value="search" icon="search" label="Search" />
            <NavigationBarItem value="sharing" icon="group" label="Sharing" />
          </NavigationBar>
        </div>
      ))}
    </div>
  )
}
