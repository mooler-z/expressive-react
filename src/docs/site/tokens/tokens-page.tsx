import * as React from "react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton, ToggleIconButton } from "@/components/ui/icon-button"
import { Shape, type ShapeName } from "@/components/ui/shape"
import { useMagnetic } from "@/hooks/use-magnetic"
import { springTiming, type SpringName } from "@/hooks/use-motion"
import { usePressScale } from "@/hooks/use-press-scale"
import { useTilt } from "@/hooks/use-tilt"
import { useWindowSizeClass, type WindowSizeClass } from "@/hooks/use-window-size-class"
import { SiteLayout, getSiteTop } from "@/docs/site/site-layout"
import { TokenBar, TokenCards, TokenSidebar, useActiveSection } from "@/docs/site/tokens/token-nav"
import { cn } from "@/lib/utils"

/*
 * /tokens · design-reference/site/Tokens.dc.html
 * Every number on this page is read from the live theme (expressive.css custom properties),
 * so the sheet can't drift from what the components actually use.
 */

/** Read CSS custom properties from :root once mounted (theme tokens don't change with the color scheme). */
function useRootVars(names: string[]) {
  const key = names.join("|")
  const [vars, setVars] = React.useState<Record<string, string>>({})
  React.useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    setVars(Object.fromEntries(key.split("|").map((n) => [n, cs.getPropertyValue(n).trim()])))
  }, [key])
  return vars
}

const px = (v: string | undefined) => {
  if (!v) return null
  const n = parseFloat(v)
  if (!Number.isFinite(n)) return null
  return v.endsWith("rem") ? n * 16 : n
}
const num = (n: number) => String(+n.toFixed(2)).replace("-", "−")

export function TokensPage() {
  const active = useActiveSection()
  const cardsRef = React.useRef<HTMLDivElement>(null)
  const [cardsVisible, setCardsVisible] = React.useState(true)

  // The compact section bar takes over once the cards have scrolled under the header.
  React.useEffect(() => {
    const el = cardsRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setCardsVisible(e.isIntersecting), { rootMargin: `-${getSiteTop()}px 0px 0px 0px` })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <SiteLayout active="tokens">
      <main className="mx-auto w-full max-w-[1400px] px-4 pt-8 pb-24 md:px-8" data-screen-label="Design tokens">
        <div className="max-w-2xl">
          <h1 className="text-display-sm font-semibold tracking-tight">Design tokens</h1>
          <p className="mt-3 text-body-lg text-pretty text-on-surface-variant">
            The sheet behind the site. Every value below is a CSS variable or Tailwind utility shipped by{" "}
            <code className="rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-body-md">@expressive/init</code>; swatches follow the live
            theme.
          </p>
        </div>

        <div ref={cardsRef} className="mt-8">
          <TokenCards />
        </div>
        <TokenBar active={active} visible={!cardsVisible} className="xl:hidden" />

        {/* Extra-large and up (1200+): sticky section list beside the sheet. */}
        <div className="xl:grid xl:grid-cols-[15rem_minmax(0,1fr)] xl:items-start xl:gap-8">
          <TokenSidebar active={active} className="sticky top-6 mt-10 hidden xl:block" />
          <div className="min-w-0">
            <ColorSection />
            <TypeSection />
            <ShapeSection />
            <ElevationSection />
            <SpringsSection />
            <InteractionsSection />
            <SymbolsSection />
            <LayoutSection />
          </div>
        </div>
      </main>
    </SiteLayout>
  )
}

function SectionHeader({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-headline-sm font-semibold">{title}</h2>
        <p className="max-w-prose text-body-md text-on-surface-variant">{children}</p>
      </div>
      {action}
    </header>
  )
}

const Code = ({ children }: { children: React.ReactNode }) => <code className="font-mono">{children}</code>

/* ---------- Color ---------- */

