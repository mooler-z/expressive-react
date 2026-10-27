import { Divider } from "@/components/ui/divider"
import { Icon } from "@/components/ui/icon"
import { List, ListItem, ListSubheader } from "@/components/ui/list"

export default function ListSubheaders() {
  return (
    <div className="w-full max-w-md rounded-lg bg-surface-container-low py-2">
      <ListSubheader>Today</ListSubheader>
      <List className="py-0">
        <ListItem leading={<Icon name="description" />} trailingText="10:02">Release notes</ListItem>
        <ListItem leading={<Icon name="description" />} trailingText="08:47">Incident review</ListItem>
      </List>
      <Divider inset="middle" className="my-2" />
      <ListSubheader>Earlier</ListSubheader>
      <List className="py-0">
        <ListItem leading={<Icon name="description" />} trailingText="Mon">Quarterly plan</ListItem>
      </List>
    </div>
  )
}
