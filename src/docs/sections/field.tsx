import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, Fieldset, Input, TextArea } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Radio, RadioGroup } from "@/components/ui/radio"
import { Switch } from "@/components/ui/switch"
import { Section, Variant, Variants } from "@/docs/section"

export default function FieldSection() {
  const [slug, setSlug] = React.useState("kestrel ops")
  return (
    <Section
      id="field"
      description="Form anatomy with external labels: label-large label (required mark on the error role), control, body-small description or error, fieldset groups, and a horizontal variant for settings pages."
    >
      <form className="grid gap-6 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <Field defaultValue="Kestrel Ops" isRequired>
          <FieldLabel isRequired>Workspace name</FieldLabel>
          <Input />
          <FieldDescription>Shown in the sidebar and on invoices.</FieldDescription>
        </Field>
        <Field value={slug} onChange={setSlug} isInvalid={!/^[a-z0-9-]+$/.test(slug)}>
          <FieldLabel hint="Optional">Slug</FieldLabel>
          <Input className="font-mono" />
          <FieldError>Use lowercase letters, numbers and dashes only.</FieldError>
        </Field>
        <Fieldset className="md:col-span-2">
          <FieldLegend>Notify me about</FieldLegend>
          <div className="grid gap-x-8 sm:grid-cols-3">
            <Checkbox defaultSelected>Failed deploys</Checkbox>
            <Checkbox defaultSelected>Policy changes</Checkbox>
            <Checkbox>Weekly digest</Checkbox>
          </div>
        </Fieldset>
        <div className="grid items-center gap-2 border-t border-outline-variant pt-6 md:col-span-2 md:grid-cols-[240px_1fr]">
          <div>
            <div className="text-label-lg">Public status page</div>
            <p className="text-body-sm text-on-surface-variant">Horizontal layout for settings.</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-md bg-surface p-4">
            <span className="text-body-md">
              status.kestrel.io is <span className="font-medium">visible</span> to everyone
            </span>
            <Switch defaultSelected aria-label="Public status page" />
          </div>
        </div>
        <div className="flex justify-end gap-2 md:col-span-2">
          <Button variant="text">Cancel</Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>

      <Variants>
        <Variant n={1} label="Radio fieldset · descriptions" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <RadioGroup label="Deploy strategy" defaultValue="rolling">
            {[
              ["rolling", "Rolling", "Replace pods in batches of 25%"],
              ["blue-green", "Blue / green", "Switch traffic once the new stack is healthy"],
              ["canary", "Canary", "Send 5% of traffic first"],
            ].map(([id, title, body]) => (
              <Radio key={id} value={id} className="items-start">
                <span className="pt-3">
                  <span className="block">{title}</span>
                  <span className="block text-body-sm text-on-surface-variant">{body}</span>
                </span>
              </Radio>
            ))}
          </RadioGroup>
        </Variant>
        <Variant n={2} label="Counter · textarea" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <CounterField />
        </Variant>
        <Variant n={3} label="Label with help" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <HelpField />
        </Variant>
        <Variant n={4} label="Disabled · managed" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <Field defaultValue="maya@kestrel.io" isDisabled>
            <FieldLabel>Email</FieldLabel>
            <div className="relative">
              <Input size="sm" className="pr-12" />
              <Icon size={20} className="pointer-events-none absolute top-3.5 right-4 text-on-surface/38">
                lock
              </Icon>
            </div>
            <FieldDescription>
              Managed by your identity provider (Okta). <a href="#field">Request a change</a>
            </FieldDescription>
          </Field>
        </Variant>
        <Variant n={5} label="Two-up row" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className="grid grid-cols-2 gap-3">
            <Field defaultValue="Maya">
              <FieldLabel isRequired>First name</FieldLabel>
              <Input size="sm" />
            </Field>
            <Field defaultValue="Lindqvist">
              <FieldLabel isRequired>Last name</FieldLabel>
              <Input size="sm" />
            </Field>
          </div>
          <Field defaultValue="Platform lead">
            <FieldLabel hint="Optional">Title</FieldLabel>
            <Input size="sm" />
          </Field>
        </Variant>
        <Variant n={6} label="Success · verified" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <Field defaultValue="status.kestrel.io">
            <FieldLabel>Custom domain</FieldLabel>
            <div className="relative">
              <Input size="sm" className="border-primary pr-12" />
              <Icon filled className="pointer-events-none absolute top-3 right-3 text-primary">
                verified
              </Icon>
            </div>
            <FieldDescription className="text-primary">DNS verified 2 min ago · TLS certificate issued</FieldDescription>
          </Field>
        </Variant>
        <Variant n={7} label="Error summary" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div role="alert" className="rounded-md bg-error-container p-3 text-on-error-container">
            <div className="flex items-center gap-2 text-title-sm">
              <Icon size={20} filled>
                error
              </Icon>
              2 fields need attention
            </div>
            <ul className="mt-1 list-disc pl-11 text-body-md">
              <li>
                <a href="#field" className="text-current">
                  Billing email
                </a>
              </li>
              <li>
                <a href="#field" className="text-current">
                  VAT number
                </a>
              </li>
            </ul>
          </div>
          <Field defaultValue="SE12" isInvalid>
            <FieldLabel isRequired>VAT number</FieldLabel>
            <Input size="sm" />
            <FieldError>Swedish VAT numbers are 14 characters, like SE123456789001.</FieldError>
          </Field>
        </Variant>
        <Variant n={8} label="Inline edit" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <InlineEdit />
        </Variant>
      </Variants>
    </Section>
  )
}

