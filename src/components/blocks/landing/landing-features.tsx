"use client"

import * as React from "react"
import { Button as AriaButton } from "react-aria-components"

import { PageIntro } from "@/components/blocks/landing/landing-shared"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { Shape } from "@/components/ui/shape"
import { cn } from "@/lib/utils"

/*
 * Features · list-detail canonical layout.
 * Expanded windows show both panes; below 840px the list opens the detail pane in its place.
 */

type FeatureKey = "inventory" | "policy" | "rollout" | "observe" | "integrations"

const FEATURES: { key: FeatureKey; icon: string; title: string; short: string; body: string; points: string[] }[] = [
  {
    key: "inventory",
    icon: "inventory_2",
    title: "Inventory that stays true",
    short: "Every cluster, workload and owner",
    body: "Connect read-only roles and Kestrel discovers clusters, namespaces, workloads and owners. Drift is flagged in minutes, not at audit time.",
    points: ["AWS, GCP, Azure, bare metal, edge", "Ownership inferred from repos and on-call", "Drift alerts within 5 minutes", "Export to your CMDB, or replace it"],
  },
  {
    key: "policy",
    icon: "policy",
    title: "Policy with a preview button",
    short: "Guardrails as code, enforced everywhere",
    body: "Write guardrails in Rego or plain YAML. See exactly what a rule would block before you turn it on, then enforce at plan, deploy and runtime.",
    points: ["OPA / Rego or plain YAML", "Preview against live inventory", "Exceptions with owners and expiry", "CIS benchmarks built in"],
  },
  {
    key: "rollout",
    icon: "rocket_launch",
    title: "Rollouts that watch themselves",
    short: "Canary, blue-green, automatic rollback",
    body: "Pick canary, blue-green or all-at-once. Kestrel compares golden signals against the baseline and pauses or rolls back automatically.",
    points: ["Golden-signal comparison vs. baseline", "Auto-pause and rollback", "Parallel region promotion", "Works with Argo CD and Flux"],
  },
  {
    key: "observe",
    icon: "monitoring",
    title: "Observability without tab sprawl",
    short: "Traces, logs and metrics per deploy",
    body: "Every deploy gets a correlated view of traces, logs and metrics. When something breaks, the incident timeline is already written.",
    points: ["OpenTelemetry native", "Deploy markers on every chart", "Root cause in 4 min median", "Slack and PagerDuty handoff"],
  },
  {
    key: "integrations",
    icon: "extension",
    title: "Integrations",
    short: "50+ tools you already pay for",
    body: "Kestrel plugs into your source control, CI, observability and identity stack. Nothing to rip out on day one.",
    points: ["GitHub, GitLab, Bitbucket", "Terraform and Pulumi", "Datadog, Grafana, Honeycomb", "Okta, Entra ID, Google SSO"],
  },
]

const CLUSTERS = [
  { name: "kestrel-prod-01", region: "eu-central-1", ok: true },
  { name: "edge-tokyo", region: "ap-northeast-1", ok: true },
  { name: "batch-oregon", region: "us-west-2", ok: false },
]

const SPANS = [
  { name: "gateway", left: 0, width: 100, tone: "bg-primary" },
  { name: "auth", left: 4, width: 16, tone: "bg-tertiary" },
  { name: "checkout-api", left: 22, width: 70, tone: "bg-primary" },
  { name: "ledger", left: 30, width: 32, tone: "bg-secondary" },
  { name: "billing-sync", left: 64, width: 26, tone: "bg-error" },
]

const INTEGRATIONS = ["GitHub", "GitLab", "Terraform", "Argo CD", "Datadog", "Grafana", "PagerDuty", "Slack", "Okta", "Snowflake", "Jira"]

