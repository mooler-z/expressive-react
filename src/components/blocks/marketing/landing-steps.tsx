"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"
import type { ShapeName } from "@/components/ui/shape"
import { cn } from "@/lib/utils"

import { BrandLogo, DecorShape, SimpleFooter, StaggerIn } from "./marketing-shared"

const STEPS: {
  title: string
  body: string
  shape: ShapeName
  shapeTone: string
  numTone: string
  panel: string
  demo: React.ReactNode
}[] = [
  {
    title: "Connect your clouds",
    body: "Read-only roles. Kestrel discovers clusters, namespaces, owners and drift.",
    shape: "cookie7",
    shapeTone: "text-primary-container",
    numTone: "text-on-primary-container",
    panel: "bg-primary-container text-on-primary-container",
    demo: (
      <div className="space-y-2">
        {["AWS · 8 clusters", "GCP · 3 clusters", "Azure · 1 cluster"].map((t) => (
          <div key={t} className="flex items-center gap-2 rounded-md bg-surface p-3 text-body-md text-on-surface">
            <Icon size={20} filled className="text-tertiary">
              check_circle
            </Icon>
            {t}
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Preview a policy",
    body: "See what a rule would block before you turn it on. No Friday surprises.",
    shape: "clover4",
    shapeTone: "text-tertiary-container",
    numTone: "text-on-tertiary-container",
    panel: "bg-tertiary-container text-on-tertiary-container",
    demo: (
      <>
        <pre className="rounded-md bg-surface p-3 font-mono text-body-sm text-on-surface">{`deny[msg] {\n  input.acl == "public-read"\n}`}</pre>
        <div className="mt-2 rounded-md bg-tertiary px-3 py-2 text-body-sm text-on-tertiary">0 of 48 would be blocked</div>
      </>
    ),
  },
  {
    title: "Roll out with guardrails",
    body: "Canary at 10%, watch golden signals, promote or roll back on its own.",
    shape: "sunny",
    shapeTone: "text-secondary-container",
    numTone: "text-on-secondary-container",
    panel: "bg-secondary-container text-on-secondary-container",
    demo: (
      <div className="flex items-center gap-3 rounded-md bg-surface p-3 text-on-surface">
        <span className="text-title-sm">Canary</span>
        <span className="h-2 flex-1 rounded-full bg-surface-container-highest">
          <span className="block h-full w-2/5 rounded-full bg-primary" />
        </span>
        <span className="text-label-md tabular-nums">40%</span>
      </div>
    ),
  },
  {
    title: "Sleep",
    body: "Fewer pages that matter more. The incident timeline writes itself.",
    shape: "puffy",
    shapeTone: "text-primary",
    numTone: "text-on-primary",
    panel: "bg-primary text-on-primary",
    demo: (
      <div className="flex items-center gap-3 rounded-md bg-on-primary/15 p-3 text-body-md">
        <Icon filled>bedtime</Icon>0 pages last night
      </div>
    ),
  },
]

/** Variant 08 · Steps — a numbered how-it-works story with sticky, morphing step badges. */
export function LandingSteps() {
  return (
    <div className="bg-surface font-sans text-on-surface">
      <header className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 md:px-8">
        <BrandLogo />
        <Button className="ml-auto px-5" onPress={() => snackbar("Let's get you set up")}>
          Start free
        </Button>
      </header>
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <StaggerIn className="max-w-3xl pt-10 pb-12 lg:pt-16">
          <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-lg">
            From zero to calm in four steps.
          </h1>
          <p className="mt-4 text-body-lg text-on-surface-variant">Most teams finish step three in an afternoon.</p>
        </StaggerIn>
        <ol className="relative pb-24">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid gap-6 pb-12 md:grid-cols-[160px_1fr] md:gap-10">
              <div className="md:sticky md:top-24 md:self-start">
                <span className="relative grid size-24 place-items-center md:size-32">
                  <DecorShape shape={s.shape} cycle={[s.shape, "circle", s.shape]} interval={3600} hoverShape="burst" className={cn("absolute inset-0", s.shapeTone)} />
                  <span className={cn("relative text-display-sm font-semibold", s.numTone)}>{i + 1}</span>
                </span>
              </div>
              <Reveal className="grid items-start gap-6 rounded-2xl bg-surface-container-low p-6 md:p-8 lg:grid-cols-2">
                <div>
                  <h2 className="text-headline-md font-medium">{s.title}</h2>
                  <p className="mt-3 text-body-lg text-on-surface-variant">{s.body}</p>
                </div>
                <div className={cn("rounded-xl p-4", s.panel)}>{s.demo}</div>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mb-24 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-inverse-surface p-8 text-inverse-on-surface md:p-12">
          <h2 className="max-w-xl text-headline-lg font-semibold">Start with step one. It's free.</h2>
          <Button size="md" className="bg-inverse-primary text-on-primary-fixed" onPress={() => snackbar("Connecting your first cloud…")}>
            Connect a cloud
            <Icon>arrow_forward</Icon>
          </Button>
        </div>
      </section>
      <SimpleFooter />
    </div>
  )
}
