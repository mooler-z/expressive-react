import { useState } from "react"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export default function InputGroupInvalid() {
  const [port, setPort] = useState("80800")
  const n = Number(port)
  const invalid = !/^\d+$/.test(port) || n < 1 || n > 65535

  return (
    <Field value={port} onChange={setPort} isInvalid={invalid} className="w-full max-w-sm">
      <FieldLabel>Health check</FieldLabel>
      <InputGroup isInvalid={invalid}>
        <InputGroupAddon>localhost:</InputGroupAddon>
        <InputGroupInput inputMode="numeric" className="tabular-nums" />
        <InputGroupAddon align="end">/healthz</InputGroupAddon>
      </InputGroup>
      <FieldError>Ports run from 1 to 65535.</FieldError>
    </Field>
  )
}
