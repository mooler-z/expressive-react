import { KbdGroup } from "@/components/ui/kbd"

const SHORTCUTS = [
  { label: "Open command palette", keys: ["⌘", "K"] },
  { label: "New deploy", keys: ["⌘", "⇧", "D"] },
  { label: "Toggle sidebar", keys: ["⌘", "B"] },
  { label: "Go to incidents", keys: ["G", "I"], separator: "then" },
]

export default function CodeBlockShortcuts() {
  return (
    <dl className="w-full max-w-sm divide-y divide-outline-variant overflow-hidden rounded-lg bg-surface-container-low">
      {SHORTCUTS.map((s) => (
        <div key={s.label} className="flex items-center justify-between gap-4 px-4 py-3">
          <dt className="text-body-md text-on-surface">{s.label}</dt>
          <dd>
            <KbdGroup keys={s.keys} separator={s.separator} size="sm" />
          </dd>
        </div>
      ))}
    </dl>
  )
}
