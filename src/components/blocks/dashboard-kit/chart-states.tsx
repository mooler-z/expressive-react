"use client"

import * as React from "react"
import { ToggleButton } from "react-aria-components"

import { Icon } from "@/components/ui/icon"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Shape } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { useDashboardKit } from "./kit-data"

/*
 * Chart states & legends · loading, empty, error, permission, stale and partial states plus
 * legend patterns. Each state says what happened and offers the one action that fixes it.
 */

/** Button that runs a fake async action: label → pending (loader) → done (check) → label. */
function AsyncButton({
  className,
  pending,
  done,
  icon,
  children,
}: {
  className?: string
  pending: string
  done: string
  icon?: string
  children: React.ReactNode
}) {
  const [phase, setPhase] = React.useState<"idle" | "pending" | "done">("idle")
  React.useEffect(() => {
    if (phase === "idle") return
    const t = setTimeout(() => setPhase(phase === "pending" ? "done" : "idle"), phase === "pending" ? 1200 : 1600)
    return () => clearTimeout(t)
  }, [phase])
  return (
    <button
      type="button"
      className={cn(className, "focus-ring cursor-pointer")}
      aria-busy={phase === "pending"}
      disabled={phase !== "idle"}
      onClick={() => setPhase("pending")}
    >
      {phase === "pending" ? (
        <LoadingIndicator size={18} aria-hidden className="-my-1 text-current" />
      ) : phase === "done" ? (
        <Icon size={18}>check</Icon>
      ) : (
        icon && <Icon size={18}>{icon}</Icon>
      )}
      <span>{phase === "pending" ? pending : phase === "done" ? done : children}</span>
    </button>
  )
}

/** Active filters you can remove in place; restores them when the last one goes. */
function RemovableFilters() {
  const all = ["Failed", "us-west-2", "7 days"]
  const [filters, setFilters] = React.useState(all)
  return (
    <div className="mt-2 flex flex-wrap justify-center gap-1.5">
      {filters.map((f) => (
        <span
          key={f}
          className="inline-flex h-7 items-center gap-1 rounded-sm bg-secondary-container pr-1 pl-2.5 text-label-md text-on-secondary-container"
        >
          {f}
          <button
            type="button"
            className="state-layer focus-ring grid size-5 cursor-pointer place-items-center rounded-full"
            aria-label={`Remove filter ${f}`}
            onClick={() => {
              const next = filters.filter((x) => x !== f)
              setFilters(next.length ? next : all)
              snackbar(next.length ? `Removed ${f}` : "Filters reset")
            }}
          >
            <Icon size={16}>close</Icon>
          </button>
        </span>
      ))}
    </div>
  )
}

