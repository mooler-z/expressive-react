import { TopAppBar } from "@/components/ui/app-bar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs"

export default function AppBarTabs() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-outline-variant">
      <Tabs>
        <TopAppBar
          variant="center"
          title="Library"
          navigation={
            <IconButton aria-label="Open navigation">
              <Icon name="menu" />
            </IconButton>
          }
          actions={
            <IconButton aria-label="Search">
              <Icon name="search" />
            </IconButton>
          }
          bottom={
            <TabList aria-label="Library sections">
              <Tab id="music">Music</Tab>
              <Tab id="podcasts">Podcasts</Tab>
              <Tab id="books">Books</Tab>
            </TabList>
          }
        />
        <TabPanel id="music" className="p-4 text-body-md text-on-surface-variant">42 albums, 6 playlists</TabPanel>
        <TabPanel id="podcasts" className="p-4 text-body-md text-on-surface-variant">12 shows you follow</TabPanel>
        <TabPanel id="books" className="p-4 text-body-md text-on-surface-variant">3 books in progress</TabPanel>
      </Tabs>
    </div>
  )
}
