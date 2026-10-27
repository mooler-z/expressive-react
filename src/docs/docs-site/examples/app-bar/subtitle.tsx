import { TopAppBar } from "@/components/ui/app-bar"
import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function AppBarSubtitle() {
  return (
    <div className="grid w-full max-w-md gap-4">
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <TopAppBar
          title="Maya Lindqvist"
          subtitle="Active 5 min ago"
          navigation={
            <IconButton aria-label="Back">
              <Icon name="arrow_back" />
            </IconButton>
          }
          actions={
            <>
              <IconButton aria-label="Video call">
                <Icon name="videocam" />
              </IconButton>
              <Avatar name="Maya Lindqvist" size="sm" className="mx-2" />
            </>
          }
        />
      </div>
      <div className="overflow-hidden rounded-lg border border-outline-variant">
        <TopAppBar
          variant="medium"
          title="Quarterly report"
          subtitle="Edited yesterday · Finance"
          navigation={
            <IconButton aria-label="Back">
              <Icon name="arrow_back" />
            </IconButton>
          }
          actions={
            <IconButton aria-label="Share">
              <Icon name="share" />
            </IconButton>
          }
        />
      </div>
    </div>
  )
}
