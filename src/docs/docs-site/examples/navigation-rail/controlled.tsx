import { useState } from "react"

import { Button } from "@/components/ui/button"
import { NavigationRail, NavigationRailHeader, NavigationRailItem, NavigationRailMenuButton } from "@/components/ui/navigation-rail"

export default function NavigationRailControlled() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <div className="flex h-80 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface">
        <NavigationRail expanded={expanded} onExpandedChange={setExpanded} defaultValue="docs">
          <NavigationRailHeader>
            <NavigationRailMenuButton />
          </NavigationRailHeader>
          <NavigationRailItem value="docs" icon="description" label="Documents" />
          <NavigationRailItem value="sheets" icon="table_chart" label="Spreadsheets" />
          <NavigationRailItem value="slides" icon="slideshow" label="Presentations" />
        </NavigationRail>
        <div className="flex-1 bg-surface-container-low" />
      </div>
      <Button variant="tonal" size="xs" onPress={() => setExpanded((e) => !e)}>
        {expanded ? "Collapse" : "Expand"} from outside
      </Button>
    </div>
  )
}
