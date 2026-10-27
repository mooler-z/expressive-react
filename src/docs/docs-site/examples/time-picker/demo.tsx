import { useState } from "react"

import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"
import { Time, TimePicker } from "@/components/ui/time-picker"

export default function TimePickerDemo() {
  const [time, setTime] = useState(new Time(9, 41))
  return (
    <div className="rounded-xl bg-surface-container-high shadow-3">
      <TimePicker
        value={time}
        onChange={setTime}
        actions={
          <>
            <Button variant="text" onPress={() => setTime(new Time(9, 41))}>Reset</Button>
            <Button variant="text" onPress={() => snackbar(`Alarm set for ${time.toString().slice(0, 5)}`)}>OK</Button>
          </>
        }
      />
    </div>
  )
}
