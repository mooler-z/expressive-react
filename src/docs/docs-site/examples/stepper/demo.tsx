import { snackbar } from "@/components/ui/snackbar"
import { Stepper, StepperActions, StepperItem, StepperList, StepperPanel } from "@/components/ui/stepper"
import { TextField } from "@/components/ui/text-field"

const save = () => new Promise((resolve) => setTimeout(resolve, 1600))

export default function StepperDemo() {
  return (
    <Stepper className="w-full max-w-2xl">
      <StepperList aria-label="New school">
        <StepperItem title="School" />
        <StepperItem title="Academic year" />
        <StepperItem title="Grades" />
        <StepperItem title="Invite staff" />
      </StepperList>
      <StepperPanel step={0} keepMounted className="grid gap-4 sm:grid-cols-2">
        <TextField label="School name" defaultValue="Bole Academy" />
        <TextField label="City" defaultValue="Addis Ababa" />
      </StepperPanel>
      <StepperPanel step={1} keepMounted className="grid gap-4 sm:grid-cols-2">
        <TextField label="Year" defaultValue="2026/27" />
        <TextField label="Terms" defaultValue="2" inputMode="numeric" />
      </StepperPanel>
      <StepperPanel step={2} keepMounted className="grid gap-4 sm:grid-cols-2">
        <TextField label="From" defaultValue="KG 1" />
        <TextField label="To" defaultValue="Grade 12" />
      </StepperPanel>
      <StepperPanel step={3} keepMounted>
        <TextField label="Emails" description="Separate addresses with commas" multiline rows={2} className="w-full" />
      </StepperPanel>
      <StepperActions
        finishLabel="Create school"
        onFinish={async () => {
          await save()
          snackbar("Bole Academy created")
        }}
      />
    </Stepper>
  )
}
