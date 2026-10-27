"use client"

import * as React from "react"

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
  /** Update several settings at once (one recolor, one persisted write). */
  setTheme: (patch: Partial<ThemeState>) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const ROLES = [
  "primary", "onPrimary", "primaryContainer", "onPrimaryContainer", "primaryFixed", "primaryFixedDim", "onPrimaryFixed", "onPrimaryFixedVariant",
  "secondary", "onSecondary", "secondaryContainer", "onSecondaryContainer", "secondaryFixed", "secondaryFixedDim", "onSecondaryFixed", "onSecondaryFixedVariant",
  "tertiary", "onTertiary", "tertiaryContainer", "onTertiaryContainer", "tertiaryFixed", "tertiaryFixedDim", "onTertiaryFixed", "onTertiaryFixedVariant",
  "error", "onError", "errorContainer", "onErrorContainer",
  "surface", "surfaceDim", "surfaceBright", "surfaceContainerLowest", "surfaceContainerLow", "surfaceContainer", "surfaceContainerHigh", "surfaceContainerHighest", "surfaceVariant", "surfaceTint",
  "onSurface", "onSurfaceVariant", "outline", "outlineVariant", "inverseSurface", "inverseOnSurface", "inversePrimary", "scrim", "shadow",
] as const

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())

async function loadScheme(seed: string, variant: SchemeVariant, contrast: number) {
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
    return Object.fromEntries(ROLES.map((role) => [`--md-${kebab(role)}`, mcu.hexFromArgb(colors[role]().getArgb(scheme))]))
  }
}

/** `--md-*` custom properties for one mode, generated from a seed (M3 2025 color spec). */
export async function schemeColors(seed: string, variant: SchemeVariant = "tonalSpot", contrast = 0, dark = false) {
  return (await loadScheme(seed, variant, contrast))(dark)
}

/**
 * Light + dark `--md-*` declarations from a seed, ready for a <style> tag or a stylesheet.
 * `html:root` / `html.dark` outrank expressive.css regardless of stylesheet order.
 */
export async function schemeCss(seed: string, variant: SchemeVariant = "tonalSpot", contrast = 0) {
  const gen = await loadScheme(seed, variant, contrast)
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
   * Values that win over persisted ones on first load, e.g. a theme shared through URL params.
   * They're only written to storage once the user changes something.
   */
  initialTheme?: Partial<ThemeState>
  /** localStorage key for the theme (mode, seed, variant, contrast); pass null to disable persistence. */
  storageKey?: string | null
}

const BASELINE_SEED = "#6750A4"
const MODES: ThemeMode[] = ["light", "dark", "system"]
const VARIANTS: SchemeVariant[] = ["tonalSpot", "vibrant", "expressive", "fidelity", "content", "monochrome", "neutral", "rainbow", "fruitSalad"]

/** Read a persisted theme. Accepts the JSON format and the older mode-only string ("dark"). */
function readStoredTheme(key: string | null): Partial<ThemeState> {
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
    return out
  } catch {
    return {}
  }
}

function ThemeProvider({
  children,
  defaultMode = "system",
  defaultSeed = null,
  defaultVariant = "tonalSpot",
  defaultContrast = 0,
  initialTheme,
  storageKey = "expressive-theme",
}: ThemeProviderProps) {
  const [initial] = React.useState<ThemeState>(() => ({
    mode: defaultMode,
    seed: defaultSeed,
    variant: defaultVariant,
    contrast: defaultContrast,
    ...readStoredTheme(storageKey),
    ...initialTheme,
  }))
  const [theme, setThemeState] = React.useState<ThemeState>(initial)
  const { mode, seed, variant, contrast } = theme
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

  // Dynamic color. A non-default variant or contrast applies to the baseline seed too.
  const colored = React.useRef(false)
  React.useEffect(() => {
    const id = "expressive-dynamic-color"
    if (!seed && variant === "tonalSpot" && !contrast) {
      if (document.getElementById(id)) {
        document.getElementById(id)?.remove()
        fade()
      }
      return
    }
    let cancelled = false
    schemeCss(seed ?? BASELINE_SEED, variant, contrast).then(
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
  }, [seed, variant, contrast, fade])

  // Persist, but only after a real change, so values from `initialTheme` (URL) aren't saved on load.
  React.useEffect(() => {
    if (!storageKey || theme === initial) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(theme))
    } catch {
      // storage unavailable (private mode, blocked): the theme still applies for this session
    }
  }, [theme, initial, storageKey])

  const setTheme = React.useCallback((patch: Partial<ThemeState>) => setThemeState((t) => ({ ...t, ...patch })), [])
  const setMode = React.useCallback((next: ThemeMode) => setTheme({ mode: next }), [setTheme])
  const setSeed = React.useCallback((next: string | null) => setTheme({ seed: next }), [setTheme])
  const setVariant = React.useCallback((next: SchemeVariant) => setTheme({ variant: next }), [setTheme])
  const setContrast = React.useCallback((next: number) => setTheme({ contrast: next }), [setTheme])

  const value = React.useMemo(
    () => ({ mode, resolvedMode, setMode, seed, setSeed, variant, setVariant, contrast, setContrast, setTheme }),
    [mode, resolvedMode, setMode, seed, setSeed, variant, setVariant, contrast, setContrast, setTheme],
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
  /** Seed for this subtree. Defaults to the page's seed (or the baseline). */
  seed?: string | null
  variant?: SchemeVariant
  contrast?: number
}

/**
 * Re-themes a subtree: its own seed, scheme variant, contrast and light/dark mode, independent of the page.
 * Used for side-by-side light/dark previews and theme builders. Colors are applied as inline `--md-*`
 * properties, so every Expressive component inside follows them.
 */
function ThemeScope({ mode, seed, variant, contrast, className, style, children, ...props }: ThemeScopeProps) {
  const page = React.useContext(ThemeContext)
  const dark = (mode ?? page?.resolvedMode ?? "light") === "dark"
  const s = seed ?? page?.seed ?? BASELINE_SEED
  const v = variant ?? page?.variant ?? "tonalSpot"
  const c = contrast ?? page?.contrast ?? 0
  const [vars, setVars] = React.useState<Record<string, string> | null>(null)

  React.useEffect(() => {
    let cancelled = false
    schemeColors(s, v, c, dark).then((next) => !cancelled && setVars(next), () => {})
    return () => {
      cancelled = true
    }
  }, [s, v, c, dark])

  return (
    <div
      data-slot="theme-scope"
      data-mode={dark ? "dark" : "light"}
      className={[dark ? "dark" : "", "bg-surface text-on-surface", className].filter(Boolean).join(" ")}
      style={{ colorScheme: dark ? "dark" : "light", ...(vars as React.CSSProperties | null), ...style }}
      {...props}
    >
      {children}
    </div>
  )
}

export { ThemeProvider, ThemeScope, useTheme }
