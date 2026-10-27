"use client"

import * as React from "react"

import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Select, SelectItem } from "@/components/ui/select"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Integrations 02 · Slack routing
 * One connected integration: workspace header, a channel per alert type, a test message,
 * and recent deliveries with retry for failures.
 */

export interface Route {
  id: string
  label: string
  icon: string
  channel: string
  urgent?: boolean
}

export interface Delivery {
  id: string
  status: number
  message: string
  channel: string
  when: string
}

export interface Integrations2Props {
  workspace?: string
  channels?: string[]
  routes?: Route[]
  deliveries?: Delivery[]
  onRouteChange?: (id: string, channel: string) => void
  onSendTest?: () => Promise<void> | void
  onRetry?: (id: string) => Promise<void> | void
  onDisconnect?: () => void
  className?: string
}

const CHANNELS = ["#incidents", "#live-ops", "#moderation", "#economy", "#releases", "Don't post"]
const ROUTES: Route[] = [
  { id: "incidents", label: "Incidents", icon: "e911_emergency", channel: "#incidents", urgent: true },
  { id: "events", label: "Live events", icon: "celebration", channel: "#live-ops" },
  { id: "reports", label: "Player reports", icon: "gavel", channel: "#moderation" },
  { id: "revenue", label: "Revenue anomalies", icon: "payments", channel: "#economy" },
  { id: "builds", label: "Build rollouts", icon: "deployed_code", channel: "#releases" },
]
const DELIVERIES: Delivery[] = [
  { id: "d1", status: 200, message: "Event started · Ranked Split 2", channel: "#live-ops", when: "2 min ago" },
  { id: "d2", status: 200, message: "Report threshold · Valkyr.ie", channel: "#moderation", when: "18 min ago" },
  { id: "d3", status: 429, message: "Revenue anomaly · Mobile −31% · retried", channel: "#economy", when: "1 h ago" },
  { id: "d4", status: 500, message: "Build 7.2.1 reached 50%", channel: "#releases", when: "3 h ago" },
]

const statusTone = (code: number) =>
  code < 300 ? "bg-primary-container text-on-primary-container" : code < 500 ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container"

export function Integrations2({
  workspace = "cinder-studio.slack.com",
  channels = CHANNELS,
  routes = ROUTES,
  deliveries: initialDeliveries = DELIVERIES,
  onRouteChange,
  onSendTest,
  onRetry,
  onDisconnect,
  className,
}: Integrations2Props) {
  const [testing, setTesting] = React.useState(false)
  const [retrying, setRetrying] = React.useState<string | null>(null)
  const [deliveries, setDeliveries] = React.useState(initialDeliveries)

  const sendTest = async () => {
    setTesting(true)
    try {
      await (onSendTest ? onSendTest() : new Promise((r) => setTimeout(r, 1200)))
      snackbar("Test message sent to #live-ops")
    } finally {
      setTesting(false)
    }
  }

  const retry = async (d: Delivery) => {
    setRetrying(d.id)
    try {
      await (onRetry ? onRetry(d.id) : new Promise((r) => setTimeout(r, 1000)))
      setDeliveries((list) => list.map((x) => (x.id === d.id ? { ...x, status: 200, when: "Just now" } : x)))
      snackbar("Delivered")
    } finally {
      setRetrying(null)
    }
  }

  return (
    <div className={cn("bg-surface-container-low p-4 md:p-8", className)}>
      <div className="mx-auto max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-surface p-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-tertiary-container text-title-md text-on-tertiary-container">SL</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-title-lg font-medium">Slack</h3>
              <StatusBadge variant="primary-container" size="md">
                <span className="size-1.5 rounded-full bg-primary" />
                Connected
              </StatusBadge>
            </div>
            <div className="text-body-md text-on-surface-variant">{workspace} · connected by Kenji Watanabe</div>
          </div>
          <Button
            variant="outlined"
            className="text-error"
            onPress={() => (onDisconnect ? onDisconnect() : snackbar("Slack disconnected", { action: { label: "Undo", onAction: () => snackbar("Slack reconnected") } }))}
          >
            Disconnect
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl bg-surface">
          <div className="flex flex-wrap items-center gap-3 px-5 pt-5 pb-3">
            <div className="min-w-0 flex-1">
              <div className="text-title-md">Channel routing</div>
              <div className="text-body-md text-on-surface-variant">Where each kind of alert is posted</div>
            </div>
            <Button variant="tonal" className="pr-4 pl-3" isPending={testing} onPress={sendTest}>
              {!testing && <Icon>send</Icon>}
              {testing ? "Sending…" : "Send test message"}
            </Button>
          </div>
          <ul className="divide-y divide-outline-variant/60 border-t border-outline-variant">
            {routes.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <Icon className={r.urgent ? "text-error" : "text-on-surface-variant"}>{r.icon}</Icon>
                <span className="min-w-0 flex-1 text-body-lg">{r.label}</span>
                <Select
                  aria-label={`Channel for ${r.label.toLowerCase()}`}
                  defaultSelectedKey={r.channel}
                  onSelectionChange={(k) => {
                    onRouteChange?.(r.id, String(k))
                    snackbar(`${r.label} → ${k}`)
                  }}
                  density="xs"
                  className="w-48 [&_[data-slot=field-container]]:font-mono"
                >
                  {channels.map((c) => (
                    <SelectItem key={c} id={c}>
                      {c}
                    </SelectItem>
                  ))}
                </Select>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-xl bg-surface">
          <div className="px-5 pt-5 pb-3">
            <div className="text-title-md">Recent deliveries</div>
            <div className="text-body-md text-on-surface-variant">Last 24 hours</div>
          </div>
          <ul className="divide-y divide-outline-variant/60 border-t border-outline-variant">
            {deliveries.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
                <span className={cn("inline-flex h-6 w-12 shrink-0 items-center justify-center rounded-sm font-mono text-label-md", statusTone(d.status))}>{d.status}</span>
                <span className="min-w-0 flex-1 truncate text-body-md">{d.message}</span>
                <span className="font-mono text-body-sm text-on-surface-variant">{d.channel}</span>
                {d.status >= 500 ? (
                  <Button variant="text" size="xs" className="w-20" isPending={retrying === d.id} onPress={() => retry(d)}>
                    Retry
                  </Button>
                ) : (
                  <span className="w-20 text-right text-body-sm text-on-surface-variant">{d.when}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
