"use client"

import { Button as AriaButton } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Reveal } from "@/components/ui/reveal"
import { Ripple } from "@/components/ui/ripple"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { BrandLogo, NavLinks, SimpleFooter, StaggerIn, Tilt, copyWithSnackbar } from "./marketing-shared"

const LINES: { kind: "cmd" | "ok" | "wait"; text: string }[] = [
  { kind: "cmd", text: "kestrel connect aws --role read-only" },
  { kind: "ok", text: "Discovered 12 clusters · 418 workloads · 3 providers" },
  { kind: "cmd", text: "kestrel policy preview no-public-buckets" },
  { kind: "ok", text: "0 of 48 buckets would be blocked" },
  { kind: "cmd", text: "kestrel deploy checkout-api --canary 10%" },
  { kind: "wait", text: "canary healthy · p95 176 ms · promoting" },
]

const SURFACES = [
  { icon: "terminal", title: "CLI", body: "See drift before it ships", snippet: "kestrel diff" },
  { icon: "api", title: "REST + gRPC", body: "Versioned, typed, boring", snippet: "GET /v1/clusters" },
  { icon: "code", title: "SDKs", body: "Go, TypeScript, Python", snippet: "npm i @kestrel/grid" },
  { icon: "webhook", title: "Webhooks", body: "Signed, retried, logged", snippet: "deploy.promoted" },
]

function CopyPill({ text, className, children }: { text: string; className?: string; children?: React.ReactNode }) {
  return (
    <AriaButton
      onPress={() => copyWithSnackbar(text)}
      className={cn("state-layer focus-ring relative cursor-pointer font-mono outline-none", className)}
    >
      {children ?? text}
      <Ripple />
    </AriaButton>
  )
}

const fade = (i: number) => ({
  className: "animate-[m3-fade-up_700ms_var(--md-easing-emphasized-decelerate)_backwards] motion-reduce:animate-none",
  style: { animationDelay: `${300 + i * 450}ms` },
})

/** Variant 03 · Terminal — inverse, developer-first hero with a typed-out CLI session. */
export function LandingTerminal() {
  return (
    <div className="bg-surface font-sans text-on-surface">
      <div className="bg-inverse-surface text-inverse-on-surface">
        <header className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 md:px-8">
          <BrandLogo />
          <NavLinks className="ml-6" linkClassName="text-inverse-on-surface/80" />
          <CopyPill
            text="brew install kestrel"
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-full border border-inverse-on-surface/25 px-4 text-label-lg"
          >
            <Icon size={18}>content_copy</Icon>brew install kestrel
          </CopyPill>
        </header>
        <section className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
            <StaggerIn>
              <h1 className="text-display-sm font-semibold tracking-tight text-balance md:text-display-lg">
                Three commands to a calmer on-call.
              </h1>
              <p className="mt-5 max-w-lg text-body-lg opacity-80">
                Kestrel Grid is CLI-first and API-everything. The console is nice. You'll mostly live in your terminal.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="md" className="bg-inverse-primary text-on-primary-fixed" onPress={() => snackbar("API key created")}>
                  Get an API key
                  <Icon>key</Icon>
                </Button>
                <Button
                  size="md"
                  variant="outlined"
                  className="border-inverse-on-surface/25 text-inverse-on-surface"
                  onPress={() => snackbar("Opening docs")}
                >
                  <Icon>menu_book</Icon>
                  Read the docs
                </Button>
              </div>
            </StaggerIn>
            <Tilt max={4} className="overflow-hidden rounded-xl bg-scrim/60 shadow-5 ring-1 ring-inverse-on-surface/10">
              <div className="flex items-center gap-2 border-b border-inverse-on-surface/10 px-4 py-3">
                <span className="size-3 rounded-full bg-error" />
                <span className="size-3 rounded-full bg-secondary-fixed-dim" />
                <span className="size-3 rounded-full bg-tertiary-fixed-dim" />
                <span className="ml-3 font-mono text-label-md opacity-60">~/infra · zsh</span>
              </div>
              <div className="space-y-2 p-5 font-mono text-body-md leading-7">
                {LINES.map((l, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex gap-3",
                      l.kind === "ok" ? "text-tertiary-fixed-dim" : l.kind === "wait" ? "text-inverse-primary" : "text-inverse-on-surface",
                      fade(i).className,
                    )}
                    style={fade(i).style}
                  >
                    <span className="opacity-60">{l.kind === "cmd" ? "$" : l.kind === "ok" ? "✓" : "…"}</span>
                    <span>{l.text}</span>
                  </div>
                ))}
                <div className={cn("flex gap-3", fade(LINES.length + 0.4).className)} style={fade(LINES.length + 0.4).style}>
                  <span className="opacity-60">$</span>
                  <span className="inline-block h-5 w-2.5 translate-y-1 animate-[m3-caret-blink_1s_steps(1)_infinite] bg-inverse-primary" />
                </div>
              </div>
            </Tilt>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-3 pb-24 sm:grid-cols-2 lg:grid-cols-4">
            {SURFACES.map((s) => (
              <Reveal key={s.title} className="rounded-xl bg-inverse-on-surface/5 p-5 ring-1 ring-inverse-on-surface/10">
                <Icon className="text-inverse-primary">{s.icon}</Icon>
                <div className="mt-4 text-title-md">{s.title}</div>
                <p className="text-body-sm opacity-70">{s.body}</p>
                <CopyPill
                  text={s.snippet}
                  className="mt-4 flex w-full items-center justify-between gap-2 rounded-md bg-scrim/40 px-3 py-2 text-body-sm"
                >
                  <span className="truncate">{s.snippet}</span>
                  <Icon size={18} className="opacity-70">
                    content_copy
                  </Icon>
                </CopyPill>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
      <SimpleFooter />
    </div>
  )
}
