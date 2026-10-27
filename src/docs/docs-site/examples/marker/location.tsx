import { MarkerDot, MarkerLabel } from "@/components/ui/marker"

export default function MarkerLocation() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-16">
      <div className="flex flex-col items-center gap-3">
        <MarkerDot />
        <MarkerLabel>Static</MarkerLabel>
      </div>
      <div className="flex flex-col items-center gap-3">
        <MarkerDot pulse />
        <MarkerLabel>Live</MarkerLabel>
      </div>
      <div className="flex flex-col items-center gap-3">
        <MarkerDot tone="tertiary" halo={64} />
        <MarkerLabel>±40 m</MarkerLabel>
      </div>
    </div>
  )
}
