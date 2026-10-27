import { ScrollArea } from "@/components/ui/scroll-area"

const REGIONS = ["eu-central-1", "eu-west-2", "us-east-1", "us-west-2", "ap-south-1", "ap-northeast-1", "sa-east-1", "af-south-1"]
const HOURS = Array.from({ length: 12 }, (_, i) => `${String(i * 2).padStart(2, "0")}:00`)

export default function ScrollAreaBoth() {
  return (
    <ScrollArea orientation="both" className="h-64 w-full max-w-lg rounded-lg border border-outline-variant">
      <table className="w-max border-separate border-spacing-0 text-body-sm">
        <thead>
          <tr>
            <th className="sticky top-0 left-0 z-20 bg-surface-container px-3 py-2 text-start text-label-md">Region</th>
            {HOURS.map((h) => (
              <th key={h} className="sticky top-0 z-10 bg-surface-container px-3 py-2 text-label-md tabular-nums">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {REGIONS.map((region, r) => (
            <tr key={region}>
              <th className="sticky left-0 z-10 bg-surface px-3 py-2 text-start font-mono font-normal">{region}</th>
              {HOURS.map((h, c) => (
                <td key={h} className="px-3 py-2 text-center tabular-nums text-on-surface-variant">{80 + ((r * 7 + c * 13) % 70)}ms</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  )
}
