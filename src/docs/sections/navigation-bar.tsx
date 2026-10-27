import * as React from "react"

import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import { Section, Variant, Variants } from "@/docs/section"

const frame = "flex min-h-24 items-end overflow-hidden rounded-lg bg-surface"

export default function NavigationBarSection() {
  const [tapped, setTapped] = React.useState("home")
  return (
    <Section
      id="navigation-bar"
      description="3–5 destinations for compact windows. Expressive 64dp bar: active indicator pill 32×56 in secondary-container, filled icon, label-medium. Horizontal item layout for medium windows."
      spec="https://m3.material.io/components/navigation-bar/overview"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Vertical items · compact</div>
          <NavigationBar defaultValue="home" className="rounded-md">
            <NavigationBarItem value="home" icon="home" label="Home" />
            <NavigationBarItem value="explore" icon="explore" label="Explore" />
            <NavigationBarItem value="alerts" icon="notifications" label="Alerts" badge={4} badgeLabel="4 new alerts" />
            <NavigationBarItem value="profile" icon="person" label="Profile" />
          </NavigationBar>
        </div>
        <div className="space-y-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Horizontal items · medium</div>
          <NavigationBar defaultValue="home" layout="horizontal" className="rounded-md">
            <NavigationBarItem value="home" icon="home" label="Home" />
            <NavigationBarItem value="explore" icon="explore" label="Explore" />
            <NavigationBarItem value="alerts" icon="notifications" label="Alerts" badge />
            <NavigationBarItem value="profile" icon="person" label="Profile" />
          </NavigationBar>
        </div>
        <div className="space-y-2 md:col-span-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">
            layout=&quot;auto&quot; · vertical below 600px, horizontal from 600px (resize the window)
          </div>
          <NavigationBar defaultValue="inbox" layout="auto" className="rounded-md">
            <NavigationBarItem value="inbox" icon="inbox" label="Inbox" badge={12} />
            <NavigationBarItem value="chat" icon="chat" label="Chat" />
            <NavigationBarItem value="meet" icon="videocam" label="Meet" />
            <NavigationBarItem value="teams" icon="group" label="Teams" />
          </NavigationBar>
        </div>
      </div>

      <Variants>
        <Variant n={1} label="3 destinations" className={frame}>
          <NavigationBar defaultValue="home">
            <NavigationBarItem value="home" icon="home" label="Home" />
            <NavigationBarItem value="explore" icon="explore" label="Explore" />
            <NavigationBarItem value="profile" icon="person" label="Profile" />
          </NavigationBar>
        </Variant>
        <Variant n={2} label="5 destinations · badges" className={frame}>
          <NavigationBar defaultValue="inbox">
            <NavigationBarItem value="inbox" icon="inbox" label="Inbox" badge={12} badgeLabel="12 unread" />
            <NavigationBarItem value="chat" icon="chat" label="Chat" badge />
            <NavigationBarItem value="meet" icon="videocam" label="Meet" />
            <NavigationBarItem value="teams" icon="group" label="Teams" />
            <NavigationBarItem value="settings" icon="settings" label="Settings" />
          </NavigationBar>
        </Variant>
        <Variant n={3} label="Tertiary indicator" className={frame}>
          <NavigationBar defaultValue="routes" indicator="tertiary">
            <NavigationBarItem value="map" icon="map" label="Map" />
            <NavigationBarItem value="routes" icon="route" label="Routes" />
            <NavigationBarItem value="saved" icon="bookmark" label="Saved" />
          </NavigationBar>
        </Variant>
        <Variant n={4} label="Tap to switch" className="flex min-h-24 flex-col justify-end overflow-hidden rounded-lg bg-surface">
          <div className="grid flex-1 place-items-center p-4 text-body-md text-on-surface-variant">
            Showing <span className="font-medium text-on-surface capitalize">{tapped}</span>
          </div>
          <NavigationBar value={tapped} onValueChange={setTapped}>
            <NavigationBarItem value="home" icon="home" label="Home" />
            <NavigationBarItem value="metrics" icon="monitoring" label="Metrics" />
            <NavigationBarItem value="alerts" icon="notifications" label="Alerts" />
            <NavigationBarItem value="profile" icon="person" label="Profile" />
          </NavigationBar>
        </Variant>
      </Variants>
    </Section>
  )
}
