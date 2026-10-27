"use client"


import { Icon } from "@/components/ui/icon"
import { RevealWords } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

import { ButtonLink, DecorShape, Tilt } from "./marketing-shared"

/** Pops a hero tile in with the bounce easing, staggered by `i`. */
const pop = (i: number) => ({
  className: "animate-[m3-pop_900ms_var(--md-easing-bounce)_backwards] motion-reduce:animate-none",
  style: { animationDelay: `${150 + i * 60}ms` },
})

const BARS = [35, 55, 45, 70, 60, 85, 100]

/**
 * Split hero: staggered headline + CTAs on the left, a bento of live tiles and morphing shapes on the right.
 */
export function HeroShowcase({
  primaryHref = "#pricing",
  secondaryHref = "#features",
}: {
  primaryHref?: string
  secondaryHref?: string
}) {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-8 pb-16 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pt-12 lg:pb-24">
      <div className="max-w-2xl">
        <RevealWords
          as="h1"
          className="text-display-sm font-semibold tracking-tight md:text-display-md lg:text-display-lg"
        >
          Run everything. <span className="text-primary">Sweat</span> <span className="text-primary">nothing.</span>
        </RevealWords>
        <p className="mt-6 max-w-xl text-body-lg text-pretty text-on-surface-variant md:text-title-lg">
          Kestrel Grid puts every cluster, pipeline and policy behind one calm control plane, so your platform team
          ships on Friday and still sleeps on Saturday.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={primaryHref} size="md">
            Start free
            <Icon>arrow_forward</Icon>
          </ButtonLink>
          <ButtonLink href={secondaryHref} size="md" variant="tonal">
            <Icon>play_circle</Icon>
            See it work
          </ButtonLink>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-body-md text-on-surface-variant">
          {[
            ["verified", "SOC 2 Type II"],
            ["bolt", "14-day setup, not 14 weeks"],
            ["credit_card_off", "No card to start"],
          ].map(([icon, label]) => (
            <span key={label} className="inline-flex items-center gap-2">
              <Icon size={20} className="text-primary">
                {icon}
              </Icon>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-md grid-cols-3 gap-3 lg:max-w-none">
        <DecorShape
          shape="cookie7"
          cycle={["cookie7", "clover4", "puffy"]}
          interval={3000}
          hoverShape="sunny"
          className={cn("aspect-square w-full text-primary-container", pop(0).className)}
          style={pop(0).style}
        />
        <Tilt
          max={6}
          className={cn("col-span-2 flex flex-col justify-between rounded-xl bg-surface-container-low p-5", pop(1).className)}
          style={pop(1).style}
        >
          <div className="flex items-center justify-between text-label-md text-on-surface-variant">
            <span>Deploys this week</span>
            <span className="inline-flex items-center gap-1 rounded-sm bg-tertiary-container px-2 py-0.5 text-on-tertiary-container">
              <Icon size={16}>trending_up</Icon>+38%
            </span>
          </div>
          <div className="text-display-sm font-medium tabular-nums">1,284</div>
          <div className="flex h-10 items-end gap-1">
            {BARS.map((h, i) => (
              <div
                key={i}
                className={cn("w-full rounded-t-xs", i === BARS.length - 1 ? "bg-primary" : "bg-primary/30")}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </Tilt>
        <div
          className={cn("col-span-2 flex items-center gap-4 rounded-full bg-primary p-3 pr-6 text-on-primary", pop(2).className)}
          style={pop(2).style}
        >
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
        <DecorShape
          shape="arch"
          cycle={["arch", "squircle", "oval"]}
          interval={3400}
          hoverShape="burst"
          className={cn("aspect-square w-full text-tertiary-container", pop(3).className)}
          style={pop(3).style}
        />
        <DecorShape
          shape="clover4"
          cycle={["clover4", "cookie9", "pentagon"]}
          interval={2800}
          hoverShape="verySunny"
          spin={40}
          className={cn("aspect-square w-full text-secondary-container", pop(4).className)}
          style={pop(4).style}
        />
        <div
          className={cn("col-span-2 rounded-xl bg-surface-container-highest p-5", pop(5).className)}
          style={pop(5).style}
        >
          <div className="text-label-md text-on-surface-variant">Regions online</div>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex">
              {[
                ["FR", "bg-primary text-on-primary"],
                ["VA", "bg-tertiary text-on-tertiary"],
                ["TY", "bg-secondary text-on-secondary"],
                ["+9", "bg-primary-fixed-dim text-on-primary-fixed"],
              ].map(([t, c], i) => (
                <span
                  key={t}
                  className={cn(
                    "grid size-9 place-items-center rounded-full text-label-md ring-2 ring-surface-container-highest",
                    i > 0 && "-ml-2",
                    c,
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
            <span className="text-title-md">12 / 12 healthy</span>
          </div>
        </div>
      </div>
    </section>
  )
}
