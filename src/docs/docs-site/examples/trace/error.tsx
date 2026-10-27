import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { snackbar } from "@/components/ui/snackbar"
import { Trace, TraceError, TraceStep } from "@/components/ui/trace"

export default function TraceWithError() {
  return (
    <div className="w-full max-w-xl rounded-xl bg-surface-container-low p-5">
      <Trace>
        <TraceStep status="success" title="Install dependencies" duration="18.4 s" />
        <TraceStep status="error" title="Build" duration="6.1 s">
          <TraceError>
            <div>error TS2345: Argument of type '"region"' is not assignable.</div>
            <div>at src/routes/regions.tsx:21:36</div>
          </TraceError>
          <Button size="xs" variant="tonal" className="mt-3" icon={<Icon name="refresh" />} onPress={() => snackbar("Retrying build")}>
            Retry
          </Button>
        </TraceStep>
        <TraceStep status="skipped" title="Deploy" description="Skipped because Build failed." />
      </Trace>
    </div>
  )
}
