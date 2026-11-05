import { useState } from "react"
import { I18nProvider, type DateValue } from "react-aria-components"

import { Calendar, todayDate } from "@/components/ui/calendar"

export default function CalendarEthiopian() {
  const [date, setDate] = useState<DateValue>(todayDate())
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full flex-wrap justify-center gap-4">
        <I18nProvider locale="am-ET-u-ca-ethiopic">
          <div className="w-full max-w-[360px] rounded-xl bg-surface-container-high p-3">
            <Calendar aria-label="ቀን" value={date} onChange={setDate} />
          </div>
        </I18nProvider>
        <I18nProvider locale="en-GB-u-ca-ethiopic">
          <div className="w-full max-w-[360px] rounded-xl bg-surface-container-high p-3">
            <Calendar aria-label="Date" value={date} onChange={setDate} />
          </div>
        </I18nProvider>
      </div>
      <p className="text-body-sm text-on-surface-variant">Value: {date.toString()} (Gregorian, as passed in)</p>
    </div>
  )
}
