import { useState } from "react"

import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"

export default function TabsPill() {
  const [range, setRange] = useState<string | number>("week")

  return (
    <Tabs selectedKey={range} onSelectionChange={setRange} className="items-center gap-4">
      <TabList variant="pill" aria-label="Range">
        <Tab id="day">Day</Tab>
        <Tab id="week">Week</Tab>
        <Tab id="month">Month</Tab>
      </TabList>
      {["day", "week", "month"].map((id) => (
        <TabPanel key={id} id={id} className="text-body-md text-on-surface-variant">
          Showing the last {id}.
        </TabPanel>
      ))}
    </Tabs>
  )
}
