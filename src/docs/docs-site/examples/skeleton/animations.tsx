import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonAnimations() {
  return (
    <div className="grid w-full max-w-xl gap-4 sm:grid-cols-3">
      {(["pulse", "shimmer", "none"] as const).map((animation) => (
        <div key={animation} className="space-y-2">
          <Skeleton animation={animation} className="h-24 rounded-md" />
          <p className="text-center font-mono text-label-md text-on-surface-variant">{animation}</p>
        </div>
      ))}
    </div>
  )
}
