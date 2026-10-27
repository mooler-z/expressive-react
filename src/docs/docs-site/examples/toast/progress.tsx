import { Button } from "@/components/ui/button"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { toast } from "@/components/ui/toast"

export default function ToastProgress() {
  return (
    <Button
      variant="outlined"
      onPress={() => {
        const key = toast({
          title: "Exporting report",
          description: "This takes a few seconds.",
          media: <LoadingIndicator size={40} contained aria-hidden />,
          timeout: 0,
          closable: false,
        })
        setTimeout(() => {
          toast.dismiss(key)
          toast({ title: "Report ready", description: "Q3-revenue.pdf", icon: "download_done", tone: "tertiary" })
        }, 2500)
      }}
    >
      Export report
    </Button>
  )
}
