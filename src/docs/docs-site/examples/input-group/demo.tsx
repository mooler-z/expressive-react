import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export default function InputGroupDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
      <Field defaultValue="status">
        <FieldLabel>Custom domain</FieldLabel>
        <InputGroup>
          <InputGroupAddon>https://</InputGroupAddon>
          <InputGroupInput />
          <InputGroupAddon align="end">.kestrel.io</InputGroupAddon>
        </InputGroup>
      </Field>
      <Field type="email">
        <FieldLabel>Invite by email</FieldLabel>
        <InputGroup variant="pill">
          <InputGroupAddon variant="plain">
            <Icon name="mail" />
          </InputGroupAddon>
          <InputGroupInput placeholder="name@company.com" />
          <Button className="h-11 px-5">Invite</Button>
        </InputGroup>
      </Field>
    </div>
  )
}
