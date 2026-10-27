import Demo from "@/docs/docs-site/examples/sheet/demo"
import demoSrc from "@/docs/docs-site/examples/sheet/demo?raw"
import Side from "@/docs/docs-site/examples/sheet/side"
import sideSrc from "@/docs/docs-site/examples/sheet/side?raw"
import StandardBottom from "@/docs/docs-site/examples/sheet/standard-bottom"
import standardBottomSrc from "@/docs/docs-site/examples/sheet/standard-bottom?raw"
import StandardSide from "@/docs/docs-site/examples/sheet/standard-side"
import standardSideSrc from "@/docs/docs-site/examples/sheet/standard-side?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

const modalProps = [
  { name: "children", type: "ReactNode | ({ close }) => ReactNode", default: "—", description: "Sheet content. A function receives close()." },
  { name: "aria-label", type: "string", default: "—", description: "Names the dialog when there's no SheetTitle." },
  { name: "isDismissable", type: "boolean", default: "true", description: "Close on a scrim click." },
  { name: "isOpen · onOpenChange", type: "boolean · (isOpen: boolean) => void", default: "—", description: "Control it without a trigger (from ModalOverlay)." },
  { name: "className", type: "string", default: "—", description: "Classes for the sheet surface." },
  { name: "overlayClassName", type: "string", default: "—", description: "Classes for the scrim." },
]

