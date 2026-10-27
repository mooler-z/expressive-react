"use client"

import * as React from "react"
import { Button as AriaButton } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"

import { BrandLogo, NavLinks, SimpleFooter, StaggerIn } from "./marketing-shared"

const REGIONS = [
  { city: "Frankfurt", code: "eu-central-1", ms: 41, x: 51, y: 30 },
  { city: "Stockholm", code: "eu-north-1", ms: 38, x: 53, y: 22 },
  { city: "N. Virginia", code: "us-east-1", ms: 96, x: 27, y: 37 },
  { city: "Oregon", code: "us-west-2", ms: 112, x: 14, y: 34 },
  { city: "São Paulo", code: "sa-east-1", ms: 128, x: 33, y: 70 },
  { city: "Tokyo", code: "ap-northeast-1", ms: 58, x: 85, y: 38 },
  { city: "Singapore", code: "ap-southeast-1", ms: 72, x: 77, y: 58 },
  { city: "Sydney", code: "ap-southeast-2", ms: 164, x: 88, y: 76 },
]

/** Variant 07 · Global — a dotted world map with pulsing region pins and a promote toolbar. */
export function LandingGlobal() {
  const [state, setState] = React.useState<"idle" | "busy" | "done">("idle")
  return (
    <div className="bg-surface font-sans text-on-surface">
      <header className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 md:px-8">
        <BrandLogo />
        <NavLinks className="mx-auto" />
        <Button className="ml-auto px-5 lg:ml-0" onPress={() => snackbar("Let's get you set up")}>
          Start free
        </Button>
      </header>
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <StaggerIn className="pt-8 pb-6 text-center lg:pt-12">
          <h1 className="mx-auto max-w-4xl text-display-sm font-semibold tracking-tight text-balance md:text-display-lg">
            Every region. One switch.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-on-surface-variant">
            Promote a release across 12 regions on 3 clouds with one command. Kestrel picks the order, watches each hop, and stops
            if something looks off.
          </p>
        </StaggerIn>
        <Reveal className="relative mt-6 h-[280px] overflow-hidden md:aspect-[2/1] md:h-auto rounded-2xl bg-surface-container-low [background-image:radial-gradient(var(--md-outline-variant)_1.2px,transparent_1.2px)] [background-size:14px_14px]">
          {REGIONS.map((r, i) => (
            <AriaButton
              key={r.city}
              aria-label={`${r.city} · ${r.ms} ms`}
              onPress={() => snackbar(`${r.city} · ${r.code} · p95 ${r.ms} ms`)}
              className="group focus-ring absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full outline-none"
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
            >
              <span
                className="absolute inset-0 animate-ping rounded-full bg-primary/40 motion-reduce:animate-none"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
              <span className="relative block size-3.5 rounded-full bg-primary ring-4 ring-surface-container-low transition-[scale] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-data-hovered:scale-150 group-data-focus-visible:scale-150" />
              <span className="pointer-events-none absolute top-full left-1/2 mt-2 hidden -translate-x-1/2 rounded-full bg-inverse-surface px-3 py-1 text-label-md whitespace-nowrap text-inverse-on-surface shadow-2 group-data-focus-visible:block group-data-hovered:block">
                {r.city} · {r.ms} ms
              </span>
            </AriaButton>
          ))}
          <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-center gap-3 rounded-[28px] bg-surface/90 p-2 pl-5 shadow-2 backdrop-blur sm:right-auto">
            <span className="text-label-lg">Promote v4.2.0</span>
            <ConnectedButtonGroup aria-label="Rollout order" defaultSelectedKeys={["eu"]} size="xs">
              <ConnectedButton id="eu">EU first</ConnectedButton>
              <ConnectedButton id="us">US first</ConnectedButton>
              <ConnectedButton id="all">All at once</ConnectedButton>
            </ConnectedButtonGroup>
            <Button
              size="xs"
              isPending={state === "busy"}
              className="bg-tertiary px-4 text-on-tertiary"
              onPress={() => {
                setState("busy")
                setTimeout(() => {
                  setState("done")
                  snackbar("Live in 8 regions")
                }, 1400)
              }}
            >
              {state === "busy" ? "Promoting…" : state === "done" ? "Live in 8 regions" : "Go"}
            </Button>
          </div>
        </Reveal>
      </section>
      <section className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-3 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.filter((r) => r.code !== "sa-east-1").map((r) => (
            <Reveal key={r.city} className="flex items-center gap-3 rounded-lg bg-surface-container-low p-4">
              <span className="size-2.5 rounded-full bg-tertiary" />
              <div className="min-w-0 flex-1">
                <div className="text-title-sm">{r.city}</div>
                <div className="font-mono text-label-sm text-on-surface-variant">{r.code}</div>
              </div>
              <span className="text-label-lg tabular-nums">{r.ms} ms</span>
            </Reveal>
          ))}
        </div>
      </section>
      <SimpleFooter />
    </div>
  )
}

