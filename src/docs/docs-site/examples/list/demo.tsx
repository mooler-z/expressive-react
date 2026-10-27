import { Avatar } from "@/components/ui/avatar"
import { List, ListItem } from "@/components/ui/list"

export default function ListDemo() {
  return (
    <List className="w-full max-w-md rounded-lg bg-surface-container-low">
      <ListItem leading={<Avatar name="Maya Lindqvist" />} supportingText="Deploy finished on prod-eu" trailingText="09:41">
        Maya Lindqvist
      </ListItem>
      <ListItem leading={<Avatar name="Ana Ruiz" />} supportingText="Can you review the theme PR?" trailingText="08:12">
        Ana Ruiz
      </ListItem>
      <ListItem leading={<Avatar name="Kenji Sato" />} supportingText="Lunch at 12:30?" trailingText="Yesterday">
        Kenji Sato
      </ListItem>
    </List>
  )
}