const KEY_ROLES = ["primary", "secondary", "tertiary", "error"] as const
const KEY_CLASSES: Record<(typeof KEY_ROLES)[number], [string, string, string, string]> = {
  primary: ["bg-primary text-on-primary", "bg-on-primary text-primary", "bg-primary-container text-on-primary-container", "bg-on-primary-container text-primary-container"],
  secondary: ["bg-secondary text-on-secondary", "bg-on-secondary text-secondary", "bg-secondary-container text-on-secondary-container", "bg-on-secondary-container text-secondary-container"],
  tertiary: ["bg-tertiary text-on-tertiary", "bg-on-tertiary text-tertiary", "bg-tertiary-container text-on-tertiary-container", "bg-on-tertiary-container text-tertiary-container"],
  error: ["bg-error text-on-error", "bg-on-error text-error", "bg-error-container text-on-error-container", "bg-on-error-container text-error-container"],
}
const SURFACES = [
  ["surface", "border border-outline-variant bg-surface"],
  ["surface-dim", "bg-surface-dim"],
  ["surface-bright", "border border-outline-variant bg-surface-bright"],
  ["container-lowest", "border border-outline-variant bg-surface-container-lowest"],
  ["container-low", "bg-surface-container-low"],
  ["container", "bg-surface-container"],
  ["container-high", "bg-surface-container-high"],
  ["container-highest", "bg-surface-container-highest"],
  ["surface-variant", "bg-surface-variant"],
] as const
const CONTENT = [
  ["on-surface", "bg-on-surface text-surface"],
  ["on-surface-variant", "bg-on-surface-variant text-surface"],
  ["outline", "bg-outline text-surface"],
  ["outline-variant", "bg-outline-variant text-on-surface"],
  ["inverse-surface", "bg-inverse-surface text-inverse-on-surface"],
  ["inverse-on-surface", "bg-inverse-on-surface text-inverse-surface"],
  ["inverse-primary", "bg-inverse-primary text-on-primary-container"],
] as const
const FIXED = [
  ["primary-fixed", "bg-primary-fixed text-on-primary-fixed"],
  ["primary-fixed-dim", "bg-primary-fixed-dim text-on-primary-fixed"],
  ["on-primary-fixed", "bg-on-primary-fixed text-primary-fixed"],
  ["on-primary-fixed-variant", "bg-on-primary-fixed-variant text-primary-fixed"],
  ["secondary-fixed", "bg-secondary-fixed text-on-secondary-fixed"],
  ["secondary-fixed-dim", "bg-secondary-fixed-dim text-on-secondary-fixed"],
  ["tertiary-fixed", "bg-tertiary-fixed text-on-tertiary-fixed"],
  ["tertiary-fixed-dim", "bg-tertiary-fixed-dim text-on-tertiary-fixed"],
] as const

/** Edge rounding for a swatch strip: first and last tile get the outer corners. */
const edge = (i: number, n: number, side: "x" | "y" = "x") =>
  i === 0 ? (side === "x" ? "rounded-l-md" : "rounded-t-md") : i === n - 1 ? (side === "x" ? "rounded-r-md" : "rounded-b-md") : ""

