import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"

export default function TabsVertical() {
  return (
    <Tabs orientation="vertical" className="h-56 w-full max-w-lg rounded-xl border border-outline-variant">
      <TabList variant="secondary" aria-label="Settings">
        <Tab id="general" icon="tune">General</Tab>
        <Tab id="privacy" icon="lock">Privacy</Tab>
        <Tab id="billing" icon="credit_card" isDisabled>Billing</Tab>
      </TabList>
      <TabPanel id="general" className="p-6 text-body-md">Language, region and time zone.</TabPanel>
      <TabPanel id="privacy" className="p-6 text-body-md">Who can see your activity.</TabPanel>
      <TabPanel id="billing" className="p-6 text-body-md">Invoices and payment methods.</TabPanel>
    </Tabs>
  )
}
