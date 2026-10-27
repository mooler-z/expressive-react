"use client"

import * as React from "react"

import { CopyButton } from "@/components/ui/code-block"
import { Icon } from "@/components/ui/icon"
import { Shape } from "@/components/ui/shape"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { useDashboardKit, wave } from "./kit-data"

/*
 * Lists, tables & feeds · 26 data-display widgets: sortable leaderboard, ranked customers,
 * activity feed, goals, incidents, period comparison, key-value details, region health,
 * expandable rows, notifications, team, storage, releases, agenda, SLA timers, plan tiers,
 * log viewer, alert summary, status, job queue, countries, stat tabs and an audit trail.
 */

const AV = [
  "bg-primary-container text-on-primary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-secondary-container text-on-secondary-container",
  "bg-primary-fixed-dim text-on-primary-fixed",
]

const BOARD = [
  ["checkout-api", "Maya Lindqvist", "1,240k", "182 ms", 4.1],
  ["search", "Ava Reyes", "980k", "96 ms", 2.3],
  ["identity", "Jonah Park", "760k", "64 ms", -1.8],
  ["edge-cache", "Sam Okafor", "2,410k", "41 ms", 7.2],
  ["billing-sync", "Priya Nair", "120k", "1,240 ms", -12.6],
  ["scheduler", "Tomás Weber", "310k", "210 ms", 0.6],
] as const

const num = (s: string) => parseFloat(s.replace(/[^\d.-]/g, ""))

type SortKey = "svc" | "req" | "p95" | "delta"
type Sort = { key: SortKey; dir: 1 | -1 } | null

function useBoard() {
  const kit = useDashboardKit()
  const lr = kit.rng("board")
  return BOARD.map((x, i) => {
    const pts = wave(lr, 16, 50, 15, x[4] / 3),
      mn = Math.min(...pts),
      mx = Math.max(...pts) || 1
    return {
      svc: x[0],
      owner: x[1],
      ini: x[1]
        .split(" ")
        .map((w) => w[0])
        .join(""),
      avCls: AV[i % 4],
      req: x[2],
      p95: x[3],
      deltaN: x[4],
      delta: (x[4] > 0 ? "+" : "") + x[4] + "%",
      dIcon: x[4] >= 0 ? "trending_up" : "trending_down",
      dCls: x[4] >= 0 ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container",
      lineCls: x[4] >= 0 ? "stroke-primary" : "stroke-error",
      pts: pts.map((p, j) => ((j * 80) / 15).toFixed(1) + "," + (22 - ((p - mn) / (mx - mn || 1)) * 20).toFixed(1)).join(" "),
    }
  })
}

function SortButton({ id, label, sort, onSort }: { id: SortKey; label: string; sort: Sort; onSort: (s: Sort) => void }) {
  const active = sort?.key === id
  return (
    <button
      type="button"
      className="state-layer focus-ring -ml-2 inline-flex h-8 cursor-pointer items-center gap-1 rounded-full pr-1 pl-2"
      aria-label={`Sort by ${label}`}
      onClick={() => onSort(active && sort.dir === -1 ? null : { key: id, dir: active ? -1 : 1 })}
    >
      {label}
      <Icon size={18} className={cn("transition-transform", !active && "opacity-0", active && sort.dir === -1 && "rotate-180")}>
        arrow_upward
      </Icon>
    </button>
  )
}

const CUSTOMERS = (
  [
    ["Halide Bank", "$1.42M", 100],
    ["Meridian Health", "$1.18M", 83],
    ["Northwind", "$0.96M", 68],
    ["Quorum Energy", "$0.71M", 50],
    ["Tessera Logistics", "$0.58M", 41],
    ["Lattice Labs", "$0.33M", 23],
  ] as const
).map(([name, v, p], i) => ({
  rank: i + 1,
  name,
  v,
  style: { width: p + "%" },
  rankCls: i < 3 ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant",
}))

const ACTIVITY = [
  ["rocket_launch", "bg-primary-container text-on-primary-container", "Maya promoted checkout-api v4.2.0 to 100%", "2 min ago"],
  ["policy", "bg-tertiary-container text-on-tertiary-container", "Policy no-public-buckets enforced in production", "18 min ago"],
  ["warning", "bg-error-container text-on-error-container", "INC-2291 opened · billing-sync returning 502", "1 h ago"],
  ["person_add", "bg-secondary-container text-on-secondary-container", "Jonah invited 3 engineers to Payments", "3 h ago"],
  ["savings", "bg-tertiary-container text-on-tertiary-container", "Reserved capacity saved $4,120 this week", "Yesterday"],
  ["key", "bg-primary-container text-on-primary-container", "API key ksk_live_9f2a rotated", "Yesterday"],
].map(([icon, cls, text, time]) => ({ icon, cls, text, time }))

const GOALS = (
  [
    ["Reduce p95 latency to 150 ms", "Platform", 72, 0],
    ["Migrate 40 services to Grid 4", "Infrastructure", 55, 1],
    ["Cut cloud spend 20%", "FinOps", 88, 0],
    ["SOC 2 Type II renewal", "Security", 34, 2],
  ] as const
).map(([title, owner, pct, st]) => ({
  title,
  owner,
  pct,
  style: { width: pct + "%" },
  status: ["On track", "At risk", "Behind"][st],
  statusCls: [
    "bg-tertiary-container text-on-tertiary-container",
    "bg-secondary-container text-on-secondary-container",
    "bg-error-container text-on-error-container",
  ][st],
  barCls: ["bg-primary", "bg-secondary", "bg-error"][st],
}))

const INCIDENTS = (
  [
    ["INC-2291", "SEV-1", "Checkout error spike", "checkout-api", "42 min", "Resolved", 0],
    ["INC-2288", "SEV-2", "Webhook delivery delays", "billing-sync", "1 h 18 min", "Monitoring", 1],
    ["INC-2285", "SEV-3", "Elevated DNS latency", "edge-cache", "12 min", "Resolved", 0],
    ["INC-2292", "SEV-2", "Scheduler retry storm", "scheduler", "ongoing", "Investigating", 2],
  ] as const
).map(([id, sev, title, svc, dur, status, st]) => ({
  id,
  sev,
  title,
  svc,
  dur,
  status,
  sevCls:
    sev === "SEV-1"
      ? "bg-error text-on-error"
      : sev === "SEV-2"
        ? "bg-error-container text-on-error-container"
        : "bg-surface-container-highest text-on-surface-variant",
  statusCls: ["text-tertiary", "text-secondary", "text-error"][st],
}))

const COMPARE_ROWS = (
  [
    ["Revenue", "$1.28M", "$1.14M", "+12.4%", 1],
    ["Churn", "1.9%", "2.4%", "−0.5 pt", 1],
    ["Support tickets", "412", "455", "−9.5%", 1],
    ["Cloud spend", "$212k", "$198k", "+7.1%", 0],
  ] as const
).map(([label, now, prev, delta, good]) => ({
  label,
  now,
  prev,
  delta,
  icon: delta.startsWith("+") ? "arrow_upward" : "arrow_downward",
  cls: good ? "bg-tertiary-container text-on-tertiary-container" : "bg-error-container text-on-error-container",
}))

const DETAILS = (
  [
    ["Cluster ID", "cl_8f2a91c4", "font-mono", 1],
    ["Provider", "AWS · eu-central-1", "", 0],
    ["Kubernetes", "1.31.2", "font-mono", 0],
    ["Nodes", "24 across 3 pools", "", 0],
    ["Endpoint", "https://api.prod-01.kestrel.io", "font-mono text-primary", 1],
    ["Created", "Mar 3, 2025", "", 0],
  ] as const
).map(([k, v, cls, copy]) => ({ k, v, cls, copyCls: copy ? "" : "invisible" }))

