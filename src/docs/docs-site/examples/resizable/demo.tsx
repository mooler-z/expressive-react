import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

const pane = "grid h-full place-items-center rounded-lg text-title-sm"

export default function ResizableDemo() {
  return (
    <div className="h-72 w-full max-w-2xl">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="25%" minSize="15%">
          <div className={`${pane} bg-surface-container-high text-on-surface`}>Mailboxes</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="35%" minSize="20%">
          <div className={`${pane} bg-surface-container text-on-surface`}>Inbox</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize="25%">
          <div className={`${pane} bg-primary-container text-on-primary-container`}>Message</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
