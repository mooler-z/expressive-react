"use client"

import * as React from "react"
import { Button as AriaButton, useLocale } from "react-aria-components"
import type { VariantProps } from "tailwind-variants"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Ripple } from "@/components/ui/ripple"
import { cn, tv } from "@/lib/utils"

/*
 * Stepper · built from M3 roles, type scale and Expressive motion (M3 has no stepper component)
 *   indicator   24dp · label-medium number · 16dp check / "!" glyph
 *               upcoming  surface-container-highest · on-surface-variant · full corners (12dp)
 *               current   primary · on-primary · CornerSmall 8dp (selected flips round → square, as icon buttons do)
 *               complete  primary-container · on-primary-container · check
 *               error     error · on-error · "!"
 *               disabled  on-surface 10% · on-surface 38%
 *   connector   2dp · outline-variant, filled with primary once the step before it is complete
 *   labels      title-small (on-surface when current) · body-small supporting line (error role on error)
 *   step target min 40dp · 20dp corners, 12dp pressed · state layer + ripple · only reachable steps are buttons
 *   compact     a horizontal list that can't fit becomes the kit's segmented 4dp progress + "Step n of N · Title"
 * Motion: corners ride FastSpatial (shape-morph), colors DefaultEffects, the connector fill FastSpatial,
 * panels slide in on DefaultSpatial (m3-step-in). All of it stops under prefers-reduced-motion.
 * Tokens: androidx ShapeTokens (CornerSmall 8dp · CornerFull) · ExpressiveMotionTokens.
 */
const stepperVariants = tv({
  slots: {
    root: "flex scroll-mt-24 flex-col gap-6",
    list: "flex",
    item: "relative flex",
    trigger: "relative flex min-h-10 shrink-0 gap-3 rounded-[20px] p-2 pe-3 text-start text-on-surface",
    indicator: [
      "grid size-6 shrink-0 place-items-center rounded-[12px] text-label-md tabular-nums [--icon-size:16px]",
      "shape-morph motion-reduce:transition-none",
    ],
    labels: "flex min-w-0 flex-col",
    title: "text-title-sm transition-colors duration-(--md-spring-default-effects-duration) ease-default-effects",
    description: "text-body-sm text-on-surface-variant transition-colors duration-(--md-spring-default-effects-duration) ease-default-effects",
    connector: "pointer-events-none overflow-hidden rounded-full bg-outline-variant",
    connectorFill: [
      "block size-full bg-primary",
      "transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial motion-reduce:transition-none",
    ],
  },
  variants: {
    orientation: {
      horizontal: {
        list: "w-max min-w-full items-stretch",
        item: "items-center not-last:flex-1",
        trigger: "items-center",
        title: "whitespace-nowrap",
        description: "whitespace-nowrap",
        connector: "me-1 h-0.5 min-w-6 flex-1",
        connectorFill: "origin-left scale-x-0 data-complete:scale-x-100 rtl:origin-right",
      },
      vertical: {
        list: "flex-col",
        item: "flex-col not-last:pb-4",
        trigger: "w-full items-start",
        title: "pt-0.5",
        // centred under the 24dp indicator (8dp padding + 12dp − 1dp), 4dp clear of both indicators
        connector: "absolute start-[19px] top-9 -bottom-1 w-0.5",
        connectorFill: "origin-top scale-y-0 data-complete:scale-y-100",
      },
    },
    state: {
      upcoming: { indicator: "bg-surface-container-highest text-on-surface-variant", title: "text-on-surface-variant" },
      current: { indicator: "bg-primary text-on-primary", title: "text-on-surface" },
      complete: { indicator: "bg-primary-container text-on-primary-container", title: "text-on-surface-variant" },
      error: { indicator: "bg-error text-on-error", title: "text-error", description: "text-error" },
      disabled: { indicator: "bg-on-surface/10 text-on-surface/38", title: "text-on-surface/38", description: "text-on-surface/38" },
    },
    /** The current step takes the square (CornerSmall) shape, whatever its color state. */
    current: { true: { indicator: "rounded-[8px]" }, false: "" },
    /** Reachable steps are buttons: state layer, ripple, focus ring and the press morph. */
    interactive: {
      true: { trigger: "state-layer focus-ring cursor-pointer outline-none select-none shape-morph data-pressed:rounded-[12px] motion-reduce:transition-none" },
      false: "",
    },
  },
  defaultVariants: { orientation: "horizontal", state: "upcoming", current: false, interactive: false },
})

