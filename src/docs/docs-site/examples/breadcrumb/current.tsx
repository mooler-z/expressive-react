import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumb"

export default function BreadcrumbCurrent() {
  return (
    <div className="grid gap-4">
      <nav aria-label="Tonal current page">
        <Breadcrumbs current="tonal">
          <Breadcrumb id="store">Store</Breadcrumb>
          <Breadcrumb id="audio">Audio</Breadcrumb>
          <Breadcrumb id="headphones">Headphones</Breadcrumb>
        </Breadcrumbs>
      </nav>
      <nav aria-label="Plain current page">
        <Breadcrumbs current="plain">
          <Breadcrumb id="store">Store</Breadcrumb>
          <Breadcrumb id="audio">Audio</Breadcrumb>
          <Breadcrumb id="headphones">Headphones</Breadcrumb>
        </Breadcrumbs>
      </nav>
      <nav aria-label="Small breadcrumbs">
        <Breadcrumbs size="sm">
          <Breadcrumb id="store" icon="storefront">Store</Breadcrumb>
          <Breadcrumb id="audio">Audio</Breadcrumb>
          <Breadcrumb id="headphones">Headphones</Breadcrumb>
        </Breadcrumbs>
      </nav>
    </div>
  )
}
