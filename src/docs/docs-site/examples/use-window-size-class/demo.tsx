import { WINDOW_SIZE_CLASSES, useWindowSizeClass } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"

export default function WindowSizeClassDemo() {
  const size = useWindowSizeClass()

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <p className="text-center text-body-lg">
        This window is <span className="font-medium text-primary">{size}</span>. Resize it.
      </p>
      <div className="grid grid-cols-5 gap-1">
        {WINDOW_SIZE_CLASSES.map((c) => (
          <div
            key={c.name}
            className={cn(
              "rounded-md px-2 py-3 text-center transition-colors duration-(--md-spring-default-effects-duration)",
              c.name === size ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant",
            )}
          >
            <div className="text-label-md">{c.name}</div>
            <div className="text-label-sm tabular-nums opacity-80">≥ {c.min}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
