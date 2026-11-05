import { useState } from "react"
import { parseDate } from "@internationalized/date"
import { I18nProvider, type DateValue } from "react-aria-components"

import { DateField } from "@/components/ui/date-field"

export default function DateFieldEthiopian() {
  const [date, setDate] = useState<DateValue | null>(parseDate("2014-09-20"))
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <I18nProvider locale="am-ET-u-ca-ethiopic">
        <DateField label="የልደት ቀን" value={date} onChange={setDate} description="DD/MM/YYYY" />
      </I18nProvider>
      <I18nProvider locale="en-GB-u-ca-ethiopic">
        <DateField label="Date of birth" value={date} onChange={setDate} description={`Stored as ${date?.toString() ?? "—"}`} />
      </I18nProvider>
    </div>
  )
}
