import { Bullets, H2, Prose, Strong } from "@/docs/docs-site/guide"
import { Callout, CodePanel, DocTable, InlineCode, TextLink } from "@/docs/docs-site/primitives"

export const lead = "Every scrollable area gets M3 Expressive scrollbars from expressive.css: no track, a pill thumb in the theme's ink, primary while dragged."

const ROWS = Array.from({ length: 24 }, (_, i) => `Session ${4821 - i}`)

const hide = `{/* Still scrolls with wheel, touch and keyboard; no bar */}
<div className="no-scrollbar flex gap-2 overflow-x-auto">…</div>`

const override = `/* Your app.css, after expressive.css: a slimmer thumb everywhere */
@layer base {
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb { border-width: 3px; }
}`

const firefox = `@layer base {
  /* Chromium and Safari: ::-webkit-scrollbar rules (thumb, hover, drag) */

  /* Firefox only: the standard properties. In Chromium, setting
     scrollbar-width or scrollbar-color on an element switches off
     every ::-webkit-scrollbar rule for it, so they stay behind this gate. */
  @supports not selector(::-webkit-scrollbar) {
    * {
      scrollbar-width: thin;
      scrollbar-color: color-mix(in srgb, var(--md-on-surface-variant) 42%, transparent) transparent;
    }
  }
}`

function ScrollDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div
        tabIndex={0}
        aria-label="Scrollbar demo, vertical"
        className="focus-ring h-64 overflow-y-auto rounded-lg bg-surface-container-low p-2 text-on-surface"
      >
        {ROWS.map((r, i) => (
          <div key={r} className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-body-md odd:bg-surface-container">
            <span className="size-2 rounded-full bg-primary" style={{ opacity: 1 - i / 30 }} />
            {r}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <div tabIndex={0} aria-label="Scrollbar demo, horizontal" className="focus-ring overflow-x-auto rounded-lg bg-surface-container-low p-3">
          <div className="flex w-max gap-2">
            {ROWS.slice(0, 14).map((r) => (
              <span key={r} className="rounded-full bg-secondary-container px-4 py-2 text-label-lg whitespace-nowrap text-on-secondary-container">
                {r}
              </span>
            ))}
          </div>
        </div>
        <div className="no-scrollbar overflow-x-auto rounded-lg bg-surface-container-low p-3" aria-label="no-scrollbar demo" tabIndex={0}>
          <div className="flex w-max gap-2">
            {ROWS.slice(0, 14).map((r) => (
              <span key={r} className="rounded-full bg-tertiary-container px-4 py-2 text-label-lg whitespace-nowrap text-on-tertiary-container">
                {r}
              </span>
            ))}
          </div>
        </div>
        <p className="text-body-sm text-on-surface-variant">
          Top: the default bar. Bottom: <InlineCode>no-scrollbar</InlineCode>, same content, no bar.
        </p>
      </div>
    </div>
  )
}

export default function Scrollbars() {
  return (
    <Prose>
      <p>
        The rules live in the base layer of <InlineCode>expressive.css</InlineCode>, so you get them by importing the theme; there's no component to add. Colors
        come from the <InlineCode>--md-*</InlineCode> roles, so they follow light and dark, seeds, <TextLink to="/docs/theme-presets">presets</TextLink> and{" "}
        <TextLink to="/docs/theme-provider">ThemeScope</TextLink>.
      </p>
      <ScrollDemo />

      <H2 id="states">States</H2>
      <DocTable
        columns={["State", "Thumb", "Width"]}
        rows={[
          ["Resting", "on-surface-variant at 22%", "6dp pill in a 14dp gutter"],
          ["Pointer over the scroll area", "on-surface-variant at 42%", "6dp"],
          ["Pointer on the thumb", "on-surface-variant at 62%", "9dp"],
          ["Dragging", "primary", "9dp"],
        ]}
      />
      <Bullets>
        <li>
          <Strong>No track and no arrow buttons.</Strong> The corner where two bars meet is transparent too.
        </li>
        <li>
          <Strong>Minimum thumb length 40dp</Strong>, so very long lists keep a thumb you can grab.
        </li>
      </Bullets>

      <H2 id="hide">Hiding a scrollbar</H2>
      <p>
        <InlineCode>no-scrollbar</InlineCode> is a utility, so it wins over the base layer in every browser. <TextLink to="/docs/scroll-area">ScrollArea</TextLink>'s{" "}
        <InlineCode>hideScrollbar</InlineCode> prop uses it.
      </p>
      <CodePanel code={hide} />

      <H2 id="firefox">Firefox, and why the fallback is gated</H2>
      <p>
        Firefox has no scrollbar pseudo-elements, only <InlineCode>scrollbar-width</InlineCode> and <InlineCode>scrollbar-color</InlineCode>: it gets a thin bar in
        the same colors, without the hover and drag states. Chromium supports both systems, and as soon as an element sets either standard property it ignores the{" "}
        <InlineCode>::-webkit-scrollbar</InlineCode> rules for that element. That's why the fallback sits behind{" "}
        <InlineCode>@supports not selector(::-webkit-scrollbar)</InlineCode>.
      </p>
      <CodePanel filename="styles/expressive.css" icon="css" code={firefox} />
      <Callout icon="warning" title="Don't set scrollbar-width on your own containers">
        A <InlineCode>[scrollbar-width:thin]</InlineCode> class turns the M3 thumb back into the browser's default bar in Chrome and Edge. Library components don't
        set it; remove it from your own code when you upgrade.
      </Callout>

      <H2 id="customize">Customizing</H2>
      <p>Override in your own base layer, after the theme import. Unlayered CSS also wins, as does anything scoped to a selector.</p>
      <CodePanel filename="app.css" icon="css" code={override} />
    </Prose>
  )
}
