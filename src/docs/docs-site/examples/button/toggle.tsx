import { ToggleButton } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

export default function ButtonToggle() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ToggleButton variant="elevated">Elevated</ToggleButton>
      <ToggleButton defaultSelected>Filled</ToggleButton>
      <ToggleButton variant="tonal" defaultSelected>Tonal</ToggleButton>
      <ToggleButton variant="outlined">Outlined</ToggleButton>
      <ToggleButton variant="text" icon={<Icon name="favorite" />}>Text</ToggleButton>
    </div>
  )
}
