import { Fab } from "@/components/ui/fab"
import { Icon } from "@/components/ui/icon"

export default function FabColors() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Fab color="primary-container" aria-label="Edit, primary container">
        <Icon name="edit" />
      </Fab>
      <Fab color="secondary-container" aria-label="Edit, secondary container">
        <Icon name="edit" />
      </Fab>
      <Fab color="tertiary-container" aria-label="Edit, tertiary container">
        <Icon name="edit" />
      </Fab>
      <Fab color="primary" aria-label="Edit, primary">
        <Icon name="edit" />
      </Fab>
      <Fab color="secondary" aria-label="Edit, secondary">
        <Icon name="edit" />
      </Fab>
      <Fab color="tertiary" aria-label="Edit, tertiary">
        <Icon name="edit" />
      </Fab>
      <Fab color="surface" aria-label="Edit, surface">
        <Icon name="edit" />
      </Fab>
    </div>
  )
}
