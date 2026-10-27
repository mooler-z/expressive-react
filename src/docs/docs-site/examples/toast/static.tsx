import { ToastCard } from "@/components/ui/toast"

export default function ToastStatic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <ToastCard title="Backup finished" description="2,048 files · 1.2 GB" icon="cloud_done" tone="tertiary" onClose={() => {}} />
      <ToastCard
        title="Deploy failed"
        description="checkout-api · build 812"
        icon="error"
        tone="error"
        actions={[{ label: "View logs", onAction: () => {} }]}
      />
    </div>
  )
}
