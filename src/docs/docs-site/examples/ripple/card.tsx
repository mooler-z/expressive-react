import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"

export default function RippleCard() {
  return (
    <a
      href="#ripple-card"
      onClick={(e) => e.preventDefault()}
      className="state-layer focus-ring relative flex w-full max-w-sm items-center gap-4 rounded-md bg-surface-container-low p-4 text-on-surface"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-tertiary-container text-on-tertiary-container">
        <Icon name="description" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-title-md">Quarterly report</span>
        <span className="block text-body-md text-on-surface-variant">Edited 2 hours ago</span>
      </span>
      <Icon name="chevron_right" className="text-on-surface-variant" />
      <Ripple />
    </a>
  )
}
