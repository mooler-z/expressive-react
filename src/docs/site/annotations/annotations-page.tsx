import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { springTiming, type SpringName } from "@/hooks/use-motion"
import { SPECIMENS } from "@/docs/site/annotations/specimens"
import { SiteLayout } from "@/docs/site/site-layout"

/*
 * /annotations · design-reference/site/Annotations.dc.html
 * The design's notes describe the kit's GSAP prototype; these rows describe what the library actually ships
 * (React Aria + the M3 Expressive spring tokens). Spring durations are read from the theme at runtime.
 */

type Ms = Record<SpringName, number>

const SPRING_NAMES: SpringName[] = ["fast-spatial", "default-spatial", "slow-spatial", "fast-effects", "default-effects", "slow-effects"]

function useSpringMs(): Ms {
  const [ms, setMs] = React.useState<Ms>({
    "fast-spatial": 374,
    "default-spatial": 414,
    "slow-spatial": 567,
    "fast-effects": 154,
    "default-effects": 223,
    "slow-effects": 301,
  })
  React.useEffect(() => {
    setMs(Object.fromEntries(SPRING_NAMES.map((n) => [n, Math.round(springTiming(n).duration)])) as Ms)
  }, [])
  return ms
}

interface Spec {
  id: keyof typeof SPECIMENS
  title: string
  where: string
  rows: [label: string, value: string][]
}

