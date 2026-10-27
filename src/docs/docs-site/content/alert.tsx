import Demo from "@/docs/docs-site/examples/alert/demo"
import demoSrc from "@/docs/docs-site/examples/alert/demo?raw"
import TitleActions from "@/docs/docs-site/examples/alert/title-actions"
import titleActionsSrc from "@/docs/docs-site/examples/alert/title-actions?raw"
import Variants from "@/docs/docs-site/examples/alert/variants"
import variantsSrc from "@/docs/docs-site/examples/alert/variants?raw"
import Dismissible from "@/docs/docs-site/examples/alert/dismissible"
import dismissibleSrc from "@/docs/docs-site/examples/alert/dismissible?raw"
import Banner from "@/docs/docs-site/examples/alert/banner"
import bannerSrc from "@/docs/docs-site/examples/alert/banner?raw"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Alert & banner",
  description:
    "Alerts are inline messages on a container role with a tone icon, optional title, actions and a dismiss button. Banner is the M3 banner: full content width under the app bar, an icon on a container and right-aligned text actions.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { Alert } from "@/components/ui/alert"

<Alert tone="warning" title="Key expiring" onDismiss={() => hide()}>
  Your API key expires in 3 days.
</Alert>`,
  examples: [
    {
      id: "title-actions",
      title: "Title & actions",
      description: "A title moves the icon to the top. Actions sit at the end and wrap under the text when space runs out.",
      component: TitleActions,
      source: titleActionsSrc,
    },
    {
      id: "variants",
      title: "Variants",
      description: <>tonal fills the role container, outlined draws a 1dp role border on the surface, inverse is a pill on inverse-surface. {c("icon={null}")} hides the glyph.</>,
      component: Variants,
      source: variantsSrc,
    },
    { id: "dismissible", title: "Dismissible", description: "onDismiss adds a close icon button; you decide what happens to the alert.", component: Dismissible, source: dismissibleSrc },
    { id: "banner", title: "Banner", description: "A banner sits under the top app bar and ends with a divider. Keep it to one message and two actions.", component: Banner, source: bannerSrc },
  ],
  api: [
    {
      name: "Alert",
      description: <>Renders a {c("<div>")}; other HTML attributes pass through. Also exported: {c("alertVariants")}.</>,
      props: [
        { name: "tone", type: '"info" | "success" | "warning" | "error"', default: '"info"', description: "Color role and default icon." },
        { name: "variant", type: '"tonal" | "outlined" | "inverse"', default: '"tonal"', description: "Filled container, role border, or inverse pill." },
        { name: "title", type: "ReactNode", default: "—", description: "Bold first line. Children become the description." },
        { name: "icon", type: "string | null", default: "per tone", description: "Material Symbol; null hides it." },
        { name: "actions", type: "ReactNode", default: "—", description: "Text buttons at the end of the content." },
        { name: "onDismiss", type: "() => void", default: "—", description: "Adds a close button that calls this." },
        { name: "role", type: "string", default: '"alert" for error, else "status"', description: "Live region role." },
      ],
    },
    {
      name: "Banner",
      description: <>Renders a {c("<div role=\"status\">")}.</>,
      props: [
        { name: "icon", type: "string", default: "—", description: "Material Symbol on a 40dp primary-container circle." },
        { name: "actions", type: "ReactNode", default: "—", description: "End-aligned text buttons." },
        { name: "children", type: "ReactNode", default: "—", description: "The message, one or two lines." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Alerts are live regions: error tone uses {c('role="alert"')} and is announced immediately; the other tones use {c('role="status"')} and wait for a
        pause. Override with {c("role")} for alerts that are present on page load and shouldn't be announced.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through the actions, then the dismiss button." },
      { keys: ["Space", "Enter"], description: "Activates the focused action or dismisses." },
    ],
    notes: [
      "The dismiss button is labelled \"Dismiss\".",
      "Tone is shown by color and icon; put the essential information in the text too.",
      "For a transient confirmation after an action, use a snackbar instead.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Tone", "Tonal container", "Outlined border", "Inverse icon"],
        rows: [
          ["Info", "surface-container-high · primary icon", "outline-variant", "inverse-primary"],
          ["Success", "tertiary-container", "tertiary", "tertiary-fixed-dim"],
          ["Warning", "secondary-container", "secondary", "secondary-fixed-dim"],
          ["Error", "error-container", "error", "error-container"],
        ],
      },
    ],
    cards: [
      { title: "Alert", items: ["12dp corners · 16 × 12dp padding", <>Title {c("title-small")}, text {c("body-medium")}</>, "Inverse: 48dp min height, 24dp corners"] },
      { title: "Banner", items: ["Full width · surface", "40dp primary-container icon circle", "Text actions end-aligned · outline-variant divider"] },
    ],
    source: "Built from M3 container roles and the M3 banner anatomy. M3 has no standalone alert component.",
  },
} satisfies ComponentDoc
