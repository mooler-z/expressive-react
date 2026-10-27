import { useState } from "react"

import { TextField } from "@/components/ui/text-field"

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export default function TextFieldValidation() {
  const [email, setEmail] = useState("maya@kestrel")

  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <TextField
        variant="filled"
        label="Billing email"
        type="email"
        value={email}
        onChange={setEmail}
        isInvalid={!EMAIL.test(email)}
        description="Invoices go here"
        errorMessage="Enter a valid email address"
      />
      <TextField
        label="Cluster name"
        isRequired
        validate={(v) => (/^[a-z0-9-]*$/.test(v) ? null : "Lowercase letters, numbers and dashes only")}
        validationBehavior="aria"
        defaultValue="Prod_EU"
      />
    </div>
  )
}
