"use client"

import * as React from "react"

import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Dialog, DialogHeadline } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Menu, MenuItem, MenuPopover, MenuTrigger } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"
import { cn } from "@/lib/utils"

import { type DashboardKit, useDashboardKit } from "./kit-data"

/*
 * Chart card · the frame every kit chart sits in (kit: rounded-xl surface-container-low, p-5).
 * Title + subtitle, a mono "kind" tag, and an options menu: Expand (dialog), Shuffle data, Download PNG.
 */

/** Per-card UI state handed to interactive charts (e.g. a clicked bar). */
export type KitChartUi = { value: unknown; set: (v: unknown) => void }

export interface KitChartRender {
  config: ChartConfig
  chart: React.ReactElement
  /** Plain SVG/HTML chart: render as-is instead of inside a Recharts container. */
  raw?: boolean
}

export interface KitChartSpec {
  id: string
  title: string
  sub: string
  /** Chart-type tag, e.g. "line · stepped". */
  kind?: string
  /** Grid span classes, e.g. "xl:col-span-2". */
  span?: string
  /** Plot height class. Default h-64. */
  h?: string
  /** Big number overlaid on the plot (doughnut and gauge centers). */
  center?: (k: DashboardKit) => { value: string; sub: string; className: string }
  render: (k: DashboardKit, ui: KitChartUi, expanded: boolean) => KitChartRender
}

/** Renders a spec's chart filling its parent. */
function KitChart({
  spec,
  ui,
  expanded = false,
  className,
  "aria-label": ariaLabel,
}: {
  spec: Pick<KitChartSpec, "id" | "render" | "title">
  ui?: KitChartUi
  expanded?: boolean
  className?: string
  "aria-label"?: string
}) {
  const k = useDashboardKit()
  const fallback = React.useState<unknown>(null)
  const state = ui ?? { value: fallback[0], set: fallback[1] }
  const { config, chart, raw } = spec.render(k, state, expanded)
  if (raw)
    return (
      <div role="img" aria-label={ariaLabel ?? spec.title} className={cn("size-full text-body-sm text-on-surface-variant", className)}>
        {chart}
      </div>
    )
  return (
    <ChartContainer config={config} role="img" aria-label={ariaLabel ?? spec.title} className={cn("aspect-auto size-full", className)}>
      {chart}
    </ChartContainer>
  )
}