function specs(ms: Ms): Spec[] {
  const fs = `spatial.fast 0.6 / 800 (${ms["fast-spatial"]}ms)`
  return [
    {
      id: "button",
      title: "Button press",
      where: "Landing hero · Docs",
      rows: [
        ["Trigger", "Pointer down / Space / Enter (React Aria press events)"],
        ["Shape", "Pressed corners 8dp (XS, S), 12dp (M), 16dp (L, XL), for round and square buttons alike (androidx ButtonXxxTokens)"],
        ["Spring", `${fs} on press and on release, via the shape-morph utility`],
        ["Scale", "usePressScale (opt-in): squishes to .92 on press and springs back on release"],
        ["Also", "Ripple from the pointer at 14% (450ms grow, 350ms fade); state layer 12% while pressed"],
      ],
    },
    {
      id: "toggle",
      title: "Toggle · round ↔ square",
      where: "Hero cluster · Button page",
      rows: [
        ["Trigger", "Selection change"],
        ["Shape", "Toggle buttons: full → the square radius (12 / 16 / 28dp). Icon buttons flip the family: round → square, square → full"],
        ["Spring", `Radius ${fs}; container color effects.default (${ms["default-effects"]}ms)`],
        ["Icon", "Material Symbols FILL 0 → 1, interpolated because --icon-fill is a registered @property"],
        ["Also", "Connected groups: the selected segment rounds to full. Outlined toggles swap to inverse-surface; text toggles recolor and fill"],
      ],
    },
    {
      id: "switch",
      title: "Switch · Checkbox",
      where: "Hero cluster · Settings blocks",
      rows: [
        ["Trigger", "Toggle (click, Space, or the label)"],
        ["Handle", "16dp outline → 24dp on-primary and slides 20dp; swells to 28dp while pressed"],
        ["Spring", `Handle position and size ${fs}; track color 200ms standard`],
        ["Checkbox", "Check mark draws in (stroke-dashoffset, 200ms emphasized-decelerate); box fills primary in 150ms"],
        ["Also", "The icons variant crossfades ✕ ↔ ✓ in 200ms"],
      ],
    },
    {
      id: "slider",
      title: "Slider handle",
      where: "Hero cluster · Component page",
      rows: [
        ["Trigger", "Pointer down on the track or thumb; arrows, Page Up/Down, Home/End"],
        ["Handle", "4dp bar that narrows to 2dp while dragging or focused"],
        ["Track", "16dp track at XS (up to 96dp at XL) with a 6dp gap each side of the handle; 2dp inner corners; stop indicators"],
        ["Label", "Value pill on inverse-surface scales in above the handle while dragging"],
        ["Also", "Range: one thumb per value; the track mirrors in right-to-left layouts"],
      ],
    },
    {
      id: "fab",
      title: "FAB menu",
      where: "Hero cluster",
      rows: [
        ["Trigger", "FAB press"],
        ["Items", `Grow out of their trailing edge (clip-path) on ${fs} and fade in on effects.fast, bottom item first, 45ms stagger`],
        ["FAB", "Morphs into the 56dp close button: primary-container → primary, the icon rotates 90° and crossfades to close"],
        ["Close", "Escape, an outside press or choosing an item"],
        ["Spring", `spatial.fast for shape and items; effects.fast (${ms["fast-effects"]}ms) for fades`],
      ],
    },
    {
      id: "loading",
      title: "Loading indicator · Progress",
      where: "Everywhere something waits",
      rows: [
        ["Loading", "softBurst → cookie9 → pentagon → puffy → sunny → cookie4 → oval; one 520ms morph every 650ms inside a 4s linear spin"],
        ["Contained", "The same indicator at 79% on a primary-container disc"],
        ["Wavy", "3dp amplitude, 40dp wavelength; the wave travels one wavelength per cycle; 4dp gap and stop dot"],
        ["Indeterminate", "Two bars sweep across the track (M3 linear indeterminate)"],
        ["Reduced motion", "The spin slows to 12s and the wave stops travelling"],
      ],
    },
    {
      id: "shapes",
      title: "Hero shapes",
      where: "Landing hero · CTA · brand mark",
      rows: [
        ["Idle", "Cycle through 3 shapes every 2.8–3.2s; each morph is a clip-path transition on the spring curve (≤ 900ms)"],
        ["Hover", "Morph to burst / verySunny / gem while the pointer is over the shape"],
        ["Leave", "Returns to the current cycle shape"],
        ["Spin", "Optional 40–80s linear rotation (a wrapper with animate-[spin_…]); off with reduced motion"],
        ["Palette", "primary-container, tertiary-container, secondary-container; recolors with the seed"],
      ],
    },
    {
      id: "nav",
      title: "Navigation bar · Tabs",
      where: "Compact layout · Docs preview",
      rows: [
        ["Trigger", "Destination or tab change"],
        ["Indicator", `56×32dp secondary-container pill grows from its center on ${fs}`],
        ["Icon", `FILL 0 → 1 on effects.default (${ms["default-effects"]}ms)`],
        ["Tabs", "Primary tabs: the indicator slides between tabs on spatial.fast (React Aria SelectionIndicator)"],
        ["Segmented", "Pill tabs: the selected segment lifts to surface"],
      ],
    },
    {
      id: "layers",
      title: "Dialog · Palette · Menu · Snackbar · Toast",
      where: "Site chrome",
      rows: [
        ["Open", "Scrim fades 200ms; the dialog rises from −16dp and scales .92 → 1 in 450ms emphasized-decelerate"],
        ["Close", "150ms emphasized-accelerate; Esc, the scrim or a slot=\"close\" action; focus returns to the trigger"],
        ["Palette", "⌘K; autofocused input; ↑↓ move the highlight; ⏎ runs the item"],
        ["Menus", `Grow from the anchor (scaleY .7 → 1) on ${fs}; fade out on effects.fast`],
        [
          "Snackbar · toast",
          `Rise in (y 24, scale .96) on spatial.default (${ms["default-spatial"]}ms) inside a View Transition; snackbar 4s (8s with an action), toast 6s`,
        ],
      ],
    },
    {
      id: "text",
      title: "Text field · Chips",
      where: "Forms · filters",
      rows: [
        ["Label", "Floats into the outline notch as label-medium; 200ms emphasized; color → primary"],
        ["Border", `1dp outline → 2dp primary on focus, effects.fast (${ms["fast-effects"]}ms), no layout shift`],
        ["Filter chip", `Selected: the check grows in (padding + grid track) on ${fs}; container → secondary-container on effects.default`],
        ["Error", "Error border, supporting text and a trailing error icon"],
        ["Also", "Chips keep sm · 8dp corners; assist chips never fill"],
      ],
    },
    {
      id: "theme",
      title: "Theme switch · Dynamic color",
      where: "Header · Themes page",
      rows: [
        ["Trigger", "Mode toggle, seed pick, variant or contrast change"],
        ["Crossfade", "html.theme-switching for 400ms: background, color, border, fill and stroke transition 300ms standard"],
        ["Color", "Seed → material-color-utilities (2025 spec) → 49 --md-* roles on html:root and html.dark"],
        ["Scoped", "ThemeScope writes the same variables on its own element (previews, the Theme builder)"],
        ["Persistence", "The mode persists in localStorage; the review board passes ?dark &seed in the URL"],
      ],
    },
  ]
}

function tokenMap(ms: Ms): [moment: string, token: string, curve: string, also: string][] {
  const d = (n: SpringName) => `${ms[n]}ms`
  return [
    ["Button press / release", "spatial.fast", `linear() ${d("fast-spatial")} (shape-morph)`, "Ripple, state layer 12%"],
    ["Toggle select", "spatial.fast + effects.default", `${d("fast-spatial")} · ${d("default-effects")}`, "Icon FILL"],
    ["Switch handle", "spatial.fast", d("fast-spatial"), "Track color 200ms standard"],
    ["Checkbox", "—", "200ms emphasized-decelerate", "Box fill 150ms"],
    ["Slider handle", "—", "Follows the pointer; 2dp while dragging", "Value label"],
    ["FAB menu items", "spatial.fast + effects.fast", `${d("fast-spatial")} · 45ms stagger`, "FAB color, icon rotation"],
    ["Loading indicator", "spring curve", "520ms per morph · 4s spin", "Shape sequence"],
    ["Wavy progress", "progress spring (value)", "linear wave loop", "Stop indicator"],
    ["Hero shapes", "spring curve", "≤ 900ms morph · 3s interval", "Hover shape"],
    ["Nav / tab indicator", "spatial.fast", d("fast-spatial"), `Icon FILL (effects.default ${d("default-effects")})`],
    ["Menus / popovers", "spatial.fast in · effects.fast out", `${d("fast-spatial")} · ${d("fast-effects")}`, "drop-elevation-2"],
    ["Dialog", "—", "450ms emphasized-decelerate · 150ms out", "Scrim 200ms"],
    ["Snackbar / toast", "spatial.default in · effects.default out", `${d("default-spatial")} · ${d("default-effects")}`, "View Transition reflow"],
    ["Scroll reveal", "—", "700ms emphasized-decelerate", "y 28 → 0"],
    ["Theme crossfade", "—", "300ms standard (400ms window)", "All surfaces at once"],
  ]
}

