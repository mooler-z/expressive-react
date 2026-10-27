import { Time, parseDate } from "@internationalized/date"

import { DateField, TimeField } from "@/components/ui/date-field"

export default function DateFieldStates() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <DateField label="Created" defaultValue={parseDate("2026-03-14")} isReadOnly description="Set when the workspace was created" />
      <TimeField label="Backup time" defaultValue={new Time(2, 0)} isDisabled description="Managed by your plan" />
    </div>
  )
}
