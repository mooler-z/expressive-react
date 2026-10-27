import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

export default function EmptyStateMedia() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <EmptyState
        variant="dashed"
        media={
          <span className="grid size-20 place-items-center rounded-full bg-error-container text-on-error-container">
            <Icon name="cloud_off" size={36} />
          </span>
        }
        title="Couldn't load incidents"
        description="The incidents service didn't respond. Your data is safe."
        actions={<Button variant="tonal" icon={<Icon name="refresh" />} onPress={() => snackbar("Retrying…")}>Try again</Button>}
      />
      <EmptyState
        variant="dashed"
        media={
          <span className="grid size-20 place-items-center rounded-lg bg-secondary-container text-on-secondary-container">
            <Icon name="lock" size={36} />
          </span>
        }
        title="You need Admin access"
        description="Ask a workspace owner to change your role."
        actions={<Button variant="outlined" onPress={() => snackbar("Request sent")}>Request access</Button>}
      />
    </div>
  )
}
