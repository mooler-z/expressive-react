import { Time, parseDate } from "@internationalized/date"

import { DateField, TimeField } from "@/components/ui/date-field"

export default function DateFieldDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <DateField label="Start date" defaultValue={parseDate("2026-10-29")} description="MM/DD/YYYY" />
      <TimeField label="Start time" defaultValue={new Time(9, 30)} description="hh:mm AM/PM" />
    </div>
  )
}
