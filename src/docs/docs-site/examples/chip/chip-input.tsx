import { useState } from "react"

import { ChipInput } from "@/components/ui/chip"

const isEmail = (text: string) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim()) ? text.trim() : null)

export default function ChipChipInput() {
  const [emails, setEmails] = useState(["maya@kestrel.io"])
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <ChipInput
        label="To"
        value={emails}
        onChange={setEmails}
        parse={isEmail}
        placeholder="Add an email, then Enter"
        renderAvatar={(email) => email[0].toUpperCase()}
      />
      <p className="text-body-sm text-on-surface-variant">{emails.length} recipient{emails.length === 1 ? "" : "s"}</p>
    </div>
  )
}
