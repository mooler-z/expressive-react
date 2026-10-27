import { Alert } from "@/components/ui/alert"

export default function AlertVariants() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Alert variant="tonal" tone="warning">Tonal · filled container role.</Alert>
      <Alert variant="outlined" tone="warning">Outlined · 1dp role border on the surface.</Alert>
      <Alert variant="inverse" tone="warning">Inverse · a pill on inverse-surface.</Alert>
      <Alert variant="outlined" tone="success" icon={null}>
        icon={"{null}"} hides the glyph.
      </Alert>
    </div>
  )
}
