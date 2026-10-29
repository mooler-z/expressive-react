import { TextLink } from "@/docs/docs-site/primitives"
import { SiteLayout } from "@/docs/site/site-layout"
import { ThemeControls } from "@/docs/site/themes/theme-controls"
import { providerSnippet, themeCss, useBuilderTheme, useSchemes } from "@/docs/site/themes/theme-data"
import { RolePalette, ThemeOutput } from "@/docs/site/themes/theme-output"
import { ThemePreview } from "@/docs/site/themes/theme-preview"

export const meta = { path: "/themes" }

/** Theme builder · design-reference/site/Themes.dc.html */
export default function ThemesPage() {
  const { theme, apply, reset, mode, setMode, resolvedMode } = useBuilderTheme()
  const schemes = useSchemes(theme.seed, theme.variant, theme.contrast, theme.preset)
  const css = schemes ? themeCss(theme, schemes) : null

  return (
    <SiteLayout active="themes">
      <main className="mx-auto w-full max-w-[1400px] px-4 pt-8 pb-24 md:px-8" data-screen-label="Theme builder">
        <div className="max-w-2xl">
          <h1 className="text-display-sm font-semibold tracking-tight">Theme builder</h1>
          <p className="mt-3 text-body-lg text-pretty text-on-surface-variant">
            Pick a seed, a scheme variant and a contrast level. The whole site recolors as you go; copy the CSS when it
            feels right. Or start from one of the <TextLink to="/themes/presets">theme presets</TextLink>.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start">
          <ThemeControls
            theme={theme}
            apply={apply}
            reset={reset}
            mode={mode}
            setMode={setMode}
            dark={resolvedMode === "dark"}
            css={css}
          />

          <div className="@container min-w-0 space-y-6">
            <div
              className="grid grid-cols-1 gap-4 @3xl:grid-cols-2"
              data-spec="Side-by-side previews|Light and dark are rendered at the same time: each card is a ThemeScope with its own scheme, independent of the site mode."
            >
              <ThemePreview theme={theme} mode="light" />
              <ThemePreview theme={theme} mode="dark" />
            </div>
            <RolePalette scheme={schemes ? schemes[resolvedMode] : null} mode={resolvedMode} />
            <ThemeOutput css={css} provider={providerSnippet(theme)} />
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}
