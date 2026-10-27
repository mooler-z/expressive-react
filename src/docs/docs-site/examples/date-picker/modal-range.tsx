import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DateRangePickerDialog, type DateRange } from "@/components/ui/date-picker"
import { DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"

export default function DatePickerModalRange() {
  const [range, setRange] = useState<DateRange | null>(null)
  return (
    <div className="flex flex-col items-center gap-3">
      <DialogTrigger>
        <Button variant="outlined" icon={<Icon name="date_range" />}>Choose dates</Button>
        <DateRangePickerDialog title="Freeze window" value={range} onChange={setRange} />
      </DialogTrigger>
      <p className="text-body-sm text-on-surface-variant">
        {range ? `${range.start.toString()} → ${range.end.toString()}` : "No window set"}
      </p>
    </div>
  )
}
