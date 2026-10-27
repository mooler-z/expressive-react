import { Icon } from "@/components/ui/icon"
import { useMediaQuery } from "@/hooks/use-media-query"

const QUERIES = [
  ["(prefers-color-scheme: dark)", "dark_mode", "System prefers dark"],
  ["(prefers-reduced-motion: reduce)", "motion_photos_off", "Reduced motion"],
  ["(hover: hover)", "mouse", "Hover-capable pointer"],
  ["(min-width: 840px)", "width", "At least 840px wide"],
] as const

function QueryRow({ query, icon, label }: { query: string; icon: string; label: string }) {
  const matches = useMediaQuery(query)
  return (
    <div className="flex items-center gap-3 rounded-md bg-surface-container px-4 py-3">
      <Icon name={icon} className="text-on-surface-variant" />
      <div className="min-w-0 flex-1">
        <div className="text-body-md">{label}</div>
        <code className="font-mono text-body-sm text-on-surface-variant">{query}</code>
      </div>
      <span className={matches ? "text-label-lg text-primary" : "text-label-lg text-on-surface-variant"}>{matches ? "true" : "false"}</span>
    </div>
  )
}

export default function MediaQueryDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-2">
      {QUERIES.map(([query, icon, label]) => (
        <QueryRow key={query} query={query} icon={icon} label={label} />
      ))}
    </div>
  )
}
