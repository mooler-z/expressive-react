"use client"

import * as React from "react"

import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { LinearProgress } from "@/components/ui/progress"
import { snackbar } from "@/components/ui/snackbar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { useAdmin } from "./admin-context"
import { DevCallsChart } from "./admin-charts"
import { Card, CardHead, PageHeader } from "./admin-ui"

type ApiKey = { id: string; name: string; created: string; key: string; scopes: string[]; lastUsed: string }

const KEYS: ApiKey[] = [
  { id: "prod", name: "Production deploy", created: "Mar 3, 2025", key: "ksk_live_9f2a…c41e", scopes: ["deploy", "read"], lastUsed: "2 min ago" },
  { id: "tf", name: "Terraform CI", created: "Jun 12, 2025", key: "ksk_live_31bd…7a02", scopes: ["plan", "read"], lastUsed: "1 h ago" },
  { id: "analytics", name: "Analytics export", created: "Sep 9, 2026", key: "ksk_live_c8e0…19ff", scopes: ["read"], lastUsed: "Yesterday" },
]

const LIMITS = [
  { label: "Requests / min", used: 1240, max: 2000 },
  { label: "Deploys / hour", used: 42, max: 60 },
  { label: "Exports / day", used: 9, max: 10 },
]

type Webhook = { url: string; meta: string; success: string; tone: "tertiary" | "secondary" | "error" }

const WEBHOOKS: Webhook[] = [
  { url: "https://hooks.halide.example/kestrel", meta: "deploy.* · Delivered · 2 min ago", success: "99.9% success", tone: "tertiary" },
  { url: "https://api.northwind.example/events", meta: "incident.* · 3 retries · 14 min ago", success: "97.2% success", tone: "secondary" },
  { url: "https://billing.kestrel.internal/sync", meta: "invoice.paid · Failing · 502", success: "84.0% success", tone: "error" },
]

const DOT = { tertiary: "bg-tertiary", secondary: "bg-secondary", error: "bg-error" } as const

const QUICKSTART = `curl -X POST \\
  https://api.kestrel.io/v1/deploys \\
  -H "Authorization: Bearer $KESTREL_KEY" \\
  -d '{"service":"checkout-api"}'`

