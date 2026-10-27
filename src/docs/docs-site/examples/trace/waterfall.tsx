import { TraceWaterfall } from "@/components/ui/trace"

const SPANS = [
  { name: "GET /checkout", start: 0, duration: 412 },
  { name: "auth.verify", start: 6, duration: 38, depth: 1 },
  { name: "cart.load", start: 48, duration: 120, depth: 1 },
  { name: "db.query", start: 60, duration: 88, depth: 2 },
  { name: "pricing.quote", start: 172, duration: 196, depth: 1 },
  { name: "tax.lookup", start: 190, duration: 140, depth: 2 },
]

export default function TraceWaterfallExample() {
  return (
    <div className="w-full max-w-2xl rounded-xl bg-surface-container-low p-5">
      <TraceWaterfall spans={SPANS} />
    </div>
  )
}
