import Demo from "@/docs/docs-site/examples/divider/demo"
import demoSrc from "@/docs/docs-site/examples/divider/demo?raw"
import Insets from "@/docs/docs-site/examples/divider/insets"
import insetsSrc from "@/docs/docs-site/examples/divider/insets?raw"
import Label from "@/docs/docs-site/examples/divider/label"
import labelSrc from "@/docs/docs-site/examples/divider/label?raw"
import Vertical from "@/docs/docs-site/examples/divider/vertical"
import verticalSrc from "@/docs/docs-site/examples/divider/vertical?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description: "A thin line that groups content in lists and containers. Full-width, inset and middle-inset, vertical, or with a centered label.",
  links: {
    m3: "https://m3.material.io/components/divider/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Separator.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Divider } from "@/components/ui/divider"

<Divider />
<Divider inset="start" />
<Divider orientation="vertical" />`,
  examples: [
    {
      id: "insets",
      title: "Insets",
      description: (
        <>
          <InlineCode>inset="start"</InlineCode> indents 16dp from the leading edge so the line starts under list text;{" "}
          <InlineCode>inset="middle"</InlineCode> indents both sides. Insets use logical margins, so they flip in RTL.
        </>
      ),
      component: Insets,
      source: insetsSrc,
    },
    {
      id: "vertical",
      title: "Vertical",
      description: "orientation=\"vertical\" stretches to the height of its flex row. Middle inset adds 8dp above and below.",
      component: Vertical,
      source: verticalSrc,
    },
    {
      id: "label",
      title: "With a label",
      description: "Children render centered between two lines. Common between alternative sign-in methods.",
      component: Label,
      source: labelSrc,
    },
  ],
  api: [
    {
      name: "Divider",
      description: <>Built on React Aria's {c("Separator")}; accepts its props except {c("orientation")}, which is redefined below.</>,
      props: [
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Line direction. Vertical stretches with self-stretch." },
        {
          name: "inset",
          type: '"none" | "start" | "middle"',
          default: '"none"',
          description: "Horizontal: start indents 16dp at the leading edge, middle 16dp on both sides. Vertical: middle insets 8dp top and bottom.",
        },
        { name: "children", type: "ReactNode", default: "—", description: "A centered label. Horizontal only; renders a role=\"separator\" row." },
        { name: "className", type: "string", default: "—", description: "Merged with the divider classes, e.g. my-2 or mx-1." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Renders {c('role="separator"')} with {c("aria-orientation")} for vertical dividers, so screen readers announce the boundary. Dividers aren't
        focusable. A labelled divider keeps its label text readable.
      </>
    ),
    notes: [
      "Purely decorative lines (for example between toolbar groups) can opt out with aria-hidden.",
      "Don't rely on a divider alone to convey grouping; use headings or list subheaders for structure.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Property", "Value"],
        rows: [
          ["Thickness", "1dp"],
          ["Color", c("outline-variant")],
          ["Inset (start)", "16dp leading"],
          ["Middle inset", "16dp both sides (horizontal), 8dp top and bottom (vertical)"],
          ["Label", <>{c("label-medium")} in on-surface-variant, 12dp gap</>],
        ],
      },
    ],
    source: <>androidx {c("DividerTokens")} (1dp, outline-variant); insets from the M3 divider guidelines.</>,
  },
} satisfies ComponentDoc
