import { Icon } from "@/components/ui/icon"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { cn } from "@/lib/utils"

/* Product "screenshots" built from tokens, shared by the feature pages. */

const CLUSTERS = [
  { name: "kestrel-prod-01", region: "eu-central-1", ok: true },
  { name: "edge-tokyo", region: "ap-northeast-1", ok: true },
  { name: "batch-oregon", region: "us-west-2", ok: false },
]

export function InventoryPreview() {
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
}

export function PolicyPreview() {
  return (
    <>
      <div className="flex items-center gap-2 text-label-lg text-on-surface-variant">
        <Icon size={20}>policy</Icon>policy/no-public-buckets.rego
      </div>
      <pre className="relative mt-3 overflow-x-auto rounded-md bg-surface-container-lowest p-4 font-mono text-body-sm leading-6">
        <code>
          <span className="text-tertiary">deny</span>[msg] {"{"}
          {"\n  input.kind == "}
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
}

export function RolloutPreview() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-title-md">checkout-api · v4.2.0</span>
        <span className="inline-flex h-7 items-center gap-1.5 rounded-sm bg-secondary-container pr-3 pl-2 text-label-md whitespace-nowrap text-on-secondary-container">
          <LoadingIndicator aria-hidden size={14} className="text-current" />
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
}

const SPANS = [
  { name: "gateway", left: 0, width: 100, tone: "bg-primary" },
  { name: "auth", left: 4, width: 16, tone: "bg-tertiary" },
  { name: "checkout-api", left: 22, width: 70, tone: "bg-primary" },
  { name: "ledger", left: 30, width: 32, tone: "bg-secondary" },
  { name: "billing-sync", left: 64, width: 26, tone: "bg-error" },
]

export function TracePreview() {
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
}

export const INTEGRATIONS = ["GitHub", "GitLab", "Terraform", "Argo CD", "Datadog", "Grafana", "PagerDuty", "Slack", "Okta", "Snowflake", "Jira"]

export function IntegrationsPreview({ chipClassName = "bg-surface-container-high" }: { chipClassName?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {INTEGRATIONS.map((n) => (
        <span key={n} className={cn("inline-flex h-10 items-center rounded-full px-4 text-label-lg", chipClassName)}>
          {n}
        </span>
      ))}
      <span className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-label-lg text-on-primary">+ 40 more</span>
    </div>
  )
}
