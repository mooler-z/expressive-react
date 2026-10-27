import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonStagger() {
  return (
    <div className="w-full max-w-md divide-y divide-outline-variant rounded-md bg-surface-container-low">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          <Skeleton delay={i * 120} className="size-8 rounded-full" />
          <Skeleton delay={i * 120} className="h-3 flex-1 rounded-full" />
          <Skeleton delay={i * 120} className="h-3 w-12 rounded-full" />
        </div>
      ))}
    </div>
  )
}
