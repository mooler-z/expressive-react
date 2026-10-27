import * as React from "react"
import { ToggleButton, ToggleButtonGroup } from "react-aria-components"

import { Shape, shapeNames, type ShapeName } from "@/components/ui/shape"
import { Section } from "@/docs/section"
import { useTilt } from "@/hooks/use-tilt"

const SCALE = [
  ["rounded-none", "none"],
  ["rounded-xs", "xs · 4"],
  ["rounded-sm", "sm · 8"],
  ["rounded-md", "md · 12"],
  ["rounded-lg", "lg · 16"],
  ["rounded-lg-plus", "lg-plus · 20"],
  ["rounded-xl", "xl · 28"],
  ["rounded-xl-plus", "xl-plus · 32"],
  ["rounded-2xl", "2xl · 48"],
  ["rounded-full", "full"],
] as const

const COLORS = ["text-primary", "text-secondary", "text-tertiary", "text-primary-container"]

export default function ShapeSection() {
  const [picked, setPicked] = React.useState<ShapeName>("cookie9")
  const tiltRef = React.useRef<HTMLDivElement>(null)
  useTilt(tiltRef, { max: 10 })

  return (
    <Section
      id="shape"
      description="Expressive shape scale as rounded-*. Round ⇄ square morphs on press come from the shape-morph utility (FastSpatial spring). Below it, the M3 Expressive shape library: every shape is a 120-point polygon, so any two morph via CSS clip-path."
      spec="https://m3.material.io/styles/shape/overview"
    >
      <div className="grid grid-cols-3 gap-4 text-center font-mono text-body-sm text-on-surface-variant sm:grid-cols-5 lg:grid-cols-10">
        {SCALE.map(([cls, label]) => (
          <div key={cls}>
            <div className={`mx-auto size-16 bg-primary-container ${cls}`} />
            <div className="mt-2">{label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <span className="text-label-lg text-on-surface-variant">Expressive shapes</span>
        <div className="size-16 rounded-full bg-primary" />
        <div className="h-16 w-24 rounded-full bg-secondary-container" />
        <div className="size-16 rounded-[50%_50%_8px_8px] bg-tertiary-container" />
        <div className="size-16 rounded-[8px_50%_50%_50%] bg-primary-container" />
        <div className="size-16 rotate-45 rounded-lg bg-secondary" />
        <div className="size-16 bg-tertiary [clip-path:polygon(50%_0,100%_38%,82%_100%,18%_100%,0_38%)]" />
        <div className="size-16 bg-primary-fixed-dim [clip-path:polygon(50%_0,61%_35%,98%_35%,68%_57%,79%_91%,50%_70%,21%_91%,32%_57%,2%_35%,39%_35%)]" />
        <div className="size-16 rounded-[50%_50%_50%_8px] bg-error-container" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="flex items-center justify-center">
          <div ref={tiltRef} className="w-full max-w-64">
            <Shape shape={picked} morphDuration={900} className="w-full text-primary drop-shadow-sm" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-title-md">Shape morphing playground</div>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Pick a shape and the big one morphs into it with the spring curve. Hover the big shape to tilt it (useTilt).
            </p>
          </div>
          <ToggleButtonGroup
            aria-label="Shape"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[picked]}
            onSelectionChange={(keys) => setPicked([...keys][0] as ShapeName)}
            className="flex flex-wrap gap-2"
          >
            {shapeNames.map((name) => (
              <ToggleButton
                key={name}
                id={name}
                className="state-layer focus-ring inline-flex h-8 cursor-pointer items-center gap-2 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container"
              >
                <Shape shape={name} className="size-4" />
                {name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-body-sm text-on-surface-variant">
            <span>Props:</span>
            {["shape", "cycle", "interval", "hoverShape", "morphDuration"].map((p) => (
              <code key={p} className="rounded-xs bg-surface-container-high px-1.5 py-0.5 font-mono">
                {p}
              </code>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
        {shapeNames.map((name, i) => (
          <figure key={name} className="flex flex-col items-center gap-2">
            <Shape shape={name} hoverShape={i % 2 ? "sunny" : "cookie12"} className={`${COLORS[i % 4]} w-full max-w-20`} />
            <figcaption className="text-label-sm text-on-surface-variant">{name}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}