export default {
  description:
    "Sheets hold supplementary content anchored to an edge of the screen. Modal bottom sheets with drag to dismiss, peeking standard bottom sheets, and modal or standard side sheets.",
  links: {
    m3: "https://m3.material.io/components/bottom-sheets/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Modal.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { BottomSheet, BottomSheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

<BottomSheetTrigger>
  <Button>Open</Button>
  <BottomSheet>
    <SheetHeader><SheetTitle>Share</SheetTitle></SheetHeader>
    <SheetContent>…</SheetContent>
  </BottomSheet>
</BottomSheetTrigger>`,
  examples: [
    {
      id: "side",
      title: "Modal side sheet",
      description: (
        <>
          <InlineCode>SideSheet</InlineCode> slides in over a scrim from the right (or <InlineCode>side="left"</InlineCode>). A{" "}
          <InlineCode>closeButton</InlineCode> in the header and <InlineCode>slot="close"</InlineCode> buttons in the footer close it.
        </>
      ),
      component: Side,
      source: sideSrc,
    },
    {
      id: "standard-side",
      title: "Standard side sheet",
      description: "StandardSideSheet is part of the layout. It animates its width open and closed on the default spatial spring and is inert while closed.",
      component: StandardSide,
      source: standardSideSrc,
    },
    {
      id: "standard-bottom",
      title: "Standard bottom sheet",
      description: (
        <>
          <InlineCode>StandardBottomSheet</InlineCode> peeks at <InlineCode>peekHeight</InlineCode> and expands to its content. Drag the handle, or press it.
          It's fixed to the viewport by default; <InlineCode>className="absolute"</InlineCode> docks it in a container.
        </>
      ),
      component: StandardBottom,
      source: standardBottomSrc,
    },
  ],
  api: [
    { name: "BottomSheet", description: <>Modal bottom sheet. Use inside {c("BottomSheetTrigger")} (alias of React Aria DialogTrigger).</>, props: [...modalProps, { name: "dragHandle", type: "boolean", default: "true", description: "Show the 32×4dp handle. Dragging it (or the header) down more than 30% of the height, or flicking, dismisses." }] },
    { name: "SideSheet", description: <>Modal side sheet. Use inside {c("SideSheetTrigger")}.</>, props: [...modalProps, { name: "side", type: '"left" | "right"', default: '"right"', description: "Edge it slides in from." }] },
    {
      name: "StandardBottomSheet",
      description: <>Non-modal {c("<section>")} that coexists with the page.</>,
      props: [
        { name: "peekHeight", type: "number", default: "96", description: "Visible height while collapsed, in px. 0 hides it entirely." },
        { name: "isExpanded", type: "boolean", default: "—", description: "Controlled expanded state." },
        { name: "defaultExpanded", type: "boolean", default: "false", description: "Initial state when uncontrolled." },
        { name: "onExpandedChange", type: "(expanded: boolean) => void", default: "—", description: "Called when a drag or the handle switches state." },
        { name: "aria-label", type: "string", default: '"Bottom sheet"', description: "Names the region and the handle." },
      ],
    },
    {
      name: "StandardSideSheet",
      description: <>Non-modal {c("<aside>")} that pushes the main pane.</>,
      props: [
        { name: "isOpen", type: "boolean", default: "true", description: "Open or collapsed to zero width (inert while closed)." },
        { name: "side", type: '"left" | "right"', default: '"right"', description: "Which edge the divider sits on." },
        { name: "width", type: "number", default: "320", description: "Open width in px; the spec range is 256–400." },
      ],
    },
    {
      name: "SheetHeader",
      description: "64dp header row. Dragging it also moves a bottom sheet.",
      props: [
        { name: "closeButton", type: "boolean", default: "false", description: "Adds a close icon button. Inside a modal sheet it closes the sheet; otherwise pass onClose." },
        { name: "onClose", type: "() => void", default: "—", description: "Close handler for non-modal sheets." },
        { name: "leading", type: "ReactNode", default: "—", description: "Leading slot, e.g. a back button." },
      ],
    },
    {
      name: "SheetTitle · SheetDescription · SheetContent · SheetFooter · SheetDragHandle",
      description: (
        <>
          {c("SheetTitle")} is a React Aria Heading ({c('slot="title"')}) that labels the dialog. {c("SheetContent")} scrolls. {c("SheetFooter")} is a bordered
          action row. {c("SheetDragHandle")} is the handle button, rendered for you by modal and standard bottom sheets.
        </>
      ),
      props: [{ name: "className", type: "string", default: "—", description: "Merged with the part's classes." }],
    },
  ],
  accessibility: {
    description: (
      <>
        Modal sheets are dialogs: focus is trapped, the page behind is inert, and focus returns to the trigger. The drag handle is a real button ("Close
        sheet" on modal sheets, toggles expansion on standard ones, with {c("aria-expanded")}), so dragging is never the only way to act.
      </>
    ),
    keyboard: [
      { keys: ["Esc"], description: "Closes a modal sheet." },
      { keys: ["Tab", "Shift+Tab"], description: "Moves within a modal sheet; focus can't leave it." },
      { keys: ["Space", "Enter"], description: "On the drag handle: closes a modal bottom sheet, or expands and collapses a standard one." },
    ],
    notes: ["Give each modal sheet a SheetTitle or an aria-label.", "A closed StandardSideSheet is inert, so its content leaves the tab order."],
  },
  spec: {
    tables: [
      {
        columns: ["Sheet", "Container", "Shape", "Elevation", "Size"],
        rows: [
          ["Modal bottom", c("surface-container-low"), "28dp top corners", "Level 1", "max width 640dp, top gap 72dp"],
          ["Standard bottom", c("surface-container-low"), "28dp top corners", "Level 1", "peek 96dp by default"],
          ["Modal side", c("surface-container-low"), "16dp inner corners", "Level 1", "256–400dp wide"],
          ["Standard side", <>{c("surface")} + 1dp {c("outline-variant")} divider</>, "none", "Level 0", "256–400dp wide"],
        ],
      },
    ],
    cards: [
      { title: "Drag handle", items: ["32×4dp, on-surface-variant at 40%", "48dp touch target", "Widens to 40dp while pressed"] },
      { title: "Motion", items: ["Enter 450ms emphasized decelerate, exit 200ms emphasized accelerate", "Drag release and width changes settle on default-spatial (0.8 / 380)", "Scrim at 32%"] },
    ],
    source: <>androidx {c("SheetBottomTokens")} and the M3 side sheet spec.</>,
  },
} satisfies ComponentDoc
