import { DateField, TimeField } from "@/components/ui/date-field"

export default function DateFieldVariants() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <DateField variant="filled" label="Birthday" leading="cake" />
      <TimeField variant="filled" label="Reminder" />
    </div>
  )
}
