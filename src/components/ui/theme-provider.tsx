"use client"

import * as React from "react"

import {
  THEME_PRESETS,
  createSchemeGenerator,
  getThemePreset,
  loadPresetFonts,
  presetCss,
  presetStyleTokens,
  presetTokens,
  type ThemePreset,
} from "@/components/ui/theme-presets"

export type ThemeMode = "light" | "dark" | "system"
export type SchemeVariant =
  | "tonalSpot"
  | "vibrant"
  | "expressive"
  | "fidelity"
  | "content"
  | "monochrome"
  | "neutral"
  | "rainbow"
  | "fruitSalad"

/** Everything the provider persists. `seed: null` means the baseline tokens in expressive.css. */
export interface ThemeState {
  mode: ThemeMode
  seed: string | null
  variant: SchemeVariant
  contrast: number
  /**
   * Active preset id, or null. Setting it (without a seed) also takes the preset's seed, variant and contrast;
   * setting it to null restores the provider's defaults.
   */
  preset?: string | null
}

interface ThemeContextValue {
  mode: ThemeMode
  resolvedMode: "light" | "dark"
  setMode: (mode: ThemeMode) => void
  /** Seed hex for dynamic color, or null for the baseline tokens in expressive.css. */
  seed: string | null
  setSeed: (seed: string | null) => void
  variant: SchemeVariant
  setVariant: (variant: SchemeVariant) => void
  /** -1 (reduced) … 0 (standard) … 1 (high). */
  contrast: number
  setContrast: (contrast: number) => void
  /** The active preset, or null. */
  preset: ThemePreset | null
  /** Apply a preset by id (its seed, variant, contrast, type, shape and elevation), or null to go back to the defaults. */
  setPreset: (id: string | null) => void
  /** The presets this provider knows (its `presets` prop). */
  presets: readonly ThemePreset[]
  /** Update several settings at once (one recolor, one persisted write). */
  setTheme: (patch: Partial<ThemeState>) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

/** `--md-*` custom properties for one mode, generated from a seed (M3 2025 color spec). */
export async function schemeColors(seed: string, variant: SchemeVariant = "tonalSpot", contrast = 0, dark = false) {
  return (await createSchemeGenerator(seed, variant, contrast))(dark)
}

/**
 * Light + dark `--md-*` declarations from a seed, ready for a <style> tag or a stylesheet.
 * `html:root` / `html.dark` outrank expressive.css regardless of stylesheet order.
 */
export async function schemeCss(seed: string, variant: SchemeVariant = "tonalSpot", contrast = 0) {
  const gen = await createSchemeGenerator(seed, variant, contrast)
  const block = (dark: boolean) => Object.entries(gen(dark)).map(([k, v]) => `${k}:${v};`).join("")
  return `html:root{${block(false)}}html.dark{${block(true)}}`
}

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultMode?: ThemeMode
  /** Seed hex for dynamic color. Omit to use the baseline tokens. */
  defaultSeed?: string | null
  defaultVariant?: SchemeVariant
  defaultContrast?: number
  /**
   * Preset id to start with (see THEME_PRESETS). It brings its own seed, variant and contrast; passing any of the
   * three props above as well overrides that value (the preset's type, shape and elevation stay, its tuned colors don't).
   */
  defaultPreset?: string | null
  /** Presets that `setPreset` and persisted ids resolve against. Defaults to THEME_PRESETS; pass a stable array. */
  presets?: readonly ThemePreset[]
  /**
   * Values that win over persisted ones on first load, e.g. a theme shared through URL params.
   * They're only written to storage once the user changes something.
   */
  initialTheme?: Partial<ThemeState>
  /** localStorage key for the theme (mode, seed, variant, contrast, preset); pass null to disable persistence. */
  storageKey?: string | null
}

const BASELINE_SEED = "#6750A4"
const MODES: ThemeMode[] = ["light", "dark", "system"]
const VARIANTS: SchemeVariant[] = ["tonalSpot", "vibrant", "expressive", "fidelity", "content", "monochrome", "neutral", "rainbow", "fruitSalad"]

