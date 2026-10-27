import Demo from "@/docs/docs-site/examples/snackbar/demo"
import demoSrc from "@/docs/docs-site/examples/snackbar/demo?raw"
import Persistent from "@/docs/docs-site/examples/snackbar/persistent"
import persistentSrc from "@/docs/docs-site/examples/snackbar/persistent?raw"
import Static from "@/docs/docs-site/examples/snackbar/static"
import staticSrc from "@/docs/docs-site/examples/snackbar/static?raw"
import Variants from "@/docs/docs-site/examples/snackbar/variants"
import variantsSrc from "@/docs/docs-site/examples/snackbar/variants?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Snackbars confirm what just happened in one short line at the bottom of the screen, with an optional action. Call snackbar() from anywhere; one shows at a time and the rest queue.",
  links: {
    m3: "https://m3.material.io/components/snackbar/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Toast.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `// Once, near the root of the app
import { SnackbarRegion } from "@/components/ui/snackbar"

<SnackbarRegion />

// Anywhere
import { snackbar } from "@/components/ui/snackbar"

snackbar("Message deleted", { action: { label: "Undo", onAction: restore } })`,
  examples: [
    {
      id: "variants",
      title: "Close icon and two lines",
      description: (
        <>
          <InlineCode>closable</InlineCode> adds the close icon. <InlineCode>stacked</InlineCode> moves the action under the message, for long text or a long action
          label.
        </>
      ),
      component: Variants,
      source: variantsSrc,
    },
    {
      id: "persistent",
      title: "Persistent with content",
      description: (
        <>
          <InlineCode>timeout: 0</InlineCode> keeps it up until you call <InlineCode>snackbar.dismiss(key)</InlineCode>. <InlineCode>children</InlineCode> renders
          under the message, here an inverse-tone progress bar.
        </>
      ),
      component: Persistent,
      source: persistentSrc,
    },
    {
      id: "static",
      title: "Static surface",
      description: (
        <>
          <InlineCode>Snackbar</InlineCode> renders the same surface in place, for empty states and docs. It isn't queued or announced; use{" "}
          <InlineCode>snackbar()</InlineCode> for real feedback.
        </>
      ),
      component: Static,
      source: staticSrc,
    },
  ],
  api: [
    {
      name: "snackbar(message, options?)",
      description: (
        <>
          Queues a snackbar and returns its key. Also {c("snackbar.dismiss(key)")} and {c("snackbar.clear()")}.
        </>
      ),
      props: [
        { name: "message", type: "ReactNode", default: "—", description: "One short line." },
        { name: "action", type: "{ label: string; onAction: () => void }", default: "—", description: "A single text action. Pressing it also dismisses the snackbar." },
        { name: "closable", type: "boolean", default: "false", description: "Show the close icon." },
        { name: "stacked", type: "boolean", default: "false", description: "Put the action under the message." },
        { name: "children", type: "ReactNode", default: "—", description: "Extra content under the message." },
        { name: "timeout", type: "number", default: "4000 · 8000 with an action", description: "Auto-dismiss after ms. 0 keeps it until dismissed." },
        { name: "onClose", type: "() => void", default: "—", description: "Called when it leaves the screen, by timeout, action, close or dismiss." },
      ],
    },
    {
      name: "SnackbarRegion",
      description: "Mount once near the root. Extra mounts are ignored, so it is safe in layouts.",
      props: [
        { name: "position", type: '"bottom-center" | "bottom-start"', default: '"bottom-center"', description: "Bottom-start is the M3 placement on large screens." },
        { name: "offset", type: "number", default: "0", description: "Extra bottom offset in px, e.g. 80 to sit above a navigation bar." },
        { name: "className", type: "string", default: "—", description: "Classes for the region." },
      ],
    },
    {
      name: "Snackbar",
      description: <>Static surface: a {c("div")}. Not queued or announced.</>,
      props: [
        { name: "message", type: "ReactNode", default: "—", description: "The text." },
        { name: "action", type: "{ label: string; onAction: () => void }", default: "—", description: "Text action." },
        { name: "onClose", type: "() => void", default: "—", description: "Renders the close icon when set." },
        { name: "stacked", type: "boolean", default: "false", description: "Action under the message." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The region is a React Aria toast region: a labelled landmark (“Snackbar messages”) whose new snackbars are announced politely by screen readers.
        Focus doesn't move when one appears. For richer, stackable notifications use <TextLink to="/docs/toast">Toast</TextLink>.
      </>
    ),
    keyboard: [{ keys: ["Space", "Enter"], description: "On the focused action or close icon: runs it and dismisses the snackbar." }],
    notes: [
      "The action and close icon are ordinary buttons; mount the region after your app so they come last in the tab order.",
      "Timers pause while the region is hovered or focused, so there's time to reach the action.",
      "Don't put the only path to an important action in a snackbar; it disappears.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Container", "inverse-surface, 4dp corners, elevation 3"],
          ["Height", "48dp single line · 68dp two lines"],
          ["Width", "up to 560dp"],
          ["Text", <>{c("body-medium")}, inverse-on-surface</>],
          ["Action", <>{c("label-large")}, inverse-primary</>],
          ["Close icon", "24dp, inverse-on-surface"],
        ],
      },
    ],
    cards: [
      { title: "Timing", items: ["4s without an action", "8s with an action", "Paused while hovered or focused"] },
      { title: "Placement", items: ["Bottom center on compact widths", "Bottom start on large screens", "Above bottom navigation via offset"] },
    ],
    source: <>androidx {c("SnackbarTokens")}.</>,
  },
} satisfies ComponentDoc
