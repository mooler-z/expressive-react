"use client"

import * as React from "react"

import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Integrations 01 · Integration grid
 * Category filter chips over integration cards. Connect runs a short pending state;
 * disconnect offers undo.
 */

export interface Integration {
  name: string
  mono: string
  description: string
  category: string
  connected: boolean
}

export interface Integrations1Props {
  integrations?: Integration[]
  onConnect?: (name: string) => Promise<void> | void
  onDisconnect?: (name: string) => void
  onConfigure?: (name: string) => void
  className?: string
}

const INTEGRATIONS: Integration[] = [
  { name: "Steamworks", mono: "ST", description: "Players, purchases and sessions from Steam", category: "Platforms", connected: true },
  { name: "PlayStation Partners", mono: "PS", description: "Sales and entitlements for PS5 and PS4", category: "Platforms", connected: true },
  { name: "Xbox Partner Center", mono: "XB", description: "Store and achievement data for Xbox", category: "Platforms", connected: false },
  { name: "App Store Connect", mono: "AP", description: "iOS purchases, subscriptions and reviews", category: "Platforms", connected: true },
  { name: "Slack", mono: "SL", description: "Alerts and event updates in channels", category: "Alerts", connected: true },
  { name: "PagerDuty", mono: "PD", description: "Page on-call engineers during incidents", category: "Alerts", connected: true },
  { name: "Discord", mono: "DC", description: "Post patch notes and event news to your server", category: "Community", connected: false },
  { name: "BigQuery", mono: "BQ", description: "Daily export of event and economy tables", category: "Analytics", connected: false },
  { name: "Sentry", mono: "SE", description: "Crash reports linked to builds and players", category: "Analytics", connected: true },
]
const FILTERS = ["All", "Connected", "Platforms", "Alerts", "Analytics", "Community"]
const TONES = ["bg-primary-container text-on-primary-container", "bg-tertiary-container text-on-tertiary-container", "bg-secondary-container text-on-secondary-container"]

type State = "on" | "off" | "busy"

export function Integrations1({ integrations = INTEGRATIONS, onConnect, onDisconnect, onConfigure, className }: Integrations1Props) {
  const [filter, setFilter] = React.useState("All")
  const [state, setState] = React.useState<Record<string, State>>(() => Object.fromEntries(integrations.map((i) => [i.name, i.connected ? "on" : "off"])))
  const set = (name: string, s: State) => setState((x) => ({ ...x, [name]: s }))
  const shown = integrations.filter((i) => filter === "All" || (filter === "Connected" ? state[i.name] === "on" : i.category === filter))
  const connectedCount = Object.values(state).filter((s) => s === "on").length

  const connect = async (name: string) => {
    set(name, "busy")
    await (onConnect ? onConnect(name) : new Promise((r) => setTimeout(r, 1400)))
    set(name, "on")
    snackbar(`${name} connected`)
  }

  const disconnect = (name: string) => {
    set(name, "off")
    onDisconnect?.(name)
    snackbar(`${name} disconnected`, { action: { label: "Undo", onAction: () => set(name, "on") } })
  }

  return (
    <div className={cn("bg-surface p-4 md:p-6", className)}>
      <div>
        <h3 className="text-title-lg font-medium">Integrations</h3>
        <p className="text-body-sm text-on-surface-variant" aria-live="polite">
          {connectedCount} of {integrations.length} connected
        </p>
      </div>
      <ChipGroup
        aria-label="Filter integrations"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[filter]}
        onSelectionChange={(k) => setFilter(String([...k][0] ?? "All"))}
        className="mt-4"
      >
        {FILTERS.map((f) => (
          <FilterChip key={f} id={f}>
            {f}
          </FilterChip>
        ))}
      </ChipGroup>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((i) => {
          const s = state[i.name]
          return (
            <li key={i.name} className="flex animate-fade-up flex-col gap-4 rounded-xl border border-outline-variant p-5">
              <div className="flex items-start gap-3">
                <span className={cn("grid size-11 shrink-0 place-items-center rounded-lg text-title-sm", TONES[integrations.indexOf(i) % 3])}>{i.mono}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-title-md">{i.name}</div>
                  <div className="text-body-sm text-on-surface-variant">{i.category}</div>
                </div>
                {s === "on" && (
                  <StatusBadge variant="primary-container" size="md">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Connected
                  </StatusBadge>
                )}
              </div>
              <p className="flex-1 text-body-md text-on-surface-variant">{i.description}</p>
              {s === "on" && (
                <div className="flex gap-2">
                  <Button variant="outlined" className="flex-1" onPress={() => (onConfigure ? onConfigure(i.name) : snackbar(`Opening ${i.name} settings`))}>
                    Configure
                  </Button>
                  <Button variant="text" className="px-4 text-error" onPress={() => disconnect(i.name)}>
                    Disconnect
                  </Button>
                </div>
              )}
              {s === "off" && (
                <Button onPress={() => connect(i.name)}>
                  <Icon>add_link</Icon>
                  Connect
                </Button>
              )}
              {s === "busy" && (
                <Button isPending variant="tonal">
                  Connecting…
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
