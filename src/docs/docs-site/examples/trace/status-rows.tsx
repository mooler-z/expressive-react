import { Button } from "@/components/ui/button"
import { snackbar } from "@/components/ui/snackbar"
import { TraceStatusRow } from "@/components/ui/trace"

export default function TraceStatusRows() {
  return (
    <div className="grid w-full max-w-xl gap-2">
      <TraceStatusRow
        status="success"
        title="Agent run #1842"
        meta={["5 steps", "6.4 s", "2,310 tokens"]}
        action={
          <Button size="xs" variant="text" onPress={() => snackbar("Opening run #1842")}>
            View
          </Button>
        }
      />
      <TraceStatusRow status="running" title="Nightly backup" meta={["step 3 of 4", "12 min"]} />
      <TraceStatusRow
        status="error"
        title="Deploy ledger 2.9.1"
        meta={["failed at Build", "6.1 s"]}
        action={
          <Button size="xs" variant="tonal" onPress={() => snackbar("Retrying deploy")}>
            Retry
          </Button>
        }
      />
    </div>
  )
}
