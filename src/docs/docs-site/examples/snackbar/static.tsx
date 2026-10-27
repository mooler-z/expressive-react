import { Snackbar } from "@/components/ui/snackbar"

export default function SnackbarStatic() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Snackbar message="Photo archived" />
      <Snackbar message="Message deleted" action={{ label: "Undo", onAction: () => {} }} />
      <Snackbar message="Connection lost" action={{ label: "Retry", onAction: () => {} }} onClose={() => {}} />
      <Snackbar
        stacked
        message="Your storage is almost full. Free up space to keep syncing."
        action={{ label: "Manage storage", onAction: () => {} }}
      />
    </div>
  )
}
