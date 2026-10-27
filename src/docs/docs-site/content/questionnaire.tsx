import Choices from "@/docs/docs-site/examples/questionnaire/choices"
import choicesSrc from "@/docs/docs-site/examples/questionnaire/choices?raw"
import Compact from "@/docs/docs-site/examples/questionnaire/compact"
import compactSrc from "@/docs/docs-site/examples/questionnaire/compact?raw"
import Demo from "@/docs/docs-site/examples/questionnaire/demo"
import demoSrc from "@/docs/docs-site/examples/questionnaire/demo?raw"
import Multiple from "@/docs/docs-site/examples/questionnaire/multiple"
import multipleSrc from "@/docs/docs-site/examples/questionnaire/multiple?raw"
import Rating from "@/docs/docs-site/examples/questionnaire/rating"
import ratingSrc from "@/docs/docs-site/examples/questionnaire/rating?raw"
import { InlineCode } from "@/docs/docs-site/primitives"
import type { ComponentDoc } from "@/docs/docs-site/types"

const c = (s: string) => <code className="font-mono text-body-sm">{s}</code>

export default {
  description:
    "One question per step: a progress bar on top, a headline-small question, large choice cards that fill with secondary-container and round off when selected, and Back / Skip / Next in the footer. Ends with a pending submit and an optional completion screen.",
  links: { aria: "https://react-spectrum.adobe.com/react-aria/RadioGroup.html" },
  preview: { component: Demo, source: demoSrc },
  usage: `import { ChoiceCard, ChoiceGroup, Questionnaire, QuestionnaireStep } from "@/components/ui/questionnaire"

<Questionnaire label="Onboarding" onSubmit={save}>
  <QuestionnaireStep title="How many clusters do you run?" isComplete={!!size}>
    <ChoiceGroup aria-label="Clusters" value={size} onChange={setSize}>
      <ChoiceCard value="one" icon="looks_one">Just one</ChoiceCard>
      <ChoiceCard value="many" icon="hub">More than five</ChoiceCard>
    </ChoiceGroup>
  </QuestionnaireStep>
</Questionnaire>`,
  examples: [
    {
      id: "choices",
      title: "Choice cards",
      description: (
        <>
          ChoiceGroup has radio semantics by default. Cards take an <InlineCode>icon</InlineCode> (it fills when selected) and a{" "}
          <InlineCode>description</InlineCode>; a check grows in on the selected one.
        </>
      ),
      component: Choices,
      source: choicesSrc,
    },
    {
      id: "multiple",
      title: "Multiple selection",
      description: (
        <>
          <InlineCode>selectionMode="multiple"</InlineCode> switches to checkbox semantics; value is a string array.
        </>
      ),
      component: Multiple,
      source: multipleSrc,
    },
    {
      id: "rating",
      title: "Rating scale",
      description: "Any range (0–10 by default). Options are round; the chosen one morphs to 12dp corners and fills primary.",
      component: Rating,
      source: ratingSrc,
    },
    {
      id: "compact",
      title: "Compact and skippable",
      description: (
        <>
          <InlineCode>size="sm"</InlineCode> and <InlineCode>variant="plain"</InlineCode> fit a side panel. <InlineCode>isSkippable</InlineCode> adds Skip on
          that step; steps without <InlineCode>isComplete</InlineCode> never block Next.
        </>
      ),
      component: Compact,
      source: compactSrc,
    },
  ],
  api: [
    {
      name: "Questionnaire",
      description: <>Renders one QuestionnaireStep at a time. Extends {c("<div>")} props.</>,
      props: [
        { name: "label", type: "ReactNode", default: "—", description: "Trailing header text, e.g. the flow name." },
        { name: "stepLabel", type: "(step, total) => ReactNode", default: "“Question 1 of 3”", description: "Leading header text; announced politely as the step changes." },
        { name: "step · defaultStep · onStepChange", type: "number · number · (step) => void", default: "0", description: "Controlled or uncontrolled current step (0-based)." },
        { name: "onSubmit", type: "() => void | Promise<void>", default: "—", description: "Runs on the last step's Submit; a promise shows the pending state." },
        { name: "completion", type: "ReactNode", default: "—", description: "Replaces the steps once onSubmit resolves." },
        { name: "nextLabel · backLabel · skipLabel · submitLabel", type: "string", default: '"Next" · "Back" · "Skip" · "Submit"', description: "Footer button labels." },
        { name: "size", type: '"md" | "sm"', default: '"md"', description: "md: 24–32dp padding. sm: compact for side panels." },
        { name: "variant", type: '"card" | "plain"', default: '"card"', description: "card: surface with level 1. plain: no container." },
      ],
    },
    {
      name: "QuestionnaireStep",
      description: <>Configuration only; Questionnaire renders it.</>,
      props: [
        { name: "title", type: "ReactNode", default: "—", description: "The question (headline-small). Receives focus when the step changes." },
        { name: "description", type: "ReactNode", default: "—", description: "Line under the question." },
        { name: "isComplete", type: "boolean", default: "true", description: "Gates Next (or Submit) until the step is answered." },
        { name: "isSkippable", type: "boolean", default: "false", description: "Shows Skip (not on the last step)." },
      ],
    },
    {
      name: "ChoiceGroup · ChoiceCard",
      description: <>ChoiceGroup is a React Aria {c("RadioGroup")} (single) or {c("CheckboxGroup")} (multiple); pass {c("aria-label")} or a label.</>,
      props: [
        { name: "selectionMode", type: '"single" | "multiple"', default: '"single"', description: "Radio or checkbox semantics." },
        { name: "value · defaultValue · onChange", type: "string | null · string[]", default: "—", description: "Selected value(s), typed by selection mode." },
        { name: "ChoiceCard value", type: "string", default: "—", description: "Value of this option." },
        { name: "ChoiceCard icon", type: "string", default: "—", description: "Leading Material Symbol; fills when selected." },
        { name: "ChoiceCard description", type: "ReactNode", default: "—", description: "Supporting line." },
        { name: "ChoiceCard isDisabled", type: "boolean", default: "false", description: "Disables the option." },
      ],
    },
    {
      name: "RatingScale",
      description: <>A horizontal React Aria {c("RadioGroup")} of numbers.</>,
      props: [
        { name: "min · max", type: "number", default: "0 · 10", description: "Range of options." },
        { name: "value · defaultValue", type: "number | null", default: "—", description: "Selected number." },
        { name: "onChange", type: "(value: number) => void", default: "—", description: "Called with the chosen number." },
        { name: "minLabel · maxLabel", type: "ReactNode", default: "—", description: "Anchors under the ends of the scale." },
      ],
    },
  ],
  accessibility: {
    description: (
      <>
        Choice cards are real radios or checkboxes (React Aria), so each step is one labelled group. The step counter is a polite live region, and the new
        question's heading receives focus after Next or Back, so screen-reader users land on it. The progress bar is labelled “Questionnaire progress”.
      </>
    ),
    keyboard: [
      { keys: ["Tab"], description: "Moves into the choice group, then to the footer buttons." },
      { keys: ["↑", "↓"], description: "Single choice: move and select within the cards." },
      { keys: ["←", "→"], description: "Rating scale: move and select between numbers." },
      { keys: ["Space"], description: "Multiple choice: toggle the focused card." },
    ],
  },
  spec: {
    tables: [
      {
        columns: ["Part", "Value"],
        rows: [
          ["Container (card)", "surface, level 1, 28dp corners, 24–32dp padding (20dp compact)"],
          ["Header", <>{c("label-large")} on-surface-variant · 4dp linear progress</>],
          ["Question", c("headline-small")],
          ["Choice card", "min 56dp, 16dp corners, 1dp outline-variant, body-large"],
          ["Choice selected", "secondary-container, 28dp corners, filled icon + check"],
          ["Rating option", "square cell, full corners → 12dp selected on primary"],
        ],
      },
    ],
    cards: [
      {
        title: "Motion",
        items: [
          <>Card and option morph: {c("fast-spatial")} 0.6 / 800, pressed 12dp (8dp rating)</>,
          <>Step change: slides in on {c("default-spatial")} 0.8 / 380</>,
          <>Completion: pops in on {c("default-spatial")}</>,
        ],
      },
    ],
    source: <>From the kit's questionnaire article, on the M3 shape scale and Expressive springs.</>,
  },
} satisfies ComponentDoc
