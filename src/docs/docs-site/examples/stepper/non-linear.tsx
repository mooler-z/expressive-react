import { snackbar } from "@/components/ui/snackbar"
import { Stepper, StepperActions, StepperItem, StepperList, StepperPanel } from "@/components/ui/stepper"
import { Switch } from "@/components/ui/switch"

const PANELS = [
  ["Show my email to other staff", "Show my phone number"],
  ["Email me when grades are published", "Weekly attendance digest"],
  ["Allow parents to message me", "Share my timetable"],
]

export default function StepperNonLinear() {
  return (
    <Stepper linear={false} className="w-full max-w-2xl">
      <StepperList aria-label="Account settings">
        <StepperItem title="Profile" />
        <StepperItem title="Notifications" />
        <StepperItem title="Privacy" />
        <StepperItem title="Billing" description="Admins only" status="disabled" />
      </StepperList>
      {PANELS.map((options, step) => (
        <StepperPanel key={step} step={step} keepMounted className="flex flex-col items-start gap-4">
          {options.map((label, i) => (
            <Switch key={label} defaultSelected={i === 0}>
              {label}
            </Switch>
          ))}
        </StepperPanel>
      ))}
      <StepperActions finishLabel="Save" onFinish={() => snackbar("Settings saved")} />
    </Stepper>
  )
}
