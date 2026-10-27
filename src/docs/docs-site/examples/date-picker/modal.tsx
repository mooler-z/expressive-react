import { useState } from "react"
import type { DateValue } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { DatePickerDialog } from "@/components/ui/date-picker"
import { DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"

export default function DatePickerModal() {
  const [date, setDate] = useState<DateValue | null>(null)
  return (
    <div className="flex flex-col items-center gap-3">
      <DialogTrigger>
        <Button variant="tonal" icon={<Icon name="event" />}>Pick a date</Button>
        <DatePickerDialog title="Select launch date" value={date} onChange={setDate} />
      </DialogTrigger>
      <p className="text-body-sm text-on-surface-variant">{date ? `Launch on ${date.toString()}` : "No date picked"}</p>
    </div>
  )
}
