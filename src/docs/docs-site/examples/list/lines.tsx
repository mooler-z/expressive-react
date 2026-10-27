import { Icon } from "@/components/ui/icon"
import { List, ListItem } from "@/components/ui/list"

export default function ListLines() {
  return (
    <List className="w-full max-w-md rounded-lg bg-surface-container-low">
      <ListItem leading={<Icon name="wifi" />}>One line · 56dp</ListItem>
      <ListItem leading={<Icon name="bluetooth" />} supportingText="Supporting text adds a line">
        Two lines · 72dp
      </ListItem>
      <ListItem
        leading={<Icon name="notifications" />}
        overline="Overline"
        supportingText="Three-line items clamp supporting text to two lines and align to the top."
      >
        Three lines · 88dp
      </ListItem>
    </List>
  )
}
