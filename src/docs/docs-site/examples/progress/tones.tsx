import { LinearProgress } from "@/components/ui/progress"

export default function ProgressTones() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <LinearProgress aria-label="Primary" value={70} />
      <LinearProgress aria-label="Secondary" value={55} tone="secondary" />
      <LinearProgress aria-label="Tertiary" value={40} tone="tertiary" />
      <LinearProgress aria-label="Quota" value={92} tone="error" />
      <div className="rounded-xs bg-inverse-surface px-4 py-3">
        <LinearProgress aria-label="Inverse" value={60} tone="inverse" />
      </div>
    </div>
  )
}
