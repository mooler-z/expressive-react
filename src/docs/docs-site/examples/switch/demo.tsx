import { Switch } from "@/components/ui/switch"

export default function SwitchDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
      <Switch>Off</Switch>
      <Switch defaultSelected>On</Switch>
      <Switch icons defaultSelected>With icons</Switch>
    </div>
  )
}
