"use client"

import * as React from "react"

import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { SearchBar } from "@/components/ui/search"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import { PageHeader } from "./admin-ui"

type Category = "Source" | "Infrastructure" | "Observability" | "Alerting" | "Identity" | "Data" | "Work"

type Integration = { id: string; name: string; mark: string; tone: string; category: Category; description: string; connected: boolean }

const INTEGRATIONS: Integration[] = [
  { id: "github", name: "GitHub", mark: "GH", tone: "bg-primary text-on-primary", category: "Source", description: "Sync repos, owners and deploy status", connected: true },
  { id: "gitlab", name: "GitLab", mark: "GL", tone: "bg-secondary-container text-on-secondary-container", category: "Source", description: "Pipelines and merge request gates", connected: false },
  { id: "terraform", name: "Terraform", mark: "TF", tone: "bg-primary text-on-primary", category: "Infrastructure", description: "Plan-time policy checks", connected: true },
  { id: "argo", name: "Argo CD", mark: "AR", tone: "bg-tertiary-container text-on-tertiary-container", category: "Infrastructure", description: "GitOps rollouts with auto-promotion", connected: true },
  { id: "datadog", name: "Datadog", mark: "DD", tone: "bg-secondary-container text-on-secondary-container", category: "Observability", description: "Correlate traces with deploys", connected: false },
  { id: "grafana", name: "Grafana", mark: "GF", tone: "bg-tertiary-container text-on-tertiary-container", category: "Observability", description: "Embed Kestrel panels", connected: true },
  { id: "pagerduty", name: "PagerDuty", mark: "PD", tone: "bg-error-container text-on-error-container", category: "Alerting", description: "Route incidents to on-call", connected: true },
  { id: "slack", name: "Slack", mark: "SL", tone: "bg-primary text-on-primary", category: "Alerting", description: "Deploy and incident notifications", connected: true },
  { id: "okta", name: "Okta", mark: "OK", tone: "bg-surface-container-highest text-on-surface-variant", category: "Identity", description: "SSO and SCIM provisioning", connected: true },
  { id: "snowflake", name: "Snowflake", mark: "SF", tone: "bg-secondary-container text-on-secondary-container", category: "Data", description: "Export cost and usage tables", connected: false },
  { id: "jira", name: "Jira", mark: "JR", tone: "bg-primary text-on-primary", category: "Work", description: "Link incidents to issues", connected: false },
  { id: "servicenow", name: "ServiceNow", mark: "SN", tone: "bg-tertiary-container text-on-tertiary-container", category: "Work", description: "Change management approvals", connected: false },
]

const FILTERS: ("All" | Category)[] = ["All", "Source", "Infrastructure", "Observability", "Alerting", "Identity"]

export function AdminIntegrations() {
  const [connected, setConnected] = React.useState(() => new Set(INTEGRATIONS.filter((i) => i.connected).map((i) => i.id)))
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<"All" | Category>("All")

  const q = query.trim().toLowerCase()
  const visible = INTEGRATIONS.filter((i) => (filter === "All" || i.category === filter) && (!q || i.name.toLowerCase().includes(q)))

  const toggle = (i: Integration, on: boolean) => {
    setConnected((s) => {
      const next = new Set(s)
      if (on) next.add(i.id)
      else next.delete(i.id)
      return next
    })
    snackbar(on ? `${i.name} connected` : `${i.name} disconnected`)
  }

  return (
    <div>
      <PageHeader
        title="Integrations"
        description={`${connected.size} of ${INTEGRATIONS.length} connected`}
        actions={
          <Button variant="outlined" className="pr-5" onPress={() => snackbar("Thanks, request sent")}>
            <Icon>add_comment</Icon>
            Request integration
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar
          aria-label="Search integrations"
          placeholder="Search integrations"
          value={query}
          onChange={setQuery}
          className="h-12 min-w-[220px] flex-1 sm:max-w-sm"
        />
        <ChipGroup
          aria-label="Category"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[filter]}
          onSelectionChange={(keys) => {
            const k = [...keys][0] as "All" | Category | undefined
            if (k) setFilter(k)
          }}
        >
          {FILTERS.map((f) => (
            <FilterChip key={f} id={f}>
              {f}
            </FilterChip>
          ))}
        </ChipGroup>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((i) => {
          const on = connected.has(i.id)
          return (
            <article key={i.id} aria-labelledby={`int-${i.id}`} className="flex flex-col rounded-xl bg-surface-container-low p-5">
              <div className="flex items-start gap-3">
                <span aria-hidden className={cn("grid size-12 shrink-0 place-items-center rounded-lg font-mono text-title-md", i.tone)}>
                  {i.mark}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 id={`int-${i.id}`} className="text-title-md">
                    {i.name}
                  </h2>
                  <div className="text-body-sm text-on-surface-variant">{i.category}</div>
                </div>
                <Switch aria-label={`Connect ${i.name}`} isSelected={on} onChange={(v) => toggle(i, v)} />
              </div>
              <p className="mt-3 flex-1 text-body-md text-on-surface-variant">{i.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <StatusBadge variant={on ? "tertiary" : "neutral"} className="h-6">
                  {on ? "Connected" : "Not connected"}
                </StatusBadge>
                <Button variant="text" className="h-9" onPress={() => snackbar(`${i.name} settings`)}>
                  Configure
                </Button>
              </div>
            </article>
          )
        })}
        {visible.length === 0 && (
          <EmptyState
            icon="extension_off"
            title="No integrations match"
            description="Try a different name or category."
            className="rounded-xl bg-surface-container-low sm:col-span-2 xl:col-span-3"
          />
        )}
      </div>
    </div>
  )
}
