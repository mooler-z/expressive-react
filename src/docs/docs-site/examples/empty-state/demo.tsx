import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

export default function EmptyStateDemo() {
  return (
    <EmptyState
      className="w-full max-w-md"
      icon="dns"
      title="Connect your first cluster"
      description="Clusters report health, deploys and incidents here once they're connected."
      actions={
        <>
          <Button icon={<Icon name="add" />} onPress={() => snackbar("Cluster wizard opened")}>
            Connect cluster
          </Button>
          <Button variant="text" onPress={() => snackbar("Opening docs")}>
            Read the guide
          </Button>
        </>
      }
    />
  )
}
