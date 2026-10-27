import * as React from "react"

import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import {
  BottomSheet,
  BottomSheetTrigger,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SideSheet,
  SideSheetTrigger,
  StandardBottomSheet,
  StandardSideSheet,
} from "@/components/ui/sheet"
import { snackbar } from "@/components/ui/snackbar"
import { TextField } from "@/components/ui/text-field"
import { Section, Variant, Variants } from "@/docs/section"
import { cn } from "@/lib/utils"

const SHARE = [
  ["link", "Copy link", "bg-primary-container text-on-primary-container", "Link copied"],
  ["mail", "Email", "bg-secondary-container text-on-secondary-container", "Shared via Email"],
  ["chat", "Chat", "bg-tertiary-container text-on-tertiary-container", "Shared via Chat"],
  ["more_horiz", "More", "bg-surface-container-highest text-on-surface", "More options"],
] as const

const ACTIONS = [
  ["edit", "Rename"],
  ["content_copy", "Duplicate"],
  ["drive_file_move", "Move to…"],
  ["delete", "Delete"],
] as const

function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("relative h-80 w-full overflow-hidden rounded-lg bg-surface-container", className)}>{children}</div>
}

function Scrim() {
  return <div aria-hidden className="absolute inset-0 bg-scrim/32" />
}

