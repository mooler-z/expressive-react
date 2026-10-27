"use client"

import * as React from "react"
import { Form, Input, TextField } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { BrandLogo, DecorShape, SimpleFooter, StaggerIn, Tilt } from "./marketing-shared"

const BARS = [40, 62, 48, 75, 58, 88, 70, 95, 82, 100]
const STATS = [
  ["400+", "teams"],
  ["12", "regions"],
  ["4 min", "to root cause"],
  ["−22%", "cloud spend"],
]

/** Variant 05 · Split — full-height primary panel with an email capture, live service card opposite. */
export function LandingSplit() {
  const [email, setEmail] = React.useState("")
  return (
    <div className="bg-surface font-sans text-on-surface">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col bg-primary p-6 text-on-primary md:p-12">
          <BrandLogo className="[&>span:first-child]:bg-on-primary [&>span:first-child]:text-primary" />
          <StaggerIn className="my-auto max-w-xl py-16">
            <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-lg">
              Ship on Friday. Sleep on Saturday.
            </h1>
            <p className="mt-5 text-body-lg opacity-90 md:text-title-lg md:font-normal">
              One control plane for every cluster, pipeline and policy. Free for teams up to 10.
            </p>
            <Form
              className="mt-8 flex max-w-md items-center gap-2 rounded-full bg-on-primary/15 p-1.5 pl-5"
              onSubmit={(e) => {
                e.preventDefault()
                setEmail("")
                snackbar("Invite sent — check your inbox")
              }}
            >
              <TextField aria-label="Work email" type="email" value={email} onChange={setEmail} className="min-w-0 flex-1">
                <Input
                  placeholder="you@company.com"
                  className="h-11 w-full bg-transparent text-body-lg text-on-primary outline-none placeholder:text-on-primary/60"
                />
              </TextField>
              <Button type="submit" className="h-11 bg-on-primary px-5 text-primary">
                Get started
              </Button>
            </Form>
            <p className="mt-3 text-body-sm opacity-75">No card. Cancel by closing the tab.</p>
          </StaggerIn>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-label-lg opacity-80">
            <span>SOC 2 Type II</span>
            <span>ISO 27001</span>
            <span>99.99% SLA</span>
          </div>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden bg-primary-container p-6 md:p-12">
          <DecorShape
            shape="sunny"
            cycle={["sunny", "cookie12", "clover8"]}
            interval={3698}
            spin={90}
            className="absolute -top-24 -right-24 size-[420px] text-primary/10"
          />
          <div className="relative w-full max-w-md py-8">
            <Tilt max={6} className="rounded-xl bg-surface p-5 text-on-surface shadow-3">
              <div className="flex items-center justify-between">
                <span className="text-title-md">checkout-api</span>
                <span className="inline-flex h-8 items-center rounded-sm bg-tertiary-container px-3 text-label-lg text-on-tertiary-container">
                  Healthy
                </span>
              </div>
              <div className="mt-4 flex h-28 items-end gap-1.5">
                {BARS.map((h, i) => (
                  <span key={i} className={cn("flex-1 rounded-t-sm", i === BARS.length - 1 ? "bg-primary" : "bg-primary/30")} style={{ height: `${h}%` }} />
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  ["p95", "182 ms"],
                  ["Errors", "0.02%"],
                  ["Deploys", "41"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-md bg-surface-container p-2">
                    <dt className="text-label-sm text-on-surface-variant">{k}</dt>
                    <dd className="text-title-sm tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
            </Tilt>
            <div className="absolute top-2 -left-4 flex animate-float items-center gap-2 rounded-full bg-tertiary px-4 py-2 text-label-lg text-on-tertiary shadow-3 motion-reduce:animate-none">
              <Icon size={20} filled>
                verified
              </Icon>
              Policy passed
            </div>
            <div className="absolute -right-2 bottom-2 flex animate-float items-center gap-2 rounded-full bg-inverse-surface px-4 py-2 text-label-lg text-inverse-on-surface shadow-3 [animation-delay:-3s] motion-reduce:animate-none">
              <Icon size={20}>rocket_launch</Icon>
              Promoted to 100%
            </div>
          </div>
        </div>
      </div>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-outline-variant md:grid-cols-4">
          {STATS.map(([v, l]) => (
            <Reveal key={l} className="bg-surface p-6">
              <div className="text-display-sm font-semibold text-primary tabular-nums">{v}</div>
              <div className="text-body-md text-on-surface-variant">{l}</div>
            </Reveal>
          ))}
        </div>
      </section>
      <SimpleFooter />
    </div>
  )
}