function ColorSection() {
  return (
    <section id="color" className="mt-10 scroll-mt-32 space-y-4 md:scroll-mt-20 xl:scroll-mt-6">
      <SectionHeader
        title="Color roles"
        action={
          <Link to="/themes" className="inline-flex items-center gap-1 text-label-lg text-primary">
            Theme builder
            <Icon name="arrow_forward" size={18} />
          </Link>
        }
      >
        49 roles as <Code>--md-*</Code> custom properties, exposed as <Code>bg-primary</Code>, <Code>text-on-primary-container</Code>, with alpha (
        <Code>bg-primary/10</Code>). Change the seed in the header and watch them move.
      </SectionHeader>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {KEY_ROLES.map((role) => {
          const [main, on, container, onContainer] = KEY_CLASSES[role]
          return (
            <div key={role} className="space-y-1 text-label-md">
              <div className={cn("flex h-20 items-end rounded-t-md p-2", main)}>{role}</div>
              <div className={cn("flex h-10 items-end p-2", on)}>on-{role}</div>
              <div className={cn("flex h-20 items-end p-2", container)}>{role}-container</div>
              <div className={cn("flex h-10 items-end rounded-b-md p-2", onContainer)}>on-{role}-container</div>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-3 gap-1 text-label-md md:grid-cols-6 lg:grid-cols-9">
        {SURFACES.map(([label, cls], i) => (
          <div key={label} className={cn("flex h-16 min-w-0 items-end p-2 break-words", cls, edge(i, SURFACES.length))}>
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 text-label-md md:grid-cols-7">
        {CONTENT.map(([label, cls], i) => (
          <div key={label} className={cn("flex h-14 min-w-0 items-end p-2 break-words", cls, edge(i, CONTENT.length))}>
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1 text-label-md md:grid-cols-4 lg:grid-cols-8">
        {FIXED.map(([label, cls], i) => (
          <div key={label} className={cn("flex h-12 min-w-0 items-end p-2 break-words", cls, edge(i, FIXED.length))}>
            {label}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-body-sm text-on-surface-variant">
        <span>
          Site chrome: <Code>surface</Code> → <Code>surface-container</Code> when scrolled
        </span>
        <span>
          Cards: <Code>surface-container-low</Code>
        </span>
        <span>
          Popovers, menus, palette: <Code>surface-container-high</Code>
        </span>
        <span>
          Code: <Code>surface-container-lowest</Code> · terminal: <Code>inverse-surface</Code>
        </span>
        <span>
          Selected: <Code>secondary-container</Code>
        </span>
      </div>
    </section>
  )
}

/* ---------- Type ---------- */

const TYPE: [token: string, cls: string, sample: string, emphasized: boolean][] = [
  ["display-lg", "text-display-sm font-semibold md:text-display-lg", "Components that bounce back", true],
  ["display-md", "text-display-sm md:text-display-md", "Copy, paste, own it", false],
  ["display-sm", "text-display-sm", "Bold shapes, springy moves", false],
  ["headline-lg", "text-headline-lg font-semibold", "Your code, not a dependency", true],
  ["headline-md", "text-headline-md", "Real M3 motion", false],
  ["headline-sm", "text-headline-sm font-semibold", "Section titles in docs", true],
  ["title-lg", "text-title-lg", "App bar titles, card titles", false],
  ["title-md", "text-title-md", "List headlines, M button labels", false],
  ["title-sm", "text-title-sm", "Tabs, sidebar group names", false],
  ["body-lg", "text-body-lg", "Paragraphs and list items read comfortably at 16.", false],
  ["body-md", "text-body-md", "Supporting text, descriptions, table cells.", false],
  ["body-sm", "text-body-sm", "Captions, helper text, timestamps.", false],
  ["label-lg", "text-label-lg", "Buttons, chips, navigation labels", false],
  ["label-md", "text-label-md", "Nav bar labels, overlines", false],
  ["label-sm", "text-label-sm", "Badges, dense metadata", false],
]

function TypeSection() {
  const vars = useRootVars(
    TYPE.flatMap(([t]) => [`--text-${t}`, `--text-${t}--line-height`, `--text-${t}--letter-spacing`, `--text-${t}--font-weight`]),
  )
  return (
    <section id="type" className="mt-16 scroll-mt-32 space-y-4 md:scroll-mt-20 xl:scroll-mt-6">
      <SectionHeader title="Type scale · Roboto Flex">
        15 styles as <Code>text-display-lg … text-label-sm</Code>. Expressive's emphasized variants add <Code>font-medium</Code> or{" "}
        <Code>font-semibold</Code>; the site uses emphasized display and headline, regular body. Optical size is automatic.
      </SectionHeader>
      <div className="divide-y divide-outline-variant rounded-xl bg-surface-container-low px-6 md:px-8">
        {TYPE.map(([token, cls, sample, emphasized]) => {
          const size = px(vars[`--text-${token}`])
          const lh = px(vars[`--text-${token}--line-height`])
          const ls = px(vars[`--text-${token}--letter-spacing`])
          const weight = vars[`--text-${token}--font-weight`] || "400"
          const meta = size && lh ? `${num(size)} / ${num(lh)}${ls ? ` · ${num(ls)}` : ""}` : ""
          return (
            <div key={token} className="grid items-baseline gap-2 py-4 md:grid-cols-[200px_minmax(0,1fr)_160px]">
              <span className="font-mono text-body-sm text-on-surface-variant">
                {token}
                {meta && ` · ${meta}`}
              </span>
              <span className={cn("truncate", cls)}>{sample}</span>
              <span className="hidden text-body-sm text-on-surface-variant md:block">{emphasized ? "emphasized 600" : weight}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- Shape ---------- */

const RADII: [key: string, cls: string][] = [
  ["none", "rounded-none"],
  ["xs", "rounded-xs"],
  ["sm", "rounded-sm"],
  ["md", "rounded-md"],
  ["lg", "rounded-lg"],
  ["lg-plus", "rounded-lg-plus"],
  ["xl", "rounded-xl"],
  ["xl-plus", "rounded-xl-plus"],
  ["2xl", "rounded-2xl"],
  ["full", "rounded-full"],
]

const SHAPES: ShapeName[] = [
  "circle", "oval", "squircle", "triangle", "diamond", "pentagon", "hexagon", "gem", "cookie4", "cookie6", "cookie7",
  "cookie9", "cookie12", "clover4", "clover8", "sunny", "verySunny", "burst", "softBurst", "puffy", "arch",
]
const SHAPE_COLORS = [
  "text-primary", "text-primary-container", "text-secondary", "text-secondary-container",
  "text-tertiary", "text-tertiary-container", "text-primary-fixed-dim", "text-surface-container-highest",
]

function ShapeSection() {
  const vars = useRootVars(RADII.map(([k]) => `--radius-${k}`))
  return (
    <section id="shape" className="mt-16 scroll-mt-32 space-y-4 md:scroll-mt-20 xl:scroll-mt-6">
      <SectionHeader title="Shape">
        Ten corner tokens as <Code>rounded-*</Code>, plus the Expressive shape library: equal-point polygons so any shape morphs into any other.
      </SectionHeader>
      <div className="grid grid-cols-3 gap-4 rounded-xl bg-surface-container-low p-6 text-center font-mono text-body-sm text-on-surface-variant sm:grid-cols-5 md:p-8 lg:grid-cols-10">
        {RADII.map(([k, cls]) => {
          const value = k === "none" ? "0" : k === "full" ? "∞" : (px(vars[`--radius-${k}`]) ?? "…")
          return (
            <div key={k}>
              <div className={cn("mx-auto size-16 bg-primary-container", cls)} />
              <div className="mt-2">
                {k} · {value}
              </div>
            </div>
          )
        })}
      </div>
      <div
        className="rounded-xl bg-surface-container-low p-6 md:p-8"
        data-spec="Shape library|Each shape is a 120-point polygon applied as clip-path, so any two morph point-to-point with a CSS transition on the spring curve. Hover any tile to morph it to the next one."
      >
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-10">
          {SHAPES.map((name, i) => (
            <div key={name} className="flex min-w-0 flex-col items-center gap-2 text-label-md text-on-surface-variant">
              <Shape shape={name} hoverShape={SHAPES[(i + 1) % SHAPES.length]} morphDuration={600} className={cn("size-14 cursor-pointer", SHAPE_COLORS[i % SHAPE_COLORS.length])} />
              <span className="max-w-full truncate">{name}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-body-sm text-on-surface-variant">
          <span>
            Buttons: <Code>full</Code> → 8 / 12 / 16 on press
          </span>
          <span>
            Cards: <Code>md · 12</Code>
          </span>
          <span>
            Sheets, dialogs: <Code>xl · 28</Code>
          </span>
          <span>
            Chips: <Code>sm · 8</Code>
          </span>
          <span>
            FAB: <Code>lg · 16</Code> (large: <Code>xl · 28</Code>)
          </span>
          <span>
            Text fields: <Code>xs · 4</Code>
          </span>
        </div>
      </div>
    </section>
  )
}

/* ---------- Elevation ---------- */

const LEVELS = [
  ["0 · flat", "bg-surface"],
  ["1 · cards", "bg-surface-container-low shadow-1"],
  ["2 · menus", "bg-surface-container shadow-2"],
  ["3 · FAB, dialog", "bg-surface-container-high shadow-3"],
  ["4 · FAB hover", "bg-surface-container-high shadow-4"],
  ["5", "bg-surface-container-highest shadow-5"],
] as const

function ElevationSection() {
  return (
    <section id="elevation" className="mt-16 scroll-mt-32 space-y-4 md:scroll-mt-20 xl:scroll-mt-6">
      <SectionHeader title="Elevation">
        Levels 0–5 as <Code>shadow-1 … shadow-5</Code>. Tonal containers carry most hierarchy; shadows are reserved for things that float.
      </SectionHeader>
      <div className="grid grid-cols-2 gap-6 rounded-xl bg-surface-container-low p-6 sm:grid-cols-3 md:p-8 lg:grid-cols-6">
        {LEVELS.map(([label, cls]) => (
          <div key={label} className={cn("flex h-24 items-end rounded-md p-3 font-mono text-body-sm", cls)}>
            {label}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------- Motion & springs ---------- */

const SPRINGS: [name: string, token: SpringName, damping: string, stiffness: string][] = [
  ["spatial.fast", "fast-spatial", "0.6", "800"],
  ["spatial.default", "default-spatial", "0.8", "380"],
  ["spatial.slow", "slow-spatial", "0.8", "200"],
  ["effects.fast", "fast-effects", "1.0", "3800"],
  ["effects.default", "default-effects", "1.0", "1600"],
  ["effects.slow", "slow-effects", "1.0", "800"],
]

/** Settle durations, read from --md-spring-*-duration after mount. */
function useSpringDurations() {
  const [ms, setMs] = React.useState<Partial<Record<SpringName, number>>>({})
  React.useEffect(() => {
    setMs(Object.fromEntries(SPRINGS.map(([, token]) => [token, Math.round(springTiming(token).duration)])))
  }, [])
  return ms
}

const LANES: [label: string, timing: string, dot: string][] = [
  ["ease-emphasized", "duration-700 ease-emphasized", "bg-primary"],
  ["…-decelerate", "duration-700 ease-emphasized-decelerate", "bg-secondary"],
  ["…-accelerate", "duration-700 ease-emphasized-accelerate", "bg-on-surface-variant"],
  ["ease-fast-spatial", "duration-(--md-spring-fast-spatial-duration) ease-fast-spatial", "bg-tertiary"],
  ["ease-default-spatial", "duration-(--md-spring-default-spatial-duration) ease-default-spatial", "bg-primary-fixed-dim"],
]

function SpringsSection() {
  const ms = useSpringDurations()
  return (
    <section id="springs" className="mt-16 scroll-mt-32 space-y-4 md:scroll-mt-20 xl:scroll-mt-6">
      <SectionHeader title="Motion & springs">
        Two spring families from the M3 Expressive motion scheme. Spatial springs move things (position, size, shape); effects springs change things
        (color, opacity, icon fill) and never overshoot. In CSS they ship as <Code>linear()</Code> easings with a settle duration.
      </SectionHeader>
      <div className="grid gap-4">
        <div className="overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full min-w-[480px] text-left text-body-md">
            <thead className="bg-surface-container-low text-label-lg text-on-surface-variant">
              <tr>
                <th className="px-4 py-3 font-medium">Token</th>
                <th className="px-4 py-3 font-medium">Damping</th>
                <th className="px-4 py-3 font-medium">Stiffness</th>
                <th className="px-4 py-3 font-medium">CSS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant tabular-nums">
              {SPRINGS.map(([name, token, d, k]) => (
                <tr key={name}>
                  <td className="px-4 py-2.5 font-mono text-body-sm">{name}</td>
                  <td className="px-4 py-2.5">{d}</td>
                  <td className="px-4 py-2.5">{k}</td>
                  <td className="px-4 py-2.5 font-mono text-body-sm text-on-surface-variant">
                    ease-{token} · {ms[token] ?? "…"}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className="space-y-3 rounded-xl bg-surface-container-low p-6"
          data-spec="Easing lanes|Hover (or focus) to play. emphasized, -decelerate and -accelerate are the M3 cubic-beziers; fast-spatial and default-spatial are the Expressive springs compiled to linear() with their settle durations."
        >
          {LANES.map(([label, timing, dot]) => (
            <div
              key={label}
              tabIndex={0}
              className="group focus-ring grid grid-cols-[150px_1fr] items-center gap-4 rounded-full bg-surface-container px-5 py-2 sm:grid-cols-[170px_1fr]"
            >
              <span className="truncate font-mono text-body-sm">{label}</span>
              <div className="relative h-8">
                <div
                  className={cn(
                    "absolute top-1 left-0 size-6 rounded-full transition-all group-hover:left-[calc(100%-24px)] group-hover:rounded-md group-focus:left-[calc(100%-24px)] group-focus:rounded-md",
                    timing,
                    dot,
                  )}
                />
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1 font-mono text-body-sm text-on-surface-variant">
            <span>shape-morph</span>
            <span>duration-50 … 1000</span>
            <span>animate-indeterminate 1.8s</span>
            <span>animate-morph 2.4s</span>
            <span>animate-pop</span>
            <span>animate-fade-up</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Interactions ---------- */

function InteractionCard({ label, children, note }: { label: string; children: React.ReactNode; note: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface-container-low p-6">
      <div className="text-label-md tracking-wider text-on-surface-variant uppercase">{label}</div>
      <div className="mt-4">{children}</div>
      <p className="mt-3 text-body-sm text-on-surface-variant">{note}</p>
    </div>
  )
}

function PressDemo() {
  const a = React.useRef<HTMLButtonElement>(null)
  const b = React.useRef<HTMLButtonElement>(null)
  usePressScale(a)
  usePressScale(b)
  return (
    <div className="flex gap-3">
      <Button ref={a}>Press me</Button>
      <IconButton ref={b} variant="tonal" aria-label="Like">
        <Icon name="thumb_up" />
      </IconButton>
    </div>
  )
}

function MagneticTiltDemo() {
  const magnet = React.useRef<HTMLButtonElement>(null)
  const tilt = React.useRef<HTMLDivElement>(null)
  useMagnetic(magnet, { strength: 0.3 })
  useTilt(tilt, { max: 10 })
  return (
    <div className="flex items-center gap-4">
      <IconButton ref={magnet} variant="filled" size="md" shape="square" aria-label="Magnetic" className="shrink-0 shadow-3">
        <Icon name="near_me" />
      </IconButton>
      <div ref={tilt} className="min-w-0 flex-1 rounded-lg bg-surface-container-lowest p-3 shadow-2">
        <div className="text-title-sm">useTilt</div>
        <div className="text-body-sm text-on-surface-variant">10° max, springs back</div>
      </div>
    </div>
  )
}

function InteractionsSection() {
  return (
    <section id="interactions" className="mt-16 scroll-mt-32 space-y-4 md:scroll-mt-20 xl:scroll-mt-6">
      <SectionHeader title="Interactions">
        State layers, ripple, press and focus are shared by every interactive component. Hooks expose the extras.
      </SectionHeader>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InteractionCard label="State layer" note={<>currentColor at 8 / 10 / 12%, on the effects.fast spring.</>}>
          <div className="flex gap-2">
            <span className="grid h-12 flex-1 place-items-center rounded-md bg-primary/8 text-label-md text-primary">hover 8%</span>
            <span className="grid h-12 flex-1 place-items-center rounded-md bg-primary/10 text-label-md text-primary">focus 10%</span>
            <span className="grid h-12 flex-1 place-items-center rounded-md bg-primary/12 text-label-md text-primary">press 12%</span>
          </div>
        </InteractionCard>
        <InteractionCard
          label="Ripple & press"
          note={
            <>
              Ripple from the pointer at 14% (450ms grow, 350ms fade); <Code>usePressScale</Code> squishes to .92 and springs back.
            </>
          }
        >
          <PressDemo />
        </InteractionCard>
        <InteractionCard
          label="Focus ring"
          note={
            <>
              3dp <Code>secondary</Code> outline, 2dp offset, keyboard only (<Code>focus-ring</Code>).
            </>
          }
        >
          <div className="flex flex-wrap gap-3">
            <Button variant="outlined">Tab to me</Button>
            <Button variant="tonal">then me</Button>
          </div>
        </InteractionCard>
        <InteractionCard
          label="Magnetic & tilt"
          note={
            <>
              <Code>useMagnetic({"{ strength: .3 }"})</Code> follows the pointer and springs home.
            </>
          }
        >
          <MagneticTiltDemo />
        </InteractionCard>
      </div>
    </section>
  )
}

/* ---------- Icons ---------- */

const SIZES = [16, 20, 24, 28, 32, 40, 48]
const TOGGLE_ICONS = ["home", "favorite", "bookmark", "notifications", "star", "settings", "mail", "cloud", "bolt", "palette", "widgets", "person"]

function SymbolsSection() {
  return (
    <section id="symbols" className="mt-16 scroll-mt-32 space-y-4 md:scroll-mt-20 xl:scroll-mt-6">
      <SectionHeader title="Icons · Material Symbols Rounded">
        Variable font axes FILL, wght, GRAD and opsz are CSS custom properties, so fill and weight animate inside any transition. Sizes 16 to 48 set
        optical size automatically.
      </SectionHeader>
      <div className="grid gap-4 rounded-xl bg-surface-container-low p-6 md:grid-cols-[1fr_auto] md:p-8">
        <div className="flex flex-wrap items-end gap-6">
          {SIZES.map((s) => (
            <Icon key={s} name="favorite" size={s} />
          ))}
          <span className="mx-2 h-10 w-px bg-outline-variant" />
          <Icon name="favorite" size={40} filled className="text-primary" />
          <Icon name="favorite" size={40} weight={600} className="text-primary" />
          <Icon name="favorite" size={40} filled weight={600} className="text-primary" />
        </div>
        <div className="flex flex-wrap content-start gap-2 font-mono text-body-sm text-on-surface-variant md:max-w-sm md:justify-end">
          {['<Icon name size filled weight>', ".icon-16 … .icon-48", ".icon-fill", ".icon-bold", "--icon-fill: 0…1"].map((c) => (
            <span key={c} className="rounded-xs bg-surface-container-high px-2 py-1">
              {c}
            </span>
          ))}
        </div>
      </div>
      <div
        className="flex flex-wrap gap-3 rounded-xl bg-surface-container-low p-6 md:p-8"
        data-spec="Animated fill|Toggle any tile: FILL 0 → 1 and wght 400 → 600 interpolate because the axes are registered @property numbers; the corner morphs on spatial.fast."
      >
        {TOGGLE_ICONS.map((name) => (
          <ToggleIconButton
            key={name}
            variant="filled"
            size="md"
            width="narrow"
            aria-label={name}
            className="size-12 bg-surface-container-highest data-selected:[--icon-wght:600]"
          >
            <Icon name={name} />
          </ToggleIconButton>
        ))}
      </div>
    </section>
  )
}

/* ---------- Layout ---------- */

const WSC: { id: WindowSizeClass; name: string; width: string; prefix: string; nav: string; panes: string; docs: string }[] = [
  { id: "compact", name: "Compact", width: "< 600", prefix: "(base)", nav: "Navigation bar", panes: "1", docs: "Bottom bar + modal drawer" },
  { id: "medium", name: "Medium", width: "600 – 839", prefix: "md:", nav: "Navigation rail", panes: "1 (2 optional)", docs: "Rail + content" },
  { id: "expanded", name: "Expanded", width: "840 – 1199", prefix: "lg:", nav: "Navigation rail", panes: "2", docs: "Sidebar + content" },
  { id: "large", name: "Large", width: "1200 – 1599", prefix: "xl:", nav: "Expanded rail / drawer", panes: "2", docs: "Sidebar + content + TOC" },
  { id: "extra-large", name: "Extra-large", width: "≥ 1600", prefix: "2xl:", nav: "Expanded rail / drawer", panes: "2 – 3", docs: "Sidebar + content + TOC" },
]

function LayoutSection() {
  const current = useWindowSizeClass()
  const currentName = WSC.find((w) => w.id === current)?.name ?? current
  return (
    <section id="layout" className="mt-16 scroll-mt-32 space-y-4 md:scroll-mt-20 xl:scroll-mt-6">
      <SectionHeader title="Layout & window size classes">
        Breakpoints are the five M3 window size classes. Spacing stays on the 4dp grid; margins 16dp compact, 24dp otherwise. Right now:{" "}
        <span className="font-medium text-on-surface">{currentName}</span>.
      </SectionHeader>
      <div className="overflow-x-auto rounded-xl bg-surface-container-low">
        <table className="w-full min-w-[720px] text-left text-body-md">
          <thead className="text-label-lg text-on-surface-variant">
            <tr>
              {["Class", "Width", "Prefix", "Navigation", "Panes", "Docs layout"].map((h) => (
                <th key={h} className="px-6 py-4 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {WSC.map((w) => (
              <tr
                key={w.id}
                data-selected={w.id === current || undefined}
                className="transition-colors duration-300 data-selected:bg-secondary-container data-selected:text-on-secondary-container"
              >
                <td className="px-6 py-4 font-medium">{w.name}</td>
                <td className="px-6 py-4">{w.width}</td>
                <td className="px-6 py-4 font-mono text-body-sm">{w.prefix}</td>
                <td className="px-6 py-4">{w.nav}</td>
                <td className="px-6 py-4">{w.panes}</td>
                <td className="px-6 py-4">{w.docs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
