import { Slider } from "@/components/ui/slider"

const BANDS = [
  ["60", 4],
  ["250", 7],
  ["1k", 5],
  ["4k", 3],
  ["16k", 6],
] as const

export default function SliderVertical() {
  return (
    <div className="flex items-end justify-center gap-6">
      {BANDS.map(([band, value]) => (
        <div key={band} className="flex flex-col items-center gap-2">
          <Slider aria-label={`${band} Hz`} orientation="vertical" size="sm" defaultValue={value} minValue={0} maxValue={10} step={1} />
          <span className="text-label-md text-on-surface-variant">{band}</span>
        </div>
      ))}
    </div>
  )
}
