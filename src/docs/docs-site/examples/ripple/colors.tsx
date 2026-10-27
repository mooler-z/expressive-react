import { Ripple } from "@/components/ui/ripple"

export default function RippleColors() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <button type="button" className="state-layer relative size-28 cursor-pointer rounded-lg bg-surface-container text-primary">
        primary
        <Ripple />
      </button>
      <button type="button" className="state-layer relative size-28 cursor-pointer rounded-lg bg-tertiary text-on-tertiary">
        on-tertiary
        <Ripple />
      </button>
      <button type="button" className="state-layer relative size-28 cursor-pointer rounded-full bg-surface-container text-on-surface">
        error ripple
        <Ripple className="text-error" />
      </button>
    </div>
  )
}
