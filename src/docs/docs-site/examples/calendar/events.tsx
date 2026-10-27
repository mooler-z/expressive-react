import { EventCalendar, todayDate, type CalendarEvent } from "@/components/ui/calendar"
import { snackbar } from "@/components/ui/snackbar"

const today = todayDate()
const EVENTS: CalendarEvent[] = [
  { id: 1, date: today.add({ days: -2 }), title: "Canary review", tone: "secondary" },
  { id: 2, date: today, title: "Standup", tone: "primary" },
  { id: 3, date: today, title: "Design review", tone: "tertiary" },
  { id: 4, date: today, title: "Lunch & learn", tone: "neutral" },
  { id: 5, date: today.add({ days: 2 }), title: "Release 4.2", tone: "secondary" },
  { id: 6, date: today.add({ days: 5 }), title: "Incident drill", tone: "error" },
]

export default function CalendarEvents() {
  return (
    <div className="w-full max-w-3xl">
      <EventCalendar aria-label="Team calendar" events={EVENTS} onChange={(date) => snackbar(`Selected ${date.toString()}`)} />
    </div>
  )
}
