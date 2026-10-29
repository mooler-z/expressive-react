import { AppearancePicker } from "@/components/ui/appearance-picker"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"

export default function AppearancePickerDemo() {
  return (
    <div className="flex w-full max-w-lg items-center gap-1 rounded-lg bg-surface-container px-2 py-1">
      <IconButton aria-label="Menu">
        <Icon name="menu" />
      </IconButton>
      <span className="flex-1 truncate text-title-lg">Attendance</span>
      <AppearancePicker description="Saved in this browser." defaultLabel="Default" />
      <IconButton aria-label="Account">
        <Icon name="account_circle" />
      </IconButton>
    </div>
  )
}
