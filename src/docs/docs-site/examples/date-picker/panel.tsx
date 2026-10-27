import { DatePickerPanel } from "@/components/ui/date-picker"
import { snackbar } from "@/components/ui/snackbar"

export default function DatePickerPanelExample() {
  return (
    <div className="w-full max-w-[360px] overflow-hidden rounded-xl bg-surface-container-high">
      <DatePickerPanel
        title="Select date"
        defaultMode="input"
        onConfirm={(date) => snackbar(date ? `Saved ${date.toString()}` : "Cleared")}
        onCancel={() => snackbar("Cancelled")}
      />
    </div>
  )
}
