import { Checkbox } from "@/components/ui/checkbox"
import { snackbar } from "@/components/ui/snackbar"
import { Stepper, StepperActions, StepperItem, StepperList, StepperPanel } from "@/components/ui/stepper"
import { TextField } from "@/components/ui/text-field"

export default function StepperVertical() {
  return (
    <Stepper orientation="vertical" className="grid w-full max-w-2xl gap-6 sm:grid-cols-[13rem_minmax(0,1fr)]">
      <StepperList aria-label="Quick setup">
        <StepperItem title="School profile" description="Name and contact" />
        <StepperItem title="Academic year" description="Dates and terms" />
        <StepperItem title="Classes" description="Grades and sections" />
        <StepperItem title="Staff" description="Invite teachers" />
      </StepperList>
      <div className="flex min-w-0 flex-col gap-6 rounded-lg bg-surface-container-low p-6">
        <StepperPanel step={0} keepMounted className="grid gap-4">
          <TextField label="School name" defaultValue="Bole Academy" />
          <TextField label="Contact email" type="email" defaultValue="office@bole.edu.et" />
        </StepperPanel>
        <StepperPanel step={1} keepMounted className="grid gap-4">
          <TextField label="Starts" defaultValue="Sep 8, 2026" />
          <TextField label="Ends" defaultValue="Jun 30, 2027" />
        </StepperPanel>
        <StepperPanel step={2} keepMounted className="grid gap-3">
          <Checkbox defaultSelected>Kindergarten (KG 1–3)</Checkbox>
          <Checkbox defaultSelected>Primary (Grades 1–8)</Checkbox>
          <Checkbox>Secondary (Grades 9–12)</Checkbox>
        </StepperPanel>
        <StepperPanel step={3} keepMounted>
          <TextField label="Teacher emails" multiline rows={3} className="w-full" />
        </StepperPanel>
        <StepperActions finishLabel="Finish setup" onFinish={() => snackbar("Setup complete")} className="mt-auto" />
      </div>
    </Stepper>
  )
}
