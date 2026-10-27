import { Slider } from "@/components/ui/slider"

export default function SliderCentered() {
  return (
    <div className="w-full max-w-md">
      <Slider label="Balance" showOutput centered defaultValue={20} minValue={-50} maxValue={50} size="sm" />
    </div>
  )
}
