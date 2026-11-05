import { useState } from "react"
import { CalendarDate, EthiopicCalendar, getLocalTimeZone, toCalendar, today } from "@internationalized/date"
import { I18nProvider } from "react-aria-components"

import { Button } from "@/components/ui/button"
import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"
import { Scheduler, type SchedulerEvent, type SchedulerLabels } from "@/components/ui/scheduler"
import { snackbar } from "@/components/ui/snackbar"

const ethiopic = new EthiopicCalendar()
const now = toCalendar(today(getLocalTimeZone()), ethiopic)
const date = (month: number, day: number) => new CalendarDate(ethiopic, now.era, now.year, month, day)

type Lang = "am" | "en"

const HOLIDAYS: { month: number; day: number; am: string; en: string }[] = [
  { month: 1, day: 1, am: "እንቁጣጣሽ", en: "Enkutatash" },
  { month: 1, day: 17, am: "መስቀል", en: "Meskel" },
  { month: 4, day: 29, am: "ገና", en: "Genna" },
  { month: 5, day: 11, am: "ጥምቀት", en: "Timket" },
  { month: 6, day: 23, am: "የዓድዋ ድል በዓል", en: "Adwa Victory Day" },
  { month: 8, day: 27, am: "የአርበኞች ቀን", en: "Patriots' Victory Day" },
  { month: 9, day: 20, am: "ግንቦት 20", en: "Downfall of the Derg" },
]

const events = (lang: Lang): SchedulerEvent[] => [
  ...HOLIDAYS.map((h) => ({ id: `${h.month}-${h.day}`, title: h[lang], start: date(h.month, h.day), color: "tertiary" as const })),
  { id: "exams", title: lang === "am" ? "የመንፈቀ ዓመት ፈተና" : "Mid-term exams", start: now.add({ days: 3 }), end: now.add({ days: 7 }), color: "error" },
  { id: "parents", title: lang === "am" ? "የወላጆች ቀን" : "Parents' day", start: now.add({ days: 10 }) },
  { id: "pagume", title: lang === "am" ? "የክረምት ትምህርት ምዝገባ" : "Summer school sign-up", start: date(13, 2), end: date(13, 4), color: "secondary" },
]

const AMHARIC: Partial<SchedulerLabels> = {
  today: "ዛሬ",
  previous: "ቀዳሚ",
  next: "ቀጣይ",
  view: "እይታ",
  month: "ወር",
  week: "ሳምንት",
  day: "ቀን",
  agenda: "አጀንዳ",
  allDay: "ሙሉ ቀን",
  noEvents: "ምንም መርሐ ግብር የለም",
  more: (n) => `+${n} ተጨማሪ`,
}

export default function SchedulerEthiopian() {
  const [lang, setLang] = useState<Lang>("am")
  const [focused, setFocused] = useState(now)

  return (
    <div className="flex w-full flex-col gap-4">
      <ConnectedButtonGroup
        aria-label="Language"
        size="xs"
        selectedKeys={[lang]}
        onSelectionChange={(keys) => setLang([...keys][0] as Lang)}
        className="self-start"
      >
        <ConnectedButton id="am">አማርኛ</ConnectedButton>
        <ConnectedButton id="en">English</ConnectedButton>
      </ConnectedButtonGroup>

      <I18nProvider locale={lang === "am" ? "am-ET-u-ca-ethiopic" : "en-US-u-ca-ethiopic"}>
        <Scheduler
          aria-label={lang === "am" ? "የትምህርት ቤት ቀን መቁጠሪያ" : "School calendar"}
          events={events(lang)}
          defaultView="month"
          date={focused}
          onDateChange={setFocused}
          labels={lang === "am" ? AMHARIC : undefined}
          onEventAction={(event) => snackbar(event.title)}
          actions={
            <Button variant="text" size="xs" onPress={() => setFocused(date(13, 1))}>
              {lang === "am" ? "ጳጉሜን" : "Pagume"}
            </Button>
          }
        />
      </I18nProvider>
    </div>
  )
}
