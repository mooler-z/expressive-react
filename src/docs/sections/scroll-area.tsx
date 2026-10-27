import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Section, Variant, Variants } from "@/docs/section"
import { cn } from "@/lib/utils"

const TAGS = ["api-gateway", "auth", "billing", "checkout", "edge-cache", "identity", "ingest", "ledger", "notifications", "scheduler", "search", "telemetry"]
const REGIONS = ["eu-1", "eu-2", "us-1", "us-2", "ap-1", "ap-2"]
const SERVICES = ["checkout-api", "auth", "ledger", "search", "ingest", "scheduler", "edge-cache", "billing"]
const p95 = (r: number, c: number) => 80 + ((r * 37 + c * 53) % 175)

const PHOTOS = [
  ["landscape", "bg-primary-container text-on-primary-container"],
  ["cabin", "bg-secondary-container text-on-secondary-container"],
  ["forest", "bg-tertiary-container text-on-tertiary-container"],
  ["water", "bg-surface-container-highest text-on-surface-variant"],
  ["park", "bg-primary-fixed-dim text-on-primary-fixed"],
] as const

export default function ScrollAreaSection() {
  return (
    <Section
      id="scroll-area"
      description="Thin themed scrollbars on native scrolling, edge fades that only appear where there's more content, and split panes with the M3 drag handle — it widens into a 12×52 grip while you drag. Focus a handle and use the arrow keys to resize."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <ScrollArea className="h-64 rounded-lg bg-surface" viewportClassName="p-2" fade={24} aria-label="Tags">
          <div className="px-3 py-2 text-title-sm text-on-surface-variant">Tags</div>
          <ul className="text-body-md">
            {TAGS.map((t) => (
              <li key={t} className="state-layer rounded-full px-3 py-2">
                {t}
              </li>
            ))}
          </ul>
        </ScrollArea>

        <div className="h-64 overflow-hidden rounded-lg bg-surface">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="38%" minSize="20%" className="p-4 text-body-md text-on-surface-variant">
              <div className="text-title-sm text-on-surface">Explorer</div>
              <p className="mt-2">Drag the handles to resize.</p>
            </ResizablePanel>
            <ResizableHandle className="bg-surface-container-low" />
            <ResizablePanel minSize="30%">
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel minSize="25%" className="p-4 text-body-md text-on-surface-variant">
                  <div className="text-title-sm text-on-surface">Editor</div>
                </ResizablePanel>
                <ResizableHandle className="bg-surface-container-low" />
                <ResizablePanel defaultSize="80px" minSize="48px" className="p-4 font-mono text-body-sm text-on-surface-variant">
                  › terminal
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Horizontal · fade & buttons" className="flex min-h-24 w-full flex-col gap-4 rounded-lg bg-surface p-4">
          <ScrollArea orientation="horizontal" fade scrollButtons hideScrollbar className="w-full" viewportClassName="scroll-smooth px-9 py-1">
            <ChipGroup selectionMode="single" defaultSelectedKeys={["All"]} disallowEmptySelection aria-label="Service" className="flex w-max gap-2">
              {["All", ...TAGS].map((t) => (
                <FilterChip key={t} id={t}>
                  {t}
                </FilterChip>
              ))}
            </ChipGroup>
          </ScrollArea>
        </Variant>

        <Variant n={2} label="Both axes · sticky column" className="flex min-h-24 w-full flex-col gap-4 rounded-lg bg-surface p-4">
          <ScrollArea orientation="both" className="h-56 w-full rounded-md border border-outline-variant" aria-label="Latency by region">
            <table className="min-w-[560px] border-separate border-spacing-0 text-body-sm tabular-nums">
              <thead>
                <tr>
                  <th className="sticky top-0 left-0 z-20 border-r border-b border-outline-variant bg-surface-container px-3 py-2 text-left text-label-md">
                    p95 ms
                  </th>
                  {REGIONS.map((r) => (
                    <th key={r} className="sticky top-0 z-10 border-b border-outline-variant bg-surface-container px-3 py-2 text-right font-mono text-label-md">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s, ri) => (
                  <tr key={s}>
                    <td className="sticky left-0 z-10 border-r border-outline-variant bg-surface px-3 py-2 font-medium">{s}</td>
                    {REGIONS.map((r, ci) => {
                      const v = p95(ri, ci)
                      return (
                        <td key={r} className={cn("px-3 py-2 text-right", v > 230 && "text-error")}>
                          {v}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </Variant>

        <Variant n={3} label="Vertical split · resizable" className="flex min-h-24 w-full flex-col gap-4 rounded-lg bg-surface p-4">
          <div className="h-64 w-full overflow-hidden rounded-md border border-outline-variant">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="104px" minSize="56px" className="bg-surface-container-lowest p-3 font-mono text-body-sm">
                <div className="font-sans text-label-md text-on-surface-variant">Query</div>
                <div className="mt-1">
                  <span className="text-primary">SELECT</span> service, p95
                </div>
                <div>
                  <span className="text-primary">FROM</span> latency <span className="text-primary">WHERE</span> region = 'eu-1'
                </div>
                <div>
                  <span className="text-primary">ORDER BY</span> p95 <span className="text-primary">DESC</span>
                </div>
              </ResizablePanel>
              <ResizableHandle variant="bar" />
              <ResizablePanel minSize="25%">
                <ScrollArea className="h-full" aria-label="Results">
                  <div className="sticky top-0 bg-surface px-3 py-2 text-label-md text-on-surface-variant">Results · 8 rows · 42 ms</div>
                  {SERVICES.map((s, i) => (
                    <div key={s} className="flex justify-between border-t border-outline-variant px-3 py-1.5 text-body-sm tabular-nums">
                      <span>{s}</span>
                      <span>{248 - i * 21}</span>
                    </div>
                  ))}
                </ScrollArea>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </Variant>

        <Variant n={4} label="Snap points · drag with the mouse or swipe" className="flex min-h-24 w-full flex-col gap-4 rounded-lg bg-surface p-4">
          <ScrollArea orientation="horizontal" dragScroll hideScrollbar className="w-full" viewportClassName="flex snap-x snap-mandatory gap-3 scroll-px-1 px-1 pb-1">
            {PHOTOS.map(([icon, tone], i) => (
              <div key={icon} className={cn("relative grid aspect-[4/3] w-[72%] shrink-0 snap-start place-items-center rounded-lg", tone)}>
                <Icon size={32}>{icon}</Icon>
                <span className="absolute bottom-2 left-2 rounded-xs bg-surface/80 px-2 py-0.5 font-mono text-label-sm text-on-surface">
                  {i + 1} / {PHOTOS.length}
                </span>
              </div>
            ))}
          </ScrollArea>
          <p className="text-body-sm text-on-surface-variant">snap-x · snap-start · the drag settles on the nearest snap point</p>
        </Variant>
      </Variants>
    </Section>
  )
}
