import { useState } from "react"

import { Field, FieldLabel } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

export default function InputGroupWithButton() {
  const [visible, setVisible] = useState(false)

  return (
    <Field defaultValue="correct-horse-battery" type={visible ? "text" : "password"} className="w-full max-w-md">
      <FieldLabel>Database password</FieldLabel>
      <InputGroup>
        <InputGroupAddon variant="plain">
          <Icon name="key" />
        </InputGroupAddon>
        <InputGroupInput />
        <InputGroupButton onPress={() => setVisible((v) => !v)} className="border-l border-outline">
          <Icon name={visible ? "visibility_off" : "visibility"} />
          {visible ? "Hide" : "Show"}
        </InputGroupButton>
      </InputGroup>
    </Field>
  )
}
