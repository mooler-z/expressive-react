import { Badge } from "@/components/ui/badge"

export default function BadgeStandalone() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Badge />
      <Badge count={1} />
      <Badge count={12} />
      <Badge count={120} max={99} />
      <Badge count="New" />
    </div>
  )
}
