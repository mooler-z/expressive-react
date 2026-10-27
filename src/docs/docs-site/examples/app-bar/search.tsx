import { TopAppBar } from "@/components/ui/app-bar"
import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { SearchBar } from "@/components/ui/search"

export default function AppBarSearch() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-outline-variant">
      <TopAppBar
        navigation={
          <IconButton aria-label="Open navigation">
            <Icon name="menu" />
          </IconButton>
        }
        actions={<Avatar name="Maya Lindqvist" size="sm" color="tertiary" className="mx-2" />}
      >
        <SearchBar placeholder="Search mail" leading={null} className="h-12" />
      </TopAppBar>
    </div>
  )
}
