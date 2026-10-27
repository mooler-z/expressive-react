import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { LinearProgress } from "@/components/ui/progress"
import { Snackbar, SnackbarRegion, snackbar } from "@/components/ui/snackbar"
import { Section, Variant, Variants } from "@/docs/section"

const noop = () => {}

export default function SnackbarSection() {
  return (
    <Section
      id="snackbar"
      description="Inverse surface, 4dp corners, optional inverse-primary action and close icon. Single or two lines. One at a time, queued and announced to screen readers."
      spec="https://m3.material.io/components/snackbar/overview"
    >
      {/* Mounted here for the docs; apps mount <SnackbarRegion /> once at the root (duplicates are ignored). */}
      <SnackbarRegion />
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex w-full flex-wrap gap-2">
          <Button
            onPress={() =>
              snackbar("Photo archived", { action: { label: "Undo", onAction: () => snackbar("Photo restored") } })
            }
          >
            Show snackbar
          </Button>
          <Button
            variant="tonal"
            onPress={() =>
              snackbar("Can't send message. Retry in a moment.", {
                action: { label: "Retry", onAction: () => snackbar("Message sent") },
                closable: true,
              })
            }
          >
            With action
          </Button>
          <Button
            variant="outlined"
            onPress={() => snackbar("Deployment paused. Three services in us-east-1 are still draining connections.", { stacked: true, action: { label: "View status", onAction: noop } })}
          >
            Long message
          </Button>
        </div>
        <Snackbar className="max-w-sm" message="Photo archived" action={{ label: "Undo", onAction: noop }} />
        <Snackbar className="max-w-sm" message="Can't send message. Retry in a moment." action={{ label: "Retry", onAction: noop }} onClose={noop} />
        <Snackbar
          className="max-w-sm"
          stacked
          message="Deployment paused. Three services in us-east-1 are still draining connections."
          action={{ label: "View status", onAction: noop }}
        />
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="Action + close">
          <Snackbar className="w-full" message="Message deleted" action={{ label: "Undo", onAction: noop }} onClose={noop} />
        </Variant>
        <Variant n={2} label="Longer action · stacked">
          <Snackbar
            className="w-full"
            stacked
            message="Connection lost. Changes will sync when you're back online."
            action={{ label: "Work offline", onAction: noop }}
          />
        </Variant>
        <Variant n={3} label="With progress">
          <Snackbar className="w-full" message="Uploading 3 files…" action={{ label: "Cancel", onAction: noop }}>
            <LinearProgress isIndeterminate tone="inverse" aria-label="Uploading" className="mt-2" />
          </Snackbar>
        </Variant>
        <Variant n={4} label="Above navigation bar" className="relative h-56 overflow-hidden rounded-lg bg-surface">
          <div className="absolute inset-x-3 bottom-[92px]">
            <Snackbar message="Archived 4 threads" action={{ label: "Undo", onAction: noop }} />
          </div>
          <nav className="absolute inset-x-0 bottom-0 flex h-20 bg-surface-container">
            {[
              ["inbox", "Inbox", true],
              ["search", "Search", false],
              ["person", "Profile", false],
            ].map(([icon, label, on]) => (
              <div key={label as string} className="flex flex-1 flex-col items-center justify-center gap-1 text-label-md text-on-surface-variant">
                <span className={`grid h-8 w-14 place-items-center rounded-full ${on ? "bg-secondary-container text-on-secondary-container" : ""}`}>
                  <Icon filled={on as boolean}>{icon as string}</Icon>
                </span>
                {label}
              </div>
            ))}
          </nav>
        </Variant>
        <Variant n={5} label="Desktop · bottom-left" className="relative h-56 overflow-hidden rounded-lg bg-surface-container">
          <div className="absolute right-4 bottom-4 left-4">
            <Snackbar message="Report exported" action={{ label: "Open", onAction: noop }} onClose={noop} />
          </div>
        </Variant>
        <Variant n={6} label="Error · live trigger" className="flex min-h-24 flex-col items-start justify-center gap-3 rounded-lg bg-surface p-4">
          <Snackbar className="w-full" message="Couldn't save changes" action={{ label: "Retry", onAction: noop }} />
          <Button
            variant="tonal"
            size="xs"
            onPress={() =>
              snackbar("Couldn't save changes", { action: { label: "Retry", onAction: () => snackbar("Saved") }, closable: true })
            }
          >
            <Icon>play_arrow</Icon>
            Fire it
          </Button>
        </Variant>
      </Variants>
    </Section>
  )
}
