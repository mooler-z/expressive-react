import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"

export default function SnackbarDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="tonal" onPress={() => snackbar("Photo archived")}>
        Archive photo
      </Button>
      <Button
        onPress={() =>
          snackbar("Message deleted", {
            action: { label: "Undo", onAction: () => snackbar("Message restored") },
          })
        }
      >
        Delete message
      </Button>
    </div>
  )
}