/** "Chart states & legends" section. */
function ChartStates({ className }: { className?: string }) {
  const kit = useDashboardKit()
  return (
    <section id="states" className={className ?? "mt-16 scroll-mt-36"} data-toc>
      <h2 className="text-headline-lg font-semibold">Chart states & legends</h2>
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
        Every state keeps the same card footprint (header, 176px canvas, note) so swapping states never shifts the grid.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Requests</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Loading
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <div className="absolute inset-0 flex animate-pulse flex-col p-4">
              <div className="h-3 w-1/3 rounded-xs bg-surface-container-highest"></div>
              <div className="mt-auto flex h-24 items-end gap-2">
                <div className="flex-1 rounded-t-sm bg-surface-container-highest" style={{ height: "40%" }}></div>
                <div className="flex-1 rounded-t-sm bg-surface-container-highest" style={{ height: "65%" }}></div>
                <div className="flex-1 rounded-t-sm bg-surface-container-highest" style={{ height: "50%" }}></div>
                <div className="flex-1 rounded-t-sm bg-surface-container-highest" style={{ height: "80%" }}></div>
                <div className="flex-1 rounded-t-sm bg-surface-container-highest" style={{ height: "60%" }}></div>
                <div className="flex-1 rounded-t-sm bg-surface-container-highest" style={{ height: "90%" }}></div>
                <div className="flex-1 rounded-t-sm bg-surface-container-highest" style={{ height: "70%" }}></div>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Skeleton matches the final layout.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Spend by tag</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Empty
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <div className="absolute inset-0 grid place-items-center p-4 text-center ">
              <div className="flex flex-col items-center">
                <span className="grid size-11 place-items-center rounded-full bg-surface-container-high text-on-surface-variant">
                  <Icon>query_stats</Icon>
                </span>
                <div className="mt-2 text-title-sm">No data for this range</div>
                <button
                  className="state-layer mt-3 inline-flex h-9 items-center rounded-full bg-secondary-container px-4 text-label-lg text-on-secondary-container"
                  onClick={() => {
                    kit.setRange("90D")
                    snackbar("Showing last 90 days")
                  }}
                >
                  Try last 90 days
                </button>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Offer the one action that fixes it.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Latency by region</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Error
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <div className="absolute inset-0 grid place-items-center p-4 text-center ">
              <div className="flex flex-col items-center">
                <span className="grid size-11 place-items-center rounded-full bg-error-container text-on-error-container">
                  <Icon>cloud_off</Icon>
                </span>
                <div className="mt-2 text-title-sm">Couldn't load metrics</div>
                <AsyncButton
                  className="state-layer mt-3 inline-flex h-9 items-center gap-2 rounded-full px-4 text-label-lg border border-outline-variant text-on-surface-variant"
                  pending="Retrying…"
                  done="Loaded"
                  icon="refresh"
                >
                  Retry
                </AsyncButton>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Say what failed, then retry.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Cost by team</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              No access
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <div className="absolute inset-0 grid place-items-center p-4 text-center ">
              <div className="flex flex-col items-center">
                <span className="grid size-11 place-items-center rounded-full bg-surface-container-high text-on-surface-variant">
                  <Icon>lock</Icon>
                </span>
                <div className="mt-2 text-title-sm">Finance access needed</div>
                <AsyncButton
                  className="state-layer mt-3 inline-flex h-9 items-center gap-2 rounded-full px-4 text-label-lg bg-secondary-container text-on-secondary-container"
                  pending="Requesting…"
                  done="Requested"
                >
                  Request access
                </AsyncButton>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Permission is a state, not an error.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Throughput</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Offline
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-50">
              <g className="stroke-outline-variant/60" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <line x1="0" y1="25" x2="200" y2="25" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="50" x2="200" y2="50" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="75" x2="200" y2="75" vectorEffect="non-scaling-stroke"></line>
              </g>
              <path
                d="M0 72 C 30 62, 50 42, 80 47 S 130 22, 160 32 S 190 27, 200 22"
                fill="none"
                className="stroke-outline"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
            <div className="absolute inset-0 grid place-items-center p-4 text-center ">
              <div className="flex flex-col items-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-inverse-surface px-3 py-1.5 text-label-md text-inverse-on-surface">
                  <Icon size={18}>wifi_off</Icon>Offline · cached 12:04
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Keep the last known data visible.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Requests</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Partial
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full ">
              <g className="stroke-outline-variant/60" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <line x1="0" y1="25" x2="200" y2="25" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="50" x2="200" y2="50" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="75" x2="200" y2="75" vectorEffect="non-scaling-stroke"></line>
              </g>
              <path
                d="M0 72 C 30 62, 50 42, 80 47 S 130 22, 160 32 S 190 27, 200 22"
                fill="none"
                className="stroke-primary"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
            <div className="absolute inset-x-3 top-3 flex items-center gap-2 rounded-md bg-secondary-container px-3 py-1.5 text-body-sm text-on-secondary-container">
              <Icon size={18}>info</Icon>2 of 12 regions not reporting
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Flag gaps without hiding the chart.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Spend</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Stale
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full ">
              <g className="stroke-outline-variant/60" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <line x1="0" y1="25" x2="200" y2="25" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="50" x2="200" y2="50" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="75" x2="200" y2="75" vectorEffect="non-scaling-stroke"></line>
              </g>
              <path
                d="M0 72 C 30 62, 50 42, 80 47 S 130 22, 160 32 S 190 27, 200 22"
                fill="none"
                className="stroke-primary"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-full bg-inverse-surface py-1 pl-3 pr-1 text-body-sm text-inverse-on-surface">
              <Icon size={18}>history</Icon>
              <span className="flex-1">Updated 2 h ago</span>
              <AsyncButton
                className="state-layer inline-flex h-7 items-center rounded-full px-3 text-label-md text-inverse-primary"
                pending="…"
                done="Fresh"
              >
                Refresh
              </AsyncButton>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Show data age when it matters.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Latency</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Updating
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-40">
              <g className="stroke-outline-variant/60" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <line x1="0" y1="25" x2="200" y2="25" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="50" x2="200" y2="50" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="75" x2="200" y2="75" vectorEffect="non-scaling-stroke"></line>
              </g>
              <path
                d="M0 72 C 30 62, 50 42, 80 47 S 130 22, 160 32 S 190 27, 200 22"
                fill="none"
                className="stroke-primary"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
            <div className="absolute inset-0 grid place-items-center p-4 text-center ">
              <div className="flex flex-col items-center">
                <span className="inline-flex items-center gap-3 rounded-full bg-surface-container-highest px-4 py-2 shadow-2">
                  <Shape
                    className="size-6 animate-[spin_3s_linear_infinite] text-primary"
                    shape="cookie7"
                    cycle={["cookie7", "clover4", "sunny", "squircle"]}
                    interval={600}
                  />
                  <span className="text-label-lg">Recalculating…</span>
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Overlay keeps context while refreshing.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Errors</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Zero
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <div className="absolute inset-0 grid place-items-center p-4 text-center ">
              <div className="flex flex-col items-center">
                <span className="relative grid size-14 place-items-center">
                  <Shape
                    className="absolute inset-0 size-14 text-tertiary-container"
                    shape="sunny"
                    cycle={["sunny", "cookie12"]}
                    interval={2600}
                  />
                  <Icon className="relative text-on-tertiary-container">celebration</Icon>
                </span>
                <div className="mt-2 text-headline-sm font-medium tabular-nums">0 errors</div>
                <div className="text-body-sm text-on-surface-variant">in the last 24 hours</div>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Zero is good news, not "no data".</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Deploys</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Filtered
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <div className="absolute inset-0 grid place-items-center p-4 text-center ">
              <div className="flex flex-col items-center">
                <span className="grid size-11 place-items-center rounded-full bg-surface-container-high text-on-surface-variant">
                  <Icon>filter_alt_off</Icon>
                </span>
                <div className="mt-2 text-title-sm">No deploys match</div>
                <RemovableFilters />
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Let people remove filters in place.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Conversion</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Low sample
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <path
                d="M0 70 C 40 60, 70 50, 100 52"
                fill="none"
                className="stroke-primary"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              ></path>
              <path
                d="M100 52 S 160 30, 200 36"
                fill="none"
                className="stroke-primary"
                strokeWidth="2.5"
                strokeDasharray="6 5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-sm bg-secondary-container px-2 py-0.5 text-label-sm text-on-secondary-container">
              <Icon size={16}>warning</Icon>n = 42
            </span>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Dash the line where confidence drops.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Release impact</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Annotated
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <rect x="96" y="0" width="30" height="100" className="fill-error/10"></rect>
              <path
                d="M0 72 C 30 62, 50 42, 80 47 S 130 22, 160 32 S 190 27, 200 22"
                fill="none"
                className="stroke-primary"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
            <span className="absolute inset-y-0 left-[30%] w-0.5 bg-tertiary"></span>
            <span className="absolute left-[30%] top-2 ml-1.5 rounded-xs bg-tertiary px-1.5 text-label-sm text-on-tertiary">v4.2</span>
            <span className="absolute left-[49%] top-2 ml-1 rounded-xs bg-error-container px-1.5 text-label-sm text-on-error-container">
              INC-2291
            </span>
            <span className="absolute inset-x-0 top-[40%] border-t border-dashed border-error"></span>
            <span className="absolute right-2 top-[40%] -translate-y-full pb-0.5 text-label-sm text-error">SLO</span>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Markers, a shaded band and a threshold.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Tooltip anatomy</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Index mode
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full ">
              <g className="stroke-outline-variant/60" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <line x1="0" y1="25" x2="200" y2="25" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="50" x2="200" y2="50" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="75" x2="200" y2="75" vectorEffect="non-scaling-stroke"></line>
              </g>
              <path
                d="M0 72 C 30 62, 50 42, 80 47 S 130 22, 160 32 S 190 27, 200 22"
                fill="none"
                className="stroke-primary"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full translate-y-4">
              <g className="stroke-outline-variant/60" strokeWidth="1" vectorEffect="non-scaling-stroke">
                <line x1="0" y1="25" x2="200" y2="25" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="50" x2="200" y2="50" vectorEffect="non-scaling-stroke"></line>
                <line x1="0" y1="75" x2="200" y2="75" vectorEffect="non-scaling-stroke"></line>
              </g>
              <path
                d="M0 72 C 30 62, 50 42, 80 47 S 130 22, 160 32 S 190 27, 200 22"
                fill="none"
                className="stroke-tertiary"
                strokeWidth="2.5"
                vectorEffect="non-scaling-stroke"
              ></path>
            </svg>
            <span className="absolute inset-y-0 left-[42%] w-px bg-outline"></span>
            <span className="absolute left-[42%] top-[44%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-primary"></span>
            <div className="absolute right-3 top-3 w-36 rounded-sm bg-inverse-surface p-2.5 text-inverse-on-surface shadow-2">
              <div className="text-label-md">Oct 14</div>
              <div className="mt-1 flex items-center gap-2 text-body-sm">
                <span className="size-2 rounded-full bg-inverse-primary"></span>
                <span className="flex-1">Requests</span>
                <span className="tabular-nums">482</span>
              </div>
              <div className="flex items-center gap-2 text-body-sm">
                <span className="size-2 rounded-full bg-tertiary-fixed-dim"></span>
                <span className="flex-1">Cached</span>
                <span className="tabular-nums">271</span>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Inverse surface, crosshair, all series.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Tooltip variants</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Compact · rich
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <div className="absolute inset-0 flex flex-col justify-center gap-3 p-4">
              <span className="inline-flex items-center gap-2 self-start rounded-sm bg-inverse-surface px-2 py-1 text-body-sm text-inverse-on-surface">
                <span className="size-2 rounded-full bg-inverse-primary"></span>Oct 14 · 482 req
              </span>
              <div className="w-full max-w-[230px] rounded-md bg-surface-container p-3 shadow-2">
                <div className="text-title-sm">Oct 14 · Tuesday</div>
                <div className="mt-1.5 space-y-1 text-body-sm">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-primary"></span>
                    <span className="flex-1">Requests</span>
                    <span className="tabular-nums">482</span>
                    <span className="w-9 text-right text-label-sm text-on-surface-variant">+6%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-tertiary"></span>
                    <span className="flex-1">Cached</span>
                    <span className="tabular-nums">271</span>
                    <span className="w-9 text-right text-label-sm text-on-surface-variant">+2%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-error"></span>
                    <span className="flex-1">Errors</span>
                    <span className="tabular-nums">11</span>
                    <span className="w-9 text-right text-label-sm text-on-surface-variant">−3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Pick compact for sparklines, rich for detail.</p>
        </div>
        <div className="flex min-w-0 flex-col rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-title-sm">Series palette</span>
            <span className="shrink-0 rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              Order
            </span>
          </div>
          <div className="relative mt-3 h-44 overflow-hidden rounded-lg bg-surface">
            <div className="absolute inset-0 grid grid-cols-4 gap-2 p-3">
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex-1 rounded-md bg-primary"></span>
                <span className="truncate font-mono text-label-sm text-on-surface-variant">1 primary</span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex-1 rounded-md bg-tertiary"></span>
                <span className="truncate font-mono text-label-sm text-on-surface-variant">2 tertiary</span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex-1 rounded-md bg-secondary"></span>
                <span className="truncate font-mono text-label-sm text-on-surface-variant">3 secondary</span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex-1 rounded-md bg-error"></span>
                <span className="truncate font-mono text-label-sm text-on-surface-variant">4 error</span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex-1 rounded-md bg-primary/60"></span>
                <span className="truncate font-mono text-label-sm text-on-surface-variant">5 primary/60</span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex-1 rounded-md bg-tertiary/60"></span>
                <span className="truncate font-mono text-label-sm text-on-surface-variant">6 tertiary/60</span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex-1 rounded-md bg-outline"></span>
                <span className="truncate font-mono text-label-sm text-on-surface-variant">7 outline</span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex-1 rounded-md bg-outline-variant"></span>
                <span className="truncate font-mono text-label-sm text-on-surface-variant">8 outline-var.</span>
              </div>
            </div>
          </div>
          <p className="mt-3 px-1 text-body-sm text-on-surface-variant">Every chart assigns series in this order.</p>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-4 sm:col-span-2 xl:col-span-3">
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-title-sm">Legend styles</span>
            <span className="rounded-full bg-surface-container-highest px-2.5 py-0.5 text-label-sm text-on-surface-variant">
              4 patterns
            </span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="min-w-0 rounded-lg bg-surface p-4">
              <div className="text-label-md uppercase tracking-wider text-on-surface-variant">Dot</div>
              <div className="mt-3">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-body-sm">
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-primary"></span>Requests
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-tertiary"></span>Cached
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-error"></span>Errors
                  </span>
                </div>
              </div>
            </div>
            <div className="min-w-0 rounded-lg bg-surface p-4">
              <div className="text-label-md uppercase tracking-wider text-on-surface-variant">Line</div>
              <div className="mt-3">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-body-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-0.5 w-5 rounded-full bg-primary"></span>Actual
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-5 border-t-2 border-dashed border-outline"></span>Previous
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-5 border-t-2 border-dotted border-error"></span>Limit
                  </span>
                </div>
              </div>
            </div>
            <div className="min-w-0 rounded-lg bg-surface p-4">
              <div className="text-label-md uppercase tracking-wider text-on-surface-variant">Toggle chips</div>
              <div className="mt-3">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Series">
                  <ToggleButton
                    className="state-layer inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant transition-colors data-[selected]:border-transparent data-[selected]:bg-secondary-container data-[selected]:text-on-secondary-container focus-ring cursor-pointer"
                    defaultSelected
                  >
                    <span className="size-2.5 rounded-full bg-primary"></span>EU
                  </ToggleButton>
                  <ToggleButton
                    className="state-layer inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant transition-colors data-[selected]:border-transparent data-[selected]:bg-secondary-container data-[selected]:text-on-secondary-container focus-ring cursor-pointer"
                    defaultSelected
                  >
                    <span className="size-2.5 rounded-full bg-tertiary"></span>US
                  </ToggleButton>
                  <ToggleButton className="state-layer inline-flex h-8 items-center gap-2 rounded-sm border border-outline-variant px-3 text-label-lg text-on-surface-variant transition-colors data-[selected]:border-transparent data-[selected]:bg-secondary-container data-[selected]:text-on-secondary-container focus-ring cursor-pointer">
                    <span className="size-2.5 rounded-full bg-secondary"></span>APAC
                  </ToggleButton>
                </div>
              </div>
            </div>
            <div className="min-w-0 rounded-lg bg-surface p-4">
              <div className="text-label-md uppercase tracking-wider text-on-surface-variant">With values</div>
              <div className="mt-3">
                <ul className="space-y-2 text-body-sm">
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full bg-primary"></span>
                    <span className="min-w-0 flex-1 truncate">Europe</span>
                    <span className="tabular-nums">42%</span>
                    <span className="w-10 text-right tabular-nums text-on-surface-variant">201k</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full bg-tertiary"></span>
                    <span className="min-w-0 flex-1 truncate">North America</span>
                    <span className="tabular-nums">31%</span>
                    <span className="w-10 text-right tabular-nums text-on-surface-variant">148k</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full bg-secondary"></span>
                    <span className="min-w-0 flex-1 truncate">Asia Pacific</span>
                    <span className="tabular-nums">19%</span>
                    <span className="w-10 text-right tabular-nums text-on-surface-variant">91k</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </section>
  )
}

export { AsyncButton, ChartStates }
