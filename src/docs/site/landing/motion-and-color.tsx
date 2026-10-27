import * as React from "react"
import type { Key } from "react-aria-components"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Fab } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { NavigationBar, NavigationBarItem } from "@/components/ui/navigation-bar"
import { LinearProgress } from "@/components/ui/progress"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ThemeScope, useTheme, type SchemeVariant } from "@/components/ui/theme-provider"
import { cn } from "@/lib/utils"
import { InlineCode, LinkButton, SectionTitle } from "@/docs/site/landing/shared"

/* ---------------------------------------------------------------- Motion */

const LANES: { name: string; puck: string; motion: string; extra?: string }[] = [
  { name: "emphasized", puck: "bg-on-surface-variant", motion: "duration-700 ease-emphasized" },
  { name: "spatial · fast", puck: "bg-primary", motion: "duration-(--md-spring-fast-spatial-duration) ease-fast-spatial" },
  { name: "spatial · default", puck: "bg-tertiary", motion: "duration-(--md-spring-default-spatial-duration) ease-default-spatial" },
  {
    name: "spatial · slow",
    puck: "bg-primary-fixed-dim",
    motion: "duration-(--md-spring-slow-spatial-duration) ease-slow-spatial",
    extra: "group-hover:scale-125 group-focus-visible:scale-125",
  },
]

const SPRINGS = [
  ["spatial.fast", "0.6", "800", "Buttons, chips, switches"],
  ["spatial.default", "0.8", "380", "FAB menu, cards, dialogs"],
  ["spatial.slow", "0.8", "200", "Sheets, panes, hero shapes"],
  ["effects.fast / default / slow", "1.0", "3800 / 1600 / 800", "Color, opacity, icon fill"],
] as const

