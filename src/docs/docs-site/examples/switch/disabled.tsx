import { Switch } from "@/components/ui/switch"

export default function SwitchDisabled() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
      <Switch isDisabled>Disabled</Switch>
      <Switch isDisabled defaultSelected>Disabled on</Switch>
      <Switch isDisabled icons defaultSelected>Disabled with icons</Switch>
    </div>
  )
}
