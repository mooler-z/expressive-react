import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SideSheet, SideSheetTrigger } from "@/components/ui/sheet"

export default function ModalSideSheet() {
  return (
    <SideSheetTrigger>
      <Button variant="tonal" icon={<Icon name="filter_list" />}>
        Filters
      </Button>
      <SideSheet>
        <SheetHeader closeButton>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <SheetContent className="space-y-1">
          <SheetDescription className="pb-2">Show deployments that match:</SheetDescription>
          <Checkbox defaultSelected>Production</Checkbox>
          <Checkbox>Staging</Checkbox>
          <Checkbox>Preview</Checkbox>
        </SheetContent>
        <SheetFooter>
          <Button variant="outlined" slot="close">
            Reset
          </Button>
          <Button slot="close">Apply</Button>
        </SheetFooter>
      </SideSheet>
    </SideSheetTrigger>
  )
}
