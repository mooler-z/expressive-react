import { isWeekend } from "@internationalized/date"
import { useLocale, type DateValue } from "react-aria-components"

import { Calendar, todayDate } from "@/components/ui/calendar"

export default function CalendarUnavailable() {
  const { locale } = useLocale()
  const today = todayDate()
  return (
    <div className="w-full max-w-[360px] rounded-xl bg-surface-container-high p-3">
      <Calendar
        aria-label="Delivery date"
        minValue={today}
        maxValue={today.add({ weeks: 6 })}
        isDateUnavailable={(date: DateValue) => isWeekend(date, locale)}
      />
    </div>
  )
}
