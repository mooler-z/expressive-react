"use client"

import * as React from "react"

import { SegmentedButton, SegmentedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { cn } from "@/lib/utils"

/*
 * Stats 01 · Connected stats
 * Four connected stats with change chips. The comparison control changes the baseline for every delta.
 */

type Baseline = "week" | "season"

const STATS: { label: string; value: string; week: [string, boolean]; season: [string, boolean] }[] = [
  { label: "Daily active players", value: "1.24M", week: ["+3.1%", true], season: ["+18.4%", true] },
  { label: "New installs", value: "38.2K", week: ["+5.6%", true], season: ["−2.3%", false] },
  { label: "Revenue · 7 days", value: "$2.91M", week: ["+8.4%", true], season: ["+22.0%", true] },
  { label: "Avg. session", value: "34m 12s", week: ["−1.2%", false], season: ["+4.0%", true] },
]

export function Stats1({ className }: { className?: string }) {
  const [baseline, setBaseline] = React.useState<Baseline>("week")

  return (
    <div className={cn("bg-surface p-4 md:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-title-lg font-medium">This week</h4>
          <p className="text-body-sm text-on-surface-variant">
            {baseline === "week" ? "Oct 19–25 compared with Oct 12–18" : "Season 7 to date compared with Season 6 at day 23"}
          </p>
        </div>
        <SegmentedButtonGroup aria-label="Compare with" selectedKeys={[baseline]} onSelectionChange={(k) => setBaseline([...k][0] as Baseline)}>
          <SegmentedButton id="week">Last week</SegmentedButton>
          <SegmentedButton id="season">Last season</SegmentedButton>
        </SegmentedButtonGroup>
      </div>
      <div className="mt-4 grid gap-px overflow-hidden rounded-lg border border-outline-variant bg-outline-variant sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((k) => {
          const [delta, up] = k[baseline]
          return (
            <div key={k.label} className="bg-surface p-5">
              <div className="text-body-md text-on-surface-variant">{k.label}</div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-headline-md font-medium tabular-nums">{k.value}</span>
                <span
                  className={cn(
                    "inline-flex h-6 items-center gap-0.5 rounded-sm pr-2 pl-1 text-label-md",
                    up ? "bg-primary-container text-on-primary-container" : "bg-error-container text-on-error-container",
                  )}
                >
                  <Icon size={16}>{up ? "arrow_upward" : "arrow_downward"}</Icon>
                  {delta}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
