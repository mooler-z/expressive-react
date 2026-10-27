import { useState } from "react"

import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"

const pages = {
  home: "Your feed is up to date.",
  explore: "Trending near you.",
  saved: "12 saved places.",
  profile: "Signed in as Maya.",
}

export default function NavigationBarDemo() {
  const [page, setPage] = useState<keyof typeof pages>("home")

  return (
    <div className="flex h-80 w-full max-w-sm flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface">
      <div className="grid flex-1 place-items-center p-6 text-body-lg text-on-surface-variant">{pages[page]}</div>
      <NavigationBar value={page} onValueChange={(v) => setPage(v as keyof typeof pages)}>
        <NavigationBarItem value="home" icon="home" label="Home" />
        <NavigationBarItem value="explore" icon="explore" label="Explore" />
        <NavigationBarItem value="saved" icon="bookmark" label="Saved" badge={3} badgeLabel="3 new saves" />
        <NavigationBarItem value="profile" icon="person" label="Profile" />
      </NavigationBar>
    </div>
  )
}
