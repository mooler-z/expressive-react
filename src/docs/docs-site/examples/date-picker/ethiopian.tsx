import { parseDate } from "@internationalized/date"
import { I18nProvider } from "react-aria-components"

import { DatePicker } from "@/components/ui/date-picker"

export default function DatePickerEthiopian() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <I18nProvider locale="am-ET-u-ca-ethiopic">
        <DatePicker label="የልደት ቀን" defaultValue={parseDate("2014-09-20")} description="DD/MM/YYYY" />
      </I18nProvider>
      <I18nProvider locale="en-GB-u-ca-ethiopic">
        <DatePicker label="Registration date" description="DD/MM/YYYY AM" />
      </I18nProvider>
    </div>
  )
}
