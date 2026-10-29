import { Bullets, H2, Prose, Strong } from "@/docs/docs-site/guide"
import { CodePanel, DocTable, InlineCode, TextLink } from "@/docs/docs-site/primitives"

export const lead = "Every color, radius, shadow and spring is a CSS variable in one file you own: styles/expressive.css."

const roles = `:root {
  --md-primary: #6750a4;
  --md-on-primary: #ffffff;
  --md-primary-container: #eaddff;
  /* …49 roles */
}
.dark {
  --md-primary: #d0bcff;
  /* … */
}

/* Mapped to Tailwind colors, inline so a nested .dark or ThemeScope re-themes correctly */
@theme inline {
  --color-primary: var(--md-primary);
  --color-primary-container: var(--md-primary-container);
}`

const usage = `<div className="rounded-xl bg-primary-container p-6 text-on-primary-container shadow-1">
  <h2 className="text-headline-sm">Storage almost full</h2>
  <p className="text-body-md text-on-primary-container/80">You've used 92% of 15 GB.</p>
</div>`

const newToken = `/* expressive.css */
@theme {
  --radius-3xl: 64px;
}

/* lib/utils.ts: tell tailwind-merge, or it may drop the class */
const twMergeConfig = {
  extend: { theme: { radius: ["lg-plus", "xl-plus", "3xl"] } },
}`

export default function Theming() {
  return (
    <Prose>
      <p>
        <code className="font-mono">@expressive/init</code> adds <InlineCode>styles/expressive.css</InlineCode>. It defines the M3 color roles as{" "}
        <InlineCode>--md-*</InlineCode> variables for light and <InlineCode>.dark</InlineCode>, then maps them, plus the type, shape, elevation and motion scales, into
        Tailwind v4's <InlineCode>@theme</InlineCode>.
      </p>

      <H2>Color roles</H2>
      <CodePanel filename="styles/expressive.css" icon="css" code={roles} />
      <p>
        Use roles, never raw colors: <InlineCode>bg-surface-container-high</InlineCode>, <InlineCode>text-on-surface-variant</InlineCode>,{" "}
        <InlineCode>border-outline-variant</InlineCode>. Opacity modifiers work, which is how M3 state colors are written: disabled containers are{" "}
        <InlineCode>bg-on-surface/10</InlineCode>, disabled labels <InlineCode>text-on-surface/38</InlineCode>.
      </p>
      <CodePanel code={usage} />

      <H2>Four ways to change the palette</H2>
      <Bullets>
        <li>
          <Strong>Edit the variables.</Strong> Paste a scheme into <InlineCode>:root</InlineCode> and <InlineCode>.dark</InlineCode>. The{" "}
          <TextLink to="/themes">Theme builder</TextLink> generates one from any seed.
        </li>
        <li>
          <Strong>Generate at runtime.</Strong> Give <InlineCode>ThemeProvider</InlineCode> a seed and every role is computed from it. See{" "}
          <TextLink to="/docs/dynamic-color">Dynamic color</TextLink>.
        </li>
        <li>
          <Strong>Pick a preset.</Strong> <InlineCode>&lt;ThemeProvider defaultPreset="campus"&gt;</InlineCode> applies one of 42{" "}
          <TextLink to="/themes/presets">theme presets</TextLink>: color plus tuned surfaces, a typeface, a corner scale and an elevation style. See{" "}
          <TextLink to="/docs/theme-presets">Theme presets</TextLink>.
        </li>
        <li>
          <Strong>Scope a subtree.</Strong> <InlineCode>&lt;ThemeScope seed="#0B57D0" mode="dark"&gt;</InlineCode> re-themes one region, such as a preview or a
          brand-colored card, without touching the page.
        </li>
      </Bullets>

      <H2>Scales</H2>
      <DocTable
        columns={["Scale", "Utilities", "Values"]}
        cellClassName={["text-on-surface", "font-mono text-body-sm", "text-on-surface-variant"]}
        rows={[
          ["Type", "text-display-lg … text-label-sm", "15 styles; size, line height, tracking and weight in one class"],
          ["Shape", "rounded-xs · sm · md · lg · lg-plus · xl · xl-plus · 2xl · full", "4 · 8 · 12 · 16 · 20 · 28 · 32 · 48dp · full"],
          ["Elevation", "shadow-1 … shadow-5", "M3 levels 1–5, from --md-elevation-1 … 5 so presets can restyle them"],
          ["Motion", "ease-fast-spatial, ease-default-effects, shape-morph …", "M3 Expressive springs as linear() curves"],
          ["Breakpoints", "sm · md · lg · xl · 2xl", "480 · 600 · 840 · 1200 · 1600 (M3 window size classes)"],
        ]}
      />
      <p>
        Heads-up if you mix with other Tailwind code: the theme replaces Tailwind's <InlineCode>rounded-xs…2xl</InlineCode> values and its{" "}
        <InlineCode>sm…2xl</InlineCode> breakpoints with the M3 ones above.
      </p>

      <H2>Utilities the components rely on</H2>
      <Bullets>
        <li>
          <InlineCode>state-layer</InlineCode>: the 8 / 10 / 12% hover, focus and pressed overlay in <InlineCode>currentColor</InlineCode>. Reads React Aria's{" "}
          <InlineCode>data-hovered</InlineCode>, <InlineCode>data-focus-visible</InlineCode> and <InlineCode>data-pressed</InlineCode>.
        </li>
        <li>
          <InlineCode>focus-ring</InlineCode>: a 3dp secondary outline, keyboard focus only.
        </li>
        <li>
          <InlineCode>shape-morph</InlineCode>: corners on the FastSpatial spring, colors on DefaultEffects.
        </li>
      </Bullets>

      <H2>Adding a token</H2>
      <p>
        Add it under <InlineCode>@theme</InlineCode> (or <InlineCode>@theme inline</InlineCode> if it reads a <InlineCode>--md-*</InlineCode> variable). If it's a new
        type, radius, shadow, easing or animation name, register it in <InlineCode>twMergeConfig</InlineCode> too, otherwise <InlineCode>cn()</InlineCode> can
        silently drop it next to a similar class.
      </p>
      <CodePanel code={newToken} />
    </Prose>
  )
}