export function AdminDevelopers() {
  const { range } = useAdmin()
  const [keys, setKeys] = React.useState(KEYS)

  const revoke = (k: ApiKey) => {
    const index = keys.indexOf(k)
    setKeys((ks) => ks.filter((x) => x.id !== k.id))
    snackbar(`${k.name} key revoked`, {
      action: {
        label: "Undo",
        onAction: () => setKeys((ks) => (ks.some((x) => x.id === k.id) ? ks : [...ks.slice(0, index), k, ...ks.slice(index)])),
      },
    })
  }

  return (
    <div>
      <PageHeader
        title="Developers"
        description="API keys, webhooks and usage"
        actions={
          <>
            <Button variant="outlined" className="pr-5" onPress={() => snackbar("Opening API reference")}>
              <Icon>menu_book</Icon>
              API docs
            </Button>
            <Button
              className="pr-5"
              onPress={() =>
                snackbar("Key created — copy it now, it won’t be shown again", {
                  action: { label: "Copy", onAction: () => void navigator.clipboard?.writeText("ksk_live_new…").catch(() => {}) },
                })
              }
            >
              <Icon>key</Icon>
              Create key
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 overflow-hidden p-0 xl:col-span-2">
          <div className="p-5 pb-3">
            <CardHead title="API keys" description="Keys inherit the creator's permissions" />
          </div>
          <Table className="min-w-[680px]" aria-label="API keys">
            <TableHeader className="text-label-md">
              <TableRow>
                <TableHead className="px-4 py-2">Name</TableHead>
                <TableHead className="px-4 py-2">Key</TableHead>
                <TableHead className="px-4 py-2">Scopes</TableHead>
                <TableHead className="px-4 py-2">Last used</TableHead>
                <TableHead className="px-4 py-2">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="px-4">
                    <div className="font-medium">{k.name}</div>
                    <div className="text-body-sm text-on-surface-variant">Created {k.created}</div>
                  </TableCell>
                  <TableCell className="px-4 font-mono text-body-sm">{k.key}</TableCell>
                  <TableCell className="px-4">
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <StatusBadge key={s} variant="neutral" className="h-6">
                          {s}
                        </StatusBadge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell muted className="px-4 whitespace-nowrap">
                    {k.lastUsed}
                  </TableCell>
                  <TableCell className="px-2 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <CopyButton
                        value={k.key}
                        aria-label={`Copy ${k.name} key`}
                        className="text-on-surface-variant"
                        onCopied={() => snackbar("Key copied to clipboard")}
                      />
                      <Button variant="text" className="h-9 text-error" onPress={() => revoke(k)}>
                        Revoke
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {keys.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="px-4 py-8 text-center text-on-surface-variant">
                    No API keys. Create one to call the API.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <Card className="min-w-0">
          <CardHead title="Rate limits" description="Current window" />
          <div className="mt-4 space-y-4">
            {LIMITS.map((l) => {
              const pct = (l.used / l.max) * 100
              return (
                <div key={l.label}>
                  <div className="flex justify-between text-body-md">
                    <span>{l.label}</span>
                    <span className="tabular-nums">
                      {l.used.toLocaleString("en-US")} / {l.max.toLocaleString("en-US")}
                    </span>
                  </div>
                  <LinearProgress
                    aria-label={l.label}
                    value={pct}
                    thickness={8}
                    showStop={false}
                    tone={pct >= 85 ? "error" : "primary"}
                    className="mt-1.5"
                  />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="min-w-0 xl:col-span-2">
          <CardHead title="API usage" description="Calls and error rate" />
          <div className="relative mt-4 h-64">
            <DevCallsChart range={range} />
          </div>
        </Card>
        <Card className="min-w-0">
          <CardHead title="Quickstart" description="Deploy from your terminal" />
          <div className="mt-4 overflow-hidden rounded-lg bg-inverse-surface text-inverse-on-surface">
            <div className="flex items-center justify-between py-1 pr-1 pl-3 text-label-sm text-inverse-on-surface/70">
              <span>bash</span>
              <CopyButton
                value={QUICKSTART}
                aria-label="Copy command"
                size="xs"
                className="text-inverse-on-surface"
                onCopied={() => snackbar("Command copied")}
              />
            </div>
            <pre className="relative overflow-x-auto px-3 pb-3 font-mono text-body-sm leading-6">{QUICKSTART}</pre>
          </div>
        </Card>
      </div>

      <Card className="mt-4 min-w-0">
        <CardHead
          title="Webhooks"
          description={`${WEBHOOKS.length} endpoints`}
          action={
            <Button variant="tonal" className="pr-5" onPress={() => snackbar("New webhook endpoint")}>
              <Icon>add</Icon>
              Add endpoint
            </Button>
          }
        />
        <ul className="mt-4 divide-y divide-outline-variant">
          {WEBHOOKS.map((w) => (
            <li key={w.url} className="flex flex-wrap items-center gap-3 py-3">
              <span className={cn("size-2.5 shrink-0 rounded-full", DOT[w.tone])} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-mono text-body-sm">{w.url}</div>
                <div className="text-body-sm text-on-surface-variant">{w.meta}</div>
              </div>
              <StatusBadge variant={w.tone} className="h-6">
                {w.success}
              </StatusBadge>
              <TestButton />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

/** Sends a test event: pending → "Delivered" for a moment → idle. */
function TestButton() {
  const [state, setState] = React.useState<"idle" | "sending" | "done">("idle")
  React.useEffect(() => {
    if (state === "idle") return
    const t = setTimeout(() => setState(state === "sending" ? "done" : "idle"), state === "sending" ? 1200 : 1800)
    return () => clearTimeout(t)
  }, [state])
  return (
    <Button variant="text" className="h-9" isPending={state === "sending"} onPress={() => setState("sending")}>
      {state === "sending" ? "Sending…" : state === "done" ? "Delivered" : "Test"}
    </Button>
  )
}
