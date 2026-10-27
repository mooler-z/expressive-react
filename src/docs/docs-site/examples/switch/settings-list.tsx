import { Switch } from "@/components/ui/switch"

const SETTINGS = [
  { id: "deploy", title: "Auto-deploy main", description: "Ship every merge", on: true },
  { id: "approval", title: "Require approval", description: "Two reviewers for production", on: false },
  { id: "previews", title: "Preview environments", description: "One per pull request", on: true },
]

export default function SwitchSettingsList() {
  return (
    <ul className="w-full max-w-md divide-y divide-outline-variant overflow-hidden rounded-lg bg-surface-container-low">
      {SETTINGS.map((s) => (
        <li key={s.id}>
          <Switch defaultSelected={s.on} className="w-full flex-row-reverse justify-between px-4 py-3">
            <span>
              <span className="block text-body-lg">{s.title}</span>
              <span className="block text-body-sm text-on-surface-variant">{s.description}</span>
            </span>
          </Switch>
        </li>
      ))}
    </ul>
  )
}
