import { TextField } from "@/components/ui/text-field"

export default function TextFieldDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <TextField variant="filled" label="Full name" description="As it appears on your ID" />
      <TextField label="Workspace" defaultValue="kestrel-labs" description="Lowercase, no spaces" />
    </div>
  )
}
