import { NavigationDrawer, NavigationDrawerGroup, NavigationDrawerItem } from "@/components/ui/navigation-drawer"

export default function NavigationDrawerGroups() {
  return (
    <div className="h-[440px] w-full max-w-sm overflow-y-auto rounded-xl border border-outline-variant">
      <NavigationDrawer defaultValue="api-keys">
        <NavigationDrawerItem value="overview" icon="dashboard">Overview</NavigationDrawerItem>
        <NavigationDrawerGroup title="Developers" icon="code" defaultExpanded>
          <NavigationDrawerItem value="api-keys">API keys</NavigationDrawerItem>
          <NavigationDrawerItem value="webhooks" badge={2} badgeLabel="2 failing">
            Webhooks
          </NavigationDrawerItem>
          <NavigationDrawerItem value="logs">Logs</NavigationDrawerItem>
        </NavigationDrawerGroup>
        <NavigationDrawerGroup title="Billing" icon="payments">
          <NavigationDrawerItem value="invoices">Invoices</NavigationDrawerItem>
          <NavigationDrawerItem value="plan">Plan</NavigationDrawerItem>
        </NavigationDrawerGroup>
      </NavigationDrawer>
    </div>
  )
}
