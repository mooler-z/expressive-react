import Async from "@/docs/docs-site/examples/search/async"
import asyncSrc from "@/docs/docs-site/examples/search/async?raw"
import Bar from "@/docs/docs-site/examples/search/bar"
import barSrc from "@/docs/docs-site/examples/search/bar?raw"
import Demo from "@/docs/docs-site/examples/search/demo"
import demoSrc from "@/docs/docs-site/examples/search/demo?raw"
import Fullscreen from "@/docs/docs-site/examples/search/fullscreen"
import fullscreenSrc from "@/docs/docs-site/examples/search/fullscreen?raw"
import Items from "@/docs/docs-site/examples/search/items"
import itemsSrc from "@/docs/docs-site/examples/search/items?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Search lets people enter a query and pick from suggestions. SearchBar is a standalone pill field; SearchView expands the bar into a docked or full-screen view of live-filtered results.",
  links: {
    m3: "https://m3.material.io/components/search/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/SearchField.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { SearchItem, SearchView } from "@/components/ui/search"

<SearchView placeholder="Search" onAction={(key) => open(key)}>
  <SearchItem id="recent" icon="history">Recent query</SearchItem>
</SearchView>`,
  examples: [
    {
      id: "bar",
      title: "Search bar",
      description: (
        <>
          <InlineCode>SearchBar</InlineCode> takes everything React Aria's SearchField does (<InlineCode>value</InlineCode>,{" "}
          <InlineCode>onChange</InlineCode>, <InlineCode>onSubmit</InlineCode>). <InlineCode>leading</InlineCode> and{" "}
          <InlineCode>trailing</InlineCode> hold a menu button, a mic or an avatar.
        </>
      ),
      component: Bar,
      source: barSrc,
    },
    {
      id: "items",
      title: "Dynamic results",
      description: (
        <>
          Pass <InlineCode>items</InlineCode> and a render function. Results filter as you type with a case- and diacritic-insensitive "contains";{" "}
          <InlineCode>textValue</InlineCode> is what the filter matches.
        </>
      ),
      component: Items,
      source: itemsSrc,
    },
    {
      id: "async",
      title: "Server results",
      description: (
        <>
          <InlineCode>filter={"{null}"}</InlineCode> turns off client filtering so you can show server results. <InlineCode>isLoading</InlineCode> puts
          the loading indicator in the header; <InlineCode>renderEmptyState</InlineCode> covers the no-results case.
        </>
      ),
      component: Async,
      source: asyncSrc,
    },
    {
      id: "fullscreen",
      title: "Full-screen view",
      description: (
        <>
          <InlineCode>mode="fullscreen"</InlineCode> covers the window with a 72dp header, the M3 pattern for compact widths. The docked view (default)
          expands in place with 28dp corners.
        </>
      ),
      component: Fullscreen,
      source: fullscreenSrc,
    },
  ],
  api: [
    {
      name: "SearchBar",
      description: <>React Aria's {c("SearchField")} props (value, onChange, onSubmit, onClear, isDisabled…) plus:</>,
      props: [
        { name: "placeholder", type: "string", default: '"Search"', description: "Placeholder; also the accessible name unless aria-label is set." },
        { name: "leading", type: "ReactNode", default: '"search"', description: "Icon name or node (e.g. a menu IconButton). null for none." },
        { name: "trailing", type: "ReactNode", default: "—", description: "Trailing actions, e.g. a mic button or an avatar. Rendered outside the field." },
        { name: "className", type: "string", default: "—", description: "Classes for the 56dp container." },
      ],
    },
    {
      name: "SearchView",
      props: [
        { name: "children", type: "ReactNode | (item: T) => ReactNode", default: "—", description: "Results: SearchItem / SearchSection, or a render function with items. Required." },
        { name: "items", type: "Iterable<T>", default: "—", description: "Dynamic results." },
        { name: "placeholder", type: "string", default: '"Search"', description: "Shown in the collapsed bar and the view's input." },
        { name: "leading", type: "ReactNode", default: '"search"', description: "Collapsed bar: icon name or node." },
        { name: "trailing", type: "ReactNode", default: "—", description: "Collapsed bar trailing actions." },
        { name: "inputValue", type: "string", default: "—", description: "Query (controlled)." },
        { name: "defaultInputValue", type: "string", default: '""', description: "Initial query when uncontrolled." },
        { name: "onInputChange", type: "(value: string) => void", default: "—", description: "Called as the query changes." },
        { name: "isOpen", type: "boolean", default: "—", description: "Open state (controlled)." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Initially open when uncontrolled." },
        { name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—", description: "Called when the view opens or closes." },
        { name: "onAction", type: "(key: Key) => void", default: "—", description: "A result was chosen. The view closes afterwards." },
        { name: "onSubmit", type: "(value: string) => void", default: "—", description: "Enter pressed in the input. The view closes afterwards." },
        {
          name: "filter",
          type: "((text: string, input: string) => boolean) | null",
          default: '"contains"',
          description: "Client-side filter. null disables filtering for server results.",
        },
        { name: "mode", type: '"docked" | "fullscreen"', default: '"docked"', description: "docked expands in place; fullscreen covers the window." },
        { name: "isLoading", type: "boolean", default: "false", description: "Shows the loading indicator in the header." },
        { name: "renderEmptyState", type: "(query: string) => ReactNode", default: "—", description: "Rendered when nothing matches." },
        { name: "className", type: "string", default: "—", description: "Classes for the collapsed bar." },
      ],
    },
    {
      name: "SearchItem",
      description: <>React Aria's {c("ListBoxItem")} props (id, textValue, href, isDisabled) plus:</>,
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "Label. Required. Set textValue when it isn't a plain string." },
        { name: "icon", type: "ReactNode", default: "—", description: "Leading icon name or node (an avatar, a badge)." },
        { name: "description", type: "ReactNode", default: "—", description: "Second line (body-medium, on-surface-variant)." },
        { name: "trailing", type: "ReactNode", default: "—", description: 'Trailing icon name or node, e.g. "north_west" to fill the query.' },
      ],
    },
    {
      name: "SearchSection · SearchHighlight",
      description: "SearchSection groups results under a title-small header. SearchHighlight colors the query inside a label.",
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "SearchSection: header text. Required." },
        { name: "children", type: "string", default: "—", description: "SearchHighlight: the label text. Required." },
        { name: "query", type: "string", default: "the view's input", description: "SearchHighlight: highlight this instead of the enclosing view's query." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        SearchBar is a native {c('input type="search"')} labelled by its placeholder (or {c("aria-label")}). The collapsed SearchView is a button with{" "}
        {c('aria-haspopup="dialog"')} and {c("aria-expanded")}. The open view is a dialog containing a React Aria Autocomplete: focus stays in the
        input while ↑/↓ move a virtual focus through the results, so screen readers announce each one.
      </>
    ),
    keyboard: [
      { keys: ["↑", "↓"], description: "Moves through results while focus stays in the input." },
      { keys: ["Enter"], description: "Picks the highlighted result, or submits the query when none is highlighted." },
      { keys: ["Esc"], description: "Clears the query; a second Esc closes the view and returns focus to the bar." },
      { label: "Clear button", description: "Appears once there's text; it's a labelled icon button (“Clear search”)." },
    ],
    notes: [<>Trailing actions in SearchBar sit outside the field, so each needs its own {c("aria-label")}.</>, <>See also <TextLink to="/docs/command">Command palette</TextLink> for keyboard-first search.</>],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Height", "Shape", "Container", "Text"],
        rows: [
          ["Search bar", "56dp", "full", "surface-container-high", c("body-large")],
          ["Docked view", "56dp header", "28dp (extra-large)", "surface-container-high, level 2", c("body-large")],
          ["Full-screen view", "72dp header", "none", "surface-container-high", c("body-large")],
          ["Result", "56dp min", "—", "—", <>{c("body-large")}, description {c("body-medium")}</>],
        ],
      },
    ],
    cards: [
      { title: "Color", items: ["Leading icon on-surface", "Placeholder and trailing icons on-surface-variant", "Divider: 1dp outline under the header", "Highlight: primary"] },
      { title: "Motion", items: ["Docked view expands in 450ms (emphasized decelerate)", "Collapses in 200ms (emphasized accelerate)"] },
    ],
    source: (
      <>
        androidx {c("SearchBarTokens")} and {c("SearchViewTokens")}.
      </>
    ),
  },
} satisfies ComponentDoc
