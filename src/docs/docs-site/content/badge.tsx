import Demo from "@/docs/docs-site/examples/badge/demo"
import demoSrc from "@/docs/docs-site/examples/badge/demo?raw"
import Live from "@/docs/docs-site/examples/badge/live"
import liveSrc from "@/docs/docs-site/examples/badge/live?raw"
import Standalone from "@/docs/docs-site/examples/badge/standalone"
import standaloneSrc from "@/docs/docs-site/examples/badge/standalone?raw"
import Status from "@/docs/docs-site/examples/badge/status"
import statusSrc from "@/docs/docs-site/examples/badge/status?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description: "Badges flag new or unread content on an icon: a 6dp dot, or a 16dp count. StatusBadge is a small tag for states and metadata.",
  links: { m3: "https://m3.material.io/components/badges/overview" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { BadgeAnchor } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"

<BadgeAnchor count={3} badgeLabel="3 unread messages">
  <Icon name="mail" />
</BadgeAnchor>`,
  examples: [
    {
      id: "standalone",
      title: "Badge on its own",
      description: (
        <>
          No <InlineCode>count</InlineCode> renders the small dot. Numbers above <InlineCode>max</InlineCode> (999 by default) render as{" "}
          <InlineCode>max+</InlineCode>, so <InlineCode>max={"{99}"}</InlineCode> shows 99+. Short strings work too.
        </>
      ),
      component: Standalone,
      source: standaloneSrc,
    },
    {
      id: "live",
      title: "Live count",
      description: (
        <>
          A <InlineCode>count</InlineCode> of 0 hides the badge. Put the count in the button's label too, since that's what screen readers announce.
        </>
      ),
      component: Live,
      source: liveSrc,
    },
    {
      id: "status",
      title: "Status badge",
      description: "Not an M3 component: a tag built from M3 roles for states like New, Beta or Failing. Seven color variants, two shapes, two sizes.",
      component: Status,
      source: statusSrc,
    },
  ],
  api: [
    {
      name: "Badge",
      description: <>A {c("span")}. Accepts any span attribute.</>,
      props: [
        { name: "count", type: "number | string", default: "—", description: "Count or short text. Omit for the 6dp dot." },
        { name: "max", type: "number", default: "999", description: "Numbers above this render as “max+”." },
      ],
    },
    {
      name: "BadgeAnchor",
      description: "Wraps an icon and pins a badge to its top-end corner. The dot sits on the corner; a count starts at the icon's center, 4dp above it.",
      props: [
        { name: "count", type: "number | string", default: "—", description: "Count to show. 0 hides the badge." },
        { name: "dot", type: "boolean", default: "false", description: "Show the dot when there's no count." },
        { name: "max", type: "number", default: "999", description: "Overflow threshold, as on Badge." },
        { name: "badgeLabel", type: "string", default: "—", description: "aria-label for the badge, e.g. “3 unread”." },
        { name: "badgeClassName", type: "string", default: "—", description: "Classes for the badge itself." },
      ],
    },
    {
      name: "StatusBadge",
      description: <>A {c("span")}. Also exported: {c("statusBadgeVariants")}.</>,
      props: [
        {
          name: "variant",
          type: '"primary" | "primary-container" | "secondary" | "tertiary" | "error" | "neutral" | "outlined"',
          default: '"secondary"',
          description: "Role pair.",
        },
        { name: "shape", type: '"rounded" | "pill"', default: '"rounded"', description: "8dp corners or fully round." },
        { name: "size", type: '"sm" | "md"', default: '"sm"', description: "20dp with label-small, or 24dp with label-medium." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        A badge is decoration on its anchor, so the information it carries belongs in the anchor's accessible name: put the count in the{" "}
        <TextLink to="/docs/icon-button">icon button's</TextLink> or nav item's label (“Inbox, 3 unread”). Badges aren't focusable and have no keyboard
        interaction.
      </>
    ),
    notes: [
      "Don't rely on the red dot alone to signal a state; pair it with text somewhere the user can reach.",
      <>Count changes aren't announced. For live updates use a {c("snackbar()")} or an {c("aria-live")} region.</>,
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Badge", "Size", "Shape", "Color", "Label"],
        rows: [
          ["Small", "6dp", "full", "error", "—"],
          ["Large", "16dp tall, min 16dp wide, 4dp padding", "full", "error", <>{c("label-small")} on-error</>],
        ],
      },
    ],
    cards: [
      { title: "Placement", items: ["Dot: on the icon's top-end corner", "Count: starts 2dp past the icon's center, 4dp above it"] },
      { title: "Status badge", items: ["20dp (sm) or 24dp (md) tall", "8dp padding, 8dp corners or full"] },
    ],
    source: <>androidx {c("BadgeTokens")}.</>,
  },
} satisfies ComponentDoc
