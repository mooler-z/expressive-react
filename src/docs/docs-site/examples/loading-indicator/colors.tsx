import { LoadingIndicator } from "@/components/ui/loading-indicator"

export default function LoadingIndicatorColors() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <LoadingIndicator className="text-tertiary" />
      <LoadingIndicator contained className="bg-secondary-container text-on-secondary-container" />
      <LoadingIndicator contained className="bg-tertiary-container text-on-tertiary-container" />
      <div className="grid size-20 place-items-center rounded-xl bg-primary">
        <LoadingIndicator className="text-on-primary" />
      </div>
    </div>
  )
}
