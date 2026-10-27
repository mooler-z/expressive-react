import { CircularProgress, LinearProgress } from "@/components/ui/progress"

export default function ProgressIndeterminate() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      <LinearProgress aria-label="Loading" isIndeterminate className="w-full" />
      <LinearProgress aria-label="Loading" isIndeterminate wavy className="w-full" />
      <div className="flex items-center gap-8">
        <CircularProgress aria-label="Loading" isIndeterminate />
        <CircularProgress aria-label="Loading" isIndeterminate wavy />
      </div>
    </div>
  )
}
