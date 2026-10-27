import { Bullets, H2, Prose, Strong } from "@/docs/docs-site/guide"
import { CodePanel, DocTable, InlineCode, TextLink } from "@/docs/docs-site/primitives"

export const lead = "Pick any seed color and every role, light and dark, is generated from it with Google's Material Color Utilities and the 2025 color spec."

const provider = `<ThemeProvider defaultSeed="#0B57D0" defaultVariant="expressive" defaultContrast={0}>
  <App />
</ThemeProvider>`

const runtime = `const { setTheme } = useTheme()

// One recolor, one persisted write
setTheme({ seed: "#386A20", variant: "vibrant", contrast: 0.5 })

// Back to the baseline tokens in expressive.css
setTheme({ seed: null, variant: "tonalSpot", contrast: 0 })`

const exportCss = `import { schemeCss, schemeColors } from "@/components/ui/theme-provider"

// "html:root{--md-primary:#…}html.dark{…}" — paste into expressive.css or serve it
const css = await schemeCss("#0B57D0", "tonalSpot", 0)

// { "--md-primary": "#…", … } for one mode
const dark = await schemeColors("#0B57D0", "tonalSpot", 0, true)`

const scope = `<ThemeScope seed="#9C4146" mode="dark" className="rounded-xl p-6">
  <Button>Rose, dark, only in here</Button>
</ThemeScope>`

export default function DynamicColor() {
  return (
    <Prose>
      <p>
        Dynamic color is optional. With no seed, the baseline tokens in <InlineCode>expressive.css</InlineCode> apply and{" "}
        <InlineCode>@material/material-color-utilities</InlineCode> is never loaded. Set a seed and the provider imports it on demand, generates both schemes, and
        injects them as a <InlineCode>&lt;style id="expressive-dynamic-color"&gt;</InlineCode> that outranks the baseline.
      </p>

      <H2>Seed, variant, contrast</H2>
      <CodePanel code={provider} />
      <DocTable
        columns={["Setting", "Values", "Effect"]}
        cellClassName={["font-mono text-body-sm text-primary", "font-mono text-body-sm", "text-on-surface-variant"]}
        rows={[
          ["seed", '"#RRGGBB" | null', "Source color. null = baseline tokens."],
          [
            "variant",
            "tonalSpot · vibrant · expressive · fidelity · content · neutral · monochrome · rainbow · fruitSalad",
            "How chroma and hue spread across primary, secondary, tertiary and surfaces. tonalSpot is the M3 default; expressive rotates hues for more play.",
          ],
          ["contrast", "-1 … 1", "0 standard, 0.5 medium, 1 high. Raises tone distance between each role and its on-role."],
        ]}
      />

      <H2>Changing it at runtime</H2>
      <CodePanel code={runtime} />
      <p>
        Every surface cross-fades for 400ms on each change. The <TextLink to="/themes">Theme builder</TextLink> is this API with a UI on top.
      </p>

      <H2>Without the provider</H2>
      <Bullets>
        <li>
          <Strong>schemeCss(seed, variant, contrast)</Strong> returns the light and dark blocks as CSS text, ready to paste into{" "}
          <InlineCode>expressive.css</InlineCode> so production ships no color math.
        </li>
        <li>
          <Strong>schemeColors(seed, variant, contrast, dark)</Strong> returns one mode as a variable map.
        </li>
        <li>
          <Strong>ThemeScope</Strong> applies a scheme to one subtree as inline variables.
        </li>
      </Bullets>
      <CodePanel code={exportCss} />
      <CodePanel code={scope} />
    </Prose>
  )
}
