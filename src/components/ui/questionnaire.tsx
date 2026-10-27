"use client"

import * as React from "react"
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type RadioGroupProps as AriaRadioGroupProps,
} from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { LinearProgress } from "@/components/ui/progress"
import { Ripple } from "@/components/ui/ripple"
import { cn } from "@/lib/utils"

/*
 * Questionnaire
 * One question per step: progress on top, headline-small question, large choice cards that morph to
 * secondary-container (and round off) when selected, Back / Skip / Next in the footer.
 *
 * <Questionnaire label="Onboarding" onSubmit={save}>
 *   <QuestionnaireStep title="How many clusters does your team run today?" isComplete={!!size}>
 *     <ChoiceGroup aria-label="Clusters" value={size} onChange={setSize}>
 *       <ChoiceCard value="one" icon="looks_one">Just one</ChoiceCard>
 *     </ChoiceGroup>
 *   </QuestionnaireStep>
 * </Questionnaire>
 */

/* ---------- Steps ---------- */

export interface QuestionnaireStepProps {
  /** The question (headline-small). */
  title: React.ReactNode
  description?: React.ReactNode
  /** Gate Next until the step is answered. Defaults to true. */
  isComplete?: boolean
  /** Shows a Skip action. */
  isSkippable?: boolean
  children?: React.ReactNode
}

/** One question. Only meaningful as a child of <Questionnaire>. */
function QuestionnaireStep(_props: QuestionnaireStepProps): React.ReactNode {
  return null
}

export interface QuestionnaireProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSubmit"> {
  /** Trailing header text, e.g. the flow name. */
  label?: React.ReactNode
  /** "Question 1 of 3" */
  stepLabel?: (step: number, total: number) => React.ReactNode
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  /** Runs on the last step's primary action; a promise shows the pending state. */
  onSubmit?: () => void | Promise<void>
  /** Shown in place of the steps after onSubmit resolves. */
  completion?: React.ReactNode
  nextLabel?: string
  backLabel?: string
  skipLabel?: string
  submitLabel?: string
  /** md: 24–32dp padding · sm: compact card for side panels */
  size?: "md" | "sm"
  /** card: elevated surface · plain: no container */
  variant?: "card" | "plain"
  children: React.ReactNode
}

