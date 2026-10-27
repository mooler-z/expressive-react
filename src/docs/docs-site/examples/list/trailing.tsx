import { Icon } from "@/components/ui/icon"
import { List, ListItem } from "@/components/ui/list"
import { Switch } from "@/components/ui/switch"

export default function ListTrailing() {
  return (
    <List className="w-full max-w-md rounded-lg bg-surface-container-low">
      <ListItem leading={<Icon name="dark_mode" />} trailing={<Switch aria-label="Dark theme" defaultSelected />}>
        Dark theme
      </ListItem>
      <ListItem leading={<Icon name="cloud_download" />} supportingText="Wi-Fi only" trailing={<Switch aria-label="Auto-download" />}>
        Auto-download
      </ListItem>
      <ListItem leading={<Icon name="storage" />} trailingText="2.4 GB" trailing={<Icon name="chevron_right" />}>
        Storage
      </ListItem>
    </List>
  )
}
