import { TopAppBar } from "@/components/ui/app-bar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

function Back() {
  return (
    <IconButton aria-label="Back">
      <Icon name="arrow_back" />
    </IconButton>
  )
}

function More() {
  return (
    <IconButton aria-label="More options">
      <Icon name="more_vert" />
    </IconButton>
  )
}

export default function AppBarVariants() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <TopAppBar variant="small" title="Small" navigation={<Back />} actions={<More />} />
      </div>
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <TopAppBar variant="center" title="Center-aligned" navigation={<Back />} actions={<More />} />
      </div>
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <TopAppBar variant="medium" title="Medium flexible" navigation={<Back />} actions={<More />} />
      </div>
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <TopAppBar variant="large" title="Large flexible" navigation={<Back />} actions={<More />} />
      </div>
    </div>
  )
}