const REGIONS = (
  [
    ["Frankfurt", "eu-central-1", 41, "99.99%", 0],
    ["Stockholm", "eu-north-1", 38, "99.99%", 0],
    ["N. Virginia", "us-east-1", 96, "99.97%", 0],
    ["Oregon", "us-west-2", 112, "99.95%", 1],
    ["Tokyo", "ap-northeast-1", 58, "99.98%", 0],
    ["Sydney", "ap-southeast-2", 164, "99.81%", 2],
  ] as const
).map(([name, code, lat, up, st]) => ({
  name,
  code,
  lat: lat + " ms",
  up,
  style: { width: Math.max(0, Math.min(100, (lat / 180) * 100)).toFixed(1) + "%" },
  dot: ["bg-tertiary", "bg-secondary", "bg-error"][st],
  barCls: ["bg-primary", "bg-secondary", "bg-error"][st],
}))

const LOG = [
  ["12:04:11", "INFO", "deploy checkout-api v4.2.0 started"],
  ["12:04:19", "INFO", "canary 10% healthy · p95 176ms"],
  ["12:06:02", "WARN", "scheduler retry 3/5 job=export-112"],
  ["12:06:40", "ERROR", "billing-sync 502 upstream timeout"],
  ["12:07:15", "INFO", "canary 40% healthy · p95 181ms"],
  ["12:09:58", "DEBUG", "cache warm 98.2% edge-fra"],
  ["12:10:31", "INFO", "promoted to 100%"],
] as const
const LEVEL_CLS: Record<string, string> = {
  INFO: "text-inverse-primary",
  WARN: "text-secondary-fixed",
  ERROR: "text-error-container",
  DEBUG: "opacity-60",
}

/** Live-tail log with multi-select level filters. */
function LogViewer() {
  const [levels, setLevels] = React.useState<Record<string, boolean>>({ INFO: true, WARN: true, ERROR: true, DEBUG: false })
  return (
    <>
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Log levels">
        {Object.keys(levels).map((lv) => (
          <button
            key={lv}
            type="button"
            aria-pressed={levels[lv]}
            onClick={() => setLevels((l) => ({ ...l, [lv]: !l[lv] }))}
            className={cn(
              "state-layer focus-ring inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 font-mono text-label-sm transition-colors",
              levels[lv]
                ? "border-transparent bg-secondary-container text-on-secondary-container"
                : "border-outline-variant text-on-surface-variant",
            )}
          >
            {lv}
          </button>
        ))}
      </div>
      <pre className="relative max-h-56 overflow-auto rounded-lg bg-inverse-surface p-3 font-mono text-body-sm leading-6 text-inverse-on-surface [scrollbar-width:thin]">
        {LOG.filter(([, lv]) => levels[lv]).map(([t, lv, msg]) => (
          <span key={t} className="block">
            <span className="opacity-60">{t}</span> <span className={LEVEL_CLS[lv]}>{lv.padEnd(5, " ")}</span> {msg}
          </span>
        ))}
      </pre>
    </>
  )
}

const STAT_TABS = [
  [
    "Today",
    "3,812",
    "+4%",
    "requests · 41 deploys · 0 incidents",
    "0.0,20.3 6.7,3.3 13.3,8.7 20.0,2.0 26.7,16.1 33.3,19.4 40.0,12.4 46.7,26.9 53.3,30.0 60.0,16.1 66.7,12.3 73.3,12.5 80.0,12.3 86.7,15.2 93.3,8.0 100.0,13.9",
  ],
  [
    "Week",
    "24,410",
    "+11%",
    "requests · 284 deploys · 1 incident",
    "0.0,16.3 6.7,2.9 13.3,2.8 20.0,12.7 26.7,13.7 33.3,21.3 40.0,22.0 46.7,26.2 53.3,30.0 60.0,12.3 66.7,18.5 73.3,11.3 80.0,9.2 86.7,2.5 93.3,2.0 100.0,12.0",
  ],
  [
    "Month",
    "98,200",
    "+18%",
    "requests · 1,284 deploys · 3 incidents",
    "0.0,4.7 6.7,11.7 13.3,6.3 20.0,3.9 26.7,16.0 33.3,9.4 40.0,30.0 46.7,24.1 53.3,19.9 60.0,21.3 66.7,7.8 73.3,2.0 80.0,3.7 86.7,10.6 93.3,2.0 100.0,7.3",
  ],
] as const

