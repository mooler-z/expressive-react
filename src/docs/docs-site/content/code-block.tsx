import Demo from "@/docs/docs-site/examples/code-block/demo"
import demoSrc from "@/docs/docs-site/examples/code-block/demo?raw"
import Tabs from "@/docs/docs-site/examples/code-block/tabs"
import tabsSrc from "@/docs/docs-site/examples/code-block/tabs?raw"
import Diff from "@/docs/docs-site/examples/code-block/diff"
import diffSrc from "@/docs/docs-site/examples/code-block/diff?raw"
import Command from "@/docs/docs-site/examples/code-block/command"
import commandSrc from "@/docs/docs-site/examples/code-block/command?raw"
import Inline from "@/docs/docs-site/examples/code-block/inline"
import inlineSrc from "@/docs/docs-site/examples/code-block/inline?raw"
import Kbd from "@/docs/docs-site/examples/code-block/kbd"
import kbdSrc from "@/docs/docs-site/examples/code-block/kbd?raw"
import Shortcuts from "@/docs/docs-site/examples/code-block/shortcuts"
import shortcutsSrc from "@/docs/docs-site/examples/code-block/shortcuts?raw"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Code block & Kbd",
  description:
    "Code blocks show source in Roboto Mono on surface-container-lowest, with a file header, line numbers, diff rows, language tabs and a copy button. Kbd renders keyboard keys and shortcuts.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { CodeBlock } from "@/components/ui/code-block"
import { KbdGroup } from "@/components/ui/kbd"

<CodeBlock filename="save.tsx" language="tsx" lineNumbers code={source} />

