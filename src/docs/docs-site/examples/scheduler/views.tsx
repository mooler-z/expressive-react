import { useState } from "react"
import { getLocalTimeZone, startOfWeek, toCalendarDateTime, today } from "@internationalized/date"

import { Scheduler, type SchedulerEvent, type SchedulerView } from "@/components/ui/scheduler"
import { snackbar } from "@/components/ui/snackbar"

const monday = startOfWeek(today(getLocalTimeZone()), "en-US", "mon")
const at = (d: number, hour: number, minute = 0) => toCalendarDateTime(monday.add({ days: d })).set({ hour, minute })

const WEEK: SchedulerEvent[] = [
  { id: 1, title: "Assembly", start: at(0, 8), end: at(0, 8, 30), color: "secondary" },
  { id: 2, title: "Physics lab", start: at(0, 10), end: at(0, 11, 30), color: "tertiary", description: "Lab 2 · Grade 10" },
  { id: 3, title: "Chemistry lab", start: at(0, 10, 30), end: at(0, 12), color: "secondary", description: "Lab 1 · Grade 11" },
  { id: 4, title: "Department heads", start: at(1, 13), end: at(1, 14), color: "neutral" },
  { id: 5, title: "Mock exam", start: at(2, 9), end: at(2, 12), color: "error", description: "Hall A" },
  { id: 6, title: "Invigilation", start: at(2, 9), end: at(2, 10, 30), color: "neutral" },
  { id: 7, title: "Choir", start: at(3, 15), end: at(3, 16, 30), color: "tertiary" },
  { id: 8, title: "Open day", start: monday.add({ days: 4 }), color: "primary" },
  { id: 9, title: "Football final", start: at(4, 14), end: at(4, 16) },
]

export default function SchedulerViews() {
  const [view, setView] = useState<SchedulerView>("week")
  return (
    <Scheduler
      aria-label="Week planner"
      events={WEEK}
      view={view}
      onViewChange={setView}
      firstDayOfWeek="mon"
      dayStartHour={7}
      dayEndHour={18}
      onEventAction={(event) => snackbar(event.title)}
    />
  )
}