/** Big number with a period switcher. */
function StatTabs() {
  const [tab, setTab] = React.useState(1)
  const [, value, delta, foot, points] = STAT_TABS[tab]
  return (
    <>
      <div className="inline-flex rounded-full bg-surface-container-high p-1" role="tablist" aria-label="Period">
        {STAT_TABS.map(([label], i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={i === tab}
            onClick={() => setTab(i)}
            className={cn(
              "state-layer focus-ring cursor-pointer rounded-full px-4 py-1.5 text-label-lg transition-all duration-300",
              i === tab ? "bg-surface text-on-surface shadow-1" : "text-on-surface-variant",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4" role="tabpanel">
        <div className="flex items-baseline gap-2">
          <span className="text-display-sm font-medium tabular-nums">{value}</span>
          <span className="text-label-md text-tertiary">{delta}</span>
        </div>
        <div className="text-body-sm text-on-surface-variant">{foot}</div>
        <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full">
          <polyline
            points={points}
            fill="none"
            className="stroke-primary"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </>
  )
}

/** "Lists, tables & feeds" section. */
function DataDisplay({ className }: { className?: string }) {
  const board = useBoard()
  const [sort, setSort] = React.useState<Sort>(null)
  const sortedBoard = React.useMemo(() => {
    if (!sort) return board
    const val = (r: (typeof board)[number]) => (sort.key === "svc" ? r.svc : sort.key === "delta" ? r.deltaN : num(r[sort.key]))
    return [...board].sort((a, b) => {
      const x = val(a),
        y = val(b)
      return (typeof x === "string" ? x.localeCompare(y as string) : x - (y as number)) * sort.dir
    })
  }, [board, sort])
  return (
    <section id="data-display" className={className ?? "mt-16 scroll-mt-36"} data-toc>
      <h2 className="text-headline-lg font-semibold">Lists, tables & feeds</h2>
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
        The non-chart pieces that make a dashboard readable: rankings, leaderboards, activity, goals, incidents and key-value details.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <div className="min-w-0 overflow-hidden rounded-xl bg-surface-container-low lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3 p-5 pb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-title-md">Service leaderboard</h3>
              <p className="text-body-sm text-on-surface-variant">Click a header to sort</p>
            </div>
            <button
              className="state-layer inline-flex h-10 items-center gap-2 rounded-full border border-outline-variant px-4 text-label-lg text-on-surface-variant"
              onClick={() => snackbar("Exporting leaderboard as CSV")}
            >
              <Icon size={20}>download</Icon>Export
            </button>
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-body-md">
              <thead className="text-label-md text-on-surface-variant">
                <tr className="border-y border-outline-variant">
                  <th className="px-5 py-1.5 font-medium">
                    <SortButton id="svc" label="Service" sort={sort} onSort={setSort} />
                  </th>
                  <th className="px-5 py-1.5 font-medium">Owner</th>
                  <th className="px-5 py-1.5 font-medium">
                    <SortButton id="req" label="Requests" sort={sort} onSort={setSort} />
                  </th>
                  <th className="px-5 py-1.5 font-medium">Trend</th>
                  <th className="px-5 py-1.5 font-medium">
                    <SortButton id="p95" label="p95" sort={sort} onSort={setSort} />
                  </th>
                  <th className="px-5 py-1.5 font-medium">
                    <SortButton id="delta" label="Change" sort={sort} onSort={setSort} />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {sortedBoard.map((r) => (
                  <React.Fragment key={r.svc}>
                    <tr className="transition-colors hover:bg-on-surface/[.04]">
                      <td className="whitespace-nowrap px-5 py-3 font-medium">{r.svc}</td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-2">
                          <span className={`grid size-7 shrink-0 place-items-center rounded-full text-label-sm ${r.avCls}`}>{r.ini}</span>
                          <span className="whitespace-nowrap text-on-surface-variant">{r.owner}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3 tabular-nums">{r.req}</td>
                      <td className="px-5 py-3">
                        <svg viewBox="0 0 80 24" className="h-6 w-20 overflow-visible">
                          <polyline
                            points={r.pts}
                            fill="none"
                            className={r.lineCls}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></polyline>
                        </svg>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 tabular-nums">{r.p95}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm px-1.5 py-0.5 text-label-md ${r.dCls}`}
                        >
                          <Icon size={16}>{r.dIcon}</Icon>
                          {r.delta}
                        </span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <h3 className="text-title-md">Top customers</h3>
          <p className="text-body-sm text-on-surface-variant">By annual recurring revenue</p>
          <ol className="mt-4 space-y-3">
            {CUSTOMERS.map((t, t_i) => (
              <React.Fragment key={t_i}>
                <li className="flex items-center gap-3">
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full text-label-md ${t.rankCls}`}>{t.rank}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-body-md">{t.name}</span>
                      <span className="text-label-lg tabular-nums">{t.v}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-surface-container-highest">
                      <div className="h-full rounded-full bg-primary" style={t.style}></div>
                    </div>
                  </div>
                </li>
              </React.Fragment>
            ))}
          </ol>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-title-md">Activity</h3>
            <button
              className="state-layer inline-flex h-9 items-center rounded-full px-3 text-label-lg text-primary"
              onClick={() => snackbar("Opening audit log")}
            >
              View all
            </button>
          </div>
          <ol className="relative mt-3 ml-4 border-l-2 border-outline-variant">
            {ACTIVITY.map((a, a_i) => (
              <React.Fragment key={a_i}>
                <li className="relative pb-4 pl-7 last:pb-0">
                  <span
                    className={`absolute -left-[17px] top-0 grid size-8 place-items-center rounded-full ring-4 ring-surface-container-low ${a.cls}`}
                  >
                    <Icon size={18}>{a.icon}</Icon>
                  </span>
                  <p className="text-body-md">{a.text}</p>
                  <p className="text-body-sm text-on-surface-variant">{a.time}</p>
                </li>
              </React.Fragment>
            ))}
          </ol>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <h3 className="text-title-md">Quarter goals</h3>
          <p className="text-body-sm text-on-surface-variant">Q4 2026 · 4 objectives</p>
          <ul className="mt-4 space-y-4">
            {GOALS.map((g, g_i) => (
              <React.Fragment key={g_i}>
                <li>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-body-md">{g.title}</div>
                      <div className="text-body-sm text-on-surface-variant">{g.owner}</div>
                    </div>
                    <span className={`shrink-0 whitespace-nowrap rounded-sm px-2 py-0.5 text-label-sm ${g.statusCls}`}>{g.status}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-surface-container-highest">
                      <div className={`h-full rounded-full ${g.barCls}`} style={g.style}></div>
                    </div>
                    <span className="w-9 text-right text-label-md tabular-nums">{g.pct}%</span>
                  </div>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>{" "}
        <div className="min-w-0 overflow-hidden rounded-xl bg-surface-container-low">
          <div className="p-5 pb-2">
            <h3 className="text-title-md">Recent incidents</h3>
            <p className="text-body-sm text-on-surface-variant">Severity, service and time to resolve</p>
          </div>
          <ul className="divide-y divide-outline-variant">
            {INCIDENTS.map((i, i_i) => (
              <React.Fragment key={i_i}>
                <li className="state-layer flex cursor-pointer items-center gap-3 px-5 py-3" onClick={() => snackbar("Opening {{ i.id }}")}>
                  <span className={`shrink-0 rounded-sm px-2 py-0.5 font-mono text-label-sm ${i.sevCls}`}>{i.sev}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-body-md">{i.title}</div>
                    <div className="truncate text-body-sm text-on-surface-variant">
                      {i.svc} · {i.dur}
                    </div>
                  </div>
                  <span className={`flex shrink-0 items-center gap-1.5 text-label-md ${i.statusCls}`}>
                    <span className="size-2 rounded-full bg-current"></span>
                    {i.status}
                  </span>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <h3 className="text-title-md">Period comparison</h3>
          <p className="text-body-sm text-on-surface-variant">October vs September</p>
          <ul className="mt-4 divide-y divide-outline-variant">
            {COMPARE_ROWS.map((m, m_i) => (
              <React.Fragment key={m_i}>
                <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 py-3">
                  <span className="text-body-md text-on-surface-variant">{m.label}</span>
                  <span
                    className={`row-span-2 inline-flex items-center gap-0.5 whitespace-nowrap rounded-sm px-1.5 py-0.5 text-label-md ${m.cls}`}
                  >
                    <Icon size={16}>{m.icon}</Icon>
                    {m.delta}
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className="text-title-lg tabular-nums">{m.now}</span>
                    <span className="text-body-sm tabular-nums text-on-surface-variant">from {m.prev}</span>
                  </span>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary-container text-on-primary-container">
              <Icon>dns</Icon>
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-mono text-title-md">kestrel-prod-01</h3>
              <p className="text-body-sm text-on-surface-variant">Cluster details</p>
            </div>
            <span className="inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-sm bg-tertiary-container px-2 text-label-md text-on-tertiary-container">
              <span className="size-1.5 rounded-full bg-tertiary"></span>Healthy
            </span>
          </div>
          <dl className="mt-4 divide-y divide-outline-variant text-body-md">
            {DETAILS.map((d, d_i) => (
              <React.Fragment key={d_i}>
                <div className="flex items-center gap-3 py-2.5">
                  <dt className="w-28 shrink-0 text-on-surface-variant">{d.k}</dt>
                  <dd className={`min-w-0 flex-1 truncate ${d.cls}`}>{d.v}</dd>
                  <CopyButton
                    value={d.v}
                    size="xs"
                    aria-label={`Copy ${d.k}`}
                    className={`shrink-0 text-on-surface-variant ${d.copyCls}`}
                    onCopied={() => snackbar(`Copied ${d.k.toLowerCase()}`)}
                  />
                </div>
              </React.Fragment>
            ))}
          </dl>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 lg:col-span-2 xl:col-span-1">
          <h3 className="text-title-md">Region health</h3>
          <p className="text-body-sm text-on-surface-variant">p95 latency and 30-day uptime</p>
          <ul className="mt-4 space-y-3">
            {REGIONS.map((r, r_i) => (
              <React.Fragment key={r_i}>
                <li className="flex items-center gap-3">
                  <span className={`size-2.5 shrink-0 rounded-full ${r.dot}`}></span>
                  <div className="w-28 min-w-0 shrink-0">
                    <div className="truncate text-body-md">{r.name}</div>
                    <div className="truncate font-mono text-label-sm text-on-surface-variant">{r.code}</div>
                  </div>
                  <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className={`h-full rounded-full ${r.barCls}`} style={r.style}></div>
                  </div>
                  <span className="w-14 text-right text-label-md tabular-nums">{r.lat}</span>
                  <span className="hidden w-16 text-right text-label-md tabular-nums text-on-surface-variant sm:inline">{r.up}</span>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>{" "}
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Expandable rows</h3>
              <p className="text-body-sm text-on-surface-variant">Click a row for details</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="overflow-hidden rounded-lg border border-outline-variant">
              <details className="group border-b border-outline-variant last:border-0">
                <summary className="state-layer grid cursor-pointer list-none grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3 text-body-md">
                  <Icon size={20} className="text-on-surface-variant transition-transform duration-300 group-open:rotate-90">
                    chevron_right
                  </Icon>
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-body-sm text-on-surface-variant">INV-0417</span> · Halide Bank
                  </span>
                  <span className="tabular-nums">$48,210</span>
                  <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-tertiary-container text-on-tertiary-container">
                    Paid
                  </span>
                </summary>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 bg-surface-container px-12 py-3 text-body-sm sm:grid-cols-4">
                  <dt className="text-on-surface-variant">Issued</dt>
                  <dd>Oct 1, 2026</dd>
                  <dt className="text-on-surface-variant">Terms</dt>
                  <dd>Net 30</dd>
                  <dt className="text-on-surface-variant">Items</dt>
                  <dd>4 line items</dd>
                  <dt className="text-on-surface-variant">Owner</dt>
                  <dd>Finance ops</dd>
                </dl>
              </details>
              <details className="group border-b border-outline-variant last:border-0">
                <summary className="state-layer grid cursor-pointer list-none grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3 text-body-md">
                  <Icon size={20} className="text-on-surface-variant transition-transform duration-300 group-open:rotate-90">
                    chevron_right
                  </Icon>
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-body-sm text-on-surface-variant">INV-0416</span> · Meridian Health
                  </span>
                  <span className="tabular-nums">$31,900</span>
                  <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-secondary-container text-on-secondary-container">
                    Due Nov 4
                  </span>
                </summary>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 bg-surface-container px-12 py-3 text-body-sm sm:grid-cols-4">
                  <dt className="text-on-surface-variant">Issued</dt>
                  <dd>Oct 1, 2026</dd>
                  <dt className="text-on-surface-variant">Terms</dt>
                  <dd>Net 30</dd>
                  <dt className="text-on-surface-variant">Items</dt>
                  <dd>4 line items</dd>
                  <dt className="text-on-surface-variant">Owner</dt>
                  <dd>Finance ops</dd>
                </dl>
              </details>
              <details className="group border-b border-outline-variant last:border-0">
                <summary className="state-layer grid cursor-pointer list-none grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3 text-body-md">
                  <Icon size={20} className="text-on-surface-variant transition-transform duration-300 group-open:rotate-90">
                    chevron_right
                  </Icon>
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-body-sm text-on-surface-variant">INV-0415</span> · Northwind
                  </span>
                  <span className="tabular-nums">$22,480</span>
                  <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-error-container text-on-error-container">
                    Overdue
                  </span>
                </summary>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 bg-surface-container px-12 py-3 text-body-sm sm:grid-cols-4">
                  <dt className="text-on-surface-variant">Issued</dt>
                  <dd>Oct 1, 2026</dd>
                  <dt className="text-on-surface-variant">Terms</dt>
                  <dd>Net 30</dd>
                  <dt className="text-on-surface-variant">Items</dt>
                  <dd>4 line items</dd>
                  <dt className="text-on-surface-variant">Owner</dt>
                  <dd>Finance ops</dd>
                </dl>
              </details>
              <details className="group border-b border-outline-variant last:border-0">
                <summary className="state-layer grid cursor-pointer list-none grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-3 text-body-md">
                  <Icon size={20} className="text-on-surface-variant transition-transform duration-300 group-open:rotate-90">
                    chevron_right
                  </Icon>
                  <span className="min-w-0 truncate">
                    <span className="font-mono text-body-sm text-on-surface-variant">INV-0414</span> · Quorum Energy
                  </span>
                  <span className="tabular-nums">$18,050</span>
                  <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-tertiary-container text-on-tertiary-container">
                    Paid
                  </span>
                </summary>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1 bg-surface-container px-12 py-3 text-body-sm sm:grid-cols-4">
                  <dt className="text-on-surface-variant">Issued</dt>
                  <dd>Oct 1, 2026</dd>
                  <dt className="text-on-surface-variant">Terms</dt>
                  <dd>Net 30</dd>
                  <dt className="text-on-surface-variant">Items</dt>
                  <dd>4 line items</dd>
                  <dt className="text-on-surface-variant">Owner</dt>
                  <dd>Finance ops</dd>
                </dl>
              </details>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Key metrics</h3>
              <p className="text-body-sm text-on-surface-variant">With icons and deltas</p>
            </div>
          </div>
          <div className="mt-4">
            <ul className="divide-y divide-outline-variant">
              <li className="flex items-center gap-3 py-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary-container text-on-secondary-container">
                  <Icon size={20}>bolt</Icon>
                </span>
                <span className="min-w-0 flex-1 text-body-md">Throughput</span>
                <span className="text-title-sm tabular-nums">1,240 rps</span>
                <span className="w-12 text-right text-label-md text-tertiary">+6%</span>
              </li>
              <li className="flex items-center gap-3 py-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary-container text-on-secondary-container">
                  <Icon size={20}>timer</Icon>
                </span>
                <span className="min-w-0 flex-1 text-body-md">Median build</span>
                <span className="text-title-sm tabular-nums">3m 12s</span>
                <span className="w-12 text-right text-label-md text-tertiary">−18s</span>
              </li>
              <li className="flex items-center gap-3 py-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary-container text-on-secondary-container">
                  <Icon size={20}>bug_report</Icon>
                </span>
                <span className="min-w-0 flex-1 text-body-md">Open bugs</span>
                <span className="text-title-sm tabular-nums">73</span>
                <span className="w-12 text-right text-label-md text-error">+5</span>
              </li>
              <li className="flex items-center gap-3 py-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary-container text-on-secondary-container">
                  <Icon size={20}>savings</Icon>
                </span>
                <span className="min-w-0 flex-1 text-body-md">Savings</span>
                <span className="text-title-sm tabular-nums">$4,120</span>
                <span className="w-12 text-right text-label-md text-tertiary">+12%</span>
              </li>
              <li className="flex items-center gap-3 py-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-md bg-secondary-container text-on-secondary-container">
                  <Icon size={20}>group</Icon>
                </span>
                <span className="min-w-0 flex-1 text-body-md">On-call load</span>
                <span className="text-title-sm tabular-nums">2.1 pages/day</span>
                <span className="w-12 text-right text-label-md text-tertiary">−0.4</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Notifications</h3>
              <p className="text-body-sm text-on-surface-variant">3 unread</p>
            </div>
            <button
              className="state-layer inline-flex h-9 items-center rounded-full px-3 text-label-lg text-primary"
              onClick={() => snackbar("All notifications marked read")}
            >
              Mark all read
            </button>
          </div>
          <div className="mt-4">
            <ul className="-mx-2 space-y-0.5">
              <li
                className="state-layer flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5"
                onClick={() => snackbar("Deploy finished")}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
                  <Icon size={20}>rocket_launch</Icon>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-title-sm">Deploy finished</span>
                    <span className="size-2 shrink-0 rounded-full bg-primary"></span>
                  </div>
                  <div className="truncate text-body-sm text-on-surface-variant">checkout-api v4.2.0 is live</div>
                </div>
                <span className="text-label-sm text-on-surface-variant">2m</span>
              </li>
              <li
                className="state-layer flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5"
                onClick={() => snackbar("Access request")}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
                  <Icon size={20}>person_add</Icon>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-title-sm">Access request</span>
                    <span className="size-2 shrink-0 rounded-full bg-primary"></span>
                  </div>
                  <div className="truncate text-body-sm text-on-surface-variant">Sam wants Admin on Payments</div>
                </div>
                <span className="text-label-sm text-on-surface-variant">14m</span>
              </li>
              <li
                className="state-layer flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5"
                onClick={() => snackbar("Invoice paid")}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-container text-on-primary-container">
                  <Icon size={20}>payments</Icon>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-title-sm">Invoice paid</span>
                    <span className="size-2 shrink-0 rounded-full bg-primary"></span>
                  </div>
                  <div className="truncate text-body-sm text-on-surface-variant">Halide Bank · $48,210</div>
                </div>
                <span className="text-label-sm text-on-surface-variant">1h</span>
              </li>
              <li
                className="state-layer flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5"
                onClick={() => snackbar("Policy updated")}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-container-highest text-on-surface-variant">
                  <Icon size={20}>policy</Icon>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-title-sm">Policy updated</span>
                  </div>
                  <div className="truncate text-body-sm text-on-surface-variant">no-public-buckets v3</div>
                </div>
                <span className="text-label-sm text-on-surface-variant">3h</span>
              </li>
              <li
                className="state-layer flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5"
                onClick={() => snackbar("Node replaced")}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-container-highest text-on-surface-variant">
                  <Icon size={20}>dns</Icon>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-title-sm">Node replaced</span>
                  </div>
                  <div className="truncate text-body-sm text-on-surface-variant">edge-fra-04 auto-healed</div>
                </div>
                <span className="text-label-sm text-on-surface-variant">5h</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Team</h3>
              <p className="text-body-sm text-on-surface-variant">Platform · 6 members</p>
            </div>
          </div>
          <div className="mt-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="relative">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full text-label-md bg-primary-container text-on-primary-container">
                    ML
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-surface-container-low bg-tertiary"></span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">Maya Lindqvist</div>
                  <div className="truncate text-body-sm text-on-surface-variant">Staff engineer</div>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-primary text-on-primary">
                  On call
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="relative">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full text-label-md bg-tertiary-container text-on-tertiary-container">
                    JP
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-surface-container-low bg-tertiary"></span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">Jonah Park</div>
                  <div className="truncate text-body-sm text-on-surface-variant">CTO</div>
                </div>
                <span className="text-label-sm capitalize text-on-surface-variant">online</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="relative">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full text-label-md bg-secondary-container text-on-secondary-container">
                    AR
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-surface-container-low bg-secondary"></span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">Ava Reyes</div>
                  <div className="truncate text-body-sm text-on-surface-variant">Architect</div>
                </div>
                <span className="text-label-sm capitalize text-on-surface-variant">away</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="relative">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full text-label-md bg-primary-fixed-dim text-on-primary-fixed">
                    SO
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-surface-container-low bg-tertiary"></span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">Sam Okafor</div>
                  <div className="truncate text-body-sm text-on-surface-variant">Security</div>
                </div>
                <span className="text-label-sm capitalize text-on-surface-variant">online</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="relative">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full text-label-md bg-primary-container text-on-primary-container">
                    PN
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-surface-container-low bg-outline"></span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">Priya Nair</div>
                  <div className="truncate text-body-sm text-on-surface-variant">VP Platform</div>
                </div>
                <span className="text-label-sm capitalize text-on-surface-variant">offline</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="relative">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full text-label-md bg-tertiary-container text-on-tertiary-container">
                    TW
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-surface-container-low bg-secondary"></span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">Tomás Weber</div>
                  <div className="truncate text-body-sm text-on-surface-variant">VP Engineering</div>
                </div>
                <span className="text-label-sm capitalize text-on-surface-variant">away</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Storage by bucket</h3>
              <p className="text-body-sm text-on-surface-variant">Largest first</p>
            </div>
          </div>
          <div className="mt-4">
            <ul className="space-y-3">
              <li>
                <div className="flex items-center gap-2 text-body-md">
                  <Icon size={20} className="text-primary">
                    folder
                  </Icon>
                  <span className="min-w-0 flex-1 truncate font-mono text-body-sm">logs-prod</span>
                  <span className="tabular-nums">2.4 TB</span>
                </div>
                <div className="mt-1.5 flex">
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-error" style={{ width: "96%" }}></div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 text-body-md">
                  <Icon size={20} className="text-primary">
                    folder
                  </Icon>
                  <span className="min-w-0 flex-1 truncate font-mono text-body-sm">backups</span>
                  <span className="tabular-nums">1.8 TB</span>
                </div>
                <div className="mt-1.5 flex">
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "72%" }}></div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 text-body-md">
                  <Icon size={20} className="text-primary">
                    folder
                  </Icon>
                  <span className="min-w-0 flex-1 truncate font-mono text-body-sm">media-assets</span>
                  <span className="tabular-nums">1.1 TB</span>
                </div>
                <div className="mt-1.5 flex">
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "44%" }}></div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 text-body-md">
                  <Icon size={20} className="text-primary">
                    folder
                  </Icon>
                  <span className="min-w-0 flex-1 truncate font-mono text-body-sm">exports</span>
                  <span className="tabular-nums">0.6 TB</span>
                </div>
                <div className="mt-1.5 flex">
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "24%" }}></div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2 text-body-md">
                  <Icon size={20} className="text-primary">
                    folder
                  </Icon>
                  <span className="min-w-0 flex-1 truncate font-mono text-body-sm">tmp</span>
                  <span className="tabular-nums">0.2 TB</span>
                </div>
                <div className="mt-1.5 flex">
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "8%" }}></div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Releases</h3>
              <p className="text-body-sm text-on-surface-variant">Latest versions</p>
            </div>
          </div>
          <div className="mt-4">
            <ul className="divide-y divide-outline-variant">
              <li className="flex items-center gap-3 py-2.5">
                <span className="rounded-sm bg-surface-container-high px-2 py-0.5 font-mono text-label-md">v4.2.0</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">Policy previews, expanded rail</div>
                  <div className="text-body-sm text-on-surface-variant">Oct 21</div>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-primary text-on-primary">
                  Latest
                </span>
              </li>
              <li className="flex items-center gap-3 py-2.5">
                <span className="rounded-sm bg-surface-container-high px-2 py-0.5 font-mono text-label-md">v4.1.8</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">Scheduler alert noise</div>
                  <div className="text-body-sm text-on-surface-variant">Oct 7</div>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-secondary-container text-on-secondary-container">
                  Patch
                </span>
              </li>
              <li className="flex items-center gap-3 py-2.5">
                <span className="rounded-sm bg-surface-container-high px-2 py-0.5 font-mono text-label-md">v4.1.5</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">CVE scanning at deploy</div>
                  <div className="text-body-sm text-on-surface-variant">Sep 23</div>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-error-container text-on-error-container">
                  Security
                </span>
              </li>
              <li className="flex items-center gap-3 py-2.5">
                <span className="rounded-sm bg-surface-container-high px-2 py-0.5 font-mono text-label-md">v4.1.0</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-body-md">Cost attribution per team</div>
                  <div className="text-body-sm text-on-surface-variant">Sep 2</div>
                </div>
                <span className="inline-flex h-6 shrink-0 items-center whitespace-nowrap rounded-sm px-2 text-label-sm bg-surface-container-highest text-on-surface-variant">
                  Minor
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Top pages</h3>
              <p className="text-body-sm text-on-surface-variant">Views and bounce rate</p>
            </div>
          </div>
          <div className="mt-4">
            <table className="w-full text-left text-body-sm">
              <thead className="text-label-md text-on-surface-variant">
                <tr>
                  <th className="pb-2 font-medium">Page</th>
                  <th className="pb-2 font-medium">Views</th>
                  <th className="pb-2 text-right font-medium">Bounce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr>
                  <td className="py-2 pr-2 font-mono">/pricing</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-12 tabular-nums">48.2k</span>
                      <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                        <div className="h-full rounded-full bg-primary" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-right tabular-nums ">32%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-mono">/docs/quickstart</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-12 tabular-nums">31.4k</span>
                      <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                        <div className="h-full rounded-full bg-primary" style={{ width: "65.1317154117403%" }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-right tabular-nums ">18%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-mono">/</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-12 tabular-nums">29.8k</span>
                      <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                        <div className="h-full rounded-full bg-primary" style={{ width: "61.81290188757519%" }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-right tabular-nums text-error">41%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-mono">/changelog</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-12 tabular-nums">12.1k</span>
                      <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                        <div className="h-full rounded-full bg-primary" style={{ width: "25.09852727649865%" }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-right tabular-nums ">22%</td>
                </tr>
                <tr>
                  <td className="py-2 pr-2 font-mono">/docs/policy</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-12 tabular-nums">9.4k</span>
                      <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                        <div className="h-full rounded-full bg-primary" style={{ width: "19.498029454470025%" }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-right tabular-nums ">15%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Agenda</h3>
              <p className="text-body-sm text-on-surface-variant">Upcoming this week</p>
            </div>
          </div>
          <div className="mt-4">
            <ul className="space-y-2">
              <li
                className="state-layer flex cursor-pointer items-center gap-3 rounded-lg p-2"
                onClick={() => snackbar("Release 4.2 go/no-go")}
              >
                <span className="grid w-12 shrink-0 place-items-center rounded-md py-1 bg-primary text-on-primary">
                  <span className="text-label-sm">MON</span>
                  <span className="text-title-md tabular-nums">26</span>
                </span>
                <div className="min-w-0">
                  <div className="truncate text-body-md">Release 4.2 go/no-go</div>
                  <div className="text-body-sm text-on-surface-variant">10:00 · 30 min</div>
                </div>
              </li>
              <li
                className="state-layer flex cursor-pointer items-center gap-3 rounded-lg p-2"
                onClick={() => snackbar("Quarterly business review")}
              >
                <span className="grid w-12 shrink-0 place-items-center rounded-md py-1 bg-tertiary-container text-on-tertiary-container">
                  <span className="text-label-sm">TUE</span>
                  <span className="text-title-md tabular-nums">27</span>
                </span>
                <div className="min-w-0">
                  <div className="truncate text-body-md">Quarterly business review</div>
                  <div className="text-body-sm text-on-surface-variant">14:00 · 1 h</div>
                </div>
              </li>
              <li
                className="state-layer flex cursor-pointer items-center gap-3 rounded-lg p-2"
                onClick={() => snackbar("Game day: region failover")}
              >
                <span className="grid w-12 shrink-0 place-items-center rounded-md py-1 bg-error-container text-on-error-container">
                  <span className="text-label-sm">THU</span>
                  <span className="text-title-md tabular-nums">29</span>
                </span>
                <div className="min-w-0">
                  <div className="truncate text-body-md">Game day: region failover</div>
                  <div className="text-body-sm text-on-surface-variant">09:00 · 3 h</div>
                </div>
              </li>
              <li className="state-layer flex cursor-pointer items-center gap-3 rounded-lg p-2" onClick={() => snackbar("Release 4.2")}>
                <span className="grid w-12 shrink-0 place-items-center rounded-md py-1 bg-secondary-container text-on-secondary-container">
                  <span className="text-label-sm">FRI</span>
                  <span className="text-title-md tabular-nums">30</span>
                </span>
                <div className="min-w-0">
                  <div className="truncate text-body-md">Release 4.2</div>
                  <div className="text-body-sm text-on-surface-variant">All day</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">SLA timers</h3>
              <p className="text-body-sm text-on-surface-variant">Time left to first response</p>
            </div>
          </div>
          <div className="mt-4">
            <ul className="space-y-3">
              <li>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-body-md">#4821 SSO login loop</span>
                  <span className="shrink-0 text-label-md tabular-nums text-error">12 min</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-label-sm text-on-surface-variant">Enterprise</span>
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-error" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-body-md">#4818 Export stuck</span>
                  <span className="shrink-0 text-label-md tabular-nums text-on-surface-variant">1 h 40 m</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-label-sm text-on-surface-variant">Business</span>
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-secondary" style={{ width: "45%" }}></div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-body-md">#4815 Billing question</span>
                  <span className="shrink-0 text-label-md tabular-nums text-on-surface-variant">5 h 10 m</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-label-sm text-on-surface-variant">Business</span>
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "20%" }}></div>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="min-w-0 truncate text-body-md">#4811 Feature request</span>
                  <span className="shrink-0 text-label-md tabular-nums text-on-surface-variant">2 d</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-label-sm text-on-surface-variant">Starter</span>
                  <div className="h-1.5 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                    <div className="h-full rounded-full bg-primary" style={{ width: "8%" }}></div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Usage vs plan tiers</h3>
              <p className="text-body-sm text-on-surface-variant">1,284 of 1,500 workloads</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative pt-6">
              <div className="relative h-3 rounded-full bg-surface-container-highest">
                <div className="h-full w-[85.6%] rounded-full bg-primary"></div>
                <span
                  className="absolute -top-6 -translate-x-1/2 text-label-sm tabular-nums text-on-surface-variant"
                  style={{ left: "33%" }}
                >
                  500
                </span>
                <span className="absolute inset-y-[-3px] w-0.5 -translate-x-1/2 bg-outline" style={{ left: "33%" }}></span>
                <span
                  className="absolute -top-6 -translate-x-1/2 text-label-sm tabular-nums text-on-surface-variant"
                  style={{ left: "66%" }}
                >
                  1,000
                </span>
                <span className="absolute inset-y-[-3px] w-0.5 -translate-x-1/2 bg-outline" style={{ left: "66%" }}></span>
                <span
                  className="absolute -top-6 -translate-x-1/2 text-label-sm tabular-nums text-on-surface-variant"
                  style={{ left: "100%" }}
                >
                  1,500
                </span>
                <span className="absolute inset-y-[-3px] w-0.5 -translate-x-1/2 bg-outline" style={{ left: "100%" }}></span>
              </div>
              <div className="mt-3 grid grid-cols-3 text-center text-label-md text-on-surface-variant">
                <span>Tier 1 · $29</span>
                <span>Tier 2 · $25</span>
                <span className="text-primary">Tier 3 · $23</span>
              </div>
              <p className="mt-3 text-body-sm text-on-surface-variant">216 more workloads until the next tier.</p>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Plan comparison</h3>
              <p className="text-body-sm text-on-surface-variant">Features × plans</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[360px] text-left text-body-sm">
                <thead className="text-label-md text-on-surface-variant">
                  <tr>
                    <th className="pb-2 font-medium"></th>
                    <th className="pb-2 font-medium">Starter</th>
                    <th className="rounded-t-md bg-primary-container px-2 pb-2 pt-1 font-medium text-on-primary-container">Business</th>
                    <th className="pb-2 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-outline-variant">
                    <td className="py-2  text-on-surface-variant">Workloads</td>
                    <td className="py-2  ">10</td>
                    <td className="py-2 bg-primary-container/40 px-2 ">Unlimited</td>
                    <td className="py-2  ">Unlimited</td>
                  </tr>
                  <tr className="border-t border-outline-variant">
                    <td className="py-2  text-on-surface-variant">Policy previews</td>
                    <td className="py-2  ">
                      <Icon size={18} className="text-on-surface-variant/50">
                        remove
                      </Icon>
                    </td>
                    <td className="py-2 bg-primary-container/40 px-2 ">
                      <Icon size={18} className="text-primary">
                        check
                      </Icon>
                    </td>
                    <td className="py-2  ">
                      <Icon size={18} className="text-primary">
                        check
                      </Icon>
                    </td>
                  </tr>
                  <tr className="border-t border-outline-variant">
                    <td className="py-2  text-on-surface-variant">Auto rollbacks</td>
                    <td className="py-2  ">
                      <Icon size={18} className="text-on-surface-variant/50">
                        remove
                      </Icon>
                    </td>
                    <td className="py-2 bg-primary-container/40 px-2 ">
                      <Icon size={18} className="text-primary">
                        check
                      </Icon>
                    </td>
                    <td className="py-2  ">
                      <Icon size={18} className="text-primary">
                        check
                      </Icon>
                    </td>
                  </tr>
                  <tr className="border-t border-outline-variant">
                    <td className="py-2  text-on-surface-variant">SSO / SCIM</td>
                    <td className="py-2  ">
                      <Icon size={18} className="text-on-surface-variant/50">
                        remove
                      </Icon>
                    </td>
                    <td className="py-2 bg-primary-container/40 px-2 ">
                      <Icon size={18} className="text-primary">
                        check
                      </Icon>
                    </td>
                    <td className="py-2  ">
                      <Icon size={18} className="text-primary">
                        check
                      </Icon>
                    </td>
                  </tr>
                  <tr className="border-t border-outline-variant">
                    <td className="py-2  text-on-surface-variant">Air-gapped</td>
                    <td className="py-2  ">
                      <Icon size={18} className="text-on-surface-variant/50">
                        remove
                      </Icon>
                    </td>
                    <td className="py-2 bg-primary-container/40 px-2 ">
                      <Icon size={18} className="text-on-surface-variant/50">
                        remove
                      </Icon>
                    </td>
                    <td className="py-2  ">
                      <Icon size={18} className="text-primary">
                        check
                      </Icon>
                    </td>
                  </tr>
                  <tr className="border-t border-outline-variant">
                    <td className="py-2  text-on-surface-variant">Support</td>
                    <td className="py-2  ">Community</td>
                    <td className="py-2 bg-primary-container/40 px-2 ">Business hrs</td>
                    <td className="py-2  ">24/7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Log viewer</h3>
              <p className="text-body-sm text-on-surface-variant">checkout-api · live tail</p>
            </div>
          </div>
          <div className="mt-4">
            <LogViewer />
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Alert summary</h3>
              <p className="text-body-sm text-on-surface-variant">Open alerts by severity</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="state-layer flex flex-col items-start gap-2 rounded-lg p-3 text-left bg-error text-on-error"
                onClick={() => snackbar("Filtering critical alerts")}
              >
                <Icon size={20} filled>
                  error
                </Icon>
                <span className="text-headline-sm font-medium tabular-nums">2</span>
                <span className="text-label-md">Critical</span>
              </button>
              <button
                className="state-layer flex flex-col items-start gap-2 rounded-lg p-3 text-left bg-error-container text-on-error-container"
                onClick={() => snackbar("Filtering high alerts")}
              >
                <Icon size={20} filled>
                  warning
                </Icon>
                <span className="text-headline-sm font-medium tabular-nums">7</span>
                <span className="text-label-md">High</span>
              </button>
              <button
                className="state-layer flex flex-col items-start gap-2 rounded-lg p-3 text-left bg-secondary-container text-on-secondary-container"
                onClick={() => snackbar("Filtering medium alerts")}
              >
                <Icon size={20} filled>
                  info
                </Icon>
                <span className="text-headline-sm font-medium tabular-nums">18</span>
                <span className="text-label-md">Medium</span>
              </button>
              <button
                className="state-layer flex flex-col items-start gap-2 rounded-lg p-3 text-left bg-surface-container-highest text-on-surface"
                onClick={() => snackbar("Filtering low alerts")}
              >
                <Icon size={20} filled>
                  notifications
                </Icon>
                <span className="text-headline-sm font-medium tabular-nums">41</span>
                <span className="text-label-md">Low</span>
              </button>
            </div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">System status</h3>
              <p className="text-body-sm text-on-surface-variant">Public status page summary</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-3 rounded-lg bg-tertiary-container p-3 text-on-tertiary-container">
              <Icon filled>check_circle</Icon>
              <span className="text-title-sm">All systems operational</span>
            </div>
            <ul className="mt-3 divide-y divide-outline-variant text-body-md">
              <li className="flex items-center justify-between py-2">
                <span>API</span>
                <span className="flex items-center gap-1.5 text-label-md text-tertiary">
                  <span className="size-2 rounded-full bg-current"></span>Operational
                </span>
              </li>
              <li className="flex items-center justify-between py-2">
                <span>Dashboard</span>
                <span className="flex items-center gap-1.5 text-label-md text-tertiary">
                  <span className="size-2 rounded-full bg-current"></span>Operational
                </span>
              </li>
              <li className="flex items-center justify-between py-2">
                <span>Webhooks</span>
                <span className="flex items-center gap-1.5 text-label-md text-secondary">
                  <span className="size-2 rounded-full bg-current"></span>Degraded
                </span>
              </li>
              <li className="flex items-center justify-between py-2">
                <span>Scheduler</span>
                <span className="flex items-center gap-1.5 text-label-md text-tertiary">
                  <span className="size-2 rounded-full bg-current"></span>Operational
                </span>
              </li>
              <li className="flex items-center justify-between py-2">
                <span>Billing</span>
                <span className="flex items-center gap-1.5 text-label-md text-tertiary">
                  <span className="size-2 rounded-full bg-current"></span>Operational
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Job queue</h3>
              <p className="text-body-sm text-on-surface-variant">4 running · 12 queued</p>
            </div>
          </div>
          <div className="mt-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Shape
                  className="size-6 shrink-0 animate-[spin_3s_linear_infinite] text-primary"
                  shape="cookie7"
                  cycle={["cookie7", "clover4", "sunny"]}
                  interval={700}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-mono text-body-sm">export-112</span>
                    <span className="text-label-md tabular-nums text-on-surface-variant">68%</span>
                  </div>
                  <div className="truncate text-body-sm text-on-surface-variant">CSV export · 2.4M rows</div>
                  <div className="mt-1.5 flex">
                    <div className="h-1 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                      <div className="h-full rounded-full bg-primary" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Shape
                  className="size-6 shrink-0 animate-[spin_3s_linear_infinite] text-primary"
                  shape="cookie7"
                  cycle={["cookie7", "clover4", "sunny"]}
                  interval={700}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-mono text-body-sm">reindex-search</span>
                    <span className="text-label-md tabular-nums text-on-surface-variant">34%</span>
                  </div>
                  <div className="truncate text-body-sm text-on-surface-variant">Rebuilding index</div>
                  <div className="mt-1.5 flex">
                    <div className="h-1 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                      <div className="h-full rounded-full bg-primary" style={{ width: "34%" }}></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Shape
                  className="size-6 shrink-0 animate-[spin_3s_linear_infinite] text-primary"
                  shape="cookie7"
                  cycle={["cookie7", "clover4", "sunny"]}
                  interval={700}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-mono text-body-sm">backup-nightly</span>
                    <span className="text-label-md tabular-nums text-on-surface-variant">91%</span>
                  </div>
                  <div className="truncate text-body-sm text-on-surface-variant">Snapshot · 1.8 TB</div>
                  <div className="mt-1.5 flex">
                    <div className="h-1 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                      <div className="h-full rounded-full bg-primary" style={{ width: "91%" }}></div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Icon className="text-on-surface-variant">schedule</Icon>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate font-mono text-body-sm">cost-rollup</span>
                    <span className="text-label-md tabular-nums text-on-surface-variant">queued</span>
                  </div>
                  <div className="truncate text-body-sm text-on-surface-variant">Waiting for slot</div>
                  <div className="mt-1.5 flex">
                    <div className="h-1 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                      <div className="h-full rounded-full bg-primary" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Traffic by country</h3>
              <p className="text-body-sm text-on-surface-variant">Share of sessions</p>
            </div>
          </div>
          <div className="mt-4">
            <ul className="space-y-2.5">
              <li className="flex items-center gap-3">
                <span className="grid h-6 w-8 shrink-0 place-items-center rounded-xs bg-surface-container-highest font-mono text-label-sm">
                  DE
                </span>
                <span className="w-32 min-w-0 truncate text-body-md">Germany</span>
                <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                  <div className="h-full rounded-full bg-tertiary" style={{ width: "96%" }}></div>
                </div>
                <span className="w-10 text-right text-label-md tabular-nums">24%</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-6 w-8 shrink-0 place-items-center rounded-xs bg-surface-container-highest font-mono text-label-sm">
                  US
                </span>
                <span className="w-32 min-w-0 truncate text-body-md">United States</span>
                <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                  <div className="h-full rounded-full bg-tertiary" style={{ width: "84%" }}></div>
                </div>
                <span className="w-10 text-right text-label-md tabular-nums">21%</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-6 w-8 shrink-0 place-items-center rounded-xs bg-surface-container-highest font-mono text-label-sm">
                  SE
                </span>
                <span className="w-32 min-w-0 truncate text-body-md">Sweden</span>
                <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                  <div className="h-full rounded-full bg-tertiary" style={{ width: "56%" }}></div>
                </div>
                <span className="w-10 text-right text-label-md tabular-nums">14%</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-6 w-8 shrink-0 place-items-center rounded-xs bg-surface-container-highest font-mono text-label-sm">
                  JP
                </span>
                <span className="w-32 min-w-0 truncate text-body-md">Japan</span>
                <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                  <div className="h-full rounded-full bg-tertiary" style={{ width: "44%" }}></div>
                </div>
                <span className="w-10 text-right text-label-md tabular-nums">11%</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-6 w-8 shrink-0 place-items-center rounded-xs bg-surface-container-highest font-mono text-label-sm">
                  GB
                </span>
                <span className="w-32 min-w-0 truncate text-body-md">United Kingdom</span>
                <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                  <div className="h-full rounded-full bg-tertiary" style={{ width: "36%" }}></div>
                </div>
                <span className="w-10 text-right text-label-md tabular-nums">9%</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="grid h-6 w-8 shrink-0 place-items-center rounded-xs bg-surface-container-highest font-mono text-label-sm">
                  BR
                </span>
                <span className="w-32 min-w-0 truncate text-body-md">Brazil</span>
                <div className="h-2 min-w-0 flex-1 rounded-full bg-surface-container-highest">
                  <div className="h-full rounded-full bg-tertiary" style={{ width: "24%" }}></div>
                </div>
                <span className="w-10 text-right text-label-md tabular-nums">6%</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 ">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Stat with tabs</h3>
              <p className="text-body-sm text-on-surface-variant">Switch the period</p>
            </div>
          </div>
          <div className="mt-4">
            <StatTabs />
          </div>
        </div>
        <div className="min-w-0 rounded-xl bg-surface-container-low p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-title-md">Audit trail</h3>
              <p className="text-body-sm text-on-surface-variant">Who changed what</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-body-sm">
                <thead className="text-label-md text-on-surface-variant">
                  <tr>
                    <th className="pb-2 font-medium">Actor</th>
                    <th className="pb-2 font-medium">Action</th>
                    <th className="pb-2 font-medium">Target</th>
                    <th className="pb-2 font-medium">When</th>
                    <th className="pb-2 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <tr>
                    <td className="py-2">
                      <span className="flex items-center gap-2">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full text-label-md bg-primary-container text-on-primary-container">
                          ML
                        </span>
                        <span className="whitespace-nowrap">Maya Lindqvist</span>
                      </span>
                    </td>
                    <td className="py-2 text-on-surface-variant">promoted</td>
                    <td className="py-2 font-mono">checkout-api v4.2.0</td>
                    <td className="whitespace-nowrap py-2 text-on-surface-variant">2m ago</td>
                    <td className="py-2 font-mono text-on-surface-variant">10.4.2.18</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <span className="flex items-center gap-2">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full text-label-md bg-tertiary-container text-on-tertiary-container">
                          SO
                        </span>
                        <span className="whitespace-nowrap">Sam Okafor</span>
                      </span>
                    </td>
                    <td className="py-2 text-on-surface-variant">rotated key</td>
                    <td className="py-2 font-mono">ksk_live_9f2a</td>
                    <td className="whitespace-nowrap py-2 text-on-surface-variant">1h ago</td>
                    <td className="py-2 font-mono text-on-surface-variant">10.4.7.2</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <span className="flex items-center gap-2">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full text-label-md bg-secondary-container text-on-secondary-container">
                          JP
                        </span>
                        <span className="whitespace-nowrap">Jonah Park</span>
                      </span>
                    </td>
                    <td className="py-2 text-on-surface-variant">invited</td>
                    <td className="py-2 font-mono">3 engineers</td>
                    <td className="whitespace-nowrap py-2 text-on-surface-variant">3h ago</td>
                    <td className="py-2 font-mono text-on-surface-variant">10.4.1.90</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <span className="flex items-center gap-2">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full text-label-md bg-primary-fixed-dim text-on-primary-fixed">
                          AR
                        </span>
                        <span className="whitespace-nowrap">Ava Reyes</span>
                      </span>
                    </td>
                    <td className="py-2 text-on-surface-variant">enabled policy</td>
                    <td className="py-2 font-mono">no-public-buckets</td>
                    <td className="whitespace-nowrap py-2 text-on-surface-variant">5h ago</td>
                    <td className="py-2 font-mono text-on-surface-variant">10.4.3.44</td>
                  </tr>
                  <tr>
                    <td className="py-2">
                      <span className="flex items-center gap-2">
                        <span className="grid size-7 place-items-center rounded-full bg-surface-container-highest">
                          <Icon size={16}>smart_toy</Icon>
                        </span>
                        <span className="whitespace-nowrap">system</span>
                      </span>
                    </td>
                    <td className="py-2 text-on-surface-variant">auto-healed</td>
                    <td className="py-2 font-mono">edge-fra-04</td>
                    <td className="whitespace-nowrap py-2 text-on-surface-variant">6h ago</td>
                    <td className="py-2 font-mono text-on-surface-variant">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>{" "}
    </section>
  )
}

export { DataDisplay }
