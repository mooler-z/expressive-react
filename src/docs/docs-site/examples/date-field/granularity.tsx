import { Time, parseDateTime } from "@internationalized/date"

import { DateField, TimeField } from "@/components/ui/date-field"

export default function DateFieldGranularity() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <DateField label="Deploy at" granularity="minute" defaultValue={parseDateTime("2026-10-29T14:45")} />
      <TimeField label="Cutoff · 24-hour" hourCycle={24} granularity="second" defaultValue={new Time(18, 45, 0)} />
    </div>
  )
}
