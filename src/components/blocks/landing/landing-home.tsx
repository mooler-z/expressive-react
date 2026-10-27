"use client"

import * as React from "react"

import { PageButtonLink } from "@/components/blocks/landing/landing-shared"
import { Icon } from "@/components/ui/icon"
import { Reveal, RevealWords } from "@/components/ui/reveal"
import { Shape, type ShapeName } from "@/components/ui/shape"
import { useTilt } from "@/hooks/use-tilt"
import { cn } from "@/lib/utils"

/** Hero tiles pop in after the headline, 60ms apart, on the bounce curve. */
function pop(i: number): React.CSSProperties {
  return { animationDelay: `${150 + i * 60}ms`, animationDuration: "900ms" }
}
const popClass = "animate-pop motion-reduce:animate-none"

function HeroShape({ shape, cycle, interval, hover, className, i, spin }: {
  shape: ShapeName
  cycle: ShapeName[]
  interval: number
  hover: ShapeName
  className: string
  i: number
  spin?: number
}) {
  const s = <Shape shape={shape} cycle={cycle} interval={interval} hoverShape={hover} className={cn("w-full", className)} />
  return (
    <div className={popClass} style={pop(i)}>
      {spin ? (
        <div className="animate-spin motion-reduce:animate-none" style={{ animationDuration: `${spin}s` }}>
          {s}
        </div>
      ) : (
        s
      )}
    </div>
  )
}

const BARS = [35, 55, 45, 70, 60, 85]

function DeploysCard() {
  const ref = React.useRef<HTMLDivElement>(null)
  useTilt(ref, { max: 6 })
  return (
    <div className={cn("col-span-2", popClass)} style={pop(1)}>
      <div ref={ref} className="flex h-full flex-col justify-between rounded-xl bg-surface-container-low p-5">
        <div className="flex items-center justify-between text-label-md text-on-surface-variant">
          <span>Deploys this week</span>
          <span className="inline-flex items-center gap-1 rounded-sm bg-tertiary-container px-2 py-0.5 text-on-tertiary-container">
            <Icon size={16}>trending_up</Icon>+38%
          </span>
        </div>
        <div className="text-display-sm font-medium tabular-nums">1,284</div>
        <div className="flex h-10 items-end gap-1">
          {BARS.map((h, i) => (
            <div key={i} className="w-full rounded-t-xs bg-primary/30" style={{ height: `${h}%` }} />
          ))}
          <div className="h-full w-full rounded-t-xs bg-primary" />
        </div>
      </div>
    </div>
  )
}

const REGIONS = [
  ["FR", "bg-primary text-on-primary"],
  ["VA", "bg-tertiary text-on-tertiary"],
  ["TY", "bg-secondary text-on-secondary"],
  ["+9", "bg-primary-fixed-dim text-on-primary-fixed"],
] as const

