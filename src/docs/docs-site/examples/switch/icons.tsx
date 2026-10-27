import { Switch } from "@/components/ui/switch"

export default function SwitchIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
      <Switch icons>Wi-Fi</Switch>
      <Switch icons defaultSelected>Bluetooth</Switch>
    </div>
  )
}
