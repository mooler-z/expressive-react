import { Icon } from "@/components/ui/icon"
import { useWindowSizeAtLeast } from "@/hooks/use-window-size-class"

const ITEMS = [
  ["home", "Home"],
  ["monitoring", "Metrics"],
  ["notifications", "Alerts"],
  ["settings", "Settings"],
]

export default function WindowSizeAdaptive() {
  const wide = useWindowSizeAtLeast("expanded")

  return (
    <div className="flex w-full max-w-xl flex-col gap-2">
      <div className={wide ? "flex h-56 overflow-hidden rounded-lg bg-surface-container" : "flex h-56 flex-col overflow-hidden rounded-lg bg-surface-container"}>
        {wide && (
          <nav className="flex w-20 flex-col items-center gap-3 bg-surface-container-high py-4">
            {ITEMS.map(([icon, label]) => (
              <span key={label} className="flex flex-col items-center gap-1 text-label-sm text-on-surface-variant">
                <Icon name={icon} />
                {label}
              </span>
            ))}
          </nav>
        )}
        <div className="grid flex-1 place-items-center text-body-md text-on-surface-variant">Content</div>
        {!wide && (
          <nav className="flex h-16 items-center justify-around bg-surface-container-high">
            {ITEMS.map(([icon, label]) => (
              <span key={label} className="flex flex-col items-center gap-0.5 text-label-sm text-on-surface-variant">
                <Icon name={icon} />
                {label}
              </span>
            ))}
          </nav>
        )}
      </div>
      <p className="text-body-sm text-on-surface-variant">{wide ? "840dp and wider, so this layout uses a navigation rail." : "Narrower than 840dp, so this layout uses a navigation bar."}</p>
    </div>
  )
}
