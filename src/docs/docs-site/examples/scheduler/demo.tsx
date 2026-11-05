import { getLocalTimeZone, startOfMonth, toCalendarDateTime, today } from "@internationalized/date"

import { Scheduler, type SchedulerEvent } from "@/components/ui/scheduler"
import { snackbar } from "@/components/ui/snackbar"

const month = startOfMonth(today(getLocalTimeZone()))
const day = (n: number) => month.add({ days: n - 1 })
const at = (n: number, hour: number, minute = 0) => toCalendarDateTime(day(n)).set({ hour, minute })

const TERM: SchedulerEvent[] = [
  { id: "reading", title: "Reading week", start: day(2), end: day(6), color: "secondary" },
  { id: "holiday", title: "Public holiday", start: day(9), color: "tertiary" },
  { id: "staff", title: "Staff meeting", start: at(10, 8), end: at(10, 9), color: "neutral" },
  { id: "pta", title: "Parent–teacher conference", start: at(12, 14), end: at(12, 17) },
  { id: "science", title: "Science fair", start: day(15), color: "secondary" },
  { id: "trip", title: "Grade 6 field trip", start: at(15, 9), end: at(15, 15), color: "tertiary" },
  { id: "board", title: "Board meeting", start: at(15, 16), end: at(15, 17), color: "neutral" },
  { id: "midterm", title: "Mid-term exams", start: day(19), end: day(23), color: "error" },
  { id: "math", title: "Mathematics paper", start: at(19, 9), end: at(19, 11), color: "error" },
  { id: "sports", title: "Sports day", start: day(26) },
  { id: "reports", title: "Report cards due", start: at(28, 12), color: "neutral" },
]

export default function SchedulerDemo() {
  return (
    <Scheduler
      aria-label="School calendar"
      events={TERM}
      onEventAction={(event) => snackbar(event.title)}
    />
  )
}
