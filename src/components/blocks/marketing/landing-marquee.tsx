"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { BrandLogo, Magnetic, SimpleFooter, StaggerIn } from "./marketing-shared"

const JOBS = ["Inventory", "Policy", "Rollouts", "Cost", "Drift", "SLOs", "Ownership", "Audit", "Canary", "Rollback", "SBOM", "Budgets"]

/** One infinitely scrolling row of pills. The track is rendered twice so the loop is seamless. */
function MarqueeRow({ tones, seconds, reverse }: { tones: string[]; seconds: number; reverse?: boolean }) {
  const track = (hidden?: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 animate-[m3-marquee_var(--dur)_linear_infinite] gap-3 pr-3 motion-reduce:animate-none"
      style={{ "--dur": `${seconds}s`, animationDirection: reverse ? "reverse" : undefined } as React.CSSProperties}
    >
      {[...JOBS, ...JOBS].map((j, i) => (
        <span
          key={i}
          className={cn("inline-flex h-16 shrink-0 items-center rounded-full px-7 text-headline-sm font-medium", tones[i % tones.length])}
        >
          {j}
        </span>
      ))}
    </div>
  )
  return (
    <div className="flex overflow-hidden">
      {track()}
      {track(true)}
    </div>
  )
}

const STATS = [
  ["trending_up", "1,284", "deploys this week", "+38%"],
  ["shield", "0", "policy violations", "12 caught"],
  ["timer", "4 min", "median time to root cause", "−6 min"],
]

/** Variant 06 · Marquee — oversized tertiary hero, an XL button and two counter-scrolling rows of capabilities. */
export function LandingMarquee() {
  return (
    <div className="bg-surface font-sans text-on-surface">
      <div className="overflow-hidden">
        <header className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 md:px-8">
          <BrandLogo />
          <Button variant="tonal" className="ml-auto h-12 bg-surface-container-high pr-5 pl-4 text-on-surface" onPress={() => snackbar("Menu")}>
            <Icon size={20}>menu</Icon>
            Menu
          </Button>
        </header>
        <section className="mx-auto max-w-7xl px-4 pt-4 md:px-8">
          <StaggerIn className="rounded-2xl bg-tertiary-container px-6 py-14 text-center text-on-tertiary-container md:px-16 md:py-24">
            <h1 className="mx-auto max-w-5xl text-[clamp(44px,8vw,112px)] leading-[0.95] font-semibold tracking-tight text-balance">
              Infrastructure, minus the drama.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-title-lg font-normal">
              Twelve jobs your platform team does by hand, handled by one control plane.
            </p>
            <Magnetic strength={0.2} className="mt-10">
              <Button size="lg" className="bg-tertiary text-on-tertiary" onPress={() => snackbar("Workspace created — check your inbox")}>
                Start free
                <Icon>arrow_forward</Icon>
              </Button>
            </Magnetic>
          </StaggerIn>
        </section>
        <div className="space-y-3 py-14">
          <MarqueeRow seconds={40} tones={["bg-primary text-on-primary", "bg-primary-container text-on-primary-container", "bg-surface-container-highest text-on-surface"]} />
          <MarqueeRow
            seconds={48}
            reverse
            tones={["bg-secondary-container text-on-secondary-container", "bg-tertiary text-on-tertiary", "bg-surface-container-high text-on-surface"]}
          />
        </div>
        <section className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-4 pb-24 md:grid-cols-3">
            {STATS.map(([icon, v, l, d]) => (
              <Reveal key={l} className="flex items-center gap-5 rounded-xl bg-surface-container-low p-6">
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
                  <Icon>{icon}</Icon>
                </span>
                <div>
                  <div className="text-headline-md font-semibold tabular-nums">{v}</div>
                  <div className="text-body-md text-on-surface-variant">
                    {l} · <span className="text-tertiary">{d}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
      <SimpleFooter />
    </div>
  )
}
