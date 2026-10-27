"use client"

import * as React from "react"
import { Time } from "@internationalized/date"

import { Button } from "@/components/ui/button"
import { Dialog, type DialogProps } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/utils"

/*
 * Time pickers · M3 (androidx TimePickerTokens / TimeInputTokens)
 *   dial            256dp surface-container-highest circle · labels body-large · outer ring r 101 · inner (24h) r 69
 *   selector        48dp primary handle on a 2dp primary track from an 8dp center dot · selected label on-primary
 *   time selectors  96×80 (24h vertical 114×80) · CornerSmall · display-large
 *                   unselected surface-container-highest / on-surface · selected primary-container / on-primary-container
 *   period          vertical 52×80 · horizontal 216×38 · 1dp outline · CornerSmall · selected tertiary-container
 *   motion          hand rotates on the FastSpatial spring; follows the pointer 1:1 while dragging
 *   input mode      96×72 text inputs (display-medium) with "Hour" / "Minute" captions
 *
 * <TimePicker defaultValue={new Time(9, 41)} />
 * <DialogTrigger><Button>Set alarm</Button><TimePickerDialog onChange={setTime} /></DialogTrigger>
 */

type Unit = "hour" | "minute"
type Mode = "dial" | "input"

const DIAL = 256
const OUTER_R = 101
const INNER_R = 69
const HANDLE = 48

const pad = (n: number) => String(n).padStart(2, "0")

function useControllableTime(value: Time | null | undefined, defaultValue: Time | null | undefined, onChange?: (t: Time) => void) {
  const [inner, setInner] = React.useState<Time>(defaultValue ?? new Time(12, 0))
  const isControlled = value !== undefined
  const current = isControlled ? (value ?? new Time(12, 0)) : inner
  const set = (t: Time) => {
    if (!isControlled) setInner(t)
    onChange?.(t)
  }
  return [current, set] as const
}

/* ---------------------------------------------------------------- Dial */

interface DialProps {
  unit: Unit
  value: Time
  hourCycle: 12 | 24
  onChange: (t: Time) => void
  /** Pointer released after picking an hour (M3 then switches to minutes). */
  onHourPicked?: () => void
}

function dialLabels(unit: Unit, hourCycle: 12 | 24) {
  if (unit === "minute") return { outer: Array.from({ length: 12 }, (_, i) => i * 5), inner: [] as number[] }
  const outer = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  return { outer, inner: hourCycle === 24 ? [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] : [] }
}

/** Value currently shown on the dial (12h hours shown as 1–12). */
function dialValue(unit: Unit, t: Time, hourCycle: 12 | 24) {
  if (unit === "minute") return t.minute
  if (hourCycle === 24) return t.hour
  return t.hour % 12 || 12
}

