import { Radio, RadioGroup } from "@/components/ui/radio"

const ZONES = ["Europe/Berlin", "America/New_York", "Asia/Tokyo"]

export default function RadioTrailing() {
  return (
    <RadioGroup aria-label="Time zone" defaultValue="Europe/Berlin" className="w-full max-w-sm">
      <div className="divide-y divide-outline-variant overflow-hidden rounded-lg bg-surface-container-low">
        {ZONES.map((zone) => (
          <Radio key={zone} value={zone} placement="end" className="w-full justify-between pl-4">
            {zone}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  )
}
