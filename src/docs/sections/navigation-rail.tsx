import * as React from "react"

import {
  NavigationRail,
  NavigationRailFab,
  NavigationRailHeader,
  NavigationRailItem,
  NavigationRailMenuButton,
  NavigationRailSection,
  NavigationRailSpacer,
} from "@/components/ui/navigation-rail"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

const deploy = () => snackbar("New deploy started", { action: { label: "View", onAction: () => {} } })

function AdminItems() {
  return (
    <>
      <NavigationRailItem value="overview" icon="dashboard" label="Overview" />
      <NavigationRailItem value="analytics" icon="monitoring" label="Analytics" />
      <NavigationRailItem value="users" icon="group" label="Users" badge={24} badgeLabel="24 pending invites" />
      <NavigationRailItem value="orders" icon="receipt_long" label="Orders" />
      <NavigationRailSpacer />
      <NavigationRailItem value="settings" icon="settings" label="Settings" />
    </>
  )
}

export default function NavigationRailSection_() {
  const [tapped, setTapped] = React.useState("home")
  return (
    <Section
      id="navigation-rail"
      description="Collapsed (96dp) for medium and expanded windows; expanded (220–360dp) with inline labels for large windows. One component: tap the menu button and the rail springs between the two. Expand as a modal over content when space is tight."
      spec="https://m3.material.io/components/navigation-rail/overview"
    >
      <div className="flex flex-wrap items-start gap-6">
        <div className="space-y-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Standard · collapsed ⇄ expanded</div>
          <NavigationRail defaultValue="overview" className="h-[520px] rounded-md">
            <NavigationRailHeader>
              <NavigationRailMenuButton />
              <NavigationRailFab icon="edit" label="New deploy" onPress={deploy} />
            </NavigationRailHeader>
            <AdminItems />
          </NavigationRail>
        </div>
        <div className="space-y-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Modal expanded</div>
          <NavigationRail modal defaultValue="overview" className="h-[520px] rounded-md">
            <NavigationRailHeader>
              <NavigationRailMenuButton />
              <NavigationRailFab icon="edit" label="New deploy" onPress={deploy} />
            </NavigationRailHeader>
            <AdminItems />
          </NavigationRail>
        </div>
        <div className="max-w-xs text-body-md text-on-surface-variant">
          <div className="text-title-sm text-on-surface">Adaptive pattern</div>
          <p className="mt-1">
            Navigation bar below 600px → collapsed rail on medium and expanded windows → expanded rail from 1200px. Drive{" "}
            <code className="font-mono text-body-sm">expanded</code> from <code className="font-mono text-body-sm">useWindowSizeClass()</code>, or
            use <code className="font-mono text-body-sm">modal</code> to keep the collapsed rail in place and float the expanded one over content.
          </p>
        </div>
      </div>

      <Variants>
        <Variant n={1} label="Collapsed · badges" className="flex justify-center overflow-hidden rounded-lg bg-surface">
          <NavigationRail defaultValue="overview" className="h-[420px]">
            <NavigationRailHeader className="pb-6">
              <NavigationRailMenuButton />
            </NavigationRailHeader>
            <NavigationRailItem value="overview" icon="dashboard" label="Overview" />
            <NavigationRailItem value="metrics" icon="monitoring" label="Metrics" />
            <NavigationRailItem value="alerts" icon="notifications" label="Alerts" badge={3} badgeLabel="3 alerts" />
            <NavigationRailItem value="settings" icon="settings" label="Settings" badge />
          </NavigationRail>
        </Variant>
        <Variant n={2} label="Centered · tertiary FAB" className="flex justify-center overflow-hidden rounded-lg bg-surface">
          <NavigationRail defaultValue="inbox" indicator="tertiary" className="h-[420px]">
            <NavigationRailHeader className="pb-0">
              <NavigationRailMenuButton />
              <NavigationRailFab icon="edit" label="Compose" tone="tertiary" onPress={() => snackbar("Compose")} />
            </NavigationRailHeader>
            <NavigationRailSpacer />
            <NavigationRailItem value="inbox" icon="inbox" label="Inbox" />
            <NavigationRailItem value="starred" icon="star" label="Starred" />
            <NavigationRailItem value="sent" icon="send" label="Sent" />
            <NavigationRailSpacer />
          </NavigationRail>
        </Variant>
        <Variant n={3} label="Expanded · sections" className="flex justify-center overflow-hidden rounded-lg bg-surface">
          <NavigationRail defaultExpanded defaultValue="grid" className="h-[420px]">
            <NavigationRailHeader className="pb-4">
              <NavigationRailMenuButton />
              <NavigationRailFab icon="add" label="New deploy" onPress={deploy} />
            </NavigationRailHeader>
            <NavigationRailItem value="overview" icon="dashboard" label="Overview" />
            <NavigationRailItem value="metrics" icon="monitoring" label="Metrics" />
            <NavigationRailSection title="Projects">
              <NavigationRailItem value="grid" icon="hub" label="Kestrel Grid" />
              <NavigationRailItem value="edge" icon="bolt" label="Edge cache" />
            </NavigationRailSection>
          </NavigationRail>
        </Variant>
        <Variant n={4} label="Tap to switch" className="flex items-stretch overflow-hidden rounded-lg bg-surface">
          <NavigationRail value={tapped} onValueChange={setTapped} narrow className="h-[420px]">
            <NavigationRailHeader className="pb-6">
              <NavigationRailMenuButton />
            </NavigationRailHeader>
            <NavigationRailItem value="home" icon="home" label="Home" />
            <NavigationRailItem value="explore" icon="explore" label="Explore" />
            <NavigationRailItem value="saved" icon="bookmark" label="Saved" />
            <NavigationRailItem value="profile" icon="person" label="Profile" />
          </NavigationRail>
          <div className="grid flex-1 place-items-center p-4 text-body-md text-on-surface-variant">
            <span>
              Showing <span className="font-medium text-on-surface capitalize">{tapped}</span>
            </span>
          </div>
        </Variant>
      </Variants>
    </Section>
  )
}
