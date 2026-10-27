import { Tab, TabList, Tabs } from "@/components/ui/tabs"

export default function TabsBadges() {
  return (
    <div className="grid w-full max-w-lg gap-6">
      <Tabs>
        <TabList aria-label="Messages">
          <Tab id="all">All</Tab>
          <Tab id="unread" badge={8} badgeLabel="8 unread">Unread</Tab>
          <Tab id="mentions" badge badgeLabel="New mentions">Mentions</Tab>
        </TabList>
      </Tabs>
      <Tabs>
        <TabList aria-label="Activity">
          <Tab id="home" icon="home">Home</Tab>
          <Tab id="alerts" icon="notifications" badge={3} badgeLabel="3 alerts">Alerts</Tab>
          <Tab id="profile" icon="person">Profile</Tab>
        </TabList>
      </Tabs>
    </div>
  )
}
