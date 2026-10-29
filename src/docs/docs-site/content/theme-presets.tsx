import Apply from "@/docs/docs-site/examples/theme-presets/apply"
import applySrc from "@/docs/docs-site/examples/theme-presets/apply?raw"
import Custom from "@/docs/docs-site/examples/theme-presets/custom"
import customSrc from "@/docs/docs-site/examples/theme-presets/custom?raw"
import Demo from "@/docs/docs-site/examples/theme-presets/demo"
import demoSrc from "@/docs/docs-site/examples/theme-presets/demo?raw"
import PresetCss from "@/docs/docs-site/examples/theme-presets/preset-css"
import presetCssSrc from "@/docs/docs-site/examples/theme-presets/preset-css?raw"
import { THEME_PRESETS } from "@/components/ui/theme-presets"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const variantType = "SchemeVariant"

export default {
  description: (
    <>
      Twenty complete looks for the whole app. A preset is more than a seed: it carries hand-tuned canvas, card and hairline tones for light and dark, a
      typeface, a corner scale and an elevation style. Every shipped preset passes WCAG AA in both modes. Browse them in the{" "}
      <TextLink to="/themes/presets">preset gallery</TextLink>.
    </>
  ),
  preview: { component: Demo, source: demoSrc },
  usage: `import { ThemeProvider } from "@/components/ui/theme-provider"

<ThemeProvider defaultPreset="campus">
  <App />
</ThemeProvider>`,
  examples: [
    {
      id: "apply",
      title: "Switch the app's preset",
      description: (
        <>
          <InlineCode>useTheme()</InlineCode> exposes <InlineCode>presets</InlineCode>, the active <InlineCode>preset</InlineCode> and{" "}
          <InlineCode>setPreset(id | null)</InlineCode>. The choice persists with the other theme settings, and the preset's font stylesheet loads only once it's
          active. This example changes this whole site.
        </>
      ),
      component: Apply,
      source: applySrc,
    },
    {
      id: "custom",
      title: "Your own preset",
      description: (
        <>
          A preset is a plain object. Pass it to <InlineCode>ThemeScope</InlineCode> directly, or list it in <InlineCode>ThemeProvider</InlineCode>'s{" "}
          <InlineCode>presets</InlineCode> prop so <InlineCode>setPreset</InlineCode> and persistence can find it by id.
        </>
      ),
      component: Custom,
      source: customSrc,
    },
    {
      id: "preset-css",
      title: "CSS for SSR or a static file",
      description: (
        <>
          <InlineCode>presetCss()</InlineCode> renders a preset as <InlineCode>html:root</InlineCode> and <InlineCode>html.dark</InlineCode> blocks, starting with an{" "}
          <InlineCode>@import</InlineCode> of its fonts. The module has no <InlineCode>"use client"</InlineCode>, so it runs in server components and build
          scripts: inline the result in your document head to avoid a flash of the default theme.
        </>
      ),
      component: PresetCss,
      source: presetCssSrc,
    },
  ],
  api: [
    {
      name: "ThemePreset",
      description: "The shape of a preset. Everything but the identity and color fields is optional.",
      props: [
        { name: "id · name · description", type: "string", default: "—", description: "Stable id (persisted), display name and one-line character for pickers." },
        { name: "seed · variant · contrast", type: `string · ${variantType} · number`, default: "contrast 0", description: "Generates the full M3 scheme, as for ThemeProvider." },
        {
          name: "colors",
          type: "{ light?: ColorOverrides; dark?: ColorOverrides }",
          default: "—",
          description: (
            <>
              Hex values for any of the 47 roles, on top of the generated scheme: canvas ({c("surface")}), cards ({c("surfaceContainer*")}), hairlines (
              {c("outlineVariant")}), accents. Applied only while seed, variant and contrast are the preset's own.
            </>
          ),
        },
        { name: "font", type: "{ sans: string; mono?: string; href?: string }", default: "Roboto Flex", description: <>Font stacks for {c("--font-sans")} and {c("--font-mono")}, and the stylesheet that loads them.</> },
        { name: "shape", type: '"standard" | "sharp" | "subtle" | "rounded" | Partial<Record<RadiusToken, string>>', default: '"standard"', description: <>Radius scale behind {c("rounded-xs … rounded-2xl")}. Buttons, chips and FABs keep their M3 pill shapes.</> },
        { name: "elevation", type: '"standard" | "soft" | "crisp" | "flat" | [5 box-shadows]', default: '"standard"', description: <>Values behind {c("shadow-1 … shadow-5")}. Crisp and flat draw hairlines in the element's text color.</> },
        { name: "swatches", type: "{ light: string[]; dark: string[] }", default: "—", description: "Picker colors: primary, secondary container, tertiary, surface." },
      ],
    },
    {
      name: "ThemeProvider · useTheme()",
      description: "Preset support in the provider; everything else is unchanged.",
      props: [
        { name: "defaultPreset", type: "string | null", default: "null", description: "Preset id to start with. Explicit defaultSeed / defaultVariant / defaultContrast override its colors." },
        { name: "presets", type: "readonly ThemePreset[]", default: "THEME_PRESETS", description: "What ids resolve against. Pass a stable array (module scope or useMemo)." },
        { name: "preset · setPreset", type: "ThemePreset | null · (id: string | null) => void", default: "—", description: "Active preset. setPreset also takes its seed, variant and contrast; null restores the provider defaults." },
        {
          name: "setSeed · setVariant · setContrast",
          type: "—",
          default: "—",
          description: "With a preset active these fork it: its type, shape and elevation stay, its tuned colors give way to the generated scheme.",
        },
      ],
    },
    {
      name: "ThemeScope",
      description: "Previews and galleries.",
      props: [
        { name: "preset", type: "string | ThemePreset | null", default: "page preset", description: "Preset for the subtree; null drops the page's preset. Its colors become the defaults for seed, variant and contrast." },
      ],
    },
    {
      name: "Helpers",
      description: "Exported from theme-presets. Color generation loads @material/material-color-utilities on first use.",
      props: [
        { name: "THEME_PRESETS", type: "readonly ThemePreset[]", default: "—", description: `The ${THEME_PRESETS.length} shipped presets.` },
        { name: "getThemePreset", type: "(id, presets?) => ThemePreset | undefined", default: "—", description: "Case-insensitive lookup." },
        { name: "presetCss", type: "(preset, options?) => Promise<string>", default: "—", description: "Both modes as CSS. Options: seed, variant, contrast, fonts (default true)." },
        { name: "presetTokens", type: "(preset, dark?, options?) => Promise<Record<string, string>>", default: "—", description: "Every variable for one mode, for inline styles." },
        { name: "presetStyleTokens", type: "(preset | null) => Record<string, string>", default: "—", description: "Just the type, radius and elevation variables (null: the library defaults)." },
        { name: "loadPresetFonts", type: "(preset) => void", default: "—", description: "Adds the preset's font stylesheet to <head> once." },
        { name: "SHAPE_SCALES · ELEVATIONS", type: "Record<…>", default: "—", description: "The named scales, to reuse in your own presets." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Each shipped preset is tested in light and dark: {c("on-surface")} and {c("on-surface-variant")} on every surface container, every on-color on its container,
        primary on surface and inverse pairs meet 4.5:1; outlines meet 3:1.
      </>
    ),
    notes: [
      "Colors you customize on top of a preset aren't covered by those tests; check new pairs with the role palette in the Theme builder.",
      "A preset never forces light or dark. Midnight is designed dark-first but has a tested light mode.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Shape scale", "xs · sm · md · lg · lg-plus · xl · xl-plus · 2xl"],
        rows: [
          ["standard", "4 · 8 · 12 · 16 · 20 · 28 · 32 · 48"],
          ["subtle", "4 · 6 · 8 · 10 · 12 · 16 · 20 · 28"],
          ["sharp", "2 · 4 · 6 · 8 · 10 · 12 · 14 · 20"],
          ["rounded", "8 · 12 · 16 · 20 · 24 · 32 · 36 · 56"],
        ],
      },
    ],
    cards: [
      { title: "Elevation styles", items: ["standard: M3 key + ambient", "soft: wide, faint, diffuse", "crisp: hairline + tight drop", "flat: hairlines; levels 3–5 keep a faint drop"] },
      { title: "Output", items: ["--md-* color roles", "--font-sans · --font-mono", "--radius-* · --md-elevation-1…5"] },
    ],
    source: "Surface tones per preset were picked on each preset's neutral hue in HCT; the rest comes from Material color utilities (2025 spec).",
  },
} satisfies ComponentDoc