export function AnnotationsPage() {
  const ms = useSpringMs()
  return (
    <SiteLayout active="tokens">
      <main className="mx-auto w-full max-w-[1400px] px-4 pt-8 pb-24 md:px-8" data-screen-label="Motion annotations">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-display-sm font-semibold tracking-tight">Interaction &amp; motion specs</h1>
            <p className="mt-3 text-body-lg text-pretty text-on-surface-variant">
              Every signature moment on the site, with the spring, the shape morph and the timing it uses. Specimens are live; press, hover and
              toggle them. The same notes appear in place on any page via the{" "}
              <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-container px-2 py-0.5 align-middle text-label-lg text-on-tertiary-container">
                <Icon name="square_foot" size={16} />
                Specs
              </span>{" "}
              toggle.
            </p>
          </div>
          <div className="grid gap-2 rounded-xl bg-surface-container-low p-4 text-body-sm text-on-surface-variant sm:grid-cols-2">
            <div>
              <div className="text-label-md tracking-wider uppercase">Spatial springs · move things</div>
              <div className="mt-1 font-mono">fast 0.6 / 800 · default 0.8 / 380 · slow 0.8 / 200</div>
            </div>
            <div>
              <div className="text-label-md tracking-wider uppercase">Effects springs · change things</div>
              <div className="mt-1 font-mono">fast 1 / 3800 · default 1 / 1600 · slow 1 / 800</div>
            </div>
            <div className="sm:col-span-2">
              Notation: <span className="font-mono">damping / stiffness</span>. In CSS each spring is a <span className="font-mono">linear()</span>{" "}
              curve with its settle time: <span className="font-mono">ease-fast-spatial</span> ({ms["fast-spatial"]}ms),{" "}
              <span className="font-mono">ease-default-spatial</span> ({ms["default-spatial"]}ms), …
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {specs(ms).map((s, i) => {
            const Specimen = SPECIMENS[s.id]
            return (
              <section
                key={s.id}
                id={s.id}
                data-screen-label={s.title}
                className="grid scroll-mt-24 gap-4 rounded-2xl bg-surface-container-low p-4 md:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
              >
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tertiary text-label-lg text-on-tertiary">{i + 1}</span>
                    <h2 className="text-title-lg">{s.title}</h2>
                    <span className="ml-auto rounded-xs bg-surface-container-high px-2 py-0.5 font-mono text-label-sm text-on-surface-variant">
                      {s.where}
                    </span>
                  </div>
                  <div className="relative flex min-h-[200px] flex-1 flex-wrap items-center justify-center gap-5 rounded-xl bg-surface p-6 ring-1 ring-outline-variant/40">
                    <Specimen />
                  </div>
                </div>
                <dl className="grid content-start gap-x-4 gap-y-3 text-body-md sm:grid-cols-[120px_1fr]">
                  {s.rows.map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt className="text-label-lg text-on-surface-variant">{k}</dt>
                      <dd className="m-0 text-on-surface">{v}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </section>
            )
          })}
        </div>

        <section className="mt-14 overflow-hidden rounded-xl border border-outline-variant" data-screen-label="Token map">
          <div className="bg-surface-container-low px-5 py-4">
            <h2 className="text-title-lg">Motion token map</h2>
            <p className="text-body-md text-on-surface-variant">Which spring, where. Durations are the settle times the CSS uses.</p>
          </div>
          <table className="w-full text-left text-body-md">
            <thead className="text-label-lg text-on-surface-variant">
              <tr>
                <th className="px-5 py-3 font-medium">Moment</th>
                <th className="px-5 py-3 font-medium">Token</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Curve · duration</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">Also changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {tokenMap(ms).map(([a, b, c, d]) => (
                <tr key={a}>
                  <td className="px-5 py-3">{a}</td>
                  <td className="px-5 py-3 font-mono text-body-sm">{b}</td>
                  <td className="hidden px-5 py-3 font-mono text-body-sm text-on-surface-variant md:table-cell">{c}</td>
                  <td className="hidden px-5 py-3 text-on-surface-variant lg:table-cell">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </SiteLayout>
  )
}
