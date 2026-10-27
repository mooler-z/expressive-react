"use client"

import { PageButtonLink } from "@/components/blocks/landing/landing-shared"
import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { Shape } from "@/components/ui/shape"
import { cn } from "@/lib/utils"

const VALUES = [
  ["self_improvement", "Calm", "Fewer alerts that matter more. Boring on-call is the goal."],
  ["visibility", "Candor", "Public roadmap, public incident reviews, public pricing."],
  ["handshake", "Craft", "We ship small, often, and read every piece of feedback."],
  ["eco", "Efficiency", "Less compute for the same work is good for bills and the planet."],
] as const

const LEADERS = [
  { name: "Maya Lindqvist", role: "Co-founder & CEO", color: "primary" },
  { name: "Jonah Park", role: "Co-founder & CTO", color: "tertiary" },
  { name: "Ava Reyes", role: "Co-founder & Chief Architect", color: "secondary" },
  { name: "Tomás Weber", role: "VP Engineering", color: "neutral" },
  { name: "Priya Nair", role: "VP Customer Platform", color: "tertiary-solid" },
  { name: "Sam Okafor", role: "Head of Security", color: "secondary-solid" },
] as const

const MILESTONES = [
  { year: "2019", text: "Founded in Stockholm; first customer is a bank that still runs on us" },
  { year: "2021", text: "Policy engine ships; Series A" },
  { year: "2023", text: "Kestrel Grid 3: unified data model across clouds" },
  { year: "2026", text: "Grid 4.2 with policy previews and the expanded rail you're looking at", now: true },
]

export function LandingAbout() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-8 pb-16 md:px-8 lg:grid-cols-[1.2fr_1fr] lg:pt-12">
        <div>
          <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-md">
            We build the boring layer so your team can do the interesting work.
          </h1>
          <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">
            Kestrel started in 2019 when three platform engineers got tired of stitching together the same five tools at every
            company. Today 400+ teams run their infrastructure on Kestrel Grid.
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
          <Shape
            shape="clover4"
            cycle={["clover4", "cookie7", "sunny"]}
            interval={3000}
            hoverShape="burst"
            className="w-full text-secondary-container"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <Reveal>
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
      </section>

      <section className="bg-surface-container-low">
        <Reveal className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-headline-md font-medium">Leadership</h2>
            <PageButtonLink to="contact" variant="text" className="px-4">
              We're hiring
              <Icon size={20}>arrow_forward</Icon>
            </PageButtonLink>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEADERS.map((p) => (
              <div key={p.name} className="flex items-center gap-4 rounded-xl bg-surface p-4">
                <Avatar name={p.name} color={p.color} size="lg" className="size-16" />
                <div>
                  <div className="text-title-md">{p.name}</div>
                  <div className="text-body-md text-on-surface-variant">{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <Reveal>
          <h2 className="text-headline-md font-medium">Milestones</h2>
          <ol className="relative mt-6 ml-3 border-l-2 border-outline-variant">
            {MILESTONES.map((m, i) => (
              <li key={m.year} className={cn("relative pl-8", i < MILESTONES.length - 1 && "pb-8")}>
                <span
                  className={cn("absolute top-1 -left-[9px] size-4 rounded-full ring-4 ring-surface", m.now ? "bg-tertiary" : "bg-primary")}
                />
                <div className={cn("text-label-lg", m.now ? "text-tertiary" : "text-primary")}>{m.year}</div>
                <div className="text-title-md">{m.text}</div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>
    </>
  )
}
