import { Stepper, StepperActions, StepperItem, StepperList, StepperPanel } from "@/components/ui/stepper"

const STEPS = ["Basic info", "Academic", "Guardian", "Review"]

export default function StepperCompact() {
  return (
    <Stepper defaultStep={1} className="w-full max-w-xs rounded-lg border border-outline-variant p-4">
      <StepperList aria-label="New student">
        {STEPS.map((title) => (
          <StepperItem key={title} title={title} />
        ))}
      </StepperList>
      {STEPS.map((title, step) => (
        <StepperPanel key={title} step={step} className="text-body-md text-on-surface-variant">
          {title} fields go here.
        </StepperPanel>
      ))}
      <StepperActions />
    </Stepper>
  )
}
