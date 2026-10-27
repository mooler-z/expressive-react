import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Row, Section } from "@/docs/section"

export default function LoadingSection() {
  return (
    <Section
      id="loading"
      description="New in Expressive: a morphing shape for short indeterminate waits. Default and contained."
      spec="https://m3.material.io/components/loading-indicator/overview"
    >
      <Row label="Default · contained · inline">
        <LoadingIndicator />
        <LoadingIndicator contained />
        <LoadingIndicator contained className="bg-secondary-container text-on-secondary-container" />
        <div className="inline-flex h-14 items-center gap-3 rounded-full bg-surface-container-high pr-6 pl-4 text-label-lg">
          <LoadingIndicator size={28} />
          Syncing 1,204 records…
        </div>
      </Row>
    </Section>
  )
}
