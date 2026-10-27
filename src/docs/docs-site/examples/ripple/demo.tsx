import { Ripple } from "@/components/ui/ripple"

export default function RippleDemo() {
  return (
    <button
      type="button"
      className="state-layer focus-ring relative grid h-40 w-full max-w-sm cursor-pointer place-items-center rounded-xl bg-primary-container text-title-md text-on-primary-container"
    >
      Press anywhere
      <Ripple />
    </button>
  )
}
