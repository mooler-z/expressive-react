import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { snackbar } from "@/components/ui/snackbar"

export default function CheckboxValidation() {
  const [accepted, setAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const invalid = submitted && !accepted

  return (
    <div className="flex flex-col items-start gap-2">
      <Checkbox isSelected={accepted} onChange={setAccepted} isInvalid={invalid}>
        I accept the terms of service
      </Checkbox>
      {invalid && <p className="pl-3 text-body-sm text-error">Accept the terms to continue.</p>}
      <Button
        className="ml-3"
        onPress={() => {
          setSubmitted(true)
          if (accepted) snackbar("Account created")
        }}
      >
        Create account
      </Button>
    </div>
  )
}
