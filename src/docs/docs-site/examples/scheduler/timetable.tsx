import { useState } from "react"
import type { Key } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { Timetable, type TimetableSession } from "@/components/ui/scheduler"

const DAYS = [
  { id: "mon", label: "Monday" },
  { id: "tue", label: "Tuesday" },
  { id: "wed", label: "Wednesday" },
  { id: "thu", label: "Thursday" },
  { id: "fri", label: "Friday" },
]

const SESSIONS: TimetableSession[] = [
  { id: 1, day: "mon", start: "08:00", end: "08:45", title: "Mathematics", subtitle: "Abebe Kebede" },
  { id: 2, day: "mon", start: "08:50", end: "09:35", title: "English", subtitle: "Sara Tesfaye", color: "secondary" },
  { id: 3, day: "mon", start: "09:35", end: "09:55", title: "Break", color: "neutral" },
  { id: 4, day: "mon", start: "09:55", end: "10:40", title: "Biology lab", subtitle: "Hana Girma", color: "tertiary" },
  { id: 5, day: "tue", start: "08:00", end: "08:45", title: "Amharic", subtitle: "Dawit Alemu", color: "secondary" },
  { id: 6, day: "tue", start: "08:50", end: "09:35", title: "Mathematics", subtitle: "Abebe Kebede" },
  { id: 7, day: "tue", start: "09:35", end: "09:55", title: "Break", color: "neutral" },
  { id: 8, day: "wed", start: "08:00", end: "08:45", title: "Physics", subtitle: "Yonas Bekele" },
  { id: 9, day: "wed", start: "08:50", end: "09:35", title: "Civics", subtitle: "Meron Haile", color: "secondary" },
  { id: 10, day: "thu", start: "08:00", end: "08:30", title: "Flag ceremony", color: "tertiary" },
  { id: 11, day: "thu", start: "08:30", end: "09:15", title: "Chemistry lab", subtitle: "Hana Girma", color: "tertiary" },
  { id: 12, day: "thu", start: "09:20", end: "10:05", title: "English", subtitle: "Sara Tesfaye", color: "secondary" },
]

export default function SchedulerTimetable() {
  const [mode, setMode] = useState<"manage" | "select">("manage")
  const [sessions, setSessions] = useState(SESSIONS)
  const [selected, setSelected] = useState<Set<Key>>(new Set())

  const addSession = (day: string) => {
    const label = DAYS.find((d) => d.id === day)?.label
    setSessions((list) => [...list, { id: Date.now(), day, title: "Study hall", color: "neutral" }])
    snackbar(`Session added on ${label}`)
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <ConnectedButtonGroup aria-label="Mode" size="xs" selectedKeys={[mode]} onSelectionChange={(keys) => setMode([...keys][0] as "manage" | "select")}>
          <ConnectedButton id="manage">Manage</ConnectedButton>
          <ConnectedButton id="select">Select</ConnectedButton>
        </ConnectedButtonGroup>
        {mode === "select" && (
          <>
            <span className="text-body-md text-on-surface-variant">{selected.size} selected</span>
            <Button
              variant="tonal"
              size="xs"
              icon={<Icon name="swap_horiz" />}
              isDisabled={selected.size !== 2}
              onPress={() => snackbar("Swapped the two sessions")}
            >
              Swap
            </Button>
          </>
        )}
      </div>

      <Timetable
        aria-label="Grade 9A weekly sessions"
        days={DAYS}
        sessions={sessions}
        selectionMode={mode === "select" ? "multiple" : "none"}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        onSessionAction={(session) => snackbar(`Edit ${session.title}`)}
        onAddSession={mode === "manage" ? addSession : undefined}
      />
    </div>
  )
}
