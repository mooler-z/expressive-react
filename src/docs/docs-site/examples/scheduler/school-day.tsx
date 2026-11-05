import { getLocalTimeZone, startOfWeek, toCalendarDateTime, today } from "@internationalized/date"

import { Scheduler, type SchedulerEvent } from "@/components/ui/scheduler"
import { snackbar } from "@/components/ui/snackbar"

const monday = startOfWeek(today(getLocalTimeZone()), "en-US", "mon")

const PERIODS = [
  ["08:00", "08:45"],
  ["08:50", "09:35"],
  ["09:40", "10:25"],
  ["10:45", "11:30"],
  ["11:35", "12:20"],
  ["13:20", "14:05"],
  ["14:10", "14:55"],
] as const

const TIMETABLE: Record<number, string[]> = {
  0: ["Mathematics", "English", "Biology", "Amharic", "History", "Physics", "Art"],
  1: ["Chemistry", "Mathematics", "English", "Geography", "Civics", "PE", "ICT"],
  2: ["Physics", "Amharic", "Mathematics", "Biology", "English", "Music", "Library"],
  3: ["English", "Chemistry", "History", "Mathematics", "ICT", "Geography", "PE"],
  4: ["Biology", "Physics", "Civics", "English", "Mathematics", "Club hour", "Club hour"],
}

const COLORS = ["primary", "secondary", "tertiary"] as const

const time = (d: number, hhmm: string) => {
  const [hour, minute] = hhmm.split(":").map(Number)
  return toCalendarDateTime(monday.add({ days: d })).set({ hour, minute })
}

const EVENTS: SchedulerEvent[] = Object.entries(TIMETABLE).flatMap(([d, subjects]) =>
  subjects.map((title, p) => ({
    id: `${d}-${p}`,
    title,
    start: time(Number(d), PERIODS[p][0]),
    end: time(Number(d), PERIODS[p][1]),
    color: COLORS[p % COLORS.length],
  })),
)

export default function SchedulerSchoolDay() {
  return (
    <Scheduler
      aria-label="Grade 9A timetable"
      events={[...EVENTS, { id: "lunch", title: "Lunch break", start: time(2, "12:20"), end: time(2, "13:20"), color: "neutral" }]}
      defaultView="week"
      views={["week", "day"]}
      hideWeekends
      firstDayOfWeek="mon"
      dayStartHour={7}
      dayEndHour={16}
      hourHeight={56}
      onEventAction={(event) => snackbar(event.title)}
    />
  )
}
