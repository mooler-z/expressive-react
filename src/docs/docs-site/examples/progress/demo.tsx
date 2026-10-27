import { CircularProgress, LinearProgress } from "@/components/ui/progress"

export default function ProgressDemo() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8">
      <LinearProgress aria-label="Upload" value={64} className="w-full" />
      <LinearProgress aria-label="Download" value={40} wavy className="w-full" />
      <div className="flex items-center gap-8">
        <CircularProgress aria-label="Sync" value={72} />
        <CircularProgress aria-label="Backup" value={45} wavy />
      </div>
    </div>
  )
}