/** Multi-step questionnaire shell: progress, animated step transitions, focus moved to each new question. */
function Questionnaire({
  label,
  stepLabel = (i, n) => `Question ${i + 1} of ${n}`,
  step: controlled,
  defaultStep = 0,
  onStepChange,
  onSubmit,
  completion,
  nextLabel = "Next",
  backLabel = "Back",
  skipLabel = "Skip",
  submitLabel = "Submit",
  size = "md",
  variant = "card",
  className,
  children,
  ...props
}: QuestionnaireProps) {
  const steps = React.Children.toArray(children).filter(
    (c): c is React.ReactElement<QuestionnaireStepProps> => React.isValidElement(c) && c.type === QuestionnaireStep,
  )
  const n = steps.length
  const [inner, setInner] = React.useState(defaultStep)
  const step = Math.min(controlled ?? inner, n - 1)
  const [dir, setDir] = React.useState<1 | -1>(1)
  const [pending, setPending] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const headingRef = React.useRef<HTMLHeadingElement>(null)
  const navigated = React.useRef(false)

  const go = (to: number) => {
    setDir(to > step ? 1 : -1)
    navigated.current = true
    if (controlled === undefined) setInner(to)
    onStepChange?.(to)
  }

  React.useEffect(() => {
    if (navigated.current) headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const submit = async () => {
    if (!onSubmit) return
    setPending(true)
    try {
      await onSubmit()
      if (completion) setDone(true)
    } finally {
      setPending(false)
    }
  }

  const current = steps[step]?.props
  const last = step === n - 1
  const sm = size === "sm"

  return (
    <div
      data-slot="questionnaire"
      className={cn(variant === "card" && "rounded-xl bg-surface shadow-1", variant === "card" && (sm ? "p-5" : "p-6 md:p-8"), className)}
      {...props}
    >
      {done ? (
        <div className="animate-[m3-pop_var(--md-spring-default-spatial-duration)_var(--md-spring-default-spatial)] motion-reduce:animate-none">
          {completion}
        </div>
      ) : (
        <>
          <div className={cn("flex items-center justify-between text-on-surface-variant", sm ? "text-label-md" : "text-label-lg")}>
            <span aria-live="polite">{stepLabel(step, n)}</span>
            {label && <span>{label}</span>}
          </div>
          <LinearProgress
            value={((step + 1) / n) * 100}
            aria-label="Questionnaire progress"
            className={sm ? "mt-2" : "mt-3"}
          />
          {current && (
            <div
              key={step}
              className="animate-[m3-step-in_var(--md-spring-default-spatial-duration)_var(--md-spring-default-spatial)] motion-reduce:animate-none"
              style={{ "--step-dir": dir } as React.CSSProperties}
            >
              <h4 ref={headingRef} tabIndex={-1} className={cn("text-headline-sm outline-none", sm ? "mt-5" : "mt-6")}>
                {current.title}
              </h4>
              {current.description && <p className="mt-1 text-body-md text-on-surface-variant">{current.description}</p>}
              <div className={sm ? "mt-4" : "mt-5"}>{current.children}</div>
            </div>
          )}
          <div className="mt-6 flex items-center gap-1">
            <Button variant="text" onPress={() => go(step - 1)} isDisabled={step === 0} className="ps-2">
              <Icon>arrow_back</Icon>
              {backLabel}
            </Button>
            <span className="flex-1" />
            {current?.isSkippable && !last && (
              <Button variant="text" onPress={() => go(step + 1)}>
                {skipLabel}
              </Button>
            )}
            {last ? (
              <Button onPress={submit} isPending={pending} isDisabled={current?.isComplete === false} className="px-6">
                {submitLabel}
              </Button>
            ) : (
              <Button onPress={() => go(step + 1)} isDisabled={current?.isComplete === false} className="ps-6 pe-4">
                {nextLabel}
                <Icon>arrow_forward</Icon>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ---------- Choice cards ---------- */

const ChoiceModeContext = React.createContext<"single" | "multiple">("single")

type SingleProps = Omit<AriaRadioGroupProps, "value" | "defaultValue" | "onChange" | "className" | "children"> & {
  selectionMode?: "single"
  value?: string | null
  defaultValue?: string | null
  onChange?: (value: string) => void
}
type MultipleProps = Omit<AriaCheckboxGroupProps, "value" | "defaultValue" | "onChange" | "className" | "children"> & {
  selectionMode: "multiple"
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
}
export type ChoiceGroupProps = (SingleProps | MultipleProps) & { className?: string; children: React.ReactNode }

/** Stack of large choice cards: radio semantics by default, checkboxes with selectionMode="multiple". */
function ChoiceGroup(props: ChoiceGroupProps) {
  if (props.selectionMode === "multiple") {
    const { selectionMode, className, children, ...rest } = props
    return (
      <ChoiceModeContext.Provider value={selectionMode}>
        <AriaCheckboxGroup data-slot="choice-group" {...rest} className={cn("grid gap-2", className)}>
          {children}
        </AriaCheckboxGroup>
      </ChoiceModeContext.Provider>
    )
  }
  const { selectionMode = "single", className, children, ...rest } = props
  return (
    <ChoiceModeContext.Provider value={selectionMode}>
      <AriaRadioGroup data-slot="choice-group" {...rest} className={cn("grid gap-2", className)}>
        {children}
      </AriaRadioGroup>
    </ChoiceModeContext.Provider>
  )
}

export interface ChoiceCardProps {
  value: string
  /** Leading Material Symbol; fills when selected. */
  icon?: string
  description?: React.ReactNode
  isDisabled?: boolean
  className?: string
  children: React.ReactNode
}

const choiceCardClass = cn(
  "group/choice state-layer focus-ring shape-morph relative flex min-h-14 cursor-pointer items-center gap-4 rounded-lg border border-outline-variant px-4 py-3 text-body-lg text-on-surface",
  "data-pressed:rounded-[12px] data-selected:rounded-xl data-selected:border-transparent data-selected:bg-secondary-container data-selected:text-on-secondary-container data-selected:[--icon-fill:1]",
  "data-disabled:cursor-default data-disabled:border-on-surface/12 data-disabled:text-on-surface/38",
)

/** One answer card. Selected cards fill with secondary-container and round off on the FastSpatial spring. */
function ChoiceCard({ value, icon, description, isDisabled, className, children }: ChoiceCardProps) {
  const mode = React.useContext(ChoiceModeContext)
  const content = (
    <>
      {icon && <Icon>{icon}</Icon>}
      <span className="min-w-0 flex-1">
        <span className="block">{children}</span>
        {description && <span className="block text-body-sm opacity-80">{description}</span>}
      </span>
      <Icon
        filled
        className="scale-50 opacity-0 transition-[opacity,scale] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial group-data-selected/choice:scale-100 group-data-selected/choice:opacity-100"
      >
        check_circle
      </Icon>
      <Ripple />
    </>
  )
  return mode === "multiple" ? (
    <AriaCheckbox data-slot="choice-card" value={value} isDisabled={isDisabled} className={cn(choiceCardClass, className)}>
      {content}
    </AriaCheckbox>
  ) : (
    <AriaRadio data-slot="choice-card" value={value} isDisabled={isDisabled} className={cn(choiceCardClass, className)}>
      {content}
    </AriaRadio>
  )
}

/* ---------- Rating scale ---------- */

export interface RatingScaleProps extends Omit<AriaRadioGroupProps, "value" | "defaultValue" | "onChange" | "children"> {
  min?: number
  max?: number
  value?: number | null
  defaultValue?: number | null
  onChange?: (value: number) => void
  minLabel?: React.ReactNode
  maxLabel?: React.ReactNode
}

/** 0–10 (or any range) scale: round options that morph square and fill primary when chosen. */
function RatingScale({
  min = 0,
  max = 10,
  value,
  defaultValue,
  onChange,
  minLabel,
  maxLabel,
  className,
  ...props
}: RatingScaleProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  return (
    <AriaRadioGroup
      data-slot="rating-scale"
      orientation="horizontal"
      {...props}
      value={value === undefined ? undefined : value === null ? null : String(value)}
      defaultValue={defaultValue == null ? undefined : String(defaultValue)}
      onChange={(v) => onChange?.(Number(v))}
      className={composeRenderProps(className, (className) => cn("w-full", className))}
    >
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((n) => (
          <AriaRadio
            key={n}
            value={String(n)}
            className={cn(
              "state-layer focus-ring shape-morph relative grid aspect-square w-full cursor-pointer place-items-center rounded-full border border-outline-variant text-label-md text-on-surface tabular-nums",
              "data-pressed:rounded-[8px] data-selected:rounded-md data-selected:border-transparent data-selected:bg-primary data-selected:text-on-primary",
            )}
          >
            {n}
          </AriaRadio>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="mt-2 flex justify-between text-body-sm text-on-surface-variant">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </AriaRadioGroup>
  )
}

export { ChoiceCard, ChoiceGroup, Questionnaire, QuestionnaireStep, RatingScale }
