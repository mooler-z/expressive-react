import { Icon } from "@/components/ui/icon"
import { List, ListItem } from "@/components/ui/list"
import { SheetContent, SheetHeader, SheetTitle, StandardBottomSheet } from "@/components/ui/sheet"

export default function StandardBottomSheetExample() {
  return (
    <div className="relative h-80 w-full max-w-md overflow-hidden rounded-lg bg-surface-container">
      <div className="grid h-full place-items-center text-on-surface-variant [--icon-size:48px]">
        <Icon name="map" />
      </div>
      <StandardBottomSheet aria-label="Nearby places" peekHeight={112} className="absolute">
        <SheetHeader className="min-h-10">
          <SheetTitle>3 places nearby</SheetTitle>
        </SheetHeader>
        <SheetContent className="px-0 pb-4">
          <List className="py-0">
            <ListItem leading={<Icon name="local_cafe" />} supportingText="120 m">Kestrel Coffee</ListItem>
            <ListItem leading={<Icon name="local_library" />} supportingText="300 m">City Library</ListItem>
            <ListItem leading={<Icon name="park" />} supportingText="450 m">Riverside Park</ListItem>
          </List>
        </SheetContent>
      </StandardBottomSheet>
    </div>
  )
}