/* ---------- State ---------- */

/** Status a step can be forced into. Anything else is derived from the current step. */
export type StepperStatus = "complete" | "error" | "disabled"
/** What a step shows. `error` and `disabled` come from `status`; the rest is derived. */
export type StepperStepState = "complete" | "current" | "upcoming" | "error" | "disabled"

type StepMeta = { optional: boolean; status?: StepperStatus }
type Gate = boolean | void | Promise<boolean | void>
/** Plain callbacks (any return value is ignored) or async ones; a promise shows the pending state. */
type FinishHandler = (() => void) | (() => Promise<unknown>)

interface StepperContextValue {
  step: number
  count: number
  orientation: "horizontal" | "vertical"
  linear: boolean
  isFirst: boolean
  isLast: boolean
  /** `validate` is running (async). */
  isValidating: boolean
  /** `finish()`'s callback is running. */
  isFinishing: boolean
  /** `finish()` succeeded and the step hasn't changed since. The last step shows its check. */
  isFinished: boolean
  stateOf: (index: number) => StepperStepState
  isComplete: (index: number) => boolean
  canGoTo: (index: number) => boolean
  goTo: (index: number) => Promise<boolean>
  next: () => Promise<boolean>
  back: () => Promise<boolean>
  finish: (onFinish?: FinishHandler) => Promise<boolean>
  /* internal */
  direction: -1 | 0 | 1
  titleId: (index: number) => string
  setMeta: (meta: StepMeta[]) => void
  takeFocus: () => boolean
}

const StepperContext = React.createContext<StepperContextValue | null>(null)
const StepperItemContext = React.createContext<{ index: number; isLast: boolean }>({ index: 0, isLast: true })

function useStepperContext(part: string) {
  const ctx = React.useContext(StepperContext)
  if (!ctx) throw new Error(`<${part}> must be used inside <Stepper>.`)
  return ctx
}

export type UseStepperResult = Pick<
  StepperContextValue,
  | "step"
  | "count"
  | "orientation"
  | "isFirst"
  | "isLast"
  | "isValidating"
  | "isFinishing"
  | "isFinished"
  | "stateOf"
  | "canGoTo"
  | "goTo"
  | "next"
  | "back"
  | "finish"
>

/** Stepper state and navigation for custom parts (e.g. your own action bar). Use inside <Stepper>. */
function useStepper(): UseStepperResult {
  const { step, count, orientation, isFirst, isLast, isValidating, isFinishing, isFinished, stateOf, canGoTo, goTo, next, back, finish } =
    useStepperContext("useStepper")
  return { step, count, orientation, isFirst, isLast, isValidating, isFinishing, isFinished, stateOf, canGoTo, goTo, next, back, finish }
}

const isThenable = (v: unknown): v is PromiseLike<unknown> => !!v && typeof (v as PromiseLike<unknown>).then === "function"

/* ---------- Stepper ---------- */

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">, Pick<VariantProps<typeof stepperVariants>, "orientation"> {
  /** Current step, zero-based (controlled). */
  step?: number
  /** Initial step when uncontrolled. */
  defaultStep?: number
  /** Called when Next, Back or a step press moves to another step. */
  onStepChange?: (step: number) => void
  /**
   * Only previous steps, and later steps with nothing incomplete in between, can be pressed.
   * Set false to make every step reachable.
   */
  linear?: boolean
  /**
   * Gate for moving forward. Runs with the current step before Next, Finish or a press on a later step.
   * Return (or resolve) `false` to stay. While a promise is pending, Next and Finish show their pending state.
   */
  validate?: (step: number) => Gate
  ref?: React.Ref<HTMLDivElement>
}

