import * as React from "react"
import { Button as AriaButton } from "react-aria-components"

import { AssistChip } from "@/components/ui/chip"
import {
  Command,
  CommandDialog,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Icon } from "@/components/ui/icon"
import { KbdGroup } from "@/components/ui/kbd"
import { snackbar } from "@/components/ui/snackbar"
import { useTheme } from "@/components/ui/theme-provider"
import { Section, Variant, Variants } from "@/docs/section"

function PaletteItems({ onRun }: { onRun?: () => void }) {
  const run = (label: string) => () => {
    snackbar(label)
    onRun?.()
  }
  return (
    <>
      <CommandGroup title="Actions">
        <CommandItem icon="rocket_launch" shortcut={["⌘", "N"]} onAction={run("New deployment started")}>
          New deployment
        </CommandItem>
        <CommandItem icon="history" onAction={run("Rolling back last deployment…")}>
          Roll back last deployment
        </CommandItem>
        <CommandItem icon="pause_circle" onAction={run("Deploys paused for 1 hour")}>
          Pause deploys for 1 hour
        </CommandItem>
      </CommandGroup>
      <CommandGroup title="Go to">
        <CommandItem icon="dns" meta="Service" textValue="deployments checkout-api" onAction={run("Opening checkout-api")}>
          deployments · checkout-api
        </CommandItem>
        <CommandItem icon="group" meta="People" textValue="Team Platform" onAction={run("Opening Platform team")}>
          Team · Platform Dept.
        </CommandItem>
        <CommandItem icon="article" meta="Runbook" onAction={run("Opening runbook")}>
          Runbook: elevated errors
        </CommandItem>
      </CommandGroup>
    </>
  )
}

function InlineFilterable() {
  const { resolvedMode, setMode } = useTheme()
  return (
    <div className="w-full overflow-hidden rounded-xl bg-surface-container-high">
      <Command className="max-h-96">
        <CommandInput placeholder="Filter actions" autoFocus={false} hint={null} />
        <CommandList emptyState="No matching actions">
          <CommandItem icon="rocket_launch" shortcut={["⌘", "N"]} onAction={() => snackbar("New deployment")}>
            New deployment
          </CommandItem>
          <CommandItem icon="history" onAction={() => snackbar("Rolling back checkout-api")}>
            Roll back checkout-api
          </CommandItem>
          <CommandItem icon="pause_circle" onAction={() => snackbar("Deploys paused")}>
            Pause deploys for 1 hour
          </CommandItem>
          <CommandItem icon="article" onAction={() => snackbar("Opening runbook")}>
            Open runbook: elevated errors
          </CommandItem>
          <CommandItem icon="person_add" shortcut={["⌘", "I"]} onAction={() => snackbar("Invite sent")}>
            Invite teammate
          </CommandItem>
          <CommandItem icon="dark_mode" shortcut={["⌘", "⇧", "L"]} onAction={() => setMode(resolvedMode === "dark" ? "light" : "dark")}>
            Toggle dark theme
          </CommandItem>
        </CommandList>
      </Command>
      <div className="border-t border-outline-variant px-4 py-2 text-body-sm text-on-surface-variant">
        Embedded, non-modal · type to filter, ↑ ↓ to move, Enter to run
      </div>
    </div>
  )
}

function LoadingAndEmpty() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="overflow-hidden rounded-xl bg-surface-container-high">
        <Command defaultInputValue="deploy che">
          <CommandInput autoFocus={false} />
          <CommandList isLoading loadingText="Searching services…" items={[] as { id: string }[]}>
            {() => <CommandItem>never</CommandItem>}
          </CommandList>
        </Command>
      </div>
      <div className="overflow-hidden rounded-xl bg-surface-container-high">
        <Command defaultInputValue="kubectl">
          <CommandInput autoFocus={false} />
          <CommandList
            emptyState={
              <span className="flex flex-col items-center gap-3">
                <Icon size={32}>search_off</Icon>
                No results for “kubectl”
                <span className="flex flex-wrap justify-center gap-2">
                  {["deploy", "rollback", "logs"].map((s) => (
                    <AssistChip key={s} onPress={() => snackbar(`Try “${s}”`)}>
                      {s}
                    </AssistChip>
                  ))}
                </span>
              </span>
            }
          >
            <PaletteItems />
          </CommandList>
        </Command>
      </div>
    </div>
  )
}

export default function CommandSection() {
  const [open, setOpen] = React.useState(false)
  return (
    <Section
      id="command"
      description="A search view in a dialog: grouped results, keyboard hints, and the highlighted row on secondary-container. Press ⌘K (Ctrl+K) anywhere on this page."
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <AriaButton
          onPress={() => setOpen(true)}
          className="state-layer focus-ring flex h-14 w-full cursor-pointer items-center gap-3 rounded-full bg-surface-container-high px-4 text-body-lg text-on-surface-variant"
        >
          <Icon>search</Icon>
          <span className="flex-1 text-left">Open command palette</span>
          <KbdGroup keys={["⌘", "K"]} size="sm" />
        </AriaButton>
        <div className="flex h-[440px] flex-col overflow-hidden rounded-xl bg-surface-container-high shadow-3">
          <Command className="flex-1">
            <CommandInput autoFocus={false} />
            <CommandList>
              <PaletteItems />
            </CommandList>
            <CommandFooter />
          </Command>
        </div>
      </div>
      <CommandDialog isOpen={open} onOpenChange={setOpen}>
        <CommandInput />
        <CommandList>
          <PaletteItems onRun={() => setOpen(false)} />
        </CommandList>
        <CommandFooter />
      </CommandDialog>

      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-title-md">2 variants</div>
          <div className="text-body-sm text-on-surface-variant">Inline · filterable · loading · no results</div>
        </div>
        <Variants cols="md:grid-cols-2">
          <Variant n={1} label="Inline · filterable" className="flex min-h-24 items-start rounded-lg bg-surface p-4">
            <InlineFilterable />
          </Variant>
          <Variant n={2} label="Loading · no results" className="flex min-h-24 items-start rounded-lg bg-surface p-4">
            <LoadingAndEmpty />
          </Variant>
        </Variants>
      </div>
    </Section>
  )
}
