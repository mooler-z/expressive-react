import { useState } from "react"
import { getLocalTimeZone, now, toCalendarDateTime } from "@internationalized/date"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Scheduler, type SchedulerEvent, type SchedulerSlot } from "@/components/ui/scheduler"
import { snackbar } from "@/components/ui/snackbar"

export default function SchedulerCreate() {
  const [events, setEvents] = useState<SchedulerEvent[]>([])

  const add = (slot: SchedulerSlot) => {
    const event: SchedulerEvent = { id: crypto.randomUUID(), title: "New event", start: slot.start, end: slot.end, allDay: slot.allDay }
    setEvents((list) => [...list, event])
    snackbar(slot.allDay ? `All-day event on ${slot.start.toString()}` : `Event at ${slot.start.toString().slice(11, 16)}`)
  }

  const addNextHour = () => {
    const start = toCalendarDateTime(now(getLocalTimeZone())).set({ minute: 0, second: 0, millisecond: 0 }).add({ hours: 1 })
    add({ start, end: start.add({ hours: 1 }), allDay: false })
  }

  return (
    <Scheduler
      aria-label="My calendar"
      defaultView="week"
      events={events}
      onSlotAction={add}
      onEventAction={(event) => setEvents((list) => list.filter((e) => e.id !== event.id))}
      actions={
        <Button variant="tonal" size="xs" icon={<Icon name="add" />} onPress={addNextHour}>
          New event
        </Button>
      }
    />
  )
}
