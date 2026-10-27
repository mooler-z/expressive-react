import { Form } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel, Input } from "@/components/ui/field"
import { snackbar } from "@/components/ui/snackbar"

export default function FieldValidation() {
  return (
    <Form
      className="flex w-full max-w-sm flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault()
        snackbar("Invite sent")
      }}
    >
      <Field name="email" type="email" isRequired>
        <FieldLabel isRequired>Email</FieldLabel>
        <Input placeholder="name@company.com" />
        <FieldError />
      </Field>
      <Field name="team" isRequired minLength={3}>
        <FieldLabel isRequired>Team</FieldLabel>
        <Input placeholder="At least 3 characters" />
        <FieldError />
      </Field>
      <Button type="submit" className="self-end">
        Send invite
      </Button>
    </Form>
  )
}
