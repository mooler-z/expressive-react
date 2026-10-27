import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Popover, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover"
import { snackbar } from "@/components/ui/snackbar"

export default function PopoverDemo() {
  return (
    <PopoverTrigger>
      <Button variant="tonal" icon={<Icon name="info" />}>
        How retention works
      </Button>
      <Popover className="w-80">
        <PopoverTitle>Retention</PopoverTitle>
        <PopoverDescription>
          A user counts as retained in week N if they open the app at least once that week. Cohorts start on the day of signup.
        </PopoverDescription>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="text" slot="close">
            Got it
          </Button>
          <Button variant="text" slot="close" onPress={() => snackbar("Opening the metrics guide")}>
            Learn more
          </Button>
        </div>
      </Popover>
    </PopoverTrigger>
  )
}
