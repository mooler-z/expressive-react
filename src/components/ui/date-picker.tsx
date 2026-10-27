"use client"

import * as React from "react"
import {
  DatePicker as AriaDatePicker,
  DateRangePicker as AriaDateRangePicker,
  Dialog as AriaDialog,
  Group,
  Popover as AriaPopover,
  useLocale,
  type DatePickerProps as AriaDatePickerProps,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
} from "react-aria-components"
import { getLocalTimeZone } from "@internationalized/date"

import { Button } from "@/components/ui/button"
import { Calendar, RangeCalendar } from "@/components/ui/calendar"
import { DateField, DateSegments, useHasEnteredSegments, type FieldChromeProps } from "@/components/ui/date-field"
import { Dialog, type DialogProps } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { FieldContainer, FieldSupportingText } from "@/components/ui/text-field"
import { cn } from "@/lib/utils"

/*
 * Date pickers · M3 (androidx DatePickerModalTokens / DatePickerDockedTokens)
 *   docked     text field (FieldContainer) + calendar popover · surface-container-high · 16dp corners · elevation 3
 *   modal      360dp · 28dp corners · surface-container-high · elevation 3
 *              header: supporting text label-large, headline headline-large (on-surface-variant), edit ⇄ calendar toggle
 *   input mode the date is typed into a DateField; invalid dates show the field error
 *
 * <DatePicker label="Date" />                                   // docked
 * <DateRangePicker label="Stay" />                              // docked range
 * <DialogTrigger><Button>Pick</Button><DatePickerDialog onChange={…} /></DialogTrigger>
 */

type FieldVariant = NonNullable<FieldChromeProps["variant"]>
type FieldDensity = NonNullable<FieldChromeProps["density"]>

/* ---------------------------------------------------------------- Docked pickers */

const dockedPopoverStyles = cn(
  "w-[360px] max-w-[calc(100vw-2rem)] origin-(--trigger-anchor-point) rounded-lg bg-surface-container-high pb-2 text-on-surface shadow-3 outline-none",
  "data-entering:m3-popover-enter data-exiting:m3-overlay-exit",
)

/** <Group> (the popover anchor) around the field shell, floating the label once segments hold input. */
function PickerField({
  label,
  variant,
  density,
  leading,
  children,
}: {
  label?: React.ReactNode
  variant: FieldVariant
  density: FieldDensity
  leading?: React.ReactNode
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const populated = useHasEnteredSegments(ref)
  return (
    <Group ref={ref} className="outline-none">
      <FieldContainer
        variant={variant}
        density={density}
        label={label}
        leading={leading}
        populated={populated}
        trailing={
          <IconButton aria-label="Choose date" className="data-pressed:rounded-[8px]">
            <Icon>calendar_today</Icon>
          </IconButton>
        }
      >
        {children}
      </FieldContainer>
    </Group>
  )
}

export interface DatePickerProps<T extends DateValue>
  extends Omit<AriaDatePickerProps<T>, "children" | "className">,
    FieldChromeProps {}

/** M3 docked date picker: a date text field whose trailing icon opens a calendar popover. */
function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  variant = "outlined",
  density = "md",
  leading,
  className,
  ...props
}: DatePickerProps<T>) {
  return (
    <AriaDatePicker data-slot="date-picker" {...props} className={cn("group/field flex w-full flex-col", className)}>
      <PickerField label={label} variant={variant} density={density} leading={leading}>
        <DateSegments />
      </PickerField>
      <FieldSupportingText description={description} errorMessage={errorMessage} />
      <AriaPopover placement="bottom start" offset={4} className={dockedPopoverStyles}>
        <AriaDialog aria-label="Calendar" className="outline-none">
          <Calendar className="max-w-none" />
        </AriaDialog>
      </AriaPopover>
    </AriaDatePicker>
  )
}

export interface DateRangePickerProps<T extends DateValue>
  extends Omit<AriaDateRangePickerProps<T>, "children" | "className">,
    FieldChromeProps {}

