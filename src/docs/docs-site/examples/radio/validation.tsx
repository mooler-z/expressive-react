import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Radio, RadioGroup } from "@/components/ui/radio"
import { snackbar } from "@/components/ui/snackbar"

export default function RadioValidation() {
  const [severity, setSeverity] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="flex flex-col items-start gap-3">
      <RadioGroup
        label="Severity"
        value={severity}
        onChange={setSeverity}
        isInvalid={submitted && !severity}
        errorMessage="Pick a severity to file the incident."
      >
        <Radio value="sev1">SEV-1 · customer facing</Radio>
        <Radio value="sev2">SEV-2 · degraded</Radio>
        <Radio value="sev3">SEV-3 · internal</Radio>
      </RadioGroup>
      <Button
        className="ml-3"
        onPress={() => {
          setSubmitted(true)
          if (severity) snackbar(`Incident filed · ${severity.toUpperCase()}`)
        }}
      >
        File incident
      </Button>
    </div>
  )
}