/** Read a persisted theme. Accepts the JSON format and the older mode-only string ("dark"). */
function readStoredTheme(key: string | null, presets: readonly ThemePreset[]): Partial<ThemeState> {
  if (!key || typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return {}
    if (MODES.includes(raw as ThemeMode)) return { mode: raw as ThemeMode }
    const v = JSON.parse(raw) as Partial<Record<keyof ThemeState, unknown>>
    const out: Partial<ThemeState> = {}
    if (MODES.includes(v.mode as ThemeMode)) out.mode = v.mode as ThemeMode
    if (v.seed === null || (typeof v.seed === "string" && /^#[0-9a-f]{6}$/i.test(v.seed))) out.seed = v.seed as string | null
    if (VARIANTS.includes(v.variant as SchemeVariant)) out.variant = v.variant as SchemeVariant
    if (typeof v.contrast === "number" && v.contrast >= -1 && v.contrast <= 1) out.contrast = v.contrast
    if (v.preset === null || (typeof v.preset === "string" && getThemePreset(v.preset, presets))) out.preset = v.preset as string | null
    return out
  } catch {
    return {}
  }
}

function ThemeProvider({
  children,
  defaultMode = "system",
  defaultSeed,
  defaultVariant,
  defaultContrast,
  defaultPreset = null,
  presets = THEME_PRESETS,
  initialTheme,
  storageKey = "expressive-theme",
}: ThemeProviderProps) {
  /**
   * A patch that names a preset but no colors takes the preset's seed, variant and contrast; `preset: null`
   * takes the provider defaults. Unknown preset ids are dropped.
   */
  const expand = React.useCallback(
    (patch: Partial<ThemeState>): Partial<ThemeState> => {
      if (patch.preset === undefined) return patch
      const p = patch.preset ? getThemePreset(patch.preset, presets) : null
      if (patch.preset && !p) {
        const rest = { ...patch }
        delete rest.preset
        return rest
      }
      const colors = p
        ? { seed: p.seed, variant: p.variant, contrast: p.contrast ?? 0 }
        : { seed: defaultSeed ?? null, variant: defaultVariant ?? "tonalSpot", contrast: defaultContrast ?? 0 }
      return { ...colors, ...patch, preset: p?.id ?? null }
    },
    [presets, defaultSeed, defaultVariant, defaultContrast],
  )

  const [initial] = React.useState<ThemeState>(() => ({
    mode: defaultMode,
    seed: defaultSeed ?? null,
    variant: defaultVariant ?? "tonalSpot",
    contrast: defaultContrast ?? 0,
    preset: null,
    // Explicit default color props win over the default preset's own
    ...expand({
      preset: defaultPreset,
      ...(defaultSeed !== undefined && { seed: defaultSeed }),
      ...(defaultVariant !== undefined && { variant: defaultVariant }),
      ...(defaultContrast !== undefined && { contrast: defaultContrast }),
    }),
    ...expand(readStoredTheme(storageKey, presets)),
    ...expand(initialTheme ?? {}),
  }))
  const [theme, setThemeState] = React.useState<ThemeState>(initial)
  const { mode, seed, variant, contrast } = theme
  const preset = React.useMemo(() => getThemePreset(theme.preset, presets) ?? null, [theme.preset, presets])
  const [systemDark, setSystemDark] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches,
  )

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => setSystemDark(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const resolvedMode = mode === "system" ? (systemDark ? "dark" : "light") : mode

  // Cross-fade every surface for 400ms whenever colors change after first paint.
  const fadeTimer = React.useRef<number | undefined>(undefined)
  const fade = React.useCallback(() => {
    const root = document.documentElement
    root.classList.add("theme-switching")
    clearTimeout(fadeTimer.current)
    fadeTimer.current = window.setTimeout(() => root.classList.remove("theme-switching"), 400)
  }, [])

  // Apply .dark
  const first = React.useRef(true)
  React.useEffect(() => {
    if (!first.current) fade()
    first.current = false
    document.documentElement.classList.toggle("dark", resolvedMode === "dark")
  }, [resolvedMode, fade])

  // Dynamic color (and the preset's type, shape and elevation). A non-default variant or contrast applies to the baseline seed too.
  const colored = React.useRef(false)
  React.useEffect(() => {
    const id = "expressive-dynamic-color"
    if (!preset && !seed && variant === "tonalSpot" && !contrast) {
      if (document.getElementById(id)) {
        document.getElementById(id)?.remove()
        fade()
      }
      return
    }
    let cancelled = false
    // Fonts load only while a preset that needs them is active.
    loadPresetFonts(preset)
    const css = preset
      ? presetCss(preset, { seed: seed ?? BASELINE_SEED, variant, contrast, fonts: false })
      : schemeCss(seed ?? BASELINE_SEED, variant, contrast)
    css.then(
      (css) => {
        if (cancelled) return
        let el = document.getElementById(id) as HTMLStyleElement | null
        if (!el) {
          el = document.createElement("style")
          el.id = id
          document.head.appendChild(el)
        }
        if (colored.current) fade()
        colored.current = true
        el.textContent = css
      },
      (err) => console.warn("[expressive] dynamic color unavailable, keeping baseline tokens", err),
    )
    return () => {
      cancelled = true
    }
  }, [preset, seed, variant, contrast, fade])

  // Persist, but only after a real change, so values from `initialTheme` (URL) aren't saved on load.
  React.useEffect(() => {
    if (!storageKey || theme === initial) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(theme))
    } catch {
      // storage unavailable (private mode, blocked): the theme still applies for this session
    }
  }, [theme, initial, storageKey])

  const setTheme = React.useCallback((patch: Partial<ThemeState>) => setThemeState((t) => ({ ...t, ...expand(patch) })), [expand])
  const setMode = React.useCallback((next: ThemeMode) => setTheme({ mode: next }), [setTheme])
  const setSeed = React.useCallback((next: string | null) => setTheme({ seed: next }), [setTheme])
  const setVariant = React.useCallback((next: SchemeVariant) => setTheme({ variant: next }), [setTheme])
  const setContrast = React.useCallback((next: number) => setTheme({ contrast: next }), [setTheme])
  const setPreset = React.useCallback((next: string | null) => setTheme({ preset: next }), [setTheme])

  const value = React.useMemo(
    () => ({ mode, resolvedMode, setMode, seed, setSeed, variant, setVariant, contrast, setContrast, preset, setPreset, presets, setTheme }),
    [mode, resolvedMode, setMode, seed, setSeed, variant, setVariant, contrast, setContrast, preset, setPreset, presets, setTheme],
  ) satisfies ThemeContextValue

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>")
  return ctx
}

