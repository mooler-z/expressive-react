import { LoadingIndicator } from "@/components/ui/loading-indicator"

export default function LoadingIndicatorShapes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-10">
      <LoadingIndicator size={64} shapes={["circle", "squircle", "cookie4"]} />
      <LoadingIndicator size={64} contained shapes={["sunny", "verySunny", "burst"]} />
      <LoadingIndicator size={64} shapes={["triangle", "diamond", "pentagon", "hexagon"]} className="text-tertiary" />
    </div>
  )
}
