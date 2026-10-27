import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Slider } from "@/components/ui/slider"
import { Section, Variant, Variants } from "@/docs/section"

const HISTOGRAM = [20, 35, 55, 40, 70, 90, 100, 80, 65, 75, 50, 45, 30, 20, 12, 8]

function Labelled({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className ?? "space-y-3"}>
      <div className="text-label-md tracking-wider text-on-surface-variant uppercase">{label}</div>
      {children}
    </div>
  )
}

export default function SlidersSection() {
  const [live, setLive] = React.useState(64)
  const [zoom, setZoom] = React.useState(50)
  const [range, setRange] = React.useState([25, 75])
  const [opacity, setOpacity] = React.useState(25)
  const [canary, setCanary] = React.useState(25)
  return (
    <Section
      id="sliders"
      description="Expressive slider: thick inset track (XS 16 · S 24 · M 40 · L 56 · XL 96), a 4dp handle that narrows on press with 6dp gaps, stop indicators and a value label. Continuous, discrete, range and centered."
      spec="https://m3.material.io/components/sliders/overview"
    >
      <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
        <Labelled label="Continuous · XS">
          <Slider aria-label="Continuous" defaultValue={55} />
        </Labelled>
        <Labelled label="With value label">
          <Slider aria-label="With value label" defaultValue={30} valueIndicator="always" className="pt-12" />
        </Labelled>
        <Labelled label="Discrete · ticks">
          <Slider aria-label="Discrete" defaultValue={60} step={20} />
        </Labelled>
        <Labelled label="Range">
          <Slider aria-label="Range" defaultValue={[20, 60]} />
        </Labelled>
        <Labelled label="Centered">
          <Slider aria-label="Balance" defaultValue={20} minValue={-50} maxValue={50} centered />
        </Labelled>
        <Labelled label="Sizes · S · M · L · XL">
          <div className="space-y-3">
            <Slider aria-label="Small" size="sm" defaultValue={45} />
            <Slider aria-label="Medium" size="md" defaultValue={65} />
            <Slider aria-label="Large" size="lg" defaultValue={35} />
            <Slider aria-label="Extra large" size="xl" defaultValue={50} />
          </div>
        </Labelled>
        <Labelled label="Live value · drag" className="space-y-3 md:col-span-2">
          <div className="flex max-w-md items-center gap-4">
            <Slider aria-label="Live value" value={live} onChange={(v) => setLive(v as number)} className="flex-1" />
            <span className="w-12 text-right text-title-md tabular-nums">{live}%</span>
          </div>
        </Labelled>
      </div>

      <Variants>
        <Variant n={1} label="Tertiary" className="flex min-h-24 items-center rounded-lg bg-surface p-4">
          <Slider aria-label="Tertiary" color="tertiary" defaultValue={40} />
        </Variant>
        <Variant n={2} label="Error · over limit" className="flex min-h-24 flex-col justify-center gap-1 rounded-lg bg-surface p-4">
          <Slider aria-label="Quota" color="error" defaultValue={88} />
          <div className="flex items-center gap-1 text-body-sm text-error">
            <Icon size={16} filled>
              error
            </Icon>
            Above the 80% quota
          </div>
        </Variant>
        <Variant n={3} label="Disabled" className="flex min-h-24 items-center rounded-lg bg-surface p-4">
          <Slider aria-label="Disabled" defaultValue={30} isDisabled />
        </Variant>
        <Variant n={4} label="Icon in track · M" className="flex min-h-24 items-center rounded-lg bg-surface p-4">
          <Slider aria-label="Volume" size="md" defaultValue={60} icon={<Icon>volume_up</Icon>} />
        </Variant>
        <Variant n={5} label="Min · max labels" className="flex min-h-24 flex-col justify-center gap-1 rounded-lg bg-surface p-4">
          <Slider label="Brightness" showOutput defaultValue={64} />
          <div className="flex justify-between text-label-md text-on-surface-variant tabular-nums">
            <span>0</span>
            <span>100</span>
          </div>
        </Variant>
        <Variant n={6} label="With field" className="flex min-h-24 items-center gap-4 rounded-lg bg-surface p-4">
          <Slider aria-label="Opacity" value={opacity} onChange={(v) => setOpacity(v as number)} className="flex-1" />
          <span className="inline-flex h-10 w-16 shrink-0 items-center justify-end gap-0.5 rounded-xs border border-outline px-2 text-body-lg tabular-nums">
            {opacity}
            <span className="text-on-surface-variant">%</span>
          </span>
        </Variant>
        <Variant n={7} label="Vertical · equalizer">
          <div className="flex h-40 items-end gap-2">
            {[70, 45, 85, 30].map((v, i) => (
              <Slider key={i} aria-label={`Band ${i + 1}`} orientation="vertical" defaultValue={v} className="h-full" />
            ))}
          </div>
        </Variant>
        <Variant n={8} label="Discrete · step labels" className="flex min-h-24 flex-col justify-center gap-1 rounded-lg bg-surface p-4">
          <Slider aria-label="Step" defaultValue={50} step={25} />
          <div className="flex justify-between px-1 text-label-md text-on-surface-variant tabular-nums">
            {[0, 25, 50, 75, 100].map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>
        </Variant>
        <Variant n={9} label="Range · histogram" className="flex min-h-24 flex-col justify-center rounded-lg bg-surface p-4">
          <div className="flex h-12 items-end gap-0.5 px-2">
            {HISTOGRAM.map((h, i) => {
              const inRange = (i / HISTOGRAM.length) * 100 >= range[0] && (i / HISTOGRAM.length) * 100 < range[1]
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-t-xs transition-colors ${inRange ? "bg-primary" : "bg-outline-variant"}`}
                  style={{ height: `${h}%` }}
                />
              )
            })}
          </div>
          <Slider aria-label="Price range" value={range} onChange={(v) => setRange(v as number[])} />
        </Variant>
        <Variant n={10} label="Media scrubber" className="flex min-h-24 flex-col justify-center gap-1 rounded-lg bg-surface p-4">
          <Slider aria-label="Position" defaultValue={36} valueIndicator="never" />
          <div className="flex justify-between text-label-md text-on-surface-variant tabular-nums">
            <span>1:24</span>
            <span>3:58</span>
          </div>
        </Variant>
        <Variant n={11} label="Zoom · ± buttons" className="flex min-h-24 items-center gap-2 rounded-lg bg-surface p-4">
          <IconButton aria-label="Zoom out" onPress={() => setZoom((z) => Math.max(0, z - 10))}>
            <Icon>zoom_out</Icon>
          </IconButton>
          <Slider aria-label="Zoom" value={zoom} onChange={(v) => setZoom(v as number)} step={10} className="flex-1" />
          <IconButton aria-label="Zoom in" onPress={() => setZoom((z) => Math.min(100, z + 10))}>
            <Icon>zoom_in</Icon>
          </IconButton>
        </Variant>
        <Variant n={12} label="Settings row" className="flex min-h-24 items-center rounded-lg bg-surface p-4">
          <div className="flex w-full items-center gap-4">
            <span className="text-body-lg">Canary</span>
            <Slider aria-label="Canary" value={canary} onChange={(v) => setCanary(v as number)} className="flex-1" />
            <span className="w-10 text-right text-title-sm tabular-nums">{canary}%</span>
          </div>
        </Variant>
        <Variant n={13} label="On inverse surface" className="flex min-h-24 items-center rounded-lg bg-inverse-surface p-4">
          <Slider
            aria-label="On inverse"
            defaultValue={55}
            className="[--slider-active:var(--md-inverse-primary)] [--slider-inactive:color-mix(in_srgb,var(--md-inverse-on-surface)_20%,transparent)]"
          />
        </Variant>
        <Variant n={14} label="Units · formatOptions" className="flex min-h-24 items-center rounded-lg bg-surface p-4 pt-14">
          <Slider
            aria-label="Storage"
            defaultValue={128}
            maxValue={512}
            step={16}
            showStops={false}
            valueIndicator="always"
            formatOptions={{ style: "unit", unit: "gigabyte" }}
          />
        </Variant>
      </Variants>
    </Section>
  )
}
