import { Checkbox } from "@/components/ui/checkbox"

const OPTIONS = [
  { id: "backups", title: "Nightly backups", description: "Snapshots kept for 30 days", on: true },
  { id: "canary", title: "Canary deploys", description: "Ship to 5% of traffic first", on: false },
  { id: "audit", title: "Audit log export", description: "Stream events to your bucket", on: false },
]

export default function CheckboxRichLabel() {
  return (
    <div className="flex w-full max-w-sm flex-col">
      {OPTIONS.map((o) => (
        <Checkbox key={o.id} defaultSelected={o.on} className="items-start">
          <span className="pt-3">
            <span className="block text-body-lg text-on-surface">{o.title}</span>
            <span className="block text-body-md text-on-surface-variant">{o.description}</span>
          </span>
        </Checkbox>
      ))}
    </div>
  )
}
