import { useState } from "react"
import type { DateValue } from "react-aria-components"

import { Calendar, todayDate } from "@/components/ui/calendar"

export default function CalendarDemo() {
  const [date, setDate] = useState<DateValue>(todayDate())
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-[360px] rounded-xl bg-surface-container-high p-3">
        <Calendar aria-label="Due date" value={date} onChange={setDate} />
      </div>
      <p className="text-body-sm text-on-surface-variant">Due {date.toString()}</p>
    </div>
  )
}
