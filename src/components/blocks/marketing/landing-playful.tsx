"use client"

import * as React from "react"
import { Button as AriaButton, Disclosure, DisclosureGroup, DisclosurePanel, Heading } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { useDragScroll } from "@/hooks/use-drag-scroll"
import { cn } from "@/lib/utils"

import { BrandLogo, DecorShape, NavLinks, SimpleFooter, StaggerIn, Tilt } from "./marketing-shared"

const QUOTES = [
  ["We stopped dreading Thursdays.", "Priya Nair · Halide Bank", "bg-primary-container text-on-primary-container", ""],
  ["Policy previews saved our offsite.", "Noor Haddad · Lattice Labs", "bg-tertiary-container text-on-tertiary-container", "rounded-[48px_12px_48px_12px]"],
  ["Our CFO asked what we changed. Kestrel.", "Kenji Mori · Tessera", "bg-secondary-container text-on-secondary-container", ""],
  ["Rollbacks used to be a meeting.", "Chris Hale · Northwind", "bg-surface-container-highest text-on-surface", "rounded-[48px_12px_48px_12px]"],
  ["One dashboard. Finally.", "Lena Ortiz · Meridian Health", "bg-primary text-on-primary", ""],
]

const FAQ = [
  ["Is it really free for small teams?", "Yes. Up to 10 workloads, forever, no card."],
  ["Will it fight with our existing tools?", "No. It reads from Terraform, Argo CD, GitHub and 40 others, and writes back only when you ask."],
  ["How long does setup take?", "Most teams connect their first cloud in under an hour."],
]

