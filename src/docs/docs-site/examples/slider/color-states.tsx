import { Slider } from "@/components/ui/slider"

export default function SliderColorStates() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Slider label="Tertiary" color="tertiary" defaultValue={45} />
      <Slider label="Over quota" color="error" showOutput defaultValue={92} />
      <Slider label="Disabled" isDisabled defaultValue={35} />
    </div>
  )
}
