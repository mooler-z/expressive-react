import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { InputGroup, InputGroupTextArea } from "@/components/ui/input-group"
import { snackbar } from "@/components/ui/snackbar"

export default function InputGroupTextAreaExample() {
  const [comment, setComment] = useState("")

  return (
    <Field value={comment} onChange={setComment} className="w-full max-w-md">
      <FieldLabel>Comment</FieldLabel>
      <InputGroup size="auto">
        <InputGroupTextArea placeholder="Leave a note for the reviewer…" />
        <div className="flex items-center gap-1 border-t border-outline-variant p-1">
          <IconButton size="sm" aria-label="Attach file">
            <Icon name="attach_file" />
          </IconButton>
          <IconButton size="sm" aria-label="Mention someone">
            <Icon name="alternate_email" />
          </IconButton>
          <span className="flex-1" />
          <Button
            size="sm"
            isDisabled={!comment.trim()}
            onPress={() => {
              setComment("")
              snackbar("Comment posted")
            }}
          >
            Post
          </Button>
        </div>
      </InputGroup>
    </Field>
  )
}