/** The illustrated preview under each feature. */
function FeaturePreview({ feature }: { feature: FeatureKey }) {
  switch (feature) {
    case "inventory":
      return (
        <>
          <div className="flex items-center gap-2 text-label-lg text-on-surface-variant">
            <Icon size={20}>search</Icon>12 clusters · 3 providers
          </div>
          <ul className="mt-3 divide-y divide-outline-variant text-body-md">
            {CLUSTERS.map((c) => (
              <li key={c.name} className="flex items-center gap-3 py-3">
                <span className={cn("size-2 rounded-full", c.ok ? "bg-tertiary" : "bg-error")} />
                <span className="flex-1 font-medium">{c.name}</span>
                <span className="hidden text-on-surface-variant sm:inline">{c.region}</span>
                <span
                  className={cn(
                    "rounded-sm px-2 py-0.5 text-label-md",
                    c.ok ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container",
                  )}
                >
                  {c.ok ? "Healthy" : "Drift"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )
    case "policy":
      return (
        <>
          <div className="flex items-center gap-2 text-label-lg text-on-surface-variant">
            <Icon size={20}>policy</Icon>policy/no-public-buckets.rego
          </div>
          <pre className="relative mt-3 overflow-x-auto rounded-md bg-surface-container-lowest p-4 font-mono text-body-sm leading-6">
            <code>
              <span className="text-tertiary">deny</span>
              {"[msg] {\n  input.kind == "}
              <span className="text-primary">"Bucket"</span>
              {"\n  input.acl == "}
              <span className="text-primary">"public-read"</span>
              {"\n  msg := "}
              <span className="text-primary">"Buckets must not be public"</span>
              {"\n}"}
            </code>
          </pre>
          <div className="mt-3 flex items-center gap-2 rounded-md bg-tertiary-container px-3 py-2 text-body-sm text-on-tertiary-container">
            <Icon size={18} filled>
              check_circle
            </Icon>
            Preview: 0 of 48 resources would be blocked
          </div>
        </>
      )
    case "rollout":
      return (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-title-md">checkout-api · v4.2.0</span>
            <span className="inline-flex h-7 items-center gap-1.5 rounded-sm bg-secondary-container pr-3 pl-2 text-label-md whitespace-nowrap text-on-secondary-container">
              <span className="size-3 animate-spin motion-reduce:animate-none" style={{ animationDuration: "3s" }}>
                <Shape cycle={["cookie7", "clover4", "sunny"]} interval={650} className="size-full" />
              </span>
              Canary · 40%
            </span>
          </div>
          <div className="mt-4 flex h-2 items-center gap-1">
            <div className="h-full w-[40%] rounded-full bg-primary" />
            <div className="h-full flex-1 rounded-full bg-secondary-container" />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              ["p95", "182 ms"],
              ["Errors", "0.02%"],
              ["Saturation", "61%"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-md bg-surface-container p-3">
                <dt className="text-label-md text-on-surface-variant">{k}</dt>
                <dd className="text-title-md tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </>
      )
    case "observe":
      return (
        <>
          <div className="flex items-center justify-between text-label-lg text-on-surface-variant">
            <span>Trace · POST /checkout</span>
            <span className="font-mono">412 ms</span>
          </div>
          <div className="mt-4 space-y-2 font-mono text-body-sm">
            {SPANS.map((s) => (
              <div key={s.name} className="grid grid-cols-[96px_1fr] items-center gap-3">
                <span className="truncate text-on-surface-variant">{s.name}</span>
                <div className="relative h-6 rounded-xs bg-surface-container">
                  <span className={cn("absolute inset-y-1 rounded-xs", s.tone)} style={{ left: `${s.left}%`, width: `${s.width}%` }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )
    case "integrations":
      return (
        <div className="flex flex-wrap gap-2">
          {INTEGRATIONS.map((n) => (
            <span key={n} className="inline-flex h-10 items-center rounded-full bg-surface-container-high px-4 text-label-lg">
              {n}
            </span>
          ))}
          <span className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-label-lg text-on-primary">+ 40 more</span>
        </div>
      )
  }
}

export function LandingFeatures() {
  const [active, setActive] = React.useState(0)
  // Compact/medium windows: the list opens the detail pane in its place.
  const [detailOpen, setDetailOpen] = React.useState(false)
  const detailRef = React.useRef<HTMLDivElement>(null)
  const feature = FEATURES[active]

  const pick = (i: number) => {
    setActive(i)
    setDetailOpen(true)
    // Single-pane windows: bring the detail into view.
    if (window.innerWidth < 840) requestAnimationFrame(() => detailRef.current?.scrollIntoView({ block: "nearest" }))
  }

  return (
    <>
      <PageIntro title="Everything your platform team does, with fewer tabs.">
        Inventory, policy, rollouts and observability share one data model, so a change in one place shows up everywhere else.
      </PageIntro>
      <section className="grid grid-cols-1 items-start gap-6 px-4 pb-16 md:px-6 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:px-10">
        <div className={cn(detailOpen && "hidden lg:block")}>
          <ul className="space-y-1 rounded-xl bg-surface-container-low p-2">
            {FEATURES.map((f, i) => {
              const on = i === active
              return (
                <li key={f.key}>
                  <AriaButton
                    onPress={() => pick(i)}
                    aria-current={on ? "true" : undefined}
                    className={cn(
                      "state-layer focus-ring relative flex w-full cursor-pointer items-center gap-4 rounded-lg p-3 text-left outline-none",
                      "transition-[background-color,color] duration-(--md-spring-default-effects-duration) ease-default-effects",
                      on ? "lg:bg-secondary-container lg:text-on-secondary-container" : "text-on-surface",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-12 shrink-0 place-items-center shape-morph",
                        on ? "rounded-[24px] bg-primary text-on-primary" : "rounded-md bg-primary-container text-on-primary-container",
                      )}
                    >
                      <Icon>{f.icon}</Icon>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-title-md">{f.title}</span>
                      <span className="block truncate text-body-md opacity-80">{f.short}</span>
                    </span>
                    <Icon className="lg:hidden">chevron_right</Icon>
                    <Ripple />
                  </AriaButton>
                </li>
              )
            })}
          </ul>
        </div>

        <div className={cn(!detailOpen && "hidden lg:block")}>
          <div
            ref={detailRef}
            key={feature.key}
            className="scroll-mt-20 rounded-xl bg-surface-container-low p-6 animate-[m3-landing-detail-in_450ms_cubic-bezier(0.05,0.7,0.1,1)] motion-reduce:animate-none md:p-8"
          >
            <AriaButton
              onPress={() => setDetailOpen(false)}
              className="state-layer focus-ring relative -ml-2 mb-4 inline-flex h-10 cursor-pointer items-center gap-1 rounded-full pr-4 pl-2 text-label-lg text-primary lg:hidden"
            >
              <Icon size={20}>arrow_back</Icon>All features
              <Ripple />
            </AriaButton>
            <span className="grid size-14 place-items-center rounded-full bg-primary text-on-primary">
              <Icon size={28}>{feature.icon}</Icon>
            </span>
            <h2 className="mt-5 text-headline-md font-medium">{feature.title}</h2>
            <p className="mt-3 max-w-2xl text-body-lg text-on-surface-variant">{feature.body}</p>
            <ul className="mt-5 grid gap-x-6 gap-y-2 text-body-md sm:grid-cols-2">
              {feature.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3">
                  <Icon size={20} className="text-primary">
                    check_circle
                  </Icon>
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-lg bg-surface p-4 shadow-1 md:p-5">
              <FeaturePreview feature={feature.key} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
