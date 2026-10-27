import { useState } from "react"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { TextField } from "@/components/ui/text-field"

export default function TextFieldIcons() {
  const [query, setQuery] = useState("checkout-api")
  const [visible, setVisible] = useState(false)

  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <TextField
        variant="filled"
        label="Search services"
        value={query}
        onChange={setQuery}
        leading="search"
        trailing={
          query ? (
            <IconButton size="md" width="narrow" aria-label="Clear" onPress={() => setQuery("")}>
              <Icon name="cancel" />
            </IconButton>
          ) : undefined
        }
      />
      <TextField
        label="Password"
        type={visible ? "text" : "password"}
        defaultValue="correct-horse"
        leading="lock"
        trailing={
          <IconButton size="md" width="narrow" aria-label={visible ? "Hide password" : "Show password"} onPress={() => setVisible((v) => !v)}>
            <Icon name={visible ? "visibility_off" : "visibility"} />
          </IconButton>
        }
      />
    </div>
  )
}
