import { RangeCalendar, todayDate } from "@/components/ui/calendar"

export default function CalendarRange() {
  const today = todayDate()
  return (
    <div className="w-full max-w-[360px] rounded-xl bg-surface-container-high p-3">
      <RangeCalendar aria-label="Trip" defaultValue={{ start: today.add({ days: 3 }), end: today.add({ days: 9 }) }} />
    </div>
  )
}
