import * as React from "react"
import { ListBox, ListBoxItem, Popover, Select, SelectValue, TextField as AriaTextField, type Key } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextArea } from "@/components/ui/input-group"
import { cn } from "@/lib/utils"
import { Section, Variant, Variants } from "@/docs/section"

const field = "group/field flex flex-col gap-2"

/** Compact joined select used by several demos (docs-only; a real app would use <Select>). */
function JoinedSelect({ options, defaultValue, label, className }: { options: string[]; defaultValue: string; label: string; className?: string }) {
  const [value, setValue] = React.useState<Key>(defaultValue)
  return (
    <Select aria-label={label} selectedKey={value} onSelectionChange={(k) => k != null && setValue(k)} className={cn("flex", className)}>
      <InputGroupButton className="w-full justify-between bg-surface-container">
        <SelectValue className="truncate" />
        <Icon size={20}>arrow_drop_down</Icon>
      </InputGroupButton>
      <Popover offset={4} className="min-w-(--trigger-width) rounded-xs bg-surface-container py-2 text-label-lg text-on-surface shadow-2">
        <ListBox className="outline-none">
          {options.map((o) => (
            <ListBoxItem
              key={o}
              id={o}
              textValue={o}
              className="state-layer flex h-12 cursor-pointer items-center gap-3 px-3 outline-none data-selected:bg-secondary-container data-selected:text-on-secondary-container"
            >
              {({ isSelected }) => (
                <>
                  <span className="flex-1">{o}</span>
                  {isSelected && <Icon size={20}>check</Icon>}
                </>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

export default function InputGroupSection() {
  const [key, setKey] = React.useState("ksk_live_9f2a…c41e")
  return (
    <Section id="input-group" description="Addons attached to a field: static prefixes/suffixes on surface-container, an inline action button, and a select joined to an input.">
      <div className="grid gap-6 md:grid-cols-2">
        <AriaTextField defaultValue="status" className={field}>
          <FieldLabel>Custom domain</FieldLabel>
          <InputGroup>
            <InputGroupAddon>https://</InputGroupAddon>
            <InputGroupInput />
            <InputGroupAddon align="end">.kestrel.io</InputGroupAddon>
          </InputGroup>
        </AriaTextField>
        <AriaTextField type="email" className={field}>
          <FieldLabel>Invite by email</FieldLabel>
          <InputGroup variant="pill">
            <InputGroupAddon variant="plain">
              <Icon>mail</Icon>
            </InputGroupAddon>
            <InputGroupInput placeholder="name@company.com" />
            <Button className="h-11 px-5">Invite</Button>
          </InputGroup>
        </AriaTextField>
        <AriaTextField defaultValue="4,200" className={field}>
          <FieldLabel>Budget alert</FieldLabel>
          <InputGroup>
            <InputGroupAddon>$</InputGroupAddon>
            <InputGroupInput className="text-right tabular-nums" />
            <span className="flex w-40 border-l border-outline">
              <JoinedSelect label="Period" options={["per month", "per week", "per day"]} defaultValue="per month" className="w-full" />
            </span>
          </InputGroup>
        </AriaTextField>
        <AriaTextField value={key} isReadOnly className={field}>
          <FieldLabel>API key</FieldLabel>
          <InputGroup className="items-center">
            <InputGroupInput className="font-mono" />
            <IconButton aria-label="Copy" onPress={() => navigator.clipboard?.writeText(key)}>
              <Icon>content_copy</Icon>
            </IconButton>
            <IconButton
              aria-label="Regenerate"
              className="mr-1"
              onPress={() => setKey(`ksk_live_${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 6)}`)}
            >
              <Icon>autorenew</Icon>
            </IconButton>
          </InputGroup>
        </AriaTextField>
      </div>

      <Variants>
        <Variant n={1} label="Scoped search" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <AriaTextField aria-label="Search" className={field}>
            <div className="text-label-lg">Search</div>
            <InputGroup size="sm">
              <span className="flex border-r border-outline">
                <JoinedSelect label="Scope" options={["All", "Services", "Incidents", "People"]} defaultValue="All" />
              </span>
              <InputGroupAddon variant="plain">
                <Icon size={20}>search</Icon>
              </InputGroupAddon>
              <InputGroupInput placeholder="Search services…" className="px-3" />
            </InputGroup>
          </AriaTextField>
        </Variant>
        <Variant n={2} label="Password · strength" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <PasswordStrength />
        </Variant>
        <Variant n={3} label="Phone · country code" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <AriaTextField defaultValue="70 123 45 67" inputMode="tel" className={field}>
            <FieldLabel>Phone</FieldLabel>
            <InputGroup size="sm">
              <span className="flex border-r border-outline font-mono">
                <JoinedSelect label="Country code" options={["SE +46", "NO +47", "DE +49", "US +1"]} defaultValue="SE +46" />
              </span>
              <InputGroupInput placeholder="70 123 45 67" className="px-3 tabular-nums" />
            </InputGroup>
            <FieldDescription>We'll text a code to this number.</FieldDescription>
          </AriaTextField>
        </Variant>
        <Variant n={4} label="Date range" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className={field}>
            <div className="text-label-lg">Billing period</div>
            <InputGroup size="sm">
              <InputGroupAddon variant="plain">
                <Icon size={20}>date_range</Icon>
              </InputGroupAddon>
              <AriaTextField aria-label="Start" defaultValue="Oct 1, 2026" className="flex min-w-0 flex-1">
                <InputGroupInput className="px-3 tabular-nums" />
              </AriaTextField>
              <span className="grid place-items-center text-on-surface-variant">
                <Icon size={18}>arrow_forward</Icon>
              </span>
              <AriaTextField aria-label="End" defaultValue="Oct 31, 2026" className="flex min-w-0 flex-1">
                <InputGroupInput className="px-3 tabular-nums" />
              </AriaTextField>
            </InputGroup>
          </div>
        </Variant>
        <Variant n={5} label="Hex color · swatch" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <HexColor />
        </Variant>
        <Variant n={6} label="Value + unit" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <AriaTextField defaultValue="512" inputMode="numeric" className={field}>
            <FieldLabel>Memory limit</FieldLabel>
            <InputGroup size="sm">
              <InputGroupInput className="px-3 text-right tabular-nums" />
              <span className="flex w-24 border-l border-outline">
                <JoinedSelect label="Unit" options={["MiB", "GiB"]} defaultValue="MiB" className="w-full" />
              </span>
            </InputGroup>
            <FieldDescription>Pods are restarted above this limit.</FieldDescription>
          </AriaTextField>
        </Variant>
        <Variant n={7} label="Comment box · toolbar" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <AriaTextField aria-label="Comment" className="w-full">
            <InputGroup size="auto" className="rounded-md">
              <InputGroupTextArea placeholder="Leave a review comment…" />
              <div className="flex items-center gap-0.5 border-t border-outline-variant bg-surface-container-low p-1.5">
                {["format_bold", "format_italic", "code", "link"].map((i) => (
                  <IconButton key={i} size="xs" aria-label={i.replace("format_", "")}>
                    <Icon size={20}>{i}</Icon>
                  </IconButton>
                ))}
                <IconButton size="xs" variant="filled" aria-label="Send comment" className="ml-auto">
                  <Icon size={18}>send</Icon>
                </IconButton>
              </div>
            </InputGroup>
          </AriaTextField>
        </Variant>
        <Variant n={8} label="Error & disabled" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <AriaTextField defaultValue="hooks.kestrel" isInvalid className={field}>
            <FieldLabel>Webhook URL</FieldLabel>
            <InputGroup size="sm" isInvalid>
              <InputGroupAddon>https://</InputGroupAddon>
              <InputGroupInput className="px-3" />
              <InputGroupAddon variant="plain">
                <Icon size={20} filled>
                  error
                </Icon>
              </InputGroupAddon>
            </InputGroup>
            <FieldError>Enter a full domain, like hooks.kestrel.io</FieldError>
          </AriaTextField>
          <AriaTextField defaultValue="eu-central-1" isDisabled className={field}>
            <FieldLabel>Region</FieldLabel>
            <InputGroup size="sm" isDisabled>
              <InputGroupAddon>aws://</InputGroupAddon>
              <InputGroupInput className="px-3" />
            </InputGroup>
          </AriaTextField>
        </Variant>
      </Variants>
    </Section>
  )
}

function PasswordStrength() {
  const [value, setValue] = React.useState("glacier-peak-2026")
  const [show, setShow] = React.useState(false)
  const score = Math.min(4, [/.{8,}/, /[0-9]/, /[^a-z0-9]/i, /.{14,}/].filter((r) => r.test(value)).length)
  const label = ["Too short", "Weak", "Fair", "Good", "Strong"][score]
  return (
    <AriaTextField value={value} onChange={setValue} type={show ? "text" : "password"} className={field}>
      <FieldLabel>New password</FieldLabel>
      <InputGroup size="sm">
        <InputGroupAddon variant="plain">
          <Icon size={20}>key</Icon>
        </InputGroupAddon>
        <InputGroupInput className="px-3" />
        <InputGroupButton aria-label={show ? "Hide password" : "Show password"} onPress={() => setShow((s) => !s)} className="w-12 justify-center text-on-surface-variant">
          <Icon size={20}>{show ? "visibility_off" : "visibility"}</Icon>
        </InputGroupButton>
      </InputGroup>
      <div className="flex gap-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < score ? (score >= 3 ? "bg-primary" : "bg-tertiary") : "bg-surface-container-highest")} />
        ))}
      </div>
      <FieldDescription>{label} · use 14+ characters with numbers and symbols</FieldDescription>
    </AriaTextField>
  )
}

function HexColor() {
  const [hex, setHex] = React.useState("6750A4")
  const valid = /^[0-9a-f]{6}$/i.test(hex)
  return (
    <AriaTextField value={hex} onChange={(v) => setHex(v.replace(/[^0-9a-f]/gi, "").slice(0, 6))} isInvalid={!valid} className={field}>
      <FieldLabel>Brand color</FieldLabel>
      <InputGroup size="sm" isInvalid={!valid}>
        <InputGroupAddon className="px-2">
          <input
            type="color"
            aria-label="Pick color"
            value={valid ? `#${hex}` : "#000000"}
            onChange={(e) => setHex(e.target.value.slice(1).toUpperCase())}
            className="size-8 cursor-pointer rounded-xs border-0 bg-transparent p-0"
          />
        </InputGroupAddon>
        <InputGroupAddon variant="plain" className="font-mono">
          #
        </InputGroupAddon>
        <InputGroupInput className="pl-1 font-mono uppercase" />
      </InputGroup>
      <FieldError>Six hex digits, like 6750A4</FieldError>
    </AriaTextField>
  )
}
