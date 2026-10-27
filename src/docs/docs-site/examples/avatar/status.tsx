import { Avatar } from "@/components/ui/avatar"

export default function AvatarStatus() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      {(["online", "busy", "away", "offline"] as const).map((status) => (
        <div key={status} className="flex flex-col items-center gap-2">
          <Avatar size="lg" name="Maya Lindqvist" status={status} />
          <span className="text-label-md text-on-surface-variant capitalize">{status}</span>
        </div>
      ))}
    </div>
  )
}
