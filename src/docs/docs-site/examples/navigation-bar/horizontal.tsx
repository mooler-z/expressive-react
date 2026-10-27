import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"

export default function NavigationBarHorizontal() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-outline-variant">
      <NavigationBar layout="horizontal" defaultValue="music">
        <NavigationBarItem value="music" icon="music_note" label="Music" />
        <NavigationBarItem value="podcasts" icon="podcasts" label="Podcasts" badge={2} badgeLabel="2 new episodes" />
        <NavigationBarItem value="books" icon="auto_stories" label="Books" />
        <NavigationBarItem value="library" icon="library_music" label="Library" />
      </NavigationBar>
    </div>
  )
}