/** Docked date-range picker: start – end segments in one field, range calendar popover. */
function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  variant = "outlined",
  density = "md",
  leading,
  className,
  ...props
}: DateRangePickerProps<T>) {
  return (
    <AriaDateRangePicker data-slot="date-range-picker" {...props} className={cn("group/field flex w-full flex-col", className)}>
      <PickerField label={label} variant={variant} density={density} leading={leading}>
        <div className="flex min-w-0 items-center gap-2 in-data-has-label:opacity-0 in-data-has-label:field-float:opacity-100">
          <DateSegments slot="start" hideUntilFloat={false} />
          <span aria-hidden className="text-on-surface-variant">
            –
          </span>
          <DateSegments slot="end" hideUntilFloat={false} />
        </div>
      </PickerField>
      <FieldSupportingText description={description} errorMessage={errorMessage} />
      <AriaPopover placement="bottom start" offset={4} className={dockedPopoverStyles}>
        <AriaDialog aria-label="Calendar" className="outline-none">
          <RangeCalendar className="max-w-none" />
        </AriaDialog>
      </AriaPopover>
    </AriaDateRangePicker>
  )
}

/* ---------------------------------------------------------------- Modal pickers */

type DateRange = { start: DateValue; end: DateValue }

function useControllable<V>(value: V | undefined, defaultValue: V, onChange?: (v: V) => void) {
  const [inner, setInner] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : inner
  const set = React.useCallback(
    (v: V) => {
      if (!isControlled) setInner(v)
      onChange?.(v)
    },
    [isControlled, onChange],
  )
  return [current, set] as const
}

function useFormatter(options: Intl.DateTimeFormatOptions) {
  const { locale } = useLocale()
  return React.useMemo(() => new Intl.DateTimeFormat(locale, options), [locale, options])
}

const HEADLINE_FMT: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }
const RANGE_FMT: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }

interface ModalPickerBaseProps extends Omit<DialogProps, "children" | "className"> {
  /** Supporting text above the headline. */
  title?: string
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  confirmLabel?: string
  cancelLabel?: string
  /** Start in calendar or text-input mode. */
  defaultMode?: "calendar" | "input"
  className?: string
}

/** Header (title, headline, mode toggle) shared by the modal pickers. */
function ModalHeader({
  title,
  headline,
  mode,
  onModeChange,
}: {
  title: string
  headline: React.ReactNode
  mode: "calendar" | "input"
  onModeChange: (m: "calendar" | "input") => void
}) {
  return (
    <div data-slot="date-picker-header" className="pt-4 pr-3 pb-3 pl-6">
      <div className="text-label-lg text-on-surface-variant">{title}</div>
      <div className="mt-6 flex items-center gap-2">
        <div className="min-w-0 flex-1 truncate text-headline-lg text-on-surface-variant">{headline}</div>
        <IconButton
          aria-label={mode === "calendar" ? "Switch to text input" : "Switch to calendar"}
          onPress={() => onModeChange(mode === "calendar" ? "input" : "calendar")}
          className="size-12 rounded-full"
        >
          <Icon>{mode === "calendar" ? "edit" : "calendar_today"}</Icon>
        </IconButton>
      </div>
    </div>
  )
}

function ModalActions({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  isConfirmDisabled,
}: {
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  isConfirmDisabled?: boolean
}) {
  return (
    <div data-slot="date-picker-actions" className="flex justify-end gap-2 px-3 pt-2 pb-3">
      <Button variant="text" onPress={onCancel}>
        {cancelLabel}
      </Button>
      <Button variant="text" onPress={onConfirm} isDisabled={isConfirmDisabled}>
        {confirmLabel}
      </Button>
    </div>
  )
}

export interface DatePickerDialogProps extends ModalPickerBaseProps {
  value?: DateValue | null
  defaultValue?: DateValue | null
  /** Fires when the user confirms. */
  onChange?: (value: DateValue | null) => void
}

