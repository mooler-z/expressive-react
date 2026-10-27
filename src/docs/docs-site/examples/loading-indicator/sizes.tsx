import { LoadingIndicator } from "@/components/ui/loading-indicator"

export default function LoadingIndicatorSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <LoadingIndicator size={24} />
      <LoadingIndicator size={36} />
      <LoadingIndicator size={48} />
      <LoadingIndicator size={72} contained />
    </div>
  )
}
