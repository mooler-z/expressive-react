import * as React from "react"
import { Radio, RadioGroup } from "react-aria-components"
import { Link } from "react-router"

import { buttonVariants } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { useTheme, type SchemeVariant, type ThemeMode } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"

/*
 * Theme control · design-reference/site/SiteHeader.dc.html (#er-theme) + m3/site.js
 * Mode · seed (8 swatches + custom) · scheme variant · contrast. Every pick recolors the whole site live.
 */

export const SITE_SEEDS: [hex: string, name: string][] = [
  ["#6750A4", "Baseline"],
  ["#0B57D0", "Blue"],
  ["#006A6A", "Teal"],
  ["#386A20", "Green"],
  ["#7D5700", "Amber"],
  ["#9C4146", "Rose"],
  ["#8E4585", "Magenta"],
  ["#4A6572", "Slate"],
]

export const SITE_VARIANTS: [SchemeVariant, string][] = [
  ["tonalSpot", "Tonal spot"],
  ["vibrant", "Vibrant"],
  ["expressive", "Expressive"],
  ["fidelity", "Fidelity"],
  ["content", "Content"],
  ["neutral", "Neutral"],
  ["monochrome", "Monochrome"],
  ["rainbow", "Rainbow"],
  ["fruitSalad", "Fruit salad"],
]

const MODES: [ThemeMode, string, string][] = [
  ["light", "Light", "light_mode"],
  ["dark", "Dark", "dark_mode"],
  ["system", "System", "contrast"],
]

const CONTRASTS: [number, string][] = [
  [0, "Standard"],
  [0.5, "Medium"],
  [1, "High"],
]

const BASELINE = SITE_SEEDS[0][0]

/** The seed the site is showing; `null` in the provider means the baseline tokens. */
export function useSiteSeed() {
  const { seed } = useTheme()
  return (seed ?? BASELINE).toUpperCase()
}

const sectionLabel = "text-label-md tracking-wider text-on-surface-variant uppercase"

export function ThemeMenu() {
  const { mode, setMode, setSeed, variant, setVariant, contrast, setContrast, setTheme } = useTheme()
  const seed = useSiteSeed()
  const customTimer = React.useRef<number | undefined>(undefined)
  const [draft, setDraft] = React.useState<string | null>(null)
  const pickSeed = (hex: string) => setSeed(hex.toUpperCase() === BASELINE ? null : hex.toUpperCase())

  return (
    <PopoverTrigger>
      <span className="relative inline-flex" data-spec="Theme control|Popover slides down on the M3 spring. Any pick recolors the whole site live: seed → Material color utilities scheme, 400ms crossfade on every surface.">
        <IconButton aria-label="Theme settings" size="md" width="narrow">
          <Icon>palette</Icon>
        </IconButton>
        <span
          aria-hidden
          className="pointer-events-none absolute right-2.5 bottom-3 size-2.5 rounded-full ring-2 ring-surface"
          style={{ background: seed }}
        />
      </span>
      <Popover
        aria-label="Theme"
        placement="bottom end"
        className="w-[360px] max-w-[calc(100vw-16px)] rounded-xl bg-surface-container-high p-4 shadow-3"
      >
        <div className="flex items-center gap-2">
          <Icon className="text-primary">palette</Icon>
          <span className="flex-1 text-title-md">Theme</span>
          <IconButton aria-label="Close" slot="close">
            <Icon>close</Icon>
          </IconButton>
        </div>

        <div className={cn(sectionLabel, "mt-2")}>Mode</div>
        <ConnectedButtonGroup
          aria-label="Color mode"
          selectedKeys={[mode]}
          onSelectionChange={(keys) => {
            const next = [...keys][0] as ThemeMode | undefined
            if (next) setMode(next)
          }}
          className="mt-2 flex w-full"
        >
          {MODES.map(([id, label, icon]) => (
            <ConnectedButton key={id} id={id} className="flex-1 not-data-selected:bg-surface-container-highest">
              <Icon size={20}>{icon}</Icon>
              {label}
            </ConnectedButton>
          ))}
        </ConnectedButtonGroup>

        <div className="mt-4 flex items-baseline justify-between">
          <span className={sectionLabel}>Seed color</span>
          <span className="font-mono text-label-md text-on-surface-variant">{seed}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <RadioGroup
            aria-label="Seed color"
            orientation="horizontal"
            value={SITE_SEEDS.some(([hex]) => hex === seed) ? seed : null}
            onChange={pickSeed}
            className="contents"
          >
            {SITE_SEEDS.map(([hex, name]) => (
              <Radio
                key={hex}
                value={hex}
                aria-label={name}
                className={cn(
                  "group grid size-10 cursor-pointer place-items-center rounded-full text-white shape-morph outline-none",
                  "data-selected:rounded-md data-selected:ring-2 data-selected:ring-primary data-selected:ring-offset-2 data-selected:ring-offset-surface-container-high",
                  "data-focus-visible:outline-3 data-focus-visible:outline-offset-2 data-focus-visible:outline-secondary",
                )}
                style={{ background: hex }}
              >
                <Icon size={20} className="opacity-0 transition-opacity group-data-selected:opacity-100">
                  check
                </Icon>
              </Radio>
            ))}
          </RadioGroup>
          <label
            title="Custom seed"
            className="state-layer relative grid size-10 cursor-pointer place-items-center rounded-full border border-outline-variant text-on-surface-variant focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-secondary"
          >
            <Icon size={20}>colorize</Icon>
            <input
              type="color"
              aria-label="Custom seed color"
              value={draft ?? seed.toLowerCase()}
              onChange={(e) => {
                const v = e.target.value
                setDraft(v)
                clearTimeout(customTimer.current)
                customTimer.current = window.setTimeout(() => {
                  pickSeed(v)
                  setDraft(null)
                }, 120)
              }}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </label>
        </div>

        <div className={cn(sectionLabel, "mt-4")}>Scheme variant</div>
        <ChipGroup
          aria-label="Scheme variant"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[variant]}
          onSelectionChange={(keys) => {
            const next = [...keys][0] as SchemeVariant | undefined
            if (next) setVariant(next)
          }}
          className="mt-2 gap-1.5"
        >
          {SITE_VARIANTS.map(([id, label]) => (
            <FilterChip key={id} id={id}>
              {label}
            </FilterChip>
          ))}
        </ChipGroup>

        <div className={cn(sectionLabel, "mt-4")}>Contrast</div>
        <ConnectedButtonGroup
          aria-label="Contrast"
          selectedKeys={[String(contrast)]}
          onSelectionChange={(keys) => {
            const next = [...keys][0]
            if (next !== undefined) setContrast(Number(next))
          }}
          className="mt-2 flex w-full"
        >
          {CONTRASTS.map(([value, label]) => (
            <ConnectedButton key={value} id={String(value)} className="flex-1 not-data-selected:bg-surface-container-highest">
              {label}
            </ConnectedButton>
          ))}
        </ConnectedButtonGroup>

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setTheme({ seed: null, variant: "tonalSpot", contrast: 0 })}
            className={buttonVariants({ variant: "text", className: "cursor-pointer" })}
          >
            Reset
          </button>
          <Link to="/themes" className={buttonVariants({ className: "gap-2" })}>
            <Icon size={20}>tune</Icon>
            Theme builder
          </Link>
        </div>
      </Popover>
    </PopoverTrigger>
  )
}