<KbdGroup keys={["⌘", "K"]} />`,
  examples: [
    {
      id: "tabs",
      title: "Language tabs",
      description: <>Pass {c("snippets")} for the same call in several languages. The copy button copies the selected tab.</>,
      component: Tabs,
      source: tabsSrc,
    },
    {
      id: "diff",
      title: "Diff",
      description: (
        <>
          With {c("diff")}, lines starting {c("+")} sit on primary-container and lines starting {c("-")} on error-container. The header counts them.
        </>
      ),
      component: Diff,
      source: diffSrc,
    },
    { id: "command", title: "Command", description: "CodeCommand is a one-line shell command with a prompt and a copy button, tonal or inverse.", component: Command, source: commandSrc },
    {
      id: "inline",
      title: "Inline code & copy button",
      description: <>{c("InlineCode")} for code in running text. {c("CopyButton")} works anywhere: it flips to a check for 2s after copying.</>,
      component: Inline,
      source: inlineSrc,
    },
    {
      id: "kbd",
      title: "Kbd",
      description: (
        <>
          Single keys in three sizes, outlined or tonal. {c("KbdGroup")} renders a chord, or a sequence when you give it a {c("separator")}. Kbd is its own registry
          item: {c("npx shadcn add @expressive/kbd")}.
        </>
      ),
      component: Kbd,
      source: kbdSrc,
    },
    { id: "shortcuts", title: "Shortcuts sheet", description: "A definition list of actions and their shortcuts.", component: Shortcuts, source: shortcutsSrc },
  ],
  api: [
    {
      name: "CodeBlock",
      description: <>Renders a {c("<div>")}, or React Aria {c("Tabs")} when {c("snippets")} is set.</>,
      props: [
        { name: "code", type: "string", default: '""', description: "Source to show and copy. Ignored when snippets is set." },
        { name: "snippets", type: "{ label: string; code: string; language?: string }[]", default: "—", description: "Tabbed versions of the same snippet." },
        { name: "filename", type: "string", default: "—", description: "Shown in the header; also names the tab list." },
        { name: "language", type: "string", default: "—", description: "Tag at the end of the header." },
        { name: "icon", type: "string", default: '"code"', description: "Header icon. \"difference\" for diffs." },
        { name: "lineNumbers", type: "boolean", default: "false (true with diff)", description: "Number the lines." },
        { name: "startLine", type: "number", default: "1", description: "First line number." },
        { name: "diff", type: "boolean", default: "false", description: "Treat +/- prefixed lines as additions and removals." },
        { name: "copyable", type: "boolean", default: "true", description: "Show the copy button." },
        { name: "onCopied", type: "(value: string) => void", default: "—", description: "Called after a successful copy." },
        { name: "children", type: "ReactNode", default: "—", description: "Pre-highlighted body. Replaces the plain rendering; copy still uses code." },
      ],
    },
    {
      name: "CodeCommand",
      props: [
        { name: "command", type: "string", default: "—", description: "The command. Truncates with an ellipsis; copy gets all of it." },
        { name: "prompt", type: "string", default: '"$"', description: "Prompt glyph." },
        { name: "variant", type: '"tonal" | "inverse"', default: '"tonal"', description: "surface-container-high or inverse-surface." },
        { name: "onCopied", type: "(value: string) => void", default: "—", description: "Called after a successful copy." },
      ],
    },
    {
      name: "CopyButton",
      description: <>An {c("IconButton")}; its size, variant and width props work too.</>,
      props: [
        { name: "value", type: "string", default: "—", description: "Text to copy." },
        { name: "aria-label", type: "string", default: '"Copy"', description: "Changes to \"Copied\" for 2s after copying." },
        { name: "onCopied", type: "(value: string) => void", default: "—", description: "Called after a successful copy." },
        { name: "size", type: "IconButton size", default: '"sm"', description: "Icon button size." },
      ],
    },
    { name: "InlineCode", description: <>A {c("<code>")} on surface-container-high. HTML attributes pass through.</>, props: [] },
    {
      name: "Kbd",
      description: <>From {c("@/components/ui/kbd")}. Renders a {c("<kbd>")}. Also exported: {c("kbdVariants")}.</>,
      props: [
        { name: "variant", type: '"outlined" | "tonal"', default: '"outlined"', description: "Outlined key with a 2dp bottom edge, or a tonal key cap." },
        { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "20 / 24 / 32dp tall." },
      ],
    },
    {
      name: "KbdGroup",
      props: [
        { name: "keys", type: "string[]", default: "—", description: "Keys in order, e.g. [\"⌘\", \"K\"]." },
        { name: "separator", type: "ReactNode", default: "—", description: "Text between keys for sequences (\"then\"). Omit for chords." },
        { name: "variant / size", type: "Kbd props", default: "—", description: "Applied to every key." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Code is a real {c("<pre><code>")}, so it's selectable and read as text. Line numbers and diff markers are hidden from assistive technology. Language
        tabs are React Aria {c("Tabs")}.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves to the copy button, and to the tab list when there are snippets." },
      { keys: ["←", "→"], description: "Switch language tabs." },
      { keys: ["Space", "Enter"], description: "Copy. The button's label changes to \"Copied\"." },
    ],
    notes: [
      "Scrolling code blocks scroll horizontally instead of wrapping, so indentation stays readable.",
      <>Kbd uses the native {c("<kbd>")} element, which screen readers can announce as keyboard input.</>,
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Container", "surface-container-lowest · 1dp outline-variant · 16dp corners"],
          ["Header", "48dp · file name in body-small Roboto Mono · language tag on surface-container"],
          ["Body", <>{c("body-small")} Roboto Mono · 24dp line height · 16dp padding</>],
          ["Diff rows", "Added: primary-container · Removed: error-container"],
          ["Command", "48dp · 12dp corners · tonal surface-container-high or inverse-surface"],
          ["Kbd", "20 / 24 / 32dp · Roboto Mono label · 4 / 4 / 8dp corners"],
        ],
      },
    ],
    source: "Not an M3 component. Built from M3 color roles, the type scale and the shape scale.",
  },
} satisfies ComponentDoc
