import { EmptyState } from "@/components/ui/empty-state"

export default function EmptyStateShapes() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      <EmptyState size="sm" variant="dashed" icon="inbox" title="Morphing (default)" description="Cycles clover → cookie → sunny." />
      <EmptyState size="sm" variant="dashed" icon="favorite" shape="cookie9" title="Fixed shape" description='shape="cookie9"' />
      <EmptyState size="sm" variant="dashed" icon="search_off" shape={false} title="Bare icon" description="shape={false}" />
    </div>
  )
}