/** Multi-step flow. Holds the current step, which steps are complete, and the validation gate. */
function Stepper({
  step: controlled,
  defaultStep = 0,
  onStepChange,
  orientation = "horizontal",
  linear = true,
  validate,
  className,
  children,
  ...props
}: StepperProps) {
  const baseId = React.useId()
  const [inner, setInner] = React.useState(defaultStep)
  const [meta, setMetaState] = React.useState<StepMeta[]>([])
  const [completed, setCompleted] = React.useState<ReadonlySet<number>>(() => new Set())
  const [isValidating, setValidating] = React.useState(false)
  const [isFinishing, setFinishing] = React.useState(false)
  const [isFinished, setFinished] = React.useState(false)
  const busy = React.useRef(false)
  const focusNext = React.useRef(false)
  const internalTarget = React.useRef<number | null>(null)

  const count = meta.length
  const raw = controlled ?? inner
  const step = count ? Math.min(Math.max(raw, 0), count - 1) : Math.max(raw, 0)

  // Slide direction for the panel, derived from the previous step (works controlled and uncontrolled).
  const [prevStep, setPrevStep] = React.useState(step)
  const [direction, setDirection] = React.useState<-1 | 0 | 1>(0)
  if (step !== prevStep) {
    setPrevStep(step)
    setDirection(step > prevStep ? 1 : -1)
    setFinished(false)
  }

  // The parent moved `step` itself (e.g. "Start over"): forget completions from that step on.
  React.useLayoutEffect(() => {
    if (internalTarget.current === step) {
      internalTarget.current = null
      return
    }
    setCompleted((prev) => {
      if (![...prev].some((i) => i >= step)) return prev
      return new Set([...prev].filter((i) => i < step))
    })
  }, [step])

  const setMeta = React.useCallback((m: StepMeta[]) => setMetaState(m), [])

  const isComplete = (i: number) =>
    meta[i]?.status === "complete" || completed.has(i) || (linear && i < step && !meta[i]?.optional)

  const stateOf = (i: number): StepperStepState => {
    const status = meta[i]?.status
    if (status === "disabled") return "disabled"
    if (status === "error") return "error"
    if (i === step && !isFinished) return "current"
    return isComplete(i) ? "complete" : "upcoming"
  }

  /** Next enabled step from `from` in direction `dir`, or -1. */
  const nearest = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < count; i += dir) if (meta[i]?.status !== "disabled") return i
    return -1
  }

  const canGoTo = (i: number) => {
    if (i === step || i < 0 || i >= count || meta[i]?.status === "disabled") return false
    if (i < step || !linear) return true
    for (let j = step + 1; j < i; j++) {
      const m = meta[j]
      if (!(m?.status === "disabled" || m?.optional || isComplete(j))) return false
    }
    return true
  }

  const runGate = async (from: number) => {
    if (!validate) return true
    const result = validate(from)
    if (!isThenable(result)) return result !== false
    setValidating(true)
    try {
      return (await result) !== false
    } finally {
      setValidating(false)
    }
  }

  const goTo = async (to: number) => {
    if (busy.current || to === step || to < 0 || to >= count || meta[to]?.status === "disabled") return false
    if (to > step) {
      busy.current = true
      try {
        if (!(await runGate(step))) return false
      } finally {
        busy.current = false
      }
      setCompleted((prev) => new Set(prev).add(step))
    }
    focusNext.current = true
    internalTarget.current = to
    if (controlled === undefined) setInner(to)
    onStepChange?.(to)
    return true
  }

  const next = () => {
    const to = nearest(step, 1)
    return to < 0 ? Promise.resolve(false) : goTo(to)
  }
  const back = () => {
    const to = nearest(step, -1)
    return to < 0 ? Promise.resolve(false) : goTo(to)
  }

  const finish = async (onFinish?: FinishHandler) => {
    if (busy.current) return false
    busy.current = true
    try {
      if (!(await runGate(step))) return false
      const result = onFinish?.()
      if (isThenable(result)) {
        setFinishing(true)
        try {
          await result
        } finally {
          setFinishing(false)
        }
      }
      setCompleted((prev) => new Set(prev).add(step))
      setFinished(true)
      return true
    } finally {
      busy.current = false
    }
  }

  const takeFocus = React.useCallback(() => {
    const take = focusNext.current
    focusNext.current = false
    return take
  }, [])

  const ctx: StepperContextValue = {
    step,
    count,
    orientation: orientation ?? "horizontal",
    linear,
    isFirst: nearest(step, -1) < 0,
    isLast: nearest(step, 1) < 0,
    isValidating,
    isFinishing,
    isFinished,
    stateOf,
    isComplete,
    canGoTo,
    goTo,
    next,
    back,
    finish,
    direction,
    titleId: (i) => `${baseId}-title-${i}`,
    setMeta,
    takeFocus,
  }

  return (
    <StepperContext.Provider value={ctx}>
      <div data-slot="stepper" data-orientation={orientation} className={stepperVariants().root({ className })} {...props}>
        {children}
      </div>
    </StepperContext.Provider>
  )
}

