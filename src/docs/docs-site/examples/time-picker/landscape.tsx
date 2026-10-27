import { Time, TimePicker } from "@/components/ui/time-picker"

export default function TimePickerLandscape() {
  return (
    <div className="max-w-full overflow-x-auto">
      <div className="w-fit rounded-xl bg-surface-container-high shadow-3">
        <TimePicker orientation="horizontal" defaultValue={new Time(11, 5)} showModeToggle={false} />
      </div>
    </div>
  )
}
