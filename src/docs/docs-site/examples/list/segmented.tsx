import { Icon } from "@/components/ui/icon"
import { InteractiveList, InteractiveListItem } from "@/components/ui/list"
import { snackbar } from "@/components/ui/snackbar"

export default function SegmentedList() {
  return (
    <div className="w-full max-w-md rounded-xl bg-surface-container p-2">
      <InteractiveList
        aria-label="Settings"
        variant="segmented"
        selectionMode="single"
        defaultSelectedKeys={["display"]}
        onAction={(key) => snackbar(`Open ${String(key)}`)}
      >
        <InteractiveListItem id="network" leading={<Icon name="wifi" />} supportingText="Wi-Fi, mobile, hotspot">
          Network
        </InteractiveListItem>
        <InteractiveListItem id="display" leading={<Icon name="brightness_6" />} supportingText="Dark theme, font size">
          Display
        </InteractiveListItem>
        <InteractiveListItem id="sound" leading={<Icon name="volume_up" />} supportingText="Volume, haptics">
          Sound
        </InteractiveListItem>
      </InteractiveList>
    </div>
  )
}
