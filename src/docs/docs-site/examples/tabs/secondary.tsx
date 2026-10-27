import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"

export default function TabsSecondary() {
  return (
    <Tabs className="w-full max-w-lg">
      <TabList variant="secondary" aria-label="Report">
        <Tab id="overview">Overview</Tab>
        <Tab id="specs">Specifications</Tab>
        <Tab id="reviews">Reviews</Tab>
      </TabList>
      <TabPanel id="overview" className="p-6 text-body-md text-on-surface-variant">A 2dp indicator spans the whole tab.</TabPanel>
      <TabPanel id="specs" className="p-6 text-body-md text-on-surface-variant">Weight 1.2kg · Battery 18h</TabPanel>
      <TabPanel id="reviews" className="p-6 text-body-md text-on-surface-variant">4.7 from 312 reviews</TabPanel>
    </Tabs>
  )
}
