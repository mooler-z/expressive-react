import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Time, TimePicker } from "@/components/ui/time-picker"

export default function TimePickerInput() {
  const [mode, setMode] = useState<"dial" | "input">("dial")
  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="text" onPress={() => setMode(mode === "dial" ? "input" : "dial")}>
        {mode === "dial" ? "Type the time instead" : "Use the dial"}
      </Button>
      <div className="rounded-xl bg-surface-container-high shadow-3">
        <TimePicker mode={mode} onModeChange={setMode} defaultValue={new Time(15, 30)} />
      </div>
    </div>
  )
}
