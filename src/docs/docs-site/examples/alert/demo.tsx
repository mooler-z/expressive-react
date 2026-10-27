import { Alert } from "@/components/ui/alert"

export default function AlertDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert tone="info">A new version of the dashboard is available.</Alert>
      <Alert tone="success">Deploy #4821 finished in 2m 14s.</Alert>
      <Alert tone="warning">Your API key expires in 3 days.</Alert>
      <Alert tone="error">Checkout is failing for 4% of requests.</Alert>
    </div>
  )
}
