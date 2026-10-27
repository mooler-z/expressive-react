import * as React from "react"
import { getLocalTimeZone, startOfWeek, today, type CalendarDate } from "@internationalized/date"
import { DialogTrigger } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  DatePicker,
  DatePickerDialog,
  DatePickerPanel,
  DateRangePicker,
  DateRangePickerDialog,
  DateRangePickerPanel,
} from "@/components/ui/date-picker"
import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { snackbar } from "@/components/ui/snackbar"
import { Row, Section, Variant, Variants } from "@/docs/section"
import { cn } from "@/lib/utils"

const TZ = getLocalTimeZone()
const TODAY = today(TZ)
const fmt = (d: { toDate: (tz: string) => Date }) =>
  d.toDate(TZ).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })

const surface = "w-full max-w-[360px] rounded-xl bg-surface-container-high shadow-3"

function WeekStrip() {
  const [week, setWeek] = React.useState(startOfWeek(TODAY, "en-GB"))
  const [selected, setSelected] = React.useState<CalendarDate>(TODAY)
  const days = Array.from({ length: 7 }, (_, i) => week.add({ days: i }))
  const range = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).formatRange(days[0].toDate(TZ), days[6].toDate(TZ))
  return (
    <div className="w-full rounded-xl bg-surface-container-high p-3">
      <div className="flex items-center pb-2 pl-2">
        <span className="flex-1 text-title-sm">{range}</span>
        <IconButton aria-label="Previous week" onPress={() => setWeek(week.subtract({ weeks: 1 }))}>
          <Icon>chevron_left</Icon>
        </IconButton>
        <IconButton aria-label="Next week" onPress={() => setWeek(week.add({ weeks: 1 }))}>
          <Icon>chevron_right</Icon>
        </IconButton>
      </div>
      <div role="radiogroup" aria-label="Day" className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const isSel = d.compare(selected) === 0
          return (
            <button
              key={d.toString()}
              type="button"
              role="radio"
              aria-checked={isSel}
              onClick={() => setSelected(d)}
              className={cn(
                "state-layer shape-morph focus-ring flex cursor-pointer flex-col items-center gap-1 rounded-lg py-2",
                isSel ? "rounded-full bg-primary text-on-primary" : "text-on-surface",
              )}
            >
              <span className={cn("text-label-sm", !isSel && "text-on-surface-variant")}>
                {d.toDate(TZ).toLocaleDateString(undefined, { weekday: "short" })}
              </span>
              <span className={cn("text-title-md", !isSel && d.compare(TODAY) === 0 && "text-primary")}>{d.day}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function DatePickersSection() {
  const [picked, setPicked] = React.useState<string | null>(null)
  return (
    <Section
      id="date-pickers"
      description="Modal date picker (360dp, 28dp corners): headline date, month/year selector, 7×6 grid with 40dp day cells. Selected day primary, today outlined. Plus the docked text-field variant."
      spec="https://m3.material.io/components/date-pickers/overview"
    >
      <div className="flex flex-wrap items-start gap-8">
        <div className={surface}>
          <DatePickerPanel
            defaultValue={TODAY.add({ days: 2 })}
            onCancel={() => snackbar("Cancelled")}
            onConfirm={(v) => snackbar(v ? `Date selected · ${fmt(v)}` : "No date")}
          />
        </div>
        <div className="w-full max-w-xs space-y-6">
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Docked · input</div>
          <DatePicker label="Date" description="MM/DD/YYYY" defaultValue={TODAY.add({ days: 2 })} />
          <DateRangePicker label="Stay" description="Check-in – check-out" />
          <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Modal · dialog</div>
          <div className="flex flex-wrap gap-2">
            <DialogTrigger>
              <Button variant="tonal">
                <Icon>event</Icon>
                Pick a date
              </Button>
              <DatePickerDialog onChange={(v) => setPicked(v ? fmt(v) : null)} />
            </DialogTrigger>
            <DialogTrigger>
              <Button variant="outlined">
                <Icon>date_range</Icon>
                Pick a range
              </Button>
              <DateRangePickerDialog onChange={(r) => setPicked(r ? `${fmt(r.start)} – ${fmt(r.end)}` : null)} />
            </DialogTrigger>
          </div>
          <p className="text-body-md text-on-surface-variant" aria-live="polite">
            {picked ? `Picked: ${picked}` : "Nothing picked yet"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-title-md">4 variants</div>
          <div className="text-body-sm text-on-surface-variant">Range · modal · year selection · input · error · week strip</div>
        </div>
        <Variants cols="md:grid-cols-2">
          <Variant n={1} label="Range · modal" className="flex min-h-24 items-start justify-center rounded-lg bg-surface-container p-4">
            <div className={surface}>
              <DateRangePickerPanel
                defaultValue={{ start: TODAY.subtract({ days: 2 }), end: TODAY.add({ days: 2 }) }}
                onConfirm={(r) => snackbar(r ? `${fmt(r.start)} – ${fmt(r.end)}` : "No range")}
                onCancel={() => snackbar("Cancelled")}
              />
            </div>
          </Variant>
          <Variant n={2} label="Year selection" className="flex min-h-24 items-start justify-center rounded-lg bg-surface-container p-4">
            <div className={cn(surface, "px-3 py-2")}>
              <Calendar aria-label="Year" defaultValue={TODAY.add({ years: 2 })} defaultView="year" />
            </div>
          </Variant>
          <Variant n={3} label="Input · error" className="flex min-h-24 items-start justify-center rounded-lg bg-surface-container p-4">
            <div className={surface}>
              <DatePickerPanel
                defaultMode="input"
                title="Start date"
                defaultValue={TODAY.subtract({ days: 5 })}
                minValue={TODAY}
                onConfirm={(v) => snackbar(v ? fmt(v) : "No date")}
              />
            </div>
          </Variant>
          <Variant n={4} label="Week strip" className="flex min-h-24 items-start justify-center rounded-lg bg-surface-container p-4">
            <WeekStrip />
          </Variant>
        </Variants>
      </div>
      <Row label="Disabled · unavailable weekends">
        <div className="w-full max-w-xs">
          <DatePicker label="Disabled" isDisabled defaultValue={TODAY} />
        </div>
        <div className="w-full max-w-xs">
          <DatePicker
            label="Weekday only"
            description="Weekends are unavailable"
            isDateUnavailable={(d) => d.toDate(TZ).getDay() % 6 === 0}
          />
        </div>
      </Row>
    </Section>
  )
}
