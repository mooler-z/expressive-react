import { Slider } from "@/components/ui/slider"

export default function SliderDemo() {
  return (
    <div className="w-full max-w-md">
      <Slider label="Spring stiffness" showOutput defaultValue={380} minValue={100} maxValue={1500} />
    </div>
  )
}
