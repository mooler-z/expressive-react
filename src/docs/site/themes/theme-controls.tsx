import * as React from "react"
import { ToggleButton as AriaToggleButton, ToggleButtonGroup } from "react-aria-components"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import type { SchemeVariant, ThemeMode } from "@/components/ui/theme-provider"
import { CONTRASTS, SEEDS, VARIANTS, copy, shareUrl, useVariantDots, type BuilderTheme } from "@/docs/site/themes/theme-data"
import { cn } from "@/lib/utils"

const HEX = /^#?[0-9a-f]{6}$/i
const label = "text-label-md tracking-wider text-on-surface-variant uppercase"
const segment = "flex-1 bg-surface-container-highest text-on-surface"
/** Small buttons at the design's 48dp height (round = half height). */
const tall = "h-12 rounded-[24px] px-4"

export interface ThemeControlsProps {
  theme: BuilderTheme
  apply: (patch: Partial<Pick<BuilderTheme, "seed" | "variant" | "contrast">>) => void
  reset: () => void
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  dark: boolean
  css: string | null
}

export function ThemeControls({ theme, apply, reset, mode, setMode, dark, css }: ThemeControlsProps) {
  const dots = useVariantDots(theme.seed, theme.contrast, dark)
  const hint = VARIANTS.find((v) => v.id === theme.variant)?.hint

  return (
    <aside
      className="space-y-6 rounded-xl bg-surface-container-low p-5 lg:sticky lg:top-6"
      data-spec="Builder controls|Every control writes to the shared theme store: seed → Material color utilities scheme → 49 role variables on :root and .dark. Persists in localStorage; URL params override."
    >
      {theme.preset && (
        <div className="flex items-center gap-3 rounded-lg bg-secondary-container p-3 text-on-secondary-container">
          <Icon name="style" size={20} />
          <p className="min-w-0 flex-1 text-body-md">
            <span className="font-medium">{theme.preset.name} preset</span>
            {theme.seed === theme.preset.seed.toUpperCase() && theme.variant === theme.preset.variant && theme.contrast === (theme.preset.contrast ?? 0)
              ? " is active."
              : ": its typeface and shapes stay; your color changes replace its tuned surfaces."}
          </p>
          <Link to="/themes/presets" className="focus-ring shrink-0 rounded-xs text-label-lg underline-offset-4 hover:underline">
            Presets
          </Link>
        </div>
      )}

      <div>
        <div className="flex items-baseline justify-between">
          <span className={label}>Seed color</span>
          <span className="font-mono text-label-md text-on-surface-variant">{theme.seed}</span>
        </div>
        <ToggleButtonGroup
          aria-label="Seed color"
          selectionMode="single"
          selectedKeys={SEEDS.some(([hex]) => hex === theme.seed) ? [theme.seed] : []}
          onSelectionChange={(keys) => {
            const [hex] = [...keys]
            if (hex) apply({ seed: String(hex) })
          }}
          className="mt-3 flex flex-wrap gap-2"
        >
          {SEEDS.map(([hex, name]) => (
            <AriaToggleButton
              key={hex}
              id={hex}
              aria-label={name}
              className={cn(
                "state-layer focus-ring grid size-11 cursor-pointer place-items-center rounded-full text-white shape-morph",
                "data-selected:rounded-[12px] data-selected:ring-2 data-selected:ring-primary data-selected:ring-offset-2 data-selected:ring-offset-surface-container-low",
              )}
              style={{ background: hex }}
            >
              {({ isSelected }) => (
                <span className={cn("transition-opacity duration-200", isSelected ? "opacity-100" : "opacity-0")}>
                  <Icon name="check" size={20} />
                </span>
              )}
            </AriaToggleButton>
          ))}
        </ToggleButtonGroup>
        <HexField seed={theme.seed} onSeed={(seed) => apply({ seed })} />
      </div>

      <div>
        <div className={label}>Scheme variant</div>
        <ToggleButtonGroup
          aria-label="Scheme variant"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[theme.variant]}
          onSelectionChange={(keys) => {
            const [v] = [...keys]
            if (v) apply({ variant: v as SchemeVariant })
          }}
          className="mt-3 grid grid-cols-3 gap-1.5"
        >
          {VARIANTS.map((v) => (
            <AriaToggleButton
              key={v.id}
              id={v.id}
              className={cn(
                "state-layer focus-ring flex h-16 cursor-pointer flex-col items-start justify-between rounded-md border border-outline-variant p-2 text-left text-on-surface-variant shape-morph",
                "data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container",
              )}
            >
              <span className="flex gap-1" aria-hidden>
                {(dots[v.id] ?? ["var(--md-primary)", "var(--md-secondary)", "var(--md-tertiary)"]).map((c, i) => (
                  <span key={i} className="size-3 rounded-full transition-colors duration-300" style={{ background: c }} />
                ))}
              </span>
              <span className="text-label-md">{v.label}</span>
            </AriaToggleButton>
          ))}
        </ToggleButtonGroup>
        <p className="mt-2 text-body-sm text-on-surface-variant">{hint}</p>
      </div>

      <div>
        <div className={label} id="contrast-label">
          Contrast
        </div>
        <ConnectedButtonGroup
          aria-labelledby="contrast-label"
          selectedKeys={[String(theme.contrast)]}
          onSelectionChange={(keys) => {
            const [c] = [...keys]
            if (c !== undefined) apply({ contrast: Number(c) })
          }}
          className="mt-3 flex w-full"
        >
          {CONTRASTS.map(([value, name]) => (
            <ConnectedButton key={value} id={String(value)} className={segment}>
              {name}
            </ConnectedButton>
          ))}
        </ConnectedButtonGroup>
      </div>

      <div>
        <div className={label} id="mode-label">
          Mode
        </div>
        <ConnectedButtonGroup
          aria-labelledby="mode-label"
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const [m] = [...keys]
            if (m) setMode(m as ThemeMode)
          }}
          className="mt-3 flex w-full"
        >
          {(
            [
              ["light", "Light", "light_mode"],
              ["dark", "Dark", "dark_mode"],
              ["system", "System", "contrast"],
            ] as const
          ).map(([id, name, icon]) => (
            <ConnectedButton key={id} id={id} className={cn(segment, "gap-2 px-3")}>
              <Icon name={icon} size={20} />
              {name}
            </ConnectedButton>
          ))}
        </ConnectedButtonGroup>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          className={cn(tall, "min-w-0 flex-1")}
          icon={<Icon name="content_copy" size={20} />}
          isDisabled={!css}
          onPress={async () => css && (await copy(css)) && snackbar("Copied theme CSS")}
        >
          Copy CSS
        </Button>
        <Button
          variant="outlined"
          className={tall}
          icon={<Icon name="link" size={20} />}
          onPress={async () => (await copy(shareUrl(theme))) && snackbar("Copied share link")}
        >
          Share
        </Button>
        <Button variant="text" className={cn(tall, "px-3")} isDisabled={theme.isBaseline} onPress={reset}>
          Reset
        </Button>
      </div>
    </aside>
  )
}

