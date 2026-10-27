import Back from "@/docs/docs-site/examples/breadcrumb/back"
import backSrc from "@/docs/docs-site/examples/breadcrumb/back?raw"
import Collapsed from "@/docs/docs-site/examples/breadcrumb/collapsed"
import collapsedSrc from "@/docs/docs-site/examples/breadcrumb/collapsed?raw"
import Current from "@/docs/docs-site/examples/breadcrumb/current"
import currentSrc from "@/docs/docs-site/examples/breadcrumb/current?raw"
import Demo from "@/docs/docs-site/examples/breadcrumb/demo"
import demoSrc from "@/docs/docs-site/examples/breadcrumb/demo?raw"
import Separators from "@/docs/docs-site/examples/breadcrumb/separators"
import separatorsSrc from "@/docs/docs-site/examples/breadcrumb/separators?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Breadcrumbs show where a page sits in a hierarchy and let people step back up it. Built from M3 parts: label-large links on full-radius state layers, chevron separators, and the current page as a tonal pill.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/Breadcrumbs.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumb"

<nav aria-label="Breadcrumb">
  <Breadcrumbs>
    <Breadcrumb href="/" icon="home">Home</Breadcrumb>
    <Breadcrumb href="/projects">Projects</Breadcrumb>
    <Breadcrumb>Kestrel</Breadcrumb>
  </Breadcrumbs>
</nav>`,
  examples: [
    {
      id: "separators",
      title: "Separators",
      description: (
        <>
          <InlineCode>separator</InlineCode> is <InlineCode>"chevron"</InlineCode> (default, mirrored in RTL), <InlineCode>"slash"</InlineCode>, or any
          node.
        </>
      ),
      component: Separators,
      source: separatorsSrc,
    },
    {
      id: "current",
      title: "Current page and size",
      description: (
        <>
          The last crumb is the current page. <InlineCode>current="tonal"</InlineCode> draws it as a secondary-container pill;{" "}
          <InlineCode>"plain"</InlineCode> as on-surface text. <InlineCode>size="sm"</InlineCode> is 28dp with label-medium text.
        </>
      ),
      component: Current,
      source: currentSrc,
    },
    {
      id: "collapsed",
      title: "Collapsed path",
      description: (
        <>
          <InlineCode>BreadcrumbMenu</InlineCode> folds the middle of a deep path behind a ⋯ button that opens a menu. Give items an{" "}
          <InlineCode>href</InlineCode>, or handle <InlineCode>onAction</InlineCode>.
        </>
      ),
      component: Collapsed,
      source: collapsedSrc,
    },
    {
      id: "back",
      title: "Back crumb",
      description: (
        <>
          On narrow layouts, <InlineCode>BreadcrumbBack</InlineCode> replaces the trail with an arrow and the parent's name.
        </>
      ),
      component: Back,
      source: backSrc,
    },
  ],
  api: [
    {
      name: "Breadcrumbs",
      description: <>React Aria's {c("Breadcrumbs")} (an ordered list) plus:</>,
      props: [
        { name: "separator", type: '"chevron" | "slash" | ReactNode', default: '"chevron"', description: "Separator between crumbs." },
        { name: "current", type: '"tonal" | "plain"', default: '"tonal"', description: "How the current (last) crumb is drawn." },
        { name: "size", type: '"md" | "sm"', default: '"md"', description: "md: 32dp, label-large. sm: 28dp, label-medium." },
        { name: "onAction", type: "(key: Key) => void", default: "—", description: "Called with a crumb's id when it's pressed." },
        { name: "isDisabled", type: "boolean", default: "false", description: "Disables every crumb." },
      ],
    },
    {
      name: "Breadcrumb",
      description: <>React Aria's {c("Breadcrumb")} item plus:</>,
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "Label. Required." },
        { name: "href", type: "string", default: "—", description: "Link target. The last crumb is the current page and isn't a link." },
        { name: "icon", type: "string", default: "—", description: "Leading Material Symbol." },
        { name: "id", type: "Key", default: "—", description: "Passed to Breadcrumbs' onAction." },
        { name: "linkProps", type: "LinkProps", default: "—", description: "Props for the inner link, e.g. target or routerOptions." },
        { name: "className", type: "string", default: "—", description: "Classes for the list item." },
      ],
    },
    {
      name: "BreadcrumbMenu",
      description: "A collapsed run of crumbs behind a ⋯ icon button and a menu.",
      props: [
        { name: "items", type: "{ id?: Key; label: string; href?: string }[]", default: "—", description: "The collapsed crumbs, in path order. Required." },
        { name: "onAction", type: "(item) => void", default: "—", description: "Called with the chosen item." },
        { name: "aria-label", type: "string", default: '"Show path"', description: "Name of the button and the menu." },
      ],
    },
    {
      name: "BreadcrumbBack",
      description: "Compact back link: arrow plus the parent's label. A link with href, a button without.",
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "Parent label. Required." },
        { name: "href", type: "string", default: "—", description: "Link target." },
        { name: "onPress", type: "() => void", default: "—", description: "Press handler." },
        { name: "className", type: "string", default: "—", description: "Classes for the link." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Breadcrumbs render an ordered list of links. Wrap them in {c('<nav aria-label="Breadcrumb">')} so they form a landmark. The last crumb gets{" "}
        {c('aria-current="page"')} and isn't focusable as a link. Separators are decorative and hidden from assistive tech.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through the crumbs (and the ⋯ button); the current page is skipped." },
      { keys: ["Enter"], description: "Follows the focused crumb." },
      { keys: ["Space", "Enter", "↓"], description: "Opens the collapsed-path menu; arrows move through it, Esc closes it." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Size", "Crumb", "Text", "Icon", "Separator"],
        rows: [
          ["md", "32dp, full radius, 8dp padding", c("label-large"), "18dp", "chevron 18dp"],
          ["sm", "28dp, full radius, 8dp padding", c("label-medium"), "16dp", "chevron 16dp"],
        ],
      },
    ],
    cards: [
      { title: "Color", items: ["Links: on-surface-variant", "Current (tonal): secondary-container, on-secondary-container, 12dp padding", "Current (plain): on-surface"] },
      { title: "States", items: ["Hover 8%, focus 10% + 3dp ring, pressed 12% with ripple", "Current page: no state layer or ripple"] },
    ],
    source: "No M3 spec component; composed from M3 shape, type and state-layer tokens.",
  },
} satisfies ComponentDoc
