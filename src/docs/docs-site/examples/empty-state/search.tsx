import { AssistChip } from "@/components/ui/chip"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

export default function EmptyStateSearch() {
  return (
    <EmptyState
      className="w-full max-w-md"
      size="sm"
      icon="search_off"
      shape="cookie7"
      title="No results for “chekout”"
      description="Check the spelling, or try one of these:"
      actions={["checkout-api", "checkout-web", "cart"].map((s) => (
        <AssistChip key={s} icon={<Icon name="search" />} onPress={() => snackbar(`Searching “${s}”`)}>
          {s}
        </AssistChip>
      ))}
    />
  )
}
