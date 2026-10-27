import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumb"
import { snackbar } from "@/components/ui/snackbar"

export default function BreadcrumbDemo() {
  return (
    <nav aria-label="Breadcrumb">
      <Breadcrumbs onAction={(key) => snackbar(`Go to ${key}`)}>
        <Breadcrumb id="Home" icon="home">Home</Breadcrumb>
        <Breadcrumb id="Projects">Projects</Breadcrumb>
        <Breadcrumb id="Kestrel">Kestrel</Breadcrumb>
        <Breadcrumb id="Settings">Settings</Breadcrumb>
      </Breadcrumbs>
    </nav>
  )
}
