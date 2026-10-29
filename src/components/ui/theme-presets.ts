/*
 * Theme presets · a complete look in one object: seed + scheme variant + contrast for color, plus hand-tuned
 * surface roles, a typeface, a shape scale and an elevation style. ThemeProvider (`defaultPreset`,
 * `setPreset`) and ThemeScope (`preset`) apply them; `presetCss()` renders one for SSR or a static file.
 *
 * Every shipped preset passes WCAG AA (4.5:1) on its text pairs in light and dark (tests/theme-presets.test.mjs).
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
]
