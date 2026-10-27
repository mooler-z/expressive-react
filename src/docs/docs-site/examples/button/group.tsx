import { ConnectedButton, ConnectedButtonGroup, SplitButton, SplitButtonAction, SplitButtonMenu } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { MenuItem } from "@/components/ui/menu"
import { snackbar } from "@/components/ui/snackbar"

export default function ButtonGroups() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <ConnectedButtonGroup aria-label="Range" defaultSelectedKeys={["day"]}>
        <ConnectedButton id="day">Day</ConnectedButton>
        <ConnectedButton id="week">Week</ConnectedButton>
        <ConnectedButton id="month">Month</ConnectedButton>
      </ConnectedButtonGroup>

      <SplitButton>
        <SplitButtonAction onPress={() => snackbar("Published")}>
          <Icon name="publish" />
          Publish
        </SplitButtonAction>
        <SplitButtonMenu aria-label="More publish options" onAction={(key) => snackbar(String(key))}>
          <MenuItem id="Scheduled for 9:00" icon="schedule">Schedule</MenuItem>
          <MenuItem id="Saved as draft" icon="draft">Save draft</MenuItem>
        </SplitButtonMenu>
      </SplitButton>
    </div>
  )
}
