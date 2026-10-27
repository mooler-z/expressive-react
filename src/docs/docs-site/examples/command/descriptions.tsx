import { Command, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import { snackbar } from "@/components/ui/snackbar"

const SERVICES = [
  { id: "checkout-api", region: "us-east", status: "Healthy" },
  { id: "billing-worker", region: "eu-central", status: "Degraded" },
  { id: "search-indexer", region: "ap-northeast", status: "Healthy" },
]

export default function CommandDescriptions() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl bg-surface-container-high">
      <Command className="max-h-96">
        <CommandInput placeholder="Jump to a service" autoFocus={false} />
        <CommandList>
          <CommandGroup title="Services" items={SERVICES}>
            {(s) => (
              <CommandItem id={s.id} icon="dns" description={s.region} meta={s.status} onAction={() => snackbar(`Opening ${s.id}`)}>
                {s.id}
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
        <CommandFooter>
          <span className="inline-flex items-center gap-1.5">
            <Kbd size="sm">⏎</Kbd>
            open
          </span>
          <span className="ml-auto">{SERVICES.length} services</span>
        </CommandFooter>
      </Command>
    </div>
  )
}
