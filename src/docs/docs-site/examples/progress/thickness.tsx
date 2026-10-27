import { CircularProgress, LinearProgress } from "@/components/ui/progress"

export default function ProgressThickness() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      <LinearProgress aria-label="4dp" value={55} className="w-full" />
      <LinearProgress aria-label="8dp" value={55} thickness={8} className="w-full" />
      <LinearProgress aria-label="8dp wavy" value={55} thickness={8} wavy className="w-full" />
      <div className="flex items-center gap-8">
        <CircularProgress aria-label="4dp" value={55} />
        <CircularProgress aria-label="8dp" value={55} thickness={8} size={56} />
      </div>
    </div>
  )
}
