import Basic from "@/docs/docs-site/examples/alert-dialog/basic"
import basicSrc from "@/docs/docs-site/examples/alert-dialog/basic?raw"
import Demo from "@/docs/docs-site/examples/alert-dialog/demo"
import demoSrc from "@/docs/docs-site/examples/alert-dialog/demo?raw"
import ThreeActions from "@/docs/docs-site/examples/alert-dialog/three-actions"
import threeActionsSrc from "@/docs/docs-site/examples/alert-dialog/three-actions?raw"
import TypeToConfirm from "@/docs/docs-site/examples/alert-dialog/type-to-confirm"
import typeToConfirmSrc from "@/docs/docs-site/examples/alert-dialog/type-to-confirm?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "A basic dialog that requires a decision: confirmations, destructive actions and unsaved changes. The scrim doesn't dismiss it, destructive confirms use the error role, and the body can hold a type-to-confirm field.",
  links: {
    m3: "https://m3.material.io/components/dialogs/guidelines",
    aria: "https://react-spectrum.adobe.com/react-aria/Modal.html",
  },
  preview: { component: Demo, source: demoSrc },
  usage: `import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

<AlertDialogTrigger>
  <Button>Delete…</Button>
  <AlertDialog title="Delete project?" confirmLabel="Delete" destructive onConfirm={remove}>
    This can't be undone.
  </AlertDialog>
</AlertDialogTrigger>`,
  examples: [
    {
      id: "basic",
      title: "Confirmation",
      description: "Non-destructive confirms default to a text button, matching the basic dialog. Rename both actions after what they do.",
      component: Basic,
      source: basicSrc,
    },
    {
      id: "three-actions",
      title: "Three actions",
      description: (
        <>
          <InlineCode>extraActions</InlineCode> renders between Cancel and the confirm button: the M3 three-action layout for unsaved changes. Give extra
          actions <InlineCode>slot="close"</InlineCode> so they close the dialog.
        </>
      ),
      component: ThreeActions,
      source: threeActionsSrc,
    },
    {
      id: "type-to-confirm",
      title: "Type to confirm",
      description: (
        <>
          For irreversible actions, put a <TextLink to="/docs/text-field">TextField</TextLink> in the body and keep{" "}
          <InlineCode>isConfirmDisabled</InlineCode> on until the name matches.
        </>
      ),
      component: TypeToConfirm,
      source: typeToConfirmSrc,
    },
  ],
  api: [
    {
      name: "AlertDialog",
      description: (
        <>
          Built on <TextLink to="/docs/dialog">Dialog</TextLink> with {c('role="alertdialog"')} and {c("isDismissable={false}")}. Accepts the other Dialog props
          ({c("className")}, {c("modalClassName")}, {c("overlayProps")}), plus:
        </>
      ),
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Headline. Labels the dialog." },
        { name: "confirmLabel", type: "ReactNode", default: "—", description: "Confirm button text (required)." },
        { name: "cancelLabel", type: "ReactNode", default: '"Cancel"', description: "Cancel button text." },
        { name: "children", type: "ReactNode", default: "—", description: "Supporting text and any extra content, rendered in a scrollable DialogBody." },
        { name: "icon", type: "string", default: "—", description: "Material Symbols name above the headline. Error-colored when destructive, secondary otherwise." },
        { name: "destructive", type: "boolean", default: "false", description: "Error role for the confirm button and icon." },
        {
          name: "confirmVariant",
          type: '"text" | "filled" | "tonal"',
          default: 'destructive ? "filled" : "text"',
          description: "Confirm button style.",
        },
        { name: "isConfirmDisabled", type: "boolean", default: "false", description: "Disables confirm, e.g. until a type-to-confirm field matches." },
        { name: "extraActions", type: "ReactNode", default: "—", description: "Buttons between Cancel and confirm. Give them slot=\"close\"." },
        { name: "onConfirm", type: "() => void", default: "—", description: "Called when confirm is pressed, before the dialog closes." },
        { name: "onCancel", type: "() => void", default: "—", description: "Called when Cancel is pressed. Escape closes without calling it." },
      ],
    },
    {
      name: "AlertDialogTrigger",
      description: <>Alias of React Aria {c("DialogTrigger")}: isOpen, defaultOpen, onOpenChange.</>,
      props: [{ name: "onOpenChange", type: "(isOpen: boolean) => void", default: "—", description: "Use it to reset form state when the dialog closes." }],
    },
  ],
  accessibility: {
    description: (
      <>
        Renders {c('role="alertdialog"')}, so screen readers announce it as requiring a response. Clicking the scrim does nothing; Escape still cancels.
        Focus is trapped and returns to the trigger on close.
      </>
    ),
    keyboard: [
      { keys: ["Tab", "Shift+Tab"], description: "Moves between the actions and any field in the body." },
      { keys: ["Esc"], description: "Cancels and closes. onCancel isn't called; use AlertDialogTrigger's onOpenChange to observe it." },
      { keys: ["Enter", "Space"], description: "Activates the focused action." },
    ],
    notes: [
      "Name actions after their result (\"Delete\", \"Leave\"), not \"OK\" or \"Yes\".",
      "Keep the destructive action last, after Cancel, so it's never the first focus stop.",
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Element", "Default", "Destructive"],
        rows: [
          ["Icon", c("secondary"), c("error")],
          ["Confirm", <>text button, {c("primary")} label</>, <>filled {c("error")} / {c("on-error")}</>],
          ["Cancel", "text button", "text button"],
          ["Scrim dismiss", "off", "off"],
        ],
      },
    ],
    cards: [{ title: "Surface", items: ["Same as Dialog: surface-container-high, level 3, 28dp corners, 24dp padding", "Icon left-aligned, 16dp above the headline"] }],
    source: <>M3 dialog guidelines; surface values from androidx {c("DialogTokens")}.</>,
  },
} satisfies ComponentDoc
