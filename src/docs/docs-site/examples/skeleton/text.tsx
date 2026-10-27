import { SkeletonText } from "@/components/ui/skeleton"

export default function SkeletonTextExample() {
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <SkeletonText lines={4} />
      <SkeletonText lines={2} lastLineWidth="35%" lineClassName="h-4" animation="shimmer" />
    </div>
  )
}
