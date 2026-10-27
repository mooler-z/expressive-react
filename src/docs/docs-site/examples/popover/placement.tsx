import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger } from "@/components/ui/popover"

const PLACEMENTS = ["top", "bottom", "start", "end"] as const

export default function PopoverPlacement() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {PLACEMENTS.map((placement) => (
        <PopoverTrigger key={placement}>
          <Button variant="outlined" className="capitalize">
            {placement}
          </Button>
          <Popover placement={placement} aria-label={`${placement} popover`}>
            <p className="text-body-md">
              placement="<span className="font-mono">{placement}</span>"
            </p>
          </Popover>
        </PopoverTrigger>
      ))}
    </div>
  )
}
