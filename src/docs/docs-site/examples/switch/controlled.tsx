import { useState } from "react"

import { Switch } from "@/components/ui/switch"

export default function SwitchControlled() {
  const [on, setOn] = useState(false)
  return (
    <Switch isSelected={on} onChange={setOn}>
      Maintenance mode · <span className={on ? "text-primary" : "text-on-surface-variant"}>{on ? "On" : "Off"}</span>
    </Switch>
  )
}
