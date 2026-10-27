import { TopAppBar } from "@/components/ui/app-bar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"

export default function AppBarDemo() {
  return (
    <div className="relative h-72 w-full max-w-md overflow-y-auto rounded-xl border border-outline-variant bg-surface [scrollbar-width:thin]">
      <TopAppBar
        variant="medium"
        title="Inbox"
        navigation={
          <IconButton aria-label="Open navigation" onPress={() => snackbar("Navigation")}>
            <Icon name="menu" />
          </IconButton>
        }
        actions={
          <>
            <IconButton aria-label="Search" onPress={() => snackbar("Search")}>
              <Icon name="search" />
            </IconButton>
            <IconButton aria-label="More options" onPress={() => snackbar("More options")}>
              <Icon name="more_vert" />
            </IconButton>
          </>
        }
      />
      <ul className="space-y-2 px-4 pb-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="h-14 rounded-md bg-surface-container" />
        ))}
      </ul>
    </div>
  )
}
