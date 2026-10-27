import { ExtendedFab } from "@/components/ui/fab"

export default function FabExtended() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      <ExtendedFab size="sm" icon="edit">Compose</ExtendedFab>
      <ExtendedFab size="md" icon="edit" color="secondary-container">Compose</ExtendedFab>
      <ExtendedFab size="lg" icon="edit" color="tertiary-container">Compose</ExtendedFab>
      <ExtendedFab size="sm" color="surface">Label only</ExtendedFab>
    </div>
  )
}
