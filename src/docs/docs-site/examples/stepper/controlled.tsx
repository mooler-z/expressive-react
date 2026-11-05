import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Stepper, StepperItem, StepperList, StepperPanel, useStepper } from "@/components/ui/stepper"

const STEPS = [
  { title: "Upload", body: "Drop the CSV exported from your old system." },
  { title: "Match columns", body: "Map each column to a student field." },
  { title: "Import", body: "312 students are ready to import." },
]

function Footer() {
  const { step, count, isFirst, isLast, back, next } = useStepper()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex-1 text-label-lg text-on-surface-variant">
        {step + 1} / {count}
      </span>
      <Button variant="outlined" isDisabled={isFirst} onPress={back}>
        Previous
      </Button>
      <Button variant="tonal" isDisabled={isLast} onPress={next}>
        Continue
      </Button>
    </div>
  )
}

export default function StepperControlled() {
  const [step, setStep] = useState(0)

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Stepper step={step} onStepChange={setStep}>
        <StepperList aria-label="Import students">
          {STEPS.map((s) => (
            <StepperItem key={s.title} title={s.title} />
          ))}
        </StepperList>
        {STEPS.map((s, i) => (
          <StepperPanel key={s.title} step={i} className="text-body-md">
            {s.body}
          </StepperPanel>
        ))}
        <Footer />
      </Stepper>
      <div className="flex items-center gap-3 border-t border-outline-variant pt-3 text-body-sm text-on-surface-variant">
        <span className="flex-1 font-mono">step = {step}</span>
        <Button variant="text" size="xs" onPress={() => setStep(0)}>
          Start over
        </Button>
      </div>
    </div>
  )
}
