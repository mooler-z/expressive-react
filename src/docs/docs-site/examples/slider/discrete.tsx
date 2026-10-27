import { Slider } from "@/components/ui/slider"

export default function SliderDiscrete() {
  return (
    <div className="w-full max-w-md">
      <Slider label="Replicas" showOutput defaultValue={4} minValue={0} maxValue={10} step={1} valueIndicator="always" className="pt-10" />
    </div>
  )
}
