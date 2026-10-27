import { useState } from "react"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { snackbar } from "@/components/ui/snackbar"

const newKey = () => `ksk_live_${Math.random().toString(16).slice(2, 10)}`

export default function InputGroupActions() {
  const [key, setKey] = useState("ksk_live_9f2ac41e")

  return (
    <Field value={key} isReadOnly className="w-full max-w-md">
      <FieldLabel>API key</FieldLabel>
      <InputGroup className="items-center">
        <InputGroupInput className="font-mono" />
        <IconButton
          aria-label="Copy key"
          onPress={() => {
            navigator.clipboard?.writeText(key)
            snackbar("API key copied")
          }}
        >
          <Icon name="content_copy" />
        </IconButton>
        <IconButton
          aria-label="Regenerate key"
          className="mr-1"
          onPress={() => {
            setKey(newKey())
            snackbar("New key generated")
          }}
        >
          <Icon name="autorenew" />
        </IconButton>
      </InputGroup>
      <FieldDescription>Read-only. Regenerating revokes the old key.</FieldDescription>
    </Field>
  )
}
