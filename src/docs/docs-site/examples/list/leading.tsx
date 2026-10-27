import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { List, ListItem, ListItemMedia } from "@/components/ui/list"

export default function ListLeading() {
  return (
    <List className="w-full max-w-md rounded-lg bg-surface-container-low">
      <ListItem leading={<Icon name="folder" />} supportingText="Icon · 24dp">
        Projects
      </ListItem>
      <ListItem leading={<Avatar name="Ana Ruiz" />} supportingText="Avatar · 40dp">
        Ana Ruiz
      </ListItem>
      <ListItem
        leading={
          <ListItemMedia className="bg-tertiary-container text-on-tertiary-container">
            <Icon name="image" />
          </ListItemMedia>
        }
        supportingText="Image · 56dp"
      >
        Glacier Peak
      </ListItem>
      <ListItem
        leading={
          <ListItemMedia variant="video" className="bg-primary-container text-on-primary-container">
            <Icon name="play_circle" />
          </ListItemMedia>
        }
        supportingText="Video · 100×56dp"
      >
        Release keynote
      </ListItem>
    </List>
  )
}
