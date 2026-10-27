"use client"

import { Button as AriaButton } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { Ripple } from "@/components/ui/ripple"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { BrandLogo, DecorShape, NavLinks, SimpleFooter, StaggerIn, Tilt } from "./marketing-shared"

const BARS = [40, 62, 48, 75, 58, 88, 70, 95, 82, 100]
const ROLLOUTS: [string, number][] = [
  ["checkout-api", 80],
  ["identity", 40],
  ["edge-cache", 15],
]

/** Variant 02 · Bento — a live product bento as the hero. */
export function LandingBento() {
  return (
    <div className="bg-surface font-sans text-on-surface">
      <header className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 md:px-8">
        <BrandLogo />
        <NavLinks className="ml-6" />
        <div className="ml-auto flex gap-2">
          <Button variant="text" className="hidden px-4 sm:inline-flex" onPress={() => snackbar("Signing in…")}>
            Sign in
          </Button>
          <Button className="px-5" onPress={() => snackbar("Let's get you set up")}>
            Start free
          </Button>
        </div>
      </header>
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <StaggerIn className="grid items-end gap-6 pt-8 pb-8 lg:grid-cols-[1.2fr_1fr] lg:pt-12">
          <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-lg">
            Everything your platform team checks, in one glance.
          </h1>
          <div>
            <p className="text-body-lg text-on-surface-variant">
              Kestrel Grid turns inventory, policy, rollouts and spend into one live surface. Here's yours on a quiet
              Tuesday.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="md" className="pr-5" onPress={() => snackbar("Workspace created — check your inbox")}>
                Start free
                <Icon>arrow_forward</Icon>
              </Button>
              <Button size="md" variant="outlined" onPress={() => snackbar("An engineer will reach out within a day")}>
                Book a demo
              </Button>
            </div>
          </div>
        </StaggerIn>
        <div className="grid auto-rows-[minmax(160px,auto)] gap-3 pb-24 md:grid-cols-4">
          <Tilt max={4} className="flex flex-col justify-between gap-6 rounded-xl bg-primary p-6 text-on-primary md:col-span-2 md:row-span-2">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-8 items-center gap-2 rounded-sm bg-on-primary/15 px-3 pl-2 text-label-lg">
                <Icon size={18}>rocket_launch</Icon>Deploys this week
              </span>
              <span className="text-label-lg">+38%</span>
            </div>
            <div>
              <div className="text-[clamp(56px,9vw,120px)] leading-none font-semibold tabular-nums">1,284</div>
              <div className="mt-4 flex h-24 items-end gap-1.5">
                {BARS.map((h, i) => (
                  <span
                    key={i}
                    className={cn("flex-1 rounded-t-sm", i === BARS.length - 1 ? "bg-on-primary" : "bg-on-primary/30")}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </Tilt>
          <Reveal className="flex flex-col justify-between rounded-xl bg-tertiary-container p-6 text-on-tertiary-container">
            <span className="text-label-lg">Uptime · 90 days</span>
            <div className="flex items-end justify-between gap-2">
              <span className="text-headline-lg font-semibold tabular-nums">99.98%</span>
              <svg viewBox="0 0 48 48" className="size-14 -rotate-90" aria-hidden>
                <circle cx="24" cy="24" r="19" fill="none" className="stroke-on-tertiary-container/15" strokeWidth="6" />
                <circle cx="24" cy="24" r="19" fill="none" className="stroke-tertiary" strokeWidth="6" strokeLinecap="round" pathLength={100} strokeDasharray="98 100" />
              </svg>
            </div>
          </Reveal>
          <Reveal className="relative overflow-hidden rounded-xl bg-secondary-container p-6 text-on-secondary-container">
            <DecorShape shape="cookie12" cycle={["cookie12", "clover8", "sunny"]} interval={2887} spin={50} className="absolute -right-8 -bottom-8 size-36 text-secondary/25" />
            <span className="relative text-label-lg">Policy violations</span>
            <div className="relative mt-3 text-display-sm font-semibold">0</div>
            <p className="relative text-body-sm">12 caught before deploy</p>
          </Reveal>
          <Reveal className="rounded-xl bg-surface-container-high p-6 md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-title-md">Live rollouts</span>
              <span className="inline-flex h-8 items-center rounded-sm bg-primary-container px-3 text-label-lg text-on-primary-container">
                3 running
              </span>
            </div>
            <ul className="mt-4 space-y-3">
              {ROLLOUTS.map(([name, pct]) => (
                <li key={name} className="flex items-center gap-3">
                  <span className="w-28 font-mono text-body-sm">{name}</span>
                  <span className="h-2 flex-1 rounded-full bg-surface-container-highest">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-10 text-right text-label-md tabular-nums">{pct}%</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="flex flex-col justify-between rounded-xl bg-surface-container-highest p-6">
            <Icon size={32} className="text-primary">
              savings
            </Icon>
            <div>
              <div className="text-headline-md font-semibold tabular-nums">−22%</div>
              <div className="text-body-sm text-on-surface-variant">cloud spend after one quarter</div>
            </div>
          </Reveal>
          <Reveal className="flex flex-col justify-between gap-4 rounded-xl bg-inverse-surface p-6 text-inverse-on-surface">
            <Icon size={32} className="text-inverse-primary">
              format_quote
            </Icon>
            <p className="text-body-lg">“We retired four dashboards and a spreadsheet nobody trusted.”</p>
            <span className="text-label-md opacity-80">Priya Nair · Halide Bank</span>
          </Reveal>
          <Reveal className="md:col-span-2">
            <AriaButton
              onPress={() => snackbar("Opening the interactive demo")}
              className="state-layer focus-ring group flex size-full cursor-pointer flex-col justify-between gap-6 rounded-xl bg-primary-container p-6 text-left text-on-primary-container outline-none"
            >
              <span className="text-label-lg">Try it with sample data</span>
              <span className="flex items-end justify-between gap-4">
                <span className="text-headline-md font-medium">Open the live demo</span>
                <span className="grid size-14 place-items-center rounded-full bg-primary text-on-primary transition-[translate] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-data-hovered:translate-x-1">
                  <Icon>arrow_forward</Icon>
                </span>
              </span>
              <Ripple />
            </AriaButton>
          </Reveal>
        </div>
      </section>
      <SimpleFooter />
    </div>
  )
}