/* ---------- List ---------- */

export interface StepperListProps {
  /** `<StepperItem>` elements, in order. */
  children: React.ReactNode
  /** Names the list of steps. */
  "aria-label"?: string
  className?: string
}

/**
 * The row (or column) of steps, as an ordered list. A horizontal list that doesn't fit its container
 * collapses to "Step n of N · Title" over a segmented progress bar.
 */
function StepperList({ children, "aria-label": ariaLabel = "Steps", className }: StepperListProps) {
  const ctx = useStepperContext("StepperList")
  const items = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<StepperItemProps>[]

  // Publish each step's optional/status flags to the root (it needs them for Next/Finish and reachability).
  const metaKey = JSON.stringify(items.map((el) => [!!el.props.optional, el.props.status ?? null]))
  const { setMeta } = ctx
  React.useLayoutEffect(() => {
    const parsed = JSON.parse(metaKey) as [boolean, StepperStatus | null][]
    setMeta(parsed.map(([optional, status]) => ({ optional, status: status ?? undefined })))
  }, [metaKey, setMeta])

  // Compact: measure the full row; when it overflows, remember its width and show the summary until it fits.
  const horizontal = ctx.orientation === "horizontal"
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLOListElement>(null)
  const needed = React.useRef(0)
  const [collapsed, setCollapsed] = React.useState(false)
  const compact = horizontal && collapsed

  React.useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !horizontal) return
    const check = () => {
      const list = listRef.current
      const available = wrap.clientWidth
      if (list) {
        if (list.offsetWidth > available + 1) {
          needed.current = list.offsetWidth
          setCollapsed(true)
        }
      } else if (available >= needed.current) setCollapsed(false)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(wrap)
    if (listRef.current) ro.observe(listRef.current)
    return () => ro.disconnect()
  }, [horizontal, collapsed, metaKey])

  const s = stepperVariants({ orientation: ctx.orientation })

  return (
    <div
      ref={wrapRef}
      data-slot="stepper-list"
      data-compact={compact || undefined}
      // Inline-size containment: the row's natural width can't stretch the container, so overflow is measurable.
      className={cn("min-w-0", horizontal && "[contain:inline-size]", className)}
    >
      {compact ? (
        <StepperSummary title={items[ctx.step]?.props.title} />
      ) : (
        <ol ref={listRef} aria-label={ariaLabel} className={s.list()}>
          {items.map((el, i) => (
            <StepperItemContext.Provider key={el.key ?? i} value={{ index: i, isLast: i === items.length - 1 }}>
              {el}
            </StepperItemContext.Provider>
          ))}
        </ol>
      )}
    </div>
  )
}

