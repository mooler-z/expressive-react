import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"

export default function TabsDemo() {
  return (
    <Tabs className="w-full max-w-lg">
      <TabList aria-label="Travel">
        <Tab id="flights" icon="flight">Flights</Tab>
        <Tab id="trips" icon="luggage">Trips</Tab>
        <Tab id="explore" icon="explore">Explore</Tab>
      </TabList>
      <TabPanel id="flights" className="p-6 text-body-lg">Search fares to 600 destinations.</TabPanel>
      <TabPanel id="trips" className="p-6 text-body-lg">You have 2 upcoming trips.</TabPanel>
      <TabPanel id="explore" className="p-6 text-body-lg">Ideas for your next weekend away.</TabPanel>
    </Tabs>
  )
}
