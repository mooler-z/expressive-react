import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Command, CommandInput, CommandList } from "@/components/ui/command"
import { Icon } from "@/components/ui/icon"

export default function CommandLoadingEmpty() {
  const [loading, setLoading] = useState(true)
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="w-full overflow-hidden rounded-xl bg-surface-container-high">
        <Command>
          <CommandInput placeholder="Search incidents" autoFocus={false} hint={null} />
          <CommandList
            isLoading={loading}
            loadingText="Searching incidents…"
            emptyState={
              <span className="flex flex-col items-center gap-2">
                <Icon name="task_alt" size={32} />
                No open incidents
              </span>
            }
          >
            {[]}
          </CommandList>
        </Command>
      </div>
      <Button variant="text" size="xs" onPress={() => setLoading((l) => !l)}>
        {loading ? "Show empty state" : "Show loading"}
      </Button>
    </div>
  )
}
