import { Icon } from "@/components/ui/icon"
import { Slider } from "@/components/ui/slider"

export default function SliderIcon() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Slider aria-label="Volume" size="md" defaultValue={60} icon={<Icon name="volume_up" />} />
      <Slider aria-label="Brightness" size="lg" defaultValue={12} icon={<Icon name="light_mode" />} />
    </div>
  )
}
