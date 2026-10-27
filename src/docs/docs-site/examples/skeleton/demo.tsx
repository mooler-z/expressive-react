import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

export default function SkeletonDemo() {
  return (
    <div className="w-full max-w-sm rounded-md bg-surface-container-low p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-2/5 rounded-full" />
          <Skeleton className="h-3 w-1/4 rounded-full" />
        </div>
      </div>
      <Skeleton className="mt-4 aspect-video w-full rounded-md" />
      <SkeletonText className="mt-4" lines={3} />
    </div>
  )
}
