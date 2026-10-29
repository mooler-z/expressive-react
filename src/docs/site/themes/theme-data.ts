import * as React from "react"

import { schemeColors, useTheme, type SchemeVariant } from "@/components/ui/theme-provider"
import { presetStyleTokens, presetTokens, type ThemePreset } from "@/components/ui/theme-presets"
import { SITE_SEEDS, SITE_VARIANTS, useSiteSeed } from "@/docs/site/theme-menu"

/** Seeds offered by the builder: the site's shared list (design-reference/site/m3/site.js SEEDS). */
export const SEEDS = SITE_SEEDS

export const BASELINE_SEED = "#6750A4"

/** One-line description of each scheme variant (design-reference/site/Themes.dc.html). */
const VARIANT_HINTS: Record<SchemeVariant, string> = {
  tonalSpot: "The M3 default: calm chroma, neutral surfaces tinted by the seed.",
  vibrant: "Pushes chroma on primary and surfaces; secondary and tertiary rotate hue for contrast.",
  expressive: "Hue-shifted secondary and tertiary for playful, unexpected pairings.",
  fidelity: "Keeps the seed exactly as primary-container; good for brand colors.",
  content: "Like fidelity, with tertiary derived from a complementary hue.",
  neutral: "Near-grayscale with a whisper of the seed.",
  monochrome: "Pure grayscale. Shape and type do the talking.",
  rainbow: "Saturated primary with neutral, untinted surfaces.",
  fruitSalad: "Primary and secondary shift hue in opposite directions.",
}

export const VARIANTS = SITE_VARIANTS.map(([id, label]) => ({ id, label, hint: VARIANT_HINTS[id] }))

export const CONTRASTS: [value: number, label: string][] = [
  [0, "Standard"],
  [0.5, "Medium"],
  [1, "High"],
]

export type Scheme = Record<string, string>

export interface BuilderTheme {
  /** Effective seed (the baseline when the provider has none). */
  seed: string
  variant: SchemeVariant
  contrast: number
  /** The site's active preset (its type, shape and elevation apply; its tuned colors only while seed/variant/contrast match). */
  preset: ThemePreset | null
  /** True when this is exactly the shipped baseline (the provider uses expressive.css as-is). */
  isBaseline: boolean
}

const normalize = (hex: string) => hex.toUpperCase()

/**
 * The builder's view of the shared theme. The provider stores `seed: null` for the baseline seed (so
 * baseline + tonal spot + standard contrast uses the shipped expressive.css tokens untouched); every
 * change goes through `setTheme`, so a multi-value change recolors once.
 */
export function useBuilderTheme() {
  const t = useTheme()
  const seed = useSiteSeed()
  const theme: BuilderTheme = {
    seed,
    variant: t.variant,
    contrast: t.contrast,
    preset: t.preset,
    isBaseline: !t.preset && seed === BASELINE_SEED && t.variant === "tonalSpot" && t.contrast === 0,
  }

  const { setTheme } = t
  const apply = React.useCallback(
    (patch: Partial<Pick<BuilderTheme, "seed" | "variant" | "contrast">>) => {
      const next: Parameters<typeof setTheme>[0] = { ...patch }
      if (patch.seed !== undefined) next.seed = normalize(patch.seed) === BASELINE_SEED ? null : normalize(patch.seed)
      setTheme(next)
    },
    [setTheme],
  )

  const reset = React.useCallback(() => setTheme({ preset: null, seed: null, variant: "tonalSpot", contrast: 0 }), [setTheme])

  return { theme, apply, reset, mode: t.mode, setMode: t.setMode, resolvedMode: t.resolvedMode }
}

/** Light and dark `--md-*` color maps for a theme (with the preset's tuned roles when it applies), regenerated whenever it changes. */
export function useSchemes(seed: string, variant: SchemeVariant, contrast: number, preset: ThemePreset | null = null) {
  const [schemes, setSchemes] = React.useState<{ light: Scheme; dark: Scheme } | null>(null)
  React.useEffect(() => {
    let cancelled = false
    const colorsOnly = (vars: Scheme) => Object.fromEntries(Object.entries(vars).filter(([k]) => k.startsWith("--md-") && !k.startsWith("--md-elevation")))
    const one = (dark: boolean) =>
      preset ? presetTokens(preset, dark, { seed, variant, contrast }).then(colorsOnly) : schemeColors(seed, variant, contrast, dark)
    Promise.all([one(false), one(true)]).then(
      ([light, dark]) => !cancelled && setSchemes({ light, dark }),
      () => {},
    )
    return () => {
      cancelled = true
    }
  }, [seed, variant, contrast, preset])
  return schemes
}

