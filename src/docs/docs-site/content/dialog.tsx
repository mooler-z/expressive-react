import Basic from "@/docs/docs-site/examples/dialog/basic"
import basicSrc from "@/docs/docs-site/examples/dialog/basic?raw"
import Controlled from "@/docs/docs-site/examples/dialog/controlled"
import controlledSrc from "@/docs/docs-site/examples/dialog/controlled?raw"
import Demo from "@/docs/docs-site/examples/dialog/demo"
import demoSrc from "@/docs/docs-site/examples/dialog/demo?raw"
import Form from "@/docs/docs-site/examples/dialog/form"
import formSrc from "@/docs/docs-site/examples/dialog/form?raw"
import Scrolling from "@/docs/docs-site/examples/dialog/scrolling"
import scrollingSrc from "@/docs/docs-site/examples/dialog/scrolling?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>
const div = "HTMLAttributes<HTMLDivElement>"

export default {
  description:
    "Dialogs interrupt with important information or a short task. The M3 basic dialog: 28dp corners, an optional hero icon, a headline, supporting text and right-aligned text actions, with focus trapped while open.",
  links: {
    m3: "https://m3.material.io/components/dialogs/overview",
    aria: "https://react-spectrum.adobe.com/react-aria/Modal.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { Button } from "@/components/ui/button"
import { Dialog, DialogActions, DialogBody, DialogHeadline, DialogTrigger } from "@/components/ui/dialog"

<DialogTrigger>
  <Button>Open</Button>
  <Dialog>
    <DialogHeadline>Reset settings?</DialogHeadline>
    <DialogBody>Preferences return to their defaults.</DialogBody>
    <DialogActions>
      <Button variant="text" slot="close">Cancel</Button>
      <Button variant="text" slot="close" onPress={reset}>Reset</Button>
    </DialogActions>
  </Dialog>
</DialogTrigger>`,
  examples: [
    {
      id: "basic",
      title: "Without an icon",
      description: "Without DialogIcon the headline is start-aligned. A single dismissive action is fine for acknowledgements.",
      component: Basic,
      source: basicSrc,
    },
    {
      id: "form",
      title: "With a form",
      description: (
        <>
          Pass a function as children to get <InlineCode>close</InlineCode>, then close only after the task succeeds. Buttons with{" "}
          <InlineCode>slot="close"</InlineCode> close it directly.
        </>
      ),
      component: Form,
      source: formSrc,
    },
    {
      id: "scrolling",
      title: "Scrolling content",
      description: "DialogBody scrolls when the content is taller than the surface. Dividers mark the scroll edges, as M3 recommends.",
      component: Scrolling,
      source: scrollingSrc,
    },
    {
      id: "controlled",
      title: "Controlled",
      description: (
        <>
          Open a dialog from state with <InlineCode>{"overlayProps={{ isOpen, onOpenChange }}"}</InlineCode> instead of a trigger.{" "}
          <InlineCode>modalClassName</InlineCode> styles the surface itself, here a narrower 400dp width.
        </>
      ),
      component: Controlled,
      source: controlledSrc,
    },
  ],
  api: [
    {
      name: "Dialog",
      description: <>React Aria {c("ModalOverlay")} + {c("Modal")} + {c("Dialog")}. Accepts every React Aria Dialog prop (children may be a function of {c("{ close }")}), plus:</>,
      props: [
        { name: "isDismissable", type: "boolean", default: "true", description: "Close on a scrim click. Always off when role=\"alertdialog\"." },
        { name: "role", type: '"dialog" | "alertdialog"', default: '"dialog"', description: "alertdialog for decisions; see Alert dialog." },
        { name: "className", type: "string", default: "—", description: "Classes for the inner content column (24dp padding, flex column)." },
        { name: "modalClassName", type: "string", default: "—", description: "Classes for the surface: width (280–560dp by default), radius, color." },
        {
          name: "overlayProps",
          type: 'Omit<ModalOverlayProps, "children">',
          default: "—",
          description: "Props for the scrim, e.g. isOpen / onOpenChange to control it without a DialogTrigger, or isKeyboardDismissDisabled.",
        },
      ],
    },
    {
      name: "DialogTrigger",
      description: <>React Aria {c("DialogTrigger")}: wraps a pressable trigger and the Dialog.</>,
      props: [
        { name: "isOpen", type: "boolean", default: "—", description: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state." },
        { name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—", description: "Called when the dialog opens or closes." },
      ],
    },
    { name: "DialogIcon", description: "Hero icon above the headline; centers the headline under it.", props: [{ name: "children", type: "string", default: "—", description: "Material Symbols name." }] },
    {
      name: "DialogHeadline",
      description: <>React Aria {c("Heading")} with {c('slot="title"')}, so it labels the dialog. Headline-small.</>,
      props: [{ name: "level", type: "number", default: "3", description: "Heading level (from React Aria Heading)." }],
    },
    { name: "DialogBody · DialogActions", description: <>Each a {c(div)}: body is scrollable body-medium supporting text; actions are an end-aligned row with 8dp gaps.</>, props: [{ name: "className", type: "string", default: "—", description: "Merged with the part's classes." }] },
  ],
  accessibility: {
    description: (
      <>
        The dialog renders {c('role="dialog"')} labelled by its headline, traps focus while open, makes the rest of the page inert and restores focus to the
        trigger when it closes. For decisions that need an explicit answer, use <TextLink to="/docs/alert-dialog">Alert dialog</TextLink>.
      </>
    ),
    keyboard: [
      { keys: ["Tab", "Shift+Tab"], description: "Cycles focus through the dialog's controls; focus can't leave it." },
      { keys: ["Esc"], description: "Closes the dialog (unless isKeyboardDismissDisabled is set on overlayProps)." },
      { label: "Open", description: "Focus moves to the first focusable element, or to an element with autoFocus." },
      { label: "Close", description: "Focus returns to the element that opened it." },
    ],
    notes: ["Always include a DialogHeadline or an aria-label so the dialog has a name.", "Scroll is locked on the page behind the scrim."],
  },
  spec: {
    tables: [
      {
        columns: ["Property", "Value"],
        rows: [
          ["Container", <>{c("surface-container-high")}, level 3</>],
          ["Shape", "28dp (corner extra-large)"],
          ["Width", "280–560dp"],
          ["Padding", "24dp"],
          ["Icon", <>24dp, {c("secondary")}, 16dp above the headline</>],
          ["Headline", <>{c("headline-small")}, {c("on-surface")}</>],
          ["Supporting text", <>{c("body-medium")}, {c("on-surface-variant")}, 16dp below the headline</>],
          ["Actions", <>text buttons, {c("label-large")} {c("primary")}, 24dp above, 8dp apart</>],
          ["Scrim", <>{c("scrim")} at 32%</>],
        ],
      },
    ],
    cards: [
      { title: "Motion", items: ["Enter: scrim fades in 200ms, surface scales 0.92 → 1 over 450ms (emphasized decelerate)", "Exit: 150ms (emphasized accelerate)"] },
    ],
    source: <>androidx {c("DialogTokens")} and the M3 basic dialog spec.</>,
  },
} satisfies ComponentDoc
