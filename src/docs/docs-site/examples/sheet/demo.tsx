import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { InteractiveList, InteractiveListItem } from "@/components/ui/list"
import { BottomSheet, BottomSheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { snackbar } from "@/components/ui/snackbar"

const ACTIONS = [
  { id: "share", label: "Share" },
  { id: "link", label: "Copy link" },
  { id: "edit", label: "Rename" },
  { id: "download", label: "Download" },
]

export default function SheetDemo() {
  return (
    <BottomSheetTrigger>
      <Button icon={<Icon name="more_horiz" />}>Open bottom sheet</Button>
      <BottomSheet>
        {({ close }) => (
          <>
            <SheetHeader className="min-h-12">
              <SheetTitle>Quarterly plan.pdf</SheetTitle>
            </SheetHeader>
            <SheetContent className="px-0 pb-4">
              <InteractiveList
                aria-label="File actions"
                items={ACTIONS}
                onAction={(key) => {
                  snackbar(ACTIONS.find((a) => a.id === key)?.label)
                  close()
                }}
              >
                {(action) => (
                  <InteractiveListItem id={action.id} leading={<Icon name={action.id} />}>
                    {action.label}
                  </InteractiveListItem>
                )}
              </InteractiveList>
            </SheetContent>
          </>
        )}
      </BottomSheet>
    </BottomSheetTrigger>
  )
}
