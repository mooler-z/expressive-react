import { todayDate } from "@/components/ui/calendar"
import { DateRangePicker } from "@/components/ui/date-picker"

export default function DatePickerRange() {
  const today = todayDate()
  return (
    <div className="w-full max-w-sm">
      <DateRangePicker label="Stay" defaultValue={{ start: today.add({ days: 7 }), end: today.add({ days: 11 }) }} />
    </div>
  )
}
