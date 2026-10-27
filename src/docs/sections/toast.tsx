import * as React from "react"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { LinearProgress } from "@/components/ui/progress"
import { ToastCard, ToastRegion, toast } from "@/components/ui/toast"
import { Section, Variant, Variants } from "@/docs/section"

const noop = () => {}

/** Live upload toast body: counts to 100 then closes its toast. */
function UploadProgress({ onDone }: { onDone: () => void }) {
  const [v, setV] = React.useState(8)
  React.useEffect(() => {
    if (v >= 100) {
      const t = setTimeout(onDone, 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setV((x) => Math.min(100, x + 9)), 350)
    return () => clearTimeout(t)
  }, [v, onDone])
  return (
    <div className="mt-2 space-y-1">
      <LinearProgress value={v} aria-label="Upload" />
      <div className="text-body-sm text-on-surface-variant tabular-nums">{v}%</div>
    </div>
  )
}

export default function ToastSection() {
  return (
    <Section
      id="toast"
      description="Richer than a snackbar: an icon on a role color, title and description, stacked from a corner. Use snackbar for single-line confirmations."
    >
      {/* Mounted here for the docs; apps mount <ToastRegion /> once at the root (duplicates are ignored). */}
      <ToastRegion />
      <div className="flex flex-col items-end gap-3">
        <div className="flex w-full flex-wrap gap-2">
          <Button
            onPress={() =>
              toast({ title: "Rollout complete", description: "checkout-api v4.2.0 is live in 3 regions.", icon: "check_circle", tone: "tertiary" })
            }
          >
            Success toast
          </Button>
          <Button
            variant="tonal"
            className="bg-error-container text-on-error-container"
            onPress={() =>
              toast({
                title: "Webhook failed",
                description: "billing.sync returned 502 three times.",
                icon: "error",
                tone: "error",
                actions: [{ label: "Retry now", onAction: () => toast({ title: "Retrying billing.sync…", icon: "sync", tone: "primary" }) }],
              })
            }
          >
            Error toast
          </Button>
          <Button
            variant="tonal"
            onPress={() => toast({ title: "Export ready", description: "2,410 rows · usage-oct.csv", icon: "download", tone: "primary" })}
          >
            Info toast
          </Button>
          <Button
            variant="outlined"
            onPress={() => {
              const key = toast({
                title: "Uploading usage-oct.csv",
                icon: "upload",
                tone: "secondary",
                timeout: 0,
                children: <UploadProgress onDone={() => toast.dismiss(key)} />,
              })
            }}
          >
            Upload toast
          </Button>
        </div>
        <ToastCard
          className="animate-fade-up"
          title="Rollout complete"
          description="checkout-api v4.2.0 is live in 3 regions."
          icon="check_circle"
          tone="tertiary"
          onClose={noop}
        />
        <ToastCard
          className="animate-fade-up [animation-delay:.1s]"
          title="Webhook failed"
          description="billing.sync returned 502 three times."
          icon="error"
          tone="error"
          actions={[{ label: "Retry now", onAction: noop }]}
          onClose={noop}
        />
        <ToastCard
          className="animate-fade-up items-center [animation-delay:.2s]"
          title="Exporting 2,410 rows…"
          media={<LoadingIndicator size={40} contained />}
          closable={false}
        >
          <LinearProgress value={45} aria-label="Export" className="mt-2" />
        </ToastCard>
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3">
        <Variant n={1} label="Message">
          <ToastCard
            className="w-full"
            title="Jonah Park"
            description="Canary looks good, promote?"
            media={
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-container text-label-lg text-on-primary-container">
                JP
              </span>
            }
            onClose={noop}
          />
        </Variant>
        <Variant n={2} label="Upload progress">
          <ToastCard className="w-full" title="usage-oct.csv" icon="upload" tone="secondary" onClose={noop}>
            <div className="mt-2 space-y-1">
              <LinearProgress value={72} aria-label="Upload" />
              <div className="text-body-sm text-on-surface-variant">72% · 9 s left</div>
            </div>
          </ToastCard>
        </Variant>
        <Variant n={3} label="Stacked actions">
          <ToastCard
            className="w-full"
            title="Update available"
            description="Kestrel CLI 4.2.0 is ready."
            actions={[
              { label: "Release notes", onAction: noop },
              { label: "Update", onAction: noop },
            ]}
            onClose={noop}
          />
        </Variant>
        <Variant n={4} label="Compact">
          <div className="flex h-12 w-full items-center gap-3 rounded-full bg-inverse-surface pr-1 pl-4 text-body-md text-inverse-on-surface shadow-3">
            <Icon size={20} className="text-inverse-primary">
              link
            </Icon>
            <span className="flex-1">Link copied</span>
            <IconButton size="xs" aria-label="Dismiss" className="text-inverse-on-surface">
              <Icon>close</Icon>
            </IconButton>
          </div>
        </Variant>
        <Variant n={5} label="Expressive">
          <ToastCard
            className="w-full rounded-2xl bg-tertiary-container text-on-tertiary-container [&_[data-slot=icon]]:text-on-tertiary [&_.text-on-surface-variant]:text-on-tertiary-container"
            title="1,000th deploy!"
            description="Your team shipped 1k times this quarter."
            media={
              <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-tertiary text-on-tertiary">
                <Icon filled>celebration</Icon>
              </span>
            }
            onClose={noop}
          />
        </Variant>
      </Variants>
    </Section>
  )
}
