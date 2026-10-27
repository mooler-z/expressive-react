import { isWeekend } from "@internationalized/date"
import { useLocale } from "react-aria-components"

import { todayDate } from "@/components/ui/calendar"
import { DatePicker } from "@/components/ui/date-picker"

export default function DatePickerValidation() {
  const { locale } = useLocale()
  const today = todayDate()
  return (
    <div className="grid w-full max-w-xl gap-6 sm:grid-cols-2">
      <DatePicker
        label="Delivery"
        minValue={today}
        isDateUnavailable={(date) => isWeekend(date, locale)}
        description="Weekdays only"
        errorMessage="Pick a weekday from today on"
      />
      <DatePicker label="Ship date" variant="filled" isDisabled defaultValue={today} />
    </div>
  )
}