function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-8 pb-16 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pt-12 lg:pb-24">
      <div className="max-w-2xl">
        <span className="inline-flex h-8 items-center gap-2 rounded-sm bg-secondary-container pr-3 pl-2 text-label-lg text-on-secondary-container">
          <Icon size={18}>grid_view</Icon>Kestrel Grid · enterprise control plane
        </span>
        <RevealWords as="h1" className="mt-6 text-display-sm font-semibold tracking-tight md:text-display-md lg:text-display-lg">
          Run everything. <span className="text-primary">Sweat</span> <span className="text-primary">nothing.</span>
        </RevealWords>
        <p className="mt-6 max-w-xl text-body-lg text-pretty text-on-surface-variant md:text-title-lg">
          Kestrel Grid puts every cluster, pipeline and policy behind one calm control plane, so your platform team ships on
          Friday and still sleeps on Saturday.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PageButtonLink to="pricing" size="md">
            Start free
            <Icon>arrow_forward</Icon>
          </PageButtonLink>
          <PageButtonLink to="features" size="md" variant="tonal">
            <Icon>play_circle</Icon>
            See it work
          </PageButtonLink>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-body-md text-on-surface-variant">
          {[
            ["verified", "SOC 2 Type II"],
            ["bolt", "14-day setup, not 14 weeks"],
            ["credit_card_off", "No card to start"],
          ].map(([icon, text]) => (
            <span key={icon} className="inline-flex items-center gap-2">
              <Icon size={20} className="text-primary">
                {icon}
              </Icon>
              {text}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-md grid-cols-3 gap-3 lg:max-w-none">
        <HeroShape i={0} shape="cookie7" cycle={["cookie7", "clover4", "puffy"]} interval={3000} hover="sunny" className="text-primary-container" />
        <DeploysCard />
        <div className={cn("col-span-2", popClass)} style={pop(2)}>
          <div className="flex items-center gap-4 rounded-full bg-primary p-3 pr-6 text-on-primary">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-on-primary/15">
              <Icon size={32} filled>
                shield
              </Icon>
            </span>
            <div>
              <div className="text-title-md">0 policy violations</div>
              <div className="text-body-sm opacity-80">Guardrails caught 12 before deploy</div>
            </div>
          </div>
        </div>
        <HeroShape i={3} shape="arch" cycle={["arch", "squircle", "oval"]} interval={3400} hover="burst" className="text-tertiary-container" />
        <HeroShape
          i={4}
          shape="clover4"
          cycle={["clover4", "cookie9", "pentagon"]}
          interval={2800}
          hover="verySunny"
          spin={40}
          className="text-secondary-container"
        />
        <div className={cn("col-span-2", popClass)} style={pop(5)}>
          <div className="rounded-xl bg-surface-container-highest p-5">
            <div className="text-label-md text-on-surface-variant">Regions online</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex">
                {REGIONS.map(([code, color], i) => (
                  <span
                    key={code}
                    className={cn("grid size-9 place-items-center rounded-full text-label-md ring-2 ring-surface-container-highest", color, i > 0 && "-ml-2")}
                  >
                    {code}
                  </span>
                ))}
              </div>
              <span className="text-title-md">12 / 12 healthy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const LOGOS = ["Northwind", "Halide Bank", "Meridian Health", "Tessera Logistics", "Quorum Energy", "Lattice Labs"]

const WHY = [
  {
    icon: "hub",
    tone: "bg-primary-container text-on-primary-container",
    title: "Every cluster, one view",
    body: "AWS, GCP, Azure and the rack in the basement. Kestrel Grid inventories it all in minutes and keeps it honest.",
  },
  {
    icon: "policy",
    tone: "bg-tertiary-container text-on-tertiary-container",
    title: "Guardrails as code",
    body: "Write a policy once. It's enforced at plan, deploy and runtime, with a preview so nobody gets surprised on a Friday.",
  },
  {
    icon: "monitoring",
    tone: "bg-secondary-container text-on-secondary-container",
    title: "Observe without the tab sprawl",
    body: "Traces, logs and metrics, correlated per deploy. The incident timeline writes itself.",
  },
]

export function LandingHome() {
  return (
    <>
      <Hero />

      <section className="border-y border-outline-variant/60 bg-surface-container-low/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-8 text-title-md font-semibold tracking-tight text-on-surface-variant/70 md:px-8">
          {LOGOS.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-headline-lg font-semibold text-balance md:text-display-sm">Three problems, one control plane.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="group rounded-xl bg-surface-container-low p-6 transition-[translate,background-color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial hover:-translate-y-1 hover:bg-surface-container"
              >
                <span
                  className={cn(
                    "grid size-14 place-items-center rounded-lg shape-morph group-hover:rounded-[28px] [--icon-size:28px]",
                    w.tone,
                  )}
                >
                  <Icon>{w.icon}</Icon>
                </span>
                <h3 className="mt-6 text-title-lg">{w.title}</h3>
                <p className="mt-2 text-body-md text-on-surface-variant">{w.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <Reveal className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-primary p-8 text-on-primary md:col-span-2">
            <div className="text-display-md font-semibold tabular-nums md:text-display-lg">
              30%<span className="text-headline-md"> faster rollouts</span>
            </div>
            <p className="mt-3 max-w-md text-body-lg opacity-90">
              Canary, blue-green or plain old all-at-once. Kestrel watches the golden signals and rolls back before your pager does.
            </p>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-xl bg-tertiary-container p-8 text-on-tertiary-container">
            <Icon size={40}>savings</Icon>
            <div>
              <div className="text-display-sm font-semibold tabular-nums">−22%</div>
              <div className="mt-1 text-body-lg">cloud spend after the first quarter, on average</div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-6 rounded-xl bg-surface-container-highest p-8">
            <Icon size={40} className="text-primary">
              timer
            </Icon>
            <div>
              <div className="text-display-sm font-semibold tabular-nums">4 min</div>
              <div className="mt-1 text-body-lg text-on-surface-variant">median time from alert to root cause</div>
            </div>
          </div>
          <div className="rounded-xl bg-secondary-container p-8 text-on-secondary-container md:col-span-2">
            <div className="flex items-start gap-4">
              <Icon size={40}>format_quote</Icon>
              <div>
                <p className="text-title-lg font-normal text-pretty">
                  “We replaced four dashboards and a spreadsheet nobody trusted. Our on-call rotation stopped dreading Thursdays.”
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-secondary text-label-lg text-on-secondary">PN</span>
                  <div>
                    <div className="text-title-sm">Priya Nair</div>
                    <div className="text-body-sm opacity-80">VP Platform, Halide Bank</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <Reveal className="relative overflow-hidden rounded-2xl bg-primary-container px-6 py-14 text-on-primary-container md:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 -right-10 size-64 animate-spin text-primary/15 motion-reduce:animate-none md:size-96"
            style={{ animationDuration: "80s" }}
          >
            <Shape shape="sunny" cycle={["sunny", "cookie12", "clover8"]} interval={3200} className="size-full" />
          </div>
          <div className="relative max-w-2xl">
            <h2 className="text-headline-lg font-semibold text-balance md:text-display-sm">
              Your first cluster is connected in an afternoon. Promise.
            </h2>
            <p className="mt-4 text-body-lg">Free for teams up to 10. No card, no sales call unless you want one.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PageButtonLink to="pricing" size="md">
                Start free
              </PageButtonLink>
              <PageButtonLink to="contact" size="md" variant="outlined" className="border-on-primary-container/30 text-on-primary-container">
                Talk to an engineer
              </PageButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