function CounterField() {
  const [text, setText] = React.useState("")
  return (
    <Field value={text} onChange={setText} maxLength={280}>
      <FieldLabel>Changelog entry</FieldLabel>
      <TextArea placeholder="What changed for customers?" className="resize-none" />
      <div className="flex justify-between text-body-sm text-on-surface-variant">
        <FieldDescription>Markdown supported</FieldDescription>
        <span className="tabular-nums">{text.length} / 280</span>
      </div>
    </Field>
  )
}

function HelpField() {
  const [open, setOpen] = React.useState(true)
  return (
    <Field defaultValue="whsec_••••••••••••">
      <div className="flex items-center gap-1">
        <FieldLabel>Webhook secret</FieldLabel>
        <IconButton size="xs" aria-label="About webhook secrets" aria-expanded={open} onPress={() => setOpen((o) => !o)}>
          <Icon size={18}>help</Icon>
        </IconButton>
      </div>
      <Input size="sm" className="font-mono" />
      {open && (
        <div className="rounded-sm bg-surface-container-high p-3 text-body-sm text-on-surface-variant">
          Used to sign each payload with HMAC-SHA256. Verify the <code className="font-mono">Kestrel-Signature</code> header before trusting a request.
        </div>
      )}
    </Field>
  )
}

function InlineEdit() {
  const [editing, setEditing] = React.useState(false)
  const [name, setName] = React.useState("Maya L.")
  const [draft, setDraft] = React.useState(name)
  if (!editing)
    return (
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-label-lg">Display name</div>
          <div className="text-body-lg text-on-surface-variant">{name}</div>
        </div>
        <IconButton
          aria-label="Edit display name"
          onPress={() => {
            setDraft(name)
            setEditing(true)
          }}
        >
          <Icon>edit</Icon>
        </IconButton>
      </div>
    )
  return (
    <Field value={draft} onChange={setDraft} autoFocus>
      <FieldLabel>Display name</FieldLabel>
      <Input size="sm" />
      <div className="flex justify-end gap-2">
        <Button variant="text" onPress={() => setEditing(false)}>
          Cancel
        </Button>
        <Button
          onPress={() => {
            setName(draft)
            setEditing(false)
          }}
        >
          Save
        </Button>
      </div>
    </Field>
  )
}
