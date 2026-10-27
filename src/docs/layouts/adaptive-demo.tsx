import * as React from "react"

import { IncidentsApp } from "@/components/blocks/layouts/incidents-app"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Switch } from "@/components/ui/switch"
import type { WindowSizeClass } from "@/hooks/use-window-size-class"

import type { WinOption } from "./layouts-sections"

/*
 * "One app, every window size" — the IncidentsApp block rendered in a frame at each
 * window size class's width, scaled down to fit the stage.
 */

export const WINS = [
  { id: "compact", label: "Compact", icon: "smartphone", w: 412, range: "< 600", start: "0", flex: 6, prefix: "base", nav: "Navigation bar", panes: "1", cols: 4, margin: 16, tone: "bg-primary-container text-on-primary-container" },
  { id: "medium", label: "Medium", icon: "tablet_android", w: 720, range: "600–839", start: "600", flex: 2.4, prefix: "md:", nav: "Navigation rail", panes: "1", cols: 8, margin: 24, tone: "bg-secondary-container text-on-secondary-container" },
  { id: "expanded", label: "Expanded", icon: "laptop", w: 1000, range: "840–1199", start: "840", flex: 3.6, prefix: "lg:", nav: "Navigation rail", panes: "2", cols: 12, margin: 24, tone: "bg-tertiary-container text-on-tertiary-container" },
  { id: "large", label: "Large", icon: "desktop_windows", w: 1360, range: "1200–1599", start: "1200", flex: 4, prefix: "xl:", nav: "Expanded rail", panes: "2", cols: 12, margin: 24, tone: "bg-primary-fixed-dim text-on-primary-fixed" },
  { id: "extra-large", label: "Extra-large", icon: "tv", w: 1680, range: "≥ 1600", start: "1600", flex: 4, prefix: "2xl:", nav: "Expanded rail", panes: "Up to 3", cols: 12, margin: 24, tone: "bg-surface-container-highest text-on-surface" },
] as const satisfies readonly { id: WindowSizeClass; [key: string]: unknown }[]

export function winOptions(win: WindowSizeClass, setWin: (w: WindowSizeClass) => void): WinOption[] {
  return WINS.map((o) => {
    const on = o.id === win
    return {
      ...o,
      rulerCls: on ? "bg-primary text-on-primary" : o.tone,
      cardCls: on ? "bg-secondary-container text-on-secondary-container ring-2 ring-primary" : "bg-surface text-on-surface",
      pick: () => {
        setWin(o.id)
        document.getElementById("adaptive")?.scrollIntoView({ behavior: "smooth" })
      },
    }
  })
}

const FRAME_H = 640

export function AdaptiveDemo({ win, setWin }: { win: WindowSizeClass; setWin: (w: WindowSizeClass) => void }) {
  const w = WINS.find((x) => x.id === win)!
  const [cols, setCols] = React.useState(false)
  const stage = React.useRef<HTMLDivElement>(null)
  const [stageW, setStageW] = React.useState(1000)
  React.useEffect(() => {
    const el = stage.current
    if (!el) return
    const ro = new ResizeObserver(() => setStageW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const scale = Math.min(1, stageW / w.w)
  const single = win === "compact" || win === "medium"
  return (
    <section id="adaptive" className="mt-12 scroll-mt-24" data-toc>
      <h2 className="text-headline-lg font-semibold">Adaptive: one app, every window size</h2>
      <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">
        Pick a window size class. Navigation moves from bar to rail to expanded rail, and list-detail grows from one pane to three. In the
        single-pane sizes, tap an incident to open it.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ConnectedButtonGroup
          aria-label="Window size class"
          size="sm"
          variant="filled"
          className="flex-wrap"
          selectedKeys={[win]}
          onSelectionChange={(keys) => {
            const next = [...keys][0]
            if (next) setWin(next as WindowSizeClass)
          }}
        >
          {WINS.map((o) => (
            <ConnectedButton key={o.id} id={o.id}>
              <Icon size={20}>{o.icon}</Icon>
              {o.label}
            </ConnectedButton>
          ))}
        </ConnectedButtonGroup>
        <Switch isSelected={cols} onChange={setCols} className="text-label-lg text-on-surface-variant">
          Show columns
        </Switch>
      </div>
      <div className="mt-4 rounded-xl bg-surface-container-low p-3 md:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-body-sm text-on-surface-variant">
          <span className="font-mono text-on-surface">{w.w}dp</span>
          <span>{w.range}</span>
          <span>{w.nav}</span>
          <span>{single ? "List, then detail" : win === "extra-large" ? "List + detail + supporting" : "List + detail"}</span>
          <span>
            {w.cols} columns · {w.margin}dp margins
          </span>
          <span className="ml-auto">{scale < 0.999 ? `Shown at ${Math.round(scale * 100)}%` : "Actual size"}</span>
        </div>
        <div
          ref={stage}
          className="relative w-full overflow-hidden transition-[height] duration-(--md-spring-default-spatial-duration) ease-default-spatial"
          style={{ height: Math.round(FRAME_H * scale) }}
        >
          <div
            className="absolute top-0 left-0 flex origin-top-left overflow-hidden rounded-xl border border-outline-variant shadow-2 transition-[width,transform] duration-(--md-spring-default-spatial-duration) ease-default-spatial"
            style={{ width: w.w, height: FRAME_H, transform: `translateX(${Math.max(0, Math.round((stageW - w.w * scale) / 2))}px) scale(${scale})` }}
          >
            <IncidentsApp key={win} windowSize={win} />
            {cols && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 z-30 grid"
                style={{ left: w.margin, right: w.margin, columnGap: w.margin, gridTemplateColumns: `repeat(${w.cols}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: w.cols }, (_, i) => (
                  <div key={i} className="h-full bg-primary/10 ring-1 ring-primary/25 ring-inset" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
