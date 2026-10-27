import * as React from "react"
import { DialogTrigger, type Key } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ChipGroup, FilterChip } from "@/components/ui/chip"
import { TimeField } from "@/components/ui/date-field"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { Time, TimePicker, TimePickerDialog } from "@/components/ui/time-picker"
import { Row, Section, Variant, Variants } from "@/docs/section"

const surface = "rounded-xl bg-surface-container-high shadow-3"
const fmt = (t: Time) => `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`

function Actions({ onOk }: { onOk: () => void }) {
  return (
    <>
      <Button variant="text" onPress={() => snackbar("Cancelled")}>
        Cancel
      </Button>
      <Button variant="text" onPress={onOk}>
        OK
      </Button>
    </>
  )
}

function DialPicker() {
  const [t, setT] = React.useState(new Time(9, 41))
  return (
    <div className={surface}>
      <TimePicker value={t} onChange={setT} actions={<Actions onOk={() => snackbar(`Time set · ${fmt(t)}`)} />} />
    </div>
  )
}

function InputPicker() {
  const [t, setT] = React.useState(new Time(15, 30))
  return (
    <div className={surface}>
      <TimePicker value={t} onChange={setT} defaultMode="input" actions={<Actions onOk={() => snackbar(`Time set · ${fmt(t)}`)} />} />
    </div>
  )
}

const SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "15:00", "15:30", "16:00"]
const TAKEN = new Set(["09:30", "13:00", "15:00"])

function BookingSlots() {
  const [slot, setSlot] = React.useState<Set<Key>>(new Set(["11:00"]))
  const value = [...slot][0] as string | undefined
  return (
    <div className="w-full rounded-xl bg-surface-container-high p-4">
      <div className="flex items-baseline justify-between pb-3">
        <span className="text-title-md">Thu · 30 min</span>
        <span className="text-label-md text-on-surface-variant">CET</span>
      </div>
      <ChipGroup
        aria-label="Available slots"
        selectionMode="single"
        selectedKeys={slot}
        onSelectionChange={setSlot}
        className="grid grid-cols-3 gap-2 sm:grid-cols-4"
      >
        {SLOTS.map((s) => (
          <FilterChip key={s} id={s} isDisabled={TAKEN.has(s)} className="justify-center tabular-nums">
            {s}
          </FilterChip>
        ))}
      </ChipGroup>
      <div className="flex items-center justify-between pt-4">
        <span className="text-body-sm text-on-surface-variant">{TAKEN.size} slots taken</span>
        <Button isDisabled={!value} onPress={() => snackbar(`Booked ${value}`)}>
          Book {value}
        </Button>
      </div>
    </div>
  )
}

export default function TimePickersSection() {
  const [alarm, setAlarm] = React.useState<Time | null>(null)
  return (
    <Section
      id="time-pickers"
      description="Dial picker with a 256dp clock face and 96dp hour/minute selectors on surface-container-highest; the selected field is primary-container. Drag the hand, or use ↑ ↓ on the dial. Compact input variant alongside."
      spec="https://m3.material.io/components/time-pickers/overview"
    >
      <div className="flex flex-wrap items-start gap-8">
        <DialPicker />
        <div className="flex flex-col gap-6">
          <InputPicker />
          <div className="space-y-3">
            <div className="text-label-md tracking-wider text-on-surface-variant uppercase">Dialog · field</div>
            <div className="flex flex-wrap items-center gap-3">
              <DialogTrigger>
                <Button variant="tonal">
                  <Icon>alarm</Icon>
                  {alarm ? `Alarm ${fmt(alarm)}` : "Set alarm"}
                </Button>
                <TimePickerDialog value={alarm} onChange={setAlarm} />
              </DialogTrigger>
            </div>
            <div className="w-full max-w-xs">
              <TimeField label="Start time" defaultValue={new Time(14, 0)} description="hh:mm AM/PM" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-title-md">4 variants</div>
          <div className="text-body-sm text-on-surface-variant">Dial · landscape · 24-hour · two rings · input · error · booking slots</div>
        </div>
        <Variants cols="">
          <Variant n={1} label="Dial · landscape" className="flex min-h-24 items-start justify-center-safe overflow-x-auto rounded-lg bg-surface-container p-4">
            <div className={surface}>
              <TimePicker orientation="horizontal" defaultValue={new Time(4, 15)} actions={<Actions onOk={() => snackbar("Time set")} />} />
            </div>
          </Variant>
        </Variants>
        <Variants cols="md:grid-cols-2 xl:grid-cols-3">
          <Variant n={2} label="24-hour · two rings" className="flex min-h-24 items-start justify-center rounded-lg bg-surface-container p-4">
            <div className={surface}>
              <TimePicker hourCycle={24} title="Select time · 24h" defaultValue={new Time(14, 30)} actions={<Actions onOk={() => snackbar("Time set")} />} />
            </div>
          </Variant>
          <Variant n={3} label="Input · error" className="flex min-h-24 items-start justify-center rounded-lg bg-surface-container p-4">
            <div className={surface} data-demo="time-input-error">
              <TimePicker defaultMode="input" defaultValue={new Time(9, 5)} actions={<Actions onOk={() => snackbar("Time set")} />} />
            </div>
          </Variant>
          <Variant n={4} label="Booking slots" className="flex min-h-24 items-start justify-center rounded-lg bg-surface-container p-4">
            <BookingSlots />
          </Variant>
        </Variants>
      </div>
      <Row label="Time field · filled · 24h · disabled">
        <div className="w-56">
          <TimeField label="Filled" variant="filled" defaultValue={new Time(8, 30)} />
        </div>
        <div className="w-56">
          <TimeField label="24-hour" hourCycle={24} defaultValue={new Time(18, 45)} />
        </div>
        <div className="w-56">
          <TimeField label="Disabled" isDisabled defaultValue={new Time(12, 0)} />
        </div>
      </Row>
    </Section>
  )
}