function KitChartCard({ spec, className }: { spec: KitChartSpec; className?: string }) {
  const k = useDashboardKit()
  const [value, set] = React.useState<unknown>(null)
  const ui = { value, set }
  const plot = React.useRef<HTMLDivElement>(null)
  const center = spec.center?.(k)
  return (
    <div data-slot="kit-chart-card" className={cn("flex min-w-0 flex-col rounded-xl bg-surface-container-low p-5", spec.span, className)}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-title-md">{spec.title}</h3>
          <p className="text-body-sm text-on-surface-variant">{spec.sub}</p>
        </div>
        {spec.kind && (
          <span className="hidden rounded-sm bg-surface-container-high px-2 py-0.5 font-mono text-label-sm whitespace-nowrap text-on-surface-variant sm:inline">
            {spec.kind}
          </span>
        )}
        <KitChartMenu
          id={spec.id}
          title={spec.title}
          sub={spec.sub}
          plot={plot}
          expandTo={<KitChart spec={spec} ui={ui} expanded />}
          className="-mt-2 -mr-2"
        />
      </div>
      <div ref={plot} className={cn("relative mt-4", spec.h ?? "h-64")}>
        <KitChart spec={spec} ui={ui} />
        {center && (
          <div className={cn("pointer-events-none absolute inset-0 flex flex-col items-center", center.className)}>
            <span className="text-headline-sm font-medium tabular-nums">{center.value}</span>
            <span className="text-body-sm text-on-surface-variant">{center.sub}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/** ⋮ menu with Expand / Shuffle / Download PNG. `plot` is the element holding the chart SVG. */
function KitChartMenu({
  id,
  title,
  sub,
  plot,
  expandTo,
  className,
}: {
  id: string
  title: string
  sub: string
  plot: React.RefObject<HTMLElement | null>
  expandTo: React.ReactNode
  className?: string
}) {
  const k = useDashboardKit()
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <MenuTrigger>
        <IconButton aria-label="Chart options" className={className}>
          <Icon size={20}>more_vert</Icon>
        </IconButton>
        <MenuPopover placement="bottom end">
          <Menu
            onAction={(key) => {
              if (key === "expand") setOpen(true)
              if (key === "shuffle") k.shuffle(id)
              if (key === "download") downloadChart(plot.current, `kestrel-${id}.png`)
            }}
          >
            <MenuItem id="expand" icon="open_in_full">
              Expand
            </MenuItem>
            <MenuItem id="shuffle" icon="shuffle">
              Shuffle data
            </MenuItem>
            <MenuItem id="download" icon="download">
              Download PNG
            </MenuItem>
          </Menu>
        </MenuPopover>
      </MenuTrigger>
      <KitExpandDialog isOpen={open} onOpenChange={setOpen} title={title} sub={`${sub} · ${k.rangeName}`}>
        {expandTo}
      </KitExpandDialog>
    </>
  )
}

/** Large chart dialog (kit: max-w-5xl, h-[min(80vh,640px)]). */
function KitExpandDialog({
  isOpen,
  onOpenChange,
  title,
  sub,
  children,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
  sub: string
  children: React.ReactNode
}) {
  return (
    <Dialog overlayProps={{ isOpen, onOpenChange }} modalClassName="max-w-5xl" className="h-[min(80vh,640px)]" aria-label={title}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <DialogHeadline>{title}</DialogHeadline>
          <p className="text-body-md text-on-surface-variant">{sub}</p>
        </div>
        <IconButton aria-label="Close" slot="close" size="md" width="narrow" className="-mt-2 -mr-2">
          <Icon>close</Icon>
        </IconButton>
      </div>
      <div className="relative mt-4 min-h-0 flex-1">{children}</div>
    </Dialog>
  )
}

const STYLE_PROPS = [
  "fill",
  "stroke",
  "stroke-width",
  "stroke-dasharray",
  "opacity",
  "fill-opacity",
  "stroke-opacity",
  "font-size",
  "font-family",
  "font-weight",
]

/** Rasterise the chart SVG (with resolved theme colors) and download it. */
async function downloadChart(host: HTMLElement | null, filename: string) {
  const svg = host?.querySelector<SVGSVGElement>("svg.recharts-surface")
  if (!svg) return
  const { width, height } = svg.getBoundingClientRect()
  const clone = svg.cloneNode(true) as SVGSVGElement
  const src = svg.querySelectorAll("*")
  clone.querySelectorAll("*").forEach((el, i) => {
    const cs = getComputedStyle(src[i])
    for (const p of STYLE_PROPS) el.setAttribute(p, cs.getPropertyValue(p))
  })
  clone.setAttribute("width", String(width))
  clone.setAttribute("height", String(height))
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  const bg = getComputedStyle(host!).backgroundColor
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }))
  const img = new Image()
  img.src = url
  await img.decode()
  const scale = 2
  const canvas = document.createElement("canvas")
  canvas.width = width * scale
  canvas.height = height * scale
  const ctx = canvas.getContext("2d")!
  const card = host!.closest<HTMLElement>("[data-slot=kit-chart-card]") ?? host!
  ctx.fillStyle = bg !== "rgba(0, 0, 0, 0)" ? bg : getComputedStyle(card).backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  URL.revokeObjectURL(url)
  const a = document.createElement("a")
  a.href = canvas.toDataURL("image/png")
  a.download = filename
  a.click()
  snackbar(`Downloaded ${filename}`)
}

/** Section heading used by every kit section (title · description). */
function KitSectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <h2 className="text-headline-lg font-semibold">{title}</h2>
      {description && <p className="mt-2 max-w-prose text-body-md text-on-surface-variant">{description}</p>}
    </>
  )
}

/** Responsive grid of chart cards (kit: lg 2 cols, xl 3 cols). */
function KitChartGrid({ specs, className }: { specs: KitChartSpec[]; className?: string }) {
  return (
    <div className={cn("mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3", className)}>
      {specs.map((s) => (
        <KitChartCard key={s.id} spec={s} />
      ))}
    </div>
  )
}

export { KitChart, KitChartCard, KitChartGrid, KitChartMenu, KitExpandDialog, KitSectionHeading, downloadChart }
