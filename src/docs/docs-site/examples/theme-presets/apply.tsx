import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { useTheme } from "@/components/ui/theme-provider"

export default function ThemePresetsApply() {
  const { presets, preset, setPreset } = useTheme()

  return (
    <ChipGroup
      aria-label="App theme"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[preset?.id ?? "none"]}
      onSelectionChange={(keys) => {
        const [id] = [...keys]
        setPreset(id === "none" ? null : String(id))
      }}
      className="flex max-w-3xl flex-wrap justify-center gap-2"
    >
      <FilterChip id="none">Default</FilterChip>
      {presets.map((p) => (
        <FilterChip key={p.id} id={p.id}>
          <span className="size-3 rounded-full" style={{ background: p.swatches?.light[0] ?? p.seed }} aria-hidden />
          {p.name}
        </FilterChip>
      ))}
    </ChipGroup>
  )
}