function ClockDial({ unit, value, hourCycle, onChange, onHourPicked }: DialProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const { outer, inner } = dialLabels(unit, hourCycle)
  const current = dialValue(unit, value, hourCycle)
  const onInner = unit === "hour" && hourCycle === 24 && (value.hour === 0 || value.hour > 12)
  const steps = unit === "minute" ? 60 : 12
  const targetAngle = ((unit === "minute" ? current : current % 12) * 360) / steps

  // Keep a continuous angle so 330° → 0° animates forward instead of spinning back.
  const angleRef = React.useRef(targetAngle)
  const delta = ((((targetAngle - angleRef.current) % 360) + 540) % 360) - 180
  const angle = angleRef.current + delta
  angleRef.current = angle

  const commit = (clientX: number, clientY: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = clientX - (r.left + r.width / 2)
    const y = clientY - (r.top + r.height / 2)
    const deg = (Math.atan2(x, -y) * 180) / Math.PI
    const turn = (deg + 360) % 360
    const scale = r.width / DIAL
    if (unit === "minute") {
      const m = Math.round(turn / 6) % 60
      if (m !== value.minute) onChange(value.set({ minute: m }))
      return
    }
    const slot = Math.round(turn / 30) % 12 // 0 = top
    let h: number
    if (hourCycle === 24) {
      const dist = Math.hypot(x, y) / scale
      const innerRing = dist < (OUTER_R + INNER_R) / 2
      h = innerRing ? (slot === 0 ? 0 : slot + 12) : slot === 0 ? 12 : slot
    } else {
      const h12 = slot === 0 ? 12 : slot
      h = (h12 % 12) + (value.hour >= 12 ? 12 : 0)
    }
    if (h !== value.hour) onChange(value.set({ hour: h }))
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const big = unit === "minute" ? 5 : 1
    let d = 0
    if (e.key === "ArrowUp" || e.key === "ArrowRight") d = 1
    else if (e.key === "ArrowDown" || e.key === "ArrowLeft") d = -1
    else if (e.key === "PageUp") d = big * 5
    else if (e.key === "PageDown") d = -big * 5
    else return
    e.preventDefault()
    if (unit === "minute") onChange(value.set({ minute: (value.minute + d + 60) % 60 }))
    else if (hourCycle === 24) onChange(value.set({ hour: (value.hour + d + 24) % 24 }))
    else {
      const h12 = (((value.hour % 12) + d + 12) % 12) + (value.hour >= 12 ? 12 : 0)
      onChange(value.set({ hour: h12 }))
    }
  }

  const radius = onInner ? INNER_R : OUTER_R
  const onLabel = (n: number) => n === current && (unit === "hour" || current % 5 === 0)
  const showDot = unit === "minute" && current % 5 !== 0

  const label = (n: number, r: number, i: number) => {
    const a = (i * 30 * Math.PI) / 180
    const selected = n === current && (unit === "minute" || (hourCycle === 24 ? (r === INNER_R) === onInner : true))
    return (
      <span
        key={`${r}-${n}`}
        aria-hidden
        className={cn(
          "pointer-events-none absolute grid size-12 -translate-1/2 place-items-center text-body-lg transition-colors duration-(--md-spring-fast-effects-duration)",
          r === INNER_R && "text-body-md",
          selected && onLabel(n) ? "text-on-primary" : "text-on-surface",
        )}
        style={{ left: DIAL / 2 + r * Math.sin(a), top: DIAL / 2 - r * Math.cos(a) }}
      >
        {unit === "minute" ? pad(n) : hourCycle === 24 && n === 0 ? "00" : n}
      </span>
    )
  }

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={unit === "hour" ? "Hour" : "Minute"}
      aria-valuemin={unit === "minute" ? 0 : hourCycle === 24 ? 0 : 1}
      aria-valuemax={unit === "minute" ? 59 : hourCycle === 24 ? 23 : 12}
      aria-valuenow={unit === "minute" ? value.minute : hourCycle === 24 ? value.hour : current}
      aria-valuetext={unit === "minute" ? `${value.minute} minutes` : `${current} o'clock`}
      data-slot="time-picker-dial"
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        e.currentTarget.setPointerCapture(e.pointerId)
        setDragging(true)
        commit(e.clientX, e.clientY)
      }}
      onPointerMove={(e) => dragging && commit(e.clientX, e.clientY)}
      onPointerUp={() => {
        setDragging(false)
        if (unit === "hour") onHourPicked?.()
      }}
      onPointerCancel={() => setDragging(false)}
      className="focus-ring relative shrink-0 cursor-pointer touch-none rounded-full bg-surface-container-highest select-none"
      style={{ width: DIAL, height: DIAL }}
    >
      {/* Hand: center dot, 2dp track, 48dp handle. Rotates as one piece. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          !dragging && "transition-transform duration-(--md-spring-fast-spatial-duration) ease-fast-spatial",
        )}
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full bg-primary" />
        <span
          className="absolute left-1/2 w-0.5 -translate-x-1/2 bg-primary transition-[height,top] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial"
          style={{ top: DIAL / 2 - radius + HANDLE / 2, height: radius - HANDLE / 2 }}
        />
        <span
          className="absolute left-1/2 grid -translate-x-1/2 place-items-center rounded-full bg-primary transition-[top] duration-(--md-spring-fast-spatial-duration) ease-fast-spatial"
          style={{ top: DIAL / 2 - radius - HANDLE / 2, width: HANDLE, height: HANDLE }}
        >
          {showDot && <span className="size-1 rounded-full bg-on-primary" />}
        </span>
      </div>
      {outer.map((n, i) => label(n, OUTER_R, i))}
      {inner.map((n, i) => label(n, INNER_R, i))}
    </div>
  )
}

/* ---------------------------------------------------------------- Selectors */

function TimeSelector({
  children,
  isSelected,
  onPress,
  wide,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode
  isSelected: boolean
  onPress: () => void
  wide?: boolean
  "aria-label": string
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={ariaLabel}
      onClick={onPress}
      className={cn(
        "state-layer focus-ring grid h-20 shrink-0 cursor-pointer place-items-center rounded-sm text-display-lg tabular-nums",
        wide ? "w-[114px]" : "w-24",
        isSelected ? "bg-primary-container text-on-primary-container" : "bg-surface-container-highest text-on-surface",
      )}
    >
      {children}
    </button>
  )
}

export interface PeriodSelectorProps {
  isPM: boolean
  onChange: (isPM: boolean) => void
  orientation?: "vertical" | "horizontal"
  /** Height override for input mode (72dp). */
  className?: string
}

/** AM/PM segmented selector. Vertical 52×80 or horizontal 216×38. */
function PeriodSelector({ isPM, onChange, orientation = "vertical", className }: PeriodSelectorProps) {
  const vertical = orientation === "vertical"
  const item = (pm: boolean, label: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={isPM === pm}
      onClick={() => onChange(pm)}
      className={cn(
        "state-layer focus-ring grid flex-1 cursor-pointer place-items-center text-title-md",
        isPM === pm ? "bg-tertiary-container text-on-tertiary-container" : "text-on-surface-variant",
      )}
    >
      {label}
    </button>
  )
  return (
    <div
      role="radiogroup"
      aria-label="Period"
      data-slot="time-picker-period"
      className={cn(
        "flex shrink-0 overflow-hidden rounded-sm border border-outline",
        vertical ? "h-20 w-[52px] flex-col divide-y divide-outline" : "h-[38px] w-[216px] divide-x divide-outline",
        className,
      )}
    >
      {item(false, "AM")}
      {item(true, "PM")}
    </div>
  )
}

/* ---------------------------------------------------------------- Input mode */

function TimeInputBox({
  label,
  value,
  min,
  max,
  onCommit,
  onInvalid,
  autoFocus,
}: {
  label: string
  value: number
  min: number
  max: number
  onCommit: (n: number) => void
  onInvalid: (invalid: boolean) => void
  autoFocus?: boolean
}) {
  const [text, setText] = React.useState(pad(value))
  const [invalid, setInvalid] = React.useState(false)
  React.useEffect(() => setText(pad(value)), [value])
  return (
    <label className="flex flex-col gap-2">
      <input
        inputMode="numeric"
        maxLength={2}
        autoFocus={autoFocus}
        aria-label={label}
        aria-invalid={invalid || undefined}
        value={text}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const t = e.target.value.replace(/\D/g, "").slice(0, 2)
          setText(t)
          const n = Number(t)
          const bad = t === "" || n < min || n > max
          setInvalid(bad)
          onInvalid(bad)
          if (!bad) onCommit(n)
        }}
        onBlur={() => !invalid && setText(pad(value))}
        className={cn(
          "h-[72px] w-24 rounded-sm bg-surface-container-highest text-center text-display-md text-on-surface tabular-nums outline-none",
          "focus:bg-primary-container focus:text-on-primary-container focus:outline-2 focus:outline-primary",
          "aria-invalid:bg-error-container aria-invalid:text-on-error-container aria-invalid:outline-2 aria-invalid:outline-error",
        )}
      />
      <span className="text-body-sm text-on-surface-variant">{label}</span>
    </label>
  )
}