export default function SheetsSection() {
  const [filtersOpen, setFiltersOpen] = React.useState(true)
  return (
    <Section
      id="sheets"
      description="Bottom sheets: 28dp top corners, surface-container-low, 32×4 drag handle; drag down to dismiss. Side sheets: 256–400dp, standard (in the layout) or modal (over a scrim)."
      spec="https://m3.material.io/components/bottom-sheets/overview"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Frame className="grid place-items-center">
          <div className="flex flex-wrap justify-center gap-3">
            <BottomSheetTrigger>
              <Button>
                <Icon>ios_share</Icon>
                Share
              </Button>
              <BottomSheet className="pb-4">
                {({ close }) => (
                  <>
                    <SheetHeader className="min-h-0 pb-2">
                      <SheetTitle>Share deployment</SheetTitle>
                    </SheetHeader>
                    <div className="mt-1 grid grid-cols-4 gap-2 px-4 text-center text-label-md text-on-surface-variant">
                      {SHARE.map(([icon, label, tone, msg]) => (
                        <button
                          key={label}
                          className="state-layer focus-ring cursor-pointer rounded-md py-2"
                          onClick={() => {
                            close()
                            snackbar(msg)
                          }}
                        >
                          <span className={cn("mx-auto grid size-12 place-items-center rounded-full", tone)}>
                            <Icon>{icon}</Icon>
                          </span>
                          <span className="mt-2 block">{label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </BottomSheet>
            </BottomSheetTrigger>

            <SideSheetTrigger>
              <Button variant="tonal">
                <Icon>edit_notifications</Icon>
                Edit alert
              </Button>
              <SideSheet aria-label="Edit alert">
                {({ close }) => (
                  <>
                    <SheetHeader closeButton>
                      <SheetTitle>Edit alert</SheetTitle>
                    </SheetHeader>
                    <SheetContent className="space-y-5 pt-2">
                      <TextField label="Metric" defaultValue="p95 latency" />
                      <TextField label="Threshold" defaultValue="450" suffix="ms" />
                      <SheetDescription>Alerts fire when the threshold is crossed for 5 minutes.</SheetDescription>
                    </SheetContent>
                    <SheetFooter>
                      <Button
                        onPress={() => {
                          close()
                          snackbar("Alert saved")
                        }}
                      >
                        Save
                      </Button>
                      <Button variant="outlined" onPress={close}>
                        Cancel
                      </Button>
                    </SheetFooter>
                  </>
                )}
              </SideSheet>
            </SideSheetTrigger>
          </div>
        </Frame>

        <Frame className="flex bg-surface">
          <div className="min-w-0 flex-1 p-4 text-body-md text-on-surface-variant">
            <div className="flex items-center justify-between gap-2">
              <span>Main pane</span>
              <Button variant="outlined" size="xs" onPress={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen}>
                <Icon>tune</Icon>
                Filters
              </Button>
            </div>
          </div>
          <StandardSideSheet isOpen={filtersOpen} width={272} className="bg-surface-container-low" aria-label="Filters">
            <SheetHeader closeButton onClose={() => setFiltersOpen(false)} className="bg-surface-container-low">
              <h4 className="text-title-lg">Filters</h4>
            </SheetHeader>
            <SheetContent className="space-y-4 bg-surface-container-low">
              <div className="text-title-sm text-on-surface-variant">Status</div>
              <ChipGroup aria-label="Status" defaultSelectedKeys={["active"]} className="flex flex-wrap gap-2">
                <FilterChip id="active">Active</FilterChip>
                <FilterChip id="paused">Paused</FilterChip>
              </ChipGroup>
            </SheetContent>
            <SheetFooter className="bg-surface-container-low px-4">
              <Button
                className="flex-1"
                onPress={() => {
                  setFiltersOpen(false)
                  snackbar("Filters applied")
                }}
              >
                Apply
              </Button>
              <Button variant="outlined" onPress={() => snackbar("Filters reset")}>
                Reset
              </Button>
            </SheetFooter>
          </StandardSideSheet>
        </Frame>
      </div>

      <Variants cols="md:grid-cols-2">
        <Variant n={1} label="Standard · peeking (drag or press the handle)" className="w-full">
          <Frame>
            <div className="absolute inset-0 grid place-items-center pb-20 text-on-surface-variant">
              <Icon size={48}>map</Icon>
            </div>
            <StandardBottomSheet className="absolute" peekHeight={100} aria-label="Nearby nodes">
              <div className="px-6 pb-5">
                <div className="text-title-md">3 nodes nearby</div>
                <div className="text-body-md text-on-surface-variant">Frankfurt · eu-central-1</div>
                <ul className="mt-4 divide-y divide-outline-variant text-body-md">
                  {["fra-edge-01 · 12 ms", "fra-edge-02 · 14 ms", "ams-edge-04 · 21 ms"].map((n) => (
                    <li key={n} className="flex items-center gap-3 py-3">
                      <Icon className="text-primary">dns</Icon>
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </StandardBottomSheet>
          </Frame>
        </Variant>

        <Variant n={2} label="Modal · action list" className="w-full">
          <Frame>
            <Scrim />
            <StandardBottomSheet className="absolute pb-2" defaultExpanded aria-label="Actions">
              <ul className="text-body-lg">
                {ACTIONS.map(([icon, label]) => (
                  <li key={label}>
                    <button
                      className={cn(
                        "state-layer focus-ring flex h-14 w-full cursor-pointer items-center gap-4 px-6",
                        icon === "delete" && "text-error",
                      )}
                      onClick={() => snackbar(label)}
                    >
                      <Icon className={icon === "delete" ? undefined : "text-on-surface-variant"}>{icon}</Icon>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </StandardBottomSheet>
          </Frame>
        </Variant>

        <Variant n={3} label="Side sheet · modal form" className="w-full">
          <Frame>
            <Scrim />
            <aside className="absolute inset-y-0 right-0 flex w-[260px] max-w-[85%] flex-col rounded-l-lg bg-surface-container-low shadow-1">
              <SheetHeader closeButton onClose={() => snackbar("Closed")}>
                <h4 className="text-title-lg">Edit alert</h4>
              </SheetHeader>
              <SheetContent className="space-y-5 pt-2">
                <TextField label="Metric" defaultValue="p95 latency" />
                <TextField label="Threshold" defaultValue="450 ms" />
              </SheetContent>
              <SheetFooter>
                <Button size="sm" onPress={() => snackbar("Alert saved")}>
                  Save
                </Button>
                <Button size="sm" variant="outlined">
                  Cancel
                </Button>
              </SheetFooter>
            </aside>
          </Frame>
        </Variant>

        <Variant n={4} label="Modal · confirm" className="w-full">
          <Frame>
            <Scrim />
            <StandardBottomSheet className="absolute" defaultExpanded aria-label="Leave the call">
              <div className="px-6 pb-5 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-full bg-error-container text-on-error-container">
                  <Icon>call_end</Icon>
                </span>
                <div className="mt-2 text-title-lg">Leave the call?</div>
                <p className="text-body-md text-on-surface-variant">The incident bridge stays open for others.</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outlined" className="flex-1" onPress={() => snackbar("Staying on the call")}>
                    Stay
                  </Button>
                  <Button className="flex-1 bg-error text-on-error" onPress={() => snackbar("You left the call")}>
                    Leave
                  </Button>
                </div>
              </div>
            </StandardBottomSheet>
          </Frame>
        </Variant>
      </Variants>
    </Section>
  )
}
