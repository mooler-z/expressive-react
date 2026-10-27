import { Breadcrumb, BreadcrumbMenu, Breadcrumbs } from "@/components/ui/breadcrumb"
import { snackbar } from "@/components/ui/snackbar"

export default function BreadcrumbCollapsed() {
  return (
    <nav aria-label="Breadcrumb">
      <Breadcrumbs onAction={(key) => snackbar(`Go to ${key}`)}>
        <Breadcrumb id="Drive" icon="cloud">Drive</Breadcrumb>
        <BreadcrumbMenu
          items={[{ label: "Shared" }, { label: "Design team" }, { label: "2026" }]}
          onAction={(item) => snackbar(`Go to ${item.label}`)}
        />
        <Breadcrumb id="Q4 launch">Q4 launch</Breadcrumb>
        <Breadcrumb id="Assets">Assets</Breadcrumb>
      </Breadcrumbs>
    </nav>
  )
}
