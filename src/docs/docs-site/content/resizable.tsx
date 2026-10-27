import Demo from "@/docs/docs-site/examples/resizable/demo"
import demoSrc from "@/docs/docs-site/examples/resizable/demo?raw"
import Vertical from "@/docs/docs-site/examples/resizable/vertical"
import verticalSrc from "@/docs/docs-site/examples/resizable/vertical?raw"
import Variants from "@/docs/docs-site/examples/resizable/variants"
import variantsSrc from "@/docs/docs-site/examples/resizable/variants?raw"
import Collapsible from "@/docs/docs-site/examples/resizable/collapsible"
import collapsibleSrc from "@/docs/docs-site/examples/resizable/collapsible?raw"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "Resizable panes with the M3 drag handle. Built on react-resizable-panels: drag, use the keyboard, set min and max sizes, and collapse panes.",
  links: { m3: "https://m3.material.io/foundations/layout/understanding-layout/parts-of-layout" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

<ResizablePanelGroup orientation="horizontal">
  <ResizablePanel defaultSize="30%" minSize="20%">List</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Detail</ResizablePanel>
</ResizablePanelGroup>`,
  examples: [
    { id: "vertical", title: "Vertical", description: "orientation=\"vertical\" stacks the panes; the handle turns horizontal.", component: Vertical, source: verticalSrc },
    {
      id: "variants",
      title: "Handle variants",
      description: "handle is the M3 24dp drag handle. bar is a compact 12dp tonal bar. line is a 1px divider with a wider invisible hit area.",
      component: Variants,
      source: variantsSrc,
    },
    {
      id: "collapsible",
      title: "Collapsible pane",
      description: (
        <>
          {c("collapsible")} panes snap to {c("collapsedSize")} when dragged below {c("minSize")}. Drive them from code with {c("panelRef")}.
        </>
      ),
      component: Collapsible,
      source: collapsibleSrc,
    },
  ],
  api: [
    {
      name: "ResizablePanelGroup",
      description: <>react-resizable-panels {c("Group")}, filling its parent. All of its props pass through.</>,
      props: [
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction the panes are laid out in." },
        { name: "defaultLayout", type: "Layout", default: "—", description: "Initial sizes by panel id, e.g. restored from storage." },
        { name: "onLayoutChange", type: "(layout: Layout) => void", default: "—", description: "Called while sizes change (every pointer move)." },
        { name: "onLayoutChanged", type: "(layout: Layout, meta) => void", default: "—", description: "Called once a resize finishes." },
        { name: "disabled", type: "boolean", default: "false", description: "Turns resizing off." },
        { name: "groupRef", type: "Ref<GroupImperativeHandle>", default: "—", description: "getLayout() and setLayout()." },
      ],
    },
    {
      name: "ResizablePanel",
      description: (
        <>
          react-resizable-panels {c("Panel")}. Sizes accept pixels as numbers ({c("200")}) or strings with units ({c('"30%"')}, {c('"56px"')}).
        </>
      ),
      props: [
        { name: "defaultSize", type: "number | string", default: "auto", description: "Initial size. Panels without one share the remaining space." },
        { name: "minSize", type: "number | string", default: '"0%"', description: "Smallest size it can be dragged to." },
        { name: "maxSize", type: "number | string", default: '"100%"', description: "Largest size." },
        { name: "collapsible", type: "boolean", default: "false", description: "Collapse when dragged below minSize." },
        { name: "collapsedSize", type: "number | string", default: '"0%"', description: "Size when collapsed." },
        { name: "onResize", type: "(size: PanelSize, id, prevSize) => void", default: "—", description: "Called when this panel's size changes." },
        { name: "panelRef", type: "Ref<PanelImperativeHandle>", default: "—", description: "collapse(), expand(), resize(), getSize(), isCollapsed()." },
      ],
    },
    {
      name: "ResizableHandle",
      description: <>react-resizable-panels {c("Separator")}. Its orientation follows the group.</>,
      props: [
        { name: "variant", type: '"handle" | "bar" | "line"', default: '"handle"', description: "M3 drag handle, compact tonal bar, or 1px line." },
        { name: "disabled", type: "boolean", default: "false", description: "This handle can't resize its neighbours." },
        { name: "disableDoubleClick", type: "boolean", default: "false", description: "Stop double-click from resetting the panel to its default size." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Each handle is a focusable {c('role="separator"')} with {c("aria-valuenow")}, {c("aria-valuemin")} and {c("aria-valuemax")} for the panel it controls.
        Focus shows the 3dp secondary ring inside the handle.
      </>
    ),
    keyboard: [
      { keys: ["←", "→"], description: "Resize in a horizontal group." },
      { keys: ["↑", "↓"], description: "Resize in a vertical group." },
      { keys: ["Home", "End"], description: "Shrink or grow the panel to its minimum or maximum." },
      { keys: ["Enter"], description: "Collapse or expand a collapsible panel." },
      { keys: ["F6"], description: "Move focus to the next handle in the group." },
    ],
    notes: ["Give each pane a heading or landmark so screen reader users know what they're resizing."],
  },
  spec: {
    tables: [
      {
        columns: ["State", "Handle", "Color", "Corners"],
        rows: [
          ["Rest", "4 × 48dp", "outline", "full"],
          ["Hover", "4 × 48dp", "on-surface-variant", "full"],
          ["Pressed / dragged", "12 × 52dp", "on-surface", "12dp"],
        ],
      },
    ],
    cards: [
      { title: "Container", items: ["24dp wide (handle variant)", "bar: 12dp, surface-container", "line: 1px outline-variant, 13px hit area"] },
      { title: "Motion", items: [<>Handle morph on {c("fast-spatial")} 0.6 / 800 (374ms)</>] },
    ],
    source: (
      <>
        androidx {c("DragHandleTokens")}: {c("Width")} 4dp, {c("Height")} 48dp, {c("PressedWidth")}/{c("DraggedWidth")} 12dp,{" "}
        {c("PressedHeight")}/{c("DraggedHeight")} 52dp, {c("ContainerWidth")} 24dp, {c("Color")} outline, {c("PressedColor")} on-surface,{" "}
        {c("PressedShape")} corner-medium.
      </>
    ),
  },
} satisfies ComponentDoc
