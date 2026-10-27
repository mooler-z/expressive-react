import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"

export default function NavigationBarAuto() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-outline-variant">
      <NavigationBar layout="auto" defaultValue="today">
        <NavigationBarItem value="today" icon="today" label="Today" />
        <NavigationBarItem value="upcoming" icon="event_upcoming" label="Upcoming" badge={5} badgeLabel="5 upcoming" />
        <NavigationBarItem value="projects" icon="folder" label="Projects" />
        <NavigationBarItem value="done" icon="task_alt" label="Done" />
      </NavigationBar>
    </div>
  )
}
