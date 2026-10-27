import { Kbd, KbdGroup } from "@/components/ui/kbd"

export default function CodeBlockKbd() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Kbd size="sm">Esc</Kbd>
        <Kbd>Tab</Kbd>
        <Kbd size="lg">Enter</Kbd>
        <Kbd variant="tonal">Space</Kbd>
      </div>
      <div className="flex flex-wrap items-center gap-6 text-body-md text-on-surface-variant">
        <span className="inline-flex items-center gap-2">
          Search <KbdGroup keys={["⌘", "K"]} />
        </span>
        <span className="inline-flex items-center gap-2">
          Go to dashboard <KbdGroup keys={["G", "D"]} separator="then" variant="tonal" />
        </span>
      </div>
    </div>
  )
}
