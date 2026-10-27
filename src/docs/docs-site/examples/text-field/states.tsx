import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"

const WORKSPACE_ID = "ws_7Hq2kD9xL"

export default function TextFieldStates() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <TextField
        label="Workspace ID"
        defaultValue={WORKSPACE_ID}
        isReadOnly
        inputClassName="font-mono"
        description="Read-only: dashed outline, still selectable"
        trailing={
          <IconButton
            size="md"
            width="narrow"
            aria-label="Copy workspace ID"
            onPress={() => {
              navigator.clipboard?.writeText(WORKSPACE_ID)
              snackbar("Workspace ID copied")
            }}
          >
            <Icon name="content_copy" size={20} />
          </IconButton>
        }
      />
      <TextField variant="filled" label="Region" defaultValue="eu-central-1" isDisabled description="Locked after creation" />
    </div>
  )
}
