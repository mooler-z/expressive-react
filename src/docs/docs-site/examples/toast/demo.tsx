import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"

export default function ToastDemo() {
  return (
    <Button
      onPress={() =>
        toast({
          title: "Rollout complete",
          description: "v4.2.0 is live in all regions.",
          icon: "check_circle",
          tone: "tertiary",
        })
      }
    >
      Show toast
    </Button>
  )
}
