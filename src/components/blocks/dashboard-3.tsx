"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent, chartAxisProps, chartGridProps, type ChartConfig } from "@/components/ui/chart"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

/*
 * Dashboard 03 · Economy
 * Month-to-date revenue with platform filter chips; the stats and weekly chart recalculate
 * for the selected platforms. Top SKUs ranked beside it.
 */

type Platform = "PC" | "Console" | "Mobile"
const PLATFORMS: Platform[] = ["PC", "Console", "Mobile"]

/** Month to date per platform: revenue ($M), payers (K), MAU (K), DAU (K). */
const PLAT: Record<Platform, [number, number, number, number]> = {
  PC: [4.82, 61, 1180, 471],
  Console: [3.17, 38, 960, 384],
  Mobile: [2.46, 52, 960, 385],
}

const WEEKS = ["W36", "W37", "W38", "W39", "W40", "W41", "W42", "W43"]
const REV: Record<Platform, number[]> = {
  PC: [1.02, 1.1, 1.05, 1.21, 1.18, 1.32, 1.27, 1.41],
  Console: [0.71, 0.74, 0.69, 0.8, 0.83, 0.88, 0.84, 0.93],
  Mobile: [0.52, 0.55, 0.61, 0.58, 0.63, 0.66, 0.71, 0.69],
}
const WEEKLY = WEEKS.map((week, i) => ({ week, PC: REV.PC[i], Console: REV.Console[i], Mobile: REV.Mobile[i] }))

const config = {
  PC: { label: "PC", color: "primary" },
  Console: { label: "Console", color: "tertiary" },
  Mobile: { label: "Mobile", color: "primary-fixed-dim" },
} satisfies ChartConfig

const SWATCH: Record<Platform, string> = { PC: "bg-primary", Console: "bg-tertiary", Mobile: "bg-primary-fixed-dim" }

const SKUS = [
  { name: "Frostfire Pass", cat: "Battle pass", units: "182,340", revenue: "$1.82M", trend: "+12%", up: true },
  { name: "1,200 Ember Shards", cat: "Currency", units: "96,115", revenue: "$1.15M", trend: "+4%", up: true },
  { name: "Glacier Warden", cat: "Cosmetic", units: "41,880", revenue: "$628K", trend: "+31%", up: true },
  { name: "5,000 Ember Shards", cat: "Currency", units: "12,960", revenue: "$518K", trend: "−6%", up: false },
  { name: "Starter bundle v2", cat: "Bundle", units: "77,402", revenue: "$386K", trend: "−2%", up: false },
]

export function Dashboard3({ className }: { className?: string }) {
  const [plat, setPlat] = React.useState<Platform[]>(PLATFORMS)
  const sum = (k: number) => plat.reduce((a, p) => a + PLAT[p][k], 0)
  const rev = sum(0)
  const payers = sum(1)
  const mau = sum(2)
  const dau = sum(3)
  const stats = [
    { label: "Gross revenue", value: `$${rev.toFixed(2)}M`, sub: "Oct 1 – 26" },
    { label: "ARPDAU", value: `$${((rev * 1e6) / (dau * 1e3) / 26).toFixed(2)}`, sub: "Average revenue per daily active" },
    { label: "Paying players", value: `${payers}K`, sub: "Unique this month" },
    { label: "Payer conversion", value: `${((payers / mau) * 100).toFixed(1)}%`, sub: "Of monthly actives" },
  ]

  return (
    <div className={cn("space-y-3 bg-surface p-4 md:p-6", className)}>
      <div className="flex flex-wrap items-end justify-between gap-3 pb-1">
        <div>
          <div className="text-body-sm text-on-surface-variant">Economy · month to date</div>
          <h4 className="text-headline-sm font-medium">October revenue</h4>
        </div>
        <ChipGroup
          aria-label="Platforms"
          selectedKeys={plat}
          onSelectionChange={(keys) => {
            const next = PLATFORMS.filter((p) => keys.has(p))
            if (!next.length) return snackbar("Keep at least one platform selected")
            setPlat(next)
          }}
        >
          {PLATFORMS.map((p) => (
            <FilterChip key={p} id={p}>
              {p}
            </FilterChip>
          ))}
        </ChipGroup>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((k) => (
          <div key={k.label} className="rounded-lg bg-surface-container-low p-4">
            <div className="text-body-md text-on-surface-variant">{k.label}</div>
            <div className="mt-1 text-headline-sm font-medium tabular-nums">{k.value}</div>
            <div className="mt-0.5 text-body-sm text-on-surface-variant">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <div className="rounded-lg bg-surface-container-low p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h5 className="text-title-md">Weekly gross revenue</h5>
              <p className="text-body-sm text-on-surface-variant">USD, stacked by platform</p>
            </div>
            <div className="flex gap-3 text-body-sm text-on-surface-variant">
              {PLATFORMS.map((p) => (
                <span key={p} className={cn("inline-flex items-center gap-1.5", !plat.includes(p) && "opacity-40")}>
                  <span className={cn("size-2.5 rounded-xs", SWATCH[p])} />
                  {p}
                </span>
              ))}
            </div>
          </div>
          <ChartContainer config={config} className="mt-3 aspect-auto h-64">
            <BarChart data={WEEKLY} margin={{ left: 0, right: 4, top: 4 }} accessibilityLayer>
              <CartesianGrid {...chartGridProps} />
              <XAxis dataKey="week" {...chartAxisProps} />
              <YAxis {...chartAxisProps} width={56} tickFormatter={(v) => `$${v}M`} />
              <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => `$${v}M`} />} />
              {PLATFORMS.filter((p) => plat.includes(p)).map((p, i, shown) => (
                <Bar
                  key={p}
                  dataKey={p}
                  stackId="rev"
                  fill={`var(--color-${p})`}
                  maxBarSize={40}
                  radius={i === shown.length - 1 ? [4, 4, 0, 0] : i === 0 ? [0, 0, 4, 4] : 0}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </div>

        <div className="overflow-hidden rounded-lg bg-surface-container-low">
          <div className="p-4 pb-2">
            <h5 className="text-title-md">Top SKUs</h5>
            <p className="text-body-sm text-on-surface-variant">By gross revenue, all platforms</p>
          </div>
          <table className="w-full table-fixed text-body-md">
            <thead>
              <tr className="border-y border-outline-variant text-label-md text-on-surface-variant">
                <th scope="col" className="w-10 py-2 pl-4 text-left font-medium">
                  #
                </th>
                <th scope="col" className="py-2 pl-3 text-left font-medium">
                  Item
                </th>
                <th scope="col" className="w-[84px] py-2 pl-3 text-right font-medium">
                  Units
                </th>
                <th scope="col" className="w-[76px] py-2 pl-3 text-right font-medium">
                  Gross
                </th>
                <th scope="col" className="w-[68px] py-2 pr-4 pl-3 text-right font-medium">
                  MoM
                </th>
              </tr>
            </thead>
            <tbody>
              {SKUS.map((k, i) => (
                <tr key={k.name} className="border-b border-outline-variant/60 last:border-b-0">
                  <td className="py-2.5 pl-4 text-on-surface-variant">{i + 1}</td>
                  <td className="py-2.5 pl-3">
                    <span className="block truncate font-medium">{k.name}</span>
                    <span className="block text-body-sm text-on-surface-variant">{k.cat}</span>
                  </td>
                  <td className="py-2.5 pl-3 text-right text-on-surface-variant tabular-nums">{k.units}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums">{k.revenue}</td>
                  <td className={cn("py-2.5 pr-4 pl-3 text-right text-label-md", k.up ? "text-primary" : "text-error")}>{k.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
