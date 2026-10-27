import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"
import { toast } from "@/components/ui/toast"

export default function ToastActions() {
  return (
    <Button
      variant="tonal"
      onPress={() =>
        toast({
          title: "Invite from Maya",
          description: "Join the Checkout redesign project?",
          icon: "mail",
          actions: [
            { label: "Accept", onAction: () => snackbar("Joined Checkout redesign") },
            { label: "Decline", onAction: () => snackbar("Invite declined") },
          ],
        })
      }
    >
      Show invite
    </Button>
  )
}
