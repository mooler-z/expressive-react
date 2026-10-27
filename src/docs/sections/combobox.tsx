import * as React from "react"
import type { Key } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { AssistChip } from "@/components/ui/chip"
import { ComboBox, ComboBoxItem } from "@/components/ui/combobox"
import { Kbd } from "@/components/ui/kbd"
import { snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

const REGIONS = [
  { id: "fra", name: "Europe (Frankfurt)", code: "eu-central-1" },
  { id: "arn", name: "Europe (Stockholm)", code: "eu-north-1" },
  { id: "iad", name: "US East (N. Virginia)", code: "us-east-1" },
  { id: "pdx", name: "US West (Oregon)", code: "us-west-2" },
  { id: "nrt", name: "Asia Pacific (Tokyo)", code: "ap-northeast-1" },
  { id: "syd", name: "Asia Pacific (Sydney)", code: "ap-southeast-2" },
]

const PEOPLE = [
  { id: "maya", name: "Maya Lindqvist", email: "maya@kestrel.io" },
  { id: "mateo", name: "Mateo Alvarez", email: "mateo@kestrel.io" },
  { id: "marta", name: "Marta Nowak", email: "marta@kestrel.io" },
  { id: "jonah", name: "Jonah Kim", email: "jonah@kestrel.io" },
  { id: "priya", name: "Priya Raman", email: "priya@kestrel.io" },
]

function Creatable() {
  const [envs, setEnvs] = React.useState(["staging-us", "staging-ap", "production"])
  const [input, setInput] = React.useState("staging-")
  const [selected, setSelected] = React.useState<Key | null>(null)
  const q = input.trim().toLowerCase()
  const matches = envs.filter((e) => e.toLowerCase().includes(q))
  const canCreate = q.length > 0 && !envs.includes(q)
  const items = [...matches.map((e) => ({ id: e, name: e })), ...(canCreate ? [{ id: "__create", name: q }] : [])]
  return (
    <ComboBox
      label="Environment"
      items={items}
      inputValue={input}
      onInputChange={setInput}
      selectedKey={selected}
      allowsCustomValue
      onSelectionChange={(key) => {
        if (key === "__create") {
          setEnvs((e) => [...e, q])
          setSelected(q)
          setInput(q)
          snackbar(`Created “${q}”`)
        } else {
          setSelected(key)
        }
      }}
    >
      {(item) =>
        item.id === "__create" ? (
          <ComboBoxItem id="__create" textValue={`Create ${item.name}`} icon="add" highlight={false} className="text-primary">
            <span className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate">Create “{item.name}”</span>
              <Kbd size="sm">Enter</Kbd>
            </span>
          </ComboBoxItem>
        ) : (
          <ComboBoxItem id={item.id} icon="dns">
            {item.name}
          </ComboBoxItem>
        )
      }
    </ComboBox>
  )
}

function AsyncRegions() {
  const [input, setInput] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState(REGIONS)
  React.useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      setResults(REGIONS.filter((r) => r.name.toLowerCase().includes(input.toLowerCase())))
      setLoading(false)
    }, 900)
    return () => clearTimeout(t)
  }, [input])
  return (
    <ComboBox
      label="Region"
      items={loading ? [] : results}
      inputValue={input}
      onInputChange={setInput}
      isLoading={loading}
      loadingText="Searching regions…"
      emptyText="No regions match"
      menuTrigger="focus"
    >
      {(r) => (
        <ComboBoxItem id={r.id} description={r.code}>
          {r.name}
        </ComboBoxItem>
      )}
    </ComboBox>
  )
}

function RequiredRegions() {
  const [value, setValue] = React.useState<Key[]>([])
  const suggestions = REGIONS.filter((r) => ["fra", "arn", "nrt"].includes(r.id) && !value.includes(r.id))
  return (
    <div className="w-full space-y-3">
      <ComboBox
        label="Regions *"
        selectionMode="multiple"
        defaultItems={REGIONS}
        value={value}
        onChange={setValue}
        isRequired
        isInvalid={value.length === 0}
        errorMessage="Select at least one region"
      >
        {(r) => <ComboBoxItem id={r.id}>{r.name}</ComboBoxItem>}
      </ComboBox>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((r) => (
            <AssistChip key={r.id} icon="add" onPress={() => setValue((v) => [...v, r.id])}>
              {r.name.replace(/.*\((.*)\)/, "$1")}
            </AssistChip>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ComboboxSection() {
  return (
    <Section
      id="combobox"
      description="A text field that filters a menu as you type; matches are emphasized in primary, the selected option shows a check. Multi-select puts the picks in the field as input chips."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Region · type to filter</div>
          <ComboBox
            label="Region"
            leading="public"
            defaultItems={REGIONS}
            emptyText="No regions match"
            onSelectionChange={(k) => k && snackbar(`Region · ${REGIONS.find((r) => r.id === k)?.name}`)}
          >
            {(r) => (
              <ComboBoxItem id={r.id} icon="public">
                {r.name}
              </ComboBoxItem>
            )}
          </ComboBox>
        </div>
        <div className="space-y-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Multi-select · chips in the field</div>
          <ComboBox label="Replicate to" selectionMode="multiple" defaultItems={REGIONS} defaultValue={["fra", "nrt"]} emptyText="No regions match">
            {(r) => <ComboBoxItem id={r.id}>{r.name}</ComboBoxItem>}
          </ComboBox>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-title-md">4 variants</div>
          <div className="text-body-sm text-on-surface-variant">Assignee · avatars · creatable option · async · loading & disabled · error · required</div>
        </div>
        <Variants cols="md:grid-cols-2">
          <Variant n={1} label="Assignee · avatars" className="flex min-h-24 items-start rounded-lg bg-surface p-4">
            <ComboBox label="Assignee" defaultItems={PEOPLE} defaultSelectedKey="maya" variant="filled">
              {(p) => (
                <ComboBoxItem id={p.id} textValue={p.name} leading={<Avatar name={p.name} size="sm" />} description={p.email}>
                  {p.name}
                </ComboBoxItem>
              )}
            </ComboBox>
          </Variant>
          <Variant n={2} label="Creatable option" className="flex min-h-24 items-start rounded-lg bg-surface p-4">
            <Creatable />
          </Variant>
          <Variant n={3} label="Async · loading & disabled" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
            <AsyncRegions />
            <ComboBox label="Zone" isDisabled defaultItems={REGIONS}>
              {(r) => <ComboBoxItem id={r.id}>{r.name}</ComboBoxItem>}
            </ComboBox>
          </Variant>
          <Variant n={4} label="Error · required" className="flex min-h-24 items-start rounded-lg bg-surface p-4">
            <RequiredRegions />
          </Variant>
        </Variants>
      </div>
    </Section>
  )
}
