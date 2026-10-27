import { Tab, TabList, Tabs } from "@/components/ui/tabs"

const topics = ["For you", "Following", "World", "Business", "Technology", "Science", "Health", "Sports", "Culture"]

export default function TabsScrollable() {
  return (
    <Tabs className="w-full max-w-md">
      <TabList scrollable aria-label="Topics">
        {topics.map((t) => (
          <Tab key={t} id={t}>{t}</Tab>
        ))}
      </TabList>
    </Tabs>
  )
}
