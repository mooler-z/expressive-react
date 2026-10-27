import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import {
  ClusterMarker,
  CoachMark,
  MapPin,
  Marker,
  MarkerDot,
  MarkerLabel,
  MarkerLegend,
  NumberMarker,
  StatusPin,
} from "@/components/ui/marker"
import { Section, Variant, Variants } from "@/docs/section"

const REGIONS = {
  fra: { name: "Frankfurt · eu-central-1", stats: "12 nodes · 99.99% uptime · 41 ms p95", tone: "bg-primary-container text-on-primary-container" },
  tyo: { name: "Tokyo · ap-northeast-1", stats: "8 nodes · 99.97% uptime · 58 ms p95", tone: "bg-tertiary-container text-on-tertiary-container" },
}

const TOUR = ["Name your workspace", "Connect a cloud account", "Invite your team"]

const dotted = "relative h-56 w-full overflow-hidden rounded-md bg-surface-container-high bg-[radial-gradient(var(--md-outline-variant)_1px,transparent_1px)] bg-size-[16px_16px]"

export default function MarkerSection() {
  const [region, setRegion] = React.useState<keyof typeof REGIONS | null>(null)
  const [step, setStep] = React.useState<number | null>(null)
  const r = region && REGIONS[region]
  return (
    <Section id="marker" description="Map pins with label pills, plus numbered annotation markers for diagrams and onboarding tours.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative h-72 overflow-hidden rounded-lg bg-surface-container-high">
          <div className="absolute inset-x-0 top-1/3 h-3 -rotate-6 bg-surface-container-highest" />
          <div className="absolute inset-y-0 left-1/3 w-3 rotate-12 bg-surface-container-highest" />
          <div className="absolute inset-x-0 bottom-1/4 h-2 rotate-3 bg-surface-container-highest" />
          <Marker x={30} y={42} anchor="bottom">
            <MapPin label="Frankfurt · 12 nodes" onPress={() => setRegion(region === "fra" ? null : "fra")} />
          </Marker>
          <Marker x={68} y={62} anchor="bottom">
            <MapPin label="Tokyo · 8 nodes" tone="tertiary" onPress={() => setRegion(region === "tyo" ? null : "tyo")} />
          </Marker>
          <Marker x={52} y={30}>
            <MarkerDot />
          </Marker>
          {r && (
            <div className="absolute right-3 bottom-3 left-3 animate-[m3-fade-up_300ms_var(--md-easing-emphasized-decelerate)] rounded-md bg-surface-container-lowest p-3 shadow-3 sm:right-auto sm:w-64">
              <div className="flex items-start gap-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-full ${r.tone}`}>
                  <Icon>dns</Icon>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-title-sm">{r.name}</div>
                  <div className="text-body-sm text-on-surface-variant">{r.stats}</div>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Button variant="text" onPress={() => setRegion(null)}>
                  Open region
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="relative grid h-72 place-items-center overflow-hidden rounded-lg bg-surface">
          <div className="w-4/5 rounded-md border border-outline-variant p-4">
            <div className="h-3 w-1/2 rounded-xs bg-surface-container-highest" />
            <div className="mt-3 h-24 rounded-sm bg-surface-container" />
            <div className="mt-3 flex justify-end gap-2">
              <div className="h-8 w-16 rounded-full bg-surface-container-highest" />
              <div className="h-8 w-16 rounded-full bg-primary-container" />
            </div>
          </div>
          {[
            [8, 18],
            [50, 44],
            [88, 72],
          ].map(([x, y], i) => (
            <Marker key={i} x={x} y={y}>
              <NumberMarker delay={i * 150} aria-label={`Tour step ${i + 1}: ${TOUR[i]}`} onPress={() => setStep(i)}>
                {i + 1}
              </NumberMarker>
            </Marker>
          ))}
          {step !== null && (
            <MarkerLabel className="absolute top-3 left-1/2 h-8 -translate-x-1/2 px-3">
              Step {step + 1} of 3 · {TOUR[step]}
            </MarkerLabel>
          )}
        </div>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Clusters · by density" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className={dotted}>
            <Marker x={30} y={38}>
              <ClusterMarker count={128} />
            </Marker>
            <Marker x={68} y={30}>
              <ClusterMarker count={42} />
            </Marker>
            <Marker x={58} y={70}>
              <ClusterMarker count={7} />
            </Marker>
            <Marker x={84} y={62}>
              <span className="block size-3 rounded-full bg-primary ring-2 ring-surface" />
            </Marker>
            <Marker x={16} y={76}>
              <span className="block size-3 rounded-full bg-primary ring-2 ring-surface" />
            </Marker>
          </div>
        </Variant>

        <Variant n={2} label="Status pins · legend" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className={dotted}>
            <Marker x={24} y={34}>
              <StatusPin status="ok" />
            </Marker>
            <Marker x={46} y={58}>
              <StatusPin status="ok" />
            </Marker>
            <Marker x={70} y={28}>
              <StatusPin status="warning" />
            </Marker>
            <Marker x={80} y={62}>
              <StatusPin status="error" />
            </Marker>
            <MarkerLegend
              className="absolute bottom-2 left-2"
              items={[
                { label: "Healthy 9", tone: "primary" },
                { label: "Degraded 2", tone: "tertiary" },
                { label: "Down 1", tone: "error" },
              ]}
            />
          </div>
        </Variant>

        <Variant n={3} label="Live location · pulse" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className={dotted}>
            <Marker x={50} y={46}>
              <MarkerDot pulse halo={112} />
            </Marker>
            <Marker x={50} y={78}>
              <MarkerLabel>You · ±40 m</MarkerLabel>
            </Marker>
          </div>
        </Variant>

        <Variant n={4} label="Coach mark · step 2 of 4" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
          <div className="relative w-full pb-36">
            <div className="flex h-14 items-center gap-1 rounded-md bg-surface-container px-2">
              <IconButton aria-label="Menu">
                <Icon>menu</Icon>
              </IconButton>
              <span className="flex-1 text-title-md">Clusters</span>
              <span className="relative">
                <IconButton aria-label="Filter" className="bg-surface text-on-surface ring-2 ring-primary">
                  <Icon>filter_list</Icon>
                </IconButton>
                <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-primary text-label-sm text-on-primary">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/50 motion-reduce:animate-none" />
                  <span className="relative">2</span>
                </span>
              </span>
              <IconButton aria-label="More">
                <Icon>more_vert</Icon>
              </IconButton>
            </div>
            {/* Static preview: a group, not a live dialog, so the docs page has no stray open dialogs */}
            <CoachMark
              role="group"
              className="absolute top-[68px] right-0"
              step="Step 2 of 4"
              title="Filter by region"
              description="Narrow the list to the regions you're on call for."
              actions={
                <>
                  <Button variant="text">Back</Button>
                  <Button variant="text">Next</Button>
                </>
              }
            />
          </div>
        </Variant>
      </Variants>
    </Section>
  )
}
