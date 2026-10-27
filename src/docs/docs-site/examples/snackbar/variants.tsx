import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"

export default function SnackbarVariants() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="outlined" onPress={() => snackbar("Connection lost. Retrying…", { closable: true })}>
        With close icon
      </Button>
      <Button
        variant="outlined"
        onPress={() =>
          snackbar("Your storage is almost full. Free up space to keep syncing photos and files.", {
            stacked: true,
            closable: true,
            action: { label: "Manage storage", onAction: () => snackbar("Opening storage") },
          })
        }
      >
        Two lines, stacked action
      </Button>
    </div>
  )
}
