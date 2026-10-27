import { MapPin } from "@/components/ui/marker"

export default function MarkerPins() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      <MapPin label="Primary" />
      <MapPin label="Secondary" tone="secondary" />
      <MapPin label="Tertiary" tone="tertiary" icon="store" />
      <MapPin label="Outage" tone="error" icon="report" />
      <MapPin aria-label="Unlabelled pin" />
    </div>
  )
}
