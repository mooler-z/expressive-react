import { AppearancePanel } from "@/components/ui/appearance-picker"
import { THEME_PRESETS } from "@/components/ui/theme-presets"

const LOOKS = THEME_PRESETS.filter((p) => ["henon", "pulse", "campus", "paper", "midnight", "sunny-beach"].includes(p.id))

export default function AppearancePanelExample() {
  return (
    <div className="w-full max-w-sm rounded-lg bg-surface-container-low p-4">
      <AppearancePanel presets={LOOKS} title="Theme" description="Pick a look for your workspace." />
    </div>
  )
}
