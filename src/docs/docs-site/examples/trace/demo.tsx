import { Trace, TraceDetails, TraceStep } from "@/components/ui/trace"

export default function TraceDemo() {
  return (
    <div className="w-full max-w-xl rounded-xl bg-surface-container-low p-5">
      <Trace>
        <TraceStep status="success" title="Plan the change" duration="1.2 s" description="Read 4 files and the failing test." />
        <TraceStep status="success" tool title="search_code" duration="340 ms">
          <TraceDetails summary="Input and output">{`query: "useTableSort"\n→ 3 matches in 2 files`}</TraceDetails>
        </TraceStep>
        <TraceStep status="running" tool title="run_tests" duration="running…" meta="retry 2 of 3" />
        <TraceStep status="pending" title="Open pull request" />
      </Trace>
    </div>
  )
}
