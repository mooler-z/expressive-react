import * as React from "react"

import { Button } from "@/components/ui/button"
import { CoachMark, Marker, NumberMarker } from "@/components/ui/marker"

const STEPS = [
  { x: 14, y: 22, title: "Pick a service", description: "Every deploy starts from a service." },
  { x: 62, y: 22, title: "Choose an environment", description: "Staging first, then production." },
  { x: 86, y: 78, title: "Ship it", description: "Deploys roll out region by region." },
]

export default function MarkerTour() {
  const [step, setStep] = React.useState<number | null>(null)
  const current = step === null ? null : STEPS[step]

  return (
    <div className="relative h-72 w-full max-w-2xl rounded-lg bg-surface-container-low p-4">
      <div className="flex gap-3">
        <div className="h-10 w-1/3 rounded-md bg-surface-container-highest" />
        <div className="h-10 w-1/3 rounded-md bg-surface-container-highest" />
      </div>
      <div className="absolute right-4 bottom-4 h-10 w-24 rounded-full bg-primary" />
      {STEPS.map((s, i) => (
        <Marker key={s.title} x={s.x} y={s.y}>
          <NumberMarker delay={i * 120} aria-label={`Step ${i + 1}: ${s.title}`} onPress={() => setStep(i)}>
            {i + 1}
          </NumberMarker>
        </Marker>
      ))}
      {current && step !== null && (
        <CoachMark
          className="absolute top-1/2 left-1/2 -translate-1/2"
          step={`Step ${step + 1} of ${STEPS.length}`}
          title={current.title}
          description={current.description}
          actions={
            <>
              <Button variant="text" size="xs" onPress={() => setStep(null)}>
                Skip
              </Button>
              <Button size="xs" onPress={() => setStep(step + 1 < STEPS.length ? step + 1 : null)}>
                {step + 1 < STEPS.length ? "Next" : "Done"}
              </Button>
            </>
          }
        />
      )}
    </div>
  )
}
