import { ScrollArea } from "@/components/ui/scroll-area"

const RELEASES = Array.from({ length: 24 }, (_, i) => `v1.${24 - i}.0`)

export default function ScrollAreaDemo() {
  return (
    <ScrollArea fade className="h-72 w-full max-w-xs rounded-lg bg-surface-container-low">
      <ul className="p-2">
        {RELEASES.map((tag) => (
          <li key={tag} className="flex items-center justify-between rounded-md px-3 py-2 text-body-md text-on-surface">
            <span className="font-mono">{tag}</span>
            <span className="text-body-sm text-on-surface-variant">checkout-api</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
