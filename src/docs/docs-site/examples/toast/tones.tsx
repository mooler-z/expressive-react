import { Button } from "@/components/ui/button"
import { toast, type ToastTone } from "@/components/ui/toast"

const tones: { tone: ToastTone; icon: string; title: string }[] = [
  { tone: "primary", icon: "info", title: "New version available" },
  { tone: "secondary", icon: "group_add", title: "Maya joined the team" },
  { tone: "tertiary", icon: "check_circle", title: "Backup finished" },
  { tone: "error", icon: "error", title: "Deploy failed" },
  { tone: "neutral", icon: "schedule", title: "Maintenance tonight" },
]

export default function ToastTones() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {tones.map((t) => (
        <Button key={t.tone} variant="tonal" size="xs" onPress={() => toast({ ...t, description: "Sent from the docs." })}>
          {t.tone}
        </Button>
      ))}
    </div>
  )
}
