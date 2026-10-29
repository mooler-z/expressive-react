import * as React from "react"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { useTheme } from "@/components/ui/theme-provider"
import { SiteLayout } from "@/docs/site/site-layout"
import { PresetCard } from "@/docs/site/themes/preset-card"

export const meta = { path: "/themes/presets" }

/** Gallery of the shipped theme presets: each card is a live ThemeScope; "Use theme" applies it to the whole site. */
export default function ThemePresetsPage() {
  const { presets, preset, setPreset, resolvedMode } = useTheme()
  const [mode, setMode] = React.useState<"light" | "dark">(resolvedMode)
  React.useEffect(() => setMode(resolvedMode), [resolvedMode])

  return (
    <SiteLayout active="themes">
      <main className="mx-auto w-full max-w-[1400px] px-4 pt-8 pb-24 md:px-8" data-screen-label="Theme presets">
        <div className="max-w-2xl">
          <h1 className="text-display-sm font-semibold tracking-tight">Theme presets</h1>
          <p className="mt-3 text-body-lg text-pretty text-on-surface-variant">
            {presets.length} complete looks: color from a seed, hand-tuned canvas, card and hairline tones, a typeface, a corner scale and an elevation style.
            Every one passes WCAG AA in light and dark. Apply one to this site, or pass its id to <code className="font-mono">ThemeProvider</code>.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ConnectedButtonGroup
            aria-label="Preview mode"
            selectedKeys={[mode]}
            onSelectionChange={(keys) => {
              const [m] = [...keys]
              if (m) setMode(m as "light" | "dark")
            }}
          >
            <ConnectedButton id="light" className="gap-2 bg-surface-container-highest px-4 text-on-surface">
              <Icon name="light_mode" size={20} />
              Light
            </ConnectedButton>
            <ConnectedButton id="dark" className="gap-2 bg-surface-container-highest px-4 text-on-surface">
              <Icon name="dark_mode" size={20} />
              Dark
            </ConnectedButton>
          </ConnectedButtonGroup>
          {preset && (
            <Button variant="text" icon={<Icon name="restart_alt" size={20} />} onPress={() => setPreset(null)}>
              Remove {preset.name}
            </Button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {presets.map((p) => (
            <PresetCard key={p.id} preset={p} mode={mode} active={preset?.id === p.id} onApply={() => setPreset(p.id)} />
          ))}
        </div>
      </main>
    </SiteLayout>
  )
}
