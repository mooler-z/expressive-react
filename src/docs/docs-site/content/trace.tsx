import Demo from "@/docs/docs-site/examples/trace/demo"
import demoSrc from "@/docs/docs-site/examples/trace/demo?raw"
import ErrorExample from "@/docs/docs-site/examples/trace/error"
import errorSrc from "@/docs/docs-site/examples/trace/error?raw"
import Pipeline from "@/docs/docs-site/examples/trace/pipeline"
import pipelineSrc from "@/docs/docs-site/examples/trace/pipeline?raw"
import StatusRows from "@/docs/docs-site/examples/trace/status-rows"
import statusRowsSrc from "@/docs/docs-site/examples/trace/status-rows?raw"
import Waterfall from "@/docs/docs-site/examples/trace/waterfall"
import waterfallSrc from "@/docs/docs-site/examples/trace/waterfall?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const statusType = '"success" | "error" | "running" | "pending" | "skipped"'

export default {
  description:
    "Step timelines for agent runs, pipelines and request traces. Status lives on the rail, durations are mono, tool calls have collapsible input and output, and the running step uses the morphing loading indicator. Also a span waterfall, a horizontal pipeline and compact status rows.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { Trace, TraceStep } from "@/components/ui/trace"

<Trace>
  <TraceStep status="success" title="Plan" duration="1.2 s" />
  <TraceStep status="running" tool title="run_tests" duration="running…" />
  <TraceStep status="pending" title="Open pull request" />
</Trace>`,
  examples: [
    {
      id: "error",
      title: "Errors and skipped steps",
      description: "A failed step turns its duration error-colored. TraceError shows the message and stack lines; follow it with a retry action.",
      component: ErrorExample,
      source: errorSrc,
    },
    {
      id: "waterfall",
      title: "Span waterfall",
      description: (
        <>
          <InlineCode>TraceWaterfall</InlineCode> lays spans on a shared axis; depth indents names 12px per level and picks the bar color. The tick step rounds
          to 1, 2, 2.5 or 5 × 10ⁿ.
        </>
      ),
      component: Waterfall,
      source: waterfallSrc,
    },
    {
      id: "pipeline",
      title: "Pipeline",
      description: "Stages left to right; the connector fills with primary as stages complete.",
      component: Pipeline,
      source: pipelineSrc,
    },
    {
      id: "status-rows",
      title: "Status rows",
      description: "Compact run summaries: status, title, mono facts and one action.",
      component: StatusRows,
      source: statusRowsSrc,
    },
  ],
  api: [
    {
      name: "Trace",
      description: <>The vertical rail, an {c("<ol>")}. Also takes ol attributes.</>,
      props: [{ name: "surface", type: "string", default: '"surface-container-low"', description: "M3 role behind the rail. Markers punch a ring of this color through the line." }],
    },
    {
      name: "TraceStep",
      description: <>One {c("<li>")} on the rail. Children render below it (TraceDetails, TraceError, actions).</>,
      props: [
        { name: "status", type: statusType, default: "—", description: "Marker and color (required)." },
        { name: "title", type: "ReactNode", default: "—", description: "Step name (required). Primary while running." },
        { name: "duration", type: "ReactNode", default: "—", description: "Right-aligned mono duration. Error-colored on failed steps." },
        { name: "tool", type: "boolean", default: "false", description: "Adds a mono \"tool\" tag before the title." },
        { name: "meta", type: "ReactNode", default: "—", description: "Inline secondary text after the title." },
        { name: "description", type: "ReactNode", default: "—", description: "One line under the title." },
      ],
    },
    {
      name: "TraceDetails",
      description: <>Collapsible input/output: a native {c("<details>")} with a mono {c("<pre>")} body.</>,
      props: [{ name: "summary", type: "ReactNode", default: "—", description: "The toggle label (required)." }],
    },
    { name: "TraceError", description: <>Error output on {c("error-container")}, with {c('role="alert"')}.</>, props: [{ name: "children", type: "ReactNode", default: "—", description: "Message first, then stack lines (rendered at 80%)." }] },
    {
      name: "TraceWaterfall",
      description: "Span timeline (role=\"table\").",
      props: [
        { name: "spans", type: "{ name, start, duration, depth?, color? }[]", default: "—", description: "Spans in one time unit. color is an M3 role; default by depth: primary, secondary, primary-fixed-dim, tertiary." },
        { name: "total", type: "number", default: "latest span end", description: "Axis end, rounded up to a whole tick." },
        { name: "ticks", type: "number", default: "4", description: "Approximate number of axis intervals." },
        { name: "unit", type: "string", default: '"ms"', description: "Duration column label." },
      ],
    },
    {
      name: "TracePipeline",
      description: <>Horizontal stages, an {c("<ol>")}.</>,
      props: [{ name: "stages", type: "{ label, status, meta? }[]", default: "—", description: "Stages in order. meta is a mono caption under the label." }],
    },
    {
      name: "TraceStatusRow",
      description: "Compact run summary.",
      props: [
        { name: "status", type: statusType, default: "—", description: "Solid marker (success is primary)." },
        { name: "title", type: "ReactNode", default: "—", description: "Run name." },
        { name: "meta", type: "ReactNode[]", default: "—", description: "Mono facts under the title." },
        { name: "action", type: "ReactNode", default: "—", description: "Trailing button." },
      ],
    },
    {
      name: "TraceStatusIcon",
      description: <>The marker on its own ({c('role="img"')}, labelled with the status).</>,
      props: [
        { name: "status", type: statusType, default: "—", description: "Which marker." },
        { name: "size", type: '"sm" | "md" | "lg"', default: '"sm"', description: "20, 24 or 32dp." },
        { name: "solid", type: "boolean", default: "false", description: "Solid primary for success (pipelines, summary rows)." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The rail is an ordered list, so steps are announced in order with their count. Each status marker is an image labelled "Succeeded", "Failed",
        "Running", "Pending" or "Skipped", so status never relies on color. {c("TraceError")} is an alert, announced when it appears.
      </>
    ),
    keyboard: [{ keys: ["Space", "Enter"], description: "Opens or closes a focused TraceDetails summary." }],
    notes: ["Streaming runs: append steps rather than re-rendering the list so screen readers don't re-read it.", "The waterfall uses table roles; span names are read with their duration."],
  },
  spec: {
    tables: [
      {
        columns: ["Status", "Marker", "Glyph"],
        rows: [
          ["Success", c("tertiary-container"), "check"],
          ["Error", c("error"), "priority_high"],
          ["Running", c("primary-container"), "loading indicator"],
          ["Pending", <>{c("surface")}, 2dp {c("outline-variant")} ring</>, "schedule"],
          ["Skipped", c("surface-container-highest"), "remove"],
        ],
      },
    ],
    cards: [
      { title: "Rail", items: ["2dp outline-variant line", "Markers 20dp with a 4dp ring of the surface color", "Step titles title-small, durations mono body-small"] },
      { title: "Sizes", items: ["Marker sm 20 · md 24 · lg 32dp", "Waterfall bars 16dp tall, 4dp corners"] },
    ],
    source: <>Not an M3 component; built from M3 role, type and shape tokens.</>,
  },
} satisfies ComponentDoc