export function Motion() {
  return (
    <Reveal>
      <section
        data-screen-label="Motion"
        className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-24"
      >
        <div
          className="min-w-0 space-y-3 rounded-xl bg-surface-container-low p-6 md:p-8"
          data-spec="Spring lanes|Hover or focus a lane: the puck crosses on the named curve and squares its corners. The spatial lanes are the real M3 Expressive springs compiled to CSS linear() stops, so there is no JS on the hot path."
        >
          {LANES.map((lane) => (
            <div
              key={lane.name}
              tabIndex={0}
              className="group focus-ring grid grid-cols-[150px_1fr] items-center gap-4 rounded-full bg-surface-container px-5 py-2 outline-none sm:grid-cols-[210px_1fr]"
            >
              <span className="font-mono text-body-sm">{lane.name}</span>
              <div className="relative h-8">
                <div
                  className={cn(
                    "absolute top-1 left-0 size-6 rounded-full transition-all group-hover:left-[calc(100%-24px)] group-hover:rounded-md group-focus-visible:left-[calc(100%-24px)] group-focus-visible:rounded-md",
                    lane.puck,
                    lane.motion,
                    lane.extra,
                  )}
                />
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button
              size="lg"
              icon={<Icon name="touch_app" />}
              data-spec="Large button · press morph|Corners full → 16dp on press with the FastSpatial spring, then overshoot back on release. Same curve the FAB and toggles use."
            >
              Press and hold
            </Button>
            <span className="max-w-[200px] text-body-sm text-on-surface-variant">
              Corners tighten on press, then overshoot back. That overshoot is the whole personality.
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <SectionTitle>Real M3 motion. Springs, not easings.</SectionTitle>
          <p className="mt-4 max-w-prose text-body-lg text-pretty text-on-surface-variant">
            Expressive React ships the full M3 Expressive spring set, compiled to CSS <InlineCode>linear()</InlineCode> curves. A button's corners, a
            FAB menu and a bottom sheet all share one physics, and <InlineCode>useMotion()</InlineCode> hands you the same springs for anything
            custom.
          </p>
          <Table containerClassName="mt-6 overflow-hidden rounded-lg border border-outline-variant">
            <TableHeader className="bg-surface-container-low">
              <TableRow>
                <TableHead className="px-4">Spring</TableHead>
                <TableHead className="px-4">Damping</TableHead>
                <TableHead className="px-4">Stiffness</TableHead>
                <TableHead className="hidden px-4 sm:table-cell">Used for</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SPRINGS.map(([name, damping, stiffness, use]) => (
                <TableRow key={name}>
                  <TableCell className="px-4 py-2.5 font-mono text-body-sm">{name}</TableCell>
                  <TableCell className="px-4 py-2.5 tabular-nums">{damping}</TableCell>
                  <TableCell className="px-4 py-2.5 tabular-nums">{stiffness}</TableCell>
                  <TableCell className="hidden px-4 py-2.5 text-on-surface-variant sm:table-cell">{use}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </Reveal>
  )
}

/* ---------------------------------------------------------------- Dynamic color */

const SEEDS: [hex: string, name: string][] = [
  ["#6750A4", "Baseline"],
  ["#0B57D0", "Blue"],
  ["#006A6A", "Teal"],
  ["#386A20", "Green"],
  ["#7D5700", "Amber"],
  ["#9C4146", "Rose"],
  ["#8E4585", "Magenta"],
  ["#4A6572", "Slate"],
]

const VARIANTS: [SchemeVariant, string][] = [
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

export function DynamicColor() {
  const theme = useTheme()
  const [seed, setSeed] = React.useState("#006A6A")
  const [variant, setVariant] = React.useState<SchemeVariant>("vibrant")
  const customTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const apply = () => {
    const previous = { seed: theme.seed, variant: theme.variant }
    theme.setTheme({ seed, variant })
    snackbar("Theme applied to the whole site", { action: { label: "Undo", onAction: () => theme.setTheme(previous) } })
  }

  return (
    <Reveal>
      <section data-screen-label="Dynamic color" className="mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:pb-24">
        <div className="grid grid-cols-1 gap-8 rounded-2xl bg-surface-container-low p-6 md:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <div className="min-w-0">
            <SectionTitle>One seed. Forty-nine roles. Light and dark.</SectionTitle>
            <p className="mt-4 max-w-prose text-body-lg text-pretty text-on-surface-variant">
              Pick any color and the whole scheme regenerates from Google's 2025 color spec: nine variants, three contrast levels, both modes. Try it
              on the preview, then push it to the whole site.
            </p>

            <div id="landing-seed-label" className="mt-6 text-label-md tracking-wider text-on-surface-variant uppercase">
              Seed
            </div>
            <div role="radiogroup" aria-labelledby="landing-seed-label" className="mt-2 flex flex-wrap gap-2">
              {SEEDS.map(([hex, name]) => {
                const on = hex.toUpperCase() === seed.toUpperCase()
                return (
                  <button
                    key={hex}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={name}
                    onClick={() => setSeed(hex)}
                    className={cn(
                      "state-layer focus-ring grid size-11 cursor-pointer place-items-center rounded-full text-white shape-morph",
                      on && "rounded-md ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low",
                    )}
                    style={{ background: hex }}
                  >
                    <Icon name="check" size={20} className={cn("transition-opacity", !on && "opacity-0")} />
                  </button>
                )
              })}
              <label
                className="state-layer relative grid size-11 cursor-pointer place-items-center rounded-full border border-outline-variant text-on-surface-variant focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-secondary"
                title="Custom seed"
              >
                <Icon name="colorize" size={20} />
                <input
                  type="color"
                  value={seed.toLowerCase()}
                  aria-label="Custom seed"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase()
                    clearTimeout(customTimer.current)
                    customTimer.current = setTimeout(() => setSeed(v), 120)
                  }}
                />
              </label>
            </div>

            <div id="landing-variant-label" className="mt-5 text-label-md tracking-wider text-on-surface-variant uppercase">
              Variant
            </div>
            <ChipGroup
              aria-labelledby="landing-variant-label"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[variant]}
              onSelectionChange={(keys: Set<Key>) => {
                const [k] = keys
                if (k) setVariant(k as SchemeVariant)
              }}
              className="mt-2 flex flex-wrap gap-1.5"
            >
              {VARIANTS.map(([id, label]) => (
                <FilterChip key={id} id={id}>
                  {label}
                </FilterChip>
              ))}
            </ChipGroup>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="sm" icon={<Icon name="format_paint" />} onPress={apply} className="h-12 pr-6 pl-5">
                Apply to whole site
              </Button>
              <LinkButton href="/themes" variant="text" className="h-12 px-5" trailingIcon={<Icon name="arrow_forward" size={20} />}>
                Open theme builder
              </LinkButton>
            </div>
          </div>

          <ThemeScope
            seed={seed}
            variant={variant}
            className="min-w-0 self-start overflow-hidden rounded-xl shadow-1 ring-1 ring-outline-variant/50 [&_*]:transition-colors [&_*]:duration-300"
            data-spec="Scoped recolor|All 49 --md-* role variables are rewritten on this card only, so everything inside repaints with a 300ms crossfade. Apply to whole site writes the same variables on :root."
          >
            <GardenPreview />
          </ThemeScope>
        </div>
      </section>
    </Reveal>
  )
}

/** A tiny themed app, built from real components, that repaints with the chosen seed. */
function GardenPreview() {
  const [tab, setTab] = React.useState("garden")
  return (
    <div className="bg-surface text-on-surface">
      <div className="flex h-14 items-center gap-2 bg-surface-container px-2">
        <IconButton aria-label="Menu">
          <Icon name="menu" />
        </IconButton>
        <span className="flex-1 text-title-lg">Garden</span>
        <IconButton aria-label="Search">
          <Icon name="search" />
        </IconButton>
        <Avatar name="Maya" fallback="M" size="sm" color="tertiary" className="mr-1" />
      </div>
      <div className="space-y-4 p-4">
        <div className="text-headline-sm font-semibold">Good morning, Maya</div>
        <div className="grid grid-cols-[1.2fr_1fr] gap-3">
          <div className="rounded-xl bg-primary-container p-4 text-on-primary-container">
            <div className="text-label-md">Watering today</div>
            <div className="mt-1 text-display-sm font-medium tabular-nums">4</div>
            <LinearProgress value={60} aria-label="Watered" className="mt-3" showStop={false} />
          </div>
          <div className="flex flex-col justify-between rounded-xl bg-tertiary-container p-4 text-on-tertiary-container">
            <Icon name="wb_sunny" size={28} />
            <div>
              <div className="text-title-lg">24°</div>
              <div className="text-body-sm">Full sun until 4pm</div>
            </div>
          </div>
        </div>
        <ul className="space-y-1 rounded-xl bg-surface-container-high p-2">
          {[
            ["potted_plant", "Monstera", "2 days", false],
            ["eco", "Fiddle-leaf fig", "Today", true],
            ["local_florist", "Orchid", "5 days", false],
          ].map(([icon, name, when, on]) => (
            <li
              key={name as string}
              className={cn("flex h-12 items-center gap-3 rounded-lg px-3", on && "bg-secondary-container text-on-secondary-container")}
            >
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full",
                  on ? "bg-secondary text-on-secondary" : "bg-secondary-container text-on-secondary-container",
                )}
              >
                <Icon name={icon as string} size={20} filled={!!on} />
              </span>
              <span className="flex-1 text-body-lg">{name}</span>
              <span className={cn("text-label-md", !on && "text-on-surface-variant")}>{when}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button size="sm" onPress={() => snackbar("Filled · preview")}>
            Filled
          </Button>
          <Button size="sm" variant="tonal" onPress={() => snackbar("Tonal · preview")}>
            Tonal
          </Button>
          <Button size="sm" variant="outlined" className="hidden sm:inline-flex" onPress={() => snackbar("Outlined · preview")}>
            Outlined
          </Button>
          <Fab aria-label="Add plant" className="ml-auto" onPress={() => snackbar("New plant")}>
            <Icon name="add" />
          </Fab>
        </div>
      </div>
      <NavigationBar value={tab} onValueChange={setTab} layout="vertical" className="bg-surface-container">
        <NavigationBarItem value="garden" icon="yard" label="Garden" />
        <NavigationBarItem value="water" icon="water_drop" label="Water" />
        <NavigationBarItem value="plan" icon="calendar_month" label="Plan" />
        <NavigationBarItem value="you" icon="person" label="You" />
      </NavigationBar>
    </div>
  )
}
