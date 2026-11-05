import { useState } from "react"

import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"
import { Stepper, StepperActions, StepperItem, StepperList, StepperPanel } from "@/components/ui/stepper"

export default function StepperErrorOptional() {
  const [declined, setDeclined] = useState(true)

  return (
    <Stepper defaultStep={2} validate={(step) => step !== 2 || !declined} className="w-full max-w-2xl">
      <StepperList aria-label="Enrollment fee">
        <StepperItem title="Details" />
        <StepperItem title="Documents" optional />
        <StepperItem title="Payment" status={declined ? "error" : undefined} description={declined ? "Card declined" : undefined} />
        <StepperItem title="Confirm" />
      </StepperList>
      <StepperPanel step={0} className="text-body-md">Student, grade and fee plan.</StepperPanel>
      <StepperPanel step={1} className="text-body-md">Birth certificate and previous report card, if you have them.</StepperPanel>
      <StepperPanel step={2} className="flex flex-wrap items-center gap-3 text-body-md">
        {declined ? (
          <>
            <span className="flex-1 text-error">The bank declined the card ending 4242.</span>
            <Button variant="tonal" onPress={() => setDeclined(false)}>
              Retry payment
            </Button>
          </>
        ) : (
          <span>Paid · ETB 4,500</span>
        )}
      </StepperPanel>
      <StepperPanel step={3} className="text-body-md">Review and submit the enrollment.</StepperPanel>
      <StepperActions finishLabel="Submit" onFinish={() => snackbar("Enrollment submitted")} />
    </Stepper>
  )
}
