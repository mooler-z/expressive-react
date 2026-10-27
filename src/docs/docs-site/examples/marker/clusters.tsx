import { ClusterMarker } from "@/components/ui/marker"

export default function MarkerClusters() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <ClusterMarker count={4} />
      <ClusterMarker count={38} />
      <ClusterMarker count={146} />
      <ClusterMarker count={12} density="low" aria-label="12 offline nodes" />
    </div>
  )
}
