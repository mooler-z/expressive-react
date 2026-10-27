import * as React from "react"
import { ToggleButton as AriaToggleButton, ToggleButtonGroup } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { Switch } from "@/components/ui/switch"
import { Row, Section } from "@/docs/section"

const NAMES = [
  "home", "search", "favorite", "settings", "notifications", "mail", "bolt", "cloud", "database", "verified",
  "rocket_launch", "monitoring", "shield", "group", "calendar_month", "chat", "deployed_code", "terminal",
  "bookmark", "star", "delete", "edit", "share", "download",
]

const chip =
  "state-layer focus-ring inline-flex h-8 cursor-pointer items-center rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container"

function Choice<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <ToggleButtonGroup
      aria-label={label}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[String(value)]}
      onSelectionChange={(k) => {
        const v = [...k][0]
        onChange((typeof value === "number" ? Number(v) : v) as T)
      }}
      className="flex flex-wrap gap-2"
    >
      {options.map((o) => (
        <AriaToggleButton key={String(o)} id={String(o)} className={chip}>
          {o}
        </AriaToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

export default function IconsSection() {
  const [filled, setFilled] = React.useState(false)
  const [weight, setWeight] = React.useState(400)
  const [size, setSize] = React.useState(24)
  return (
    <Section
      id="icons"
      description="Material Symbols Rounded through <Icon>. The filled prop is for selected states, size sets the optical size too, and weight drives the variable font. FILL and weight are registered properties, so they animate inside transitions."
      spec="https://fonts.google.com/icons"
    >
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Switch isSelected={filled} onChange={setFilled}>
          Filled
        </Switch>
        <Row label="Weight">
          <Choice label="Weight" value={weight} options={[200, 300, 400, 500, 600, 700]} onChange={setWeight} />
        </Row>
        <Row label="Size">
          <Choice label="Size" value={size} options={[20, 24, 32, 40, 48]} onChange={setSize} />
        </Row>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
        {NAMES.map((name, i) => (
          <div
            key={name}
            title={name}
            className={`grid aspect-square place-items-center rounded-md bg-surface-container ${i === NAMES.length - 1 ? "text-primary" : "text-on-surface-variant"}`}
          >
            <Icon
              size={size}
              filled={filled}
              weight={weight}
              className="transition-[--icon-fill,--icon-wght] duration-300 ease-standard"
            >
              {name}
            </Icon>
          </div>
        ))}
      </div>
    </Section>
  )
}
