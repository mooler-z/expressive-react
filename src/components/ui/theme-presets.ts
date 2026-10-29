/*
 * Theme presets · a complete look in one object: seed + scheme variant + contrast for color, plus hand-tuned
 * surface roles, a typeface, a shape scale and an elevation style. ThemeProvider (`defaultPreset`,
 * `setPreset`) and ThemeScope (`preset`) apply them; `presetCss()` renders one for SSR or a static file.
 *
 * Every shipped preset passes WCAG AA (4.5:1) on its text pairs in light and dark (tests/theme-presets.test.mjs).
 * 42 presets: 20 originals, Henon Pulse's two looks (Henon, Pulse) and 20 inspired by coolors.co trending palettes.
 *
 * No "use client": the data and the CSS helpers work in server components and build scripts too.
 */

/** Same union as `SchemeVariant` in theme-provider; repeated so this module doesn't depend on a client module. */
type SchemeVariant = "tonalSpot" | "vibrant" | "expressive" | "fidelity" | "content" | "monochrome" | "neutral" | "rainbow" | "fruitSalad"

/** Every M3 color role, in the order the `--md-*` variables are written. */
export const COLOR_ROLES = [
  "primary", "onPrimary", "primaryContainer", "onPrimaryContainer", "primaryFixed", "primaryFixedDim", "onPrimaryFixed", "onPrimaryFixedVariant",
  "secondary", "onSecondary", "secondaryContainer", "onSecondaryContainer", "secondaryFixed", "secondaryFixedDim", "onSecondaryFixed", "onSecondaryFixedVariant",
  "tertiary", "onTertiary", "tertiaryContainer", "onTertiaryContainer", "tertiaryFixed", "tertiaryFixedDim", "onTertiaryFixed", "onTertiaryFixedVariant",
  "error", "onError", "errorContainer", "onErrorContainer",
  "surface", "surfaceDim", "surfaceBright", "surfaceContainerLowest", "surfaceContainerLow", "surfaceContainer", "surfaceContainerHigh", "surfaceContainerHighest", "surfaceVariant", "surfaceTint",
  "onSurface", "onSurfaceVariant", "outline", "outlineVariant", "inverseSurface", "inverseOnSurface", "inversePrimary", "scrim", "shadow",
] as const

export type ColorRole = (typeof COLOR_ROLES)[number]

/** Hex values per role, applied on top of the generated scheme. */
export type ColorOverrides = Partial<Record<ColorRole, string>>

/** The radius tokens behind `rounded-xs … rounded-2xl`. */
export type RadiusToken = "xs" | "sm" | "md" | "lg" | "lg-plus" | "xl" | "xl-plus" | "2xl"

/** Named shape scales. Buttons, chips and FABs keep their M3 pill shapes; cards, fields, menus and dialogs follow the scale. */
export const SHAPE_SCALES = {
  /** The M3 scale: 4 · 8 · 12 · 16 · 20 · 28 · 32 · 48 */
  standard: { xs: "4px", sm: "8px", md: "12px", lg: "16px", "lg-plus": "20px", xl: "28px", "xl-plus": "32px", "2xl": "48px" },
  /** Tighter corners for dense, professional UIs: 2 · 4 · 6 · 8 · 10 · 12 · 14 · 20 */
  sharp: { xs: "2px", sm: "4px", md: "6px", lg: "8px", "lg-plus": "10px", xl: "12px", "xl-plus": "14px", "2xl": "20px" },
  /** A step below M3: 4 · 6 · 8 · 10 · 12 · 16 · 20 · 28 */
  subtle: { xs: "4px", sm: "6px", md: "8px", lg: "10px", "lg-plus": "12px", xl: "16px", "xl-plus": "20px", "2xl": "28px" },
  /** Softer and friendlier: 8 · 12 · 16 · 20 · 24 · 32 · 36 · 56 */
  rounded: { xs: "8px", sm: "12px", md: "16px", lg: "20px", "lg-plus": "24px", xl: "32px", "xl-plus": "36px", "2xl": "56px" },
} satisfies Record<string, Record<RadiusToken, string>>

export type PresetShape = keyof typeof SHAPE_SCALES | Partial<Record<RadiusToken, string>>

/* A hairline in the element's own text color, so it reads on any surface and in either mode. */
const ring = (pct: number) => `0 0 0 1px color-mix(in srgb, currentColor ${pct}%, transparent)`

/** Named elevation styles for `shadow-1 … shadow-5` (levels 1–5). */
export const ELEVATIONS = {
  /** M3 key + ambient shadows. */
  standard: [
    "0 1px 2px rgb(0 0 0 / 0.3), 0 1px 3px 1px rgb(0 0 0 / 0.15)",
    "0 1px 2px rgb(0 0 0 / 0.3), 0 2px 6px 2px rgb(0 0 0 / 0.15)",
    "0 1px 3px rgb(0 0 0 / 0.3), 0 4px 8px 3px rgb(0 0 0 / 0.15)",
    "0 2px 3px rgb(0 0 0 / 0.3), 0 6px 10px 4px rgb(0 0 0 / 0.15)",
    "0 4px 4px rgb(0 0 0 / 0.3), 0 8px 12px 6px rgb(0 0 0 / 0.15)",
  ],
  /** Wide, faint, diffuse shadows. */
  soft: [
    "0 1px 2px rgb(0 0 0 / 0.05), 0 1px 4px rgb(0 0 0 / 0.05)",
    "0 1px 3px rgb(0 0 0 / 0.05), 0 4px 12px rgb(0 0 0 / 0.07)",
    "0 2px 6px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.09)",
    "0 4px 8px rgb(0 0 0 / 0.07), 0 12px 32px rgb(0 0 0 / 0.11)",
    "0 6px 12px rgb(0 0 0 / 0.08), 0 20px 48px rgb(0 0 0 / 0.14)",
  ],
  /** A hairline edge plus a tight drop: the precise look of developer tools. */
  crisp: [
    `${ring(10)}, 0 1px 2px rgb(0 0 0 / 0.06)`,
    `${ring(10)}, 0 2px 4px rgb(0 0 0 / 0.08)`,
    `${ring(12)}, 0 4px 12px rgb(0 0 0 / 0.12)`,
    `${ring(12)}, 0 8px 20px rgb(0 0 0 / 0.14)`,
    `${ring(12)}, 0 12px 32px rgb(0 0 0 / 0.18)`,
  ],
  /** Hairlines instead of shadows; only floating layers (levels 3–5) keep a faint drop. */
  flat: [
    ring(12),
    ring(14),
    `${ring(12)}, 0 4px 16px rgb(0 0 0 / 0.08)`,
    `${ring(12)}, 0 8px 24px rgb(0 0 0 / 0.1)`,
    `${ring(12)}, 0 12px 36px rgb(0 0 0 / 0.14)`,
  ],
} satisfies Record<string, readonly [string, string, string, string, string] | string[]>

export type PresetElevation = keyof typeof ELEVATIONS | readonly [string, string, string, string, string]

export interface PresetTypeface {
  /** Font stack for all UI text (`--font-sans`). It doesn't have to be a sans: Paper uses a serif. */
  sans: string
  /** Font stack for code (`--font-mono`). Defaults to Roboto Mono. */
  mono?: string
  /** Stylesheet that loads the faces (e.g. a Google Fonts css2 URL). Injected only while the preset is active. */
  href?: string
}

export interface ThemePreset {
  /** Stable id, persisted by ThemeProvider. */
  id: string
  /** Display name for pickers. */
  name: string
  /** One line of character for pickers. */
  description: string
  seed: string
  variant: SchemeVariant
  /** -1 … 1. Defaults to 0. */
  contrast?: number
  /**
   * Hand-tuned roles on top of the generated scheme: canvas (`surface`), cards (`surfaceContainer*`),
   * hairlines (`outlineVariant`), accents. Applied only while seed, variant and contrast are the preset's own.
   */
  colors?: { light?: ColorOverrides; dark?: ColorOverrides }
  font?: PresetTypeface
  /** Named scale or individual radius tokens. Defaults to "standard". */
  shape?: PresetShape
  /** Named style or five box-shadow values. Defaults to "standard". */
  elevation?: PresetElevation
  /** Picker colors per mode: primary, secondary container, tertiary, surface. */
  swatches?: { light: string[]; dark: string[] }
}

/** Generate with a different seed, variant or contrast than the preset's own (its type, shape and elevation still apply). */
export interface PresetOptions {
  seed?: string | null
  variant?: SchemeVariant
  contrast?: number
}

const DEFAULT_SANS = '"Roboto Flex", Roboto, system-ui, sans-serif'
const DEFAULT_MONO = '"Roboto Mono", ui-monospace, SFMono-Regular, monospace'

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())

/**
 * Loads the color library on first use and returns a generator for one seed: `(dark) => { "--md-primary": "#…", … }`.
 * M3 2025 color spec. ThemeProvider, ThemeScope and the preset helpers all share it.
 */
export async function createSchemeGenerator(seed: string, variant: SchemeVariant = "tonalSpot", contrast = 0) {
  const mcu = await import("@material/material-color-utilities")
  const Scheme = {
    tonalSpot: mcu.SchemeTonalSpot,
    vibrant: mcu.SchemeVibrant,
    expressive: mcu.SchemeExpressive,
    fidelity: mcu.SchemeFidelity,
    content: mcu.SchemeContent,
    monochrome: mcu.SchemeMonochrome,
    neutral: mcu.SchemeNeutral,
    rainbow: mcu.SchemeRainbow,
    fruitSalad: mcu.SchemeFruitSalad,
  }[variant]
  const colors = new mcu.MaterialDynamicColors()
  const hct = mcu.Hct.fromInt(mcu.argbFromHex(seed))
  return (dark: boolean): Record<string, string> => {
    const scheme = new Scheme(hct, dark, contrast, "2025")
    return Object.fromEntries(COLOR_ROLES.map((role) => [`--md-${kebab(role)}`, mcu.hexFromArgb(colors[role]().getArgb(scheme))]))
  }
}

/** Find a preset by id (case-insensitive) in `presets` (default: the shipped ones). */
export function getThemePreset(id: string | null | undefined, presets: readonly ThemePreset[] = THEME_PRESETS): ThemePreset | undefined {
  if (!id) return undefined
  const key = id.toLowerCase()
  return presets.find((p) => p.id.toLowerCase() === key)
}

/**
 * The preset's non-color tokens: `--font-sans`, `--font-mono`, `--radius-*` and `--md-elevation-1…5`.
 * Pass null for the library defaults (used to reset a subtree inside a preset-themed page).
 */
export function presetStyleTokens(preset: ThemePreset | null): Record<string, string> {
  const shape = preset?.shape ?? "standard"
  const radii = { ...SHAPE_SCALES.standard, ...(typeof shape === "string" ? SHAPE_SCALES[shape] : shape) }
  const elevation = preset?.elevation ?? "standard"
  const shadows = typeof elevation === "string" ? ELEVATIONS[elevation] : elevation
  return {
    "--font-sans": preset?.font?.sans ?? DEFAULT_SANS,
    "--font-mono": preset?.font?.mono ?? DEFAULT_MONO,
    ...Object.fromEntries(Object.entries(radii).map(([k, v]) => [`--radius-${k}`, v])),
    ...Object.fromEntries(shadows.map((v, i) => [`--md-elevation-${i + 1}`, v])),
  }
}

/** True when the options generate the preset's own scheme, so its hand-tuned colors apply. */
function isOwnScheme(preset: ThemePreset, options?: PresetOptions) {
  const seed = options?.seed ?? preset.seed
  return (
    seed.toLowerCase() === preset.seed.toLowerCase() &&
    (options?.variant ?? preset.variant) === preset.variant &&
    (options?.contrast ?? preset.contrast ?? 0) === (preset.contrast ?? 0)
  )
}

function overrides(preset: ThemePreset, dark: boolean): Record<string, string> {
  const roles = (dark ? preset.colors?.dark : preset.colors?.light) ?? {}
  return Object.fromEntries(Object.entries(roles).map(([role, hex]) => [`--md-${kebab(role)}`, hex as string]))
}

async function presetGenerator(preset: ThemePreset, options?: PresetOptions) {
  const gen = await createSchemeGenerator(options?.seed ?? preset.seed, options?.variant ?? preset.variant, options?.contrast ?? preset.contrast ?? 0)
  const own = isOwnScheme(preset, options)
  return (dark: boolean) => ({ ...gen(dark), ...(own ? overrides(preset, dark) : {}) })
}

/** Every variable a preset sets for one mode: the 47 `--md-*` color roles plus its type, shape and elevation tokens. */
export async function presetTokens(preset: ThemePreset, dark = false, options?: PresetOptions): Promise<Record<string, string>> {
  return { ...(await presetGenerator(preset, options))(dark), ...presetStyleTokens(preset) }
}

/**
 * A preset as CSS for both modes: `html:root{…}` and `html.dark{…}`, which outrank expressive.css whatever the
 * stylesheet order. With `fonts` (default true) it starts with an `@import` of the preset's font stylesheet,
 * so keep it at the top of its own <style> tag or file.
 */
export async function presetCss(preset: ThemePreset, options?: PresetOptions & { fonts?: boolean }): Promise<string> {
  const gen = await presetGenerator(preset, options)
  const decls = (vars: Record<string, string>) => Object.entries(vars).map(([k, v]) => `${k}:${v};`).join("")
  const font = options?.fonts !== false && preset.font?.href ? `@import url("${preset.font.href}");` : ""
  return `${font}html:root{${decls({ ...gen(false), ...presetStyleTokens(preset) })}}html.dark{${decls(gen(true))}}`
}

