"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { BrandLogo, DecorShape, LogoCloud, Magnetic, NavLinks, SimpleFooter, StaggerIn } from "./marketing-shared"

const STEPS = [
  { n: 1, title: "Connect", body: "Read-only roles discover every cluster in minutes.", tone: "bg-primary-container text-on-primary-container", shape: "cookie9" as const },
  { n: 2, title: "Guard", body: "Policies preview what they would block, then enforce.", tone: "bg-tertiary-container text-on-tertiary-container", shape: "clover4" as const },
  { n: 3, title: "Ship", body: "Rollouts watch golden signals and roll back on their own.", tone: "bg-secondary-container text-on-secondary-container", shape: "sunny" as const },
]

/** Variant 01 · Orbit — centered headline in a field of slowly morphing, orbiting shapes. */
export function LandingOrbit() {
  return (
    <div className="bg-surface font-sans text-on-surface">
      <div className="relative overflow-hidden">
        <header className="relative z-10 mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 md:px-8">
          <BrandLogo />
          <NavLinks className="mx-auto rounded-full bg-surface-container p-1" />
          <Button className="ml-auto px-5 lg:ml-0" onPress={() => snackbar("Let's get you set up")}>
            Start free
          </Button>
        </header>
        <section className="relative mx-auto grid min-h-[78vh] max-w-7xl place-items-center px-4 py-16 text-center md:px-8">
          <div className="pointer-events-none absolute inset-0">
            <DecorShape shape="cookie7" cycle={["cookie7", "clover4", "puffy"]} interval={3533} className="absolute top-[8%] left-[4%] size-24 text-primary-container md:size-40" />
            <DecorShape shape="clover4" cycle={["clover4", "sunny", "cookie12"]} interval={2976} spin={40} className="absolute top-[4%] right-[6%] size-20 text-tertiary-container md:size-32" />
            <DecorShape shape="arch" cycle={["arch", "squircle", "oval"]} interval={3489} className="absolute bottom-[10%] left-[10%] size-16 text-secondary-container md:size-28" />
            <DecorShape shape="sunny" cycle={["sunny", "verySunny", "cookie9"]} interval={3435} spin={60} className="absolute right-[8%] bottom-[6%] size-28 text-primary-fixed-dim md:size-44" />
            <DecorShape shape="gem" cycle={["gem", "pentagon", "diamond"]} interval={3268} className="absolute top-[2%] left-[42%] hidden size-10 text-tertiary md:block" />
            <DecorShape shape="burst" cycle={["burst", "softBurst", "circle"]} interval={2869} spin={30} className="absolute right-[30%] bottom-[2%] hidden size-12 text-secondary md:block" />
          </div>
          <StaggerIn className="relative max-w-4xl">
            <h1 className="text-[clamp(44px,8vw,104px)] leading-[0.95] font-semibold tracking-tight text-balance">
              The control plane that <span className="text-primary">keeps its cool.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-pretty text-on-surface-variant md:text-title-lg md:font-normal">
              Every cluster, pipeline and policy in one calm place. Your platform team ships Friday and sleeps Saturday.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Magnetic>
                <Button size="md" className="pr-5" onPress={() => snackbar("Workspace created — check your inbox")}>
                  Start free
                  <Icon>arrow_forward</Icon>
                </Button>
              </Magnetic>
              <Button size="md" variant="tonal" className="pl-5" onPress={() => snackbar("Playing 2-minute tour")}>
                <Icon>play_circle</Icon>
                Watch the tour
              </Button>
            </div>
          </StaggerIn>
        </section>
        <LogoCloud variant="panel" names={["Northwind", "Halide Bank", "Meridian Health", "Tessera", "Quorum Energy", "Lattice Labs"]} />
        <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <Reveal
                key={s.n}
                className={cn(
                  "group rounded-xl p-6 transition-[translate] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial hover:-translate-y-1",
                  s.tone,
                )}
              >
                <span className="relative grid size-16 place-items-center">
                  <DecorShape shape={s.shape} cycle={[s.shape, "circle"]} interval={3400} hoverShape="burst" className="absolute inset-0 text-surface/60" />
                  <span className="relative text-headline-sm font-semibold">{s.n}</span>
                </span>
                <h3 className="mt-5 text-headline-sm font-medium">{s.title}</h3>
                <p className="mt-2 text-body-lg opacity-90">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
      <SimpleFooter />
    </div>
  )
}
