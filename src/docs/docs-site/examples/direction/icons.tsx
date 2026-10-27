import { DirectionProvider } from "@/components/ui/direction"
import { Icon } from "@/components/ui/icon"

const DIRECTIONAL = ["arrow_forward", "chevron_right", "send", "reply"]
const NEUTRAL = ["search", "check", "play_arrow", "schedule"]

export default function DirectionIcons() {
  return (
    <DirectionProvider dir="rtl" className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg bg-surface-container-low p-4">
        <p className="mb-3 text-label-lg text-on-surface-variant">Mirror (rtl:-scale-x-100)</p>
        <div className="flex gap-4 text-primary">
          {DIRECTIONAL.map((name) => (
            <Icon key={name} name={name} className="rtl:-scale-x-100" />
          ))}
        </div>
      </div>
      <div className="rounded-lg bg-surface-container-low p-4">
        <p className="mb-3 text-label-lg text-on-surface-variant">Don't mirror</p>
        <div className="flex gap-4 text-on-surface">
          {NEUTRAL.map((name) => (
            <Icon key={name} name={name} />
          ))}
        </div>
      </div>
    </DirectionProvider>
  )
}
