import * as React from "react"

import { Button } from "@/components/ui/button"
import { DirectionProvider, useDirection } from "@/components/ui/direction"
import { Icon } from "@/components/ui/icon"
import { Switch } from "@/components/ui/switch"

function Row() {
  const dir = useDirection()
  return (
    <div className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
      <Icon name="arrow_back" className="rtl:-scale-x-100" />
      <span className="flex-1 text-body-md text-on-surface">Reading direction: {dir}</span>
      <Button variant="tonal" size="xs">
        Next
      </Button>
    </div>
  )
}

export default function DirectionToggle() {
  const [rtl, setRtl] = React.useState(false)
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Switch isSelected={rtl} onChange={setRtl}>
        Right to left
      </Switch>
      <DirectionProvider dir={rtl ? "rtl" : "ltr"}>
        <Row />
      </DirectionProvider>
    </div>
  )
}
