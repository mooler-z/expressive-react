import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { SearchItem, SearchSection, SearchView } from "@/components/ui/search"
import { snackbar } from "@/components/ui/snackbar"

export default function SearchFullscreen() {
  return (
    <div className="w-full max-w-sm">
      <SearchView
        mode="fullscreen"
        placeholder="Search contacts"
        leading={
          <IconButton aria-label="Open navigation">
            <Icon name="menu" />
          </IconButton>
        }
        onAction={(key) => snackbar(`Calling ${key}`)}
      >
        <SearchSection title="Favorites">
          <SearchItem id="Ada" icon="star">Ada Okafor</SearchItem>
          <SearchItem id="Lars" icon="star">Lars Eriksen</SearchItem>
        </SearchSection>
        <SearchSection title="All contacts">
          <SearchItem id="Maya" icon="person">Maya Lindqvist</SearchItem>
          <SearchItem id="Noor" icon="person">Noor Haddad</SearchItem>
          <SearchItem id="Tomás" icon="person">Tomás Rivera</SearchItem>
        </SearchSection>
      </SearchView>
    </div>
  )
}
