import { Slider } from "@/components/ui/slider"

export default function SliderSizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Slider aria-label="Extra small" size="xs" defaultValue={30} />
      <Slider aria-label="Small" size="sm" defaultValue={40} />
      <Slider aria-label="Medium" size="md" defaultValue={50} />
      <Slider aria-label="Large" size="lg" defaultValue={60} />
      <Slider aria-label="Extra large" size="xl" defaultValue={70} />
    </div>
  )
}
