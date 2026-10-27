import { TextField } from "@/components/ui/text-field"

export default function TextFieldMultiline() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <TextField variant="filled" label="Release notes" multiline rows={4} maxLength={280} showCount />
      <TextField label="Incident summary" multiline rows={4} description="Markdown is supported" />
    </div>
  )
}
