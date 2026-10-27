import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { cn } from "@/lib/utils"

import { ButtonLink, DecorShape } from "./marketing-shared"

const VALUES = [
  ["self_improvement", "Calm", "Fewer alerts that matter more. Boring on-call is the goal."],
  ["visibility", "Candor", "Public roadmap, public incident reviews, public pricing."],
  ["handshake", "Craft", "We ship small, often, and read every piece of feedback."],
  ["eco", "Efficiency", "Less compute for the same work is good for bills and the planet."],
]

const LEADERS = [
  ["ML", "Maya Lindqvist", "Co-founder & CEO", "bg-primary-container text-on-primary-container"],
  ["JP", "Jonah Park", "Co-founder & CTO", "bg-tertiary-container text-on-tertiary-container"],
  ["AR", "Ava Reyes", "Co-founder & Chief Architect", "bg-secondary-container text-on-secondary-container"],
  ["TW", "Tomás Weber", "VP Engineering", "bg-primary-fixed-dim text-on-primary-fixed"],
  ["PN", "Priya Nair", "VP Customer Platform", "bg-tertiary text-on-tertiary"],
  ["SO", "Sam Okafor", "Head of Security", "bg-secondary text-on-secondary"],
]

const MILESTONES = [
  ["2019", "Founded in Stockholm; first customer is a bank that still runs on us"],
  ["2021", "Policy engine ships; Series A"],
  ["2023", "Kestrel Grid 3: unified data model across clouds"],
  ["2026", "Grid 4.2 with policy previews and the expanded rail you're looking at"],
]

/** About page: mission + stats, values, leadership grid and a milestones timeline. */
export function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 pb-16 md:px-8 lg:grid-cols-[1.2fr_1fr] lg:pt-12">
        <div>
          <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-md">
            We build the boring layer so your team can do the interesting work.
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">
            Kestrel started in 2019 when three platform engineers got tired of stitching together the same five tools
            at every company. Today 400+ teams run their infrastructure on Kestrel Grid.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-primary-container p-6 text-on-primary-container">
            <div className="text-display-sm font-medium tabular-nums">400+</div>
            <div className="text-body-md">customer teams</div>
          </div>
          <div className="rounded-xl bg-surface-container-highest p-6">
            <div className="text-display-sm font-medium tabular-nums">186</div>
            <div className="text-body-md text-on-surface-variant">Kestrelians, 14 countries</div>
          </div>
          <div className="rounded-xl bg-tertiary-container p-6 text-on-tertiary-container">
            <div className="text-display-sm font-medium tabular-nums">2019</div>
            <div className="text-body-md">founded in Stockholm</div>
          </div>
          <DecorShape
            shape="clover4"
            cycle={["clover4", "cookie7", "sunny"]}
            interval={3000}
            hoverShape="burst"
            className="aspect-square w-full text-secondary-container"
          />
        </div>
      </section>

      <Reveal className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <h2 className="text-headline-md font-medium">What we optimise for</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([icon, title, body]) => (
            <div key={title} className="rounded-xl bg-surface-container-low p-6">
              <Icon size={32} className="text-primary">
                {icon}
              </Icon>
              <h3 className="mt-4 text-title-lg">{title}</h3>
              <p className="mt-2 text-body-md text-on-surface-variant">{body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <section className="bg-surface-container-low">
        <Reveal className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-headline-md font-medium">Leadership</h2>
            <ButtonLink href="#contact" variant="text">
              We're hiring
              <Icon>arrow_forward</Icon>
            </ButtonLink>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEADERS.map(([ini, name, role, tone]) => (
              <div key={name} className="flex items-center gap-4 rounded-xl bg-surface p-4">
                <span className={cn("grid size-16 place-items-center rounded-full text-title-lg", tone)}>{ini}</span>
                <div>
                  <div className="text-title-md">{name}</div>
                  <div className="text-body-md text-on-surface-variant">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <h2 className="text-headline-md font-medium">Milestones</h2>
        <ol className="relative mt-6 ml-3 border-l-2 border-outline-variant">
          {MILESTONES.map(([year, text], i) => {
            const last = i === MILESTONES.length - 1
            return (
              <li key={year} className={cn("relative pl-8", !last && "pb-8")}>
                <span
                  className={cn(
                    "absolute top-1 -left-[9px] size-4 rounded-full ring-4 ring-surface",
                    last ? "bg-tertiary" : "bg-primary",
                  )}
                />
                <div className={cn("text-label-lg", last ? "text-tertiary" : "text-primary")}>{year}</div>
                <div className="text-title-md">{text}</div>
              </li>
            )
          })}
        </ol>
      </Reveal>
    </>
  )
}
