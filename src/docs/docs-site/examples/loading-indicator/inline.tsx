import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { LoadingIndicator } from "@/components/ui/loading-indicator"

export default function LoadingIndicatorInline() {
  const [syncing, setSyncing] = useState(false)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="inline-flex h-14 items-center gap-3 rounded-full bg-surface-container-high pr-6 pl-4 text-label-lg">
        <LoadingIndicator size={28} aria-label="Syncing records" />
        Syncing 1,204 records…
      </div>
      <Button
        variant="tonal"
        isPending={syncing}
        icon={<Icon name="sync" />}
        onPress={() => {
          setSyncing(true)
          setTimeout(() => setSyncing(false), 1800)
        }}
      >
        {syncing ? "Syncing…" : "Sync now"}
      </Button>
    </div>
  )
}