/* ---------------------------------------------------------------- TimePicker */

export interface TimePickerProps {
  value?: Time | null
  defaultValue?: Time | null
  onChange?: (value: Time) => void
  hourCycle?: 12 | 24
  /** vertical (portrait) or horizontal (landscape) layout. */
  orientation?: "vertical" | "horizontal"
  mode?: Mode
  defaultMode?: Mode
  onModeChange?: (mode: Mode) => void
  /** Headline; defaults to "Select time" / "Enter time". */
  title?: string
  /** Rendered at the end of the bottom row (e.g. Cancel / OK). */
  actions?: React.ReactNode
  /** Show the keyboard ⇄ clock toggle. */
  showModeToggle?: boolean
  className?: string
}

/** M3 time picker content (dial or input mode). Wrap in a surface, or use <TimePickerDialog>. */
function TimePicker({
  value: valueProp,
  defaultValue,
  onChange,
  hourCycle = 12,
  orientation = "vertical",
  mode: modeProp,
  defaultMode = "dial",
  onModeChange,
  title,
  actions,
  showModeToggle = true,
  className,
}: TimePickerProps) {
  const [value, setValue] = useControllableTime(valueProp, defaultValue, onChange)
  const [modeInner, setModeInner] = React.useState<Mode>(defaultMode)
  const mode = modeProp ?? modeInner
  const setMode = (m: Mode) => {
    setModeInner(m)
    onModeChange?.(m)
  }
  const [unit, setUnit] = React.useState<Unit>("hour")
  const [hourInvalid, setHourInvalid] = React.useState(false)
  const [minuteInvalid, setMinuteInvalid] = React.useState(false)
  const is12 = hourCycle === 12
  const isPM = value.hour >= 12
  const displayHour = is12 ? value.hour % 12 || 12 : value.hour
  const horizontal = orientation === "horizontal" && mode === "dial"
  const setPM = (pm: boolean) => setValue(value.set({ hour: (value.hour % 12) + (pm ? 12 : 0) }))

  const selectors =
    mode === "dial" ? (
      <div className="flex items-center">
        <TimeSelector aria-label={`Hour, ${displayHour}`} isSelected={unit === "hour"} onPress={() => setUnit("hour")} wide={!is12 && !horizontal}>
          {pad(displayHour)}
        </TimeSelector>
        <span aria-hidden className="grid w-6 place-items-center text-display-lg text-on-surface">
          :
        </span>
        <TimeSelector aria-label={`Minute, ${value.minute}`} isSelected={unit === "minute"} onPress={() => setUnit("minute")} wide={!is12 && !horizontal}>
          {pad(value.minute)}
        </TimeSelector>
        {is12 && !horizontal && <PeriodSelector className="ml-3" isPM={isPM} onChange={setPM} />}
      </div>
    ) : (
      <div className="flex items-start">
        <TimeInputBox
          label="Hour"
          value={displayHour}
          min={is12 ? 1 : 0}
          max={is12 ? 12 : 23}
          autoFocus
          onInvalid={setHourInvalid}
          onCommit={(n) => setValue(value.set({ hour: is12 ? (n % 12) + (isPM ? 12 : 0) : n }))}
        />
        <span aria-hidden className="grid h-[72px] w-6 place-items-center text-display-md text-on-surface">
          :
        </span>
        <TimeInputBox label="Minute" value={value.minute} min={0} max={59} onInvalid={setMinuteInvalid} onCommit={(n) => setValue(value.set({ minute: n }))} />
        {is12 && <PeriodSelector className="ml-3 h-[72px]" isPM={isPM} onChange={setPM} />}
      </div>
    )

  const error = hourInvalid
    ? is12
      ? "Enter an hour from 1 to 12"
      : "Enter an hour from 0 to 23"
    : minuteInvalid
      ? "Enter a minute from 0 to 59"
      : null

  return (
    <div data-slot="time-picker" className={cn("flex flex-col px-6 pt-6 pb-2 text-on-surface", className)}>
      <div className={cn(horizontal ? "flex items-start gap-13" : "flex flex-col")}>
        <div className="flex flex-col">
          <div className="pb-5 text-label-md text-on-surface-variant">{title ?? (mode === "dial" ? "Select time" : "Enter time")}</div>
          {selectors}
          {horizontal && is12 && <PeriodSelector className="mt-3" orientation="horizontal" isPM={isPM} onChange={setPM} />}
          {mode === "input" && (
            <div role="alert" className="min-h-5 pt-1 text-body-sm text-error">
              {error && (
                <span className="inline-flex items-center gap-1">
                  <Icon size={16} filled>
                    error
                  </Icon>
                  {error}
                </span>
              )}
            </div>
          )}
        </div>
        {mode === "dial" && (
          <div className={cn("flex justify-center", !horizontal && "pt-9")}>
            <ClockDial
              unit={unit}
              value={value}
              hourCycle={hourCycle}
              onChange={setValue}
              onHourPicked={() => setUnit("minute")}
            />
          </div>
        )}
      </div>
      <div className={cn("flex items-center gap-2", mode === "dial" ? "pt-6" : "pt-4")}>
        {showModeToggle && (
          <IconButton
            aria-label={mode === "dial" ? "Switch to text input" : "Switch to clock"}
            onPress={() => setMode(mode === "dial" ? "input" : "dial")}
            className="-ml-3 size-12 rounded-full"
          >
            <Icon>{mode === "dial" ? "keyboard" : "schedule"}</Icon>
          </IconButton>
        )}
        <div className="ml-auto flex gap-2 empty:hidden">{actions}</div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Dialog */

export interface TimePickerDialogProps
  extends Omit<DialogProps, "children" | "className" | "onChange">,
    Pick<TimePickerProps, "hourCycle" | "orientation" | "defaultMode" | "title"> {
  value?: Time | null
  defaultValue?: Time | null
  /** Fires on OK. */
  onChange?: (value: Time) => void
  confirmLabel?: string
  cancelLabel?: string
  className?: string
}

/** M3 time picker dialog (28dp corners, surface-container-high). Draft until OK. Place inside a <DialogTrigger>. */
function TimePickerDialog({
  value,
  defaultValue,
  onChange,
  hourCycle,
  orientation,
  defaultMode,
  title,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  className,
  ...dialogProps
}: TimePickerDialogProps) {
  const [committed, setCommitted] = useControllableTime(value, defaultValue, onChange)
  return (
    <Dialog
      aria-label={title ?? "Select time"}
      {...dialogProps}
      modalClassName={cn("w-auto max-w-[calc(100vw-2rem)] min-w-0", className)}
      className="p-0"
    >
      {({ close }) => (
        <TimePickerDialogBody
          initial={committed}
          hourCycle={hourCycle}
          orientation={orientation}
          defaultMode={defaultMode}
          title={title}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onCancel={close}
          onConfirm={(t) => {
            setCommitted(t)
            close()
          }}
        />
      )}
    </Dialog>
  )
}

function TimePickerDialogBody({
  initial,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  ...props
}: Pick<TimePickerProps, "hourCycle" | "orientation" | "defaultMode" | "title"> & {
  initial: Time
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: (t: Time) => void
}) {
  const [draft, setDraft] = React.useState(initial)
  return (
    <TimePicker
      {...props}
      value={draft}
      onChange={setDraft}
      actions={
        <>
          <Button variant="text" onPress={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="text" onPress={() => onConfirm(draft)}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  )
}

export { ClockDial, PeriodSelector, Time, TimePicker, TimePickerDialog }
