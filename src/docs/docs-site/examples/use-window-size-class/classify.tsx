import { windowSizeClass } from "@/hooks/use-window-size-class"

const WIDTHS = [360, 600, 768, 840, 1200, 1440, 1920]

export default function WindowSizeClassify() {
  return (
    <div className="w-full max-w-sm overflow-hidden rounded-lg border border-outline-variant">
      {WIDTHS.map((w) => (
        <div key={w} className="flex items-center justify-between border-b border-outline-variant px-4 py-2 last:border-b-0">
          <span className="font-mono text-body-md tabular-nums">{w}px</span>
          <span className="text-label-lg text-primary">{windowSizeClass(w)}</span>
        </div>
      ))}
    </div>
  )
}
