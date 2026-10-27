import { ConnectedButton, ConnectedButtonGroup } from "@/components/ui/button-group"

export default function ButtonGroupConnected() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ConnectedButtonGroup aria-label="Range" defaultSelectedKeys={["week"]}>
        <ConnectedButton id="day">Day</ConnectedButton>
        <ConnectedButton id="week">Week</ConnectedButton>
        <ConnectedButton id="month">Month</ConnectedButton>
        <ConnectedButton id="year">Year</ConnectedButton>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup aria-label="Density" variant="tonal" defaultSelectedKeys={["comfortable"]}>
        <ConnectedButton id="compact">Compact</ConnectedButton>
        <ConnectedButton id="comfortable">Comfortable</ConnectedButton>
      </ConnectedButtonGroup>
      <ConnectedButtonGroup aria-label="View" variant="outlined" defaultSelectedKeys={["list"]}>
        <ConnectedButton id="list">List</ConnectedButton>
        <ConnectedButton id="grid">Grid</ConnectedButton>
        <ConnectedButton id="board">Board</ConnectedButton>
      </ConnectedButtonGroup>
    </div>
  )
}
