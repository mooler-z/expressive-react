import Actions from "@/docs/docs-site/examples/toast/actions"
import actionsSrc from "@/docs/docs-site/examples/toast/actions?raw"
import Demo from "@/docs/docs-site/examples/toast/demo"
import demoSrc from "@/docs/docs-site/examples/toast/demo?raw"
import Progress from "@/docs/docs-site/examples/toast/progress"
import progressSrc from "@/docs/docs-site/examples/toast/progress?raw"
import Static from "@/docs/docs-site/examples/toast/static"
import staticSrc from "@/docs/docs-site/examples/toast/static?raw"
import Tones from "@/docs/docs-site/examples/toast/tones"
import tonesSrc from "@/docs/docs-site/examples/toast/tones?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

const content = [
  { name: "title", type: "ReactNode", default: "—", description: "Headline, title-small." },
  { name: "description", type: "ReactNode", default: "—", description: "Supporting text, body-medium on-surface-variant." },
  { name: "icon", type: "string", default: "—", description: "Material Symbols name, filled on the tone's container." },
  { name: "media", type: "ReactNode", default: "—", description: "Replaces the icon, e.g. a LoadingIndicator or an Avatar." },
  { name: "tone", type: '"primary" | "secondary" | "tertiary" | "error" | "neutral"', default: '"primary"', description: "Container role for the icon." },
  { name: "actions", type: "{ label: string; onAction: () => void }[]", default: "—", description: "Text buttons. Pressing one runs it and dismisses the toast." },
  { name: "children", type: "ReactNode", default: "—", description: "Extra content under the description." },
]

export default {
  description:
    "Toasts are richer notifications than a snackbar: an icon on a role-colored container, a title and description, optional actions. Up to four stack in a corner.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/Toast.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `// Once, near the root of the app
import { ToastRegion } from "@/components/ui/toast"

<ToastRegion />

// Anywhere
import { toast } from "@/components/ui/toast"

toast({ title: "Rollout complete", description: "v4.2.0 is live", icon: "check_circle", tone: "tertiary" })`,
  examples: [
    { id: "tones", title: "Tones", description: "The tone colors the icon's container. Press several in a row to see them stack.", component: Tones, source: tonesSrc },
    {
      id: "actions",
      title: "Actions",
      description: "A toast with actions stays until someone acts on it or closes it: it has no timeout by default.",
      component: Actions,
      source: actionsSrc,
    },
    {
      id: "progress",
      title: "Progress, then result",
      description: (
        <>
          <InlineCode>media</InlineCode> swaps the icon for any node. Keep the key that <InlineCode>toast()</InlineCode> returns and dismiss it when the work
          finishes.
        </>
      ),
      component: Progress,
      source: progressSrc,
    },
    {
      id: "static",
      title: "Static card",
      description: (
        <>
          <InlineCode>ToastCard</InlineCode> renders the same surface in place, without the queue or announcements.
        </>
      ),
      component: Static,
      source: staticSrc,
    },
  ],
  api: [
    {
      name: "toast(options)",
      description: <>Queues a toast and returns its key. Also {c("toast.dismiss(key)")} and {c("toast.clear()")}.</>,
      props: [
        ...content,
        { name: "closable", type: "boolean", default: "true", description: "Show the dismiss button." },
        { name: "timeout", type: "number", default: "6000 · none with actions", description: "Auto-dismiss after ms. 0 keeps it until dismissed." },
        { name: "onClose", type: "() => void", default: "—", description: "Called when it leaves the screen." },
      ],
    },
    {
      name: "ToastRegion",
      description: "Mount once near the root. Extra mounts are ignored.",
      props: [
        { name: "position", type: '"bottom-end" | "top-end" | "bottom-start" | "top-start"', default: '"bottom-end"', description: "Corner the stack grows from." },
        { name: "className", type: "string", default: "—", description: "Classes for the region." },
      ],
    },
    {
      name: "ToastCard",
      description: "Static surface with the same content props. Not queued or announced.",
      props: [...content, { name: "onClose", type: "() => void", default: "—", description: "Renders the dismiss button when set." }],
    },
  ],
  accessibility: {
    description: (
      <>
        The region is a React Aria toast region: a landmark named “Notifications” whose new toasts are announced by screen readers without moving focus.
        Each toast is labelled by its title and described by its description. For one-line confirmations use a <TextLink to="/docs/snackbar">Snackbar</TextLink>.
      </>
    ),
    keyboard: [{ keys: ["Space", "Enter"], description: "On a focused action or the dismiss button: runs it and closes the toast." }],
    notes: [
      "Actions and the dismiss button are ordinary buttons; mount the region after your app so they come last in the tab order.",
      "Timers pause while the region is hovered or focused.",
      "Never put the only path to an important decision in a toast.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Container", "surface-container-highest, 12dp corners, elevation 3, max 384dp wide"],
          ["Icon", "40dp circle on the tone's container, filled glyph"],
          ["Title", <>{c("title-small")}, on-surface</>],
          ["Description", <>{c("body-medium")}, on-surface-variant</>],
          ["Actions", <>{c("label-large")} primary text buttons</>],
        ],
      },
    ],
    cards: [
      { title: "Stacking", items: ["Up to 4 visible", "Newer toasts queue behind", "Bottom-end by default"] },
      { title: "Timing", items: ["6s by default", "No timeout with actions", "Paused on hover or focus"] },
    ],
    source: "Not an M3 component: built from M3 roles, type and elevation to sit beside the Snackbar.",
  },
} satisfies ComponentDoc