const SEGMENT: Record<Exclude<StepperStepState, "current">, string> = {
  complete: "bg-primary",
  upcoming: "bg-secondary-container",
  error: "bg-error",
  disabled: "bg-on-surface/10",
}
const segmentMotion = "transition-colors duration-(--md-spring-default-effects-duration) ease-default-effects"

/** Compact form: the kit's "steps" progress (4dp segments, 4dp gaps; the current one half filled) and the current step's title. */
function StepperSummary({ title }: { title: React.ReactNode }) {
  const ctx = useStepperContext("StepperList")
  const state = ctx.stateOf(ctx.step)
  return (
    <div data-slot="stepper-summary" className="flex flex-col gap-2">
      <div aria-hidden className="flex h-1 gap-1">
        {Array.from({ length: ctx.count }, (_, i) => {
          const s = ctx.stateOf(i)
          return s === "current" ? (
            <span key={i} className={cn("relative flex-1 overflow-hidden rounded-full", SEGMENT.upcoming, segmentMotion)}>
              <span className="absolute inset-y-0 start-0 w-1/2 rounded-full bg-primary" />
            </span>
          ) : (
            <span key={i} className={cn("flex-1 rounded-full", SEGMENT[s], segmentMotion)} />
          )
        })}
      </div>
      <p className="min-w-0 truncate text-label-lg text-on-surface-variant">
        Step {ctx.step + 1} of {ctx.count}
        {title != null && (
          <>
            {" · "}
            <span id={ctx.titleId(ctx.step)} className={state === "error" ? "text-error" : "text-on-surface"}>
              {title}
            </span>
          </>
        )}
      </p>
    </div>
  )
}

/* ---------- Item ---------- */

export interface StepperItemProps {
  /** Step name (title-small). */
  title: React.ReactNode
  /** Supporting line under the title. Shown in the error role when `status="error"`, so it can carry the message. */
  description?: React.ReactNode
  /** Marks the step optional: `true` shows "Optional", a node shows that text. A linear stepper can skip past it. */
  optional?: boolean | React.ReactNode
  /** Force a state: `complete` (check), `error` ("!" in the error role), `disabled` (skipped by Next/Back, not pressable). */
  status?: StepperStatus
  className?: string
}

const SR_STATUS: Partial<Record<StepperStepState, string>> = { complete: ", completed", error: ", has errors" }

/** One step. Only meaningful as a direct child of <StepperList>. */
function StepperItem({ title, description, optional, className }: StepperItemProps) {
  const ctx = useStepperContext("StepperItem")
  const { index, isLast } = React.useContext(StepperItemContext)
  const state = ctx.stateOf(index)
  const current = index === ctx.step
  const interactive = ctx.canGoTo(index)
  const s = stepperVariants({ orientation: ctx.orientation, state, current, interactive })
  const optionalLabel = optional === true ? "Optional" : optional || null

  const content = (
    <>
      <span data-slot="stepper-indicator" aria-hidden className={s.indicator()}>
        {state === "complete" ? (
          <Icon
            name="check"
            weight={600}
            className="animate-[m3-pop_var(--md-spring-fast-spatial-duration)_var(--md-spring-fast-spatial)] motion-reduce:animate-none"
          />
        ) : state === "error" ? (
          <Icon name="priority_high" weight={600} />
        ) : (
          index + 1
        )}
      </span>
      <span className={s.labels()}>
        <span id={ctx.titleId(index)} data-slot="stepper-title" className={s.title()}>
          {title}
        </span>
        {(optionalLabel || description) && (
          <span data-slot="stepper-description" className={s.description()}>
            {optionalLabel}
            {optionalLabel && description ? " · " : null}
            {description}
          </span>
        )}
        {SR_STATUS[state] && <span className="sr-only">{SR_STATUS[state]}</span>}
      </span>
    </>
  )

  return (
    <li
      data-slot="stepper-item"
      data-state={state}
      data-current={current || undefined}
      aria-current={current ? "step" : undefined}
      className={s.item({ className })}
    >
      {interactive ? (
        <AriaButton data-slot="stepper-trigger" className={s.trigger()} onPress={() => void ctx.goTo(index)}>
          {content}
          <Ripple />
        </AriaButton>
      ) : (
        <div data-slot="stepper-trigger" className={s.trigger()}>
          {content}
        </div>
      )}
      {!isLast && (
        <span data-slot="stepper-connector" aria-hidden className={s.connector()}>
          <span data-complete={(ctx.isComplete(index) && state !== "error") || undefined} className={s.connectorFill()} />
        </span>
      )}
    </li>
  )
}