/**
 * M3 modal date picker. Place inside a <DialogTrigger> (or control `overlayProps.isOpen`).
 * The selection is a draft until OK.
 */
function DatePickerDialog({
  title = "Select date",
  value,
  defaultValue = null,
  onChange,
  minValue,
  maxValue,
  isDateUnavailable,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  defaultMode = "calendar",
  className,
  ...dialogProps
}: DatePickerDialogProps) {
  const [committed, setCommitted] = useControllable<DateValue | null>(value, defaultValue, onChange)
  return (
    <Dialog
      aria-label={title}
      {...dialogProps}
      modalClassName={cn("max-w-[360px] min-w-0", className)}
      className="p-0"
    >
      {({ close }) => (
        <DatePickerPanel
          autoFocus
          defaultValue={committed}
          title={title}
          minValue={minValue}
          maxValue={maxValue}
          isDateUnavailable={isDateUnavailable}
          defaultMode={defaultMode}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onCancel={close}
          onConfirm={(v) => {
            setCommitted(v)
            close()
          }}
        />
      )}
    </Dialog>
  )
}

export interface DatePickerPanelProps {
  /** Move focus into the calendar or field on mount (the dialogs do). */
  autoFocus?: boolean
  defaultValue?: DateValue | null
  title?: string
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  defaultMode?: "calendar" | "input"
  cancelLabel?: string
  confirmLabel?: string
  onCancel?: () => void
  onConfirm?: (v: DateValue | null) => void
}

/** The modal date picker's content (header, calendar or input, actions) without the dialog, for embedding. */
function DatePickerPanel({
  defaultValue = null,
  title = "Select date",
  minValue,
  maxValue,
  isDateUnavailable,
  defaultMode = "calendar",
  cancelLabel = "Cancel",
  confirmLabel = "OK",
  onCancel = () => {},
  onConfirm = () => {},
  autoFocus = false,
}: DatePickerPanelProps) {
  const [draft, setDraft] = React.useState<DateValue | null>(defaultValue)
  const [mode, setMode] = React.useState(defaultMode)
  const fmt = useFormatter(HEADLINE_FMT)
  const isInvalid =
    !!draft &&
    ((minValue && draft.compare(minValue) < 0) || (maxValue && draft.compare(maxValue) > 0) || isDateUnavailable?.(draft))
  const headline = draft ? fmt.format(draft.toDate(getLocalTimeZone())) : mode === "input" ? "Enter date" : "Selected date"

  return (
    <>
      <ModalHeader title={mode === "input" ? "Enter date" : title} headline={headline} mode={mode} onModeChange={setMode} />
      <hr className="border-0 border-t border-outline-variant" />
      {mode === "calendar" ? (
        <div className="px-3">
          <Calendar
            aria-label={title}
            value={draft}
            onChange={setDraft}
            minValue={minValue}
            maxValue={maxValue}
            isDateUnavailable={isDateUnavailable}
            autoFocus={autoFocus}
          />
        </div>
      ) : (
        <div className="px-6 pt-4 pb-2">
          <DateField
            label="Date"
            value={draft}
            onChange={setDraft}
            minValue={minValue}
            maxValue={maxValue}
            isDateUnavailable={isDateUnavailable}
            description="MM/DD/YYYY"
            errorMessage="Date is out of range"
            isInvalid={!!isInvalid}
            autoFocus={autoFocus}
          />
        </div>
      )}
      <ModalActions
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        onCancel={onCancel}
        onConfirm={() => onConfirm(draft)}
        isConfirmDisabled={!!isInvalid}
      />
    </>
  )
}

export interface DateRangePickerDialogProps extends ModalPickerBaseProps {
  value?: DateRange | null
  defaultValue?: DateRange | null
  onChange?: (value: DateRange | null) => void
}

