import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Switch } from "@/components/ui/switch"
import { TextField } from "@/components/ui/text-field"
import { ThemeScope } from "@/components/ui/theme-provider"
import { THEME_PRESETS } from "@/components/ui/theme-presets"

export default function ThemePresetsDemo() {
  const [id, setId] = useState("campus")
  const preset = THEME_PRESETS.find((p) => p.id === id)!

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <ChipGroup
        aria-label="Preset"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[id]}
        onSelectionChange={(keys) => setId(String([...keys][0]))}
        className="flex max-w-3xl flex-wrap justify-center gap-2"
      >
        {THEME_PRESETS.map((p) => (
          <FilterChip key={p.id} id={p.id} dense>
            {p.name}
          </FilterChip>
        ))}
      </ChipGroup>
      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {(["light", "dark"] as const).map((mode) => (
          <ThemeScope key={mode} preset={id} mode={mode} className="flex flex-col gap-4 rounded-xl p-5 ring-1 ring-outline-variant">
            <div>
              <h3 className="text-title-lg font-semibold">{preset.name}</h3>
              <p className="text-body-md text-on-surface-variant">{preset.description}</p>
            </div>
            <Card variant="elevated" className="gap-1 p-4">
              <div className="text-label-md text-on-surface-variant">Attendance</div>
              <div className="text-headline-sm font-semibold text-primary tabular-nums">96.4%</div>
            </Card>
            <TextField label="Search" variant="outlined" density="sm" />
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Save</Button>
              <Button size="sm" variant="tonal">
                Share
              </Button>
              <Switch defaultSelected aria-label={`Alerts, ${mode}`} className="ms-auto" />
            </div>
          </ThemeScope>
        ))}
      </div>
    </div>
  )
}