/** Primary / secondary / tertiary of every scheme variant for one seed and mode (the variant cards' dots). */
export function useVariantDots(seed: string, contrast: number, dark: boolean) {
  const [dots, setDots] = React.useState<Partial<Record<SchemeVariant, [string, string, string]>>>({})
  React.useEffect(() => {
    let cancelled = false
    Promise.all(VARIANTS.map((v) => schemeColors(seed, v.id, contrast, dark))).then(
      (all) => {
        if (cancelled) return
        setDots(
          Object.fromEntries(
            all.map((s, i) => [VARIANTS[i].id, [s["--md-primary"], s["--md-secondary"], s["--md-tertiary"]]]),
          ) as Partial<Record<SchemeVariant, [string, string, string]>>,
        )
      },
      () => {},
    )
    return () => {
      cancelled = true
    }
  }, [seed, contrast, dark])
  return dots
}

/** The color-role blocks to paste after `@import "./styles/expressive.css"`. */
export function themeCss(theme: BuilderTheme, schemes: { light: Scheme; dark: Scheme }) {
  const block = (selector: string, scheme: "light" | "dark") =>
    [
      `${selector} {`,
      `  color-scheme: ${scheme};`,
      ...Object.entries(schemes[scheme]).map(([k, v]) => `  ${k}: ${v.toLowerCase()};`),
      "}",
    ].join("\n")
  const style = theme.preset
    ? [
        "",
        `/* ${theme.preset.name} preset: type, shape and elevation${theme.preset.font?.href ? ` · fonts: ${theme.preset.font.href}` : ""} */`,
        ":root {",
        ...Object.entries(presetStyleTokens(theme.preset)).map(([k, v]) => `  ${k}: ${v};`),
        "}",
      ]
    : []
  return [
    `/* Expressive React theme · ${theme.preset ? `${theme.preset.name} preset · ` : ""}seed ${theme.seed} · ${theme.variant} · contrast ${theme.contrast} */`,
    `/* Paste after @import "./styles/expressive.css"; it overrides the baseline color roles. */`,
    "",
    block(":root", "light"),
    "",
    block(".dark", "dark"),
    ...style,
    "",
  ].join("\n")
}

/** Runtime alternative: let ThemeProvider generate the same scheme in the browser. */
export function providerSnippet(theme: BuilderTheme) {
  if (theme.isBaseline) return "<ThemeProvider>\n  <App />\n</ThemeProvider>\n"
  const p = theme.preset
  if (p && theme.seed === p.seed.toUpperCase() && theme.variant === p.variant && theme.contrast === (p.contrast ?? 0))
    return `<ThemeProvider defaultPreset="${p.id}">\n  <App />\n</ThemeProvider>\n`
  const props = p ? [`defaultPreset="${p.id}"`] : []
  props.push(`defaultSeed="${theme.seed}"`)
  if (theme.variant !== "tonalSpot") props.push(`defaultVariant="${theme.variant}"`)
  if (theme.contrast) props.push(`defaultContrast={${theme.contrast}}`)
  return `<ThemeProvider ${props.join(" ")}>\n  <App />\n</ThemeProvider>\n`
}

/** Shareable link: the site applies seed/variant/contrast from the URL. */
export function shareUrl(theme: BuilderTheme) {
  const q = new URLSearchParams({ seed: theme.seed.replace("#", "") })
  if (theme.preset) q.set("preset", theme.preset.id)
  // With a preset, unset values would fall back to the preset's own, so spell them out
  if (theme.preset || theme.variant !== "tonalSpot") q.set("variant", theme.variant)
  if (theme.preset || theme.contrast) q.set("contrast", String(theme.contrast))
  return `${window.location.origin}/themes?${q}`
}

/** Readable foreground for a role tile: its "on" pair where one exists, else the best of on-surface / surface. */
export function roleForeground(role: string, scheme: Scheme) {
  const get = (r: string) => scheme[`--md-${r}`]
  const pairs: Record<string, string> = {
    "surface-tint": "on-primary",
    "inverse-surface": "inverse-on-surface",
    "inverse-on-surface": "inverse-surface",
    "inverse-primary": "inverse-surface",
    "surface-variant": "on-surface-variant",
  }
  let fg: string | undefined
  if (pairs[role]) fg = get(pairs[role])
  else if (role.endsWith("-fixed-dim")) fg = get(`on-${role.replace(/-dim$/, "")}`)
  else if (role.startsWith("on-") && role.endsWith("-fixed-variant")) fg = get(role.replace(/^on-/, "").replace(/-variant$/, ""))
  else if (get(`on-${role}`)) fg = get(`on-${role}`)
  else if (role.startsWith("on-")) fg = get(role.slice(3))
  if (fg) return fg
  // No pair (surface-dim/bright, surface-container-*…): whichever of on-surface / surface reads better on it.
  const bg = luminance(get(role))
  const ratio = (c: string) => {
    const l = luminance(c)
    return (Math.max(l, bg) + 0.05) / (Math.min(l, bg) + 0.05)
  }
  return ratio(get("on-surface")) >= ratio(get("surface")) ? get("on-surface") : get("surface")
}

function luminance(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

export async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