/** Adds the preset's font stylesheet to <head> once. No-op on the server and for presets without `font.href`. */
export function loadPresetFonts(preset: ThemePreset | null | undefined) {
  const href = preset?.font?.href
  if (!href || typeof document === "undefined") return
  if ([...document.querySelectorAll("link[data-expressive-font]")].some((l) => l.getAttribute("href") === href)) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  link.dataset.expressiveFont = preset.id
  document.head.appendChild(link)
}

/*
 * The shipped presets. Surface roles were tuned per preset (canvas, card and hairline tones on the preset's own
 * neutral hue); everything else comes from the seed. Swatches are primary · secondary container · tertiary · surface.
 */
export const THEME_PRESETS: readonly ThemePreset[] = [
  {
    id: "quiet",
    name: "Quiet",
    description: "Calm neutral grays, one indigo accent and hairline edges. For tools that should get out of the way.",
    seed: "#5B5BD6",
    variant: "rainbow",
    font: { sans: "\"Inter\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    shape: "subtle",
    elevation: "crisp",
    colors: {
      light: { surface: "#fcfcfc", surfaceDim: "#dddddd", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#f9f9f9", surfaceContainer: "#f3f3f3", surfaceContainerHigh: "#eeeeee", surfaceContainerHighest: "#e8e8e8", surfaceVariant: "#e4e2e3", onSurface: "#1f1f1f", onSurfaceVariant: "#4b4b4c", outline: "#787778", outlineVariant: "#e4e2e3", inverseSurface: "#303030", inverseOnSurface: "#f1f1f1", tertiary: "#466465", onTertiary: "#ffffff", tertiaryContainer: "#c8e9e9", onTertiaryContainer: "#173536", tertiaryFixed: "#c8e9e9", tertiaryFixedDim: "#adcccd", onTertiaryFixed: "#002021", onTertiaryFixedVariant: "#2e4c4d" },
      dark: { surface: "#0e0e0e", surfaceDim: "#0e0e0e", surfaceBright: "#353535", surfaceContainerLowest: "#070707", surfaceContainerLow: "#151515", surfaceContainer: "#191919", surfaceContainerHigh: "#222222", surfaceContainerHighest: "#2c2c2c", surfaceVariant: "#474648", onSurface: "#e8e8e8", onSurfaceVariant: "#c2c0c2", outline: "#929092", outlineVariant: "#353536", inverseSurface: "#e8e8e8", inverseOnSurface: "#303030", tertiary: "#adcccd", onTertiary: "#173536", tertiaryContainer: "#2e4c4d", onTertiaryContainer: "#c8e9e9", tertiaryFixed: "#c8e9e9", tertiaryFixedDim: "#adcccd", onTertiaryFixed: "#002021", onTertiaryFixedVariant: "#2e4c4d" },
    },
    swatches: { light: ["#5455a9","#e2e0f9","#466465","#fcfcfc"], dark: ["#c1c1ff","#454559","#adcccd","#0e0e0e"] },
  },
  {
    id: "paper",
    name: "Paper",
    description: "Cream pages, ink-dark type in a reading serif and a brick-red accent. Editorial and unhurried.",
    seed: "#A23B24",
    variant: "content",
    font: { sans: "\"Source Serif 4\", Georgia, serif", href: "https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400..700&display=swap" },
    shape: "sharp",
    elevation: "flat",
    colors: {
      light: { surface: "#f7f0e2", surfaceDim: "#e2dccf", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#fff9ec", surfaceContainer: "#f9f3e5", surfaceContainerHigh: "#eee8da", surfaceContainerHighest: "#e5dfd2", surfaceVariant: "#ebe2c7", onSurface: "#1e1c13", onSurfaceVariant: "#504b37", outline: "#7d7760", outlineVariant: "#dad1b7", inverseSurface: "#333027", inverseOnSurface: "#f7f0e2" },
      dark: { surface: "#12110c", surfaceDim: "#12110c", surfaceBright: "#37352f", surfaceContainerLowest: "#0c0b07", surfaceContainerLow: "#1b1a14", surfaceContainer: "#1f1d18", surfaceContainerHigh: "#272620", surfaceContainerHighest: "#32302a", surfaceVariant: "#4a4739", onSurface: "#ede7de", onSurfaceVariant: "#c7c1ae", outline: "#969180", outlineVariant: "#413e30", inverseSurface: "#ede7de", inverseOnSurface: "#32302a" },
    },
    swatches: { light: ["#82240f","#fdb5a5","#594200","#f7f0e2"], dark: ["#ffb4a3","#6e3b2f","#e9c266","#12110c"] },
  },
  {
    id: "navy",
    name: "Navy",
    description: "Deep navy on cool gray, set in IBM Plex. Steady, buttoned-up enterprise.",
    seed: "#1F3A8A",
    variant: "fidelity",
    font: { sans: "\"IBM Plex Sans\", system-ui, sans-serif", mono: "\"IBM Plex Mono\", ui-monospace, monospace", href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" },
    shape: "subtle",
    elevation: "standard",
    colors: {
      light: { surface: "#f4f3f7", surfaceDim: "#dddce0", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#faf9fd", surfaceContainerHigh: "#efedf1", surfaceContainerHighest: "#e6e5e9", surfaceVariant: "#e0e2ec", onSurface: "#1f1f23", onSurfaceVariant: "#484b54", outline: "#747780", outlineVariant: "#d5d7e1", inverseSurface: "#2f3033", inverseOnSurface: "#f2f0f4", tertiary: "#7d5700", onTertiary: "#ffffff", tertiaryContainer: "#ffd797", onTertiaryContainer: "#422c00", tertiaryFixed: "#ffdeab", tertiaryFixedDim: "#f7bd53", onTertiaryFixed: "#271900", onTertiaryFixedVariant: "#5f4100" },
      dark: { surface: "#0e1118", surfaceDim: "#0e1118", surfaceBright: "#32353c", surfaceContainerLowest: "#080b11", surfaceContainerLow: "#171a20", surfaceContainer: "#1b1e25", surfaceContainerHigh: "#23262d", surfaceContainerHighest: "#2d3038", surfaceVariant: "#404757", onSurface: "#e6e8f2", onSurfaceVariant: "#bac1d5", outline: "#8991a3", outlineVariant: "#363e4e", inverseSurface: "#e6e8f2", inverseOnSurface: "#2d3038", tertiary: "#f7bd53", onTertiary: "#422c00", tertiaryContainer: "#5f4100", onTertiaryContainer: "#ffdeab", tertiaryFixed: "#ffdeab", tertiaryFixedDim: "#f7bd53", onTertiaryFixed: "#271900", onTertiaryFixedVariant: "#5f4100" },
    },
    swatches: { light: ["#002270","#d1d8ff","#7d5700","#f4f3f7"], dark: ["#b6c4ff","#3d4565","#f7bd53","#0e1118"] },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Pine greens with a lake-blue counterpoint on softly green-tinted surfaces.",
    seed: "#2E6B3F",
    variant: "content",
    font: { sans: "\"Manrope\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "soft",
    colors: {
      light: { surface: "#f7fbf1", surfaceDim: "#d8dbd2", surfaceBright: "#f7fbf1", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#f2f5eb", surfaceContainer: "#ecefe6", surfaceContainerHigh: "#e6e9e0", surfaceContainerHighest: "#e0e4da", surfaceVariant: "#dbe6d4", onSurface: "#1d211b", onSurfaceVariant: "#444e41", outline: "#6f7a6b", outlineVariant: "#cfdbc9", inverseSurface: "#2d322b", inverseOnSurface: "#eff2e9" },
      dark: { surface: "#10140f", surfaceDim: "#10140f", surfaceBright: "#363a34", surfaceContainerLowest: "#0b0f0a", surfaceContainerLow: "#191d17", surfaceContainer: "#1d211b", surfaceContainerHigh: "#272b25", surfaceContainerHighest: "#323630", surfaceVariant: "#3f4a3c", onSurface: "#e6e9e0", onSurfaceVariant: "#b9c4b3", outline: "#899484", outlineVariant: "#364033", inverseSurface: "#e6e9e0", inverseOnSurface: "#2d322b" },
    },
    swatches: { light: ["#125229","#ceeacf","#16497b","#f7fbf1"], dark: ["#95d5a0","#354c38","#a2c9ff","#10140f"] },
  },
  {
    id: "terracotta",
    name: "Terracotta",
    description: "Fired-clay orange on warm plaster with a cool teal counterpoint. Rounded and friendly.",
    seed: "#C4572F",
    variant: "fidelity",
    font: { sans: "\"DM Sans\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..700&display=swap" },
    shape: "rounded",
    elevation: "soft",
    colors: {
      light: { surface: "#fff1e9", surfaceDim: "#e8dad3", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fff8f5", surfaceContainerHigh: "#faebe3", surfaceContainerHighest: "#f1e3db", surfaceVariant: "#f7dece", onSurface: "#251e1a", onSurfaceVariant: "#59483d", outline: "#877366", outlineVariant: "#ebd2c3", inverseSurface: "#372f2a", inverseOnSurface: "#fceee6" },
      dark: { surface: "#15100d", surfaceDim: "#15100d", surfaceBright: "#3a332f", surfaceContainerLowest: "#0f0a07", surfaceContainerLow: "#1e1815", surfaceContainer: "#221c19", surfaceContainerHigh: "#2b2521", surfaceContainerHighest: "#362f2b", surfaceVariant: "#52443b", onSurface: "#f2e6e0", onSurfaceVariant: "#d1bdb1", outline: "#9f8d82", outlineVariant: "#493b32", inverseSurface: "#f2e6e0", inverseOnSurface: "#362f2b" },
    },
    swatches: { light: ["#9f3c16","#fdb69e","#00657a","#fff1e9"], dark: ["#ffb59c","#6d3c2a","#75d3f0","#15100d"] },
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Vivid coral running into magenta on glowing peach surfaces. Loud in the best way.",
    seed: "#F25C3A",
    variant: "vibrant",
    font: { sans: "\"Plus Jakarta Sans\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" },
    shape: "rounded",
    elevation: "soft",
    colors: {
      light: { tertiary: "#9d367e", onTertiary: "#ffffff", tertiaryContainer: "#ffd8ec", onTertiaryContainer: "#60004b", tertiaryFixed: "#ffd8ec", tertiaryFixedDim: "#ffaede", onTertiaryFixed: "#3b002d", onTertiaryFixedVariant: "#7f1b65" },
      dark: { surface: "#1b110e", surfaceDim: "#1b110e", surfaceBright: "#433633", surfaceContainerLowest: "#150c09", surfaceContainerLow: "#241916", surfaceContainer: "#281d1a", surfaceContainerHigh: "#332724", surfaceContainerHighest: "#3e322e", surfaceVariant: "#5a413a", onSurface: "#f9e4de", onSurfaceVariant: "#dcb9b0", outline: "#a98a81", outlineVariant: "#503831", inverseSurface: "#f9e4de", inverseOnSurface: "#3a2e2a", tertiary: "#ffaede", onTertiary: "#60004b", tertiaryContainer: "#7f1b65", onTertiaryContainer: "#ffd8ec", tertiaryFixed: "#ffd8ec", tertiaryFixedDim: "#ffaede", onTertiaryFixed: "#3b002d", onTertiaryFixedVariant: "#7f1b65" },
    },
    swatches: { light: ["#ad2a0b","#ffc3c2","#9d367e","#fff4f3"], dark: ["#ff8f75","#84222b","#ffaede","#1b110e"] },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Saturated cyan and deep-water blues on airy, sea-tinted surfaces.",
    seed: "#0891B2",
    variant: "vibrant",
    font: { sans: "\"Figtree\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "standard",
    swatches: { light: ["#00647c","#99daff","#3355b7","#eff8ff"], dark: ["#6bdaff","#006689","#8aa4ff","#001019"] },
  },
  {
    id: "lavender",
    name: "Lavender",
    description: "Soft violet on a lavender canvas with white cards. Gentle, airy and round.",
    seed: "#8C7AE6",
    variant: "vibrant",
    font: { sans: "\"Nunito\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap" },
    shape: "rounded",
    elevation: "soft",
    colors: {
      light: { surface: "#faf4ff", surfaceDim: "#e0dae9", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fdf8ff", surfaceContainerHigh: "#f1ebfa", surfaceContainerHighest: "#e9e3f2", surfaceVariant: "#e6defc", onSurface: "#201e29", onSurfaceVariant: "#4d4860", outline: "#79748d", outlineVariant: "#dbd3f0", inverseSurface: "#312f3a", inverseOnSurface: "#f4eefd" },
      dark: { surface: "#111017", surfaceDim: "#111017", surfaceBright: "#36333c", surfaceContainerLowest: "#0b0a11", surfaceContainerLow: "#1a1820", surfaceContainer: "#1e1c24", surfaceContainerHigh: "#27252d", surfaceContainerHighest: "#312f38", surfaceVariant: "#484457", onSurface: "#ece6f1", onSurfaceVariant: "#c4bed4", outline: "#938ea3", outlineVariant: "#3f3b4d", inverseSurface: "#ece6f1", inverseOnSurface: "#312f38" },
    },
    swatches: { light: ["#5d3ade","#dec8ff","#9b3666","#faf4ff"], dark: ["#b1a1ff","#572f97","#ff9ac3","#111017"] },
  },
  {
    id: "ink",
    name: "Ink",
    description: "Black, white and nothing else, at medium contrast. Sharp corners, hairline edges, Archivo.",
    seed: "#000000",
    variant: "monochrome",
    contrast: 0.5,
    font: { sans: "\"Archivo\", system-ui, sans-serif", mono: "\"JetBrains Mono\", ui-monospace, monospace", href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" },
    shape: "sharp",
    elevation: "flat",
    colors: {
      light: { surface: "#fcfcfc", surfaceDim: "#dddddd", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#f9f9f9", surfaceContainer: "#f3f3f3", surfaceContainerHigh: "#eeeeee", surfaceContainerHighest: "#e8e8e8", surfaceVariant: "#e8e1e1", onSurface: "#0e0e0e", onSurfaceVariant: "#4f4a4b", outline: "#7b7676", outlineVariant: "#ccc5c5", inverseSurface: "#303030", inverseOnSurface: "#f1f1f1" },
      dark: { surface: "#0e0e0e", surfaceDim: "#0e0e0e", surfaceBright: "#353535", surfaceContainerLowest: "#070707", surfaceContainerLow: "#151515", surfaceContainer: "#191919", surfaceContainerHigh: "#222222", surfaceContainerHighest: "#2c2c2c", surfaceVariant: "#4a4646", onSurface: "#f9f9f9", onSurfaceVariant: "#c6bfc0", outline: "#958f90", outlineVariant: "#4a4646", inverseSurface: "#e8e8e8", inverseOnSurface: "#303030" },
    },
    swatches: { light: ["#000000","#6d6d6d","#363636","#fcfcfc"], dark: ["#ffffff","#919191","#e2e2e2","#0e0e0e"] },
  },
  {
    id: "mint",
    name: "Mint",
    description: "Fresh mint greens and white cards on a cool, clean canvas.",
    seed: "#2BB673",
    variant: "tonalSpot",
    font: { sans: "\"Outfit\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" },
    shape: "rounded",
    elevation: "soft",
    colors: {
      light: { surface: "#f0f9f1", surfaceDim: "#d6dfd7", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#f3fcf4", surfaceContainerHigh: "#e7f0e8", surfaceContainerHighest: "#dee8e0", surfaceVariant: "#d1e8d9", onSurface: "#19211d", onSurfaceVariant: "#3c5045", outline: "#677c6f", outlineVariant: "#c6ddce", inverseSurface: "#2a322d", inverseOnSurface: "#eaf3eb" },
      dark: { surface: "#0b130e", surfaceDim: "#0b130e", surfaceBright: "#2e3731", surfaceContainerLowest: "#050d09", surfaceContainerLow: "#131b17", surfaceContainer: "#171f1b", surfaceContainerHigh: "#1f2823", surfaceContainerHighest: "#2a322d", surfaceVariant: "#374b40", onSurface: "#e1ebe2", onSurfaceVariant: "#b0c6b8", outline: "#809689", outlineVariant: "#2e4237", inverseSurface: "#e1ebe2", inverseOnSurface: "#2a322d" },
    },
    swatches: { light: ["#35694a","#d1e8d5","#556535","#f0f9f1"], dark: ["#a6d1b2","#2c4032","#f2ffd0","#0b130e"] },
  },
  {
    id: "rose",
    name: "Rosé",
    description: "Dusty rose and mauve on blush-tinted surfaces. Quietly elegant.",
    seed: "#B4536A",
    variant: "tonalSpot",
    font: { sans: "\"Instrument Sans\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "soft",
    colors: {
      light: { surface: "#fff8f7", surfaceDim: "#e5d7d8", surfaceBright: "#fff8f7", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#fff0f1", surfaceContainer: "#f9eaec", surfaceContainerHigh: "#f3e5e6", surfaceContainerHighest: "#eedfe0", surfaceVariant: "#f7dce0", onSurface: "#251e1f", onSurfaceVariant: "#59474a", outline: "#877275", outlineVariant: "#ebd1d5", inverseSurface: "#372e30", inverseOnSurface: "#fcedef" },
      dark: { surface: "#181213", surfaceDim: "#181213", surfaceBright: "#403738", surfaceContainerLowest: "#130c0e", surfaceContainerLow: "#211a1b", surfaceContainer: "#251e1f", surfaceContainerHigh: "#302829", surfaceContainerHighest: "#3b3334", surfaceVariant: "#544245", onSurface: "#f3e5e6", onSurfaceVariant: "#d4bbbf", outline: "#a28b8f", outlineVariant: "#4a393c", inverseSurface: "#f3e5e6", inverseOnSurface: "#372e30" },
    },
    swatches: { light: ["#8a4d5a","#ffd9df","#755478","#fff8f7"], dark: ["#f5b6c1","#4f3439","#ffe7fc","#181213"] },
  },
  {
    id: "dune",
    name: "Dune",
    description: "Sand and sun-baked ochre with olive in the shade. Warm and grounded.",
    seed: "#A8692A",
    variant: "tonalSpot",
    font: { sans: "\"Work Sans\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&display=swap" },
    shape: "subtle",
    elevation: "soft",
    colors: {
      light: { surface: "#f5ead7", surfaceDim: "#e7dbca", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fff8f2", surfaceContainerHigh: "#efe4d2", surfaceContainerHighest: "#e7dbca", surfaceVariant: "#f3e1be", onSurface: "#241f14", onSurfaceVariant: "#564a30", outline: "#837659", outlineVariant: "#dbcaa9", inverseSurface: "#363024", inverseOnSurface: "#fbefdd" },
      dark: { surface: "#14110a", surfaceDim: "#14110a", surfaceBright: "#38342d", surfaceContainerLowest: "#0d0b05", surfaceContainerLow: "#1c1913", surfaceContainer: "#211d16", surfaceContainerHigh: "#29251e", surfaceContainerHighest: "#343028", surfaceVariant: "#4e4635", onSurface: "#efe7dc", onSurfaceVariant: "#ccc0aa", outline: "#9a8f7b", outlineVariant: "#453d2d", inverseSurface: "#efe7dc", inverseOnSurface: "#343028" },
    },
    swatches: { light: ["#845425","#ffdcc1","#63612b","#f5ead7"], dark: ["#f1bc8f","#4d3723","#fffbd5","#14110a"] },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Dark-first: periwinkle on blue-black, Space Grotesk and crisp edges. Light mode keeps the cool tint.",
    seed: "#7C8CFF",
    variant: "vibrant",
    font: { sans: "\"Space Grotesk\", system-ui, sans-serif", mono: "\"Space Mono\", ui-monospace, monospace", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" },
    shape: "standard",
    elevation: "crisp",
    colors: {
      light: { surface: "#faf8ff", surfaceDim: "#dbd9e0", surfaceBright: "#faf8ff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#f4f2fa", surfaceContainer: "#efedf4", surfaceContainerHigh: "#e9e7ef", surfaceContainerHighest: "#e3e1e9", surfaceVariant: "#e0e1f2", onSurface: "#1e1f25", onSurfaceVariant: "#484b58", outline: "#747685", outlineVariant: "#d5d6e6", inverseSurface: "#2f3036", inverseOnSurface: "#f1f0f7" },
      dark: { surface: "#0a0d1b", surfaceDim: "#0a0d1b", surfaceBright: "#353848", surfaceContainerLowest: "#040714", surfaceContainerLow: "#131725", surfaceContainer: "#171b29", surfaceContainerHigh: "#202332", surfaceContainerHighest: "#2a2e3d", surfaceVariant: "#3d4565", onSurface: "#e5e7fc", onSurfaceVariant: "#b8bfe6", outline: "#878fb3", outlineVariant: "#343c5c", inverseSurface: "#e5e7fc", inverseOnSurface: "#2c303f" },
    },
    swatches: { light: ["#2d46e5","#d2ccff","#93387e","#faf8ff"], dark: ["#9ca8ff","#41369f","#ffa4e2","#0a0d1b"] },
  },
  {
    id: "sakura",
    name: "Sakura",
    description: "Cherry-blossom pink with a fresh leaf-green accent on blush white. Soft and round.",
    seed: "#E8789E",
    variant: "content",
    font: { sans: "\"M PLUS Rounded 1c\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap" },
    shape: "rounded",
    elevation: "soft",
    colors: {
      light: { surface: "#fffbff", surfaceDim: "#e8d9dd", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#fff8f8", surfaceContainer: "#fff0f3", surfaceContainerHigh: "#faeaee", surfaceContainerHighest: "#f4e4e8", surfaceVariant: "#f7dbe4", onSurface: "#261d20", onSurfaceVariant: "#5a464d", outline: "#877179", outlineVariant: "#ecd0d8", inverseSurface: "#372e31", inverseOnSurface: "#fdedf0", tertiary: "#48663b", onTertiary: "#ffffff", tertiaryContainer: "#c9edb6", onTertiaryContainer: "#1b3711", tertiaryFixed: "#c9edb6", tertiaryFixedDim: "#aed09c", onTertiaryFixed: "#062101", onTertiaryFixedVariant: "#314e26" },
      dark: { surface: "#130c0f", surfaceDim: "#130c0f", surfaceBright: "#3c3235", surfaceContainerLowest: "#0c0608", surfaceContainerLow: "#1b1416", surfaceContainer: "#1f171a", surfaceContainerHigh: "#281f22", surfaceContainerHighest: "#332a2d", surfaceVariant: "#554248", onSurface: "#f4e4e8", onSurfaceVariant: "#d5bac2", outline: "#a28b92", outlineVariant: "#4b393f", inverseSurface: "#f4e4e8", inverseOnSurface: "#372e31", tertiary: "#aed09c", onTertiary: "#1b3711", tertiaryContainer: "#314e26", onTertiaryContainer: "#c9edb6", tertiaryFixed: "#c9edb6", tertiaryFixedDim: "#aed09c", onTertiaryFixed: "#062101", onTertiaryFixedVariant: "#314e26" },
    },
    swatches: { light: ["#9d3c60","#ffc1d2","#48663b","#fffbff"], dark: ["#ffb1c7","#663947","#aed09c","#130c0f"] },
  },
  {
    id: "meskel",
    name: "Meskel",
    description: "Ethiopian-inspired: highland green and Meskel-daisy gold, with red kept for errors. Renders Ge'ez script.",
    seed: "#078930",
    variant: "fidelity",
    font: { sans: "\"Noto Sans\", \"Noto Sans Ethiopic\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "standard",
    colors: {
      light: { surface: "#fff8ef", surfaceDim: "#dfd9d0", surfaceBright: "#fff8ef", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#f9f3e9", surfaceContainer: "#f3ede4", surfaceContainerHigh: "#eee7de", surfaceContainerHighest: "#e8e2d9", surfaceVariant: "#ebe2ce", onSurface: "#221f1a", onSurfaceVariant: "#504b3d", outline: "#7d7766", outlineVariant: "#dfd6c3", inverseSurface: "#33302a", inverseOnSurface: "#f6f0e7", tertiary: "#6d5e00", onTertiary: "#ffffff", tertiaryContainer: "#fcdc00", onTertiaryContainer: "#393000", tertiaryFixed: "#ffe245", tertiaryFixedDim: "#e3c600", onTertiaryFixed: "#211b00", onTertiaryFixedVariant: "#524700" },
      dark: { surface: "#15130e", surfaceDim: "#15130e", surfaceBright: "#3c3933", surfaceContainerLowest: "#100e09", surfaceContainerLow: "#1d1b16", surfaceContainer: "#221f1a", surfaceContainerHigh: "#2c2a24", surfaceContainerHighest: "#37342e", surfaceVariant: "#4c4638", onSurface: "#eee7de", onSurfaceVariant: "#c8c0ae", outline: "#97907f", outlineVariant: "#423d30", inverseSurface: "#eee7de", inverseOnSurface: "#33302a", tertiary: "#e3c600", onTertiary: "#393000", tertiaryContainer: "#524700", onTertiaryContainer: "#ffe245", tertiaryFixed: "#ffe245", tertiaryFixedDim: "#e3c600", onTertiaryFixed: "#211b00", onTertiaryFixedVariant: "#524700" },
    },
    swatches: { light: ["#006d23","#beecba","#6d5e00","#fff8ef"], dark: ["#6fdd79","#284f2a","#e3c600","#15130e"] },
  },
  {
    id: "graphite",
    name: "Graphite",
    description: "A pro dashboard: graphite neutrals, an amber signal color, sharp corners and dense Geist type.",
    seed: "#E0A100",
    variant: "rainbow",
    font: { sans: "\"Geist\", system-ui, sans-serif", mono: "\"Geist Mono\", ui-monospace, monospace", href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" },
    shape: "sharp",
    elevation: "crisp",
    colors: {
      light: { surface: "#efedee", surfaceDim: "#dedcdd", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#f8f6f7", surfaceContainerHigh: "#e9e8e8", surfaceContainerHighest: "#e1dfe0", surfaceVariant: "#e0e2e7", onSurface: "#1f2021", onSurfaceVariant: "#484c4f", outline: "#74777b", outlineVariant: "#d5d7db", inverseSurface: "#303031", inverseOnSurface: "#f2f0f1" },
      dark: { surface: "#161819", surfaceDim: "#101113", surfaceBright: "#343536", surfaceContainerLowest: "#101113", surfaceContainerLow: "#1e2021", surfaceContainer: "#222425", surfaceContainerHigh: "#2b2c2e", surfaceContainerHighest: "#363739", surfaceVariant: "#42474c", onSurface: "#e8e8ea", onSurfaceVariant: "#bdc1c7", outline: "#8c9196", outlineVariant: "#393e43", inverseSurface: "#e8e8ea", inverseOnSurface: "#2f3032" },
    },
    swatches: { light: ["#7c5800","#f7dfbb","#4d6544","#efedee"], dark: ["#f8bd49","#54442a","#b3cea6","#161819"] },
  },
  {
    id: "candy",
    name: "Candy",
    description: "Bubblegum pink and aqua with big round corners and Fredoka. Unapologetically playful.",
    seed: "#FF4FA3",
    variant: "vibrant",
    font: { sans: "\"Fredoka\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap" },
    shape: "rounded",
    elevation: "standard",
    colors: {
      light: { tertiary: "#00696c", onTertiary: "#ffffff", tertiaryContainer: "#64f7fc", onTertiaryContainer: "#003738", tertiaryFixed: "#64f7fc", tertiaryFixedDim: "#3edae0", onTertiaryFixed: "#002021", onTertiaryFixedVariant: "#004f52" },
      dark: { surface: "#191116", surfaceDim: "#191116", surfaceBright: "#41363d", surfaceContainerLowest: "#140c11", surfaceContainerLow: "#22191f", surfaceContainer: "#261d23", surfaceContainerHigh: "#31272d", surfaceContainerHighest: "#3c3238", surfaceVariant: "#55414e", onSurface: "#f5e4ec", onSurfaceVariant: "#d5b9ca", outline: "#a38a99", outlineVariant: "#4b3845", inverseSurface: "#f5e4ec", inverseOnSurface: "#372e34", tertiary: "#3edae0", onTertiary: "#003738", tertiaryContainer: "#004f52", onTertiaryContainer: "#64f7fc", tertiaryFixed: "#64f7fc", tertiaryFixedDim: "#3edae0", onTertiaryFixed: "#002021", onTertiaryFixedVariant: "#004f52" },
    },
    swatches: { light: ["#ac1c67","#ffbfe6","#00696c","#fff4f7"], dark: ["#ff88b8","#7b2166","#3edae0","#191116"] },
  },
  {
    id: "frost",
    name: "Frost",
    description: "Nordic: muted steel blue on icy gray, and a slate dark mode instead of black.",
    seed: "#5E81AC",
    variant: "tonalSpot",
    font: { sans: "\"Nunito Sans\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400..700&display=swap" },
    shape: "standard",
    elevation: "flat",
    colors: {
      light: { surface: "#eceef4", surfaceDim: "#dbdde3", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#f8f9ff", surfaceContainerHigh: "#eceef4", surfaceContainerHighest: "#e4e5eb", surfaceVariant: "#dce3f1", onSurface: "#1d2024", onSurfaceVariant: "#444c57", outline: "#707884", outlineVariant: "#d0d8e5", inverseSurface: "#2e3135", inverseOnSurface: "#eff0f7" },
      dark: { surface: "#303337", surfaceDim: "#292c31", surfaceBright: "#4d5055", surfaceContainerLowest: "#25282d", surfaceContainerLow: "#3b3e43", surfaceContainer: "#404247", surfaceContainerHigh: "#46494e", surfaceContainerHighest: "#505258", surfaceVariant: "#404752", onSurface: "#e7e8ee", onSurfaceVariant: "#cbd2e0", outline: "#8a919e", outlineVariant: "#535a66", inverseSurface: "#e7e8ee", inverseOnSurface: "#2e3135" },
    },
    swatches: { light: ["#3f6189","#d7e3f8","#615984","#eceef4"], dark: ["#afc8eb","#303c4c","#e1d8ff","#303337"] },
  },
  {
    id: "espresso",
    name: "Espresso",
    description: "Roasted browns on a crema canvas; a cozy dark roast at night.",
    seed: "#6F4E37",
    variant: "tonalSpot",
    font: { sans: "\"Bricolage Grotesque\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..700&display=swap" },
    shape: "standard",
    elevation: "soft",
    colors: {
      light: { surface: "#fceee2", surfaceDim: "#e8dbcf", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fff8f4", surfaceContainerHigh: "#f9ebe0", surfaceContainerHighest: "#f1e3d7", surfaceVariant: "#f6dfc7", onSurface: "#251e17", onSurfaceVariant: "#584937", outline: "#867461", outlineVariant: "#ead3bd", inverseSurface: "#372f27", inverseOnSurface: "#fceee2" },
      dark: { surface: "#15100b", surfaceDim: "#15100b", surfaceBright: "#3a342d", surfaceContainerLowest: "#0f0a06", surfaceContainerLow: "#1e1913", surfaceContainer: "#221d17", surfaceContainerHigh: "#2b251f", surfaceContainerHighest: "#362f29", surfaceVariant: "#524436", onSurface: "#f2e6dc", onSurfaceVariant: "#d1beab", outline: "#9f8e7c", outlineVariant: "#483b2d", inverseSurface: "#f2e6dc", inverseOnSurface: "#362f29" },
    },
    swatches: { light: ["#87522a","#ffdcc6","#696028","#fceee2"], dark: ["#f4ba93","#4f3625","#fff9ea","#15100b"] },
  },
  {
    id: "campus",
    name: "Campus",
    description: "A crisp school theme: royal blue and school-bus yellow, white cards on a light-blue canvas, Lexend for easy reading.",
    seed: "#1D4ED8",
    variant: "fidelity",
    font: { sans: "\"Lexend\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap" },
    shape: "subtle",
    elevation: "crisp",
    colors: {
      light: { surface: "#edf4fd", surfaceDim: "#d6dee6", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#f6faff", surfaceContainerHigh: "#e7eff7", surfaceContainerHighest: "#dfe6ee", surfaceVariant: "#d2e5f6", onSurface: "#192026", onSurfaceVariant: "#3c4d5b", outline: "#677988", outlineVariant: "#c7daea", inverseSurface: "#2a3138", inverseOnSurface: "#eaf1fa", tertiary: "#795900", onTertiary: "#ffffff", tertiaryContainer: "#ffcd63", onTertiaryContainer: "#402d00", tertiaryFixed: "#ffdea0", tertiaryFixedDim: "#fcbc00", onTertiaryFixed: "#261900", onTertiaryFixedVariant: "#5c4300" },
      dark: { surface: "#0a1217", surfaceDim: "#0a1217", surfaceBright: "#2e363c", surfaceContainerLowest: "#050c11", surfaceContainerLow: "#131a20", surfaceContainer: "#171e24", surfaceContainerHigh: "#1f272d", surfaceContainerHighest: "#2a3138", surfaceVariant: "#374956", onSurface: "#e2e9f1", onSurfaceVariant: "#b1c3d4", outline: "#8193a2", outlineVariant: "#2e404d", inverseSurface: "#e2e9f1", inverseOnSurface: "#2a3138", tertiary: "#fcbc00", onTertiary: "#402d00", tertiaryContainer: "#5c4300", onTertiaryContainer: "#ffdea0", tertiaryFixed: "#ffdea0", tertiaryFixedDim: "#fcbc00", onTertiaryFixed: "#261900", onTertiaryFixedVariant: "#5c4300" },
    },
    swatches: { light: ["#0037b0","#b0befe","#795900","#edf4fd"], dark: ["#b7c4ff","#35437b","#fcbc00","#0a1217"] },
  },
  /*
   * Henon Pulse's looks. Henon matches the Henon school app (light-blue canvas, white cards, hairline borders, Inter,
   * small corners; its elevation draws the hairline from --md-outline-variant). Pulse is plain M3 Expressive.
   */
  {
    id: "henon",
    name: "Henon",
    description: "The Henon school app: light-blue canvas, white cards with hairline borders, navy ink, Inter and small corners.",
    seed: "#0074ff",
    variant: "fidelity",
    font: { sans: "\"Inter\", \"Inter UI\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    shape: { xs: "4px", sm: "6px", md: "8px", lg: "10px", "lg-plus": "12px", xl: "12px", "xl-plus": "14px", "2xl": "16px" },
    elevation: [
      "0 0 0 1px var(--md-outline-variant), 0 1px 2px rgb(16 42 102 / 0.04), 0 1px 3px rgb(16 42 102 / 0.06)",
      "0 0 0 1px var(--md-outline-variant), 0 2px 6px rgb(16 42 102 / 0.08)",
      "0 1px 3px rgb(16 42 102 / 0.06), 0 4px 12px rgb(16 42 102 / 0.1)",
      "0 2px 6px rgb(16 42 102 / 0.06), 0 8px 20px rgb(16 42 102 / 0.12)",
      "0 4px 8px rgb(16 42 102 / 0.08), 0 12px 32px rgb(16 42 102 / 0.16)",
    ],
    colors: {
      light: { tertiary: "#4f44e2", onTertiary: "#ffffff", tertiaryContainer: "#e3dfff", onTertiaryContainer: "#3622ca", tertiaryFixed: "#e3dfff", tertiaryFixedDim: "#c4c0ff", onTertiaryFixed: "#100069", onTertiaryFixedVariant: "#3622ca", surface: "#edf5fe", surfaceDim: "#dfeaf7", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#ffffff", surfaceContainerHigh: "#f2faff", surfaceContainerHighest: "#e4effb", surfaceVariant: "#dde8f6", onSurface: "#1d2433", onSurfaceVariant: "#5b6578", outline: "#6e7d91", outlineVariant: "#dcebfb", secondaryContainer: "#e6f0fd", onSecondaryContainer: "#0a2a66", inverseSurface: "#26324a", inverseOnSurface: "#eef4fc" },
      dark: { tertiary: "#c4c0ff", onTertiary: "#2000a4", tertiaryContainer: "#3622ca", onTertiaryContainer: "#e3dfff", tertiaryFixed: "#e3dfff", tertiaryFixedDim: "#c4c0ff", onTertiaryFixed: "#100069", onTertiaryFixedVariant: "#3622ca", surface: "#0b1424", surfaceDim: "#08101d", surfaceBright: "#1a2a47", surfaceContainerLowest: "#08101d", surfaceContainerLow: "#111d33", surfaceContainer: "#0e1930", surfaceContainerHigh: "#16243e", surfaceContainerHighest: "#1c2d4b", surfaceVariant: "#26385a", onSurface: "#e3e9f4", onSurfaceVariant: "#9aa8bf", outline: "#707c96", outlineVariant: "#1f3150", secondaryContainer: "#1b3157", onSecondaryContainer: "#d6e6ff", inverseSurface: "#e3e9f4", inverseOnSurface: "#1d2433" },
    },
    swatches: { light: ["#0074ff","#28c76f","#fb8c00","#edf5fe"], dark: ["#0074ff","#28c76f","#fb8c00","#0b1424"] },
  },
  {
    id: "pulse",
    name: "Pulse",
    description: "Plain Material 3 Expressive in a bright cobalt: generated tonal surfaces, Roboto Flex and the full M3 corner scale.",
    seed: "#1d4aff",
    variant: "fidelity",
    swatches: { light: ["#1d4aff","#96a5fe","#8f2300","#fbf8ff"], dark: ["#bac3ff","#2f3f91","#ffb5a0","#11131c"] },
  },
  /*
   * Inspired by coolors.co trending palettes. Seeds, accents, canvases and swatches are the palettes' own colors;
   * the remaining tones were derived in HCT and adjusted until every pair passes the contrast tests.
   */
  {
    id: "olive-garden",
    name: "Olive Garden",
    description: "Olive and deep moss with caramel and burnt-orange accents on a cream canvas. Earthy and warm.",
    seed: "#606c38",
    variant: "fidelity",
    font: { sans: "\"Karla\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Karla:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "soft",
    colors: {
      light: { surface: "#fefae0", surfaceDim: "#dedac8", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffdf3", surfaceContainerHigh: "#ece8d6", surfaceContainerHighest: "#e6e3d1", surfaceVariant: "#e7e3c8", onSurface: "#1d1c11", onSurfaceVariant: "#494833", outline: "#7a7861", outlineVariant: "#d9d5ba", inverseSurface: "#323125", inverseOnSurface: "#f5f1df", secondary: "#7f5625", onSecondary: "#ffffff", secondaryContainer: "#ffdcbb", onSecondaryContainer: "#643f0f", secondaryFixed: "#ffdcbb", secondaryFixedDim: "#f3bc82", onSecondaryFixed: "#2b1700", onSecondaryFixedVariant: "#643f0f", tertiary: "#924c00", onTertiary: "#ffffff", tertiaryContainer: "#ffdcc4", onTertiaryContainer: "#6f3800", tertiaryFixed: "#ffdcc4", tertiaryFixedDim: "#ffb781", onTertiaryFixed: "#2f1400", onTertiaryFixedVariant: "#6f3800" },
      dark: { surface: "#11150c", surfaceDim: "#11150c", surfaceBright: "#373b30", surfaceContainerLowest: "#0c0f07", surfaceContainerLow: "#191d14", surfaceContainer: "#1d2118", surfaceContainerHigh: "#272b22", surfaceContainerHighest: "#32362c", surfaceVariant: "#424938", onSurface: "#e4e7d8", onSurfaceVariant: "#c2c9b3", outline: "#8c937f", outlineVariant: "#3e4534", inverseSurface: "#e1e4d5", inverseOnSurface: "#2e3228", tertiary: "#ffb781", onTertiary: "#4e2600", tertiaryContainer: "#6f3800", onTertiaryContainer: "#ffdcc4", tertiaryFixed: "#ffdcc4", tertiaryFixedDim: "#ffb781", onTertiaryFixed: "#2f1400", onTertiaryFixedVariant: "#6f3800" },
    },
    swatches: { light: ["#606c38","#dda15e","#bc6c25","#fefae0"], dark: ["#606c38","#dda15e","#bc6c25","#283618"] },
  },
  {
    id: "fiery-ocean",
    name: "Fiery Ocean",
    description: "Crimson on a cream canvas with navy and steel-blue counterpoints; at night the canvas turns deep-ocean navy.",
    seed: "#c1121f",
    variant: "fidelity",
    font: { sans: "\"Sora\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap" },
    shape: "subtle",
    elevation: "standard",
    colors: {
      light: { surface: "#fdf0d5", surfaceDim: "#dcd1ba", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#f3e7d0", surfaceContainerHighest: "#ede1ca", surfaceVariant: "#f0e1c0", onSurface: "#201b0d", onSurfaceVariant: "#4f462e", outline: "#81765b", outlineVariant: "#e2d3b3", inverseSurface: "#363020", inverseOnSurface: "#fbf0d8", secondary: "#446278", onSecondary: "#ffffff", secondaryContainer: "#cae6ff", onSecondaryContainer: "#2c4a60", secondaryFixed: "#cae6ff", secondaryFixedDim: "#abcae5", onSecondaryFixed: "#001e2f", onSecondaryFixedVariant: "#2c4a60", tertiary: "#2b6483", onTertiary: "#ffffff", tertiaryContainer: "#c6e7ff", onTertiaryContainer: "#074c6a", tertiaryFixed: "#c6e7ff", tertiaryFixedDim: "#98cdf0", onTertiaryFixed: "#001e2d", onTertiaryFixedVariant: "#074c6a" },
      dark: { surface: "#07151f", surfaceDim: "#07151f", surfaceBright: "#2d3b46", surfaceContainerLowest: "#030f19", surfaceContainerLow: "#0f1d27", surfaceContainer: "#13212b", surfaceContainerHigh: "#1e2b36", surfaceContainerHighest: "#293641", surfaceVariant: "#384956", onSurface: "#d9e7f5", onSurfaceVariant: "#b7c9d9", outline: "#8293a2", outlineVariant: "#344451", inverseSurface: "#d6e4f3", inverseOnSurface: "#24323d", secondary: "#abcae5", onSecondary: "#133348", secondaryContainer: "#2c4a60", onSecondaryContainer: "#cae6ff", secondaryFixed: "#cae6ff", secondaryFixedDim: "#abcae5", onSecondaryFixed: "#001e2f", onSecondaryFixedVariant: "#2c4a60", tertiary: "#98cdf0", onTertiary: "#00344b", tertiaryContainer: "#074c6a", onTertiaryContainer: "#c6e7ff", tertiaryFixed: "#c6e7ff", tertiaryFixedDim: "#98cdf0", onTertiaryFixed: "#001e2d", onTertiaryFixedVariant: "#074c6a" },
    },
    swatches: { light: ["#c1121f","#003049","#669bbc","#fdf0d5"], dark: ["#c1121f","#669bbc","#fdf0d5","#003049"] },
  },
  {
    id: "pastel-dreamland",
    name: "Pastel Dreamland",
    description: "Lilac, candy pink and baby blue on an airy lilac-white canvas, with Quicksand and big soft corners.",
    seed: "#cdb4db",
    variant: "fidelity",
    font: { sans: "\"Quicksand\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap" },
    shape: "rounded",
    elevation: "soft",
    colors: {
      light: { surface: "#fbf7ff", surfaceDim: "#dfd7de", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#eee6ed", surfaceContainerHighest: "#e8e0e8", surfaceVariant: "#ecdef0", onSurface: "#1e1a20", onSurfaceVariant: "#4d4351", outline: "#7e7383", outlineVariant: "#ded0e1", inverseSurface: "#332f35", inverseOnSurface: "#f7eef6", secondary: "#8a4a64", onSecondary: "#ffffff", secondaryContainer: "#ffd9e7", onSecondaryContainer: "#46122a", secondaryFixed: "#ffd9e4", secondaryFixedDim: "#ffb0cd", onSecondaryFixed: "#390720", onSecondaryFixedVariant: "#6f334c", tertiary: "#1e6392", onTertiary: "#ffffff", tertiaryContainer: "#d6ebff", onTertiaryContainer: "#002841", tertiaryFixed: "#cde5ff", tertiaryFixedDim: "#94ccff", onTertiaryFixed: "#001d32", onTertiaryFixedVariant: "#004b74" },
      dark: { surface: "#161219", surfaceDim: "#161219", surfaceBright: "#3d373f", surfaceContainerLowest: "#110d14", surfaceContainerLow: "#1f1a21", surfaceContainer: "#231e25", surfaceContainerHigh: "#2d2830", surfaceContainerHighest: "#38333b", surfaceVariant: "#4d4351", onSurface: "#ece2ed", onSurfaceVariant: "#cfc2d3", outline: "#988d9d", outlineVariant: "#483f4d", inverseSurface: "#eadfea", inverseOnSurface: "#342e37", secondary: "#ffb0cd", onSecondary: "#541d35", secondaryContainer: "#6f334c", onSecondaryContainer: "#ffd9e4", secondaryFixed: "#ffd9e4", secondaryFixedDim: "#ffb0cd", onSecondaryFixed: "#390720", onSecondaryFixedVariant: "#6f334c", tertiary: "#94ccff", onTertiary: "#003352", tertiaryContainer: "#004b74", onTertiaryContainer: "#cde5ff", tertiaryFixed: "#cde5ff", tertiaryFixedDim: "#94ccff", onTertiaryFixed: "#001d32", onTertiaryFixedVariant: "#004b74" },
    },
    swatches: { light: ["#cdb4db","#ffafcc","#a2d2ff","#fbf7ff"], dark: ["#cdb4db","#ffc8dd","#bde0fe","#18141c"] },
  },
  {
    id: "sunny-beach",
    name: "Sunny Beach",
    description: "Sea-green teal with saffron and burnt-sienna accents on warm sand; the dark mode is deep slate-teal.",
    seed: "#2a9d8f",
    variant: "fidelity",
    font: { sans: "\"Poppins\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" },
    shape: "rounded",
    elevation: "soft",
    colors: {
      light: { surface: "#fcf6e8", surfaceDim: "#e2d6c2", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#f3e7d2", surfaceContainerHighest: "#ede1cd", surfaceVariant: "#f0e1c5", onSurface: "#251f12", onSurfaceVariant: "#4f4631", outline: "#81765f", outlineVariant: "#e1d3b8", inverseSurface: "#363022", inverseOnSurface: "#fcefda", secondary: "#745b13", onSecondary: "#ffffff", secondaryContainer: "#ffdf96", onSecondaryContainer: "#5a4400", secondaryFixed: "#ffdf96", secondaryFixedDim: "#e5c372", onSecondaryFixed: "#251a00", onSecondaryFixedVariant: "#5a4400", tertiary: "#a33d23", onTertiary: "#ffffff", tertiaryContainer: "#ffdad2", onTertiaryContainer: "#83260e", tertiaryFixed: "#ffdad2", tertiaryFixedDim: "#ffb4a2", onTertiaryFixed: "#3c0700", onTertiaryFixedVariant: "#83260e" },
      dark: { surface: "#07151b", surfaceDim: "#07151b", surfaceBright: "#2d3b42", surfaceContainerLowest: "#031016", surfaceContainerLow: "#101d23", surfaceContainer: "#142127", surfaceContainerHigh: "#1e2c32", surfaceContainerHighest: "#29373d", surfaceVariant: "#384951", onSurface: "#d9e8f0", onSurfaceVariant: "#b7c9d3", outline: "#81939c", outlineVariant: "#33454d", inverseSurface: "#d6e5ed", inverseOnSurface: "#253239", secondary: "#e5c372", onSecondary: "#3e2e00", secondaryContainer: "#5a4400", onSecondaryContainer: "#ffdf96", secondaryFixed: "#ffdf96", secondaryFixedDim: "#e5c372", onSecondaryFixed: "#251a00", onSecondaryFixedVariant: "#5a4400", tertiary: "#ffb4a2", onTertiary: "#621100", tertiaryContainer: "#83260e", onTertiaryContainer: "#ffdad2", tertiaryFixed: "#ffdad2", tertiaryFixedDim: "#ffb4a2", onTertiaryFixed: "#3c0700", onTertiaryFixedVariant: "#83260e" },
    },
    swatches: { light: ["#2a9d8f","#e9c46a","#e76f51","#fcf6e8"], dark: ["#2a9d8f","#f4a261","#e76f51","#264653"] },
  },
  {
    id: "purple-raindrops",
    name: "Purple Raindrops",
    description: "Electric violet running from magenta to cyan, on cool violet-tinted surfaces and a deep indigo night.",
    seed: "#7209b7",
    variant: "fidelity",
    font: { sans: "\"Urbanist\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "crisp",
    colors: {
      light: { surface: "#fbf7ff", surfaceDim: "#ded7dd", surfaceBright: "#fff7fd", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#f8f1f7", surfaceContainer: "#f3ebf1", surfaceContainerHigh: "#ede5eb", surfaceContainerHighest: "#e7dfe6", surfaceVariant: "#eadfed", onSurface: "#1e1a1f", onSurfaceVariant: "#4c444f", outline: "#7d7481", outlineVariant: "#dcd1df", inverseSurface: "#332f34", inverseOnSurface: "#f6eef5", secondary: "#90475f", onSecondary: "#ffffff", secondaryContainer: "#ffd9e1", onSecondaryContainer: "#743047", secondaryFixed: "#ffd9e1", secondaryFixedDim: "#ffb1c6", onSecondaryFixed: "#3c031c", onSecondaryFixedVariant: "#743047", tertiary: "#006780", onTertiary: "#ffffff", tertiaryContainer: "#b7eaff", onTertiaryContainer: "#004e61", tertiaryFixed: "#b7eaff", tertiaryFixedDim: "#5bd5fc", onTertiaryFixed: "#001f28", onTertiaryFixedVariant: "#004e61" },
      dark: { surface: "#141120", surfaceDim: "#141120", surfaceBright: "#3a3748", surfaceContainerLowest: "#0f0c1b", surfaceContainerLow: "#1c1929", surfaceContainer: "#211d2d", surfaceContainerHigh: "#2b2838", surfaceContainerHighest: "#363243", surfaceVariant: "#48445b", onSurface: "#e9e2f8", onSurfaceVariant: "#cac2df", outline: "#938da8", outlineVariant: "#443f56", inverseSurface: "#e6dff5", inverseOnSurface: "#322e3f", secondary: "#ffb1c6", onSecondary: "#581931", secondaryContainer: "#743047", onSecondaryContainer: "#ffd9e1", secondaryFixed: "#ffd9e1", secondaryFixedDim: "#ffb1c6", onSecondaryFixed: "#3c031c", onSecondaryFixedVariant: "#743047", tertiary: "#5bd5fc", onTertiary: "#003543", tertiaryContainer: "#004e61", onTertiaryContainer: "#b7eaff", tertiaryFixed: "#b7eaff", tertiaryFixedDim: "#5bd5fc", onTertiaryFixed: "#001f28", onTertiaryFixedVariant: "#004e61" },
    },
    swatches: { light: ["#7209b7","#f72585","#4cc9f0","#fbf7ff"], dark: ["#7209b7","#f72585","#4cc9f0","#10002b"] },
  },
  {
    id: "black-gold",
    name: "Black & Gold",
    description: "Black-navy and gold on ivory, set in art-deco Josefin Sans with sharp corners; at night, gold on true black.",
    seed: "#14213d",
    variant: "fidelity",
    font: { sans: "\"Josefin Sans\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;600;700&display=swap" },
    shape: "sharp",
    elevation: "flat",
    colors: {
      light: { surface: "#fbfaf7", surfaceDim: "#dfd9d5", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#eee7e3", surfaceContainerHighest: "#e8e1dd", surfaceVariant: "#e9e1db", onSurface: "#1e1b19", onSurfaceVariant: "#4b4642", outline: "#7c7671", outlineVariant: "#e5e5e5", inverseSurface: "#33302d", inverseOnSurface: "#f6efeb", primary: "#162544", onPrimary: "#ffffff", primaryContainer: "#14213d", onPrimaryContainer: "#fca311", primaryFixed: "#d9e2ff", primaryFixedDim: "#b8c6ee", onPrimaryFixed: "#0b1a3a", onPrimaryFixedVariant: "#384667", surfaceTint: "#162544", inversePrimary: "#b8c6ee", secondary: "#5c5e67", onSecondary: "#ffffff", secondaryContainer: "#e1e2ec", onSecondaryContainer: "#44464f", secondaryFixed: "#e1e2ec", secondaryFixedDim: "#c5c6d0", onSecondaryFixed: "#191b23", onSecondaryFixedVariant: "#44464f", tertiary: "#8c5800", onTertiary: "#ffffff", tertiaryContainer: "#fca311", onTertiaryContainer: "#382000", tertiaryFixed: "#ffddb8", tertiaryFixedDim: "#ffb95f", onTertiaryFixed: "#2a1700", onTertiaryFixedVariant: "#653e00" },
      dark: { surface: "#000000", surfaceDim: "#000000", surfaceBright: "#2a2c31", surfaceContainerLowest: "#000000", surfaceContainerLow: "#0c0e13", surfaceContainer: "#121318", surfaceContainerHigh: "#1c1d23", surfaceContainerHighest: "#26282d", surfaceVariant: "#44464f", onSurface: "#e5e5ec", onSurfaceVariant: "#c5c6d0", outline: "#8f9099", outlineVariant: "#40424a", inverseSurface: "#e2e2e9", inverseOnSurface: "#2f3036", primary: "#fca310", onPrimary: "#472a00", primaryContainer: "#653e00", onPrimaryContainer: "#ffddb8", primaryFixed: "#ffddb8", primaryFixedDim: "#ffb95f", onPrimaryFixed: "#2a1700", onPrimaryFixedVariant: "#653e00", surfaceTint: "#fca310", inversePrimary: "#855300", secondary: "#d7c3b0", onSecondary: "#3a2e21", secondaryContainer: "#524436", onSecondaryContainer: "#f4dfcb", secondaryFixed: "#f4dfcb", secondaryFixedDim: "#d7c3b0", onSecondaryFixed: "#241a0e", onSecondaryFixedVariant: "#524436", tertiary: "#b4c6f5", onTertiary: "#1d2f56", tertiaryContainer: "#34466e", onTertiaryContainer: "#d9e2ff", tertiaryFixed: "#d9e2ff", tertiaryFixedDim: "#b4c6f5", onTertiaryFixed: "#041a40", onTertiaryFixedVariant: "#34466e" },
    },
    swatches: { light: ["#14213d","#fca311","#e5e5e5","#ffffff"], dark: ["#fca311","#14213d","#e5e5e5","#000000"] },
  },
  {
    id: "neutral-earth",
    name: "Neutral Earth",
    description: "Slate charcoal and latte on a greige canvas, with umber in the shadows. Calm, natural and grown-up.",
    seed: "#22333b",
    variant: "fidelity",
    font: { sans: "\"Hanken Grotesk\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" },
    shape: "subtle",
    elevation: "flat",
    colors: {
      light: { surface: "#eae0d5", surfaceDim: "#cec1b0", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#e8dac9", surfaceContainerHighest: "#dfd2c1", surfaceVariant: "#f1e0ca", onSurface: "#211b10", onSurfaceVariant: "#504535", outline: "#827563", outlineVariant: "#ddd1c3", inverseSurface: "#372f24", inverseOnSurface: "#fdefdd", secondary: "#725a3c", onSecondary: "#ffffff", secondaryContainer: "#feddb7", onSecondaryContainer: "#584327", secondaryFixed: "#feddb7", secondaryFixedDim: "#e1c19d", onSecondaryFixed: "#281802", onSecondaryFixedVariant: "#584327", tertiary: "#755934", onTertiary: "#ffffff", tertiaryContainer: "#ffddb4", onTertiaryContainer: "#5b421f", tertiaryFixed: "#ffddb4", tertiaryFixedDim: "#e5c093", onTertiaryFixed: "#291800", onTertiaryFixedVariant: "#5b421f" },
      dark: { surface: "#0a0908", surfaceDim: "#0a0908", surfaceBright: "#36312b", surfaceContainerLowest: "#030201", surfaceContainerLow: "#18140f", surfaceContainer: "#1c1813", surfaceContainerHigh: "#26221d", surfaceContainerHighest: "#312c27", surfaceVariant: "#4f4539", onSurface: "#ede4dc", onSurfaceVariant: "#d3c4b4", outline: "#9c8f80", outlineVariant: "#4a4135", inverseSurface: "#eae1d9", inverseOnSurface: "#34302a", secondary: "#e1c19d", onSecondary: "#402d13", secondaryContainer: "#584327", onSecondaryContainer: "#feddb7", secondaryFixed: "#feddb7", secondaryFixedDim: "#e1c19d", onSecondaryFixed: "#281802", onSecondaryFixedVariant: "#584327", tertiary: "#e5c093", onTertiary: "#422c0a", tertiaryContainer: "#5b421f", onTertiaryContainer: "#ffddb4", tertiaryFixed: "#ffddb4", tertiaryFixedDim: "#e5c093", onTertiaryFixed: "#291800", onTertiaryFixedVariant: "#5b421f" },
    },
    swatches: { light: ["#22333b","#c6ac8e","#5e503f","#eae0d5"], dark: ["#c6ac8e","#22333b","#5e503f","#0a0908"] },
  },
  {
    id: "enchanted-forest",
    name: "Enchanted Forest",
    description: "Misty sage and pine-teal over a sage-white canvas; the night mode is a soft slate instead of black.",
    seed: "#51796f",
    variant: "fidelity",
    font: { sans: "\"Alegreya Sans\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;500;700&display=swap" },
    shape: "standard",
    elevation: "soft",
    colors: {
      light: { surface: "#eef2ec", surfaceDim: "#cfd3cb", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fafef5", surfaceContainerHigh: "#e5e9e1", surfaceContainerHighest: "#e0e4db", surfaceVariant: "#dbe5d7", onSurface: "#181d18", onSurfaceVariant: "#40493f", outline: "#707a6e", outlineVariant: "#c9d2c5", inverseSurface: "#2d322c", inverseOnSurface: "#eef2e9", tertiary: "#47654e", onTertiary: "#ffffff", tertiaryContainer: "#c9ebce", onTertiaryContainer: "#304d38", tertiaryFixed: "#c9ebce", tertiaryFixedDim: "#aecfb3", onTertiaryFixed: "#04210f", onTertiaryFixedVariant: "#304d38" },
      dark: { surface: "#1c262b", surfaceDim: "#1c262b", surfaceBright: "#444e54", surfaceContainerLowest: "#182227", surfaceContainerLow: "#242e34", surfaceContainer: "#293338", surfaceContainerHigh: "#343e44", surfaceContainerHighest: "#3f494f", surfaceVariant: "#3b4950", onSurface: "#dce7ee", onSurfaceVariant: "#bac9d1", outline: "#85939b", outlineVariant: "#414e56", inverseSurface: "#d9e4eb", inverseOnSurface: "#283237", tertiary: "#aecfb3", onTertiary: "#1a3623", tertiaryContainer: "#304d38", onTertiaryContainer: "#c9ebce", tertiaryFixed: "#c9ebce", tertiaryFixedDim: "#aecfb3", onTertiaryFixed: "#04210f", onTertiaryFixedVariant: "#304d38" },
    },
    swatches: { light: ["#51796f","#c9d2c5","#85a98c","#eef2ec"], dark: ["#51796f","#364f52","#85a98c","#2f3e46"] },
  },
  {
    id: "soft-lavender",
    name: "Soft Lavender",
    description: "Dusk: slate indigo with mauve and rosy beige, on a warm blush canvas. Quiet and romantic.",
    seed: "#4a4e69",
    variant: "fidelity",
    font: { sans: "\"Jost\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap" },
    shape: "rounded",
    elevation: "soft",
    colors: {
      light: { surface: "#f2e9e4", surfaceDim: "#d8c9bf", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#f1e2d8", surfaceContainerHighest: "#e9dacf", surfaceVariant: "#f6decd", onSurface: "#221a14", onSurfaceVariant: "#534437", outline: "#867465", outlineVariant: "#e7d0bf", inverseSurface: "#372f28", inverseOnSurface: "#fdeee3", secondary: "#77574f", onSecondary: "#ffffff", secondaryContainer: "#ffdad3", onSecondaryContainer: "#5d3f39", secondaryFixed: "#ffdad3", secondaryFixedDim: "#e7bdb4", onSecondaryFixed: "#2c1510", onSecondaryFixedVariant: "#5d3f39", tertiary: "#6e576f", onTertiary: "#ffffff", tertiaryContainer: "#f8d9f6", onTertiaryContainer: "#553f56", tertiaryFixed: "#f8d9f6", tertiaryFixedDim: "#dbbdda", onTertiaryFixed: "#271529", onTertiaryFixedVariant: "#553f56" },
      dark: { surface: "#13121c", surfaceDim: "#13121c", surfaceBright: "#393843", surfaceContainerLowest: "#0d0d17", surfaceContainerLow: "#1b1b25", surfaceContainer: "#1f1f29", surfaceContainerHigh: "#292934", surfaceContainerHighest: "#34343f", surfaceVariant: "#464554", onSurface: "#e7e3f2", onSurfaceVariant: "#c7c4d6", outline: "#918f9f", outlineVariant: "#41414f", inverseSurface: "#e4e1ef", inverseOnSurface: "#302f3a", secondary: "#e7bdb4", onSecondary: "#442a24", secondaryContainer: "#5d3f39", onSecondaryContainer: "#ffdad3", secondaryFixed: "#ffdad3", secondaryFixedDim: "#e7bdb4", onSecondaryFixed: "#2c1510", onSecondaryFixedVariant: "#5d3f39", tertiary: "#dbbdda", onTertiary: "#3e293f", tertiaryContainer: "#553f56", onTertiaryContainer: "#f8d9f6", tertiaryFixed: "#f8d9f6", tertiaryFixedDim: "#dbbdda", onTertiaryFixed: "#271529", onTertiaryFixedVariant: "#553f56" },
    },
    swatches: { light: ["#4a4e69","#c9ada7","#9a8c98","#f2e9e4"], dark: ["#4a4e69","#c9ada7","#9a8c98","#22223b"] },
  },
  {
    id: "summer-fun",
    name: "Summer Fun",
    description: "Tangerine and amber on a sky-blue canvas with ocean-blue accents; a deep navy night. Bright and energetic.",
    seed: "#fc8500",
    variant: "fidelity",
    font: { sans: "\"Rubik\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "standard",
    colors: {
      light: { surface: "#eef7fc", surfaceDim: "#d0d7dd", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fafcff", surfaceContainerHigh: "#e2e9ee", surfaceContainerHighest: "#dce4e9", surfaceVariant: "#d6e5ed", onSurface: "#151d20", onSurfaceVariant: "#3b4950", outline: "#6b7981", outlineVariant: "#c8d7df", inverseSurface: "#2a3136", inverseOnSurface: "#eaf2f7", secondary: "#7d5800", onSecondary: "#ffffff", secondaryContainer: "#ffdea9", onSecondaryContainer: "#5e4100", secondaryFixed: "#ffdea9", secondaryFixedDim: "#f2be61", onSecondaryFixed: "#271900", onSecondaryFixedVariant: "#5e4100", tertiary: "#00677d", onTertiary: "#ffffff", tertiaryContainer: "#b2ebff", onTertiaryContainer: "#004e5f", tertiaryFixed: "#b2ebff", tertiaryFixedDim: "#69d4f4", onTertiaryFixed: "#001f27", onTertiaryFixedVariant: "#004e5f" },
      dark: { surface: "#06151e", surfaceDim: "#06151e", surfaceBright: "#2d3b46", surfaceContainerLowest: "#021019", surfaceContainerLow: "#0f1d27", surfaceContainer: "#13212b", surfaceContainerHigh: "#1e2c36", surfaceContainerHighest: "#283641", surfaceVariant: "#384956", onSurface: "#d8e7f5", onSurfaceVariant: "#b7c9d9", outline: "#8193a2", outlineVariant: "#334451", inverseSurface: "#d5e4f2", inverseOnSurface: "#24323c", secondary: "#f2be61", onSecondary: "#422c00", secondaryContainer: "#5e4100", onSecondaryContainer: "#ffdea9", secondaryFixed: "#ffdea9", secondaryFixedDim: "#f2be61", onSecondaryFixed: "#271900", onSecondaryFixedVariant: "#5e4100", tertiary: "#69d4f4", onTertiary: "#003642", tertiaryContainer: "#004e5f", onTertiaryContainer: "#b2ebff", tertiaryFixed: "#b2ebff", tertiaryFixedDim: "#69d4f4", onTertiaryFixed: "#001f27", onTertiaryFixedVariant: "#004e5f" },
    },
    swatches: { light: ["#fc8500","#ffb706","#219ebc","#eef7fc"], dark: ["#fc8500","#ffb706","#8ecae6","#023047"] },
  },
  {
    id: "monochrome-harmony",
    name: "Monochrome Harmony",
    description: "Charcoal on pale celery paper with one sunflower highlight for selection and emphasis. Crisp and editorial.",
    seed: "#242423",
    variant: "monochrome",
    font: { sans: "\"Schibsted Grotesk\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&display=swap" },
    shape: "sharp",
    elevation: "crisp",
    colors: {
      light: { surface: "#e8eddf", surfaceDim: "#cacdca", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fbfdfa", surfaceContainerHigh: "#e4e6e3", surfaceContainerHighest: "#dbdedb", surfaceVariant: "#dbe5df", onSurface: "#191c1b", onSurfaceVariant: "#3f4945", outline: "#6f7975", outlineVariant: "#cfdbd5", inverseSurface: "#2e312f", inverseOnSurface: "#eff1ee", secondary: "#765b00", onSecondary: "#ffffff", secondaryContainer: "#f5cb5c", onSecondaryContainer: "#312400", secondaryFixed: "#ffdf93", secondaryFixedDim: "#ebc255", onSecondaryFixed: "#241a00", onSecondaryFixedVariant: "#594400", tertiary: "#765b00", onTertiary: "#ffffff", tertiaryContainer: "#f5cb5c", onTertiaryContainer: "#312400", tertiaryFixed: "#ffdf93", tertiaryFixedDim: "#ebc254", onTertiaryFixed: "#241a00", onTertiaryFixedVariant: "#594400" },
      dark: { surface: "#1b1b1a", surfaceDim: "#1b1b1a", surfaceBright: "#414240", surfaceContainerLowest: "#161716", surfaceContainerLow: "#222322", surfaceContainer: "#262826", surfaceContainerHigh: "#313231", surfaceContainerHighest: "#3c3d3c", surfaceVariant: "#444845", onSurface: "#e6e5e3", onSurfaceVariant: "#c5c7c3", outline: "#8f918e", outlineVariant: "#404340", inverseSurface: "#e3e2e0", inverseOnSurface: "#30312f", secondary: "#e1c37d", onSecondary: "#3e2e00", secondaryContainer: "#584408", onSecondaryContainer: "#fedf96", secondaryFixed: "#fedf96", secondaryFixedDim: "#e1c37d", onSecondaryFixed: "#241a00", onSecondaryFixedVariant: "#584408", tertiary: "#ebc254", onTertiary: "#3e2e00", tertiaryContainer: "#594400", onTertiaryContainer: "#ffdf93", tertiaryFixed: "#ffdf93", tertiaryFixedDim: "#ebc254", onTertiaryFixed: "#241a00", onTertiaryFixedVariant: "#594400" },
    },
    swatches: { light: ["#242423","#f5cb5c","#cfdbd5","#e8eddf"], dark: ["#e8eddf","#f5cb5c","#333533","#242423"] },
  },
  {
    id: "moonlit-forest",
    name: "Moonlit Forest",
    description: "Aubergine and dusty rose on a pale celery canvas, with sage in the undergrowth. Set in Lora.",
    seed: "#51344d",
    variant: "fidelity",
    font: { sans: "\"Lora\", Georgia, serif", href: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "soft",
    colors: {
      light: { surface: "#f3f5e2", surfaceDim: "#d5d5c5", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fdfdf4", surfaceContainerHigh: "#eae9d8", surfaceContainerHighest: "#e4e3d3", surfaceVariant: "#e3e4cf", onSurface: "#1b1c12", onSurfaceVariant: "#464838", outline: "#777867", outlineVariant: "#dfe3c0", inverseSurface: "#303126", inverseOnSurface: "#f2f2e0", secondary: "#7a5551", onSecondary: "#ffffff", secondaryContainer: "#ffdad6", onSecondaryContainer: "#603e3a", secondaryFixed: "#ffdad6", secondaryFixedDim: "#ebbbb6", onSecondaryFixed: "#2e1411", onSecondaryFixedVariant: "#603e3a", tertiary: "#5f613c", onTertiary: "#ffffff", tertiaryContainer: "#e4e5b7", onTertiaryContainer: "#474927", tertiaryFixed: "#e4e5b7", tertiaryFixedDim: "#c8c99d", onTertiaryFixed: "#1b1d02", onTertiaryFixedVariant: "#474927" },
      dark: { surface: "#1a1018", surfaceDim: "#1a1018", surfaceBright: "#41363f", surfaceContainerLowest: "#140b13", surfaceContainerLow: "#221821", surfaceContainer: "#271c25", surfaceContainerHigh: "#32272f", surfaceContainerHighest: "#3d313a", surfaceVariant: "#51424e", onSurface: "#f3e0ec", onSurfaceVariant: "#d5c1cf", outline: "#9e8b99", outlineVariant: "#4c3e49", inverseSurface: "#f0dde9", inverseOnSurface: "#382d36", secondary: "#ebbbb6", onSecondary: "#462825", secondaryContainer: "#603e3a", onSecondaryContainer: "#ffdad6", secondaryFixed: "#ffdad6", secondaryFixedDim: "#ebbbb6", onSecondaryFixed: "#2e1411", onSecondaryFixedVariant: "#603e3a", tertiary: "#c8c99d", onTertiary: "#303213", tertiaryContainer: "#474927", onTertiaryContainer: "#e4e5b7", tertiaryFixed: "#e4e5b7", tertiaryFixedDim: "#c8c99d", onTertiaryFixed: "#1b1d02", onTertiaryFixedVariant: "#474927" },
    },
    swatches: { light: ["#51344d","#a78682","#989788","#e7ebc5"], dark: ["#6f5060","#a78682","#989788","#1a1219"] },
  },
  {
    id: "dark-sunset",
    name: "Dark Sunset",
    description: "Slate teal with mustard and maroon on a butter-yellow canvas; at night everything sinks into maroon-black.",
    seed: "#335c67",
    variant: "fidelity",
    font: { sans: "\"Libre Franklin\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap" },
    shape: "subtle",
    elevation: "crisp",
    colors: {
      light: { surface: "#fff9df", surfaceDim: "#e0dabe", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#f0e8cc", surfaceContainerHighest: "#eae3c7", surfaceVariant: "#ebe3c2", onSurface: "#1f1c0a", onSurfaceVariant: "#4b472f", outline: "#7d775c", outlineVariant: "#dcd5b4", inverseSurface: "#34311e", inverseOnSurface: "#f8f1d4", secondary: "#835500", onSecondary: "#ffffff", secondaryContainer: "#fff3b0", onSecondaryContainer: "#372100", secondaryFixed: "#ffddb4", secondaryFixedDim: "#f9bb64", onSecondaryFixed: "#291800", onSecondaryFixedVariant: "#633f00", tertiary: "#ab3333", onTertiary: "#ffffff", tertiaryContainer: "#ffdad7", onTertiaryContainer: "#8a1b1e", tertiaryFixed: "#ffdad7", tertiaryFixedDim: "#ffb3ae", onTertiaryFixed: "#410004", onTertiaryFixedVariant: "#8a1b1e" },
      dark: { surface: "#1f0f0e", surfaceDim: "#1f0f0e", surfaceBright: "#493432", surfaceContainerLowest: "#190a09", surfaceContainerLow: "#291716", surfaceContainer: "#2d1b1a", surfaceContainerHigh: "#392524", surfaceContainerHighest: "#44302e", surfaceVariant: "#5b403e", onSurface: "#ffdedb", onSurfaceVariant: "#e3bebb", outline: "#aa8986", outlineVariant: "#563c3a", inverseSurface: "#fcdbd8", inverseOnSurface: "#402b2a", secondary: "#f9bb64", onSecondary: "#452b00", secondaryContainer: "#633f00", onSecondaryContainer: "#ffddb4", secondaryFixed: "#ffddb4", secondaryFixedDim: "#f9bb64", onSecondaryFixed: "#291800", onSecondaryFixedVariant: "#633f00", tertiary: "#ffb3ae", onTertiary: "#68000c", tertiaryContainer: "#8a1b1e", onTertiaryContainer: "#ffdad7", tertiaryFixed: "#ffdad7", tertiaryFixedDim: "#ffb3ae", onTertiaryFixed: "#410004", onTertiaryFixedVariant: "#8a1b1e" },
    },
    swatches: { light: ["#335c67","#e09f3e","#9e2a2b","#fff3b0"], dark: ["#335c67","#e09f3e","#9e2a2b","#540b0e"] },
  },
  {
    id: "watermelon-sorbet",
    name: "Watermelon Sorbet",
    description: "Watermelon pink with a mint-rind green and lemon sorbet, on a cool mint-white canvas; deep teal at night.",
    seed: "#ef466f",
    variant: "fidelity",
    font: { sans: "\"Baloo 2\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&display=swap" },
    shape: "rounded",
    elevation: "standard",
    colors: {
      light: { surface: "#f4fbf8", surfaceDim: "#d7dbd7", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#f9fdf9", surfaceContainerHigh: "#e5e9e5", surfaceContainerHighest: "#dfe4df", surfaceVariant: "#dbe5de", onSurface: "#181d1a", onSurfaceVariant: "#404944", outline: "#707974", outlineVariant: "#cdd7d0", inverseSurface: "#2d312f", inverseOnSurface: "#eef2ed", secondary: "#785a00", onSecondary: "#ffffff", secondaryContainer: "#ffe8ad", onSecondaryContainer: "#322400", secondaryFixed: "#ffdf9b", secondaryFixedDim: "#ebc161", onSecondaryFixed: "#251a00", onSecondaryFixedVariant: "#5b4300", tertiary: "#006c4f", onTertiary: "#ffffff", tertiaryContainer: "#55fdc5", onTertiaryContainer: "#00513b", tertiaryFixed: "#55fdc5", tertiaryFixedDim: "#28e0aa", onTertiaryFixed: "#002116", onTertiaryFixedVariant: "#00513b" },
      dark: { surface: "#04151d", surfaceDim: "#04151d", surfaceBright: "#2b3c44", surfaceContainerLowest: "#011017", surfaceContainerLow: "#0c1e25", surfaceContainer: "#112229", surfaceContainerHigh: "#1b2c34", surfaceContainerHighest: "#26373f", surfaceVariant: "#354a53", onSurface: "#d6e8f2", onSurfaceVariant: "#b4cad6", outline: "#7f949f", outlineVariant: "#31454f", inverseSurface: "#d3e5f0", inverseOnSurface: "#22333b", secondary: "#ebc161", onSecondary: "#3f2e00", secondaryContainer: "#5b4300", onSecondaryContainer: "#ffdf9b", secondaryFixed: "#ffdf9b", secondaryFixedDim: "#ebc161", onSecondaryFixed: "#251a00", onSecondaryFixedVariant: "#5b4300", tertiary: "#28e0aa", onTertiary: "#003828", tertiaryContainer: "#00513b", onTertiaryContainer: "#55fdc5", tertiaryFixed: "#55fdc5", tertiaryFixedDim: "#28e0aa", onTertiaryFixed: "#002116", onTertiaryFixedVariant: "#00513b" },
    },
    swatches: { light: ["#ef466f","#ffd166","#0ad6a1","#f4fbf8"], dark: ["#ef466f","#ffd166","#0ad6a1","#083b4c"] },
  },
  {
    id: "cherry-crush",
    name: "Cherry Crush",
    description: "All cherries: crimson to black-cherry reds on a blush canvas, and a wine-dark night. Bold and romantic.",
    seed: "#a41d30",
    variant: "fidelity",
    font: { sans: "\"Albert Sans\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "standard",
    colors: {
      light: { surface: "#fff6f5", surfaceDim: "#e6d5d4", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#f6e4e3", surfaceContainerHighest: "#f0dedd", surfaceVariant: "#f8dcda", onSurface: "#231919", onSurfaceVariant: "#554241", outline: "#887271", outlineVariant: "#eacecd", inverseSurface: "#382e2d", inverseOnSurface: "#ffedeb", secondary: "#815153", onSecondary: "#ffffff", secondaryContainer: "#ffdada", onSecondaryContainer: "#663b3c", secondaryFixed: "#ffdada", secondaryFixedDim: "#f4b7b8", onSecondaryFixed: "#331113", onSecondaryFixedVariant: "#663b3c", tertiary: "#944748", onTertiary: "#ffffff", tertiaryContainer: "#ffdad9", onTertiaryContainer: "#773032", tertiaryFixed: "#ffdad9", tertiaryFixedDim: "#ffb3b2", onTertiaryFixed: "#3d050a", onTertiaryFixedVariant: "#773032" },
      dark: { surface: "#1f0f11", surfaceDim: "#1f0f11", surfaceBright: "#493436", surfaceContainerLowest: "#190a0c", surfaceContainerLow: "#281719", surfaceContainer: "#2d1b1d", surfaceContainerHigh: "#382527", surfaceContainerHighest: "#442f31", surfaceVariant: "#5a4043", onSurface: "#fedee0", onSurfaceVariant: "#e2bec1", outline: "#a9898c", outlineVariant: "#553c3e", inverseSurface: "#fbdbdd", inverseOnSurface: "#3f2b2d", secondary: "#f4b7b8", onSecondary: "#4c2527", secondaryContainer: "#663b3c", onSecondaryContainer: "#ffdada", secondaryFixed: "#ffdada", secondaryFixedDim: "#f4b7b8", onSecondaryFixed: "#331113", onSecondaryFixedVariant: "#663b3c", tertiary: "#ffb3b2", onTertiary: "#5a1a1d", tertiaryContainer: "#773032", onTertiaryContainer: "#ffdad9", tertiaryFixed: "#ffdad9", tertiaryFixedDim: "#ffb3b2", onTertiaryFixed: "#3d050a", onTertiaryFixedVariant: "#773032" },
    },
    swatches: { light: ["#a41d30","#c52233","#74121d","#fff6f5"], dark: ["#c52233","#a7333f","#74121d","#580c1f"] },
  },
  {
    id: "luminous-glow",
    name: "Luminous Glow",
    description: "Dark-first neon: lime-to-aqua glow on near-black, Chakra Petch and sharp edges. Light mode keeps the lime.",
    seed: "#c2f260",
    variant: "fidelity",
    font: { sans: "\"Chakra Petch\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap" },
    shape: "sharp",
    elevation: "crisp",
    colors: {
      light: { surface: "#f8fbef", surfaceDim: "#dadbcf", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fdfdf1", surfaceContainerHigh: "#e9e9dd", surfaceContainerHighest: "#e3e3d8", surfaceVariant: "#e2e4d4", onSurface: "#1a1c15", onSurfaceVariant: "#45483c", outline: "#76786b", outlineVariant: "#d4d6c6", inverseSurface: "#2f3129", inverseOnSurface: "#f1f1e6", secondary: "#62620a", onSecondary: "#ffffff", secondaryContainer: "#e8e785", onSecondaryContainer: "#494900", secondaryFixed: "#e8e785", secondaryFixedDim: "#cccb6c", onSecondaryFixed: "#1d1d00", onSecondaryFixedVariant: "#494900", tertiary: "#006a69", onTertiary: "#ffffff", tertiaryContainer: "#3cfaf9", onTertiaryContainer: "#00504f", tertiaryFixed: "#3cfaf9", tertiaryFixedDim: "#00dddc", onTertiaryFixed: "#002020", onTertiaryFixedVariant: "#00504f" },
      dark: { surface: "#0b0c09", surfaceDim: "#0b0c09", surfaceBright: "#33332f", surfaceContainerLowest: "#040503", surfaceContainerLow: "#161613", surfaceContainer: "#1a1a17", surfaceContainerHigh: "#242421", surfaceContainerHighest: "#2f2f2b", surfaceVariant: "#464740", onSurface: "#e7e5df", onSurfaceVariant: "#c7c7be", outline: "#919189", outlineVariant: "#42433c", inverseSurface: "#e4e2dc", inverseOnSurface: "#30312d", primary: "#c3f361", onPrimary: "#253600", primaryContainer: "#374e00", onPrimaryContainer: "#c3f361", primaryFixed: "#c3f361", primaryFixedDim: "#a8d647", onPrimaryFixed: "#141f00", onPrimaryFixedVariant: "#374e00", surfaceTint: "#c3f361", inversePrimary: "#4a6700", secondary: "#cccb6c", onSecondary: "#323200", secondaryContainer: "#494900", onSecondaryContainer: "#e8e785", secondaryFixed: "#e8e785", secondaryFixedDim: "#cccb6c", onSecondaryFixed: "#1d1d00", onSecondaryFixedVariant: "#494900", tertiary: "#31f4f3", onTertiary: "#003737", tertiaryContainer: "#00504f", onTertiaryContainer: "#3cfaf9", tertiaryFixed: "#3cfaf9", tertiaryFixedDim: "#00dddc", onTertiaryFixed: "#002020", onTertiaryFixedVariant: "#00504f" },
    },
    swatches: { light: ["#c2f260","#f2f231","#2ef3f2","#f8fbef"], dark: ["#c2f260","#91f291","#2ef3f2","#0b0c09"] },
  },
  {
    id: "vintage-charm",
    name: "Vintage Charm",
    description: "Bottle green and burnt orange on parchment, set in Fraunces; ink-blue at night. Like an old botanical print.",
    seed: "#183a37",
    variant: "fidelity",
    font: { sans: "\"Fraunces\", Georgia, serif", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&display=swap" },
    shape: "subtle",
    elevation: "flat",
    colors: {
      light: { surface: "#f8edda", surfaceDim: "#decdb3", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#f8e6ca", surfaceContainerHighest: "#efdec3", surfaceVariant: "#f6e0bb", onSurface: "#231a0a", onSurfaceVariant: "#53452a", outline: "#867556", outlineVariant: "#e8d6b6", inverseSurface: "#392f1d", inverseOnSurface: "#ffefd6", primary: "#18423e", onPrimary: "#ffffff", primaryContainer: "#183a37", onPrimaryContainer: "#efd6ac", primaryFixed: "#c0ebe5", primaryFixedDim: "#a4cfca", onPrimaryFixed: "#00201e", onPrimaryFixedVariant: "#254d4a", surfaceTint: "#18423e", inversePrimary: "#a4cfca", secondary: "#725763", onSecondary: "#ffffff", secondaryContainer: "#fdd9e7", onSecondaryContainer: "#59404b", secondaryFixed: "#fdd9e7", secondaryFixedDim: "#e0bdcb", onSecondaryFixed: "#29151f", onSecondaryFixedVariant: "#59404b", tertiary: "#a53c00", onTertiary: "#ffffff", tertiaryContainer: "#ffdbce", onTertiaryContainer: "#7e2c00", tertiaryFixed: "#ffdbce", tertiaryFixedDim: "#ffb598", onTertiaryFixed: "#370e00", onTertiaryFixedVariant: "#7e2c00" },
      dark: { surface: "#0b141a", surfaceDim: "#0b141a", surfaceBright: "#313a41", surfaceContainerLowest: "#060f15", surfaceContainerLow: "#141d23", surfaceContainer: "#182127", surfaceContainerHigh: "#222b32", surfaceContainerHighest: "#2d363d", surfaceVariant: "#3c4851", onSurface: "#dde6ef", onSurfaceVariant: "#bcc8d3", outline: "#86929c", outlineVariant: "#38444c", inverseSurface: "#dae4ec", inverseOnSurface: "#283238", secondary: "#e0bdcb", onSecondary: "#402a34", secondaryContainer: "#59404b", onSecondaryContainer: "#fdd9e7", secondaryFixed: "#fdd9e7", secondaryFixedDim: "#e0bdcb", onSecondaryFixed: "#29151f", onSecondaryFixedVariant: "#59404b", tertiary: "#ffb598", onTertiary: "#591d00", tertiaryContainer: "#7e2c00", onTertiaryContainer: "#ffdbce", tertiaryFixed: "#ffdbce", tertiaryFixedDim: "#ffb598", onTertiaryFixed: "#370e00", onTertiaryFixedVariant: "#7e2c00" },
    },
    swatches: { light: ["#183a37","#efd6ac","#c44901","#f8edda"], dark: ["#183a37","#432534","#c44901","#04151f"] },
  },
  {
    id: "daybreak",
    name: "Daybreak",
    description: "Indigo and periwinkle giving way to a sunrise of amber and orange, on a warm white canvas.",
    seed: "#3e348b",
    variant: "fidelity",
    font: { sans: "\"Mulish\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "soft",
    colors: {
      light: { surface: "#fdf9f2", surfaceDim: "#e1d9ce", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#f0e7dc", surfaceContainerHighest: "#eae1d6", surfaceVariant: "#ede1cf", onSurface: "#1f1b14", onSurfaceVariant: "#4d4639", outline: "#7f7667", outlineVariant: "#dfd3c1", inverseSurface: "#343028", inverseOnSurface: "#f9efe4", secondary: "#575899", onSecondary: "#ffffff", secondaryContainer: "#e1dfff", onSecondaryContainer: "#3f4080", secondaryFixed: "#e1dfff", secondaryFixedDim: "#c1c1ff", onSecondaryFixed: "#111152", onSecondaryFixedVariant: "#3f4080", tertiary: "#8f4e00", onTertiary: "#ffffff", tertiaryContainer: "#ffdcb8", onTertiaryContainer: "#3d1e00", tertiaryFixed: "#ffdcc2", tertiaryFixedDim: "#ffb77a", onTertiaryFixed: "#2e1500", onTertiaryFixedVariant: "#6d3a00" },
      dark: { surface: "#13121e", surfaceDim: "#13121e", surfaceBright: "#393846", surfaceContainerLowest: "#0e0d19", surfaceContainerLow: "#1b1a27", surfaceContainer: "#201e2b", surfaceContainerHigh: "#2a2836", surfaceContainerHighest: "#353341", surfaceVariant: "#474556", onSurface: "#e8e3f5", onSurfaceVariant: "#c8c4d9", outline: "#928ea2", outlineVariant: "#424051", inverseSurface: "#e5e0f2", inverseOnSurface: "#312f3c", secondary: "#c1c1ff", onSecondary: "#282968", secondaryContainer: "#3f4080", onSecondaryContainer: "#e1dfff", secondaryFixed: "#e1dfff", secondaryFixedDim: "#c1c1ff", onSecondaryFixed: "#111152", onSecondaryFixedVariant: "#3f4080", tertiary: "#ffb77a", onTertiary: "#4c2700", tertiaryContainer: "#6d3a00", onTertiaryContainer: "#ffdcc2", tertiaryFixed: "#ffdcc2", tertiaryFixedDim: "#ffb77a", onTertiaryFixed: "#2e1500", onTertiaryFixedVariant: "#6d3a00" },
    },
    swatches: { light: ["#3e348b","#7678ee","#f6b902","#fdf9f2"], dark: ["#7678ee","#3e348b","#f18702","#130f2a"] },
  },
  {
    id: "rustic-charm",
    name: "Rustic Charm",
    description: "Charcoal and stone on warm off-white with a single flame-orange accent. A workshop look, in Barlow.",
    seed: "#3f3d39",
    variant: "fidelity",
    font: { sans: "\"Barlow\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&display=swap" },
    shape: "sharp",
    elevation: "flat",
    colors: {
      light: { surface: "#fefcf2", surfaceDim: "#dfd9d0", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fffbff", surfaceContainerHigh: "#eee7de", surfaceContainerHighest: "#e8e2d9", surfaceVariant: "#ebe2cf", onSurface: "#1e1b16", onSurfaceVariant: "#4c4639", outline: "#7d7667", outlineVariant: "#e2ddd3", inverseSurface: "#33302a", inverseOnSurface: "#f7f0e7", primary: "#3e3b35", onPrimary: "#ffffff", primaryContainer: "#e7e2d9", onPrimaryContainer: "#494740", primaryFixed: "#e7e2d9", primaryFixedDim: "#cbc6bd", onPrimaryFixed: "#1d1b16", onPrimaryFixedVariant: "#494740", surfaceTint: "#3e3b35", inversePrimary: "#cbc6bd", secondary: "#655e4c", onSecondary: "#ffffff", secondaryContainer: "#ece2ca", onSecondaryContainer: "#4d4635", secondaryFixed: "#ece2ca", secondaryFixedDim: "#d0c6af", onSecondaryFixed: "#201b0d", onSecondaryFixedVariant: "#4d4635", tertiary: "#be3f03", onTertiary: "#ffffff", tertiaryContainer: "#ffdbcf", onTertiaryContainer: "#822700", tertiaryFixed: "#ffdbcf", tertiaryFixedDim: "#ffb59c", onTertiaryFixed: "#390c00", onTertiaryFixedVariant: "#822700" },
      dark: { surface: "#252422", surfaceDim: "#252422", surfaceBright: "#4e4c47", surfaceContainerLowest: "#21201c", surfaceContainerLow: "#2e2c28", surfaceContainer: "#32312c", surfaceContainerHigh: "#3d3c37", surfaceContainerHighest: "#494742", surfaceVariant: "#49473d", onSurface: "#e9e5de", onSurfaceVariant: "#cbc6b9", outline: "#949185", outlineVariant: "#4e4c42", inverseSurface: "#e6e2db", inverseOnSurface: "#32302c", primary: "#ded3bd", onPrimary: "#363020", primaryContainer: "#4d4635", onPrimaryContainer: "#ece2ca", primaryFixed: "#ece2ca", primaryFixedDim: "#d0c6af", onPrimaryFixed: "#201b0d", onPrimaryFixedVariant: "#4d4635", surfaceTint: "#ded3bd", inversePrimary: "#655e4c", secondary: "#cec6b4", onSecondary: "#353024", secondaryContainer: "#4c4639", onSecondaryContainer: "#ebe2cf", secondaryFixed: "#ebe2cf", secondaryFixedDim: "#cec6b4", onSecondaryFixed: "#1f1b10", onSecondaryFixedVariant: "#4c4639", tertiary: "#ffb59c", onTertiary: "#5c1900", tertiaryContainer: "#822700", onTertiaryContainer: "#ffdbcf", tertiaryFixed: "#ffdbcf", tertiaryFixedDim: "#ffb59c", onTertiaryFixed: "#390c00", onTertiaryFixedVariant: "#822700" },
    },
    swatches: { light: ["#3f3d39","#ccc5b9","#eb5e27","#fefcf2"], dark: ["#ccc5b9","#3f3d39","#eb5e27","#252422"] },
  },
  {
    id: "color-blast",
    name: "Color Blast",
    description: "Cerulean with raspberry and marigold. Confident, saturated and a little loud, in Montserrat.",
    seed: "#016ba6",
    variant: "fidelity",
    font: { sans: "\"Montserrat\", system-ui, sans-serif", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" },
    shape: "standard",
    elevation: "standard",
    colors: {
      light: { surface: "#f8fbfe", surfaceDim: "#dadadd", surfaceBright: "#ffffff", surfaceContainerLowest: "#ffffff", surfaceContainerLow: "#ffffff", surfaceContainer: "#fcfcff", surfaceContainerHigh: "#e8e8eb", surfaceContainerHighest: "#e2e2e5", surfaceVariant: "#dee3eb", onSurface: "#1a1c1e", onSurfaceVariant: "#42474e", outline: "#72777f", outlineVariant: "#d0d5dd", inverseSurface: "#2f3033", inverseOnSurface: "#f0f0f4", secondary: "#7e5700", onSecondary: "#ffffff", secondaryContainer: "#ffdfa3", onSecondaryContainer: "#352200", secondaryFixed: "#ffdeac", secondaryFixedDim: "#f4bd62", onSecondaryFixed: "#281900", onSecondaryFixedVariant: "#604100", tertiary: "#bc004b", onTertiary: "#ffffff", tertiaryContainer: "#ffd9de", onTertiaryContainer: "#900037", tertiaryFixed: "#ffd9de", tertiaryFixedDim: "#ffb2bd", onTertiaryFixed: "#400014", onTertiaryFixedVariant: "#900037" },
      dark: { surface: "#0d141b", surfaceDim: "#0d141b", surfaceBright: "#333a42", surfaceContainerLowest: "#080f16", surfaceContainerLow: "#151c24", surfaceContainer: "#192028", surfaceContainerHigh: "#232b32", surfaceContainerHighest: "#2e353e", surfaceVariant: "#3e4852", onSurface: "#dfe6f0", onSurfaceVariant: "#bec7d4", outline: "#88929e", outlineVariant: "#3a434d", inverseSurface: "#dce3ee", inverseOnSurface: "#2a3139", secondary: "#f4bd62", onSecondary: "#432c00", secondaryContainer: "#604100", onSecondaryContainer: "#ffdeac", secondaryFixed: "#ffdeac", secondaryFixedDim: "#f4bd62", onSecondaryFixed: "#281900", onSecondaryFixedVariant: "#604100", tertiary: "#ffb2bd", onTertiary: "#670025", tertiaryContainer: "#900037", onTertiaryContainer: "#ffd9de", tertiaryFixed: "#ffd9de", tertiaryFixedDim: "#ffb2bd", onTertiaryFixed: "#400014", onTertiaryFixedVariant: "#900037" },
    },
    swatches: { light: ["#016ba6","#ffbc41","#d81259","#f8fbfe"], dark: ["#0096ff","#ffbc41","#d81259","#00121f"] },
  },
]
