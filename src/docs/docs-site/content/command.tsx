import Demo from "@/docs/docs-site/examples/command/demo"
import demoSrc from "@/docs/docs-site/examples/command/demo?raw"
import Descriptions from "@/docs/docs-site/examples/command/descriptions"
import descriptionsSrc from "@/docs/docs-site/examples/command/descriptions?raw"
import Inline from "@/docs/docs-site/examples/command/inline"
import inlineSrc from "@/docs/docs-site/examples/command/inline?raw"
import LoadingEmpty from "@/docs/docs-site/examples/command/loading-empty"
import loadingEmptySrc from "@/docs/docs-site/examples/command/loading-empty?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  title: "Command palette",
  description:
    "A command palette is a searchable list of actions and destinations, opened from anywhere with ⌘K. It's the M3 search view in a dialog: grouped results, shortcuts, metadata and a keyboard-hint footer.",
  links: {
    m3: "https://m3.material.io/components/search/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Autocomplete.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { CommandDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const [open, setOpen] = useState(false)

// ⌘K / Ctrl+K toggles it by default
<CommandDialog isOpen={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search commands" />
  <CommandList>
    <CommandItem icon="rocket_launch" onAction={deploy}>New deployment</CommandItem>
  </CommandList>
</CommandDialog>`,
  examples: [
    {
      id: "inline",
      title: "Inline",
      description: (
        <>
          <InlineCode>Command</InlineCode> works outside a dialog, as a filterable list in a page or a popover. Pass{" "}
          <InlineCode>autoFocus={"{false}"}</InlineCode> so it doesn't grab focus on load.
        </>
      ),
      component: Inline,
      source: inlineSrc,
    },
    {
      id: "descriptions",
      title: "Dynamic groups, descriptions and meta",
      description: (
        <>
          Groups accept <InlineCode>items</InlineCode> and a render function. Items take a second line (<InlineCode>description</InlineCode>), right-aligned{" "}
          <InlineCode>meta</InlineCode> and key caps (<InlineCode>shortcut</InlineCode>). CommandFooter takes custom hints.
        </>
      ),
      component: Descriptions,
      source: descriptionsSrc,
    },
    {
      id: "loading-empty",
      title: "Loading and empty",
      description: <>isLoading shows the loading indicator in place of results; emptyState replaces the default "No matching commands".</>,
      component: LoadingEmpty,
      source: loadingEmptySrc,
    },
  ],
  api: [
    {
      name: "CommandDialog",
      description: <>React Aria {c("ModalOverlay")} props (isOpen, onOpenChange, isDismissable…), plus:</>,
      props: [
        { name: "isOpen · onOpenChange", type: "boolean · (isOpen: boolean) => void", default: "—", description: "Open state. The shortcut calls onOpenChange." },
        {
          name: "shortcut",
          type: "string | null",
          default: '"k"',
          description: (
            <>
              ⌘ / Ctrl + this key toggles the palette. Pass {c("null")} if something else already owns the shortcut (this site's header does).
            </>
          ),
        },
        { name: "filter", type: "(text: string, input: string) => boolean", default: "contains", description: "Custom matching; defaults to case- and accent-insensitive contains." },
        { name: "className", type: "string", default: "—", description: "Classes for the dialog surface." },
      ],
    },
    {
      name: "Command",
      description: <>The filterable surface on its own (React Aria {c("Autocomplete")}).</>,
      props: [
        { name: "filter", type: "(text: string, input: string) => boolean", default: "contains", description: "Matching function." },
        { name: "inputValue · onInputChange", type: "string", default: "—", description: "Control the query, e.g. for server search." },
        { name: "className", type: "string", default: "—", description: "Classes for the wrapper (set max-height here)." },
      ],
    },
    {
      name: "CommandInput",
      props: [
        { name: "placeholder", type: "string", default: '"Type a command or search"', description: "Input placeholder." },
        { name: "hint", type: "ReactNode | null", default: "Esc key cap", description: "Trailing hint. null hides it." },
        { name: "autoFocus", type: "boolean", default: "true", description: "Focus the input on mount." },
      ],
    },
    {
      name: "CommandList",
      description: <>React Aria {c("Menu")} props (items, onAction…), plus:</>,
      props: [
        { name: "emptyState", type: "ReactNode", default: "—", description: "Shown when nothing matches." },
        { name: "isLoading", type: "boolean", default: "false", description: "Shows the loading indicator instead of results." },
        { name: "loadingText", type: "ReactNode", default: '"Searching…"', description: "Text beside the loading indicator." },
      ],
    },
    {
      name: "CommandGroup",
      description: <>React Aria {c("MenuSection")} props, plus {c("title")} (ReactNode).</>,
      props: [],
    },
    {
      name: "CommandItem",
      description: <>React Aria {c("MenuItem")} props (onAction, href, textValue…), plus:</>,
      props: [
        { name: "icon", type: "string", default: "—", description: "Leading Material Symbol." },
        { name: "leading", type: "ReactNode", default: "—", description: "Leading node. Wins over icon." },
        { name: "description", type: "ReactNode", default: "—", description: "Second line." },
        { name: "shortcut", type: "string[]", default: "—", description: 'Key caps, e.g. ["⌘", "N"]. Display only.' },
        { name: "meta", type: "ReactNode", default: "—", description: "Right-aligned meta text." },
        { name: "textValue", type: "string", default: "children", description: "Text used for filtering when children aren't a string." },
      ],
    },
    {
      name: "CommandFooter · useCommandShortcut",
      description: (
        <>
          The keyboard-hint row (custom {c("children")} replace the default hints), and the hook behind {c("shortcut")}:{" "}
          {c("useCommandShortcut(key, onTrigger)")}.
        </>
      ),
      props: [],
    },
  ],
  accessibility: {
    description: (
      <>
        A modal dialog labelled "Command palette" holding a search field and a menu. Focus stays in the input while ↑ ↓ move a virtual highlight, so
        typing never stops. For page-level search with suggestions, see <TextLink to="/docs/search">Search</TextLink>.
      </>
    ),
    keyboard: [
      { keys: ["⌘", "K"], description: "Toggles the palette (Ctrl+K on Windows and Linux) unless shortcut is null." },
      { keys: ["↑", "↓"], description: "Moves the highlight between results." },
      { keys: ["Enter"], description: "Runs the highlighted command." },
      { keys: ["Esc"], description: "Closes the palette and returns focus to where it was." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Surface", "surface-container-high · 28dp corners · level 3 · top-aligned · 640dp max"],
          ["Input row", <>56dp · leading search icon · {c("body-large")} · trailing Esc hint</>],
          ["Group header", c("title-small")],
          ["Result row", "48dp · highlighted on secondary-container"],
          ["Footer", "keyboard hints with key caps"],
        ],
      },
    ],
    cards: [{ title: "See also", items: [<TextLink to="/docs/search">Search</TextLink>, <TextLink to="/docs/code-block">Kbd</TextLink>] }],
    source: <>Built from the M3 search view and menu tokens; behavior from React Aria Autocomplete.</>,
  },
} satisfies ComponentDoc
