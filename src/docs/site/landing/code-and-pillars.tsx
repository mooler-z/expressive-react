import * as React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CopyButton } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { Kbd } from "@/components/ui/kbd"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { WINDOW_SIZE_CLASSES, windowSizeClass, type WindowSizeClass } from "@/hooks/use-window-size-class"
import { cn } from "@/lib/utils"
import { Check, InlineCode, LinkButton, Panel, SectionTitle } from "@/docs/site/landing/shared"

const REGISTRY_ENTRY = `"registries": { "@expressive": "https://expressive-react.moolerz.et/r/{name}.json" }`

/** "The shadcn model": copy-in source, registry config, terminal transcript. */
export function YourCode() {
  return (
    <Reveal>
      <section
        data-screen-label="Your code"
        className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24"
      >
        <div className="min-w-0">
          <SectionTitle>Your code, not a dependency.</SectionTitle>
          <p className="mt-4 max-w-prose text-body-lg text-pretty text-on-surface-variant">
            One command drops <code className="rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono text-body-md">button.tsx</code> into your
            project. It's yours now: rename it, restyle it, rip out what you don't need. There's nothing to upgrade and no version to pin.
          </p>
          <ul className="mt-6 space-y-3 text-body-md text-on-surface-variant">
            <Check>
              Add <InlineCode>"@expressive"</InlineCode> to <InlineCode>registries</InlineCode> in components.json once
            </Check>
            <Check>
              Start with <InlineCode>@expressive/init</InlineCode>: theme CSS, motion tokens and the icon font
            </Check>
            <Check>180 installable items: 73 components, 97 blocks, 7 hooks, 3 utilities</Check>
          </ul>
          <LinkButton href="/docs/registry" variant="tonal" className="mt-6" trailingIcon={<Icon name="arrow_forward" size={20} />}>
            Registry docs
          </LinkButton>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
            <div className="flex h-12 items-center gap-2 border-b border-outline-variant pr-2 pl-4">
              <Icon name="data_object" size={18} className="text-on-surface-variant" />
              <span className="flex-1 font-mono text-body-sm text-on-surface-variant">components.json</span>
              <CopyButton value={REGISTRY_ENTRY} aria-label="Copy registry entry" onCopied={() => snackbar("Copied registry entry")} className="text-on-surface-variant" />
            </div>
            <pre className="overflow-x-auto p-4 font-mono text-body-sm leading-6 text-on-surface">
              <code>
                {"{\n  "}
                <span className="text-primary">"registries"</span>
                {": {\n    "}
                <span className="text-primary">"@expressive"</span>
                {": "}
                <span className="text-tertiary">"https://expressive-react.moolerz.et/r/{"{name}"}.json"</span>
                {"\n  }\n}"}
              </code>
            </pre>
          </div>
          <div className="overflow-hidden rounded-lg bg-inverse-surface text-inverse-on-surface">
            <div className="flex h-12 items-center gap-2 pr-2 pl-4 text-inverse-on-surface/70">
              <Icon name="terminal" size={18} />
              <span className="flex-1 font-mono text-body-sm">zsh</span>
              <CopyButton
                value="npx shadcn add @expressive/button"
                aria-label="Copy command"
                onCopied={() => snackbar("Copied command")}
                className="text-inverse-on-surface"
              />
            </div>
            <pre className="overflow-x-auto px-4 pb-5 font-mono text-body-sm leading-6">
              <code>
                <span className="text-inverse-primary">$</span> npx shadcn add @expressive/button{"\n"}
                <span className="text-inverse-primary">✔</span> Checking registry.{"\n"}
                <span className="text-inverse-primary">✔</span> Installing dependencies: react-aria-components, tailwind-variants{"\n"}
                <span className="text-inverse-primary">✔</span> Created 4 files:{"\n"}
                {"    components/ui/button.tsx\n    components/ui/ripple.tsx\n    components/ui/loading-indicator.tsx\n    components/ui/shape.tsx"}
              </code>
            </pre>
          </div>
        </div>
      </section>
    </Reveal>
  )
}

