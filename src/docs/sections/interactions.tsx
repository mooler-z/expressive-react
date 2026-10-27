import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Reveal, RevealWords } from "@/components/ui/reveal"
import { Shape } from "@/components/ui/shape"
import { Section } from "@/docs/section"
import { useMagnetic } from "@/hooks/use-magnetic"
import { usePressScale } from "@/hooks/use-press-scale"
import { useTilt } from "@/hooks/use-tilt"

function Card({ label, code, note, children }: { label: string; code: string; note: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-surface p-6">
      <div className="text-label-md tracking-wider text-on-surface-variant uppercase">
        {label} · <code className="font-mono normal-case">{code}</code>
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-center gap-3 py-2">{children}</div>
      <p className="text-body-sm text-on-surface-variant">{note}</p>
    </div>
  )
}

// The hooks take a ref to any element; here they wrap the button so the button keeps its own ref-less API.
function PressDemo() {
  const a = React.useRef<HTMLSpanElement>(null)
  const b = React.useRef<HTMLSpanElement>(null)
  usePressScale(a)
  usePressScale(b)
  return (
    <>
      <span ref={a} className="inline-flex">
        <Button size="md" variant="tonal" shape="square" className="bg-tertiary-container text-on-tertiary-container">
          <Icon>bolt</Icon>
          Squish
        </Button>
      </span>
      <span ref={b} className="inline-flex">
        <IconButton size="md" variant="tonal" aria-label="Like" className="bg-primary-container text-on-primary-container">
          <Icon>thumb_up</Icon>
        </IconButton>
      </span>
    </>
  )
}

function MagneticDemo() {
  const ref = React.useRef<HTMLSpanElement>(null)
  useMagnetic(ref, { strength: 0.3 })
  return (
    <span ref={ref} className="inline-flex">
      <IconButton size="lg" variant="filled" shape="square" aria-label="Navigate" className="shadow-3">
        <Icon size={36}>near_me</Icon>
      </IconButton>
    </span>
  )
}

function TiltDemo() {
  const ref = React.useRef<HTMLDivElement>(null)
  useTilt(ref, { max: 10 })
  return (
    <div ref={ref} className="w-full max-w-[220px] rounded-lg bg-surface-container-lowest p-4 shadow-2">
      <div className="flex items-center gap-3">
        <Shape shape="cookie7" className="size-10 text-primary" />
        <div>
          <div className="text-title-sm">Kestrel Grid</div>
          <div className="text-body-sm text-on-surface-variant">Hover to tilt</div>
        </div>
      </div>
      <div className="mt-4 flex h-1 items-center gap-1">
        <div className="h-full w-[65%] rounded-full bg-primary" />
        <div className="h-full flex-1 rounded-full bg-secondary-container" />
      </div>
    </div>
  )
}

function RevealDemo() {
  const [run, setRun] = React.useState(0)
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <RevealWords key={run} as="div" className="text-headline-md font-semibold">
        Run everything. <span className="text-primary">Sweat</span> <span className="text-primary">nothing.</span>
      </RevealWords>
      <Button size="xs" variant="outlined" onPress={() => setRun((r) => r + 1)}>
        <Icon>replay</Icon>
        Replay
      </Button>
    </div>
  )
}

export default function InteractionsSection() {
  return (
    <Section
      id="interactions"
      description="Micro-interactions ported from m3/interactions.js as hooks and components, without GSAP. They use the Web Animations API with the M3 spring tokens, compose on one element (scale · translate · transform), and honor prefers-reduced-motion."
      spec="https://m3.material.io/foundations/interaction/states/overview"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card label="Ripple" code="<Ripple />" note="Built into Button and IconButton: spawns at the pointer, fades on release.">
          <Button size="md">Press me</Button>
          <IconButton size="md" variant="tonal" aria-label="Favorite">
            <Icon>favorite</Icon>
          </IconButton>
        </Card>
        <Card label="Elastic press" code="usePressScale(ref)" note="Squishes to 92% fast, then springs back on the FastSpatial spring.">
          <PressDemo />
        </Card>
        <Card label="Magnetic" code="useMagnetic(ref)" note="Follows the pointer inside its bounds and springs home on leave.">
          <MagneticDemo />
        </Card>
        <Card label="Tilt" code="useTilt(ref)" note="Perspective tilt toward the pointer, spring reset.">
          <TiltDemo />
        </Card>
        <Card label="Staggered words" code="<RevealWords>" note="Headline words rise and fade in one after another.">
          <RevealDemo />
        </Card>
        <Card label="Scroll reveal" code="<Reveal>" note="Below-the-fold content fades up 28px as it enters the viewport.">
          <Reveal className="w-full rounded-lg bg-secondary-container p-4 text-body-md text-on-secondary-container">
            Wrap any block in &lt;Reveal&gt;. Content that's already on screen stays still.
          </Reveal>
        </Card>
        <div className="rounded-xl bg-surface p-6 md:col-span-2">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Reference behaviors → React</div>
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-body-sm text-on-surface-variant sm:grid-cols-2">
            {[
              ["data-toggle / data-open / data-close", "DialogTrigger, MenuTrigger, Popover"],
              ["data-select-group / data-select-item", "ToggleButtonGroup, Tabs, RadioGroup, ListBox"],
              ["data-snackbar / data-toast", "Toast queue"],
              ["data-reveal · data-word", "<Reveal> · <RevealWords>"],
              ["active:rounded-*", "shape-morph + data-pressed:rounded-*"],
              ["peer-checked:*", "data-selected:* on React Aria components"],
            ].map(([from, to]) => (
              <li key={from}>
                <code className="font-mono">{from}</code> → {to}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
