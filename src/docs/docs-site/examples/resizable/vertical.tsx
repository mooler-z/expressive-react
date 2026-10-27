import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default function ResizableVertical() {
  return (
    <div className="h-80 w-full max-w-md">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="60%" minSize="25%">
          <div className="grid h-full place-items-center rounded-lg bg-surface-container text-title-sm">Editor</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize="20%">
          <div className="grid h-full place-items-center rounded-lg bg-inverse-surface font-mono text-body-sm text-inverse-on-surface">$ pnpm dev</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
