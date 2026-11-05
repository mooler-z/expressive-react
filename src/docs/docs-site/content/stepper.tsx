import Compact from "@/docs/docs-site/examples/stepper/compact"
import compactSrc from "@/docs/docs-site/examples/stepper/compact?raw"
import Controlled from "@/docs/docs-site/examples/stepper/controlled"
import controlledSrc from "@/docs/docs-site/examples/stepper/controlled?raw"
import Demo from "@/docs/docs-site/examples/stepper/demo"
import demoSrc from "@/docs/docs-site/examples/stepper/demo?raw"
import ErrorOptional from "@/docs/docs-site/examples/stepper/error-optional"
import errorOptionalSrc from "@/docs/docs-site/examples/stepper/error-optional?raw"
import Form from "@/docs/docs-site/examples/stepper/form"
import formSrc from "@/docs/docs-site/examples/stepper/form?raw"
import NonLinear from "@/docs/docs-site/examples/stepper/non-linear"
import nonLinearSrc from "@/docs/docs-site/examples/stepper/non-linear?raw"
import Vertical from "@/docs/docs-site/examples/stepper/vertical"
import verticalSrc from "@/docs/docs-site/examples/stepper/vertical?raw"
import { InlineCode, TextLink } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "A stepper walks people through a multi-step task, such as a long create form. It shows which steps are done, current and still ahead, gates Next behind validation, and collapses to a progress bar when the row doesn't fit. M3 has no stepper; this one is built from M3 color roles, the type scale and Expressive motion.",
  preview: { component: Demo, source: demoSrc },
  usage: `import { Stepper, StepperActions, StepperItem, StepperList, StepperPanel } from "@/components/ui/stepper"

<Stepper validate={(step) => isStepValid(step)}>
  <StepperList aria-label="New student">
    <StepperItem title="Basic" />
    <StepperItem title="Academic" />
    <StepperItem title="Guardian" />
  </StepperList>
  <StepperPanel step={0}>…</StepperPanel>
  <StepperPanel step={1}>…</StepperPanel>
  <StepperPanel step={2}>…</StepperPanel>
  <StepperActions finishLabel="Create" onFinish={create} isPending={saving} />
</Stepper>`,
  examples: [
    {
      id: "form",
      title: "Form wizard with validation",
      description: (
        <>
          <InlineCode>validate</InlineCode> runs before Next, Finish or a press on a later step. Return <InlineCode>false</InlineCode> to stay; return a
          promise and Next shows the pending state until it settles. Here the step's item also switches to <InlineCode>status="error"</InlineCode>, and
          Finish takes <InlineCode>isPending</InlineCode> while the record saves.
        </>
      ),
      component: Form,
      source: formSrc,
    },
    {
      id: "vertical",
      title: "Vertical",
      description: (
        <>
          <InlineCode>orientation="vertical"</InlineCode> stacks the steps with connectors between them. Panels and actions read the stepper from context,
          so they can sit anywhere inside it, here in a second column.
        </>
      ),
      component: Vertical,
      source: verticalSrc,
    },
    {
      id: "non-linear",
      title: "Non-linear",
      description: (
        <>
          With <InlineCode>linear={"{false}"}</InlineCode> every step is a button. A <InlineCode>status="disabled"</InlineCode> step stays out of reach,
          and Next and Back skip it.
        </>
      ),
      component: NonLinear,
      source: nonLinearSrc,
    },
    {
      id: "error-optional",
      title: "Error and optional steps",
      description: (
        <>
          <InlineCode>status="error"</InlineCode> swaps the number for "!" in the error role and colors the supporting line, so it can carry the message.{" "}
          <InlineCode>optional</InlineCode> adds an "Optional" line. A linear stepper can move past an optional step, and it stays unchecked until someone
          completes it.
        </>
      ),
      component: ErrorOptional,
      source: errorOptionalSrc,
    },
    {
      id: "compact",
      title: "Compact width",
      description:
        "A horizontal list measures itself. When the row would overflow its container, it collapses to the kit's segmented progress bar with \"Step n of N · Title\", and expands again once there's room.",
      component: Compact,
      source: compactSrc,
    },
    {
      id: "controlled",
      title: "Controlled, with custom actions",
      description: (
        <>
          <InlineCode>step</InlineCode> and <InlineCode>onStepChange</InlineCode> control the stepper. When the parent moves the step itself, such as
          Start over, completions from that step on are cleared. <InlineCode>useStepper()</InlineCode> gives your own parts the state and the same
          navigation that StepperActions uses.
        </>
      ),
      component: Controlled,
      source: controlledSrc,
    },
  ],
  api: [
    {
      name: "Stepper",
      description: (
        <>
          Root {c("<div>")}: holds the current step, which steps are complete, and the validation gate. Takes any div attribute. Also exported:{" "}
          {c("stepperVariants")}, the {c("tv()")} recipe with one slot per part.
        </>
      ),
      props: [
        { name: "step", type: "number", default: "—", description: "Current step, zero-based (controlled)." },
        { name: "defaultStep", type: "number", default: "0", description: "Initial step when uncontrolled." },
        { name: "onStepChange", type: "(step: number) => void", default: "—", description: "Called when Next, Back or a step press moves to another step." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Row of steps, or a column with vertical connectors." },
        {
          name: "linear",
          type: "boolean",
          default: "true",
          description:
            "Earlier steps can always be pressed. Later steps can only be pressed when every step in between is complete, optional or disabled. false makes every step pressable.",
        },
        {
          name: "validate",
          type: "(step: number) => boolean | void | Promise<boolean | void>",
          default: "—",
          description:
            "Runs with the current step before Next, Finish or a press on a later step. false (or a promise of false) keeps the stepper where it is. Back never validates.",
        },
      ],
    },
    {
      name: "StepperList",
      description: (
        <>
          An {c("<ol>")} of {c("StepperItem")}s. Items must be its direct children (arrays are fine): the list reads their {c("optional")} and{" "}
          {c("status")} props, and the stepper needs it to count steps.
        </>
      ),
      props: [
        { name: "children", type: "ReactNode", default: "—", description: "The StepperItems, in order." },
        { name: "aria-label", type: "string", default: '"Steps"', description: "Names the list." },
        { name: "className", type: "string", default: "—", description: "Classes for the wrapper." },
      ],
    },
    {
      name: "StepperItem",
      description: <>One step. It's a button only when it can be reached; otherwise it's plain, unfocusable content.</>,
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "Step name, in title-small." },
        {
          name: "description",
          type: "ReactNode",
          default: "—",
          description: "Supporting line under the title. Uses the error role when status is error, so it can carry the message.",
        },
        {
          name: "optional",
          type: "boolean | ReactNode",
          default: "false",
          description: 'true shows "Optional", a node shows that text. A linear stepper can move past an optional step that isn\'t complete.',
        },
        {
          name: "status",
          type: '"complete" | "error" | "disabled"',
          default: "—",
          description: "Forces a state. Otherwise the state comes from the current step and the steps you've completed.",
        },
        { name: "className", type: "string", default: "—", description: "Classes for the <li>." },
      ],
    },
    {
      name: "StepperPanel",
      description: <>Content for one step. Takes any div attribute.</>,
      props: [
        { name: "step", type: "number", default: "—", description: "The step this content belongs to (zero-based)." },
        {
          name: "keepMounted",
          type: "boolean",
          default: "false",
          description: "Keep the panel mounted, hidden, while another step is current, so uncontrolled inputs keep their values.",
        },
      ],
    },
    {
      name: "StepperActions",
      description: (
        <>
          Back (text button), Next (filled) and, on the last step, Finish, all built from <TextLink to="/docs/button">Button</TextLink>. Back is hidden on
          the first step.
        </>
      ),
      props: [
        { name: "finishLabel", type: "ReactNode", default: '"Finish"', description: 'Label of the last step\'s action, e.g. "Create" or "Update".' },
        {
          name: "onFinish",
          type: "() => void | Promise<unknown>",
          default: "—",
          description: "Runs after validate passes on the last step. A promise shows the pending state until it settles. Then the last step shows its check.",
        },
        { name: "isPending", type: "boolean", default: "false", description: "Pending state for Finish when you track saving yourself." },
        { name: "nextLabel", type: "ReactNode", default: '"Next"', description: "Label of the Next button." },
        { name: "backLabel", type: "ReactNode", default: '"Back"', description: "Label of the Back button." },
        { name: "children", type: "ReactNode", default: "—", description: "Extra actions, placed before Next or Finish." },
        { name: "className", type: "string", default: "—", description: "Classes for the action row." },
      ],
    },
    {
      name: "useStepper()",
      description: <>Stepper state and navigation for your own parts. Use it inside {c("<Stepper>")}.</>,
      props: [
        { name: "step · count", type: "number", description: "Current step (zero-based) and number of steps." },
        { name: "isFirst · isLast", type: "boolean", description: "No enabled step before or after the current one." },
        { name: "isValidating · isFinishing", type: "boolean", description: "validate or onFinish is still running." },
        { name: "isFinished", type: "boolean", description: "finish() succeeded and the step hasn't changed since. Use it to swap in a done state." },
        { name: "next() · back()", type: "() => Promise<boolean>", description: "Move to the nearest enabled step. next validates first. Resolves true if the step changed." },
        { name: "goTo(index)", type: "(index: number) => Promise<boolean>", description: "Move to a step. Validates when moving forward." },
        { name: "finish(onFinish?)", type: "(onFinish?: () => void | Promise<unknown>) => Promise<boolean>", description: "What Finish does: validate, run onFinish, mark the step complete." },
        { name: "stateOf(index)", type: '(index: number) => "complete" | "current" | "upcoming" | "error" | "disabled"', description: "What a step shows." },
        { name: "canGoTo(index)", type: "(index: number) => boolean", description: "Whether a step can be pressed right now." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        The steps are an ordered list, so screen readers announce the position ("2 of 4"). The current step's {c("<li>")} has{" "}
        {c('aria-current="step"')}. Reachable steps are React Aria buttons; the current step and steps you can't reach yet are plain text and stay out of
        the tab order. Indicators are decorative: complete and error states are also spoken as hidden text. After the stepper moves, focus goes to the
        new panel, a group labelled by the step's title, and the stepper scrolls into view if its top is off screen.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves through the reachable steps, then the panel's content and the actions." },
      { keys: ["Space", "Enter"], description: "On a step: goes to it, running validate first when it's a later step. On Next or Finish: the same gate." },
      { label: "Validating", description: "Next or Finish shows the loading indicator and ignores presses; focus stays on the button." },
    ],
    notes: [
      "Every step change is driven by a button press, so pointer, touch, keyboard and screen-reader presses behave the same way.",
      "Back and Next arrows mirror in right-to-left layouts, and panels slide in from the matching side.",
      'The status words (", completed", ", has errors") and the "Optional" and "Step n of N" texts are English. Pass your own optional text as a node.',
    ],
  },
  spec: {
    description: "M3 has no stepper component, so these values come from the M3 roles and tokens it reuses.",
    tables: [
      {
        title: "Step states",
        columns: ["State", "Indicator", "Content", "Shape", "Title"],
        rows: [
          ["Upcoming", "surface-container-highest", "on-surface-variant, number", "full", "on-surface-variant"],
          ["Current", "primary", "on-primary, number", "8dp", "on-surface"],
          ["Complete", "primary-container", "on-primary-container, check", "full", "on-surface-variant"],
          ["Error", "error", "on-error, !", "full (8dp when current)", "error"],
          ["Disabled", "on-surface 10%", "on-surface 38%", "full", "on-surface 38%"],
        ],
      },
      {
        title: "Sizes",
        columns: ["Part", "Value"],
        rows: [
          ["Indicator", <>24dp · number {c("label-medium")} · 16dp glyph</>],
          ["Step target", "min 40dp tall · 8dp padding (12dp after the label) · 20dp corners, 12dp pressed"],
          ["Labels", <>title {c("title-small")} · supporting line {c("body-small")} · 12dp from the indicator</>],
          ["Connector", "2dp · min 24dp long (horizontal) · 4dp clear of each indicator (vertical)"],
          ["Compact bar", "4dp segments with 4dp gaps · the current segment half filled"],
        ],
      },
    ],
    cards: [
      {
        title: "Motion",
        items: [
          <>Indicator corners and the press morph: {c("fast-spatial")} 0.6 / 800 (374ms)</>,
          <>Connector fill: {c("fast-spatial")}, clipped so the overshoot never spills</>,
          <>Colors: {c("default-effects")} 1.0 / 1600 (223ms)</>,
          <>Panel enter: {c("default-spatial")} slide, 32dp from the side it came from</>,
          "Reduced motion: no slide, fill, morph or check pop",
        ],
      },
      {
        title: "Color choices",
        items: [
          "Solid primary marks one thing only: where you are now",
          "Done steps drop to primary-container, so the current step still stands out after many checks",
          "Primary connectors trace the path you've covered",
        ],
      },
      {
        title: "States",
        items: ["Hover 8%, focus 10%, pressed 12% on-surface state layer, plus ripple", "3dp secondary focus ring", "Unreachable steps: no state layer, not focusable"],
      },
    ],
    source: (
      <>
        Corners from androidx {c("ShapeTokens")} ({c("CornerSmall")} 8dp for the current step, the way a selected icon button turns square) and springs from{" "}
        {c("ExpressiveMotionTokens")}. The compact bar copies the kit's "Steps" progress variant.
      </>
    ),
  },
} satisfies ComponentDoc
