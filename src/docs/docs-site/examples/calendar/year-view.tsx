import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"

export default function CalendarYearView() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <DialogTrigger>
        <Button variant="tonal" icon={<Icon name="cake" />}>Pick a birth date</Button>
        <Dialog aria-label="Birth date" modalClassName="max-w-[400px]">
          <Calendar aria-label="Birth date" defaultView="year" />
        </Dialog>
      </DialogTrigger>
      <div className="w-full max-w-[360px] rounded-xl bg-surface-container-high p-3">
        <Calendar aria-label="Without year picker" yearPicker={false} />
      </div>
    </div>
  )
}
