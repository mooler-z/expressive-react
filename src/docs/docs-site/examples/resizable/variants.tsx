import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

const VARIANTS = ["handle", "bar", "line"] as const

export default function ResizableVariants() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      {VARIANTS.map((variant) => (
        <div key={variant} className="h-40 overflow-hidden rounded-lg border border-outline-variant">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel minSize="20%">
              <div className="grid h-full place-items-center bg-surface-container-low font-mono text-label-md">{variant}</div>
            </ResizablePanel>
            <ResizableHandle variant={variant} />
            <ResizablePanel minSize="20%">
              <div className="h-full bg-surface" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ))}
    </div>
  )
}
