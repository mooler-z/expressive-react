import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { Time, TimePickerDialog } from "@/components/ui/time-picker"

export default function TimePickerDialogExample() {
  const [time, setTime] = useState(new Time(7, 30))
  return (
    <div className="flex flex-col items-center gap-3">
      <DialogTrigger>
        <Button variant="tonal" icon={<Icon name="alarm" />}>Set alarm</Button>
        <TimePickerDialog value={time} onChange={setTime} />
      </DialogTrigger>
      <p className="text-body-sm text-on-surface-variant">Alarm at {time.toString().slice(0, 5)}</p>
    </div>
  )
}
