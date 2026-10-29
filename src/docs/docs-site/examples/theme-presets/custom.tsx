import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeScope } from "@/components/ui/theme-provider"
import type { ThemePreset } from "@/components/ui/theme-presets"

const harvest: ThemePreset = {
  id: "harvest",
  name: "Harvest",
  description: "Wheat and plum, with tight corners.",
  seed: "#8A5A00",
  variant: "content",
  shape: "sharp",
  elevation: "soft",
  font: {
    sans: '"Sora", system-ui, sans-serif',
    href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap",
  },
  colors: {
    light: { surface: "#faf5ea", surfaceContainerLow: "#ffffff", outlineVariant: "#e6dcc6" },
  },
}

export default function ThemePresetsCustom() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      {(["light", "dark"] as const).map((mode) => (
        <ThemeScope key={mode} preset={harvest} mode={mode} className="flex flex-col gap-3 rounded-lg p-4">
          <Card variant="elevated" className="gap-1 p-4">
            <div className="text-title-md">{harvest.name}</div>
            <div className="text-body-md text-on-surface-variant">{harvest.description}</div>
          </Card>
          <div className="flex gap-2">
            <Button size="sm">Plant</Button>
            <Button size="sm" variant="outlined">
              Harvest
            </Button>
          </div>
        </ThemeScope>
      ))}
    </div>
  )
}
