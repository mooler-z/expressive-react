import { Tab, TabList, Tabs } from "@/components/ui/tabs"

export default function TabsIcons() {
  return (
    <div className="grid w-full max-w-lg gap-6">
      <Tabs>
        <TabList aria-label="Inline icons">
          <Tab id="photos" icon="photo" inlineIcon>Photos</Tab>
          <Tab id="videos" icon="videocam" inlineIcon>Videos</Tab>
          <Tab id="audio" icon="mic" inlineIcon>Audio</Tab>
        </TabList>
      </Tabs>
      <Tabs>
        <TabList aria-label="Icons only">
          <Tab id="grid" icon="grid_view" aria-label="Grid" />
          <Tab id="list" icon="view_list" aria-label="List" />
          <Tab id="map" icon="map" aria-label="Map" />
        </TabList>
      </Tabs>
    </div>
  )
}
