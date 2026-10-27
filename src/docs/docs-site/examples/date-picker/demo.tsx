import { DatePicker } from "@/components/ui/date-picker"

export default function DatePickerDemo() {
  return (
    <div className="w-full max-w-xs">
      <DatePicker label="Launch date" description="MM/DD/YYYY" />
    </div>
  )
}
