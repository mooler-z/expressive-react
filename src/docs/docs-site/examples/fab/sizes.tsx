import { Fab } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"

export default function FabSizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6">
      <Fab size="sm" aria-label="Add, small">
        <Icon name="add" />
      </Fab>
      <Fab size="base" aria-label="Add">
        <Icon name="add" />
      </Fab>
      <Fab size="md" aria-label="Add, medium">
        <Icon name="add" />
      </Fab>
      <Fab size="lg" aria-label="Add, large">
        <Icon name="add" />
      </Fab>
    </div>
  )
}
