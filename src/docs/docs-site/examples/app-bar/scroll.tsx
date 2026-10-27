import { TopAppBar } from "@/components/ui/app-bar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function AppBarScroll() {
  return (
    <div className="relative h-80 w-full max-w-md overflow-y-auto rounded-xl border border-outline-variant bg-surface [scrollbar-width:thin]">
      <TopAppBar
        variant="large"
        title="Photos"
        subtitle="1,284 items · synced"
        navigation={
          <IconButton aria-label="Back">
            <Icon name="arrow_back" />
          </IconButton>
        }
        actions={
          <IconButton aria-label="Select">
            <Icon name="checklist" />
          </IconButton>
        }
      />
      <div className="grid grid-cols-3 gap-1 px-4 pb-4">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="aspect-square rounded-sm bg-surface-container-high" />
        ))}
      </div>
    </div>
  )
}
