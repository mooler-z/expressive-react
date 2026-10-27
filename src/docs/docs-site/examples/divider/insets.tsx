import { Divider } from "@/components/ui/divider"

export default function DividerInsets() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <div className="space-y-2">
        <Divider />
        <p className="text-body-sm text-on-surface-variant">Full width</p>
      </div>
      <div className="space-y-2">
        <Divider inset="start" />
        <p className="text-body-sm text-on-surface-variant">Inset: 16dp at the start, aligned with list text</p>
      </div>
      <div className="space-y-2">
        <Divider inset="middle" />
        <p className="text-body-sm text-on-surface-variant">Middle inset: 16dp on both sides</p>
      </div>
    </div>
  )
}