/** Three pillars: accessibility, Tailwind v4, adaptive layouts. */
export function Pillars() {
  return (
    <Reveal>
      <section data-screen-label="Three pillars" className="mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:pb-24">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Pillar
            icon="accessibility_new"
            tone="bg-primary-container text-on-primary-container"
            title="Accessible by default"
            description="Focus, keyboard, ARIA, touch and screen-reader behaviour come from React Aria Components. We only dress them up."
          >
            <div
              className="mt-5 flex flex-wrap items-center gap-3 rounded-lg bg-surface p-4 text-on-surface"
              data-spec="Focus ring|Keyboard focus draws a 3dp secondary outline, 2dp offset, on every control. Tab through these to see it."
            >
              <Button>Tab</Button>
              <Checkbox defaultSelected className="text-body-md">
                through
              </Checkbox>
              <Switch className="gap-2 text-body-md">these</Switch>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-body-sm">
              {[
                ["Tab", "focus"],
                ["Space", "press"],
                ["Esc", "dismiss"],
              ].map(([k, label]) => (
                <span key={k} className="inline-flex items-center gap-1">
                  <Kbd size="sm">{k}</Kbd> {label}
                </span>
              ))}
            </div>
          </Pillar>

          <Pillar
            icon="css"
            tone="bg-tertiary-container text-on-tertiary-container"
            title="Built for Tailwind v4"
            description={
              <>
                Every color role, radius and spring is a CSS variable under <InlineCode>@theme</InlineCode>. Variants come from tailwind-variants, not a
                runtime.
              </>
            }
          >
            <pre className="mt-5 flex-1 overflow-x-auto rounded-lg bg-surface p-4 font-mono text-body-sm leading-6 text-on-surface">
              <code>
                <span className="text-tertiary">const</span> button = <span className="text-primary">tv</span>
                {"({\n  base: "}
                <span className="text-on-primary-container">"state-layer rounded-full"</span>
                {",\n  variants: {\n    variant: { filled: "}
                <span className="text-on-primary-container">"bg-primary text-on-primary"</span>
                {" },\n    size: { md: "}
                <span className="text-on-primary-container">"h-14 px-6 text-title-md"</span>
                {" }\n  }\n})"}
              </code>
            </pre>
          </Pillar>

          <Pillar
            icon="devices"
            tone="bg-secondary-container text-on-secondary-container"
            title="Adaptive layouts"
            description="M3 window size classes are the breakpoints. Navigation bar when compact, rail when medium, expanded rail or drawer when large."
          >
            <WindowClassCard />
          </Pillar>
        </div>
      </section>
    </Reveal>
  )
}

function Pillar({
  icon,
  tone,
  title,
  description,
  children,
}: {
  icon: string
  tone: string
  title: string
  description: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Panel className="flex min-w-0 flex-col p-6">
      <span className={cn("grid size-12 place-items-center rounded-lg", tone)}>
        <Icon name={icon} />
      </span>
      <h3 className="mt-5 text-title-lg">{title}</h3>
      <p className="mt-2 text-body-md text-on-surface-variant">{description}</p>
      <div className="flex flex-1 flex-col text-on-surface-variant">{children}</div>
    </Panel>
  )
}

const WSC_ROWS: { id: WindowSizeClass; icon: string; label: string; nav: string }[] = [
  { id: "compact", icon: "smartphone", label: "Compact", nav: "Navigation bar" },
  { id: "medium", icon: "tablet", label: "Medium", nav: "Rail" },
  { id: "expanded", icon: "laptop", label: "Expanded", nav: "Rail + 2 panes" },
  { id: "large", icon: "desktop_windows", label: "Large", nav: "Expanded rail" },
  { id: "extra-large", icon: "tv", label: "Extra-large", nav: "Drawer · 3 panes" },
]

/** Live window size class: re-highlights as the window resizes. */
function WindowClassCard() {
  const [width, setWidth] = React.useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth))
  React.useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])
  const current = windowSizeClass(width)
  const label = WSC_ROWS.find((r) => r.id === current)?.label
  const min = WINDOW_SIZE_CLASSES.find((c) => c.name === current)?.min ?? 0

  return (
    <div
      className="mt-5 rounded-lg bg-surface p-4"
      data-spec="Window size class|useWindowSizeClass() reads the live width; this card re-highlights as you resize. Compact <600 · Medium 600 · Expanded 840 · Large 1200 · Extra-large 1600."
    >
      <div className="flex items-center justify-between text-label-md text-on-surface-variant">
        <span>Right now</span>
        <span className="text-title-sm text-on-surface tabular-nums" title={`${label} starts at ${min}px`}>
          {label} · {width}px
        </span>
      </div>
      <div className="mt-3 space-y-1 text-label-lg">
        {WSC_ROWS.map((r) => (
          <div
            key={r.id}
            data-selected={r.id === current || undefined}
            className="flex h-9 items-center gap-3 rounded-full px-3 text-on-surface-variant transition-colors duration-300 data-selected:bg-secondary-container data-selected:text-on-secondary-container"
          >
            <Icon name={r.icon} size={20} />
            {r.label}
            <span className="ml-auto text-label-md">{r.nav}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