/** M3 modal date-range picker. Draft until Save. */
function DateRangePickerDialog({
  title = "Select dates",
  value,
  defaultValue = null,
  onChange,
  minValue,
  maxValue,
  isDateUnavailable,
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  defaultMode = "calendar",
  className,
  ...dialogProps
}: DateRangePickerDialogProps) {
  const [committed, setCommitted] = useControllable<DateRange | null>(value, defaultValue, onChange)
  return (
    <Dialog
      aria-label={title}
      {...dialogProps}
      modalClassName={cn("max-w-[360px] min-w-0", className)}
      className="p-0"
    >
      {({ close }) => (
        <DateRangePickerPanel
          autoFocus
          defaultValue={committed}
          title={title}
          minValue={minValue}
          maxValue={maxValue}
          isDateUnavailable={isDateUnavailable}
          defaultMode={defaultMode}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onCancel={close}
          onConfirm={(v) => {
            setCommitted(v)
            close()
          }}
        />
      )}
    </Dialog>
  )
}

export interface DateRangePickerPanelProps {
  /** Move focus into the calendar or field on mount (the dialogs do). */
  autoFocus?: boolean
  defaultValue?: DateRange | null
  title?: string
  minValue?: DateValue
  maxValue?: DateValue
  isDateUnavailable?: (date: DateValue) => boolean
  defaultMode?: "calendar" | "input"
  cancelLabel?: string
  confirmLabel?: string
  onCancel?: () => void
  onConfirm?: (v: DateRange | null) => void
}

/** The modal range picker's content without the dialog, for embedding. */
function DateRangePickerPanel({
  defaultValue = null,
  title = "Select dates",
  minValue,
  maxValue,
  isDateUnavailable,
  defaultMode = "calendar",
  cancelLabel = "Cancel",
  confirmLabel = "Save",
  onCancel = () => {},
  onConfirm = () => {},
  autoFocus = false,
}: DateRangePickerPanelProps) {
  const [draft, setDraft] = React.useState<DateRange | null>(defaultValue)
  const [start, setStart] = React.useState<DateValue | null>(defaultValue?.start ?? null)
  const [end, setEnd] = React.useState<DateValue | null>(defaultValue?.end ?? null)
  const [mode, setMode] = React.useState(defaultMode)
  const fmt = useFormatter(RANGE_FMT)
  const tz = getLocalTimeZone()

  const range = mode === "input" ? (start && end ? { start, end } : null) : draft
  const isInvalid = mode === "input" && !!start && !!end && end.compare(start) < 0
  const headline = range
    ? fmt.formatRange(range.start.toDate(tz), range.end.toDate(tz))
    : mode === "input"
      ? "Enter dates"
      : "Start date – End date"

  return (
    <>
      <ModalHeader title={title} headline={<span className="text-headline-sm">{headline}</span>} mode={mode} onModeChange={setMode} />
      <hr className="border-0 border-t border-outline-variant" />
      {mode === "calendar" ? (
        <div className="px-3">
          <RangeCalendar
            aria-label={title}
            value={draft}
            onChange={(r) => {
              setDraft(r)
              setStart(r?.start ?? null)
              setEnd(r?.end ?? null)
            }}
            minValue={minValue}
            maxValue={maxValue}
            isDateUnavailable={isDateUnavailable}
            autoFocus={autoFocus}
          />
        </div>
      ) : (
        <div className="flex gap-3 px-6 pt-4 pb-2">
          <DateField label="Start date" value={start} onChange={setStart} minValue={minValue} maxValue={maxValue} autoFocus={autoFocus} />
          <DateField
            label="End date"
            value={end}
            onChange={setEnd}
            minValue={minValue}
            maxValue={maxValue}
            isInvalid={isInvalid}
            errorMessage="Ends before start"
          />
        </div>
      )}
      <ModalActions
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        onCancel={onCancel}
        onConfirm={() => onConfirm(range)}
        isConfirmDisabled={isInvalid || (mode === "input" && !range)}
      />
    </>
  )
}

export { DatePicker, DatePickerDialog, DatePickerPanel, DateRangePicker, DateRangePickerDialog, DateRangePickerPanel }
export type { DateRange }
