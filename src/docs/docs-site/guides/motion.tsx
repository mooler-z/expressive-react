import * as React from "react"

import { Bullets, H2, Prose, Strong } from "@/docs/docs-site/guide"
import { CodePanel, DocTable, InlineCode, TextLink } from "@/docs/docs-site/primitives"
import { cn } from "@/lib/utils"

export const lead = "M3 Expressive moves on springs. We compile them to CSS linear() curves, so there's no animation runtime to ship."

const SPRINGS = [
  ["fast-spatial", "0.6 / 800", "374ms", "Press shapes, toggles, switch handles, indicators"],
  ["default-spatial", "0.8 / 380", "414ms", "Larger moves: sheets, rails expanding, carousels"],
  ["slow-spatial", "0.8 / 200", "567ms", "Full-screen and page-level movement"],
  ["fast-effects", "1.0 / 3800", "154ms", "State layers, small opacity changes"],
  ["default-effects", "1.0 / 1600", "223ms", "Color and elevation changes"],
  ["slow-effects", "1.0 / 800", "301ms", "Large fades, theme switches"],
] as const

const css = `/* Corners on FastSpatial, colors on DefaultEffects, in one utility */
<button className="shape-morph rounded-full data-pressed:rounded-[12px]">…</button>

/* Any property, any spring */
<div className="transition-transform duration-(--md-spring-default-spatial-duration) ease-default-spatial">…</div>`

const js = `import { springTiming, useReducedMotion } from "@/hooks/use-motion"

const reduce = useReducedMotion()
const { easing, duration } = springTiming("fast-spatial")
el.animate([{ scale: 0.92 }, { scale: 1 }], { easing, duration: reduce ? 0 : duration })`

function SpringDemo({ name, label }: { name: string; label: string }) {
  const [on, setOn] = React.useState(false)
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="state-layer focus-ring flex w-full cursor-pointer items-center gap-3 rounded-lg bg-surface-container-low p-3 text-left text-label-lg text-on-surface"
    >
      <span className="w-32 shrink-0 font-mono text-body-sm">{label}</span>
      <span className="relative h-8 min-w-0 flex-1 rounded-full bg-surface-container-highest">
        <span
          className={cn("absolute top-1 left-1 size-6 rounded-full bg-primary", on && "left-[calc(100%-1.75rem)]")}
          style={{ transition: `left var(--md-spring-${name}-duration) var(--md-spring-${name})` }}
        />
      </span>
    </button>
  )
}

export default function Motion() {
  return (
    <Prose>
      <p>
        Google's Compose implementation defines six springs: three <Strong>spatial</Strong> ones that move things (they may overshoot) and three{" "}
        <Strong>effects</Strong> ones that change things (critically damped). <InlineCode>expressive.css</InlineCode> simulates each and stores it as a{" "}
        <InlineCode>linear()</InlineCode> easing plus the time it takes to settle.
      </p>
      <DocTable
        columns={["Spring", "Damping / stiffness", "Settles in", "Used for"]}
        cellClassName={["font-mono text-body-sm text-primary", "tabular-nums", "tabular-nums", "text-on-surface-variant"]}
        rows={SPRINGS.map((s) => [...s])}
      />
      <p className="text-body-md">Tap a row to send it across.</p>
      <div className="space-y-2">
        {SPRINGS.map(([name]) => (
          <SpringDemo key={name} name={name} label={name} />
        ))}
      </div>

      <H2>In CSS</H2>
      <p>
        Each spring is <InlineCode>--md-spring-&lt;name&gt;</InlineCode> plus <InlineCode>--md-spring-&lt;name&gt;-duration</InlineCode>, and a Tailwind easing{" "}
        <InlineCode>ease-&lt;name&gt;</InlineCode>. Pair the easing with its duration; a spring curve squeezed into a different duration isn't that spring anymore.
      </p>
      <CodePanel code={css} />

      <H2>In JavaScript</H2>
      <p>
        For the Web Animations API, <TextLink to="/docs/use-motion">useMotion</TextLink> reads the same tokens.
      </p>
      <CodePanel code={js} />

      <H2>Reduced motion</H2>
      <Bullets>
        <li>The interaction hooks (press scale, magnetic, tilt) and Reveal skip their animation when the user asks for reduced motion.</li>
        <li>Loading indicators keep turning, slower, so loading still reads as loading; decorative travel such as the wavy progress wave stops.</li>
        <li>Shape morphs and color changes stay: they're feedback, not decoration, and they're short.</li>
      </Bullets>
    </Prose>
  )
}