/* ---------- Panel ---------- */

export interface StepperPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The step (zero-based) this content belongs to. */
  step: number
  /** Keep the panel mounted (hidden) while another step is current, so uncontrolled inputs keep their values. */
  keepMounted?: boolean
}

/** Content for one step. Only the current step's panel renders (or shows, with keepMounted). */
function StepperPanel({ step, keepMounted = false, className, style, children, ...props }: StepperPanelProps) {
  const ctx = useStepperContext("StepperPanel")
  const { direction: textDirection } = useLocale()
  const ref = React.useRef<HTMLDivElement>(null)
  const current = ctx.step === step
  const { takeFocus } = ctx

  // After the stepper moves, send focus to the new step's content and bring the stepper into view.
  React.useEffect(() => {
    if (!current || !takeFocus()) return
    const el = ref.current
    if (!el) return
    el.focus({ preventScroll: true })
    const root = el.closest<HTMLElement>('[data-slot="stepper"]')
    if (root && root.getBoundingClientRect().top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      root.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" })
    }
  }, [current, takeFocus])

  if (!current && !keepMounted) return null
  const dir = ctx.direction * (textDirection === "rtl" ? -1 : 1)
  return (
    <div
      ref={ref}
      data-slot="stepper-panel"
      role="group"
      aria-labelledby={ctx.titleId(step)}
      tabIndex={-1}
      hidden={!current}
      className={cn(
        "outline-none",
        ctx.direction !== 0 &&
          "animate-[m3-step-in_var(--md-spring-default-spatial-duration)_var(--md-spring-default-spatial)] motion-reduce:animate-none",
        className,
      )}
      style={{ "--step-dir": dir, ...style } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  )
}

/* ---------- Actions ---------- */

export interface StepperActionsProps {
  backLabel?: React.ReactNode
  nextLabel?: React.ReactNode
  /** Label of the last step's primary action, e.g. "Create" or "Update". */
  finishLabel?: React.ReactNode
  /** Runs after `validate` passes on the last step. A promise shows the pending state until it settles. */
  onFinish?: FinishHandler
  /** Pending state for Finish when you track saving yourself. */
  isPending?: boolean
  /** Extra actions, placed before Next / Finish. */
  children?: React.ReactNode
  className?: string
}

/** Back · Next, and Finish on the last step. Next and Finish run the stepper's `validate` gate first. */
function StepperActions({
  backLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
  onFinish,
  isPending = false,
  children,
  className,
}: StepperActionsProps) {
  const ctx = useStepperContext("StepperActions")
  return (
    <div data-slot="stepper-actions" className={cn("flex flex-wrap items-center gap-2", className)}>
      {!ctx.isFirst && (
        <Button variant="text" icon={<Icon name="arrow_back" className="rtl:-scale-x-100" />} onPress={() => void ctx.back()}>
          {backLabel}
        </Button>
      )}
      <span className="flex-1" />
      {children}
      {ctx.isLast ? (
        <Button
          icon={<Icon name="check" />}
          isPending={isPending || ctx.isFinishing || ctx.isValidating}
          onPress={() => void ctx.finish(onFinish)}
        >
          {finishLabel}
        </Button>
      ) : (
        <Button
          trailingIcon={<Icon name="arrow_forward" className="rtl:-scale-x-100" />}
          isPending={ctx.isValidating}
          onPress={() => void ctx.next()}
        >
          {nextLabel}
        </Button>
      )}
    </div>
  )
}

export { Stepper, StepperActions, StepperItem, StepperList, StepperPanel, stepperVariants, useStepper }
