"use client"

import * as React from "react"

import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"

import { type DashboardKit, useDashboardKit } from "./kit-data"

/*
 * Heatmaps, gauges & timelines · 26 visualizations built from Tailwind grids and SVG (no chart
 * library): deploy calendar, alert matrix, uptime bars, treemap, bullets, gauges, rings, gantt,
 * waffle, month heatmap, capacity segments, pipeline, dependency graph, hex grid, pictogram,
 * meters, conic donut, status matrix and more. Hover cells for values.
 */

function vizData(k: DashboardKit) {
  const r = k.rng("viz")
  const lv = ["bg-surface-container-highest", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"]
  const start = new Date(2026, 9, 26 - 181)
  let total = 0
  const cal = Array.from({ length: 182 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const wk = d.getDay() % 6 !== 0
    const n = Math.max(0, Math.round((wk ? 6 : 1) * r() * (1 + i / 182) - (wk ? 0 : 1)))
    total += n
    return {
      cls: lv[Math.min(4, Math.ceil(n / 2.4))],
      tip: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) + " · " + n + " deploys",
    }
  })
  const tl = ["bg-surface-container-highest", "bg-tertiary/20", "bg-tertiary/40", "bg-tertiary/65", "bg-tertiary"]
  const matrix = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, di) => ({
    day,
    cells: Array.from({ length: 24 }, (_, h) => {
      const biz = di < 5 && h >= 8 && h <= 18
      const v = Math.round((biz ? 6 : 1.5) * r() + (h === 2 ? 3 : 0))
      return { cls: tl[Math.min(4, Math.ceil(v / 1.6))], tip: day + " " + String(h).padStart(2, "0") + ":00 · " + v + " alerts" }
    }),
  }))
  const uptime = (
    [
      ["checkout-api", 0.02],
      ["identity", 0.05],
      ["edge-cache", 0.01],
    ] as const
  ).map(([name, p]) => {
    let bad = 0
    const bars = Array.from({ length: 90 }, (_, i) => {
      const x = r()
      const st = x < p * 0.3 ? 2 : x < p ? 1 : 0
      if (st) bad += st === 2 ? 1 : 0.3
      const d = new Date(2026, 9, 26 - 89 + i).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      return {
        cls: ["bg-tertiary", "bg-secondary", "bg-error"][st],
        tip: name + " · " + d + " · " + ["Operational", "Degraded 14 min", "Outage 42 min"][st],
      }
    })
    return { name, pct: (100 - bad * 0.04).toFixed(2) + "%", bars }
  })
  return { cal, calTotal: total.toLocaleString("en-US"), matrix, uptime }
}

const hours = Array.from({ length: 24 }, (_, h) => (h % 6 === 0 ? String(h).padStart(2, "0") : ""))

const treemap = (
  [
    ["checkout", "28%", "col-start-1 col-span-3 row-start-1 row-span-2 bg-primary text-on-primary"],
    ["search", "13%", "col-start-4 col-span-3 row-start-1 bg-primary-container text-on-primary-container"],
    ["identity", "9%", "col-start-4 col-span-2 row-start-2 bg-tertiary-container text-on-tertiary-container"],
    ["ledger", "4%", "col-start-6 row-start-2 bg-secondary-container text-on-secondary-container"],
    ["edge-cache", "17%", "col-start-1 col-span-2 row-start-3 row-span-2 bg-tertiary text-on-tertiary"],
    ["scheduler", "9%", "col-start-3 col-span-2 row-start-3 bg-secondary-container text-on-secondary-container"],
    ["telemetry", "15%", "col-start-5 col-span-2 row-start-3 row-span-2 bg-primary-fixed-dim text-on-primary-fixed"],
    ["billing", "3%", "col-start-3 row-start-4 bg-surface-container-highest text-on-surface"],
    ["auth", "2%", "col-start-4 row-start-4 bg-surface-container-highest text-on-surface"],
  ] as const
).map(([name, v, cls]) => ({ name, v, cls }))

const bullets = (
  [
    ["Revenue", 4.8, 5.2, 6, 3.6, 4.8, "$", "M"],
    ["New accounts", 182, 160, 220, 110, 150, "", ""],
    ["NPS", 62, 70, 100, 40, 60, "", ""],
    ["Gross margin", 64, 68, 80, 55, 62, "", "%"],
    ["Uptime", 99.95, 99.9, 100, 99.5, 99.8, "", "%"],
  ] as const
).map(([label, val, tgt, max, poor, ok, pre, suf]) => {
  const min = label === "Uptime" ? 99 : 0
  const sc = (x: number) => ({ width: (((x - min) / (max - min)) * 100).toFixed(1) + "%" })
  return {
    label,
    value: pre + val + suf,
    target: pre + tgt + suf,
    poorStyle: sc(poor),
    okStyle: sc(ok),
    barStyle: sc(val),
    barCls: val >= tgt ? "bg-primary" : "bg-error",
    tgtStyle: { left: (((tgt - min) / (max - min)) * 100).toFixed(1) + "%" },
  }
})

const GAUGES = [
  ["CPU", 61],
  ["Memory", 74],
  ["Disk", 88],
] as const

const rings = (
  [
    ["CPU", 61, "stroke-primary"],
    ["Memory", 74, "stroke-tertiary"],
    ["Disk", 38, "stroke-secondary"],
    ["Network", 52, "stroke-primary"],
  ] as const
).map(([label, v, cls]) => ({ label, v, cls, style: { strokeDasharray: v + " 100" } }))

const DAYS = [19, 20, 21, 22, 23, 26, 27, 28, 29, 30]
const ganttDays = ["Mon 19", "Tue 20", "Wed 21", "Thu 22", "Fri 23", "Mon 26", "Tue 27", "Wed 28", "Thu 29", "Fri 30"].map((label, i) => ({
  label,
  cls: i === 5 ? "font-semibold text-error" : "",
}))
const gantt = (
  [
    ["Policy previews", "Ava Reyes", 0, 4, "Done", "bg-tertiary-container text-on-tertiary-container"],
    ["Expanded rail", "Jonah Park", 1, 5, "80%", "bg-primary text-on-primary"],
    ["Parallel promotion", "Maya Lindqvist", 3, 5, "60%", "bg-primary-container text-on-primary-container"],
    ["CVE gate", "Sam Okafor", 5, 3, "35%", "bg-secondary-container text-on-secondary-container"],
    ["Docs refresh", "Priya Nair", 6, 3, "Not started", "bg-surface-container-highest text-on-surface"],
    ["4.2 release", "Release crew", 9, 1, "Fri", "bg-error-container text-on-error-container"],
  ] as const
).map(([name, owner, st, len, pct, cls]) => ({
  name,
  owner,
  pct,
  cls,
  when: "Oct " + DAYS[st] + " – Oct " + DAYS[st + len - 1],
  style: { left: st * 10 + "%", width: "calc(" + len * 10 + "% - 4px)" },
}))

const seg = (i: number, n: number, on: boolean) =>
  on
    ? "rounded-full bg-primary text-on-primary"
    : (i === 0 ? "rounded-l-full rounded-r-sm" : i === n - 1 ? "rounded-l-sm rounded-r-full" : "rounded-sm") +
      " bg-surface-container-high text-on-surface-variant"

