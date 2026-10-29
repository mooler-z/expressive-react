import Demo from "@/docs/docs-site/examples/theme-provider/demo"
import demoSrc from "@/docs/docs-site/examples/theme-provider/demo?raw"
import Mode from "@/docs/docs-site/examples/theme-provider/mode"
import modeSrc from "@/docs/docs-site/examples/theme-provider/mode?raw"
import SchemeCss from "@/docs/docs-site/examples/theme-provider/scheme-css"
import schemeCssSrc from "@/docs/docs-site/examples/theme-provider/scheme-css?raw"
import Variants from "@/docs/docs-site/examples/theme-provider/variants"
import variantsSrc from "@/docs/docs-site/examples/theme-provider/variants?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const variantType = '"tonalSpot" | "vibrant" | "expressive" | "fidelity" | "content" | "monochrome" | "neutral" | "rainbow" | "fruitSalad"'

export default {
  description:
    "Light, dark and system mode plus dynamic color for the whole app, generated from one seed with Google's M3 2025 color spec. ThemeScope re-themes a single subtree, for previews and side-by-side comparisons.",
  links: { m3: "https://m3.material.io/styles/color/dynamic/choosing-a-source" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { ThemeProvider } from "@/components/ui/theme-provider"

<ThemeProvider defaultMode="system" defaultSeed="#0B57D0" defaultVariant="expressive">
  <App />
</ThemeProvider>`,
  examples: [
    {
      id: "mode",
      title: "Mode",
      description: (
        <>
          <InlineCode>useTheme()</InlineCode> reads and sets the app's mode. System follows the OS and updates live; <InlineCode>resolvedMode</InlineCode> is what's
          showing. This example changes this whole site.
        </>
      ),
      component: Mode,
      source: modeSrc,
    },
    {
      id: "variants",
      title: "Scheme variants",
      description: "One seed, nine ways to spread it across the roles. Tonal spot is the M3 default; vibrant and expressive push chroma; neutral and monochrome pull it back.",
      component: Variants,
      source: variantsSrc,
    },
    {
      id: "scheme-css",
      title: "Generate colors",
      description: (
        <>
          <InlineCode>schemeColors()</InlineCode> returns the <InlineCode>--md-*</InlineCode> values for one mode; <InlineCode>schemeCss()</InlineCode> returns both
          modes as CSS. Use them to precompute a theme at build time or for an email. The <TextLink to="/themes">Theme builder</TextLink> does this interactively.
        </>
      ),
      component: SchemeCss,
      source: schemeCssSrc,
    },
  ],
  api: [
    {
      name: "ThemeProvider",
      description: "Mount once around the app. Applies .dark to <html> and writes the generated scheme into a <style> tag.",
      props: [
        { name: "defaultMode", type: '"light" | "dark" | "system"', default: '"system"', description: "Initial mode." },
        { name: "defaultSeed", type: "string | null", default: "null", description: "Seed hex for dynamic color. null keeps the baseline tokens from expressive.css." },
        { name: "defaultVariant", type: variantType, default: '"tonalSpot"', description: "How the seed spreads across roles." },
        { name: "defaultContrast", type: "number", default: "0", description: "-1 (reduced) to 1 (high). 0.5 is medium." },
        { name: "defaultPreset", type: "string | null", default: "null", description: <>Start from a <TextLink to="/docs/theme-presets">theme preset</TextLink>: color, surfaces, type, shape and elevation.</> },
        { name: "presets", type: "readonly ThemePreset[]", default: "THEME_PRESETS", description: "Presets that ids resolve against." },
        { name: "initialTheme", type: "Partial<ThemeState>", default: "—", description: "Overrides stored values on load (e.g. from URL params) without saving them." },
        { name: "storageKey", type: "string | null", default: '"expressive-theme"', description: "localStorage key for {mode, seed, variant, contrast, preset}. null disables persistence." },
      ],
    },
    {
      name: "useTheme()",
      description: "Read and change the theme from anywhere inside the provider.",
      props: [
        { name: "mode · setMode", type: '"light" | "dark" | "system"', default: "—", description: "Chosen mode." },
        { name: "resolvedMode", type: '"light" | "dark"', default: "—", description: "What's actually showing (system resolved)." },
        { name: "seed · setSeed", type: "string | null", default: "—", description: "Current seed." },
        { name: "variant · setVariant", type: "SchemeVariant", default: "—", description: "Current scheme variant." },
        { name: "contrast · setContrast", type: "number", default: "—", description: "Current contrast level." },
        { name: "preset · setPreset", type: "ThemePreset | null", default: "—", description: "Active preset; setPreset(id) applies one, setPreset(null) returns to the defaults." },
        { name: "presets", type: "readonly ThemePreset[]", default: "—", description: "The provider's preset list, for pickers." },
        { name: "setTheme", type: "(patch: Partial<ThemeState>) => void", default: "—", description: "Change several values in one update (one recolor)." },
      ],
    },
    {
      name: "ThemeScope",
      description: <>A {c("div")} that re-themes its subtree with inline {c("--md-*")} properties. Unset props inherit the page's theme.</>,
      props: [
        { name: "mode", type: '"light" | "dark"', default: "page mode", description: "Force light or dark inside." },
        { name: "seed", type: "string | null", default: "page seed", description: "Seed for this subtree." },
        { name: "variant", type: "SchemeVariant", default: "page variant", description: "Scheme variant for this subtree." },
        { name: "contrast", type: "number", default: "page contrast", description: "Contrast for this subtree." },
        { name: "preset", type: "string | ThemePreset | null", default: "page preset", description: "Preset for this subtree; null drops the page's." },
      ],
    },
    {
      name: "schemeColors() · schemeCss()",
      description: "Async helpers; @material/material-color-utilities loads on first use.",
      props: [
        { name: "schemeColors", type: "(seed, variant?, contrast?, dark?) => Promise<Record<string, string>>", default: "—", description: "--md-* values for one mode." },
        { name: "schemeCss", type: "(seed, variant?, contrast?) => Promise<string>", default: "—", description: "html:root{…} html.dark{…} blocks for both modes." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Generated schemes are built to M3's contrast targets for every on-color pair, and {c("contrast")} raises them further for people who need it. Mode changes
        also set {c("color-scheme")}, so native scrollbars and form controls follow.
      </>
    ),
    notes: [
      "Respect the OS: default to system mode, and offer the choice rather than forcing one.",
      "Mode and color changes crossfade surface colors over 400ms; nothing moves.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Contrast", "Value", "Use"],
        rows: [
          ["Reduced", "-1", "Softest pairs"],
          ["Standard", "0", "M3 default"],
          ["Medium", "0.5", "Stronger separation"],
          ["High", "1", "Maximum contrast"],
        ],
      },
    ],
    cards: [
      { title: "Generation", items: ["Material color utilities 0.4", "Color spec 2025", "47 color roles per mode"] },
      { title: "Output", items: ["--md-* custom properties", "html:root and html.dark selectors", "Persisted mode, seed, variant, contrast, preset"] },
    ],
    source: "@material/material-color-utilities (DynamicScheme, MaterialDynamicColors, spec version 2025).",
  },
} satisfies ComponentDoc
