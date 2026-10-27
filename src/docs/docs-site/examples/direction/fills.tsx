import { DirectionProvider } from "@/components/ui/direction"
import { LinearProgress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

export default function DirectionFills() {
  return (
    <DirectionProvider dir="rtl" className="w-full max-w-sm space-y-6 rounded-lg bg-surface-container-low p-4">
      <LinearProgress aria-label="التقدم" value={62} />
      <Slider label="مستوى الصوت" defaultValue={40} />
    </DirectionProvider>
  )
}