/** Horizontally scrolling testimonials with drag-to-scroll and prev/next buttons. */
function Testimonials() {
  const ref = React.useRef<HTMLDivElement>(null)
  useDragScroll(ref)
  const step = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 12), behavior: "smooth" })
  }
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
      <div className="flex items-end justify-between gap-4 pb-4">
        <h2 className="text-headline-md font-medium">People said nice things</h2>
        <div className="flex gap-1">
          <IconButton aria-label="Previous" variant="outlined" size="md" width="narrow" className="size-12" onPress={() => step(-1)}>
            <Icon>chevron_left</Icon>
          </IconButton>
          <IconButton aria-label="Next" variant="outlined" size="md" width="narrow" className="size-12" onPress={() => step(1)}>
            <Icon>chevron_right</Icon>
          </IconButton>
        </div>
      </div>
      <div ref={ref} className="relative no-scrollbar flex cursor-grab snap-x gap-3 overflow-x-auto pb-4 data-dragging:cursor-grabbing">
        {QUOTES.map(([q, who, tone, shape]) => (
          <figure
            key={who}
            className={cn("flex h-64 w-[min(85vw,340px)] shrink-0 snap-start flex-col justify-between rounded-xl p-6 select-none", tone, shape)}
          >
            <Icon size={32} className="opacity-70">
              format_quote
            </Icon>
            <blockquote className="text-headline-sm font-medium">{q}</blockquote>
            <figcaption className="text-label-lg opacity-80">{who}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

/** Variant 10 · Playful — tilted stat cards, scribbled underline, swipeable quotes and a friendly FAQ. */
export function LandingPlayful() {
  return (
    <div className="bg-surface font-sans text-on-surface">
      <div className="overflow-hidden">
        <header className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 md:px-8">
          <BrandLogo />
          <NavLinks className="mx-auto rounded-full bg-surface-container-high p-1" />
          <Button className="ml-auto bg-tertiary px-5 text-on-tertiary lg:ml-0" onPress={() => snackbar("Let's get you set up")}>
            Try it
          </Button>
        </header>
        <section className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
            <StaggerIn>
              <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-lg">
                Serious infrastructure.{" "}
                <span className="relative inline-block text-primary">
                  Unserious
                  <svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden className="absolute -bottom-2 left-0 h-3 w-full text-tertiary">
                    <path d="M2 8 Q 50 2, 100 7 T 198 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                amounts of stress.
              </h1>
              <p className="mt-6 max-w-lg text-body-lg text-on-surface-variant">
                Kestrel Grid handles the cluster wrangling, policy nagging and rollback babysitting. You handle the
                interesting bits.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="md" className="pr-5" onPress={() => snackbar("Workspace created — check your inbox")}>
                  Start free
                  <Icon>arrow_forward</Icon>
                </Button>
                <Button size="md" variant="tonal" className="pl-5" onPress={() => snackbar("Playing 2-minute tour")}>
                  <Icon>play_circle</Icon>
                  Watch the tour
                </Button>
              </div>
            </StaggerIn>
            <div className="relative mx-auto h-[420px] w-full max-w-md">
              <DecorShape shape="burst" cycle={["burst", "cookie12", "sunny"]} interval={2969} spin={20} className="absolute top-4 -left-6 size-16 text-tertiary" />
              <DecorShape shape="clover4" cycle={["clover4", "cookie7"]} interval={2665} spin={35} className="absolute -right-2 bottom-10 size-20 text-secondary-container" />
              <DecorShape shape="gem" cycle={["gem", "diamond", "pentagon"]} interval={3793} className="absolute bottom-0 left-10 size-12 text-primary" />
              <div className="absolute top-12 left-6 w-64 -rotate-6">
                <Tilt max={10} className="rounded-xl bg-tertiary-container p-5 text-on-tertiary-container shadow-3">
                  <Icon size={32}>policy</Icon>
                  <div className="mt-6 text-title-lg">0 violations</div>
                  <div className="text-body-sm">12 caught before deploy</div>
                </Tilt>
              </div>
              <div className="absolute top-2 right-4 w-60 rotate-[5deg]">
                <Tilt max={10} className="rounded-xl bg-secondary-container p-5 text-on-secondary-container shadow-3">
                  <Icon size={32}>savings</Icon>
                  <div className="mt-6 text-title-lg">−22% spend</div>
                  <div className="text-body-sm">after the first quarter</div>
                </Tilt>
              </div>
              <div className="absolute bottom-10 left-1/2 w-72 -translate-x-1/2 rotate-[-2deg]">
                <Tilt max={10} className="rounded-xl bg-primary p-5 text-on-primary shadow-4">
                  <div className="flex items-center justify-between">
                    <Icon size={32}>rocket_launch</Icon>
                    <span className="rounded-full bg-on-primary/15 px-2 py-0.5 text-label-md">live</span>
                  </div>
                  <div className="mt-6 text-headline-sm font-medium">checkout-api promoted</div>
                  <div className="text-body-sm opacity-80">canary held 30 min · p95 176 ms</div>
                </Tilt>
              </div>
            </div>
          </div>
        </section>
        <Testimonials />
        <section className="mx-auto max-w-7xl px-4 md:px-8">
          <DisclosureGroup defaultExpandedKeys={["0"]} allowsMultipleExpanded className="mx-auto max-w-3xl space-y-2 pb-24">
            {FAQ.map(([q, a], i) => (
              <Disclosure
                key={q}
                id={String(i)}
                className="group rounded-xl bg-surface-container-low transition-colors duration-(--md-spring-default-effects-duration) data-expanded:bg-surface-container"
              >
                <Heading level={3}>
                  <AriaButton
                    slot="trigger"
                    className="state-layer focus-ring flex min-h-16 w-full cursor-pointer items-center gap-4 rounded-xl px-6 py-4 text-start text-title-md outline-none"
                  >
                    <span className="flex-1">{q}</span>
                    <span className="grid size-10 place-items-center rounded-full bg-surface-container-highest transition-[rotate,background-color,color] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-data-expanded:rotate-180 group-data-expanded:bg-primary group-data-expanded:text-on-primary">
                      <Icon>expand_more</Icon>
                    </span>
                  </AriaButton>
                </Heading>
                <DisclosurePanel className="h-(--disclosure-panel-height) overflow-clip transition-[height] duration-(--md-spring-default-spatial-duration) ease-default-spatial motion-reduce:transition-none">
                  <p className="px-6 pb-6 text-body-lg text-on-surface-variant">{a}</p>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </DisclosureGroup>
        </section>
      </div>
      <SimpleFooter />
    </div>
  )
}
