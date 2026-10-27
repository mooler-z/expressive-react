import { LoadingIndicator } from "@/components/ui/loading-indicator"

export default function LoadingIndicatorDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      <LoadingIndicator />
      <LoadingIndicator contained />
    </div>
  )
}
