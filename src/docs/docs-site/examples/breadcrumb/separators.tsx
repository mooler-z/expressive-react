import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumb"

export default function BreadcrumbSeparators() {
  return (
    <div className="grid gap-4">
      <nav aria-label="Slash separators">
        <Breadcrumbs separator="slash">
          <Breadcrumb id="docs">Docs</Breadcrumb>
          <Breadcrumb id="components">Components</Breadcrumb>
          <Breadcrumb id="breadcrumb">Breadcrumb</Breadcrumb>
        </Breadcrumbs>
      </nav>
      <nav aria-label="Custom separators">
        <Breadcrumbs separator={<span className="text-on-surface-variant/60">·</span>} current="plain">
          <Breadcrumb id="2026">2026</Breadcrumb>
          <Breadcrumb id="october">October</Breadcrumb>
          <Breadcrumb id="27">27</Breadcrumb>
        </Breadcrumbs>
      </nav>
    </div>
  )
}
