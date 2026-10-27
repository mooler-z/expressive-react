import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export default function EmptyStateVariants() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      <div className="rounded-lg bg-surface-container-low p-2">
        <EmptyState size="sm" icon="task_alt" title="No incidents. Nice." description='variant="default"' />
      </div>
      <EmptyState size="sm" variant="dashed" icon="upload_file" title="Drop a CSV here" description='variant="dashed"' actions={<Button variant="tonal" size="xs">Browse</Button>} />
      <EmptyState size="sm" variant="plain" icon="bar_chart" title="No data yet" description='variant="plain"' />
    </div>
  )
}
