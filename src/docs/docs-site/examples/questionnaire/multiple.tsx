import { useState } from "react"

import { ChoiceCard, ChoiceGroup } from "@/components/ui/questionnaire"

export default function QuestionnaireMultiple() {
  const [tools, setTools] = useState(["grafana"])

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <ChoiceGroup selectionMode="multiple" aria-label="Observability tools" value={tools} onChange={setTools}>
        <ChoiceCard value="grafana" icon="monitoring">
          Grafana
        </ChoiceCard>
        <ChoiceCard value="datadog" icon="pets">
          Datadog
        </ChoiceCard>
        <ChoiceCard value="otel" icon="hub">
          OpenTelemetry
        </ChoiceCard>
      </ChoiceGroup>
      <p className="text-body-sm text-on-surface-variant">{tools.length} selected</p>
    </div>
  )
}
