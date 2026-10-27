import * as React from "react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Icon } from "@/components/ui/icon"
import { Shape } from "@/components/ui/shape"
import { Section, Variant, Variants } from "@/docs/section"

function PendingButton({ idle, busy, done, ...props }: { idle: React.ReactNode; busy: string; done: string } & React.ComponentProps<typeof Button>) {
  const [state, setState] = React.useState<"idle" | "busy" | "done">("idle")
  return (
    <Button
      {...props}
      isPending={state === "busy"}
      onPress={() => {
        setState("busy")
        setTimeout(() => setState("done"), 1400)
      }}
    >
      {state === "idle" ? idle : state === "busy" ? busy : done}
    </Button>
  )
}

const tile = "flex min-h-[240px] flex-col items-center justify-center rounded-lg p-6 text-center"

export default function EmptySection() {
  return (
    <Section id="empty" description="An expressive shape carries the icon; headline-small, one sentence, one primary action and an optional secondary one.">
      <div className="grid gap-6 md:grid-cols-2">
        <EmptyState
          icon="inbox"
          title="No incidents. Nice."
          description="When something breaks, it shows up here with its timeline and owners."
          actions={
            <>
              <Button>
                <Icon>add</Icon>
                Create test incident
              </Button>
              <Button variant="text">Learn more</Button>
            </>
          }
        />
        <EmptyState
          variant="dashed"
          shape={false}
          icon="search_off"
          className="[&_h4]:text-title-lg"
          title="No results for “checkout-v3”"
          description="Try a different name, or clear the Production filter."
          actions={<Button variant="outlined">Clear filters</Button>}
        />
      </div>

      <Variants cols="md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <Variant n={1} label="No data" className="contents">
          <EmptyState
            size="sm"
            className={tile}
            media={
              <div className="flex h-16 w-full max-w-[180px] items-end gap-1.5 border-b-2 border-dashed border-outline-variant pb-1">
                {[30, 55, 40, 70, 50].map((h, i) => (
                  <div key={i} className="w-full rounded-t-xs border-2 border-dashed border-outline-variant" style={{ height: `${h}%` }} />
                ))}
              </div>
            }
            title="No data yet"
            description="Metrics appear after the first deploy."
          />
        </Variant>
        <Variant n={2} label="First run" className="contents">
          <EmptyState size="sm" className={tile} icon="hub" title="Connect your first cluster" actions={<Button>Connect</Button>} />
        </Variant>
        <Variant n={3} label="Error" className="contents">
          <EmptyState
            size="sm"
            className={tile}
            media={
              <span className="grid size-14 place-items-center rounded-full bg-error-container text-on-error-container">
                <Icon size={28}>cloud_off</Icon>
              </span>
            }
            title="Couldn't load incidents"
            description="The status API timed out."
            actions={<PendingButton variant="outlined" idle={<><Icon>refresh</Icon>Retry</>} busy="Retrying…" done="Loaded" />}
          />
        </Variant>
        <Variant n={4} label="Permission" className="contents">
          <EmptyState
            size="sm"
            className={tile}
            media={
              <span className="relative grid size-14 place-items-center text-surface-container-highest">
                <Shape shape="squircle" className="absolute inset-0 size-full" />
                <Icon size={28} className="relative text-on-surface-variant">lock</Icon>
              </span>
            }
            title="You need Admin access"
            description="Ask a workspace owner to grant it."
            actions={<PendingButton variant="tonal" idle="Request access" busy="Requesting…" done="Requested" />}
          />
        </Variant>
        <Variant n={5} label="Search suggestions" className="contents">
          <EmptyState
            size="sm"
            variant="dashed"
            shape={false}
            icon="search_off"
            className={tile + " [--icon-size:40px]"}
            title="No results for “chekout”"
            description="Did you mean:"
            actions={["checkout", "checkout-api", "check-in"].map((s) => (
              <Button key={s} variant="outlined" size="xs" shape="square" className="rounded-sm">
                {s}
              </Button>
            ))}
          />
        </Variant>
      </Variants>
    </Section>
  )
}
