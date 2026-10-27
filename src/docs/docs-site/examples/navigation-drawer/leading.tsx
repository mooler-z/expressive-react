import { NavigationDrawer, NavigationDrawerHeadline, NavigationDrawerItem } from "@/components/ui/navigation-drawer"

const labels = [
  { value: "design", color: "bg-primary", count: 12 },
  { value: "engineering", color: "bg-tertiary", count: 31 },
  { value: "marketing", color: "bg-error", count: 4 },
]

export default function NavigationDrawerLeading() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-xl border border-outline-variant">
      <NavigationDrawer dense indicator="tertiary" defaultValue="design">
        <NavigationDrawerHeadline>Teams</NavigationDrawerHeadline>
        {labels.map((l) => (
          <NavigationDrawerItem
            key={l.value}
            value={l.value}
            leading={<span aria-hidden className={`size-3 shrink-0 rounded-full ${l.color}`} />}
            badge={l.count}
          >
            <span className="capitalize">{l.value}</span>
          </NavigationDrawerItem>
        ))}
      </NavigationDrawer>
    </div>
  )
}
