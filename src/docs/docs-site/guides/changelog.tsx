import { Bullets, H2, Prose, Strong } from "@/docs/docs-site/guide"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import { REGISTRY } from "@/docs/docs-site/registry"

export const lead = "What changed, release by release. You own the code, so nothing updates under you: use add --diff to pick up fixes."

const count = (type: string) => Object.values(REGISTRY).filter((i) => i.type === type).length

export default function Changelog() {
  return (
    <Prose>
      <div className="flex flex-wrap items-baseline gap-3">
        <H2 id="v1-1-0">v1.1.0</H2>
        <span className="rounded-full bg-primary-container px-3 py-0.5 text-label-lg text-on-primary-container">Latest</span>
        <span className="text-body-md">October 2026</span>
      </div>
      <p>Theme presets: whole looks, not just a seed.</p>
      <Bullets>
        <li>
          <Strong>20 presets</Strong> in the new <InlineCode>theme-presets</InlineCode> item, from Quiet and Graphite to Paper, Meskel and Campus. Each sets color,
          hand-tuned canvas, card and hairline tones, a typeface, a corner scale and an elevation style, and passes WCAG AA in light and dark. Browse them in the{" "}
          <TextLink to="/themes/presets">preset gallery</TextLink>.
        </li>
        <li>
          <InlineCode>ThemeProvider</InlineCode> takes <InlineCode>defaultPreset</InlineCode> and <InlineCode>presets</InlineCode>; <InlineCode>useTheme()</InlineCode>{" "}
          adds <InlineCode>preset</InlineCode>, <InlineCode>setPreset</InlineCode> and <InlineCode>presets</InlineCode>; <InlineCode>ThemeScope</InlineCode> takes{" "}
          <InlineCode>preset</InlineCode>. <InlineCode>presetCss()</InlineCode> renders one for SSR. Fonts load only while a preset that needs them is active.
        </li>
        <li>
          <Strong>Elevation is now themeable</Strong>: <InlineCode>shadow-1 … shadow-5</InlineCode> read <InlineCode>--md-elevation-1 … 5</InlineCode>. Values are
          unchanged; if you copied expressive.css, take the new version with <InlineCode>add --diff</InlineCode>.
        </li>
      </Bullets>

      <div className="flex flex-wrap items-baseline gap-3">
        <H2 id="v1-0-0">v1.0.0</H2>
        <span className="text-body-md">October 2026</span>
      </div>
      <p>The first public release: the whole Material 3 Expressive kit as a shadcn registry.</p>
      <Bullets>
        <li>
          <Strong>{count("registry:ui")} components</Strong> covering every M3 component, the Expressive additions (loading indicator, button groups, split button,
          FAB menu, toolbars, wavy progress, shape library) and shadcn staples (command palette, data table, resizable, toast).
        </li>
        <li>
          <Strong>{count("registry:block")} blocks</Strong>: landing templates and variants, an admin portal with 21 pages, dashboard widgets, M3 canonical layouts,
          and auth, settings, shell, data and people blocks. Browse them in <TextLink to="/blocks">Blocks</TextLink>.
        </li>
        <li>
          <Strong>{count("registry:hook")} hooks</Strong> for window size classes, media queries, spring timing, press scale, magnetic, tilt and drag-scroll.
        </li>
        <li>
          <Strong>Theme</Strong>: color roles, type, shape, elevation and the six M3 Expressive springs as Tailwind v4 tokens; dynamic color with nine scheme variants
          and three contrast levels on the 2025 spec; <InlineCode>ThemeScope</InlineCode> for per-subtree themes.
        </li>
        <li>
          <Strong>Shape and motion follow Google's Compose tokens</Strong>: buttons tighten to 8 / 8 / 12 / 16 / 16dp when pressed, toggles take the square radius
          when selected, and every morph rides the FastSpatial spring.
        </li>
        <li>
          <Strong>Registry checks</Strong>: <InlineCode>registry:build</InlineCode> fails when an item's dependencies drift from its imports.
        </li>
      </Bullets>
    </Prose>
  )
}
