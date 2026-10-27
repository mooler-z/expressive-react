import { ClusterMarker, MapPin, Marker, MarkerDot, MarkerLabel, MarkerLegend } from "@/components/ui/marker"
import { snackbar } from "@/components/ui/snackbar"

export default function MarkerDemo() {
  return (
    <div className="relative h-72 w-full max-w-2xl overflow-hidden rounded-lg bg-surface-container-high bg-[radial-gradient(var(--md-outline-variant)_1px,transparent_1px)] bg-size-[16px_16px]">
      <Marker x={30} y={45} anchor="bottom">
        <MapPin label="Frankfurt · 12 nodes" onPress={() => snackbar("Frankfurt selected")} />
      </Marker>
      <Marker x={72} y={38} anchor="bottom">
        <MapPin label="Tokyo · 8 nodes" tone="tertiary" onPress={() => snackbar("Tokyo selected")} />
      </Marker>
      <Marker x={55} y={70}>
        <ClusterMarker count={146} onPress={() => snackbar("146 nodes in this area")} />
      </Marker>
      <Marker x={18} y={78}>
        <div className="flex flex-col items-center gap-2">
          <MarkerDot pulse halo={56} />
          <MarkerLabel>You · ±40 m</MarkerLabel>
        </div>
      </Marker>
      <MarkerLegend
        className="absolute top-3 right-3"
        items={[
          { label: "Region", tone: "primary" },
          { label: "Edge", tone: "tertiary" },
        ]}
      />
    </div>
  )
}
