import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import { Icon } from "@/components/ui/icon"

export default function LabelledDivider() {
  return (
    <div className="grid w-full max-w-xs gap-4">
      <Button size="md" className="w-full">Continue with email</Button>
      <Divider>or</Divider>
      <Button size="md" variant="outlined" className="w-full" icon={<Icon name="key" />}>
        Use a passkey
      </Button>
    </div>
  )
}