export interface ThemeScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Force light or dark for this subtree. Defaults to the page's resolved mode. */
  mode?: "light" | "dark"
  /** Seed for this subtree. Defaults to the preset's seed, else the page's seed (or the baseline). */
  seed?: string | null
  variant?: SchemeVariant
  contrast?: number
  /**
   * Preset for this subtree: an id, a preset object, or null for none. Defaults to the page's preset.
   * Its seed, variant and contrast become the defaults for the three props above.
   */
  preset?: string | ThemePreset | null
}

/**
 * Re-themes a subtree: its own preset, seed, scheme variant, contrast and light/dark mode, independent of the page.
 * Used for side-by-side light/dark previews, preset galleries and theme builders. Everything is applied as inline
 * custom properties (`--md-*`, `--radius-*`, `--font-*`), so every Expressive component inside follows them.
 */
function ThemeScope({ mode, seed, variant, contrast, preset, className, style, children, ...props }: ThemeScopeProps) {
  const page = React.useContext(ThemeContext)
  const dark = (mode ?? page?.resolvedMode ?? "light") === "dark"
  const own = preset !== undefined
  const resolved =
    preset === undefined
      ? (page?.preset ?? null)
      : typeof preset === "string"
        ? (getThemePreset(preset, page?.presets) ?? null)
        : preset
  // Inline preset objects are compared by value so a re-render doesn't regenerate the scheme.
  const presetKey = resolved ? JSON.stringify(resolved) : ""
  const p = React.useMemo(() => (presetKey ? (JSON.parse(presetKey) as ThemePreset) : null), [presetKey])
  const s = seed ?? (own && p ? p.seed : page?.seed) ?? BASELINE_SEED
  const v = variant ?? (own && p ? p.variant : page?.variant) ?? "tonalSpot"
  const c = contrast ?? (own && p ? (p.contrast ?? 0) : page?.contrast) ?? 0
  // A scope without a preset inside a preset-themed page resets type, shape and elevation to the defaults.
  const styled = !!p || !!page?.preset
  const styleTokens = React.useMemo(() => (styled ? presetStyleTokens(p) : null), [styled, p])
  const [vars, setVars] = React.useState<Record<string, string> | null>(null)

  React.useEffect(() => {
    let cancelled = false
    loadPresetFonts(p)
    const next = p ? presetTokens(p, dark, { seed: s, variant: v, contrast: c }) : schemeColors(s, v, c, dark)
    next.then((next) => !cancelled && setVars(next), () => {})
    return () => {
      cancelled = true
    }
  }, [p, s, v, c, dark])

  return (
    <div
      data-slot="theme-scope"
      data-mode={dark ? "dark" : "light"}
      data-preset={p?.id}
      className={[dark ? "dark" : "", "bg-surface text-on-surface", className].filter(Boolean).join(" ")}
      style={{
        colorScheme: dark ? "dark" : "light",
        ...(styleTokens as React.CSSProperties | null),
        ...(vars as React.CSSProperties | null),
        ...(styled ? { fontFamily: "var(--font-sans)" } : null),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export { ThemeProvider, ThemeScope, useTheme }
