import { MarkerLegend, StatusPin } from "@/components/ui/marker"

export default function MarkerStatus() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center gap-6">
        <StatusPin status="ok" aria-label="Healthy" />
        <StatusPin status="warning" aria-label="Degraded" />
        <StatusPin status="error" aria-label="Down" />
        <StatusPin status="neutral" icon="schedule" aria-label="Maintenance" />
      </div>
      <MarkerLegend
        items={[
          { label: "Healthy", tone: "primary" },
          { label: "Degraded", tone: "tertiary" },
          { label: "Down", tone: "error" },
        ]}
      />
    </div>
  )
}
