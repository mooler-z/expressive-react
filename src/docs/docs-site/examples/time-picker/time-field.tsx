import { TimeField } from "@/components/ui/date-field"
import { Time } from "@/components/ui/time-picker"

export default function TimePickerTimeField() {
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <TimeField label="Start time" defaultValue={new Time(9, 0)} leading="schedule" />
      <TimeField label="End time · 24h" hourCycle={24} variant="filled" defaultValue={new Time(17, 30)} />
    </div>
  )
}
