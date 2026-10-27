"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

import {
  IntegrationsPreview,
  InventoryPreview,
  PolicyPreview,
  RolloutPreview,
  TracePreview,
} from "./marketing-feature-previews"

const FEATURES = [
  {
    key: "inventory",
    icon: "inventory_2",
    title: "Inventory that stays true",
    short: "Every cluster, workload and owner",
    body: "Connect read-only roles and Kestrel discovers clusters, namespaces, workloads and owners. Drift is flagged in minutes, not at audit time.",
    points: ["AWS, GCP, Azure, bare metal, edge", "Ownership inferred from repos and on-call", "Drift alerts within 5 minutes", "Export to your CMDB, or replace it"],
    preview: <InventoryPreview />,
  },
  {
    key: "policy",
    icon: "policy",
    title: "Policy with a preview button",
    short: "Guardrails as code, enforced everywhere",
    body: "Write guardrails in Rego or plain YAML. See exactly what a rule would block before you turn it on, then enforce at plan, deploy and runtime.",
    points: ["OPA / Rego or plain YAML", "Preview against live inventory", "Exceptions with owners and expiry", "CIS benchmarks built in"],
    preview: <PolicyPreview />,
  },
  {
    key: "rollout",
    icon: "rocket_launch",
    title: "Rollouts that watch themselves",
    short: "Canary, blue-green, automatic rollback",
    body: "Pick canary, blue-green or all-at-once. Kestrel compares golden signals against the baseline and pauses or rolls back automatically.",
    points: ["Golden-signal comparison vs. baseline", "Auto-pause and rollback", "Parallel region promotion", "Works with Argo CD and Flux"],
    preview: <RolloutPreview />,
  },
  {
    key: "observe",
    icon: "monitoring",
    title: "Observability without tab sprawl",
    short: "Traces, logs and metrics per deploy",
    body: "Every deploy gets a correlated view of traces, logs and metrics. When something breaks, the incident timeline is already written.",
    points: ["OpenTelemetry native", "Deploy markers on every chart", "Root cause in 4 min median", "Slack and PagerDuty handoff"],
    preview: <TracePreview />,
  },
  {
    key: "integrations",
    icon: "extension",
    title: "Integrations",
    short: "50+ tools you already pay for",
    body: "Kestrel plugs into your source control, CI, observability and identity stack. Nothing to rip out on day one.",
    points: ["GitHub, GitLab, Bitbucket", "Terraform and Pulumi", "Datadog, Grafana, Honeycomb", "Okta, Entra ID, Google SSO"],
    preview: <IntegrationsPreview />,
  },
]

/**
 * Features page in the M3 list-detail canonical layout: list and detail side by side on large windows,
 * list → detail drill-in (with a back button) on compact ones.
 */
export function FeatureListDetail() {
  const [active, setActive] = React.useState(0)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const feat = FEATURES[active]

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-6 md:px-8 lg:pt-14">
        <h1 className="max-w-3xl text-display-sm font-semibold tracking-tight text-balance lg:text-display-md">
          Everything your platform team does, with fewer tabs.
        </h1>
        <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
          Inventory, policy, rollouts and observability share one data model, so a change in one place shows up
          everywhere else.
        </p>
      </section>
      <section className="grid items-start gap-6 px-4 pb-16 md:px-6 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:px-10">
        <div className={cn("min-w-0", detailOpen && "hidden lg:block")}>
          <ul className="space-y-1 rounded-xl bg-surface-container-low p-2">
            {FEATURES.map((f, i) => {
              const on = i === active
              return (
                <li key={f.key}>
                  <Button
                    variant="text"
                    onPress={() => {
                      setActive(i)
                      setDetailOpen(true)
                    }}
                    aria-current={on || undefined}
                    className={cn(
                      "h-auto w-full min-w-0 justify-start gap-4 rounded-lg p-3 text-start whitespace-normal text-on-surface data-pressed:rounded-lg",
                      on && "lg:bg-secondary-container lg:text-on-secondary-container",
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
                      <span className="block truncate text-body-md font-normal opacity-80">{f.short}</span>
                    </span>
                    <Icon className="lg:hidden">chevron_right</Icon>
                  </Button>
                </li>
              )
            })}
          </ul>
        </div>
        <div className={cn("min-w-0", !detailOpen && "hidden lg:block")}>
          <div
            key={feat.key}
            className="animate-[m3-detail-in_450ms_var(--md-easing-emphasized-decelerate)] rounded-xl bg-surface-container-low p-6 motion-reduce:animate-none md:p-8"
          >
            <Button variant="text" className="mb-4 -ml-2 pl-2 lg:hidden" onPress={() => setDetailOpen(false)}>
              <Icon>arrow_back</Icon>
              All features
            </Button>
            <span className="grid size-14 place-items-center rounded-full bg-primary text-on-primary">
              <Icon size={28}>{feat.icon}</Icon>
            </span>
            <h2 className="mt-5 text-headline-md font-medium">{feat.title}</h2>
            <p className="mt-3 max-w-2xl text-body-lg text-on-surface-variant">{feat.body}</p>
            <ul className="mt-5 grid gap-x-6 gap-y-2 text-body-md sm:grid-cols-2">
              {feat.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3">
                  <Icon size={20} className="text-primary">
                    check_circle
                  </Icon>
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-lg bg-surface p-4 shadow-1 md:p-5">{feat.preview}</div>
          </div>
        </div>
      </section>
    </>
  )
}
