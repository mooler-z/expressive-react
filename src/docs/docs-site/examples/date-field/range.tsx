import { getLocalTimeZone, today } from "@internationalized/date"

import { DateField } from "@/components/ui/date-field"

export default function DateFieldRange() {
  const now = today(getLocalTimeZone())

  return (
    <DateField
      label="Maintenance window"
      defaultValue={now.subtract({ days: 3 })}
      minValue={now}
      maxValue={now.add({ days: 30 })}
      validationBehavior="aria"
      description="Within the next 30 days"
      errorMessage="Pick a date from today to 30 days out"
      className="max-w-sm"
    />
  )
}
