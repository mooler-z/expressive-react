"use client"

import * as React from "react"

import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { Switch } from "@/components/ui/switch"
import { TextField } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Notifications 03 · Alert rules
 * Threshold rules written as sentences, each with a severity, an on/off switch and delete
 * with undo. New rule opens an inline builder.
 */

export type Severity = "Critical" | "High" | "Medium"

export interface AlertRule {
  id: string
  metric: string
  op: string
  value: string
  window: string
  action: string
  severity: Severity
  enabled: boolean
}

export interface Notifications3Props {
  rules?: AlertRule[]
  metrics?: string[]
  actions?: string[]
  onChange?: (rules: AlertRule[]) => void
  className?: string
}

const RULES: AlertRule[] = [
  { id: "1", metric: "Players online", op: "drops by", value: "20%", window: "10 min", action: "Page on-call", severity: "Critical", enabled: true },
  { id: "2", metric: "Login error rate", op: "rises above", value: "2%", window: "5 min", action: "Post to #live-ops", severity: "High", enabled: true },
  { id: "3", metric: "Queue time p95 · Ranked", op: "rises above", value: "120 s", window: "15 min", action: "Post to #matchmaking", severity: "Medium", enabled: true },
  { id: "4", metric: "Store revenue", op: "drops by", value: "30%", window: "1 hour", action: "Email the economy team", severity: "Medium", enabled: false },
]
const METRICS = ["Players online", "Login error rate", "Queue time p95 · Ranked", "Store revenue", "Crash rate"]
const ACTIONS = ["Page on-call", "Post to #live-ops", "Post to #matchmaking", "Email the economy team"]
const WINDOWS = ["5 min", "10 min", "15 min", "1 hour"]
const SEVERITY_CLASS: Record<Severity, string> = {
  Critical: "bg-error text-on-error",
  High: "bg-error-container text-on-error-container",
  Medium: "bg-tertiary-container text-on-tertiary-container",
}

export function Notifications3({ rules: initial = RULES, metrics = METRICS, actions = ACTIONS, onChange, className }: Notifications3Props) {
  const [rules, setRulesState] = React.useState(initial)
  const [draft, setDraft] = React.useState<Omit<AlertRule, "id" | "enabled"> | null>(null)
  const setRules = (next: AlertRule[] | ((r: AlertRule[]) => AlertRule[])) =>
    setRulesState((cur) => {
      const value = typeof next === "function" ? next(cur) : next
      onChange?.(value)
      return value
    })

  const remove = (rule: AlertRule) => {
    setRules((list) => list.filter((r) => r.id !== rule.id))
    snackbar("Rule deleted", { action: { label: "Undo", onAction: () => setRules((list) => [...list, rule].sort((a, b) => a.id.localeCompare(b.id))) } })
  }

  const create = () => {
    if (!draft) return
    setRules((list) => [...list, { ...draft, id: String(Date.now()), enabled: true }])
    setDraft(null)
    snackbar("Rule created")
  }

  return (
    <div className={cn("bg-surface", className)}>
      <div className="flex flex-wrap items-center gap-3 px-4 py-4 md:px-6">
        <div className="min-w-0 flex-1">
          <h3 className="text-title-lg font-medium">Alert rules</h3>
          <p className="text-body-sm text-on-surface-variant">Checked every minute against live metrics for Ember Tactics.</p>
        </div>
        {!draft && (
          <Button
            className="pr-4 pl-3"
            onPress={() => setDraft({ metric: "Crash rate", op: "rises above", value: "1%", window: "15 min", action: "Page on-call", severity: "High" })}
          >
            <Icon>add</Icon>
            New rule
          </Button>
        )}
      </div>
      {draft && (
        <section aria-label="New rule" className="mx-4 mb-4 animate-fade-up rounded-xl border border-primary/40 bg-surface-container-low p-4 md:mx-6 md:p-5">
          <div className="text-title-sm">New rule</div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-body-lg">
            <span>When</span>
            <Pick label="Metric" value={draft.metric} options={metrics} onChange={(metric) => setDraft({ ...draft, metric })} className="w-56" />
            <Pick label="Condition" value={draft.op} options={["rises above", "drops by"]} onChange={(op) => setDraft({ ...draft, op })} className="w-40" />
            <TextField aria-label="Threshold" value={draft.value} onChange={(value) => setDraft({ ...draft, value })} density="xs" className="w-24" />
            <span>within</span>
            <Pick label="Window" value={draft.window} options={WINDOWS} onChange={(window) => setDraft({ ...draft, window })} className="w-32" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-body-lg">
            <span>then</span>
            <Pick label="Action" value={draft.action} options={actions} onChange={(action) => setDraft({ ...draft, action })} className="w-60" />
            <span id="ns3-sev" className="ml-2 text-body-md text-on-surface-variant">
              Severity
            </span>
            <SegmentedButtonGroup aria-labelledby="ns3-sev" selectedKeys={[draft.severity]} onSelectionChange={(k) => setDraft({ ...draft, severity: ([...k][0] as Severity) ?? draft.severity })}>
              {(["Critical", "High", "Medium"] as const).map((s) => (
                <SegmentedButton key={s} id={s}>
                  {s}
                </SegmentedButton>
              ))}
            </SegmentedButtonGroup>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="text" onPress={() => setDraft(null)}>
              Cancel
            </Button>
            <Button isDisabled={!draft.value.trim()} onPress={create}>
              Create rule
            </Button>
          </div>
        </section>
      )}
      <ul className="border-t border-outline-variant">
        {rules.map((r) => (
          <li key={r.id} className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-outline-variant/60 px-4 py-3 transition-opacity last:border-b-0 md:px-6", !r.enabled && "opacity-60")}>
            <StatusBadge size="md" className={cn("w-[72px] justify-center", SEVERITY_CLASS[r.severity])}>
              {r.severity}
            </StatusBadge>
            <div className="min-w-[min(100%,240px)] flex-1">
              <div className="text-body-lg">
                When <span className="font-medium">{r.metric}</span> {r.op} <span className="font-medium">{r.value}</span> within {r.window}
              </div>
              <div className="inline-flex items-center gap-1 text-body-sm text-on-surface-variant">
                <Icon size={16}>subdirectory_arrow_right</Icon>
                {r.action}
              </div>
            </div>
            <Switch aria-label={`${r.metric} rule enabled`} isSelected={r.enabled} onChange={(enabled) => setRules((list) => list.map((x) => (x.id === r.id ? { ...x, enabled } : x)))} />
            <IconButton aria-label={`Delete ${r.metric} rule`} onPress={() => remove(r)}>
              <Icon>delete</Icon>
            </IconButton>
          </li>
        ))}
      </ul>
      {rules.length === 0 && (
        <EmptyState size="sm" variant="plain" shape={false} icon="notifications_off" title="No alert rules" description="Create one to get paged when a metric moves." className="py-10" />
      )}
    </div>
  )
}

function Pick({ label, value, options, onChange, className }: { label: string; value: string; options: string[]; onChange: (v: string) => void; className?: string }) {
  return (
    <Select aria-label={label} selectedKey={value} onSelectionChange={(k) => onChange(String(k))} density="xs" className={className}>
      {options.map((o) => (
        <SelectItem key={o} id={o}>
          {o}
        </SelectItem>
      ))}
    </Select>
  )
}
