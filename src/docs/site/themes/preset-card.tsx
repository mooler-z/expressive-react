import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Chip, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { TextField } from "@/components/ui/text-field"
import { ThemeScope } from "@/components/ui/theme-provider"
import { presetCss, type ThemePreset } from "@/components/ui/theme-presets"
import { copy } from "@/docs/site/themes/theme-data"
import { cn } from "@/lib/utils"

const PEOPLE: [name: string, detail: string, status: string][] = [
  ["Hana Tesfaye", "Grade 9 · Section B", "Present"],
  ["Samuel Okafor", "Grade 10 · Section A", "Late"],
]

/**
 * One preset in the gallery: a small app screen rendered inside a ThemeScope with that preset, so its canvas,
 * cards, hairlines, typeface, corner scale and elevation all show at once. The action applies it to the site.
 */
export function PresetCard({
  preset,
  mode,
  active,
  onApply,
}: {
  preset: ThemePreset
  mode: "light" | "dark"
  active: boolean
  onApply: () => void
}) {
  return (
    <ThemeScope
      preset={preset}
      mode={mode}
      role="group"
      aria-label={`${preset.name} preset, ${mode}`}
      className={cn("flex flex-col overflow-hidden rounded-xl ring-1 ring-outline-variant", active && "ring-2 ring-primary")}
      data-spec={`${preset.name}|seed ${preset.seed} · ${preset.variant} · shape ${typeof preset.shape === "string" ? preset.shape : "custom"} · elevation ${typeof preset.elevation === "string" ? preset.elevation : "custom"}`}
    >
      <div className="flex items-start gap-3 px-4 pt-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-title-lg font-semibold">{preset.name}</h2>
          <p className="mt-1 line-clamp-2 min-h-10 text-body-md text-on-surface-variant">{preset.description}</p>
        </div>
        <span className="flex shrink-0 -space-x-1.5 pt-1" aria-hidden>
          {(preset.swatches?.[mode] ?? [preset.seed]).map((c, i) => (
            <span key={i} className="size-5 rounded-full ring-2 ring-surface" style={{ background: c }} />
          ))}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-primary-container p-3 text-on-primary-container">
            <div className="text-label-md">Enrolled</div>
            <div className="text-headline-sm font-semibold tabular-nums">1,284</div>
          </div>
          <div className="rounded-lg bg-tertiary-container p-3 text-on-tertiary-container">
            <div className="text-label-md">Attendance</div>
            <div className="text-headline-sm font-semibold tabular-nums">96%</div>
          </div>
        </div>

        <Card variant="elevated" className="divide-y divide-outline-variant">
          {PEOPLE.map(([name, detail, status]) => (
            <div key={name} className="flex items-center gap-3 px-3 py-2.5">
              <Avatar name={name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-body-lg">{name}</div>
                <div className="truncate text-body-sm text-on-surface-variant">{detail}</div>
              </div>
              <span
                className={cn(
                  "rounded-sm px-2 py-0.5 text-label-md",
                  status === "Late" ? "bg-error-container text-on-error-container" : "bg-secondary-container text-on-secondary-container",
                )}
              >
                {status}
              </span>
            </div>
          ))}
        </Card>

        <TextField
          aria-label={`Search, ${preset.name} preview`}
          placeholder="Search students"
          variant="outlined"
          density="xs"
          leading="search"
        />

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip defaultSelected dense>
            Today
          </FilterChip>
          <Chip dense>Week</Chip>
          <code className="rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-body-sm text-on-surface-variant">{preset.seed}</code>
          <Switch defaultSelected aria-label={`Notifications, ${preset.name} preview`} className="ms-auto" />
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button size="sm" onPress={onApply} isDisabled={active} icon={active ? <Icon name="check" size={20} /> : undefined}>
            {active ? "Applied" : "Use theme"}
          </Button>
          <Button
            size="sm"
            variant="outlined"
            icon={<Icon name="content_copy" size={20} />}
            onPress={async () => (await copy(await presetCss(preset))) && snackbar(`Copied ${preset.name} CSS`)}
          >
            CSS
          </Button>
        </div>
      </div>
    </ThemeScope>
  )
}
