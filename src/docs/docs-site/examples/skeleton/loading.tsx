import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

export default function SkeletonLoading() {
  const [loading, setLoading] = React.useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div aria-busy={loading} className="w-full rounded-md bg-surface-container-low p-4">
        {loading ? (
          <div className="flex gap-3">
            <Skeleton className="size-10 rounded-full" />
            <SkeletonText className="flex-1" lines={2} />
          </div>
        ) : (
          <div className="flex gap-3">
            <Avatar name="Maya Lindqvist" />
            <p className="text-body-md text-on-surface">
              <strong className="font-medium">Maya</strong> promoted checkout-api to production.
            </p>
          </div>
        )}
      </div>
      <Button variant="tonal" onPress={() => setLoading((l) => !l)}>
        {loading ? "Finish loading" : "Load again"}
      </Button>
    </div>
  )
}
