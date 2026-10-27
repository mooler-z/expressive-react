import { AttachmentItem, AttachmentList } from "@/components/ui/attachment"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"

const MB = 1024 * 1024

export default function AttachmentStates() {
  return (
    <AttachmentList className="w-full max-w-lg">
      <AttachmentItem
        name="cluster-policy.yaml"
        size={18_400}
        actions={
          <IconButton aria-label="Download cluster-policy.yaml" onPress={() => snackbar("Downloading cluster-policy.yaml")}>
            <Icon name="download" />
          </IconButton>
        }
      />
      <AttachmentItem name="traces-oct-29.csv" size={12.4 * MB} status="uploading" progress={63} onRemove={() => snackbar("Upload cancelled")} />
      <AttachmentItem name="screen-recording.mov" size={88 * MB} status="error" message="Exceeds the 25 MB limit" onRemove={() => {}} />
      <AttachmentItem name="postmortem.pdf" size={2.1 * MB} status="failed" message="Network error" onRetry={() => snackbar("Retrying")} onRemove={() => {}} />
    </AttachmentList>
  )
}
