import { Time, TimePicker } from "@/components/ui/time-picker"

export default function TimePicker24Hour() {
  return (
    <div className="rounded-xl bg-surface-container-high shadow-3">
      <TimePicker hourCycle={24} defaultValue={new Time(18, 15)} title="Select time · 24h" />
    </div>
  )
}
