import * as React from "react"
import { TextField as AriaTextField } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { FieldContainer, FieldInput, FieldSupportingText, TextField } from "@/components/ui/text-field"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Select, SelectItem } from "@/components/ui/select"
import { Section, Variant, Variants } from "@/docs/section"

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const REGIONS = ["Europe (Frankfurt)", "US East (N. Virginia)", "Asia Pacific (Tokyo)"]

export default function TextFieldsSection() {
  const [query, setQuery] = React.useState("Kestrel Grid")
  const [email, setEmail] = React.useState("not-an-email")
  const [cluster, setCluster] = React.useState("kestrel-prod-01")
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <Section
      id="text-fields"
      description="Filled (surface-container-highest, 4dp top corners, active indicator) and outlined (1dp outline, 2dp primary when focused, notched label). Labels float on focus or when the field has a value. Click into any field."
      spec="https://m3.material.io/components/text-fields/overview"
    >
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        <div className="space-y-7">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Filled</div>
          <TextField variant="filled" label="Label" description="Supporting text" />
          <TextField
            variant="filled"
            label="With icons"
            value={query}
            onChange={setQuery}
            leading="search"
            trailing={
              query ? (
                <IconButton size="md" width="narrow" aria-label="Clear" onPress={() => setQuery("")}>
                  <Icon>cancel</Icon>
                </IconButton>
              ) : undefined
            }
          />
          <TextField
            variant="filled"
            label="Email · type to validate"
            type="email"
            value={email}
            onChange={setEmail}
            isInvalid={!EMAIL.test(email)}
            description="We'll send the invoice here"
            errorMessage="Enter a valid email address"
          />
          <TextField variant="filled" label="Monthly budget" defaultValue="4,200" prefix="$" suffix="USD" inputClassName="text-right tabular-nums" />
          <TextField variant="filled" label="Disabled" defaultValue="Read only" isDisabled />
        </div>
        <div className="space-y-7">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Outlined</div>
          <TextField label="Label" description="Supporting text" />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            defaultValue="hunter2hunter2"
            leading="lock"
            trailing={
              <IconButton size="md" width="narrow" aria-label={showPassword ? "Hide password" : "Show password"} onPress={() => setShowPassword((s) => !s)}>
                <Icon>{showPassword ? "visibility_off" : "visibility"}</Icon>
              </IconButton>
            }
          />
          <TextField
            label="Cluster name · type to validate"
            value={cluster}
            onChange={setCluster}
            isInvalid={cluster === "kestrel-prod-01" || !/^[a-z0-9-]+$/.test(cluster)}
            errorMessage={cluster === "kestrel-prod-01" ? "Name already exists in this region" : "Lowercase letters, numbers and dashes only"}
          />
          <TextField label="Notes" multiline rows={3} maxLength={500} showCount description="Optional" />
          <Select label="Region · exposed dropdown" defaultSelectedKey={REGIONS[0]}>
            {REGIONS.map((r) => (
              <SelectItem key={r} id={r}>
                {r}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <Variants>
        <Variant n={1} label="Density · 56 / 48 / 40" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          {(["md", "sm", "xs"] as const).map((d, i) => (
            <div key={d} className="flex items-center gap-3">
              <TextField density={d} label="Service" defaultValue="checkout-api" className="flex-1" />
              <span className="w-6 text-right font-mono text-label-sm text-on-surface-variant">{[56, 48, 40][i]}</span>
            </div>
          ))}
        </Variant>
        <Variant n={2} label="Select · filled & outlined" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          {(["filled", "outlined"] as const).map((v) => (
            <Select key={v} variant={v} label={`Region · ${v}`} defaultSelectedKey={REGIONS[0]}>
              {REGIONS.map((r) => (
                <SelectItem key={r} id={r}>
                  {r}
                </SelectItem>
              ))}
            </Select>
          ))}
        </Variant>
        <Variant n={3} label="Read-only · disabled" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <TextField
            label="Workspace ID · read-only"
            defaultValue="ws_7Hq2kD9xL"
            isReadOnly
            inputClassName="font-mono"
            trailing={
              <IconButton size="md" width="narrow" aria-label="Copy" onPress={() => navigator.clipboard?.writeText("ws_7Hq2kD9xL")}>
                <Icon size={20}>content_copy</Icon>
              </IconButton>
            }
          />
          <TextField label="Region" defaultValue="eu-central-1" isDisabled description="Locked after creation" />
        </Variant>
        <Variant n={4} label="Async check · loading" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <TextField label="Workspace URL" defaultValue="kestrel-labs" trailing={<LoadingIndicator size={32} className="mr-2" />} description="Checking availability…" />
          <TextField
            label="Workspace URL"
            defaultValue="kestrel-ops-eu"
            trailing={
              <Icon filled className="mr-3 text-primary">
                check_circle
              </Icon>
            }
            description={<span className="text-primary">kestrel-ops-eu is available</span>}
          />
        </Variant>
        <Variant n={5} label="Masked date & time" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className="flex flex-col gap-4">
            <TextField
              label="Start date"
              defaultValue="10/29/2026"
              placeholder="MM/DD/YYYY"
              inputMode="numeric"
              inputClassName="tabular-nums"
              trailing={
                <IconButton size="md" width="narrow" aria-label="Open calendar">
                  <Icon size={20}>calendar_today</Icon>
                </IconButton>
              }
            />
            <TextField label="Time" defaultValue="09:30" placeholder="HH:MM" inputMode="numeric" inputClassName="tabular-nums" />
          </div>
          <p className="px-4 text-body-sm text-on-surface-variant">Date pickers wrap these fields with a calendar and clock dial.</p>
        </Variant>
        <Variant n={6} label="Pill · joined action" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <AriaTextField aria-label="Email">
            <InputGroup variant="pill">
              <InputGroupAddon variant="plain">
                <Icon>mail</Icon>
              </InputGroupAddon>
              <InputGroupInput type="email" placeholder="you@company.com" />
              <Button>Join waitlist</Button>
            </InputGroup>
          </AriaTextField>
          <AriaTextField aria-label="Coupon">
            <InputGroup size="sm" className="rounded-full">
              <InputGroupAddon variant="plain">
                <Icon size={20}>sell</Icon>
              </InputGroupAddon>
              <InputGroupInput placeholder="Coupon code" className="px-3 uppercase" />
              <Button variant="text" className="mr-1 self-center">
                Apply
              </Button>
            </InputGroup>
          </AriaTextField>
        </Variant>
        <Variant n={7} label="Ghost completion" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <GhostCompletion />
        </Variant>
        <Variant n={8} label="On tonal containers" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className="rounded-lg bg-primary-container p-4 text-on-primary-container">
            <div className="text-title-sm">Invite your team</div>
            <div className="mt-3 flex gap-2">
              <TextField variant="filled" density="sm" aria-label="Email" placeholder="name@kestrel.io" containerClassName="rounded-sm bg-surface after:hidden" className="flex-1" />
              <Button size="sm" className="h-12">
                Invite
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-tertiary-container p-4 pt-5 text-on-tertiary-container">
            <AriaTextField defaultValue="Q4 retro" className="group/field">
              <FieldContainer label="Board name" className="[&_fieldset]:border-on-tertiary-container/60 [&_label]:text-on-tertiary-container">
                <FieldInput className="text-on-tertiary-container" />
              </FieldContainer>
              <FieldSupportingText description={<span className="text-on-tertiary-container">Outline and label take the container's on-color</span>} />
            </AriaTextField>
          </div>
        </Variant>
      </Variants>
    </Section>
  )
}

const CLUSTERS = ["kestrel-prod-eu-01", "kestrel-prod-eu-02", "kestrel-prod-us-01"]

/** Inline completion: Tab accepts the greyed suggestion. */
function GhostCompletion() {
  const [value, setValue] = React.useState("kestrel-prod-")
  const match = value ? CLUSTERS.find((c) => c.startsWith(value) && c !== value) : undefined
  const count = CLUSTERS.filter((c) => c.startsWith(value)).length
  return (
    <AriaTextField
      value={value}
      onChange={setValue}
      onKeyDown={(e) => {
        if (e.key === "Tab" && match) {
          e.preventDefault()
          setValue(match)
        }
      }}
      className="group/field"
    >
      <FieldContainer label="Cluster" trailing={match ? <Kbd className="mr-3">Tab</Kbd> : undefined}>
        <span className="relative flex min-w-0 flex-1">
          <span aria-hidden className="pointer-events-none absolute inset-0 truncate font-mono text-body-lg whitespace-pre text-on-surface-variant/60">
            <span className="invisible">{value}</span>
            {match?.slice(value.length)}
          </span>
          <FieldInput className="font-mono" />
        </span>
      </FieldContainer>
      <FieldSupportingText description={match ? `Tab to accept · ${count} matches` : `${count} match${count === 1 ? "" : "es"}`} />
    </AriaTextField>
  )
}