/** "Heatmaps, gauges & timelines" section. */
function DashboardViz({ className }: { className?: string }) {
  const kit = useDashboardKit()
  // Re-roll only when the data seed changes (not on every range switch).
  const { cal, calTotal, matrix, uptime } = React.useMemo(() => vizData(kit), [kit.seed])
  const [tips, setTips] = React.useState<Record<string, string>>({})
  const hover = (key: string) => (e: React.MouseEvent) => {
    const tip = (e.target as HTMLElement).dataset?.tip
    if (tip) setTips((t) => (t[key] === tip ? t : { ...t, [key]: tip }))
  }
  const [gauge, setGauge] = React.useState(0)
  const [gaugeLabel, gaugeVal] = GAUGES[gauge]
  const gaugeOpts = GAUGES.map(([label], i, a) => ({ label, cls: seg(i, a.length, i === gauge), pick: () => setGauge(i) }))
  const gaugeStroke = gaugeVal > 80 ? "stroke-error" : "stroke-primary"
  const gaugeDash = { strokeDasharray: gaugeVal + " 100" }
  const needleStyle = { transform: "rotate(" + (gaugeVal - 50) * 1.8 + "deg)", transformOrigin: "60px 60px" }
  return (
    <section id="viz" className={className ?? "mt-16 scroll-mt-36"} data-toc>
      <h2 className="text-headline-lg font-semibold">Heatmaps, gauges & timelines</h2>
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
        Built from Tailwind grids and SVG, no chart library. Hover cells for values; they theme with the color roles.
      </p>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-title-md">Deploy calendar</h3>
              <p className="text-body-sm text-on-surface-variant">Deploys per day · last 26 weeks</p>
            </div>
            <span
              aria-live="polite"
              className="rounded-sm bg-surface-container-high px-2 py-1 text-label-md tabular-nums text-on-surface-variant"
            >
              {tips.cal ?? "Hover a day"}
            </span>
          </div>
          <div className="relative mt-4 overflow-x-auto pb-1">
            <div className="flex w-max gap-2">
              <div className="grid grid-rows-7 gap-1 text-label-sm leading-[14px] text-on-surface-variant">
                <span className="h-3.5"></span>
                <span className="h-3.5">Mon</span>
                <span className="h-3.5"></span>
                <span className="h-3.5">Wed</span>
                <span className="h-3.5"></span>
                <span className="h-3.5">Fri</span>
                <span className="h-3.5"></span>
              </div>
              <div className="grid grid-flow-col grid-rows-7 gap-1" onMouseOver={hover("cal")}>
                {cal.map((d, d_i) => (
                  <React.Fragment key={d_i}>
                    <span className={`size-3.5 rounded-[3px] transition-transform hover:scale-125 ${d.cls}`} data-tip={d.tip}></span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-label-sm text-on-surface-variant">
            <span className="tabular-nums">{calTotal} deploys</span>
            <span className="flex items-center gap-1">
              Less<span className="size-3 rounded-[3px] bg-surface-container-highest"></span>
              <span className="size-3 rounded-[3px] bg-primary/25"></span>
              <span className="size-3 rounded-[3px] bg-primary/50"></span>
              <span className="size-3 rounded-[3px] bg-primary/75"></span>
              <span className="size-3 rounded-[3px] bg-primary"></span>More
            </span>
          </div>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-title-md">Alerts by hour</h3>
              <p className="text-body-sm text-on-surface-variant">Day × hour matrix, UTC</p>
            </div>
            <span
              aria-live="polite"
              className="rounded-sm bg-surface-container-high px-2 py-1 text-label-md tabular-nums text-on-surface-variant"
            >
              {tips.mx ?? "Hover a cell"}
            </span>
          </div>
          <div className="relative mt-4 overflow-x-auto">
            <div className="min-w-[520px]" onMouseOver={hover("mx")}>
              {" "}
              {matrix.map((row, row_i) => (
                <React.Fragment key={row_i}>
                  <div className="grid grid-cols-[36px_repeat(24,minmax(0,1fr))] gap-[3px] py-[1.5px]">
                    <span className="self-center text-label-sm leading-none text-on-surface-variant">{row.day}</span>
                    {row.cells.map((x, x_i) => (
                      <React.Fragment key={x_i}>
                        <span
                          className={`aspect-square rounded-[3px] transition-transform hover:scale-125 ${x.cls}`}
                          data-tip={x.tip}
                        ></span>
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              ))}{" "}
              <div className="grid grid-cols-[36px_repeat(24,minmax(0,1fr))] gap-[3px] pt-1 text-label-sm text-on-surface-variant">
                <span></span>
                {hours.map((h, h_i) => (
                  <React.Fragment key={h_i}>
                    <span>{h}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-title-md">Uptime · last 90 days</h3>
              <p className="text-body-sm text-on-surface-variant">One bar per day, hover for details</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-label-md text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-tertiary"></span>Operational
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-secondary"></span>Degraded
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-error"></span>Outage
              </span>
              <span aria-live="polite" className="rounded-sm bg-surface-container-high px-2 py-1 tabular-nums">
                {tips.up ?? "Hover a day"}
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-5" onMouseOver={hover("up")}>
            {uptime.map((u, u_i) => (
              <React.Fragment key={u_i}>
                <div>
                  <div className="flex items-center justify-between gap-2 text-body-md">
                    <span className="font-medium">{u.name}</span>
                    <span className="tabular-nums text-on-surface-variant">{u.pct} uptime</span>
                  </div>
                  <div className="mt-2 flex h-8 gap-[2px]">
                    {u.bars.map((b, b_i) => (
                      <React.Fragment key={b_i}>
                        <span
                          className={`min-w-0 flex-1 rounded-[2px] transition-transform hover:scale-y-110 ${b.cls}`}
                          data-tip={b.tip}
                        ></span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-label-sm text-on-surface-variant">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <h3 className="text-title-md">Compute spend treemap</h3>
          <p className="text-body-sm text-on-surface-variant">Area = share of spend · click a tile</p>
          <div className="mt-4 grid h-72 grid-cols-6 grid-rows-4 gap-1">
            {treemap.map((t, t_i) => (
              <React.Fragment key={t_i}>
                <button
                  className={`state-layer flex min-w-0 flex-col justify-between overflow-hidden rounded-md p-2 text-left transition-[border-radius] duration-300 hover:rounded-xl ${t.cls}`}
                  onClick={() => snackbar("{{ t.name }} · {{ t.v }} of compute spend")}
                >
                  <span className="truncate text-label-lg">{t.name}</span>
                  <span className="text-label-md tabular-nums opacity-80">{t.v}</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <h3 className="text-title-md">Bullet charts</h3>
          <p className="text-body-sm text-on-surface-variant">Actual vs target over qualitative bands</p>
          <div className="mt-5 space-y-5">
            {bullets.map((b, b_i) => (
              <React.Fragment key={b_i}>
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-label-lg">{b.label}</span>
                    <span className="flex items-baseline gap-1 text-body-sm text-on-surface-variant">
                      <span className="text-title-sm tabular-nums text-on-surface">{b.value}</span>
                      <span>/ target {b.target}</span>
                    </span>
                  </div>
                  <div className="relative mt-2 h-6 rounded-full bg-primary/10">
                    <span className="absolute inset-y-0 left-0 rounded-full bg-primary/15" style={b.okStyle}></span>
                    <span className="absolute inset-y-0 left-0 rounded-full bg-primary/25" style={b.poorStyle}></span>
                    <span className={`absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full ${b.barCls}`} style={b.barStyle}></span>
                    <span className="absolute inset-y-0.5 w-1 -translate-x-1/2 rounded-full bg-on-surface" style={b.tgtStyle}></span>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-title-md">Semicircle gauge</h3>
              <p className="text-body-sm text-on-surface-variant">Switch resources to animate</p>
            </div>
            <div className="inline-flex gap-0.5" role="group" aria-label="Resource">
              {gaugeOpts.map((o, o_i) => (
                <React.Fragment key={o_i}>
                  <button
                    className={`state-layer inline-flex h-9 items-center px-4 text-label-lg transition-all duration-300 ease-emphasized ${o.cls}`}
                    onClick={o.pick}
                  >
                    {o.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="mx-auto mt-6 w-full max-w-[300px]">
            <svg viewBox="0 0 120 66" className="w-full overflow-visible">
              {" "}
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                className="stroke-surface-container-highest"
                strokeWidth="12"
                strokeLinecap="round"
                pathLength="100"
              ></path>{" "}
              <path
                d="M 10 60 A 50 50 0 0 1 110 60"
                fill="none"
                className={`transition-all duration-700 ease-emphasized ${gaugeStroke}`}
                strokeWidth="12"
                strokeLinecap="round"
                pathLength="100"
                style={gaugeDash}
              ></path>{" "}
              <g className="transition-transform duration-700 ease-emphasized" style={needleStyle}>
                <line x1="60" y1="60" x2="60" y2="22" className="stroke-on-surface" strokeWidth="3" strokeLinecap="round"></line>
              </g>{" "}
              <circle cx="60" cy="60" r="5" className="fill-on-surface"></circle>{" "}
            </svg>
            <div className="mt-2 text-center">
              <div className="text-display-sm font-medium tabular-nums">{gaugeVal}%</div>
              <div className="text-body-sm text-on-surface-variant">{gaugeLabel} · alert above 80%</div>
            </div>
          </div>{" "}
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <h3 className="text-title-md">Progress rings</h3>
          <p className="text-body-sm text-on-surface-variant">Single rings and a concentric goal ring</p>
          <div className="mt-5 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {rings.map((r, r_i) => (
                <React.Fragment key={r_i}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative size-20">
                      <svg viewBox="0 0 48 48" className="size-20 -rotate-90">
                        <circle cx="24" cy="24" r="20" fill="none" className="stroke-surface-container-highest" strokeWidth="5"></circle>
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          className={`transition-all duration-700 ${r.cls}`}
                          strokeWidth="5"
                          strokeLinecap="round"
                          pathLength="100"
                          style={r.style}
                        ></circle>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-title-sm tabular-nums">{r.v}%</span>
                    </div>
                    <span className="text-label-md text-on-surface-variant">{r.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 100 100" className="size-32 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" className="stroke-primary/15" strokeWidth="10"></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="10"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="82 100"
                ></circle>
                <circle cx="50" cy="50" r="29" fill="none" className="stroke-tertiary/15" strokeWidth="10"></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="29"
                  fill="none"
                  className="stroke-tertiary"
                  strokeWidth="10"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="64 100"
                ></circle>
                <circle cx="50" cy="50" r="16" fill="none" className="stroke-secondary/20" strokeWidth="10"></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="16"
                  fill="none"
                  className="stroke-secondary"
                  strokeWidth="10"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="45 100"
                ></circle>
              </svg>
              <ul className="space-y-2 text-body-sm">
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-primary"></span>Deploy goal 82%
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-tertiary"></span>Test coverage 64%
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-secondary"></span>Docs 45%
                </li>
              </ul>
            </div>
          </div>{" "}
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-title-md">Release timeline</h3>
              <p className="text-body-sm text-on-surface-variant">Oct 19 – Oct 30 · click a bar</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-label-md text-error">
              <span className="h-3 w-0.5 rounded-full bg-error"></span>Today
            </span>
          </div>
          <div className="relative mt-4 overflow-x-auto">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[180px_minmax(0,1fr)] text-label-sm text-on-surface-variant">
                <span></span>
                <div className="grid grid-cols-10">
                  {ganttDays.map((d, d_i) => (
                    <React.Fragment key={d_i}>
                      <span className={`border-l border-outline-variant px-1.5 py-1 ${d.cls}`}>{d.label}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="relative">
                {" "}
                {gantt.map((t, t_i) => (
                  <React.Fragment key={t_i}>
                    <div className="grid grid-cols-[180px_minmax(0,1fr)] items-center border-t border-outline-variant/60 py-2">
                      <div className="min-w-0 pr-3">
                        <div className="truncate text-label-lg">{t.name}</div>
                        <div className="truncate text-body-sm text-on-surface-variant">{t.owner}</div>
                      </div>
                      <div className="relative h-8">
                        <button
                          className={`state-layer absolute inset-y-0 flex items-center overflow-hidden rounded-full px-3 text-label-md transition-[border-radius] duration-300 hover:rounded-md ${t.cls}`}
                          style={t.style}
                          onClick={() => snackbar("{{ t.name }} · {{ t.when }}")}
                        >
                          <span className="truncate">{t.pct}</span>
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                ))}{" "}
                <div className="pointer-events-none absolute inset-y-0 left-[180px] right-0">
                  <span className="absolute inset-y-0 w-0.5 bg-error" style={{ left: "55%" }}></span>
                </div>
              </div>{" "}
            </div>
          </div>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Waffle chart</h3>
              <p className="text-body-sm text-on-surface-variant">100 squares = 100% of accounts</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="grid w-44 grid-cols-10 gap-1">
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-primary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-tertiary"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
                <span className="aspect-square rounded-[3px] bg-surface-container-highest"></span>
              </div>
              <ul className="space-y-2 text-body-md">
                <li className="flex items-center gap-2">
                  <span className="size-3 rounded-[3px] bg-primary"></span>Business{" "}
                  <span className="tabular-nums text-on-surface-variant">62%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-3 rounded-[3px] bg-tertiary"></span>Enterprise{" "}
                  <span className="tabular-nums text-on-surface-variant">23%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-3 rounded-[3px] bg-surface-container-highest"></span>Starter{" "}
                  <span className="tabular-nums text-on-surface-variant">15%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Month heatmap</h3>
              <p className="text-body-sm text-on-surface-variant">October 2026 · deploys per day</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="mx-auto grid max-w-[340px] grid-cols-7 gap-1 text-center">
              <span className="text-label-sm text-on-surface-variant">Mon</span>
              <span className="text-label-sm text-on-surface-variant">Tue</span>
              <span className="text-label-sm text-on-surface-variant">Wed</span>
              <span className="text-label-sm text-on-surface-variant">Thu</span>
              <span className="text-label-sm text-on-surface-variant">Fri</span>
              <span className="text-label-sm text-on-surface-variant">Sat</span>
              <span className="text-label-sm text-on-surface-variant">Sun</span>
              <span></span>
              <span></span>
              <span></span>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-surface-container-highest "
                onClick={() => snackbar("Oct 1 · 0 deploys")}
              >
                1
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/50 "
                onClick={() => snackbar("Oct 2 · 14 deploys")}
              >
                2
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/25 "
                onClick={() => snackbar("Oct 3 · 7 deploys")}
              >
                3
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-surface-container-highest "
                onClick={() => snackbar("Oct 4 · 0 deploys")}
              >
                4
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary text-on-primary "
                onClick={() => snackbar("Oct 5 · 28 deploys")}
              >
                5
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/50 "
                onClick={() => snackbar("Oct 6 · 14 deploys")}
              >
                6
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/50 "
                onClick={() => snackbar("Oct 7 · 14 deploys")}
              >
                7
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/50 "
                onClick={() => snackbar("Oct 8 · 14 deploys")}
              >
                8
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/50 "
                onClick={() => snackbar("Oct 9 · 14 deploys")}
              >
                9
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/25 "
                onClick={() => snackbar("Oct 10 · 7 deploys")}
              >
                10
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/25 "
                onClick={() => snackbar("Oct 11 · 7 deploys")}
              >
                11
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/75 text-on-primary "
                onClick={() => snackbar("Oct 12 · 21 deploys")}
              >
                12
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-surface-container-highest "
                onClick={() => snackbar("Oct 13 · 0 deploys")}
              >
                13
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/25 "
                onClick={() => snackbar("Oct 14 · 7 deploys")}
              >
                14
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/50 "
                onClick={() => snackbar("Oct 15 · 14 deploys")}
              >
                15
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary text-on-primary "
                onClick={() => snackbar("Oct 16 · 28 deploys")}
              >
                16
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/25 "
                onClick={() => snackbar("Oct 17 · 7 deploys")}
              >
                17
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-surface-container-highest "
                onClick={() => snackbar("Oct 18 · 0 deploys")}
              >
                18
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/25 "
                onClick={() => snackbar("Oct 19 · 7 deploys")}
              >
                19
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/75 text-on-primary "
                onClick={() => snackbar("Oct 20 · 21 deploys")}
              >
                20
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/50 "
                onClick={() => snackbar("Oct 21 · 14 deploys")}
              >
                21
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/50 "
                onClick={() => snackbar("Oct 22 · 14 deploys")}
              >
                22
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/50 "
                onClick={() => snackbar("Oct 23 · 14 deploys")}
              >
                23
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/25 "
                onClick={() => snackbar("Oct 24 · 7 deploys")}
              >
                24
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/25 "
                onClick={() => snackbar("Oct 25 · 7 deploys")}
              >
                25
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md bg-primary/75 text-on-primary ring-2 ring-primary ring-offset-2 ring-offset-surface-container-low"
                onClick={() => snackbar("Oct 26 · 21 deploys")}
              >
                26
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md text-on-surface-variant/50 "
                onClick={() => snackbar("Oct 27 · no data yet")}
              >
                27
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md text-on-surface-variant/50 "
                onClick={() => snackbar("Oct 28 · no data yet")}
              >
                28
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md text-on-surface-variant/50 "
                onClick={() => snackbar("Oct 29 · no data yet")}
              >
                29
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md text-on-surface-variant/50 "
                onClick={() => snackbar("Oct 30 · no data yet")}
              >
                30
              </button>
              <button
                className="state-layer grid aspect-square place-items-center rounded-md text-label-md text-on-surface-variant/50 "
                onClick={() => snackbar("Oct 31 · no data yet")}
              >
                31
              </button>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Segmented capacity</h3>
              <p className="text-body-sm text-on-surface-variant">Cluster memory by workload</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex h-10 gap-1 overflow-hidden rounded-lg">
              <button
                className="state-layer bg-primary grid place-items-center text-label-md text-surface"
                style={{ width: "34%" }}
                onClick={() => snackbar("Web · 34% of memory")}
              >
                34%
              </button>
              <button
                className="state-layer bg-tertiary grid place-items-center text-label-md text-surface"
                style={{ width: "22%" }}
                onClick={() => snackbar("Workers · 22% of memory")}
              >
                22%
              </button>
              <button
                className="state-layer bg-secondary grid place-items-center text-label-md text-surface"
                style={{ width: "14%" }}
                onClick={() => snackbar("Cache · 14% of memory")}
              >
                14%
              </button>
              <button
                className="state-layer bg-error grid place-items-center text-label-md text-surface"
                style={{ width: "8%" }}
                onClick={() => snackbar("Batch · 8% of memory")}
              >
                8%
              </button>
              <span className="flex-1 bg-surface-container-highest"></span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-body-sm sm:grid-cols-5">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-primary"></span>Web
                </div>
                <div className="tabular-nums text-on-surface-variant">1.36 TB</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-tertiary"></span>Workers
                </div>
                <div className="tabular-nums text-on-surface-variant">0.88 TB</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-secondary"></span>Cache
                </div>
                <div className="tabular-nums text-on-surface-variant">0.56 TB</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-error"></span>Batch
                </div>
                <div className="tabular-nums text-on-surface-variant">0.32 TB</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-surface-container-highest"></span>Free
                </div>
                <div className="tabular-nums text-on-surface-variant">0.88 TB</div>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Pipeline stages</h3>
              <p className="text-body-sm text-on-surface-variant">Build → deploy flow, last 24 h</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex min-w-0 flex-1 basis-24 flex-col items-center rounded-lg bg-primary-container text-on-primary-container px-3 py-3 text-center">
                <Icon>code</Icon>
                <span className="mt-1 text-label-lg">Commit</span>
                <span className="text-title-md tabular-nums">412</span>
                <span className="text-label-sm opacity-80">start</span>
              </div>
              <Icon className="hidden text-on-surface-variant sm:inline-block">chevron_right</Icon>
              <div className="flex min-w-0 flex-1 basis-24 flex-col items-center rounded-lg bg-primary-container text-on-primary-container px-3 py-3 text-center">
                <Icon>build</Icon>
                <span className="mt-1 text-label-lg">Build</span>
                <span className="text-title-md tabular-nums">398</span>
                <span className="text-label-sm opacity-80">97%</span>
              </div>
              <Icon className="hidden text-on-surface-variant sm:inline-block">chevron_right</Icon>
              <div className="flex min-w-0 flex-1 basis-24 flex-col items-center rounded-lg bg-secondary-container text-on-secondary-container px-3 py-3 text-center">
                <Icon>science</Icon>
                <span className="mt-1 text-label-lg">Test</span>
                <span className="text-title-md tabular-nums">371</span>
                <span className="text-label-sm opacity-80">93%</span>
              </div>
              <Icon className="hidden text-on-surface-variant sm:inline-block">chevron_right</Icon>
              <div className="flex min-w-0 flex-1 basis-24 flex-col items-center rounded-lg bg-secondary-container text-on-secondary-container px-3 py-3 text-center">
                <Icon>verified</Icon>
                <span className="mt-1 text-label-lg">Approve</span>
                <span className="text-title-md tabular-nums">355</span>
                <span className="text-label-sm opacity-80">96%</span>
              </div>
              <Icon className="hidden text-on-surface-variant sm:inline-block">chevron_right</Icon>
              <div className="flex min-w-0 flex-1 basis-24 flex-col items-center rounded-lg bg-tertiary-container text-on-tertiary-container px-3 py-3 text-center">
                <Icon>rocket_launch</Icon>
                <span className="mt-1 text-label-lg">Deploy</span>
                <span className="text-title-md tabular-nums">349</span>
                <span className="text-label-sm opacity-80">98%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Service dependencies</h3>
              <p className="text-body-sm text-on-surface-variant">Click a node · redis is degraded</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative h-64 rounded-lg bg-surface">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                <line
                  x1="50"
                  y1="12"
                  x2="22"
                  y2="45"
                  className="stroke-outline-variant"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                ></line>
                <line
                  x1="50"
                  y1="12"
                  x2="50"
                  y2="45"
                  className="stroke-outline-variant"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                ></line>
                <line
                  x1="50"
                  y1="12"
                  x2="78"
                  y2="45"
                  className="stroke-outline-variant"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                ></line>
                <line
                  x1="22"
                  y1="45"
                  x2="22"
                  y2="82"
                  className="stroke-outline-variant"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                ></line>
                <line
                  x1="22"
                  y1="45"
                  x2="50"
                  y2="82"
                  className="stroke-outline-variant"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                ></line>
                <line
                  x1="50"
                  y1="45"
                  x2="50"
                  y2="82"
                  className="stroke-outline-variant"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                ></line>
                <line
                  x1="78"
                  y1="45"
                  x2="78"
                  y2="82"
                  className="stroke-error"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  strokeDasharray="4 3"
                ></line>
                <line
                  x1="22"
                  y1="45"
                  x2="78"
                  y2="45"
                  className="stroke-outline-variant"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                ></line>
              </svg>
              <button
                className="state-layer absolute inline-flex h-8 -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 font-mono text-label-md shadow-1 bg-primary text-on-primary"
                style={{ left: "50%", top: "12%" }}
                data-press
                onClick={() => snackbar("gateway · healthy")}
              >
                gateway
              </button>
              <button
                className="state-layer absolute inline-flex h-8 -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 font-mono text-label-md shadow-1 bg-primary-container text-on-primary-container"
                style={{ left: "22%", top: "45%" }}
                data-press
                onClick={() => snackbar("checkout · healthy")}
              >
                checkout
              </button>
              <button
                className="state-layer absolute inline-flex h-8 -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 font-mono text-label-md shadow-1 bg-primary-container text-on-primary-container"
                style={{ left: "50%", top: "45%" }}
                data-press
                onClick={() => snackbar("search · healthy")}
              >
                search
              </button>
              <button
                className="state-layer absolute inline-flex h-8 -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 font-mono text-label-md shadow-1 bg-tertiary-container text-on-tertiary-container"
                style={{ left: "78%", top: "45%" }}
                data-press
                onClick={() => snackbar("identity · healthy")}
              >
                identity
              </button>
              <button
                className="state-layer absolute inline-flex h-8 -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 font-mono text-label-md shadow-1 bg-secondary-container text-on-secondary-container"
                style={{ left: "22%", top: "82%" }}
                data-press
                onClick={() => snackbar("ledger · healthy")}
              >
                ledger
              </button>
              <button
                className="state-layer absolute inline-flex h-8 -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 font-mono text-label-md shadow-1 bg-surface-container-highest text-on-surface"
                style={{ left: "50%", top: "82%" }}
                data-press
                onClick={() => snackbar("postgres · healthy")}
              >
                postgres
              </button>
              <button
                className="state-layer absolute inline-flex h-8 -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 font-mono text-label-md shadow-1 bg-error-container text-on-error-container"
                style={{ left: "78%", top: "82%" }}
                data-press
                onClick={() => snackbar("redis · degraded, 2 of 3 replicas")}
              >
                redis
              </button>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Node hex grid</h3>
              <p className="text-body-sm text-on-surface-variant">36 nodes · hover to inspect</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-1 pl-3">
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-01 · healthy"
                onClick={() => snackbar("node-01 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-02 · healthy"
                onClick={() => snackbar("node-02 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-03 · healthy"
                onClick={() => snackbar("node-03 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-04 · healthy"
                onClick={() => snackbar("node-04 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-secondary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-05 · high CPU"
                onClick={() => snackbar("node-05 · high CPU")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-06 · healthy"
                onClick={() => snackbar("node-06 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-07 · healthy"
                onClick={() => snackbar("node-07 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-error transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-08 · unreachable"
                onClick={() => snackbar("node-08 · unreachable")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-09 · healthy"
                onClick={() => snackbar("node-09 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-10 · healthy"
                onClick={() => snackbar("node-10 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-11 · healthy"
                onClick={() => snackbar("node-11 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-12 · healthy"
                onClick={() => snackbar("node-12 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-13 · healthy"
                onClick={() => snackbar("node-13 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-secondary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-14 · high CPU"
                onClick={() => snackbar("node-14 · high CPU")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-15 · healthy"
                onClick={() => snackbar("node-15 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-16 · healthy"
                onClick={() => snackbar("node-16 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-17 · healthy"
                onClick={() => snackbar("node-17 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-18 · healthy"
                onClick={() => snackbar("node-18 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-19 · healthy"
                onClick={() => snackbar("node-19 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-20 · healthy"
                onClick={() => snackbar("node-20 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-21 · healthy"
                onClick={() => snackbar("node-21 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-22 · healthy"
                onClick={() => snackbar("node-22 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-error transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-23 · unreachable"
                onClick={() => snackbar("node-23 · unreachable")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-24 · healthy"
                onClick={() => snackbar("node-24 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-25 · healthy"
                onClick={() => snackbar("node-25 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-26 · healthy"
                onClick={() => snackbar("node-26 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] "
                title="node-27 · healthy"
                onClick={() => snackbar("node-27 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-28 · healthy"
                onClick={() => snackbar("node-28 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-29 · healthy"
                onClick={() => snackbar("node-29 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-30 · healthy"
                onClick={() => snackbar("node-30 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-31 · healthy"
                onClick={() => snackbar("node-31 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-secondary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-32 · high CPU"
                onClick={() => snackbar("node-32 · high CPU")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-33 · healthy"
                onClick={() => snackbar("node-33 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-34 · healthy"
                onClick={() => snackbar("node-34 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-35 · healthy"
                onClick={() => snackbar("node-35 · healthy")}
              ></button>
              <button
                className="state-layer size-9 bg-tertiary transition-transform hover:scale-110 [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0_50%)] -ml-1"
                title="node-36 · healthy"
                onClick={() => snackbar("node-36 · healthy")}
              ></button>
            </div>
            <div className="mt-3 flex gap-4 text-label-md text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-tertiary"></span>32 healthy
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-secondary"></span>2 high CPU
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-error"></span>2 down
              </span>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Pictogram</h3>
              <p className="text-body-sm text-on-surface-variant">14 of 20 teams adopted policy previews</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-10 gap-1 text-primary">
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled>
                person
              </Icon>
              <Icon size={28} filled className="text-surface-container-highest">
                person
              </Icon>
              <Icon size={28} filled className="text-surface-container-highest">
                person
              </Icon>
              <Icon size={28} filled className="text-surface-container-highest">
                person
              </Icon>
              <Icon size={28} filled className="text-surface-container-highest">
                person
              </Icon>
              <Icon size={28} filled className="text-surface-container-highest">
                person
              </Icon>
              <Icon size={28} filled className="text-surface-container-highest">
                person
              </Icon>
            </div>
            <div className="mt-3 text-headline-sm font-medium tabular-nums">
              70% <span className="text-body-md font-normal text-on-surface-variant">adoption</span>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Vertical gauges</h3>
              <p className="text-body-sm text-on-surface-variant">Queue backlog per worker pool</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex h-48 items-end justify-around gap-4">
              <div className="flex h-full flex-col items-center gap-2">
                <span className="text-label-md tabular-nums">72%</span>
                <div className="relative w-8 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-full bg-primary transition-all duration-700"
                    style={{ height: "72%" }}
                  ></div>
                  <span className="absolute inset-x-1 top-[20%] h-px bg-error/60"></span>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant">ingest</span>
              </div>
              <div className="flex h-full flex-col items-center gap-2">
                <span className="text-label-md tabular-nums">38%</span>
                <div className="relative w-8 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-full bg-tertiary transition-all duration-700"
                    style={{ height: "38%" }}
                  ></div>
                  <span className="absolute inset-x-1 top-[20%] h-px bg-error/60"></span>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant">email</span>
              </div>
              <div className="flex h-full flex-col items-center gap-2">
                <span className="text-label-md tabular-nums">91%</span>
                <div className="relative w-8 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-full bg-error transition-all duration-700"
                    style={{ height: "91%" }}
                  ></div>
                  <span className="absolute inset-x-1 top-[20%] h-px bg-error/60"></span>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant">export</span>
              </div>
              <div className="flex h-full flex-col items-center gap-2">
                <span className="text-label-md tabular-nums">55%</span>
                <div className="relative w-8 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-full bg-secondary transition-all duration-700"
                    style={{ height: "55%" }}
                  ></div>
                  <span className="absolute inset-x-1 top-[20%] h-px bg-error/60"></span>
                </div>
                <span className="font-mono text-label-sm text-on-surface-variant">webhooks</span>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Battery meters</h3>
              <p className="text-body-sm text-on-surface-variant">Edge devices on UPS</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center">
                  <div className="relative h-10 w-20 overflow-hidden rounded-md border-2 border-outline p-0.5">
                    <div className="h-full rounded-sm bg-tertiary" style={{ width: "92%" }}></div>
                  </div>
                  <span className="h-4 w-1 rounded-r-sm bg-outline"></span>
                </div>
                <span className="text-title-sm tabular-nums">92%</span>
                <span className="font-mono text-label-sm text-on-surface-variant">edge-ams</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center">
                  <div className="relative h-10 w-20 overflow-hidden rounded-md border-2 border-outline p-0.5">
                    <div className="h-full rounded-sm bg-tertiary" style={{ width: "64%" }}></div>
                  </div>
                  <span className="h-4 w-1 rounded-r-sm bg-outline"></span>
                </div>
                <span className="text-title-sm tabular-nums">64%</span>
                <span className="font-mono text-label-sm text-on-surface-variant">edge-fra</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center">
                  <div className="relative h-10 w-20 overflow-hidden rounded-md border-2 border-outline p-0.5">
                    <div className="h-full rounded-sm bg-error" style={{ width: "18%" }}></div>
                  </div>
                  <span className="h-4 w-1 rounded-r-sm bg-outline"></span>
                </div>
                <span className="text-title-sm tabular-nums">18%</span>
                <span className="font-mono text-label-sm text-on-surface-variant">edge-nyc</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center">
                  <div className="relative h-10 w-20 overflow-hidden rounded-md border-2 border-outline p-0.5">
                    <div className="h-full rounded-sm bg-secondary" style={{ width: "47%" }}></div>
                  </div>
                  <span className="h-4 w-1 rounded-r-sm bg-outline"></span>
                </div>
                <span className="text-title-sm tabular-nums">47%</span>
                <span className="font-mono text-label-sm text-on-surface-variant">edge-sin</span>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Linear gauge</h3>
              <p className="text-body-sm text-on-surface-variant">Error budget burn rate · 1.4×</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative pt-8">
              <span
                className="absolute top-0 -translate-x-1/2 rounded-full bg-inverse-surface px-2 py-0.5 text-label-md text-inverse-on-surface"
                style={{ left: "35%" }}
              >
                1.4×
              </span>
              <span
                className="absolute top-6 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[8px] border-x-transparent border-t-inverse-surface"
                style={{ left: "35%" }}
              ></span>
              <div className="flex h-4 gap-0.5 overflow-hidden rounded-full">
                <span className="w-1/4 bg-tertiary"></span>
                <span className="w-1/4 bg-tertiary/60"></span>
                <span className="w-1/4 bg-secondary"></span>
                <span className="w-1/4 bg-error"></span>
              </div>
              <div className="mt-2 flex justify-between text-label-sm tabular-nums text-on-surface-variant">
                <span>0×</span>
                <span>1×</span>
                <span>2×</span>
                <span>3×</span>
                <span>4×</span>
              </div>
              <p className="mt-3 text-body-sm text-on-surface-variant">At this rate the monthly budget lasts 21 more days.</p>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Conic donut</h3>
              <p className="text-body-sm text-on-surface-variant">Pure CSS conic-gradient</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-6">
              <div className="relative size-36 shrink-0 rounded-full [background:conic-gradient(var(--md-primary)_0_45%,var(--md-tertiary)_0_72%,var(--md-secondary)_0_90%,var(--md-surface-container-highest)_0)]">
                <div className="absolute inset-5 grid place-items-center rounded-full bg-surface-container-low text-center">
                  <span className="text-title-lg tabular-nums">2,410</span>
                </div>
              </div>
              <ul className="space-y-2 text-body-md">
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-primary"></span>Web 45%
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-tertiary"></span>API 27%
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-secondary"></span>Mobile 18%
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-surface-container-highest"></span>Other 10%
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Stacked % bars</h3>
              <p className="text-body-sm text-on-surface-variant">Plan mix per region</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-12 text-label-lg">EU</span>
                <div className="flex h-6 min-w-0 flex-1 gap-0.5 overflow-hidden rounded-full text-label-sm">
                  <span className="grid place-items-center bg-primary text-on-primary" style={{ width: "20%" }}>
                    20%
                  </span>
                  <span className="grid place-items-center bg-primary/60 text-on-primary" style={{ width: "26%" }}>
                    26%
                  </span>
                  <span className="grid flex-1 place-items-center bg-primary/20">54%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-label-lg">US</span>
                <div className="flex h-6 min-w-0 flex-1 gap-0.5 overflow-hidden rounded-full text-label-sm">
                  <span className="grid place-items-center bg-primary text-on-primary" style={{ width: "37%" }}>
                    37%
                  </span>
                  <span className="grid place-items-center bg-primary/60 text-on-primary" style={{ width: "41%" }}>
                    41%
                  </span>
                  <span className="grid flex-1 place-items-center bg-primary/20">22%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-label-lg">APAC</span>
                <div className="flex h-6 min-w-0 flex-1 gap-0.5 overflow-hidden rounded-full text-label-sm">
                  <span className="grid place-items-center bg-primary text-on-primary" style={{ width: "20%" }}>
                    20%
                  </span>
                  <span className="grid place-items-center bg-primary/60 text-on-primary" style={{ width: "32%" }}>
                    32%
                  </span>
                  <span className="grid flex-1 place-items-center bg-primary/20">48%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-12 text-label-lg">LATAM</span>
                <div className="flex h-6 min-w-0 flex-1 gap-0.5 overflow-hidden rounded-full text-label-sm">
                  <span className="grid place-items-center bg-primary text-on-primary" style={{ width: "47%" }}>
                    47%
                  </span>
                  <span className="grid place-items-center bg-primary/60 text-on-primary" style={{ width: "36%" }}>
                    36%
                  </span>
                  <span className="grid flex-1 place-items-center bg-primary/20">17%</span>
                </div>
              </div>
              <div className="flex gap-4 pt-1 text-label-md text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-primary"></span>Enterprise
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-primary/60"></span>Business
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-primary/20"></span>Starter
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Event timeline</h3>
              <p className="text-body-sm text-on-surface-variant">Last 8 weeks</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative overflow-x-auto">
              <div className="relative h-40 min-w-[520px]">
                <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-outline-variant"></span>
                <button
                  className="state-layer absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ring-4 ring-surface-container-low bg-primary text-on-primary"
                  style={{ left: "8%" }}
                  data-press
                  onClick={() => snackbar("Release 4.1")}
                >
                  <Icon size={18}>rocket_launch</Icon>
                </button>
                <span className="absolute -translate-x-1/2 whitespace-nowrap text-label-md top-3" style={{ left: "8%" }}>
                  Release 4.1
                </span>
                <button
                  className="state-layer absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ring-4 ring-surface-container-low bg-error text-on-error"
                  style={{ left: "27%" }}
                  data-press
                  onClick={() => snackbar("INC-2285")}
                >
                  <Icon size={18}>warning</Icon>
                </button>
                <span className="absolute -translate-x-1/2 whitespace-nowrap text-label-md bottom-3" style={{ left: "27%" }}>
                  INC-2285
                </span>
                <button
                  className="state-layer absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ring-4 ring-surface-container-low bg-tertiary text-on-tertiary"
                  style={{ left: "44%" }}
                  data-press
                  onClick={() => snackbar("Policy GA")}
                >
                  <Icon size={18}>policy</Icon>
                </button>
                <span className="absolute -translate-x-1/2 whitespace-nowrap text-label-md top-3" style={{ left: "44%" }}>
                  Policy GA
                </span>
                <button
                  className="state-layer absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ring-4 ring-surface-container-low bg-secondary text-on-secondary"
                  style={{ left: "61%" }}
                  data-press
                  onClick={() => snackbar("Region: Sydney")}
                >
                  <Icon size={18}>public</Icon>
                </button>
                <span className="absolute -translate-x-1/2 whitespace-nowrap text-label-md bottom-3" style={{ left: "61%" }}>
                  Region: Sydney
                </span>
                <button
                  className="state-layer absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ring-4 ring-surface-container-low bg-primary text-on-primary"
                  style={{ left: "80%" }}
                  data-press
                  onClick={() => snackbar("Release 4.2")}
                >
                  <Icon size={18}>rocket_launch</Icon>
                </button>
                <span className="absolute -translate-x-1/2 whitespace-nowrap text-label-md top-3" style={{ left: "80%" }}>
                  Release 4.2
                </span>
                <button
                  className="state-layer absolute top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full ring-4 ring-surface-container-low bg-inverse-surface text-inverse-on-surface"
                  style={{ left: "93%" }}
                  data-press
                  onClick={() => snackbar("Today")}
                >
                  <Icon size={18}>today</Icon>
                </button>
                <span className="absolute -translate-x-1/2 whitespace-nowrap text-label-md bottom-3" style={{ left: "93%" }}>
                  Today
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Status matrix</h3>
              <p className="text-body-sm text-on-surface-variant">Services × checks</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[420px] text-center text-body-sm">
                <thead className="text-label-md text-on-surface-variant">
                  <tr>
                    <th className="py-2 text-left font-medium">Service</th>
                    <th className="py-2 font-medium">Health</th>
                    <th className="py-2 font-medium">TLS</th>
                    <th className="py-2 font-medium">Backups</th>
                    <th className="py-2 font-medium">Policy</th>
                    <th className="py-2 font-medium">Alerts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <tr>
                    <td className="py-2 text-left font-mono">checkout</td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-secondary">
                        warning
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-left font-mono">search</td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-error">
                        cancel
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-left font-mono">identity</td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-secondary">
                        warning
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-left font-mono">ledger</td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-error">
                        cancel
                      </Icon>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-left font-mono">edge</td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-tertiary">
                        check_circle
                      </Icon>
                    </td>
                    <td className="py-2">
                      <Icon size={20} filled className="text-error">
                        cancel
                      </Icon>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Segmented ring</h3>
              <p className="text-body-sm text-on-surface-variant">Onboarding steps · 5 of 8</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-6">
              <div className="relative size-36 shrink-0">
                <svg viewBox="0 0 48 48" className="size-36 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    fill="none"
                    className="stroke-surface-container-highest"
                    strokeWidth="6"
                    pathLength="100"
                    strokeDasharray="10.5 2"
                  ></circle>
                  <circle
                    cx="24"
                    cy="24"
                    r="19"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="6"
                    pathLength="100"
                    strokeDasharray="10.5 2 10.5 2 10.5 2 10.5 2 10.5 39.5"
                  ></circle>
                </svg>
                <span className="absolute inset-0 grid place-items-center text-headline-sm tabular-nums">5/8</span>
              </div>
              <ol className="space-y-1.5 text-body-sm">
                <li className="flex items-center gap-2 ">
                  <Icon size={18} filled className="text-primary">
                    check_circle
                  </Icon>
                  Connect cloud
                </li>
                <li className="flex items-center gap-2 ">
                  <Icon size={18} filled className="text-primary">
                    check_circle
                  </Icon>
                  Import owners
                </li>
                <li className="flex items-center gap-2 ">
                  <Icon size={18} filled className="text-primary">
                    check_circle
                  </Icon>
                  Enable policy
                </li>
                <li className="flex items-center gap-2 ">
                  <Icon size={18} filled className="text-primary">
                    check_circle
                  </Icon>
                  Invite team
                </li>
                <li className="flex items-center gap-2 ">
                  <Icon size={18} filled className="text-primary">
                    check_circle
                  </Icon>
                  First deploy
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant">
                  <Icon size={18}>radio_button_unchecked</Icon>Set budgets
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant">
                  <Icon size={18}>radio_button_unchecked</Icon>SSO
                </li>
                <li className="flex items-center gap-2 text-on-surface-variant">
                  <Icon size={18}>radio_button_unchecked</Icon>Go live
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Rating distribution</h3>
              <p className="text-body-sm text-on-surface-variant">1,204 reviews</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-display-sm font-medium tabular-nums">4.7</div>
                <div className="flex text-primary">
                  <Icon size={16} filled>
                    star
                  </Icon>
                  <Icon size={16} filled>
                    star
                  </Icon>
                  <Icon size={16} filled>
                    star
                  </Icon>
                  <Icon size={16} filled>
                    star
                  </Icon>
                  <Icon size={16} filled>
                    star
                  </Icon>
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-2 text-label-md">
                  <span className="w-3 tabular-nums">5</span>
                  <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "78%" }}></div>
                  </div>
                  <span className="w-8 text-right tabular-nums text-on-surface-variant">78%</span>
                </div>
                <div className="flex items-center gap-2 text-label-md">
                  <span className="w-3 tabular-nums">4</span>
                  <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "14%" }}></div>
                  </div>
                  <span className="w-8 text-right tabular-nums text-on-surface-variant">14%</span>
                </div>
                <div className="flex items-center gap-2 text-label-md">
                  <span className="w-3 tabular-nums">3</span>
                  <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "5%" }}></div>
                  </div>
                  <span className="w-8 text-right tabular-nums text-on-surface-variant">5%</span>
                </div>
                <div className="flex items-center gap-2 text-label-md">
                  <span className="w-3 tabular-nums">2</span>
                  <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "2%" }}></div>
                  </div>
                  <span className="w-8 text-right tabular-nums text-on-surface-variant">2%</span>
                </div>
                <div className="flex items-center gap-2 text-label-md">
                  <span className="w-3 tabular-nums">1</span>
                  <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "1%" }}></div>
                  </div>
                  <span className="w-8 text-right tabular-nums text-on-surface-variant">1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Slope compare</h3>
              <p className="text-body-sm text-on-surface-variant">Before → after migration</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative h-48">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-16 inset-y-0 h-full w-[calc(100%-8rem)]">
                <line x1="0" y1="70" x2="100" y2="30" className="stroke-primary" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></line>
                <line
                  x1="0"
                  y1="80"
                  x2="100"
                  y2="55"
                  className="stroke-tertiary"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                ></line>
                <line x1="0" y1="40" x2="100" y2="65" className="stroke-error" strokeWidth="2.5" vectorEffect="non-scaling-stroke"></line>
                <line
                  x1="0"
                  y1="20"
                  x2="100"
                  y2="12"
                  className="stroke-secondary"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                ></line>
              </svg>
              <div className="absolute inset-y-0 left-0 w-16 text-right text-label-sm text-on-surface-variant">
                <span className="absolute right-2 -translate-y-1/2 whitespace-nowrap" style={{ top: "70%" }}>
                  p95
                </span>
                <span className="absolute right-2 -translate-y-1/2 whitespace-nowrap" style={{ top: "80%" }}>
                  Cost
                </span>
                <span className="absolute right-2 -translate-y-1/2 whitespace-nowrap" style={{ top: "40%" }}>
                  Errors
                </span>
                <span className="absolute right-2 -translate-y-1/2 whitespace-nowrap" style={{ top: "20%" }}>
                  Uptime
                </span>
              </div>
              <div className="absolute inset-y-0 right-0 w-16 text-label-sm">
                <span className="absolute left-2 -translate-y-1/2 tabular-nums" style={{ top: "30%" }}>
                  +40
                </span>
                <span className="absolute left-2 -translate-y-1/2 tabular-nums" style={{ top: "55%" }}>
                  +25
                </span>
                <span className="absolute left-2 -translate-y-1/2 tabular-nums" style={{ top: "65%" }}>
                  −25
                </span>
                <span className="absolute left-2 -translate-y-1/2 tabular-nums" style={{ top: "12%" }}>
                  +8
                </span>
              </div>
            </div>
            <div className="flex justify-between px-16 text-label-md text-on-surface-variant">
              <span>Before</span>
              <span>After</span>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Sparkline grid</h3>
              <p className="text-body-sm text-on-surface-variant">Six KPIs, SVG polylines</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-surface p-3">
                <div className="text-label-md text-on-surface-variant">Requests</div>
                <div className="text-title-md tabular-nums">478k</div>
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full">
                  <polyline
                    points="0.0,2.0 7.7,4.8 15.4,3.9 23.1,5.4 30.8,27.7 38.5,27.6 46.2,26.9 53.8,19.6 61.5,30.0 69.2,26.8 76.9,26.5 84.6,22.2 92.3,9.0 100.0,12.8"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  ></polyline>
                </svg>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <div className="text-label-md text-on-surface-variant">Errors</div>
                <div className="text-title-md tabular-nums">0.04%</div>
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full">
                  <polyline
                    points="0.0,2.0 7.7,7.5 15.4,2.9 23.1,14.7 30.8,12.4 38.5,11.8 46.2,23.9 53.8,30.0 61.5,20.7 69.2,26.0 76.9,20.5 84.6,16.5 92.3,21.4 100.0,2.9"
                    fill="none"
                    className="stroke-error"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  ></polyline>
                </svg>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <div className="text-label-md text-on-surface-variant">p95</div>
                <div className="text-title-md tabular-nums">182 ms</div>
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full">
                  <polyline
                    points="0.0,8.4 7.7,2.0 15.4,12.1 23.1,11.2 30.8,19.8 38.5,30.0 46.2,22.8 53.8,26.4 61.5,27.2 69.2,29.5 76.9,26.1 84.6,12.7 92.3,14.0 100.0,10.8"
                    fill="none"
                    className="stroke-tertiary"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  ></polyline>
                </svg>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <div className="text-label-md text-on-surface-variant">Deploys</div>
                <div className="text-title-md tabular-nums">1,284</div>
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full">
                  <polyline
                    points="0.0,2.0 7.7,4.4 15.4,2.1 23.1,12.1 30.8,17.8 38.5,13.6 46.2,29.0 53.8,19.9 61.5,20.5 69.2,30.0 76.9,26.9 84.6,4.4 92.3,8.9 100.0,6.3"
                    fill="none"
                    className="stroke-primary"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  ></polyline>
                </svg>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <div className="text-label-md text-on-surface-variant">Spend</div>
                <div className="text-title-md tabular-nums">$212k</div>
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full">
                  <polyline
                    points="0.0,10.9 7.7,3.0 15.4,3.2 23.1,8.2 30.8,2.0 38.5,24.0 46.2,25.3 53.8,28.2 61.5,17.5 69.2,30.0 76.9,17.7 84.6,8.1 92.3,18.9 100.0,2.9"
                    fill="none"
                    className="stroke-secondary"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  ></polyline>
                </svg>
              </div>
              <div className="rounded-lg bg-surface p-3">
                <div className="text-label-md text-on-surface-variant">Users</div>
                <div className="text-title-md tabular-nums">18.2k</div>
                <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full">
                  <polyline
                    points="0.0,18.3 7.7,3.1 15.4,10.4 23.1,2.0 30.8,29.0 38.5,30.0 46.2,29.5 53.8,26.2 61.5,24.3 69.2,29.6 76.9,28.7 84.6,17.3 92.3,3.5 100.0,11.9"
                    fill="none"
                    className="stroke-tertiary"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                  ></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </section>
  )
}

export { DashboardViz }
