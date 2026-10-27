import { StatusBadge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"

export default function BadgeStatus() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <StatusBadge variant="primary">New</StatusBadge>
        <StatusBadge variant="primary-container">Pro</StatusBadge>
        <StatusBadge>Beta</StatusBadge>
        <StatusBadge variant="tertiary">Preview</StatusBadge>
        <StatusBadge variant="error">Deprecated</StatusBadge>
        <StatusBadge variant="neutral">v1.0</StatusBadge>
        <StatusBadge variant="outlined">Draft</StatusBadge>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <StatusBadge size="md" shape="pill" variant="tertiary">
          <Icon name="check_circle" filled />
          Healthy
        </StatusBadge>
        <StatusBadge size="md" shape="pill" variant="error">
          <Icon name="error" filled />
          Failing
        </StatusBadge>
      </div>
    </div>
  )
}
