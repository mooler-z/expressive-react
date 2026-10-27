import { useState } from "react"

import { ExtendedFab } from "@/components/ui/fab"
import { Switch } from "@/components/ui/switch"

export default function FabCollapse() {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="flex flex-col items-center gap-6">
      <ExtendedFab icon="navigation" size="md" expanded={expanded}>
        Navigate
      </ExtendedFab>
      <Switch isSelected={expanded} onChange={setExpanded}>
        Expanded
      </Switch>
    </div>
  )
}