/** Hex input with a native color picker in the leading swatch. Applies on Enter, blur, or picker input. */
function HexField({ seed, onSeed }: { seed: string; onSeed: (seed: string) => void }) {
  const [text, setText] = React.useState(seed)
  const pickTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => setText(seed), [seed])
  React.useEffect(() => () => clearTimeout(pickTimer.current), [])

  const commit = () => {
    const v = text.trim()
    if (HEX.test(v)) onSeed(("#" + v.replace("#", "")).toUpperCase())
    else setText(seed)
  }

  return (
    <TextField
      aria-label="Seed hex"
      className="mt-3"
      density="sm"
      value={text}
      onChange={setText}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && commit()}
      inputClassName="font-mono text-body-lg"
      spellCheck="false"
      leading={
        <span
          className="relative mr-2 ml-2 grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-outline-variant"
          style={{ background: seed }}
        >
          <input
            type="color"
            aria-label="Pick a custom seed"
            value={seed.toLowerCase()}
            onChange={(e) => {
              const v = e.target.value.toUpperCase()
              setText(v)
              clearTimeout(pickTimer.current)
              pickTimer.current = setTimeout(() => onSeed(v), 120)
            }}
            className="absolute inset-0 size-full cursor-pointer rounded-full opacity-0"
          />
        </span>
      }
      trailing={<span className="pr-1 text-label-md text-on-surface-variant">hex</span>}
    />
  )
}
