import * as React from "react"

import { StatusBadge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import {
  Trace,
  TraceDetails,
  TraceError,
  TracePipeline,
  TraceStatusRow,
  TraceStep,
  TraceWaterfall,
} from "@/components/ui/trace"
import { Section, Variant, Variants } from "@/docs/section"

const SPANS = [
  { name: "POST /v1/answers", start: 0, duration: 420, depth: 0 },
  { name: "auth.verify", start: 8, duration: 34, depth: 1 },
  { name: "cache.get", start: 44, duration: 6, depth: 1 },
  { name: "search.query", start: 52, duration: 188, depth: 1, color: "primary-fixed-dim" },
  { name: "db.select", start: 70, duration: 96, depth: 2, color: "tertiary" },
  { name: "llm.generate", start: 244, duration: 168, depth: 1, color: "primary-fixed-dim" },
]

function RunSummary() {
  const [cancelled, setCancelled] = React.useState(false)
  return (
    <div className="space-y-3 self-start rounded-lg bg-surface p-4 text-body-md">
      <div className="text-title-sm">Run summary</div>
      <dl className="grid grid-cols-2 gap-y-2 text-on-surface-variant">
        <dt>Status</dt>
        <dd className="text-right text-on-surface">
          <StatusBadge size="md" variant={cancelled ? "error" : "primary-container"} aria-live="polite">
            {cancelled ? "Cancelled" : "Running"}
          </StatusBadge>
        </dd>
        <dt>Elapsed</dt>
        <dd className="text-right font-mono text-on-surface">6.4 s</dd>
        <dt>Steps</dt>
        <dd className="text-right font-mono text-on-surface">5 · 1 failed</dd>
        <dt>Tokens</dt>
        <dd className="text-right font-mono text-on-surface">3,812</dd>
        <dt>Cost</dt>
        <dd className="text-right font-mono text-on-surface">$0.014</dd>
      </dl>
      <div className="flex gap-2 pt-2">
        <Button
          variant="outlined"
          className="h-9 flex-1"
          isDisabled={cancelled}
          onPress={() => {
            setCancelled(true)
            snackbar("Run cancelled", { action: { label: "Restart", onAction: () => setCancelled(false) } })
          }}
        >
          Cancel
        </Button>
        <Button variant="tonal" className="h-9 flex-1" onPress={() => snackbar("Share link copied")}>
          Share
        </Button>
      </div>
    </div>
  )
}

function RetryFromHere() {
  const [state, setState] = React.useState<"idle" | "busy" | "done">("idle")
  return (
    <Button
      variant="tonal"
      className="h-9"
      isPending={state === "busy"}
      onPress={() => {
        setState("busy")
        setTimeout(() => setState("done"), 1400)
      }}
    >
      {state === "idle" && <Icon>replay</Icon>}
      {state === "busy" ? "Retrying…" : state === "done" ? "Retried" : "Retry from here"}
    </Button>
  )
}

export default function TraceSection() {
  return (
    <Section
      id="trace"
      description="Step timeline for agent runs, pipelines or request traces: status on the rail, duration in mono, nested tool calls, and the running step using the loading indicator."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Trace>
          <TraceStep status="success" title="Received request" duration="12 ms" description="POST /v1/answers · 2.1 KB · user maya@kestrel.io" />
          <TraceStep status="success" title="Plan" duration="340 ms" description="Decided to search docs, then query the usage table." />
          <TraceStep status="success" tool title="search_docs" duration="1.2 s">
            <TraceDetails summary="3 results · show input/output">
              {`{ "query": "usage-based billing rounding", "top_k": 3 }\n→ billing/overview.md · billing/faq.md · pricing/reserved.md`}
            </TraceDetails>
          </TraceStep>
          <TraceStep status="error" tool title="run_query" meta="retry 2 of 3" duration="4.8 s">
            <TraceError>TimeoutError: warehouse connection exceeded 4000 ms</TraceError>
          </TraceStep>
          <TraceStep status="running" title="Compose answer" duration="running…" description="Streaming 214 tokens so far." />
        </Trace>
        <RunSummary />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-title-md">4 variants</div>
          <div className="text-body-sm text-on-surface-variant">
            Waterfall · spans · pipeline · horizontal · failed step · error detail · status rows · 3 states
          </div>
        </div>
        <Variants cols="md:grid-cols-2">
          <Variant n={1} label="Waterfall · spans" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
            <TraceWaterfall spans={SPANS} />
          </Variant>

          <Variant n={2} label="Pipeline · horizontal" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
            <TracePipeline
              stages={[
                { label: "Build", status: "success", meta: "1m 12s" },
                { label: "Test", status: "success", meta: "3m 40s" },
                { label: "Scan", status: "success", meta: "48s" },
                { label: "Canary", status: "running", meta: "2 of 3" },
                { label: "Promote", status: "pending", meta: "—" },
              ]}
            />
            <div className="w-full rounded-md bg-surface-container-low p-3">
              <div className="flex justify-between text-label-md">
                <span>Canary · eu-1, eu-2 healthy</span>
                <span className="text-on-surface-variant tabular-nums">66%</span>
              </div>
              <div className="mt-2 flex h-1 items-center gap-1">
                <div className="h-full w-2/3 rounded-full bg-primary" />
                <div className="h-full flex-1 rounded-full bg-secondary-container" />
              </div>
            </div>
          </Variant>

          <Variant n={3} label="Failed step · error detail" className="flex min-h-24 flex-col gap-4 rounded-lg bg-surface p-4">
            <Trace surface="surface" className="w-full">
              <TraceStep status="success" title={<span className="text-label-lg">Plan</span>} duration="340 ms" className="pb-5" />
              <TraceStep
                status="error"
                title={
                  <span className="text-label-lg">
                    Call tool · <span className="font-mono">search_docs</span>
                  </span>
                }
                duration="1.0 s · timeout"
              >
                <TraceError className="p-3">
                  <div>TimeoutError: search-eu didn't respond in 1000 ms</div>
                  <div>at search.query (search.ts:88)</div>
                  <div>at tools.run (agent.ts:214)</div>
                </TraceError>
                <div className="mt-3 flex flex-wrap gap-2">
                  <RetryFromHere />
                  <Button
                    variant="text"
                    className="h-9"
                    onPress={async () => {
                      await navigator.clipboard?.writeText("TimeoutError: search-eu didn't respond in 1000 ms").catch(() => {})
                      snackbar("Error copied")
                    }}
                  >
                    Copy error
                  </Button>
                </div>
              </TraceStep>
            </Trace>
          </Variant>

          <Variant n={4} label="Status rows · 3 states" className="flex min-h-24 flex-col gap-2 rounded-lg bg-surface p-4">
            <TraceStatusRow
              status="success"
              title="Run completed"
              meta={["5 steps", "6.4 s", "3,812 tok", "$0.014"]}
              action={
                <IconButton aria-label="Show steps">
                  <Icon>expand_more</Icon>
                </IconButton>
              }
              className="w-full"
            />
            <TraceStatusRow
              status="running"
              title="Running · step 4 of 5"
              meta={["4.1 s", "2,240 tok"]}
              action={
                <Button variant="text" className="h-9" onPress={() => snackbar("Run cancelled")}>
                  Cancel
                </Button>
              }
              className="w-full"
            />
            <TraceStatusRow
              status="error"
              title="Failed at step 3 · search_docs"
              meta={["2.1 s", "1,108 tok"]}
              action={
                <Button variant="text" className="h-9" onPress={() => snackbar("Opening run")}>
                  View
                </Button>
              }
              className="w-full"
            />
          </Variant>
        </Variants>
      </div>
    </Section>
  )
}
